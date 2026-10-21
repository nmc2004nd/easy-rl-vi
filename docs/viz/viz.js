/* Thư viện dùng chung cho các trang mô phỏng (docs/viz/*.html).
 * window.Viz cung cấp: định dạng số, KaTeX, màu theo giá trị, lưới ô vuông,
 * bộ phát (phát/dừng/tốc độ), biểu đồ max|ΔV| và mô hình thế giới lưới.
 * Khi trang được nhúng trong chương (iframe hoặc ?embed), trang báo chiều cao
 * cho trang cha để iframe tự giãn, và luôn dùng nền sáng cho khớp docsify.
 */
(function () {
  'use strict';

  var params = new URLSearchParams(location.search);
  var embed = params.has('embed') || window.self !== window.top;
  if (embed) {
    document.documentElement.setAttribute('data-theme', 'light');
    document.body.classList.add('embed');
  }

  // ---------- chiều cao iframe ----------
  function postHeight() {
    if (!embed || window.parent === window) return;
    var h = Math.ceil(document.body.getBoundingClientRect().height);
    window.parent.postMessage({ vizHeight: h, vizPath: location.pathname }, '*');
  }
  if (embed && window.ResizeObserver) new ResizeObserver(postHeight).observe(document.body);
  window.addEventListener('load', postHeight);

  // ---------- số và công thức ----------
  function round(x, d) { var m = Math.pow(10, d); var r = Math.round(x * m) / m; return r === 0 ? 0 : r; }
  // Hiển thị chữ: dùng dấu trừ "−" cho đẹp
  function fmt(x, d) { if (d === undefined) d = 1; return round(x, d).toFixed(d).replace('-', '−'); }
  // Trong KaTeX: số âm được đặt trong ngoặc khi cần (p)
  function tn(x, d, p) { if (d === undefined) d = 1; var s = round(x, d).toFixed(d); return p && s.charAt(0) === '-' ? '(' + s + ')' : s; }
  function tex(el, s, display) {
    if (!window.katex) { el.textContent = s; return; }
    try { katex.render(s, el, { displayMode: !!display, throwOnError: false, strict: 'ignore' }); }
    catch (e) { el.textContent = s; }
  }
  // Render mọi $...$ / $$...$$ trong phần tử (văn bản tĩnh của trang)
  function texAll(root) {
    if (!window.renderMathInElement) return;
    renderMathInElement(root || document.body, {
      delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }],
      throwOnError: false, strict: 'ignore'
    });
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  // ---------- màu ----------
  function cssVar(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
  function hex2rgb(h) {
    h = h.replace('#', ''); if (h.length === 3) h = h.replace(/./g, '$&$&');
    var n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function mix(a, b, t) {
    var x = hex2rgb(a), y = hex2rgb(b);
    return 'rgb(' + x.map(function (v, i) { return Math.round(v + (y[i] - v) * t); }).join(',') + ')';
  }
  function lum(rgb) {
    var c = rgb.match(/\d+/g).map(function (v) { v = v / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  // Thang phân kỳ: âm → cam, 0 → xám nền, dương → xanh dương. Trả về {bg, fg}.
  function valueColor(v, maxAbs) {
    var t = maxAbs > 0 ? Math.min(1, Math.abs(v) / maxAbs) : 0;
    t = Math.sqrt(t); // giá trị nhỏ vẫn thấy được màu
    var bg = mix(cssVar('--surface-2'), cssVar(v < 0 ? '--neg' : '--pos'), t * 0.92);
    return { bg: bg, fg: lum(bg) < 0.33 ? '#ffffff' : '#1d2430' };
  }
  function scaleBar(el, maxAbs, onlyNeg) {
    var neg = cssVar('--neg'), pos = cssVar('--pos'), mid = cssVar('--surface-2');
    el.innerHTML = '<span>' + (onlyNeg ? fmt(-maxAbs, 0) : fmt(-maxAbs, 1)) + '</span><span class="bar"></span><span>' + (onlyNeg ? '0' : fmt(maxAbs, 1)) + '</span>';
    el.querySelector('.bar').style.background = onlyNeg ? 'linear-gradient(90deg,' + neg + ',' + mid + ')' : 'linear-gradient(90deg,' + neg + ',' + mid + ',' + pos + ')';
  }
  var themeCbs = [];
  function onTheme(fn) { themeCbs.push(fn); }
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var cb = function () { themeCbs.forEach(function (f) { f(); }); };
    if (mq.addEventListener) mq.addEventListener('change', cb); else if (mq.addListener) mq.addListener(cb);
  }

  // ---------- lưới ô vuông ----------
  var ARW = ['↑', '→', '↓', '←']; // lên, phải, xuống, trái
  var ARC = ['u', 'r', 'd', 'l'];
  function GridView(container, rows, cols, opt) {
    opt = opt || {};
    var g = document.createElement('div');
    g.className = 'grid' + (opt.dense ? ' dense' : '');
    g.style.gridTemplateColumns = 'repeat(' + cols + ', minmax(0, 1fr))';
    var cells = [];
    for (var i = 0; i < rows * cols; i++) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'cell'; b.dataset.i = i;
      b.innerHTML = '<span class="id"></span><span class="v"></span><span class="rw"></span>' +
        ARC.map(function (c, a) { return '<span class="ar ' + c + '">' + ARW[a] + '</span>'; }).join('');
      g.appendChild(b); cells.push(b);
    }
    container.appendChild(g);
    if (opt.onClick) g.addEventListener('click', function (e) {
      var c = e.target.closest('.cell'); if (c) opt.onClick(+c.dataset.i, e);
    });
    return {
      el: g, cells: cells,
      // d: { v, id, rw, bg, fg, arrows: [pu, pr, pd, pl] | null, aria }
      set: function (i, d) {
        var c = cells[i], q = c.children;
        if (d.id !== undefined) q[0].textContent = d.id;
        if (d.v !== undefined) q[1].textContent = d.v;
        if (d.rw !== undefined) q[2].textContent = d.rw;
        c.style.background = d.bg || '';
        c.style.color = d.fg || '';
        var mx = d.arrows ? Math.max.apply(null, d.arrows) : 0;
        for (var a = 0; a < 4; a++) q[3 + a].style.opacity = d.arrows && d.arrows[a] > 1e-9 ? String(0.35 + 0.65 * d.arrows[a] / mx) : '0';
        if (d.aria) c.setAttribute('aria-label', d.aria);
      },
      cls: function (i, name, on) { cells[i].classList.toggle(name, !!on); },
      clear: function (name) { cells.forEach(function (c) { c.classList.remove(name); }); },
      flash: function (i) { var c = cells[i]; c.classList.remove('chg'); void c.offsetWidth; c.classList.add('chg'); }
    };
  }

  // ---------- bộ phát ----------
  var DELAYS = [1100, 600, 300, 120, 30];
  function Player(o) {
    // o: { btn, speed (input range 1..5), step: () => false để dừng, onStop }
    var timer = null;
    function delay() { return DELAYS[(+o.speed.value || 3) - 1]; }
    function label() { o.btn.textContent = timer ? '❚❚ Tạm dừng' : '▶ Phát'; o.btn.setAttribute('aria-pressed', timer ? 'true' : 'false'); }
    function tick() {
      timer = null;
      var more = o.step();
      if (more === false) { label(); if (o.onStop) o.onStop(); return; }
      timer = setTimeout(tick, delay()); label();
    }
    var self = {
      play: function () { if (timer) return; timer = setTimeout(tick, 0); label(); },
      stop: function () { if (timer) clearTimeout(timer); timer = null; label(); },
      toggle: function () { if (timer) self.stop(); else self.play(); },
      playing: function () { return !!timer; }
    };
    o.btn.addEventListener('click', self.toggle);
    label();
    return self;
  }

  // ---------- biểu đồ max|ΔV| (thang log) ----------
  function DeltaChart(container, opt) {
    opt = opt || {};
    var W = 480, H = 150, m = { l: 44, r: 12, t: 10, b: 24 };
    var pts = [];
    var wrap = document.createElement('div'); wrap.className = 'chart';
    var tip = document.createElement('div'); tip.className = 'tip';
    container.appendChild(wrap);
    function draw() {
      var n = pts.length, kmax = Math.max(10, n ? pts[n - 1].k : 0);
      var lo = -4, hi = 1;
      pts.forEach(function (p) { if (p.d > 0) { lo = Math.min(lo, Math.floor(Math.log10(p.d))); hi = Math.max(hi, Math.ceil(Math.log10(p.d))); } });
      lo = Math.max(lo, -8);
      var x = function (k) { return m.l + (W - m.l - m.r) * k / kmax; };
      var y = function (d) { var l = d > 0 ? Math.max(lo, Math.log10(d)) : lo; return m.t + (H - m.t - m.b) * (hi - l) / (hi - lo); };
      var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (opt.aria || 'max |ΔV| theo vòng lặp') + '"><g class="gl">';
      var step = Math.max(1, Math.ceil((hi - lo) / 4));
      for (var e = hi; e >= lo; e -= step) {
        s += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(Math.pow(10, e)) + '" y2="' + y(Math.pow(10, e)) + '"/>';
      }
      s += '</g>';
      for (e = hi; e >= lo; e -= step) s += '<text x="' + (m.l - 6) + '" y="' + (y(Math.pow(10, e)) + 4) + '" text-anchor="end">1e' + e + '</text>';
      var kstep = kmax <= 10 ? 2 : kmax <= 40 ? 10 : kmax <= 200 ? 50 : 200;
      for (var k = 0; k <= kmax; k += kstep) s += '<text x="' + x(k) + '" y="' + (H - 6) + '" text-anchor="middle">' + k + '</text>';
      if (n) {
        var path = pts.map(function (p, i) { return (i ? 'L' : 'M') + x(p.k).toFixed(1) + ',' + y(p.d).toFixed(1); }).join('');
        s += '<path d="' + path + '" fill="none" stroke="' + cssVar('--s1') + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>';
        var last = pts[n - 1];
        s += '<circle cx="' + x(last.k) + '" cy="' + y(last.d) + '" r="4" fill="' + cssVar('--s1') + '" stroke="' + cssVar('--surface') + '" stroke-width="2"/>';
      }
      if (opt.theta) s += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(opt.theta) + '" y2="' + y(opt.theta) + '" stroke="' + cssVar('--muted') + '" stroke-dasharray="4 4"/>' +
        '<text x="' + (W - m.r) + '" y="' + (y(opt.theta) - 4) + '" text-anchor="end">θ = ' + opt.theta + '</text>';
      s += '<rect class="hit" x="' + m.l + '" y="0" width="' + (W - m.l - m.r) + '" height="' + H + '" fill="transparent"/></svg>';
      wrap.innerHTML = s; wrap.appendChild(tip);
      var svg = wrap.querySelector('svg');
      svg.addEventListener('mousemove', function (ev) {
        if (!pts.length) return;
        var r = svg.getBoundingClientRect(), px = (ev.clientX - r.left) * W / r.width;
        var kk = Math.round((px - m.l) / (W - m.l - m.r) * kmax), best = pts[0];
        pts.forEach(function (p) { if (Math.abs(p.k - kk) < Math.abs(best.k - kk)) best = p; });
        tip.style.display = 'block';
        tip.innerHTML = 'vòng ' + best.k + ': max|ΔV| = <b>' + (best.d === 0 ? '0' : best.d < 1e-3 ? best.d.toExponential(1) : best.d.toFixed(3)) + '</b>';
        var tx = x(best.k) * r.width / W, ty = y(best.d) * r.height / H;
        tip.style.left = Math.min(r.width - tip.offsetWidth, Math.max(0, tx - tip.offsetWidth / 2)) + 'px';
        tip.style.top = Math.max(0, ty - 34) + 'px';
      });
      svg.addEventListener('mouseleave', function () { tip.style.display = 'none'; });
    }
    draw();
    onTheme(draw);
    return {
      push: function (k, d) { pts.push({ k: k, d: d }); draw(); },
      reset: function () { pts = []; draw(); },
      redraw: draw
    };
  }

  // ---------- mô hình thế giới lưới ----------
  // Ô terminal: một hành động "thoát" nhận R(s) rồi kết thúc, nên V(s) = R(s).
  // Ô thường: R(s, a) = R(s) với mọi a; đi ra biên hoặc vào tường thì đứng yên.
  // slip: xác suất trượt, chia đều cho hai hướng vuông góc.
  var DR = [-1, 0, 1, 0], DC = [0, 1, 0, -1];
  function GridMDP(o) {
    this.rows = o.rows; this.cols = o.cols;
    this.n = o.rows * o.cols;
    this.wall = o.wall || {}; this.term = o.term || {};
    this.R = o.R || new Array(this.n).fill(0);
    this.slip = o.slip || 0;
  }
  GridMDP.prototype.move = function (s, a) {
    var r = Math.floor(s / this.cols) + DR[a], c = s % this.cols + DC[a];
    if (r < 0 || c < 0 || r >= this.rows || c >= this.cols) return s;
    var t = r * this.cols + c;
    return this.wall[t] ? s : t;
  };
  GridMDP.prototype.trans = function (s, a) {
    var out = {}, add = function (t, p) { if (p > 0) out[t] = (out[t] || 0) + p; };
    add(this.move(s, a), 1 - this.slip);
    add(this.move(s, (a + 1) % 4), this.slip / 2);
    add(this.move(s, (a + 3) % 4), this.slip / 2);
    return Object.keys(out).map(function (t) { return [+t, out[t]]; });
  };
  GridMDP.prototype.active = function (s) { return !this.wall[s] && !this.term[s]; };
  GridMDP.prototype.q = function (V, s, a, gamma) {
    var sum = 0; this.trans(s, a).forEach(function (tp) { sum += tp[1] * V[tp[0]]; });
    return this.R[s] + gamma * sum;
  };
  GridMDP.prototype.qs = function (V, s, gamma) { var q = []; for (var a = 0; a < 4; a++) q.push(this.q(V, s, a, gamma)); return q; };
  // Chính sách tham lam theo Q: chia đều xác suất cho các hành động hòa nhau
  function greedy(q, eps) {
    eps = eps || 1e-9;
    var mx = Math.max.apply(null, q), best = q.map(function (v) { return v >= mx - eps ? 1 : 0; });
    var k = best.reduce(function (a, b) { return a + b; }, 0);
    return best.map(function (b) { return b / k; });
  }
  function samePolicy(p, q) { for (var a = 0; a < 4; a++) if ((p[a] > 0) !== (q[a] > 0)) return false; return true; }

  // ---------- đại số tuyến tính nhỏ: giải Ax = b ----------
  function solve(A, b) {
    var n = b.length, M = A.map(function (r, i) { return r.slice().concat([b[i]]); });
    for (var c = 0; c < n; c++) {
      var p = c; for (var r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
      var t = M[c]; M[c] = M[p]; M[p] = t;
      for (r = 0; r < n; r++) if (r !== c) {
        var f = M[r][c] / M[c][c];
        for (var k = c; k <= n; k++) M[r][k] -= f * M[c][k];
      }
    }
    return M.map(function (r, i) { return r[n] / r[i]; });
  }

  window.Viz = {
    embed: embed, postHeight: postHeight,
    round: round, fmt: fmt, tn: tn, tex: tex, texAll: texAll, $: $, $$: $$,
    cssVar: cssVar, mix: mix, valueColor: valueColor, scaleBar: scaleBar, onTheme: onTheme,
    ARW: ARW, GridView: GridView, Player: Player, DeltaChart: DeltaChart,
    GridMDP: GridMDP, greedy: greedy, samePolicy: samePolicy, solve: solve
  };
})();
