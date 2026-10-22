/* Thư viện dùng chung cho các trang mô phỏng (docs/viz/*.html).
 * window.Viz cung cấp: định dạng số, KaTeX, màu theo giá trị, lưới ô vuông,
 * bộ phát (phát/dừng/tốc độ), biểu đồ Δ_k, mô hình thế giới lưới,
 * lưới Q (4 tam giác mỗi ô), biểu đồ đường nhiều chuỗi, mã giả có tô sáng
 * dòng đang chạy và bản đồ |ΔV(s)| của một vòng quét.
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
  // Như tn nhưng bỏ số 0 thừa ở cuối: 1.500 → 1.5, −1.000 → −1
  function tz(x, d, p) { var s = tn(x, d, p); return s.indexOf('.') < 0 ? s : s.replace(/0+(\)?)$/, '$1').replace(/\.(\)?)$/, '$1'); }
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

  // ---------- Δ_k = max_s |V_k(s) − V_{k−1}(s)| ----------
  // Số Δ trong KaTeX: số rất nhỏ viết dạng a × 10^b
  function dtex(d) {
    if (d == null) return '\\text{–}';
    if (d === 0) return '0';
    if (d < 1e-3) {
      var e = Math.floor(Math.log10(d)), m = d / Math.pow(10, e);
      if (m >= 9.95) { m = 1; e++; }
      return m.toFixed(1) + '\\times 10^{' + e + '}';
    }
    return String(round(d, 3));
  }
  // Ngưỡng θ: 1e-4 → 10^{-4}
  function ttex(t) { var e = Math.round(Math.log10(t)); return Math.abs(Math.pow(10, e) - t) < 1e-15 ? '10^{' + e + '}' : String(t); }
  // Số chữ số thập phân đủ để thấy hiệu hai giá trị có độ lớn d
  function ddec(d) { return d >= 1e-3 || d === 0 ? 3 : Math.min(9, 2 - Math.floor(Math.log10(d))); }
  // Giải thích Δ_k của một vòng quét. o: { k, Vn, Vo (tên bảng), s (tên ô), vNew, vOld, d, theta, stop, cont }
  function deltaTex(o) {
    var dc = ddec(o.d);
    var L = '\\Delta_{' + o.k + '}&=\\max_s\\big\\lvert ' + o.Vn + '(s)-' + o.Vo + '(s)\\big\\rvert' +
      '\\\\&=\\big\\lvert ' + o.Vn + '(' + o.s + ')-' + o.Vo + '(' + o.s + ')\\big\\rvert' +
      '=\\big\\lvert ' + tz(o.vNew, dc) + '-' + tz(o.vOld, dc, true) + '\\big\\rvert=' + dtex(o.d);
    if (o.theta != null) {
      var stop = o.d < o.theta;
      L += '\\\\[3pt]&\\Rightarrow\\ ' + dtex(o.d) + (stop ? '<' : '\\ge') + '\\theta=' + ttex(o.theta) +
        '\\ \\text{ nên ' + (stop ? (o.stop || 'dừng') : (o.cont || 'quét tiếp')) + '}';
    }
    return '\\begin{aligned}' + L + '\\end{aligned}';
  }

  // ---------- mã giả, tô sáng dòng đang chạy ----------
  // lines: [[id, mức thụt lề, nội dung (có thể chứa $...$)], ...]; nhiều dòng có thể cùng id
  function Pseudo(container, opt) {
    var d = document.createElement('details');
    d.className = 'pseudo'; d.open = opt.open !== false;
    d.innerHTML = '<summary>📜 Mã giả' + (opt.title ? ': ' + opt.title : '') + '</summary><ol>' +
      opt.lines.map(function (l) { return '<li data-id="' + l[0] + '" style="--ind:' + l[1] + '">' + l[2] + '</li>'; }).join('') + '</ol>' +
      (opt.note ? '<p class="note">' + opt.note + '</p>' : '');
    container.appendChild(d);
    texAll(d);
    d.addEventListener('toggle', postHeight);
    var lis = $$('li', d);
    // Dải "dòng đang chạy" đặt ngay trên lưới: chép các dòng đang tô sáng lên đó
    // để vừa nhìn hoạt ảnh vừa đọc được thuật toán. opt.strip: khung chứa dải;
    // opt.stripKeep: giữ các dải cũ (trang có hai mã giả cạnh nhau).
    var row = null;
    if (opt.strip) {
      if (!opt.stripKeep) opt.strip.innerHTML = '';
      row = document.createElement('button');
      row.type = 'button'; row.className = 'ps-row';
      row.title = 'Xem toàn bộ mã giả';
      opt.strip.appendChild(row);
      row.addEventListener('click', function () { d.open = true; d.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); });
    }
    function strip(on) {
      if (!row) return;
      var nums = on.map(function (i) { return i + 1; }), lab;
      if (!nums.length) lab = '';
      else if (nums[nums.length - 1] - nums[0] === nums.length - 1) lab = nums.length > 1 ? nums[0] + '–' + nums[nums.length - 1] : String(nums[0]);
      else lab = nums.join(', ');
      row.innerHTML = '<span class="ps-lab">' + (opt.label ? opt.label + ' · ' : '') + (lab ? 'dòng ' + lab : 'mã giả') + '</span>' +
        '<span class="ps-lines">' + on.map(function (i) { return '<span class="ps-line">' + lis[i].innerHTML + '</span>'; }).join('') + '</span>';
    }
    strip([]);
    return {
      el: d,
      hl: function (ids) {
        ids = ids == null ? [] : [].concat(ids);
        var on = [];
        lis.forEach(function (li, i) { var x = ids.indexOf(li.dataset.id) >= 0; li.classList.toggle('on', x); if (x) on.push(i); });
        strip(on);
      }
    };
  }

  // ---------- bản đồ |ΔV(s)| của một vòng quét ----------
  function DeltaMap(container, rows, cols) {
    var g = document.createElement('div');
    g.className = 'dmap';
    g.style.gridTemplateColumns = 'repeat(' + cols + ', minmax(0, 1fr))';
    g.style.maxWidth = Math.min(320, cols * 44) + 'px';
    var cells = [];
    for (var i = 0; i < rows * cols; i++) { var c = document.createElement('span'); g.appendChild(c); cells.push(c); }
    container.appendChild(g);
    return {
      // vals[s]: số | null (ô không cập nhật: tường, kết thúc) | undefined (chưa tính trong vòng này)
      set: function (vals, arg, dec) {
        var mx = 0;
        vals.forEach(function (v) { if (v != null) mx = Math.max(mx, v); });
        cells.forEach(function (c, s) {
          var v = vals[s];
          c.className = (v === null ? 'x' : v === undefined ? 'pend' : '') + (s === arg ? ' arg' : '');
          if (v == null) { c.textContent = v === null ? '' : '·'; c.style.background = ''; c.style.color = ''; return; }
          var t = mx > 0 ? Math.sqrt(v / mx) : 0, bg = mix(cssVar('--surface-2'), cssVar('--s2'), t * 0.9);
          c.style.background = bg; c.style.color = lum(bg) < 0.33 ? '#ffffff' : '#1d2430';
          c.textContent = v === 0 ? '0' : v < 0.005 ? '≈0' : fmt(v, dec == null ? 2 : dec);
        });
      }
    };
  }

  // ---------- biểu đồ Δ_k (thang log) ----------
  function supNum(e) { return String(e).replace(/./g, function (ch) { return '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'.charAt('-0123456789'.indexOf(ch)); }); }
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
      var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (opt.aria || 'Δ_k theo vòng lặp') + '"><g class="gl">';
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
        '<text x="' + (W - m.r) + '" y="' + (y(opt.theta) - 4) + '" text-anchor="end">θ = 10' + supNum(Math.round(Math.log10(opt.theta))) + '</text>';
      s += '<rect class="hit" x="' + m.l + '" y="0" width="' + (W - m.l - m.r) + '" height="' + H + '" fill="transparent"/></svg>';
      wrap.innerHTML = s; wrap.appendChild(tip);
      var svg = wrap.querySelector('svg');
      svg.addEventListener('mousemove', function (ev) {
        if (!pts.length) return;
        var r = svg.getBoundingClientRect(), px = (ev.clientX - r.left) * W / r.width;
        var kk = Math.round((px - m.l) / (W - m.l - m.r) * kmax), best = pts[0];
        pts.forEach(function (p) { if (Math.abs(p.k - kk) < Math.abs(best.k - kk)) best = p; });
        tip.style.display = 'block';
        tex(tip, '\\Delta_{' + best.k + '}=' + dtex(best.d));
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


  // ---------- lưới Q: mỗi ô chia 4 tam giác Q(s,a) (lên, phải, xuống, trái) ----------
  // kinds[s]: '' | 'wall' | 'cliff' | 'term'; labels[s]: chữ nhỏ ở góc (S, G, +1…)
  var SVGNS = 'http://www.w3.org/2000/svg';
  function QGrid(container, rows, cols, opt) {
    opt = opt || {};
    var C = 40, W = cols * C, H = rows * C;
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.setAttribute('class', 'qgrid');
    svg.setAttribute('role', 'img');
    if (opt.aria) svg.setAttribute('aria-label', opt.aria);
    container.appendChild(svg);
    var cells = [];
    function el(tag, attrs, parent) {
      var e = document.createElementNS(SVGNS, tag);
      for (var k in attrs) e.setAttribute(k, attrs[k]);
      (parent || svg).appendChild(e); return e;
    }
    for (var s = 0; s < rows * cols; s++) {
      var x = (s % cols) * C, y = Math.floor(s / cols) * C, cx = x + C / 2, cy = y + C / 2;
      var g = el('g', { 'data-s': s, class: 'qc' });
      var bg = el('rect', { x: x + 1, y: y + 1, width: C - 2, height: C - 2, rx: 3 }, g);
      var pts = [[x + 1, y + 1, x + C - 1, y + 1], [x + C - 1, y + 1, x + C - 1, y + C - 1], [x + C - 1, y + C - 1, x + 1, y + C - 1], [x + 1, y + C - 1, x + 1, y + 1]];
      var tris = pts.map(function (p) { return el('polygon', { points: p[0] + ',' + p[1] + ' ' + p[2] + ',' + p[3] + ' ' + cx + ',' + cy, class: 'tri' }, g); });
      var nums = [[cx, y + 9], [x + C - 8.5, cy + 2], [cx, y + C - 4], [x + 8.5, cy + 2]].map(function (p) { return el('text', { x: p[0], y: p[1], class: 'qn', 'text-anchor': 'middle' }, g); });
      var arrow = el('path', { class: 'qa', d: '' }, g);
      var lab = el('text', { x: x + 3, y: y + 8.5, class: 'ql' }, g);
      var dot = el('circle', { cx: cx, cy: cy, r: 7.5, class: 'qagent' }, g);
      cells.push({ g: g, bg: bg, tris: tris, nums: nums, arrow: arrow, lab: lab, dot: dot, x: x, y: y, cx: cx, cy: cy });
    }
    var hl = el('polygon', { class: 'qhl', points: '' });
    if (opt.onClick) svg.addEventListener('click', function (e) {
      var g = e.target.closest('g.qc'); if (g) opt.onClick(+g.getAttribute('data-s'));
    });
    var AD = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    return {
      svg: svg,
      // d: { kind, q: [4], maxAbs, label, nums: bool, arrow: bool (mũi tên argmax), dir (một mũi tên cố định), value (cho ô kết thúc) }
      set: function (s, d) {
        var c = cells[s], kind = d.kind || '';
        c.g.setAttribute('class', 'qc ' + kind);
        c.lab.textContent = d.label || '';
        var plain = kind === 'wall' || kind === 'cliff' || kind === 'term' || !d.q;
        c.bg.style.fill = kind === 'term' && d.value != null ? valueColor(d.value, d.maxAbs || 1).bg : '';
        c.tris.forEach(function (t, a) {
          t.style.display = plain ? 'none' : '';
          if (!plain) t.style.fill = valueColor(d.q[a], d.maxAbs || 1).bg;
        });
        c.nums.forEach(function (t, a) {
          var show = !plain && d.nums;
          t.textContent = show ? fmt(d.q[a], d.dec === 'auto' ? (Math.abs(d.q[a]) >= 9.95 ? 0 : 1) : d.dec == null ? 1 : d.dec) : '';
          if (show) t.style.fill = valueColor(d.q[a], d.maxAbs || 1).fg;
        });
        var ad = '';
        if (!plain && (d.arrow || d.dir != null)) {
          var mx = Math.max.apply(null, d.q), best = [];
          if (d.dir != null) best = [d.dir];
          else for (var a = 0; a < 4; a++) if (d.q[a] >= mx - 1e-9) best.push(a);
          if (best.length < 4) best.forEach(function (a) {
            var dx = AD[a][0], dy = AD[a][1], L = d.nums ? 7 : 11, ex = c.cx + dx * L, ey = c.cy + dy * L;
            ad += 'M' + c.cx + ' ' + c.cy + 'L' + ex + ' ' + ey + 'M' + (ex - dx * 4 - dy * 3.5) + ' ' + (ey - dy * 4 - dx * 3.5) + 'L' + ex + ' ' + ey + 'L' + (ex - dx * 4 + dy * 3.5) + ' ' + (ey - dy * 4 + dx * 3.5);
          });
        }
        c.arrow.setAttribute('d', ad);
        if (d.aria) c.g.setAttribute('aria-label', d.aria);
      },
      agent: function (s) { cells.forEach(function (c, i) { c.dot.style.display = i === s ? 'block' : 'none'; }); },
      // tô viền tam giác (s, a) vừa được cập nhật; a = -1 → tô cả ô
      mark: function (s, a) {
        if (s == null) { hl.setAttribute('points', ''); return; }
        var c = cells[s];
        if (a < 0) { hl.setAttribute('points', [c.x + 1, c.y + 1, c.x + C - 1, c.y + 1, c.x + C - 1, c.y + C - 1, c.x + 1, c.y + C - 1].join(' ').replace(/(\S+) (\S+)/g, '$1,$2')); return; }
        hl.setAttribute('points', c.tris[a].getAttribute('points'));
      },
      cls: function (s, name, on) { cells[s].g.classList.toggle(name, !!on); },
      clear: function (name) { cells.forEach(function (c) { c.g.classList.remove(name); }); }
    };
  }

  // ---------- biểu đồ đường nhiều chuỗi, tự co giãn trục y, có đường dọc theo chuột ----------
  function LineChart(container, opt) {
    opt = opt || {};
    var W = 480, H = opt.height || 190, m = { l: 48, r: 12, t: 10, b: 38 };
    var wrap = document.createElement('div'); wrap.className = 'chart';
    container.appendChild(wrap);
    var data = [], xs = null;
    var lastW = 0;
    window.addEventListener('resize', function () { if (wrap.clientWidth && Math.abs(wrap.clientWidth - lastW) > 20) draw(); });
    function draw() {
      // chiều rộng viewBox theo khung chứa để chữ không bị phóng to
      lastW = wrap.clientWidth; W = Math.max(300, lastW || 480);
      var n = 0, lo = Infinity, hi = -Infinity;
      data.forEach(function (v) { n = Math.max(n, v.length); v.forEach(function (y) { if (y != null && isFinite(y)) { lo = Math.min(lo, y); hi = Math.max(hi, y); } }); });
      if (opt.yMin != null) lo = opt.yMin; if (opt.yMax != null) hi = opt.yMax;
      if (!isFinite(lo)) { lo = 0; hi = 1; }
      if (hi - lo < 1e-9) { hi = lo + 1; }
      var span = hi - lo, stepY = Math.pow(10, Math.floor(Math.log10(span / 4)));
      [1, 2, 2.5, 5, 10].some(function (f) { if (span / (stepY * f) <= 5) { stepY *= f; return true; } });
      lo = Math.floor(lo / stepY) * stepY; hi = Math.ceil(hi / stepY) * stepY;
      var nx = Math.max(2, n);
      var x = function (i) { return m.l + (W - m.l - m.r) * i / (nx - 1); };
      var y = function (v) { return m.t + (H - m.t - m.b) * (hi - v) / (hi - lo); };
      var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (opt.aria || '') + '"><g class="gl">';
      for (var t = lo; t <= hi + 1e-9; t += stepY) s += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(t) + '" y2="' + y(t) + '"/>';
      s += '</g>';
      var dec = stepY < 1 ? Math.min(3, Math.ceil(-Math.log10(stepY) - 1e-9)) : 0;
      for (t = lo; t <= hi + 1e-9; t += stepY) s += '<text x="' + (m.l - 6) + '" y="' + (y(t) + 4) + '" text-anchor="end">' + fmt(t, dec) + '</text>';
      var xl = function (i) { return xs ? xs[i] : i + 1; };
      if (n) {
        var ticks = xs ? xs.map(function (_, i) { return i; }) : [0, n - 1];
        ticks.forEach(function (i) { s += '<text x="' + x(i) + '" y="' + (H - m.b + 15) + '" text-anchor="' + (xs ? 'middle' : i ? 'end' : 'start') + '">' + xl(i) + '</text>'; });
      }
      if (opt.xLabel) s += '<text x="' + ((m.l + W - m.r) / 2) + '" y="' + (H - 1) + '" text-anchor="middle">' + opt.xLabel + '</text>';
      (opt.refs || []).forEach(function (r) {
        s += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(r.y) + '" y2="' + y(r.y) + '" stroke="' + cssVar('--muted') + '" stroke-dasharray="4 4"/>' +
             '<text x="' + (W - m.r) + '" y="' + (y(r.y) - 4) + '" text-anchor="end">' + r.label + '</text>';
      });
      data.forEach(function (v, k) {
        var col = cssVar(opt.series[k].color), d = '', pen = false;
        v.forEach(function (yv, i) { if (yv == null) { pen = false; return; } d += (pen ? 'L' : 'M') + x(i).toFixed(1) + ',' + y(Math.max(lo, Math.min(hi, yv))).toFixed(1); pen = true; });
        s += '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>';
        if (opt.dots || v.length <= 12) v.forEach(function (yv, i) { if (yv != null) s += '<circle cx="' + x(i) + '" cy="' + y(Math.max(lo, Math.min(hi, yv))) + '" r="3.5" fill="' + col + '" stroke="' + cssVar('--surface') + '" stroke-width="1.5"/>'; });
      });
      s += '<line class="xh" y1="' + m.t + '" y2="' + (H - m.b) + '" stroke="' + cssVar('--muted') + '" style="display:none"/>';
      s += '<rect class="hit" x="' + m.l + '" y="0" width="' + (W - m.l - m.r) + '" height="' + H + '" fill="transparent"/></svg><div class="tip"></div>';
      wrap.innerHTML = s;
      var svg = wrap.querySelector('svg'), tip = wrap.querySelector('.tip'), xh = svg.querySelector('.xh');
      function show(ev) {
        if (!n) return;
        var r = svg.getBoundingClientRect(), px = (ev.clientX - r.left) * W / r.width;
        var i = Math.max(0, Math.min(n - 1, Math.round((px - m.l) / (W - m.l - m.r) * (nx - 1))));
        xh.setAttribute('x1', x(i)); xh.setAttribute('x2', x(i)); xh.style.display = '';
        tip.innerHTML = (opt.xName || '') + ' ' + xl(i) + data.map(function (v, k) {
          return v[i] == null ? '' : '<br><span class="sw dot" style="background:' + cssVar(opt.series[k].color) + '"></span> ' + opt.series[k].name + ': <b>' + fmt(v[i], opt.dec == null ? 1 : opt.dec) + '</b>';
        }).join('');
        tip.style.display = 'block';
        var tx = x(i) * r.width / W + 12;
        if (tx + tip.offsetWidth > r.width) tx -= tip.offsetWidth + 24;
        tip.style.left = Math.max(0, tx) + 'px'; tip.style.top = '0px';
      }
      svg.addEventListener('pointermove', show); svg.addEventListener('pointerdown', show);
      svg.addEventListener('pointerleave', function () { tip.style.display = 'none'; xh.style.display = 'none'; });
    }
    draw(); onTheme(draw);
    return {
      set: function (series, xLabels) { data = series; xs = xLabels || null; draw(); },
      redraw: draw
    };
  }

  // số ngẫu nhiên có hạt giống (để kết quả lặp lại được)
  function seeded(seed) {
    var st = seed >>> 0;
    return function () { st = (st + 0x6D2B79F5) >>> 0; var t = st; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }

  window.Viz = {
    embed: embed, postHeight: postHeight,
    round: round, fmt: fmt, tn: tn, tz: tz, tex: tex, texAll: texAll, $: $, $$: $$,
    cssVar: cssVar, mix: mix, valueColor: valueColor, scaleBar: scaleBar, onTheme: onTheme,
    ARW: ARW, GridView: GridView, Player: Player, DeltaChart: DeltaChart,
    GridMDP: GridMDP, greedy: greedy, samePolicy: samePolicy, solve: solve,
    QGrid: QGrid, LineChart: LineChart, seeded: seeded,
    dtex: dtex, ttex: ttex, ddec: ddec, deltaTex: deltaTex, Pseudo: Pseudo, DeltaMap: DeltaMap
  };
})();
