/* Thí nghiệm tương tác và sơ đồ trực quan cho chương 4 (gradient chính sách).
 * Trang index.html tải file này khi ch4.json có "extras": "ch4-extras.js".
 * File đăng ký window.ReviewExtras = { tabs: [{ id, label, render(el, ctx) }] }.
 */
(function () {
  'use strict';

  // ---------- CSS ----------
  var css = String.raw`
  .rx { --s1:#2a78d6; --s2:#eb6834; --gray:#8a94a3; }
  @media (prefers-color-scheme: dark) {
    :root:where(:not([data-theme="light"])) .rx { --s1:#3987e5; --s2:#d95926; }
  }
  :root[data-theme="dark"] .rx { --s1:#3987e5; --s2:#d95926; }
  .rx section.blk { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; box-shadow: var(--shadow); padding: 20px; margin-bottom: 16px; }
  .rx h2 { margin: 0 0 4px; font-size: 1.1rem; }
  .rx h3.sub { margin: 18px 0 4px; font-size: .98rem; }
  .rx .lead { color: var(--muted); margin: 0 0 12px; font-size: .93rem; }
  .rx .ctrl { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 12px; margin: 10px 0; }
  .rx .ctrl label { font-weight: 600; font-size: .92rem; }
  .rx input[type=range] { flex: 1; min-width: 130px; accent-color: var(--s1); }
  .rx input[type=number] { width: 4.5em; font: inherit; padding: 4px 6px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); color: var(--text); }
  .rx .val { font-variant-numeric: tabular-nums; font-weight: 700; min-width: 3em; }
  .rx .rxs { font-size: .88rem; color: var(--muted); font-variant-numeric: tabular-nums; }
  .rx .rxs b { color: var(--text); }
  .rx .legend { display: flex; flex-wrap: wrap; gap: 6px 16px; font-size: .85rem; margin: 6px 0 4px; }
  .rx .legend .li { display: inline-flex; align-items: center; gap: 6px; }
  .rx .sw { width: 12px; height: 3px; border-radius: 2px; display: inline-block; flex: none; }
  .rx .sw.dot { width: 9px; height: 9px; border-radius: 50%; }
  .rx .sw.box { height: 10px; border-radius: 3px; }
  .rx .chart { position: relative; width: 100%; }
  .rx .chart svg { display: block; width: 100%; overflow: visible; }
  .rx .chart text { fill: var(--muted); font-size: 11px; font-family: inherit; }
  .rx .grid line { stroke: var(--border); stroke-width: 1; }
  .rx .tip { position: absolute; pointer-events: none; background: var(--surface); border: 1px solid var(--border); border-radius: 8px;
             box-shadow: var(--shadow); padding: 6px 10px; font-size: .8rem; white-space: nowrap; display: none; z-index: 2; }
  .rx .insight { background: var(--accent-soft); border-radius: 12px; padding: 10px 14px; font-size: .92rem; margin-top: 10px; }
  .rx .calc { background: var(--surface-2); border-radius: 12px; padding: 8px 12px; font-size: .9rem; margin-top: 10px; overflow-x: auto; min-height: 3em; }
  .rx .calc .katex-display { margin: .3em 0; text-align: left; }
  .rx .calc .katex-display > .katex { text-align: left; }
  .rx .seg { display: inline-flex; background: var(--surface-2); border-radius: 10px; padding: 3px; gap: 3px; flex-wrap: wrap; }
  .rx .seg button { border: 0; background: transparent; color: var(--muted); font: inherit; font-weight: 600; font-size: .86rem; padding: 6px 12px; border-radius: 8px; cursor: pointer; }
  .rx .seg button[aria-pressed=true] { background: var(--surface); color: var(--text); box-shadow: var(--shadow); }
  /* cột xác suất */
  .rx .bars { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; max-width: 460px; margin: 12px auto 4px; }
  .rx .bar { text-align: center; }
  .rx .bar .track { height: 130px; background: var(--surface-2); border-radius: 10px; position: relative; overflow: hidden; }
  .rx .bar .fill { position: absolute; left: 0; right: 0; bottom: 0; background: var(--s1); border-radius: 4px 4px 0 0; transition: height .35s; }
  .rx .bar .ghost { position: absolute; left: 0; right: 0; border-top: 2px dashed var(--muted); transition: bottom .35s; }
  .rx .bar .pv { font-weight: 700; font-variant-numeric: tabular-nums; margin-top: 4px; }
  .rx .bar .dv { font-size: .8rem; font-variant-numeric: tabular-nums; min-height: 1.2em; }
  .rx .bar .dv.up { color: var(--accent-text); }
  .rx .bar .dv.down { color: var(--s2); }
  .rx .bar .nm { font-size: .82rem; color: var(--muted); }
  .rx .bar.picked .track { box-shadow: inset 0 0 0 2px var(--s2); }
  .rx .smp { display: flex; flex-wrap: wrap; gap: 4px; justify-content: center; min-height: 1.6em; margin-top: 4px; }
  .rx .smp span { font-size: .78rem; font-weight: 700; border-radius: 6px; padding: 1px 7px; background: var(--surface-2); }
  /* bảng gán điểm */
  .rx table.cmp { width: 100%; border-collapse: collapse; font-size: .88rem; }
  .rx table.cmp th, .rx table.cmp td { padding: 7px 6px; border-bottom: 1px solid var(--border); text-align: center; vertical-align: middle; }
  .rx table.cmp th:first-child, .rx table.cmp td:first-child { text-align: left; }
  .rx table.cmp tbody tr { cursor: pointer; }
  .rx table.cmp tbody tr.sel td { background: var(--surface-2); }
  .rx .wv { font-weight: 700; font-variant-numeric: tabular-nums; }
  .rx .wv.pos { color: var(--accent-text); }
  .rx .wv.neg { color: var(--s2); }
  .rx .wv small { display: block; font-weight: 500; font-size: .72rem; color: var(--muted); }
  .rx .tscroll { overflow-x: auto; }
  /* hành lang ngắn */
  .rx .corr { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; max-width: 460px; margin: 10px auto; }
  .rx .corr .c { border: 2px solid var(--border); border-radius: 12px; padding: 8px 4px; text-align: center; font-weight: 700; background: var(--surface); position: relative; transition: background .2s, border-color .2s; }
  .rx .corr .c small { display: block; font-weight: 500; font-size: .72rem; color: var(--muted); }
  .rx .corr .c.rev { border-style: dashed; }
  .rx .corr .c.goal { background: var(--accent-soft); }
  .rx .corr .c.on { border-color: var(--hl, #c98a12); background: var(--hl-soft, #fbf1dc); }
  /* sơ đồ */
  .rx .steps3 { display: flex; flex-wrap: wrap; gap: 6px; margin: 8px 0; }
  .rx .lanes { display: grid; gap: 12px; }
  .rx .lane { border: 1px solid var(--border); border-radius: 12px; padding: 12px; }
  .rx .lane .lt { font-weight: 700; margin-bottom: 4px; }
  .rx .lane .lt span { font-weight: 500; color: var(--muted); font-size: .85rem; }
  .rx .flow { display: grid; gap: 8px; }
  .rx .fb { background: var(--surface-2); border-radius: 10px; padding: 8px 12px; font-size: .9rem; overflow-x: auto; }
  .rx .fb .fx { font-size: .95rem; }
  .rx .fb .fy { color: var(--muted); font-size: .84rem; margin-top: 2px; }
  .rx .fb.eq { background: var(--accent-soft); }
  .rx .fa { color: var(--muted); text-align: center; line-height: 1; }
  @media (max-width: 600px) {
    .rx section.blk { padding: 16px 12px; }
    .rx .bar .track { height: 100px; }
  }`;
  var styleEl = document.createElement('style'); styleEl.textContent = css; document.head.appendChild(styleEl);

  // ---------- tiện ích ----------
  function h(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }
  function fmtNum(x, d) { return (+x.toFixed(d) || 0).toLocaleString('vi-VN', { minimumFractionDigits: d, maximumFractionDigits: d }); }
  // số trong công thức: bỏ số 0 thừa ở cuối, dấu phẩy thập phân viết {,} cho KaTeX
  function texRaw(x, d) { var v = +x.toFixed(d); return (v === 0 ? 0 : v).toLocaleString('vi-VN', { maximumFractionDigits: d }).replace(',', '{,}'); }
  function tex(x, d) { var s = texRaw(x, d); return x < 0 ? '(' + s + ')' : s; }
  function vec(v, d) { return '[' + v.map(function (x) { return texRaw(x, d); }).join(';\\ ') + ']'; }
  function onResize(fn) {
    var last = window.innerWidth, t = null;
    window.addEventListener('resize', function () {
      if (window.innerWidth === last) return; last = window.innerWidth;
      clearTimeout(t); t = setTimeout(fn, 150);
    });
  }
  function katexBlock(el, src) {
    if (window.katex) { try { katex.render(src, el, { displayMode: true, throwOnError: false, strict: 'ignore' }); return; } catch (e) {} }
    el.textContent = src;
  }
  function seg(el, cb) {
    el.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      el.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      cb(b.dataset.v);
    });
  }
  function segVal(el) { return el.querySelector('[aria-pressed=true]').dataset.v; }
  function seeded(seed) {
    var st = seed >>> 0;
    return function () { st = (st + 0x6D2B79F5) >>> 0; var t = st; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  function softmax(t) {
    var m = Math.max.apply(null, t), e = t.map(function (x) { return Math.exp(x - m); }), s = e.reduce(function (a, b) { return a + b; }, 0);
    return e.map(function (x) { return x / s; });
  }
  function sig(x) { return 1 / (1 + Math.exp(-x)); }
  function quant(a, p) { var b = a.slice().sort(function (x, y) { return x - y; }); return b[Math.floor(p * (b.length - 1))]; }

  // Biểu đồ đường; mỗi chuỗi có thể kèm dải [lo, hi]. refs: đường ngang đứt nét.
  function lineChart(box, opt) {
    // opt: { series: [{ name, color, values, lo?, hi? }], yMin, yMax, yTicks, dec, tipDec, xLabel, xFirst, refs: [{ y, label }], xs? (hoành độ tùy ý) }
    var W = Math.max(280, box.clientWidth), H = opt.height || 220, m = { l: 44, r: 12, t: 12, b: 34 };
    var iw = W - m.l - m.r, ih = H - m.t - m.b;
    var n = Math.max.apply(null, opt.series.map(function (s) { return s.values.length; }));
    var xs = opt.xs, x0 = xs ? xs[0] : 0, x1 = xs ? xs[xs.length - 1] : n - 1;
    var xv = function (i) { return xs ? xs[i] : i; };
    var x = function (v) { return m.l + (x1 === x0 ? 0 : (v - x0) / (x1 - x0) * iw); };
    var y = function (v) { v = Math.max(opt.yMin, Math.min(opt.yMax, v)); return m.t + ih - (v - opt.yMin) / (opt.yMax - opt.yMin) * ih; };
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (opt.aria || '') + '"><g class="grid">';
    opt.yTicks.forEach(function (v) { s += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(v) + '" y2="' + y(v) + '"/>'; });
    s += '</g>';
    opt.yTicks.forEach(function (v) { s += '<text x="' + (m.l - 6) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + fmtNum(v, opt.dec || 0) + '</text>'; });
    var xl0 = opt.xFmt ? opt.xFmt(x0) : (opt.xFirst || 1), xl1 = opt.xFmt ? opt.xFmt(x1) : n;
    s += '<text x="' + m.l + '" y="' + (H - m.b + 16) + '" text-anchor="start">' + xl0 + '</text><text x="' + (W - m.r) + '" y="' + (H - m.b + 16) + '" text-anchor="end">' + xl1 + '</text>';
    s += '<text x="' + (m.l + iw / 2) + '" y="' + (H - 2) + '" text-anchor="middle">' + opt.xLabel + '</text>';
    (opt.refs || []).forEach(function (r) {
      s += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(r.y) + '" y2="' + y(r.y) + '" stroke="var(--muted)" stroke-dasharray="4 4"/>' +
           '<text x="' + (W - m.r) + '" y="' + (y(r.y) - 4) + '" text-anchor="end">' + r.label + '</text>';
    });
    opt.series.forEach(function (se) {
      if (!se.values.length) return;
      if (se.lo) {
        var up = se.hi.map(function (v, i) { return x(xv(i)).toFixed(1) + ',' + y(v).toFixed(1); });
        var dn = se.lo.map(function (v, i) { return x(xv(i)).toFixed(1) + ',' + y(v).toFixed(1); }).reverse();
        s += '<polygon points="' + up.concat(dn).join(' ') + '" fill="' + se.color + '" fill-opacity=".16" stroke="none"/>';
      }
      var d = se.values.map(function (v, i) { return (i ? 'L' : 'M') + x(xv(i)).toFixed(1) + ' ' + y(v).toFixed(1); }).join('');
      s += '<path d="' + d + '" fill="none" stroke="' + se.color + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>';
    });
    (opt.marks || []).forEach(function (mk) {
      s += '<circle cx="' + x(mk.x) + '" cy="' + y(mk.y) + '" r="' + (mk.r || 5) + '" fill="' + mk.color + '" stroke="var(--surface)" stroke-width="2"/>';
      if (mk.label) s += '<text x="' + (x(mk.x) + (mk.dx || 0)) + '" y="' + (y(mk.y) + (mk.dy || -9)) + '" text-anchor="' + (mk.anchor || 'middle') + '" style="fill:var(--text)">' + mk.label + '</text>';
    });
    s += '<line class="xh" x1="0" x2="0" y1="' + m.t + '" y2="' + (m.t + ih) + '" stroke="var(--muted)" stroke-width="1" style="display:none"/>';
    opt.series.forEach(function (se, k) { s += '<circle class="hd" data-k="' + k + '" r="4" fill="' + se.color + '" stroke="var(--surface)" stroke-width="2" style="display:none"/>'; });
    s += '<rect class="hit" x="' + m.l + '" y="' + m.t + '" width="' + iw + '" height="' + ih + '" fill="transparent"/></svg>';
    box.innerHTML = s + '<div class="tip"></div>';
    var svg = box.querySelector('svg'), tip = box.querySelector('.tip'), xh = svg.querySelector('.xh'), hit = svg.querySelector('.hit');
    var dots = svg.querySelectorAll('.hd');
    function show(ev) {
      if (n < 1) return;
      var r = svg.getBoundingClientRect(), px = (ev.clientX - r.left) / r.width * W;
      var i = Math.round((px - m.l) / iw * (n - 1)); i = Math.max(0, Math.min(n - 1, i));
      xh.setAttribute('x1', x(xv(i))); xh.setAttribute('x2', x(xv(i))); xh.style.display = '';
      var rows = [];
      opt.series.forEach(function (se, k) {
        var v = se.values[i];
        if (v == null) { dots[k].style.display = 'none'; return; }
        dots[k].setAttribute('cx', x(xv(i))); dots[k].setAttribute('cy', y(v)); dots[k].style.display = '';
        var dd = opt.tipDec == null ? 2 : opt.tipDec;
        rows.push('<span class="sw dot" style="background:' + se.color + '"></span> ' + se.name + ': <b>' + fmtNum(v, dd) + '</b>' +
          (se.lo ? ' <span style="color:var(--muted)">(' + fmtNum(se.lo[i], dd) + ' – ' + fmtNum(se.hi[i], dd) + ')</span>' : ''));
      });
      tip.innerHTML = '<div>' + opt.xLabel + ' ' + (opt.xFmt ? opt.xFmt(xv(i)) : i + (opt.xFirst || 1)) + '</div>' + rows.join('<br>');
      tip.style.display = 'block';
      var left = x(xv(i)) / W * r.width + 12;
      if (left + tip.offsetWidth > r.width) left -= tip.offsetWidth + 24;
      tip.style.left = Math.max(0, left) + 'px'; tip.style.top = '0px';
    }
    hit.addEventListener('pointermove', show); hit.addEventListener('pointerdown', show);
    hit.addEventListener('pointerleave', function () { tip.style.display = 'none'; xh.style.display = 'none'; dots.forEach(function (d) { d.style.display = 'none'; }); });
  }

  // ======================================================================
  // TAB "Thí nghiệm"
  // ======================================================================

  // ---- 1. Đường cơ sở trên bài toán một trạng thái, ba hành động ----
  var AN = ['a', 'b', 'c'];
  var REW = { pos: [10, 11, 12], zero: [-1, 0, 1] };
  var NOISE = 0.5, NB = 5;
  // Một lần cập nhật: lấy mẫu NB hành động, θ ← θ + η·(1/NB)·Σ (R − b)(e_a − π)
  function banditUpdate(st, means, useB, eta, rand) {
    var p = softmax(st.th), smp = [];
    for (var n = 0; n < NB; n++) {
      var u = rand(), a = u < p[0] ? 0 : u < p[0] + p[1] ? 1 : 2;
      smp.push({ a: a, R: means[a] + (rand() * 2 - 1) * NOISE });
    }
    var b = useB && st.bn ? st.bsum / st.bn : 0, g = [0, 0, 0];
    smp.forEach(function (o) {
      for (var k = 0; k < 3; k++) g[k] += (o.R - b) * ((k === o.a ? 1 : 0) - p[k]) / NB;
    });
    smp.forEach(function (o) { st.bsum += o.R; st.bn++; });
    var th0 = st.th.slice();
    for (var k = 0; k < 3; k++) st.th[k] += eta * g[k];
    return { p: p, q: softmax(st.th), smp: smp, b: b, g: g, th0: th0 };
  }

  // ---- 3. Hành lang ngắn (Sutton & Barto, ví dụ 13.1) ----
  // ô 0: phải → 1, trái → đứng yên; ô 1 (đảo chiều): phải → 0, trái → 2; ô 2: phải → 3 (đích), trái → 1. Mỗi bước −1.
  function corrStep(s, right) { if (s === 0) return right ? 1 : 0; if (s === 1) return right ? 0 : 2; return right ? 3 : 1; }
  function corrJ(p) {
    // v0 = −1 + p v1 + (1−p) v0; v1 = −1 + p v0 + (1−p) v2; v2 = −1 + (1−p) v1
    var q = 1 - p, v2c = -1, v2k = q;          // v2 = −1 + q v1
    // v1 = −1 + p v0 + q(−1 + q v1) ⇒ v1 (1 − q²) = −1 − q + p v0
    // v0: p v0 = −1 + p v1 ⇒ v0 = v1 − 1/p
    // v1 (1 − q²) = −1 − q + p v1 − 1 ⇒ v1 (1 − q² − p) = −2 − q
    var v1 = (-2 - q) / (1 - q * q - p);
    return v1 - 1 / p;
  }
  var P0 = 0.1, CAP = 1000;
  // REINFORCE một tập (γ = 1); có đường cơ sở w (giá trị chung cho mọi ô vì các ô trông giống nhau)
  function corrEpisode(st, useB, rand) {
    var s = 0, tr = [];
    while (s !== 3 && tr.length < CAP) { var p = sig(st.th), r = rand() < p; tr.push({ s: s, r: r }); s = corrStep(s, r); }
    var T = tr.length, aT = useB ? Math.pow(2, -9) : Math.pow(2, -12), aW = Math.pow(2, -6), p0 = sig(st.th), w0 = st.w;
    for (var k = 0; k < T; k++) {
      var G = -(T - k), pk = sig(st.th), gl = tr[k].r ? 1 - pk : -pk, d = useB ? G - st.w : G;
      if (useB) st.w += aW * (G - st.w);
      st.th += aT * d * gl;
    }
    return { tr: tr, T: T, p0: p0, p1: sig(st.th), w0: w0, w1: st.w, aT: aT };
  }

  function renderLab(root, ctx) {
    root.innerHTML = '';
    root.classList.add('rx');

    // ============ 1. Đường cơ sở ============
    var b1 = h('<section class="blk">' +
      '<h2>1. Đường cơ sở: ba hành động, phần thưởng luôn dương (hình 4.10–4.11)</h2>' +
      '<p class="lead">Một trạng thái, ba hành động $a, b, c$; phần thưởng trung bình tăng dần từ $a$ tới $c$ (cộng nhiễu $\\pm 0{,}5$). Chính sách softmax $\\pi = \\mathrm{softmax}(\\theta)$, ban đầu đều. Mỗi lần cập nhật lấy mẫu ' + NB + ' hành động rồi đi lên theo gradient: $\\theta \\leftarrow \\theta + \\eta\\,\\frac{1}{' + NB + '}\\sum (R - b)\\,(e_a - \\pi)$, với $e_a - \\pi = \\nabla_\\theta\\log\\pi(a)$ (tab Chứng minh).</p>' +
      '<div class="ctrl"><label>Phần thưởng</label><div class="seg" id="bd-rew"><button type="button" data-v="pos" aria-pressed="true">Luôn dương: 10, 11, 12 (như Pong)</button><button type="button" data-v="zero" aria-pressed="false">Quanh 0: −1, 0, +1</button></div></div>' +
      '<div class="ctrl"><label>Đường cơ sở</label><div class="seg" id="bd-b"><button type="button" data-v="0" aria-pressed="true">Không ($b = 0$)</button><button type="button" data-v="1" aria-pressed="false">$b$ = trung bình chạy của $R$</button></div></div>' +
      '<div class="ctrl"><label for="bd-eta">$\\eta$</label><input id="bd-eta" type="range" min="0.02" max="0.3" step="0.01" value="0.1"><span class="val" id="bd-eta-v"></span></div>' +
      '<div class="ctrl"><button type="button" class="btn pri" id="bd-one">1 lần cập nhật</button><button type="button" class="btn" id="bd-many">+20 lần</button><button type="button" class="btn" id="bd-reset">Đặt lại</button>' +
      '<span class="rxs">Lần cập nhật: <b id="bd-k">0</b> · $c$ không được lấy mẫu mà $\\pi(c)$ vẫn giảm: <b id="bd-drop">0</b> lần</span></div>' +
      '<div class="bars" id="bd-bars"></div>' +
      '<div class="calc" id="bd-calc"></div>' +
      '<div class="insight" id="bd-ins"></div>' +
      '<h3 class="sub">So sánh 300 lần chạy (60 lần cập nhật mỗi lần chạy)</h3>' +
      '<p class="rxs" style="margin:0">Đường là trung vị của $\\pi(c)$ (xác suất chọn hành động tốt nhất), dải màu là khoảng từ phân vị 10% tới 90%. Dùng thiết lập phần thưởng và $\\eta$ ở trên.</p>' +
      '<div class="ctrl"><button type="button" class="btn" id="bd-cmp">Chạy so sánh</button></div>' +
      '<div class="legend"><span class="li"><span class="sw box" style="background:var(--s2)"></span>Không có đường cơ sở</span><span class="li"><span class="sw box" style="background:var(--s1)"></span>Có đường cơ sở</span></div>' +
      '<div class="chart" id="bd-chart"></div>' +
      '<div class="insight" id="bd-ins2">Bấm “Chạy so sánh”.</div>' +
      '</section>');
    root.appendChild(b1);
    var bst, bLast = null, bK = 0, bDrop = 0, bRand = seeded(7);
    var rewEl = b1.querySelector('#bd-rew'), bEl = b1.querySelector('#bd-b'), etaEl = b1.querySelector('#bd-eta');
    function bMeans() { return REW[segVal(rewEl)]; }
    function bUse() { return segVal(bEl) === '1'; }
    function bEta() { return +etaEl.value; }
    function bReset() { bst = { th: [0, 0, 0], bsum: 0, bn: 0 }; bLast = null; bK = 0; bDrop = 0; bDraw(); }
    function bStep() {
      var r = banditUpdate(bst, bMeans(), bUse(), bEta(), bRand); bK++;
      var hasC = r.smp.some(function (o) { return o.a === 2; });
      if (!hasC && r.q[2] < r.p[2] - 1e-12) bDrop++;
      bLast = r;
    }
    function bDraw() {
      var p = softmax(bst.th), m = bMeans(), L = bLast;
      var cnt = [0, 0, 0]; if (L) L.smp.forEach(function (o) { cnt[o.a]++; });
      b1.querySelector('#bd-bars').innerHTML = p.map(function (v, k) {
        var d = L ? v - L.p[k] : 0;
        return '<div class="bar' + (cnt[k] ? ' picked' : '') + '"><div class="track"><div class="fill" style="height:' + (v * 100).toFixed(1) + '%"></div>' +
          (L ? '<div class="ghost" style="bottom:' + (L.p[k] * 100).toFixed(1) + '%"></div>' : '') + '</div>' +
          '<div class="pv">' + AN[k] + ': ' + fmtNum(v, 3) + '</div>' +
          '<div class="dv ' + (d > 1e-9 ? 'up' : d < -1e-9 ? 'down' : '') + '">' + (L ? (d > 1e-9 ? '▲ +' : d < -1e-9 ? '▼ −' : '') + fmtNum(Math.abs(d), 3) : '') + '</div>' +
          '<div class="nm">$R \\approx ' + texRaw(m[k], 0) + '$ · lấy mẫu ' + cnt[k] + ' lần</div></div>';
      }).join('');
      b1.querySelector('#bd-k').textContent = bK;
      b1.querySelector('#bd-drop').textContent = bDrop;
      var calc = b1.querySelector('#bd-calc'), ins = b1.querySelector('#bd-ins');
      if (!L) {
        calc.innerHTML = '<span class="rxs">Phép tính của lần cập nhật gần nhất sẽ hiện ở đây. Vạch đứt nét trên mỗi cột là xác suất trước khi cập nhật.</span>';
        ins.innerHTML = 'Bắt đầu với $\\pi = [\\tfrac13;\\ \\tfrac13;\\ \\tfrac13]$. Bấm “1 lần cập nhật” và nhìn hành động <b>không được lấy mẫu</b>.';
      } else {
        var rows = L.smp.map(function (o) { return '(' + AN[o.a] + ',\\ ' + texRaw(o.R, 2) + ')'; }).join(',\\ ');
        var src = '\\begin{aligned}&\\text{Mẫu } (a, R):\\ ' + rows + '\\\\' +
          '&b = ' + texRaw(L.b, 2) + (bUse() ? '\\ \\text{(trung bình các } R \\text{ trước đó)}' : '') + '\\\\' +
          '&\\pi = ' + vec(L.p, 3) + '\\\\' +
          '&g = \\tfrac{1}{' + NB + '}\\textstyle\\sum (R - b)(e_a - \\pi) = ' + vec(L.g, 3) + '\\\\' +
          '&\\theta \\leftarrow \\theta + ' + texRaw(bEta(), 2) + '\\,g = ' + vec(bst.th, 3) + '\\\\' +
          '&\\pi_{\\text{mới}} = \\mathrm{softmax}(\\theta) = ' + vec(L.q, 3) + '\\end{aligned}';
        katexBlock(calc, src);
        var hasC = L.smp.some(function (o) { return o.a === 2; });
        var ds = L.smp.map(function (o) { return o.R - L.b; });
        var allPos = ds.every(function (x) { return x > 0; });
        if (!hasC && L.q[2] < L.p[2]) ins.innerHTML = 'Lần này $c$ (hành động tốt nhất) <b>không được lấy mẫu</b>' + (allPos ? ', mọi trọng số $R - b$ đều dương nên các hành động được lấy mẫu đều được đẩy lên, và $\\pi(c)$ <b>bị giảm</b>. Đúng hình 4.11.' : ', và $\\pi(c)$ vẫn giảm.');
        else if (!hasC && L.q[2] > L.p[2]) ins.innerHTML = 'Lần này $c$ không được lấy mẫu nhưng $\\pi(c)$ vẫn <b>tăng</b>: nhờ đường cơ sở, các mẫu có $R < b$ mang trọng số âm và bị kéo xuống, nhường xác suất cho $c$.';
        else if (allPos) ins.innerHTML = 'Mọi trọng số $R - b$ đều dương: <b>mọi</b> hành động được lấy mẫu đều được tăng, chỉ khác mức tăng. Hành động nào lên hay xuống phụ thuộc nhiều vào may rủi lấy mẫu.';
        else ins.innerHTML = 'Trọng số $R - b$ có cả dương lẫn âm: hành động tốt hơn mức trung bình được tăng, kém hơn bị giảm. Đó là tác dụng của đường cơ sở.';
      }
      ctx.typeset(b1.querySelector('#bd-bars')); ctx.typeset(ins);
    }
    function bCompare() {
      var btn = b1.querySelector('#bd-cmp'); btn.disabled = true; btn.textContent = 'Đang chạy…';
      setTimeout(function () {
        var R = 300, U = 60, m = bMeans(), eta = bEta(), res = {};
        [false, true].forEach(function (useB) {
          var cols = []; for (var u = 0; u < U; u++) cols.push([]);
          var rand = seeded(useB ? 101 : 202);
          for (var i = 0; i < R; i++) {
            var st = { th: [0, 0, 0], bsum: 0, bn: 0 };
            for (var u2 = 0; u2 < U; u2++) { banditUpdate(st, m, useB, eta, rand); cols[u2].push(softmax(st.th)[2]); }
          }
          res[useB] = { med: cols.map(function (c) { return quant(c, .5); }), lo: cols.map(function (c) { return quant(c, .1); }), hi: cols.map(function (c) { return quant(c, .9); }) };
        });
        bCmp = res; drawCmp();
        btn.disabled = false; btn.textContent = 'Chạy lại so sánh';
        var a = res[false], b = res[true], L = U - 1;
        b1.querySelector('#bd-ins2').innerHTML = 'Sau ' + U + ' lần cập nhật, $\\pi(c)$: <b>không có đường cơ sở</b> trung vị ' + fmtNum(a.med[L], 2) + ', 10% số lần chạy thấp hơn ' + fmtNum(a.lo[L], 2) +
          '; <b>có đường cơ sở</b> trung vị ' + fmtNum(b.med[L], 2) + ', 10% thấp nhất dưới ' + fmtNum(b.lo[L], 2) + '. ' +
          (segVal(rewEl) === 'pos' ? 'Khi phần thưởng luôn dương và lớn, không có đường cơ sở thì mỗi lần cập nhật là một cú đẩy lớn về phía hành động tình cờ được lấy mẫu nhiều: nhiều lần chạy bị “khóa” vào hành động tồi (dải cam rất rộng). Kỳ vọng của gradient như nhau, nhưng <b>phương sai</b> khác hẳn.'
            : 'Khi phần thưởng đã xoay quanh 0, trọng số tự nhiên có cả dương lẫn âm nên hai cách gần như giống nhau: đường cơ sở chính là cách “dời phần thưởng về quanh 0”.');
        ctx.typeset(b1.querySelector('#bd-ins2'));
      }, 30);
    }
    var bCmp = null;
    function drawCmp() {
      if (!bCmp) return;
      lineChart(b1.querySelector('#bd-chart'), {
        series: [{ name: 'Không có b', color: 'var(--s2)', values: bCmp[false].med, lo: bCmp[false].lo, hi: bCmp[false].hi },
                 { name: 'Có b', color: 'var(--s1)', values: bCmp[true].med, lo: bCmp[true].lo, hi: bCmp[true].hi }],
        yMin: 0, yMax: 1, yTicks: [0, .25, .5, .75, 1], dec: 2, xLabel: 'Lần cập nhật', aria: 'Xác suất chọn hành động tốt nhất theo số lần cập nhật'
      });
    }
    seg(rewEl, function () { bReset(); bCmp = null; b1.querySelector('#bd-chart').innerHTML = ''; b1.querySelector('#bd-ins2').textContent = 'Bấm “Chạy so sánh”.'; });
    seg(bEl, bReset);
    etaEl.oninput = function () { b1.querySelector('#bd-eta-v').textContent = fmtNum(bEta(), 2); };
    etaEl.oninput();
    b1.querySelector('#bd-one').onclick = function () { bStep(); bDraw(); };
    b1.querySelector('#bd-many').onclick = function () { for (var i = 0; i < 20; i++) bStep(); bDraw(); };
    b1.querySelector('#bd-reset').onclick = bReset;
    b1.querySelector('#bd-cmp').onclick = bCompare;
    onResize(drawCmp);
    bReset();

    // ============ 2. Gán điểm phù hợp ============
    var b2 = h('<section class="blk">' +
      '<h2>2. Gán điểm phù hợp (hình 4.12)</h2>' +
      '<p class="lead">Một ván ba bước. Bảng so sánh trọng số đặt trước $\\nabla\\log p_\\theta(a_t \\mid s_t)$ theo ba cách. Số dương: tăng xác suất của cặp đó; số âm: giảm. Bấm một hàng để xem phép tính.</p>' +
      '<div class="ctrl"><div class="seg" id="cr-pre"><button type="button" data-v="a" aria-pressed="true">Hình 4.12a</button><button type="button" data-v="b" aria-pressed="false">Hình 4.12b</button></div>' +
      '<label>$r_1$</label><input type="number" id="cr-r0" step="1"><label>$r_2$</label><input type="number" id="cr-r1" step="1"><label>$r_3$</label><input type="number" id="cr-r2" step="1"></div>' +
      '<div class="ctrl"><label for="cr-g">$\\gamma$</label><input id="cr-g" type="range" min="0" max="1" step="0.05" value="0.9"><span class="val" id="cr-g-v"></span>' +
      '<label for="cr-b">$b$</label><input type="number" id="cr-b" step="0.5" value="0"></div>' +
      '<div class="tscroll"><table class="cmp"><thead><tr><th>Cặp</th><th>$r_t$</th><th>Cả ván<br>$R(\\tau) - b$</th><th>Từ $t$ trở đi<br>$\\sum_{t\'\\ge t} r_{t\'} - b$</th><th>Có chiết khấu<br>$\\sum_{t\'\\ge t}\\gamma^{t\'-t} r_{t\'} - b$</th></tr></thead><tbody id="cr-body"></tbody></table></div>' +
      '<div class="calc" id="cr-calc"></div>' +
      '<div class="insight" id="cr-ins"></div>' +
      '</section>');
    root.appendChild(b2);
    var PRE = { a: { r: [5, 0, -2], pairs: ['(s_a, a_1)', '(s_b, a_2)', '(s_c, a_3)'] }, b: { r: [-5, 0, -2], pairs: ['(s_a, a_2)', '(s_b, a_2)', '(s_c, a_3)'] } };
    var crSel = 1, crPre = 'a';
    function crR() { return [0, 1, 2].map(function (i) { var v = +b2.querySelector('#cr-r' + i).value; return isFinite(v) ? v : 0; }); }
    function crLoad(k) { crPre = k; PRE[k].r.forEach(function (v, i) { b2.querySelector('#cr-r' + i).value = v; }); crDraw(); }
    function wcell(v) { return '<span class="wv ' + (v > 1e-9 ? 'pos' : v < -1e-9 ? 'neg' : '') + '">' + fmtNum(v, 2).replace('-', '−') + '<small>' + (v > 1e-9 ? 'tăng' : v < -1e-9 ? 'giảm' : 'không đổi') + '</small></span>'; }
    function crDraw() {
      var r = crR(), g = +b2.querySelector('#cr-g').value, b = +b2.querySelector('#cr-b').value || 0;
      b2.querySelector('#cr-g-v').textContent = fmtNum(g, 2);
      var tot = r[0] + r[1] + r[2], pairs = PRE[crPre].pairs;
      var rows = [0, 1, 2].map(function (t) {
        var togo = 0, disc = 0; for (var k = t; k < 3; k++) { togo += r[k]; disc += Math.pow(g, k - t) * r[k]; }
        return { t: t, all: tot - b, togo: togo - b, disc: disc - b };
      });
      b2.querySelector('#cr-body').innerHTML = rows.map(function (o) {
        return '<tr data-t="' + o.t + '" class="' + (o.t === crSel ? 'sel' : '') + '"><td>$' + pairs[o.t] + '$</td><td>' + fmtNum(r[o.t], 0).replace('-', '−') + '</td><td>' + wcell(o.all) + '</td><td>' + wcell(o.togo) + '</td><td>' + wcell(o.disc) + '</td></tr>';
      }).join('');
      ctx.typeset(b2.querySelector('#cr-body'));
      var t = crSel, o = rows[t];
      var allTerms = r.map(function (v) { return tex(v, 2); }).join(' + ');
      var togoTerms = r.slice(t).map(function (v) { return tex(v, 2); }).join(' + ');
      var discTerms = r.slice(t).map(function (v, j) { return (j === 0 ? '' : j === 1 ? texRaw(g, 2) + '\\cdot ' : texRaw(g, 2) + '^{' + j + '}\\cdot ') + tex(v, 2); }).join(' + ');
      var bt = b ? ' - ' + tex(b, 2) : '';
      katexBlock(b2.querySelector('#cr-calc'), '\\begin{aligned}' + pairs[t].replace('(', '\\text{Cặp }(') + ':\\quad &R(\\tau) - b = ' + allTerms + bt + ' = ' + texRaw(o.all, 2) + '\\\\' +
        '&\\textstyle\\sum_{t\'\\ge ' + (t + 1) + '} r_{t\'} - b = ' + togoTerms + bt + ' = ' + texRaw(o.togo, 2) + '\\\\' +
        '&\\textstyle\\sum_{t\'\\ge ' + (t + 1) + '}\\gamma^{t\'-' + (t + 1) + '} r_{t\'} - b = ' + discTerms + bt + ' = ' + texRaw(o.disc, 2) + '\\end{aligned}');
      var ins = b2.querySelector('#cr-ins');
      if (crPre === 'a' && r.join() === '5,0,-2' && !b) ins.innerHTML = 'Cả ván được $+3$ nên cách “cả ván” <b>tăng</b> xác suất của $(s_b, a_2)$. Nhưng $+5$ đến từ $(s_a, a_1)$ xảy ra <b>trước</b>; sau $(s_b, a_2)$ chỉ còn $-2$. Gán điểm phù hợp cho $(s_b, a_2)$ trọng số $-2$: <b>giảm</b>.';
      else if (crPre === 'b' && r.join() === '-5,0,-2' && !b) ins.innerHTML = 'Cả ván $-7$, nhưng $-5$ là lỗi của $(s_a, a_2)$ ở trước. Từ $(s_b, a_2)$ trở đi chỉ có $-2$, giống hệt ván (a): cùng một cặp trạng thái-hành động nay nhận <b>cùng</b> trọng số ở cả hai ván.';
      else ins.innerHTML = 'Thử đổi $\\gamma$: $\\gamma = 0$ thì mỗi cặp chỉ nhận phần thưởng tức thời của nó; $\\gamma = 1$ là tổng từ $t$ trở đi. Thử đặt $b$ bằng trung bình để thấy trọng số đổi dấu.';
      ctx.typeset(ins);
    }
    seg(b2.querySelector('#cr-pre'), crLoad);
    ['#cr-r0', '#cr-r1', '#cr-r2', '#cr-b'].forEach(function (id) { b2.querySelector(id).oninput = crDraw; });
    b2.querySelector('#cr-g').oninput = crDraw;
    b2.querySelector('#cr-body').addEventListener('click', function (e) { var tr = e.target.closest('tr'); if (!tr) return; crSel = +tr.dataset.t; crDraw(); });
    crLoad('a');

    // ============ 3. Hành lang ngắn ============
    var b3 = h('<section class="blk">' +
      '<h2>3. REINFORCE học chính sách ngẫu nhiên: hành lang ngắn</h2>' +
      '<p class="lead">Bổ sung của người dịch (Sutton & Barto, ví dụ 13.1 và hình 13.1–13.2). Ba ô và đích; mỗi bước $-1$, $\\gamma = 1$. Ở ô thứ hai, hành động bị <b>đảo chiều</b> (bấm phải thì đi sang trái). Tác tử <b>không phân biệt được</b> các ô (cùng một đặc trưng), nên chính sách chỉ có một tham số: $p = \\pi(\\text{phải}) = \\sigma(\\theta)$.</p>' +
      '<div class="corr" id="sc-corr"><div class="c">S<small>bắt đầu</small></div><div class="c rev">⇄<small>đảo chiều</small></div><div class="c">·<small>&nbsp;</small></div><div class="c goal">G<small>đích</small></div></div>' +
      '<div class="ctrl"><div class="seg" id="sc-alg"><button type="button" data-v="0" aria-pressed="true">REINFORCE ($\\alpha = 2^{-12}$)</button><button type="button" data-v="1" aria-pressed="false">REINFORCE + đường cơ sở ($\\alpha_\\theta = 2^{-9}$, $\\alpha_w = 2^{-6}$)</button></div></div>' +
      '<div class="ctrl"><button type="button" class="btn pri" id="sc-one">1 tập</button><button type="button" class="btn" id="sc-many">+50 tập</button><button type="button" class="btn" id="sc-reset">Đặt lại</button>' +
      '<span class="rxs">Tập: <b id="sc-k">0</b> · $p$ hiện tại: <b id="sc-p"></b></span></div>' +
      '<div class="chart" id="sc-j"></div>' +
      '<div class="calc" id="sc-calc"></div>' +
      '<div class="insight" id="sc-ins"></div>' +
      '<h3 class="sub">So sánh 50 lần chạy × 500 tập</h3>' +
      '<p class="rxs" style="margin:0">Tổng phần thưởng mỗi tập, trung bình trên 50 lần chạy (làm trơn 10 tập). Đường đứt nét: giá trị tối ưu $J \\approx -11{,}7$. Mọi lần chạy bắt đầu với $p = ' + texRaw(P0, 2) + '$.</p>' +
      '<div class="ctrl"><button type="button" class="btn" id="sc-cmp">Chạy so sánh</button></div>' +
      '<div class="legend"><span class="li"><span class="sw" style="background:var(--s2)"></span>REINFORCE</span><span class="li"><span class="sw" style="background:var(--s1)"></span>REINFORCE + đường cơ sở</span></div>' +
      '<div class="chart" id="sc-chart"></div>' +
      '</section>');
    root.appendChild(b3);
    var PS = [], JS = [];
    for (var pp = 0.05; pp <= 0.971; pp += 0.01) { PS.push(+pp.toFixed(2)); JS.push(corrJ(pp)); }
    var popt = 0, jopt = -1e9; for (var q = 0.01; q < 0.99; q += 0.001) { var jv = corrJ(q); if (jv > jopt) { jopt = jv; popt = q; } }
    var sst, sK = 0, sLast = null, sRand = seeded(11), sAnim = null;
    var algEl = b3.querySelector('#sc-alg');
    function sUse() { return segVal(algEl) === '1'; }
    function sReset() { clearInterval(sAnim); sst = { th: Math.log(P0 / (1 - P0)), w: 0 }; sK = 0; sLast = null; sDraw(); }
    function sDraw() {
      var p = sig(sst.th);
      b3.querySelector('#sc-k').textContent = sK;
      b3.querySelector('#sc-p').textContent = fmtNum(p, 3);
      lineChart(b3.querySelector('#sc-j'), {
        series: [{ name: '$J(p)$', color: 'var(--s1)', values: JS }], xs: PS, xFmt: function (v) { return 'p = ' + fmtNum(v, 2); },
        yMin: -100, yMax: 0, yTicks: [-100, -75, -50, -25, 0], xLabel: 'p = π(phải)', tipDec: 1, height: 230,
        marks: [{ x: 0.05, y: corrJ(0.05), color: 'var(--gray)', label: 'ε-tham lam (trái)', anchor: 'start', dx: 6, dy: 4 },
                { x: 0.95, y: corrJ(0.95), color: 'var(--gray)', label: 'ε-tham lam (phải)', anchor: 'end', dx: -6, dy: -8 },
                { x: popt, y: jopt, color: 'var(--accent)', label: 'tối ưu p ≈ ' + fmtNum(popt, 2) + ', J ≈ ' + fmtNum(jopt, 1), dy: -10 },
                { x: Math.min(0.98, Math.max(0.02, p)), y: Math.max(-100, corrJ(p)), color: 'var(--s2)', r: 7 }],
        aria: 'Giá trị J theo xác suất đi phải p'
      });
      b3.querySelector('#sc-j .tip').innerHTML = '';
      var calc = b3.querySelector('#sc-calc'), ins = b3.querySelector('#sc-ins'), L = sLast;
      if (!L) {
        calc.innerHTML = '<span class="rxs">Đường cong là giá trị thật $J(p)$ của trạng thái đầu khi đi phải với xác suất $p$ ở mọi ô. Chấm cam là chính sách hiện tại.</span>';
        ins.innerHTML = '$\\varepsilon$-tham lam theo $Q$ (chương 3) chỉ chọn được “gần như luôn phải” hoặc “gần như luôn trái” (hai chấm xám, với $\\varepsilon = 0{,}1$): $J \\approx ' + texRaw(corrJ(0.95), 0) + '$ hoặc $' + texRaw(corrJ(0.05), 0) + '$. Chính sách tối ưu lại là <b>ngẫu nhiên</b>. Gradient chính sách đi lên dọc theo đường cong tới đó.';
      } else {
        var G0 = -L.T, steps = L.tr.slice(0, 14).map(function (o) { return o.r ? '\\rightarrow' : '\\leftarrow'; }).join('');
        var src = '\\begin{aligned}&\\text{Hành động (' + L.T + ' bước): }' + steps + (L.T > 14 ? '\\cdots' : '') + '\\\\' +
          '&G_0 = -' + L.T + ',\\quad G_t = -(T - t)\\\\' +
          '&\\nabla_\\theta\\log\\pi = \\begin{cases}1 - p & \\text{phải}\\\\ -p & \\text{trái}\\end{cases}\\\\' +
          '&\\theta \\leftarrow \\theta + \\alpha\\,' + (sUse() ? '(G_t - w)' : 'G_t') + '\\,\\nabla_\\theta\\log\\pi(a_t)\\ \\text{ với } t = 0, \\ldots, T-1\\\\' +
          '&p:\\ ' + texRaw(L.p0, 3) + '\\ \\to\\ ' + texRaw(L.p1, 3) + (sUse() ? ',\\qquad w:\\ ' + texRaw(L.w0, 2) + '\\ \\to\\ ' + texRaw(L.w1, 2) : '') + '\\end{aligned}';
        katexBlock(calc, src);
        ins.innerHTML = sUse()
          ? 'Đường cơ sở $w$ học $\\approx$ lợi tức trung bình. $G_t - w$ có cả dương lẫn âm: tập ngắn hơn bình thường đẩy $\\theta$ theo các hành động đã làm, tập dài hơn đẩy ngược. Nhờ phương sai nhỏ nên dùng được bước lớn hơn ($2^{-9}$) và hội tụ nhanh.'
          : 'Không có đường cơ sở, mọi $G_t$ đều âm nên mọi hành động trong tập đều bị đẩy xuống, chỉ khác mức độ. Phương sai lớn buộc phải dùng bước nhỏ ($2^{-12}$), nên học chậm.';
      }
      ctx.typeset(ins); ctx.typeset(calc.querySelector('.rxs') || calc);
      var cells = b3.querySelectorAll('#sc-corr .c'); cells.forEach(function (c) { c.classList.remove('on'); }); cells[0].classList.add('on');
    }
    function sOne(animate) {
      clearInterval(sAnim);
      var r = corrEpisode(sst, sUse(), sRand); sK++; sLast = r; sDraw();
      if (!animate) return;
      // phát lại các ô đã đi qua
      var cells = b3.querySelectorAll('#sc-corr .c'), i = 0, s = 0, path = [0];
      r.tr.forEach(function (o) { s = corrStep(s, o.r); path.push(s); });
      path = path.slice(0, 40);
      sAnim = setInterval(function () {
        cells.forEach(function (c, k) { c.classList.toggle('on', k === path[i]); });
        if (++i >= path.length) clearInterval(sAnim);
      }, 120);
    }
    var sCmp = null;
    function sCompare() {
      var btn = b3.querySelector('#sc-cmp'); btn.disabled = true; btn.textContent = 'Đang chạy…';
      setTimeout(function () {
        var R = 50, E = 500, res = {};
        [false, true].forEach(function (useB) {
          var acc = new Array(E).fill(0), rand = seeded(useB ? 31 : 37);
          for (var i = 0; i < R; i++) { var st = { th: Math.log(P0 / (1 - P0)), w: 0 }; for (var e = 0; e < E; e++) acc[e] += -corrEpisode(st, useB, rand).T / R; }
          res[useB] = acc.map(function (_, i) { var s = 0, n = 0; for (var j = Math.max(0, i - 9); j <= i; j++) { s += acc[j]; n++; } return s / n; });
        });
        sCmp = res; drawSCmp();
        btn.disabled = false; btn.textContent = 'Chạy lại so sánh';
      }, 30);
    }
    function drawSCmp() {
      if (!sCmp) return;
      lineChart(b3.querySelector('#sc-chart'), {
        series: [{ name: 'REINFORCE', color: 'var(--s2)', values: sCmp[false] }, { name: '+ đường cơ sở', color: 'var(--s1)', values: sCmp[true] }],
        yMin: -90, yMax: 0, yTicks: [-90, -60, -30, 0], xLabel: 'Tập', tipDec: 1, refs: [{ y: jopt, label: 'tối ưu ≈ ' + fmtNum(jopt, 1) }],
        aria: 'Tổng phần thưởng mỗi tập của REINFORCE có và không có đường cơ sở'
      });
    }
    seg(algEl, sReset);
    b3.querySelector('#sc-one').onclick = function () { sOne(true); };
    b3.querySelector('#sc-many').onclick = function () { clearInterval(sAnim); for (var i = 0; i < 50; i++) { var r = corrEpisode(sst, sUse(), sRand); sK++; sLast = r; } sDraw(); };
    b3.querySelector('#sc-reset').onclick = sReset;
    b3.querySelector('#sc-cmp').onclick = sCompare;
    onResize(function () { sDraw(); drawSCmp(); });
    sReset();

    ctx.typeset(root);
  }

  // ======================================================================
  // TAB "Sơ đồ"
  // ======================================================================
  function renderMap(root, ctx) {
    root.innerHTML = '';
    root.classList.add('rx');
    var GR = '#8a94a3', BL = '#2a78d6';

    // ---- 1. Vì sao không cần mô hình môi trường ----
    var m1 = h('<section class="blk"><h2>Vì sao không cần biết môi trường?</h2>' +
      '<p class="lead">Màu <b style="color:' + BL + '">xanh</b>: phần của diễn viên (phụ thuộc $\\theta$). Màu <b style="color:' + GR + '">xám</b>: phần của môi trường. Bấm lần lượt ba bước.</p>' +
      '<div class="steps3 seg" id="lg-st"><button type="button" data-v="0" aria-pressed="true">① Xác suất quỹ đạo</button><button type="button" data-v="1" aria-pressed="false">② Lấy $\\log$</button><button type="button" data-v="2" aria-pressed="false">③ Lấy $\\nabla_\\theta$</button></div>' +
      '<div class="calc" id="lg-tex"></div><div class="insight" id="lg-ins"></div></section>');
    root.appendChild(m1);
    var env = function (s) { return '\\color{' + GR + '}{' + s + '}'; }, act = function (s) { return '\\color{' + BL + '}{' + s + '}'; };
    var LG = [
      ['p_\\theta(\\tau) = ' + env('p(s_1)') + '\\,' + act('p_\\theta(a_1 \\mid s_1)') + '\\,' + env('p(s_2 \\mid s_1, a_1)') + '\\,' + act('p_\\theta(a_2 \\mid s_2)') + '\\,' + env('p(s_3 \\mid s_2, a_2)') + '\\cdots',
       'Một tích: xen kẽ phần của môi trường và phần của diễn viên. Tích thì khó lấy đạo hàm.'],
      ['\\log p_\\theta(\\tau) = ' + env('\\log p(s_1)') + ' + ' + act('\\textstyle\\sum_t \\log p_\\theta(a_t \\mid s_t)') + ' + ' + env('\\textstyle\\sum_t \\log p(s_{t+1} \\mid s_t, a_t)'),
       'Lấy $\\log$ biến tích thành <b>tổng</b>: các phần tách rời nhau.'],
      ['\\nabla_\\theta \\log p_\\theta(\\tau) = \\underbrace{' + env('\\nabla_\\theta\\log p(s_1)') + '}_{=\\,0} + ' + act('\\textstyle\\sum_t \\nabla_\\theta\\log p_\\theta(a_t \\mid s_t)') + ' + \\underbrace{' + env('\\textstyle\\sum_t \\nabla_\\theta\\log p(s_{t+1} \\mid s_t, a_t)') + '}_{=\\,0}',
       'Phần môi trường không chứa $\\theta$ nên gradient bằng 0. Chỉ còn gradient của mạng chính sách, thứ ta tự tính được: <b>không cần mô hình môi trường</b>.']
    ];
    function lgDraw(i) { katexBlock(m1.querySelector('#lg-tex'), LG[i][0]); m1.querySelector('#lg-ins').innerHTML = LG[i][1]; ctx.typeset(m1.querySelector('#lg-ins')); }
    seg(m1.querySelector('#lg-st'), function (v) { lgDraw(+v); });
    lgDraw(0);

    // ---- 2. Phân loại có trọng số ----
    var m2 = h('<section class="blk"><h2>Gradient chính sách = phân loại có trọng số</h2>' +
      '<p class="lead">Mạng ra $\\pi = [0{,}2;\\ 0{,}5;\\ 0{,}3]$ (hình 4.14). Chọn hành động đã lấy mẫu (đóng vai “nhãn”) và trọng số $G_t$, rồi xem một bước giảm gradient trên mất mát $-G_t\\log\\pi(a_t)$ đẩy xác suất đi đâu ($\\eta = 0{,}5$).</p>' +
      '<div class="ctrl"><label>Hành động</label><div class="seg" id="wc-a"><button type="button" data-v="0" aria-pressed="false">trái</button><button type="button" data-v="1" aria-pressed="true">giữa</button><button type="button" data-v="2" aria-pressed="false">phải</button></div></div>' +
      '<div class="ctrl"><label for="wc-g">$G_t$</label><input id="wc-g" type="range" min="-3" max="3" step="0.5" value="2"><span class="val" id="wc-g-v"></span></div>' +
      '<div class="bars" id="wc-bars"></div><div class="calc" id="wc-calc"></div><div class="insight" id="wc-ins"></div></section>');
    root.appendChild(m2);
    var TH0 = [Math.log(0.2), Math.log(0.5), Math.log(0.3)], ETA = 0.5, NM = ['trái', 'giữa', 'phải'];
    function wcDraw() {
      var a = +segVal(m2.querySelector('#wc-a')), G = +m2.querySelector('#wc-g').value;
      m2.querySelector('#wc-g-v').textContent = fmtNum(G, 1);
      var p = softmax(TH0), e = [0, 0, 0]; e[a] = 1;
      var gl = e.map(function (x, k) { return x - p[k]; }), th = TH0.map(function (t, k) { return t + ETA * G * gl[k]; }), q = softmax(th);
      m2.querySelector('#wc-bars').innerHTML = q.map(function (v, k) {
        var d = v - p[k];
        return '<div class="bar' + (k === a ? ' picked' : '') + '"><div class="track"><div class="fill" style="height:' + (v * 100).toFixed(1) + '%"></div><div class="ghost" style="bottom:' + (p[k] * 100).toFixed(1) + '%"></div></div>' +
          '<div class="pv">' + NM[k] + ': ' + fmtNum(v, 3) + '</div><div class="dv ' + (d > 1e-9 ? 'up' : d < -1e-9 ? 'down' : '') + '">' + (d > 1e-9 ? '▲ +' : d < -1e-9 ? '▼ −' : '') + (Math.abs(d) > 1e-9 ? fmtNum(Math.abs(d), 3) : 'không đổi') + '</div></div>';
      }).join('');
      var loss = -G * Math.log(p[a]);
      katexBlock(m2.querySelector('#wc-calc'), '\\begin{aligned}&\\text{mất mát} = -G_t\\,e_{a_t}\\cdot\\log\\pi = -' + tex(G, 1) + '\\cdot\\log ' + texRaw(p[a], 1) + ' = ' + texRaw(loss, 3) + '\\\\' +
        '&\\nabla_\\theta\\log\\pi(a_t) = e_{a_t} - \\pi = ' + vec(gl, 2) + '\\\\' +
        '&\\theta \\leftarrow \\theta - \\eta\\,\\nabla_\\theta(\\text{mất mát}) = \\theta + \\eta\\,G_t\\,(e_{a_t} - \\pi)\\\\' +
        '&\\pi_{\\text{mới}} = ' + vec(q, 3) + '\\end{aligned}');
      m2.querySelector('#wc-ins').innerHTML = G > 0 ? 'Giống phân loại thường với nhãn là hành động <b>' + NM[a] + '</b>: xác suất của nó tăng, các hành động khác giảm. $G_t$ càng lớn, bước càng mạnh.'
        : G < 0 ? '$G_t < 0$: bước đi <b>ngược</b> với phân loại thường. Hành động <b>' + NM[a] + '</b> bị đẩy xuống, nhường xác suất cho các hành động khác. Phân loại có giám sát không bao giờ làm vậy, vì nhãn của nó luôn đúng.'
        : '$G_t = 0$: mẫu này không đóng góp gì vào gradient.';
      ctx.typeset(m2.querySelector('#wc-ins'));
    }
    seg(m2.querySelector('#wc-a'), wcDraw);
    m2.querySelector('#wc-g').oninput = wcDraw;
    wcDraw();

    // ---- 3. Trọng số tiến hóa ----
    var STEPS = [
      ['R(\\tau^n)', 'Mọi bước của ván dùng chung tổng phần thưởng (4.4).', ''],
      ['R(\\tau^n) - b', 'Mẹo 1, đường cơ sở: phần thưởng luôn dương thì trọng số vẫn có cả dương lẫn âm; hành động không được lấy mẫu không bị thiệt.', '4.2.1'],
      ['\\textstyle\\sum_{t\'=t}^{T_n} r_{t\'}^n - b', 'Mẹo 2, gán điểm: chỉ tính phần thưởng <b>sau</b> hành động.', '4.2.2'],
      ['\\textstyle\\sum_{t\'=t}^{T_n} \\gamma^{t\'-t} r_{t\'}^n - b', 'Chiết khấu: hành động càng xa thì càng ít công.', '4.2.2'],
      ['A^\\theta(s_t, a_t)', 'Gộp lại thành <b>hàm lợi thế</b>; $b$ phụ thuộc trạng thái, do một mạng <b>nhà phê bình</b> ước lượng → diễn viên-nhà phê bình (chương 9).', '4.2.2']
    ];
    var m3 = h('<section class="blk"><h2>Trọng số trước $\\nabla\\log p_\\theta(a_t \\mid s_t)$ được cải tiến thế nào</h2>' +
      '<p class="lead">Cả chương chỉ thay đổi một chỗ trong công thức $\\frac{1}{N}\\sum_n\\sum_t\\ \\boxed{\\ ?\\ }\\ \\nabla\\log p_\\theta(a_t^n \\mid s_t^n)$.</p>' +
      '<div class="flow">' + STEPS.map(function (s, i) {
        return (i ? '<div class="fa">↓</div>' : '') + '<div class="fb' + (i === STEPS.length - 1 ? ' eq' : '') + '"><div class="fx">$' + s[0] + '$' + (s[2] ? ' <span class="rxs">· mục ' + s[2] + '</span>' : '') + '</div><div class="fy">' + s[1] + '</div></div>';
      }).join('') + '</div>' +
      '<p class="rxs" style="margin:10px 0 0">REINFORCE (4.3) dùng $G_t$, chính là dòng thứ tư với $b = 0$.</p></section>');
    root.appendChild(m3);

    // ---- 4. So sánh với chương 3 ----
    var m4 = h('<section class="blk"><h2>Dựa trên giá trị (chương 3) và dựa trên chính sách (chương 4)</h2>' +
      '<div class="tscroll"><table class="cmp"><thead><tr><th></th><th>Dựa trên giá trị<br><span class="rxs">Sarsa, Q-learning</span></th><th>Dựa trên chính sách<br><span class="rxs">REINFORCE</span></th></tr></thead><tbody>' +
      [['Học cái gì', '$Q(s, a)$', '$\\pi_\\theta(a \\mid s)$ trực tiếp'],
       ['Chọn hành động', '$\\arg\\max_a Q(s, a)$ (+ $\\varepsilon$)', 'Lấy mẫu từ $\\pi_\\theta$'],
       ['Chính sách ngẫu nhiên tối ưu', 'Không biểu diễn được', 'Được (hành lang ngắn)'],
       ['Hành động liên tục', 'Khó (phải tìm $\\max$)', 'Tự nhiên (phân phối liên tục)'],
       ['Thay đổi khi cập nhật', 'Có thể nhảy đột ngột (đổi $\\arg\\max$)', 'Mượt theo $\\theta$'],
       ['Dữ liệu', 'Q-learning: dùng lại được (off-policy)', 'Dùng một lần (on-policy)'],
       ['Điểm yếu', 'Thiên lệch do bootstrapping', 'Phương sai lớn → cần đường cơ sở']
      ].map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>'; }).join('') +
      '</tbody></table></div></section>');
    root.appendChild(m4);
    ctx.typeset(root);
  }

  window.ReviewExtras = {
    tabs: [
      { id: 'lab', label: 'Thí nghiệm', render: renderLab },
      { id: 'map', label: 'Sơ đồ', render: renderMap }
    ]
  };
})();
