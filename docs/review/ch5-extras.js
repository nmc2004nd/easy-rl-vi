/* Thí nghiệm tương tác và sơ đồ trực quan cho chương 5 (PPO).
 * Trang index.html tải file này khi ch5.json có "extras": "ch5-extras.js".
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
  var css5 = String.raw`
  .rx .c3 { --c3:#1f9d6b; }
  .rx svg.plot { display: block; width: 100%; height: auto; overflow: visible; }
  .rx svg.plot text { fill: var(--muted); font-size: 11px; font-family: inherit; }
  .rx svg.plot .lbl { fill: var(--text); font-weight: 600; }
  .rx .stat3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; margin-top: 10px; }
  .rx .stat3 > div { background: var(--surface-2); border-radius: 10px; padding: 8px 10px; font-size: .86rem; }
  .rx .stat3 b { display: block; font-size: 1.05rem; font-variant-numeric: tabular-nums; }
  .rx table.cmp tbody tr { cursor: default; }
  .rx .tl2 { display: grid; gap: 10px; }
  .rx .tl2 .row { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
  .rx .tl2 .nm { font-weight: 700; min-width: 11em; }
  .rx .tl2 .bx { border-radius: 8px; padding: 4px 9px; font-size: .84rem; background: var(--surface-2); }
  .rx .tl2 .bx.s { background: var(--accent-soft); color: var(--accent-text); font-weight: 600; }
  .rx .tl2 .bx.u { background: var(--hl-soft, #fbf1dc); }
  .rx .tl2 .bx.x { color: var(--muted); text-decoration: line-through; }`;
  var st5 = document.createElement('style'); st5.textContent = css5; document.head.appendChild(st5);
  var C3 = '#1f9d6b';

  // ---- 1. Importance sampling: p = N(−1, 1), q = N(μ_q, 1), f(x) = x ----
  var MP = -1;
  function phi(x, m) { return Math.exp(-0.5 * (x - m) * (x - m)) / Math.sqrt(2 * Math.PI); }
  function gauss(r) { var u = r() || 1e-12, v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  // phương sai của một mẫu f·p/q dưới q: e^{d²}(1 + m²) − (E_p f)², với d = μ_p − μ_q, m = 2μ_p − μ_q
  function isVar(mq) { var d = MP - mq, m = 2 * MP - mq; return Math.exp(d * d) * (1 + m * m) - MP * MP; }

  // ---- 3. Dùng lại dữ liệu: bài toán 3 hành động ----
  var MU = [1, 1.25, 1.5], NB = 16, EP = 20, LR = 1, EPS = 0.2, BETA = 3;
  function klDiv(p, q) { var s = 0; for (var i = 0; i < p.length; i++) s += p[i] * Math.log(p[i] / q[i]); return s; }
  function Jtrue(th) { var p = softmax(th); return p[0] * MU[0] + p[1] * MU[1] + p[2] * MU[2]; }
  // một vòng: lấy mẫu NB từ π_k, A = R − trung bình lô, rồi các epoch đi lên theo gradient của mục tiêu
  function ppoRound(th, meth, rand, trace) {
    var pk = softmax(th), smp = [];
    for (var n = 0; n < NB; n++) { var u = rand(), a = u < pk[0] ? 0 : u < pk[0] + pk[1] ? 1 : 2; smp.push({ a: a, R: MU[a] + gauss(rand) }); }
    var mean = smp.reduce(function (s, o) { return s + o.R; }, 0) / NB;
    smp.forEach(function (o) { o.A = o.R - mean; });
    var t = th.slice(), E = meth === 'pg' ? 1 : EP, tr = [];
    if (trace) tr.push({ p: pk.slice(), kl: 0, clipped: 0 });
    for (var e = 0; e < E; e++) {
      var p = softmax(t), g = [0, 0, 0], nclip = 0;
      smp.forEach(function (o) {
        var r = p[o.a] / pk[o.a], coef = r * o.A;
        if (meth === 'clip') { var cl = Math.min(Math.max(r, 1 - EPS), 1 + EPS); if (cl * o.A < r * o.A) { coef = 0; nclip++; } }
        for (var k = 0; k < 3; k++) g[k] += coef * ((k === o.a ? 1 : 0) - p[k]) / NB;
      });
      if (meth === 'pen') for (var k2 = 0; k2 < 3; k2++) g[k2] -= BETA * (p[k2] - pk[k2]);
      for (var k3 = 0; k3 < 3; k3++) t[k3] += LR * g[k3];
      if (trace) { var q = softmax(t); tr.push({ p: q, kl: klDiv(pk, q), clipped: nclip }); }
    }
    return { th: t, smp: smp, pk: pk, trace: tr };
  }

  function renderLab(root, ctx) {
    root.innerHTML = '';
    root.classList.add('rx');

    // ============ 1. Importance sampling ============
    var b1 = h('<section class="blk">' +
      '<h2>1. Importance sampling và phương sai (hình 5.1)</h2>' +
      '<p class="lead">Muốn tính $\\mathbb{E}_{x\\sim p}[f(x)]$ với $p = \\mathcal N(-1, 1)$ và $f(x) = x$ (đáp án: $-1$), nhưng chỉ lấy mẫu được từ $q = \\mathcal N(\\mu_q, 1)$. Ước lượng: $\\frac{1}{N}\\sum_i f(x^i)\\frac{p(x^i)}{q(x^i)}$ với $x^i \\sim q$. Kéo $q$ ra xa $p$ để thấy chuyện gì xảy ra.</p>' +
      '<div class="ctrl"><label for="is-mq">$\\mu_q$</label><input id="is-mq" type="range" min="-1" max="3" step="0.25" value="2"><span class="val" id="is-mq-v"></span></div>' +
      '<div class="ctrl"><label>Số mẫu $N$</label><div class="seg" id="is-n"><button type="button" data-v="5" aria-pressed="false">5</button><button type="button" data-v="20" aria-pressed="true">20</button><button type="button" data-v="100" aria-pressed="false">100</button><button type="button" data-v="1000" aria-pressed="false">1000</button></div>' +
      '<button type="button" class="btn pri" id="is-one">Lấy mẫu 1 lần</button><button type="button" class="btn" id="is-many">Lặp 1000 lần</button></div>' +
      '<div class="legend"><span class="li"><span class="sw" style="background:var(--s1)"></span>$p(x)$</span><span class="li"><span class="sw" style="background:' + C3 + '"></span>$q(x)$</span><span class="li"><span class="sw dot" style="background:var(--s2)"></span>mẫu, kích thước ∝ trọng số $p/q$</span><span class="li">nền cam: $f(x) < 0$; nền xanh: $f(x) > 0$</span></div>' +
      '<div class="chart" id="is-plot"></div>' +
      '<div class="calc" id="is-calc"></div>' +
      '<h3 class="sub">Phân bố của ước lượng (1000 lần lặp)</h3>' +
      '<div class="chart" id="is-hist"></div>' +
      '<div class="stat3" id="is-stat"></div>' +
      '<div class="insight" id="is-ins"></div></section>');
    root.appendChild(b1);
    var mqEl = b1.querySelector('#is-mq'), nEl = b1.querySelector('#is-n'), isLast = null, isHist = null, isRand = seeded(21);
    function mq() { return +mqEl.value; }
    function nIS() { return +segVal(nEl); }
    function isSample(n, keep) {
      var s = 0, pts = [], m = mq();
      for (var i = 0; i < n; i++) { var x = m + gauss(isRand), w = phi(x, MP) / phi(x, m); s += x * w; if (keep) pts.push({ x: x, w: w }); }
      return { est: s / n, pts: pts };
    }
    function drawPlot() {
      var box = b1.querySelector('#is-plot'), W = Math.max(300, box.clientWidth), H = 210, m = { l: 34, r: 10, t: 10, b: 40 };
      var x0 = -4.5, x1 = 6, iw = W - m.l - m.r, ih = H - m.t - m.b;
      var X = function (v) { return m.l + (v - x0) / (x1 - x0) * iw; }, Y = function (v) { return m.t + ih - v / 0.45 * ih; };
      var s = '<svg class="plot" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Mật độ p, q và các mẫu">';
      s += '<rect x="' + X(x0) + '" y="' + m.t + '" width="' + (X(0) - X(x0)) + '" height="' + ih + '" fill="var(--s2)" fill-opacity=".07"/>';
      s += '<rect x="' + X(0) + '" y="' + m.t + '" width="' + (X(x1) - X(0)) + '" height="' + ih + '" fill="' + C3 + '" fill-opacity=".07"/>';
      s += '<line x1="' + X(x0) + '" x2="' + X(x1) + '" y1="' + Y(0) + '" y2="' + Y(0) + '" stroke="var(--border)"/>';
      for (var t = -4; t <= 6; t += 2) s += '<text x="' + X(t) + '" y="' + (H - m.b + 14) + '" text-anchor="middle">' + t + '</text>';
      s += '<text x="' + (m.l + iw / 2) + '" y="' + (H - 4) + '" text-anchor="middle">x</text>';
      [[MP, 'var(--s1)', 'p'], [mq(), C3, 'q']].forEach(function (d) {
        var path = ''; for (var i = 0; i <= 200; i++) { var xv = x0 + (x1 - x0) * i / 200; path += (i ? 'L' : 'M') + X(xv).toFixed(1) + ' ' + Y(phi(xv, d[0])).toFixed(1); }
        s += '<path d="' + path + '" fill="none" stroke="' + d[1] + '" stroke-width="2.2"/><text class="lbl" x="' + X(d[0]) + '" y="' + (Y(phi(d[0], d[0])) - 6) + '" text-anchor="middle">' + d[2] + '</text>';
      });
      if (isLast) {
        var mx = Math.max.apply(null, isLast.pts.map(function (o) { return o.w; }).concat([1]));
        isLast.pts.slice(0, 300).forEach(function (o) {
          if (o.x < x0 || o.x > x1) return;
          var r = 2 + 9 * Math.sqrt(o.w / mx);
          s += '<circle cx="' + X(o.x).toFixed(1) + '" cy="' + (H - m.b - 8) + '" r="' + r.toFixed(1) + '" fill="var(--s2)" fill-opacity=".55" stroke="var(--surface)" stroke-width="1"/>';
        });
      }
      s += '</svg>';
      box.innerHTML = s;
    }
    function drawCalc() {
      var el = b1.querySelector('#is-calc');
      if (!isLast) { el.innerHTML = '<span class="rxs">Bấm “Lấy mẫu 1 lần”.</span>'; return; }
      var show = isLast.pts.slice(0, 4).map(function (o) { return texRaw(o.x, 2) + '\\cdot' + texRaw(o.w, 3); }).join(' + ');
      var wmax = Math.max.apply(null, isLast.pts.map(function (o) { return o.w; }));
      katexBlock(el, '\\begin{aligned}&\\hat\\mu = \\tfrac{1}{' + nIS() + '}\\big(' + show + (nIS() > 4 ? ' + \\cdots' : '') + '\\big) = ' + texRaw(isLast.est, 3) + '\\qquad(\\text{đúng: } -1)\\\\' +
        '&\\text{trọng số lớn nhất } \\max_i \\tfrac{p(x^i)}{q(x^i)} = ' + texRaw(wmax, 3) + '\\end{aligned}');
    }
    function drawHist() {
      var box = b1.querySelector('#is-hist'), stat = b1.querySelector('#is-stat'), ins = b1.querySelector('#is-ins');
      var v = isVar(mq()), sdTheory = Math.sqrt(v / nIS());
      if (!isHist) {
        box.innerHTML = '';
        stat.innerHTML = '<div>Phương sai một mẫu (lý thuyết)<b>' + fmtNum(v, v > 100 ? 0 : 2) + '</b></div><div>Nếu lấy mẫu thẳng từ $p$<b>1</b></div><div>Độ lệch chuẩn của $\\hat\\mu$ với $N = ' + nIS() + '$<b>' + fmtNum(sdTheory, 2) + '</b></div>';
        ins.innerHTML = 'Bấm “Lặp 1000 lần” để xem 1000 ước lượng phân bố ra sao.';
        ctx.typeset(stat); ctx.typeset(ins); return;
      }
      var est = isHist, lo = -4, hi = 2, nb = 40, cnt = new Array(nb).fill(0), out = 0;
      est.forEach(function (e) { var k = Math.floor((e - lo) / (hi - lo) * nb); if (k < 0 || k >= nb) { out++; k = Math.max(0, Math.min(nb - 1, k)); } cnt[k]++; });
      var W = Math.max(300, box.clientWidth), H = 150, m = { l: 34, r: 10, t: 8, b: 26 }, iw = W - m.l - m.r, ih = H - m.t - m.b, mx = Math.max.apply(null, cnt);
      var X = function (v) { return m.l + (v - lo) / (hi - lo) * iw; };
      var s = '<svg class="plot" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Phân bố các ước lượng">';
      cnt.forEach(function (c, k) { var hgt = c / mx * ih; s += '<rect x="' + (X(lo + k * (hi - lo) / nb) + 1).toFixed(1) + '" y="' + (m.t + ih - hgt).toFixed(1) + '" width="' + (iw / nb - 2).toFixed(1) + '" height="' + hgt.toFixed(1) + '" rx="2" fill="var(--s2)" fill-opacity=".8"/>'; });
      s += '<line x1="' + X(-1) + '" x2="' + X(-1) + '" y1="' + m.t + '" y2="' + (m.t + ih) + '" stroke="var(--text)" stroke-width="2" stroke-dasharray="4 3"/><text class="lbl" x="' + (X(-1) + 4) + '" y="' + (m.t + 10) + '">đúng = −1</text>';
      s += '<line x1="' + X(0) + '" x2="' + X(0) + '" y1="' + m.t + '" y2="' + (m.t + ih) + '" stroke="var(--border)"/>';
      for (var t = -4; t <= 2; t++) s += '<text x="' + X(t) + '" y="' + (H - 8) + '" text-anchor="middle">' + t + '</text>';
      s += '</svg>';
      box.innerHTML = s;
      var mean = est.reduce(function (a, b) { return a + b; }, 0) / est.length, med = quant(est, 0.5), pos = est.filter(function (e) { return e > 0; }).length / est.length;
      stat.innerHTML = '<div>Trung bình 1000 ước lượng<b>' + fmtNum(mean, 3) + '</b></div><div>Trung vị<b>' + fmtNum(med, 3) + '</b></div><div>Tỉ lệ ước lượng <b style="display:inline">sai dấu</b> ($> 0$)<b>' + fmtNum(pos * 100, 1) + '%</b></div>' +
        '<div>Phương sai một mẫu (lý thuyết)<b>' + fmtNum(v, v > 100 ? 0 : 2) + '</b></div><div>Độ lệch chuẩn của $\\hat\\mu$ (lý thuyết)<b>' + fmtNum(sdTheory, 2) + '</b></div>' + (out ? '<div>Ngoài khoảng vẽ $[-4, 2]$<b>' + out + '</b></div>' : '');
      var d = Math.abs(mq() - MP);
      ins.innerHTML = d < 0.6 ? '$q$ gần $p$: trọng số quanh 1, các ước lượng tập trung quanh $-1$. Phương sai gần bằng khi lấy mẫu thẳng từ $p$.'
        : d < 2.1 ? '$q$ đã lệch: phần lớn mẫu nằm ở vùng $f > 0$ với trọng số nhỏ, thỉnh thoảng một mẫu bên trái mang trọng số lớn kéo kết quả về. Trung bình vẫn gần $-1$ nhưng phân bố rộng ra.'
        : '$q$ lệch xa: phần lớn ước lượng nằm <b>gần 0 hoặc dương</b> (trung vị ' + fmtNum(med, 2) + '), trong khi đáp án là $-1$; số ít lần “trúng” mẫu bên trái thì cho số âm rất lớn. Phương sai một mẫu là $e^{d^2}(1 + m^2) - 1$ với $d = \\mu_p - \\mu_q$, tăng theo hàm mũ. Đây chính là hình 5.1 và lý do PPO giữ $\\theta$ gần $\\theta\'$.';
      ctx.typeset(stat); ctx.typeset(ins);
    }
    function isAll() { b1.querySelector('#is-mq-v').textContent = fmtNum(mq(), 2); drawPlot(); drawCalc(); drawHist(); }
    mqEl.oninput = function () { isLast = null; isHist = null; isAll(); };
    seg(nEl, function () { isLast = null; isHist = null; isAll(); });
    b1.querySelector('#is-one').onclick = function () { isLast = isSample(nIS(), true); drawPlot(); drawCalc(); };
    b1.querySelector('#is-many').onclick = function () { var a = []; for (var i = 0; i < 1000; i++) a.push(isSample(nIS(), false).est); isHist = a; drawHist(); };
    onResize(isAll);
    isAll();

    // ============ 2. Hàm cắt ============
    var b2 = h('<section class="blk">' +
      '<h2>2. Hàm mục tiêu của PPO-clip (hình 5.2–5.3)</h2>' +
      '<p class="lead">Một số hạng của (5.8): $L(r) = \\min\\big(rA,\\ \\operatorname{clip}(r, 1-\\varepsilon, 1+\\varepsilon)A\\big)$ với $r = \\frac{p_\\theta(a_t \\mid s_t)}{p_{\\theta^k}(a_t \\mid s_t)}$. Đổi dấu $A$ để chuyển giữa hình 5.3a và 5.3b; vùng tô xám là nơi gradient theo $r$ bằng 0.</p>' +
      '<div class="ctrl"><label for="cl-a">$A$</label><input id="cl-a" type="range" min="-2" max="2" step="0.5" value="1"><span class="val" id="cl-a-v"></span>' +
      '<label for="cl-e">$\\varepsilon$</label><input id="cl-e" type="range" min="0.1" max="0.4" step="0.05" value="0.2"><span class="val" id="cl-e-v"></span></div>' +
      '<div class="ctrl"><label for="cl-r">$r$</label><input id="cl-r" type="range" min="0" max="2" step="0.01" value="1.5"><span class="val" id="cl-r-v"></span></div>' +
      '<div class="legend"><span class="li"><span class="sw" style="background:' + C3 + '"></span>$rA$</span><span class="li"><span class="sw" style="background:var(--s1)"></span>$\\operatorname{clip}(r)A$</span><span class="li"><span class="sw" style="background:var(--s2);height:4px"></span>$L(r) = \\min(\\cdot,\\cdot)$</span></div>' +
      '<div class="chart" id="cl-plot"></div><div class="calc" id="cl-calc"></div><div class="insight" id="cl-ins"></div></section>');
    root.appendChild(b2);
    function clAll() {
      var A = +b2.querySelector('#cl-a').value, e = +b2.querySelector('#cl-e').value, r0 = +b2.querySelector('#cl-r').value;
      b2.querySelector('#cl-a-v').textContent = fmtNum(A, 1); b2.querySelector('#cl-e-v').textContent = fmtNum(e, 2); b2.querySelector('#cl-r-v').textContent = fmtNum(r0, 2);
      var clip = function (r) { return Math.min(Math.max(r, 1 - e), 1 + e); }, L = function (r) { return Math.min(r * A, clip(r) * A); };
      var box = b2.querySelector('#cl-plot'), W = Math.max(300, box.clientWidth), H = 230, m = { l: 40, r: 12, t: 12, b: 34 }, iw = W - m.l - m.r, ih = H - m.t - m.b;
      var yr = Math.max(0.5, Math.abs(A) * 2), X = function (v) { return m.l + v / 2 * iw; }, Y = function (v) { return m.t + ih - (v + yr) / (2 * yr) * ih; };
      var s = '<svg class="plot" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Hàm mục tiêu PPO-clip theo r">';
      // vùng gradient bằng 0
      if (A > 0) s += '<rect x="' + X(1 + e) + '" y="' + m.t + '" width="' + (X(2) - X(1 + e)) + '" height="' + ih + '" fill="var(--muted)" fill-opacity=".12"/>';
      if (A < 0) s += '<rect x="' + X(0) + '" y="' + m.t + '" width="' + (X(1 - e) - X(0)) + '" height="' + ih + '" fill="var(--muted)" fill-opacity=".12"/>';
      [-yr, -yr / 2, 0, yr / 2, yr].forEach(function (v) { s += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="var(--border)"/><text x="' + (m.l - 6) + '" y="' + (Y(v) + 4) + '" text-anchor="end">' + fmtNum(v, 1) + '</text>'; });
      [0, 1 - e, 1, 1 + e, 2].forEach(function (v) { s += '<line x1="' + X(v) + '" x2="' + X(v) + '" y1="' + m.t + '" y2="' + (m.t + ih) + '" stroke="var(--border)" stroke-dasharray="' + (v === 1 - e || v === 1 + e ? '3 3' : '') + '"/><text x="' + X(v) + '" y="' + (H - m.b + 14) + '" text-anchor="middle">' + fmtNum(v, 2) + '</text>'; });
      s += '<text x="' + (m.l + iw / 2) + '" y="' + (H - 2) + '" text-anchor="middle">r = p_θ / p_θᵏ</text>';
      function path(fn) { var d = ''; for (var i = 0; i <= 200; i++) { var r = 2 * i / 200; d += (i ? 'L' : 'M') + X(r).toFixed(1) + ' ' + Y(fn(r)).toFixed(1); } return d; }
      s += '<path d="' + path(function (r) { return r * A; }) + '" fill="none" stroke="' + C3 + '" stroke-width="1.8" stroke-dasharray="6 4"/>';
      s += '<path d="' + path(function (r) { return clip(r) * A; }) + '" fill="none" stroke="var(--s1)" stroke-width="1.8"/>';
      s += '<path d="' + path(L) + '" fill="none" stroke="var(--s2)" stroke-width="3.5" stroke-linejoin="round" stroke-opacity=".9"/>';
      s += '<circle cx="' + X(r0) + '" cy="' + Y(L(r0)) + '" r="6" fill="var(--s2)" stroke="var(--surface)" stroke-width="2"/></svg>';
      box.innerHTML = s;
      var unc = r0 * A, cl = clip(r0) * A, val = Math.min(unc, cl), clipped = cl < unc - 1e-12, grad = A === 0 ? 0 : clipped ? 0 : A;
      katexBlock(b2.querySelector('#cl-calc'), '\\begin{aligned}&L(' + texRaw(r0, 2) + ') = \\min\\big(' + texRaw(r0, 2) + '\\cdot' + tex(A, 1) + ',\\ \\operatorname{clip}(' + texRaw(r0, 2) + ', ' + texRaw(1 - e, 2) + ', ' + texRaw(1 + e, 2) + ')\\cdot' + tex(A, 1) + '\\big) = \\min(' + texRaw(unc, 2) + ',\\ ' + texRaw(cl, 2) + ') = ' + texRaw(val, 2) + '\\\\' +
        '&\\frac{\\mathrm{d}L}{\\mathrm{d}r} = ' + texRaw(grad, 1) + (clipped ? '\\quad(\\text{bị cắt})' : '') + '\\end{aligned}');
      var ins = b2.querySelector('#cl-ins');
      if (A === 0) ins.innerHTML = '$A = 0$: mẫu này không đóng góp gì.';
      else if (A > 0) ins.innerHTML = r0 > 1 + e ? 'Hành động tốt ($A > 0$) và $r$ đã vượt $1+\\varepsilon$: mục tiêu phẳng, gradient bằng 0, <b>không đẩy thêm</b>. Đây là chỗ PPO “phanh”.' : r0 < 1 ? 'Hành động tốt nhưng xác suất đang <b>thấp hơn</b> chính sách cũ ($r < 1$): không cắt, gradient vẫn kéo $r$ lên. $\\min$ chọn đường xanh lá (thấp hơn).' : 'Trong đoạn $[1, 1+\\varepsilon]$: mục tiêu vẫn tăng theo $r$, gradient bằng $A$.';
      else ins.innerHTML = r0 < 1 - e ? 'Hành động tồi ($A < 0$) và $r$ đã xuống dưới $1-\\varepsilon$: mục tiêu phẳng, <b>không giảm thêm</b>.' : r0 > 1 ? 'Hành động tồi nhưng xác suất đang <b>cao hơn</b> chính sách cũ ($r > 1$): không cắt, gradient vẫn kéo $r$ xuống. Đây là lý do cần $\\min$: chỉ dùng số hạng cắt thì vùng này gradient bằng 0, không sửa được sai lầm.' : 'Trong đoạn $[1-\\varepsilon, 1]$: mục tiêu vẫn tăng khi $r$ giảm, gradient bằng $A$.';
      ctx.typeset(ins);
    }
    ['#cl-a', '#cl-e', '#cl-r'].forEach(function (id) { b2.querySelector(id).oninput = clAll; });
    onResize(clAll);
    clAll();

    // ============ 3. Dùng lại dữ liệu ============
    var MN = { is: 'Chỉ importance sampling (không cắt)', clip: 'PPO-clip ($\\varepsilon = 0{,}2$)', pen: 'PPO-penalty ($\\beta = 3$)', pg: 'Gradient chính sách thường' };
    var b3 = h('<section class="blk">' +
      '<h2>3. Cập nhật nhiều lần trên cùng một lô dữ liệu</h2>' +
      '<p class="lead">Bài toán một trạng thái, ba hành động $a, b, c$ với phần thưởng trung bình $1;\\ 1{,}25;\\ 1{,}5$ cộng nhiễu chuẩn (độ lệch chuẩn 1). Mỗi vòng: chính sách $\\theta^k$ lấy mẫu ' + NB + ' hành động, ước lượng $A = R - \\bar R_{\\text{lô}}$, rồi đi lên theo gradient ' + EP + ' lần (epoch) trên <b>cùng lô đó</b>. Đồ thị là tỉ số $r = \\pi_\\theta / \\pi_{\\theta^k}$ của từng hành động qua các epoch; hai đường đứt nét là $1 \\pm \\varepsilon$.</p>' +
      '<div class="ctrl"><div class="seg" id="ru-m"><button type="button" data-v="is" aria-pressed="false">Không cắt</button><button type="button" data-v="clip" aria-pressed="true">PPO-clip</button><button type="button" data-v="pen" aria-pressed="false">PPO-penalty</button></div>' +
      '<button type="button" class="btn pri" id="ru-one">1 vòng</button><button type="button" class="btn" id="ru-reset">Đặt lại</button><span class="rxs">Vòng: <b id="ru-k">0</b></span></div>' +
      '<div class="calc" id="ru-batch"></div>' +
      '<div class="legend"><span class="li"><span class="sw" style="background:var(--s2)"></span>$r(a)$</span><span class="li"><span class="sw" style="background:' + C3 + '"></span>$r(b)$</span><span class="li"><span class="sw" style="background:var(--s1)"></span>$r(c)$</span></div>' +
      '<div class="chart" id="ru-chart"></div>' +
      '<div class="insight" id="ru-ins"></div>' +
      '<h3 class="sub">So sánh 300 lần chạy × 40 vòng</h3>' +
      '<p class="rxs" style="margin:0">Giá trị kỳ vọng thật $\\mathbb{E}_\\pi[R]$ sau mỗi vòng (tối đa $1{,}5$). Gradient chính sách thường chỉ cập nhật 1 lần mỗi lô.</p>' +
      '<div class="ctrl"><button type="button" class="btn" id="ru-cmp">Chạy so sánh</button></div>' +
      '<div class="legend" id="ru-leg"></div><div class="chart" id="ru-cchart"></div>' +
      '<div class="tscroll"><table class="cmp" id="ru-tab"></table></div>' +
      '<div class="insight" id="ru-ins2">Bấm “Chạy so sánh”.</div></section>');
    root.appendChild(b3);
    var ruEl = b3.querySelector('#ru-m'), ruTh, ruK, ruLast, ruRand = seeded(17);
    function ruReset() { ruTh = [0, 0, 0]; ruK = 0; ruLast = null; ruDraw(); }
    function ruDraw() {
      b3.querySelector('#ru-k').textContent = ruK;
      var bt = b3.querySelector('#ru-batch'), ins = b3.querySelector('#ru-ins'), ch = b3.querySelector('#ru-chart');
      if (!ruLast) { bt.innerHTML = '<span class="rxs">Chính sách ban đầu đều: $\\pi = [\\tfrac13;\\ \\tfrac13;\\ \\tfrac13]$. Bấm “1 vòng”.</span>'; ctx.typeset(bt); ch.innerHTML = ''; ins.innerHTML = 'Chọn phương pháp rồi bấm “1 vòng”.'; return; }
      var L = ruLast, cnt = [0, 0, 0], sumA = [0, 0, 0];
      L.smp.forEach(function (o) { cnt[o.a]++; sumA[o.a] += o.A; });
      var fin = L.trace[L.trace.length - 1];
      katexBlock(bt, '\\begin{aligned}&\\text{Lô: } n = (' + cnt.join(',\\ ') + '),\\quad \\bar A = (' + sumA.map(function (s, k) { return cnt[k] ? texRaw(s / cnt[k], 2) : '\\text{–}'; }).join(';\\ ') + ')\\\\' +
        '&\\pi_{\\theta^k} = ' + vec(L.pk, 3) + '\\ \\to\\ \\pi_\\theta = ' + vec(fin.p, 3) + '\\\\&\\mathrm{KL}(\\pi_{\\theta^k}\\,\\|\\,\\pi_\\theta) = ' + texRaw(fin.kl, 3) + ',\\quad \\mathbb{E}_\\pi[R] = ' + texRaw(Jtrue(ruTh), 3) + '\\end{aligned}');
      var rmax = Math.max.apply(null, L.trace.map(function (t) { return Math.max(t.p[0] / L.pk[0], t.p[1] / L.pk[1], t.p[2] / L.pk[2]); }));
      var yTop = rmax <= 2.5 ? 2.5 : Math.ceil(rmax), yTicks = []; for (var yt = 0; yt <= yTop + 1e-9; yt += yTop <= 2.5 ? 0.5 : 1) yTicks.push(yt);
      lineChart(ch, {
        series: [0, 1, 2].map(function (k) { return { name: 'r(' + 'abc'[k] + ')', color: ['var(--s2)', C3, 'var(--s1)'][k], values: L.trace.map(function (t) { return t.p[k] / L.pk[k]; }) }; }),
        yMin: 0, yMax: yTop, yTicks: yTicks, dec: 1, tipDec: 3, xLabel: 'Epoch', xFirst: 0, height: 200,
        refs: [{ y: 1 + EPS, label: '1 + ε' }, { y: 1 - EPS, label: '1 − ε' }], aria: 'Tỉ số r của từng hành động qua các epoch'
      });
      var best = sumA.map(function (s, k) { return cnt[k] ? s / cnt[k] : -1e9; }), bk = best.indexOf(Math.max.apply(null, best));
      var m = segVal(ruEl), mx = Math.max.apply(null, [0, 1, 2].map(function (k) { return fin.p[k] / L.pk[k]; }));
      ins.innerHTML = 'Trong lô này, hành động <b>' + 'abc'[bk] + '</b> có lợi thế trung bình lớn nhất' + (bk !== 2 ? ' (dù thật ra $c$ mới tốt nhất: lô nhỏ nên lợi thế ước lượng bị nhiễu)' : '') + '. ' +
        (m === 'is' ? 'Không có gì ngăn lại: sau ' + EP + ' epoch tỉ số lên tới ' + fmtNum(mx, 2) + ', KL = ' + fmtNum(fin.kl, 3) + '. Chính sách “chạy theo” nhiễu của một lô nhỏ, rất dễ khóa vào hành động sai.'
          : m === 'clip' ? 'Mẫu nào có $r$ vượt ra ngoài $[1-\\varepsilon, 1+\\varepsilon]$ theo hướng có lợi thì gradient bằng 0, nên các tỉ số dừng gần mép dải (có thể vượt một chút vì softmax liên kết các hành động). KL = ' + fmtNum(fin.kl, 3) + '.'
          : 'Số hạng $-\\beta\\,\\mathrm{KL}$ kéo chính sách về $\\pi_{\\theta^k}$: các tỉ số tiến dần rồi dừng ở điểm cân bằng giữa lợi thế và phạt. KL = ' + fmtNum(fin.kl, 3) + '.');
      ctx.typeset(ins);
    }
    seg(ruEl, ruReset);
    b3.querySelector('#ru-one').onclick = function () { var r = ppoRound(ruTh, segVal(ruEl), ruRand, true); ruTh = r.th; ruK++; ruLast = r; ruDraw(); };
    b3.querySelector('#ru-reset').onclick = ruReset;
    var ruCmp = null, METH = ['pg', 'is', 'clip', 'pen'], MCOL = ['var(--muted)', 'var(--s2)', 'var(--s1)', C3];
    b3.querySelector('#ru-leg').innerHTML = METH.map(function (k, i) { return '<span class="li"><span class="sw" style="background:' + MCOL[i] + '"></span>' + MN[k] + '</span>'; }).join('');
    ctx.typeset(b3.querySelector('#ru-leg'));
    function drawRuCmp() {
      if (!ruCmp) return;
      lineChart(b3.querySelector('#ru-cchart'), {
        series: METH.map(function (k, i) { return { name: MN[k].replace(/\s*\(.*\)/, ''), color: MCOL[i], values: ruCmp[k].curve }; }),
        yMin: 1.15, yMax: 1.5, yTicks: [1.2, 1.3, 1.4, 1.5], dec: 1, tipDec: 3, xLabel: 'Vòng', aria: 'Giá trị kỳ vọng theo số vòng'
      });
    }
    b3.querySelector('#ru-cmp').onclick = function () {
      var btn = this; btn.disabled = true; btn.textContent = 'Đang chạy…';
      setTimeout(function () {
        var RU = 300, O = 40; ruCmp = {};
        METH.forEach(function (k) {
          var acc = new Array(O).fill(0), wrong = 0, rand = seeded(4), at10 = 0;
          for (var i = 0; i < RU; i++) { var th = [0, 0, 0]; for (var o = 0; o < O; o++) { th = ppoRound(th, k, rand, false).th; acc[o] += Jtrue(th) / RU; } if (softmax(th)[2] < 0.5) wrong++; }
          ruCmp[k] = { curve: acc, wrong: wrong, fin: acc[O - 1], at10: acc[9] };
        });
        drawRuCmp();
        b3.querySelector('#ru-tab').innerHTML = '<thead><tr><th>Phương pháp</th><th>$\\mathbb{E}[R]$ sau 10 vòng</th><th>sau 40 vòng</th><th>Kết thúc với $\\pi(c) < 0{,}5$</th></tr></thead><tbody>' +
          METH.map(function (k) { var r = ruCmp[k]; return '<tr><td>' + MN[k] + '</td><td>' + fmtNum(r.at10, 3) + '</td><td>' + fmtNum(r.fin, 3) + '</td><td>' + r.wrong + '/' + RU + '</td></tr>'; }).join('') + '</tbody>';
        ctx.typeset(b3.querySelector('#ru-tab'));
        b3.querySelector('#ru-ins2').innerHTML = '<b>Gradient chính sách thường</b> an toàn nhưng chậm: mỗi lô chỉ dùng một lần. <b>Không cắt</b> dùng lô ' + EP + ' lần nên lúc đầu đi nhanh, nhưng chạy theo nhiễu của từng lô nhỏ: ' + ruCmp.is.wrong + '/300 lần chạy bị khóa vào hành động sai. <b>PPO-clip</b> vừa dùng lại dữ liệu vừa không đi quá xa: nhanh hơn gradient thường và gần như không bao giờ khóa nhầm. PPO-penalty nằm giữa.';
        ctx.typeset(b3.querySelector('#ru-ins2'));
        btn.disabled = false; btn.textContent = 'Chạy lại so sánh';
      }, 30);
    };
    onResize(function () { ruDraw(); drawRuCmp(); });
    ruReset();

    ctx.typeset(root);
  }

  // ======================================================================
  // TAB "Sơ đồ"
  // ======================================================================
  function renderMap(root, ctx) {
    root.innerHTML = '';
    root.classList.add('rx');

    // ---- 1. Cách dùng dữ liệu ----
    var m1 = h('<section class="blk"><h2>Gradient chính sách thường và PPO dùng dữ liệu thế nào</h2>' +
      '<div class="tl2">' +
      '<div class="row"><span class="nm">Gradient chính sách</span><span class="bx s">lấy mẫu bằng $\\theta$</span><span class="fa">→</span><span class="bx u">cập nhật 1 lần</span><span class="fa">→</span><span class="bx x">bỏ dữ liệu</span><span class="fa">→</span><span class="bx s">lấy mẫu lại</span><span class="fa">→</span><span class="bx u">cập nhật 1 lần</span><span class="fa">→ …</span></div>' +
      '<div class="row"><span class="nm">PPO</span><span class="bx s">lấy mẫu bằng $\\theta^k$</span><span class="fa">→</span><span class="bx u">cập nhật $K$ lần, trọng số $r_t$, cắt hoặc phạt KL</span><span class="fa">→</span><span class="bx">$\\theta^{k+1}$</span><span class="fa">→</span><span class="bx x">bỏ dữ liệu</span><span class="fa">→</span><span class="bx s">lấy mẫu bằng $\\theta^{k+1}$</span><span class="fa">→ …</span></div>' +
      '</div><p class="rxs" style="margin:10px 0 0">Ô xanh: tương tác với môi trường (tốn thời gian). Ô vàng: tính toán trên dữ liệu đã có (rẻ). PPO tăng số ô vàng cho mỗi ô xanh.</p></section>');
    root.appendChild(m1);

    // ---- 2. Chuỗi biến đổi ----
    var STEPS = [
      ['\\mathbb{E}_{\\tau\\sim p_\\theta}\\big[R(\\tau)\\nabla\\log p_\\theta(\\tau)\\big]', '(5.1) gradient chính sách: on-policy.', ''],
      ['\\mathbb{E}_{\\tau\\sim p_{\\theta\'}}\\Big[\\frac{p_\\theta(\\tau)}{p_{\\theta\'}(\\tau)}R(\\tau)\\nabla\\log p_\\theta(\\tau)\\Big]', '(5.4) importance sampling: dữ liệu do $\\theta\'$ sinh.', ''],
      ['\\mathbb{E}_{(s_t,a_t)\\sim\\pi_{\\theta\'}}\\Big[\\frac{p_\\theta(a_t\\mid s_t)}{p_{\\theta\'}(a_t\\mid s_t)}\\frac{p_\\theta(s_t)}{p_{\\theta\'}(s_t)}A^{\\theta\'}\\nabla\\log p_\\theta(a_t\\mid s_t)\\Big]', 'Theo từng cặp trạng thái-hành động. <b>Xấp xỉ 1</b>: $A^\\theta \\approx A^{\\theta\'}$.', ''],
      ['\\mathbb{E}_{(s_t,a_t)\\sim\\pi_{\\theta\'}}\\Big[\\frac{p_\\theta(a_t\\mid s_t)}{p_{\\theta\'}(a_t\\mid s_t)}A^{\\theta\'}\\nabla\\log p_\\theta(a_t\\mid s_t)\\Big]', '(5.5) <b>Xấp xỉ 2</b>: bỏ $\\frac{p_\\theta(s_t)}{p_{\\theta\'}(s_t)}$ vì không tính được.', ''],
      ['J^{\\theta\'}(\\theta) = \\mathbb{E}_{(s_t,a_t)\\sim\\pi_{\\theta\'}}\\Big[\\frac{p_\\theta(a_t\\mid s_t)}{p_{\\theta\'}(a_t\\mid s_t)}A^{\\theta\'}\\Big]', 'Suy ngược ra hàm mục tiêu bằng $\\nabla f = f\\nabla\\log f$. Chỉ đúng khi $\\theta$ gần $\\theta\'$, vì vậy cần một trong ba cách dưới.', '']
    ];
    var m2 = h('<section class="blk"><h2>Từ gradient chính sách tới PPO</h2><div class="flow">' + STEPS.map(function (s, i) {
      return (i ? '<div class="fa">↓</div>' : '') + '<div class="fb"><div class="fx">$' + s[0] + '$</div><div class="fy">' + s[1] + '</div></div>';
    }).join('') + '<div class="fa">↓</div>' +
      '<div class="tscroll"><table class="cmp"><thead><tr><th></th><th>TRPO</th><th>PPO1 (phạt)</th><th>PPO2 (cắt)</th></tr></thead><tbody>' +
      [['Giữ $\\theta$ gần $\\theta^k$ bằng', 'Ràng buộc $\\mathrm{KL} < \\delta$', 'Trừ $\\beta\\,\\mathrm{KL}$ trong mục tiêu', '$\\min$ với $\\operatorname{clip}(r, 1\\pm\\varepsilon)$'],
       ['Tối ưu', 'Có ràng buộc, khó (bậc hai)', 'Gradient ascent', 'Gradient ascent'],
       ['Siêu tham số', '$\\delta$', '$\\beta$ (hoặc $\\mathrm{KL}_{\\min}, \\mathrm{KL}_{\\max}$ khi thích nghi)', '$\\varepsilon$ ($0{,}1$–$0{,}2$)'],
       ['Cần tính KL?', 'Có', 'Có', 'Không'],
       ['Cài đặt', 'Phức tạp', 'Dễ', 'Dễ nhất']
      ].map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td></tr>'; }).join('') +
      '</tbody></table></div></div></section>');
    root.appendChild(m2);

    // ---- 3. KL theo hành vi, không theo tham số ----
    var m3 = h('<section class="blk"><h2>Vì sao đo khoảng cách hành vi chứ không đo khoảng cách tham số?</h2>' +
      '<p class="lead">Chính sách softmax trên 3 logit, ban đầu $\\theta = (0, 0, 0)$ nên $\\pi = (\\tfrac13, \\tfrac13, \\tfrac13)$. Đổi $\\theta\'$ theo hai cách có <b>cùng</b> độ lớn thay đổi $c$ trên mỗi logit được chạm tới.</p>' +
      '<div class="ctrl"><div class="seg" id="kl-m"><button type="button" data-v="all" aria-pressed="true">Cộng $c$ vào cả 3 logit</button><button type="button" data-v="one" aria-pressed="false">Cộng $c$ vào logit thứ nhất</button></div>' +
      '<label for="kl-c">$c$</label><input id="kl-c" type="range" min="0" max="5" step="0.25" value="2"><span class="val" id="kl-c-v"></span></div>' +
      '<div class="bars" id="kl-bars"></div><div class="calc" id="kl-calc"></div><div class="insight" id="kl-ins"></div></section>');
    root.appendChild(m3);
    function klAll() {
      var md = segVal(m3.querySelector('#kl-m')), c = +m3.querySelector('#kl-c').value;
      m3.querySelector('#kl-c-v').textContent = fmtNum(c, 2);
      var th2 = md === 'all' ? [c, c, c] : [c, 0, 0], p = [1 / 3, 1 / 3, 1 / 3], q = softmax(th2);
      var l2 = md === 'all' ? Math.sqrt(3) * c : c, kl = klDiv(p, q);
      m3.querySelector('#kl-bars').innerHTML = q.map(function (v, k) {
        return '<div class="bar"><div class="track"><div class="fill" style="height:' + (v * 100).toFixed(1) + '%"></div><div class="ghost" style="bottom:' + (100 / 3).toFixed(1) + '%"></div></div><div class="pv">' + 'abc'[k] + ': ' + fmtNum(v, 3) + '</div></div>';
      }).join('');
      katexBlock(m3.querySelector('#kl-calc'), '\\begin{aligned}&\\theta\' = (' + th2.map(function (x) { return texRaw(x, 2); }).join(',\\ ') + '),\\quad \\pi_{\\theta\'} = ' + vec(q, 3) + '\\\\' +
        '&\\|\\theta\' - \\theta\\|_2 = ' + texRaw(l2, 3) + ',\\qquad \\mathrm{KL}(\\pi_\\theta\\,\\|\\,\\pi_{\\theta\'}) = ' + texRaw(kl, 4) + '\\end{aligned}');
      m3.querySelector('#kl-ins').innerHTML = md === 'all' ? 'Cộng cùng một số vào mọi logit: tham số đổi <b>' + fmtNum(l2, 2) + '</b> (theo chuẩn L2) nhưng chính sách <b>không đổi</b>, KL = 0. Phạt theo chuẩn tham số sẽ cấm một thay đổi vô hại.'
        : 'Chỉ đổi một logit: tham số đổi ít hơn (' + fmtNum(l2, 2) + ' so với ' + fmtNum(Math.sqrt(3) * c, 2) + ' ở cách kia), nhưng hành vi đổi thật sự, KL = ' + fmtNum(kl, 3) + '. Thứ ta quan tâm là hành động đưa ra, nên PPO đo KL giữa các phân phối hành động.';
    }
    seg(m3.querySelector('#kl-m'), klAll);
    m3.querySelector('#kl-c').oninput = klAll;
    klAll();
    ctx.typeset(root);
  }

  // ======================================================================
  // TAB "Mô phỏng": liên kết tới các trang docs/viz
  // ======================================================================
  var VIZ = [
    ['ppo.html', 'Mục 5.2', 'PPO từng bước', 'Lấy mẫu một lô, $K$ epoch trên cùng lô với tỉ số $r_t$ và mẫu bị cắt; PPO-clip, PPO-penalty với $\\beta$ thích nghi; so sánh hiệu quả dữ liệu với REINFORCE.'],
    ['ppo-trust.html', 'Mục 5.2', 'Mục tiêu thay thế và vùng tin cậy', 'Bản đồ cải thiện thật và mục tiêu thay thế; đường viền $\\mathrm{KL} = \\delta$; bốn cách tối ưu đi đâu sau $K$ epoch.']
  ];
  function renderViz(root, ctx) {
    root.innerHTML = '';
    root.classList.add('rx');
    var b = h('<section class="blk"><h2>Mô phỏng thuật toán</h2>' +
      '<p class="lead">Chạy từng bước các thuật toán của chương, kèm phép tính bằng số thật và mã giả tô sáng dòng đang chạy. Mở trong cùng tab; bấm “← Các mô phỏng” để quay lại danh sách.</p>' +
      '<div class="lanes">' + VIZ.map(function (v) {
        return '<a class="lane" style="display:block;text-decoration:none;color:inherit" href="../viz/' + v[0] + '"><div class="lt">' + v[2] +
          ' <span>· ' + v[1] + '</span></div><div class="rxs">' + v[3] + '</div></a>';
      }).join('') + '</div></section>');
    root.appendChild(b);
    ctx.typeset(b);
  }

  window.ReviewExtras = {
    tabs: [
      { id: 'lab', label: 'Thí nghiệm', render: renderLab },
      { id: 'map', label: 'Sơ đồ', render: renderMap },
      { id: 'viz', label: 'Mô phỏng', render: renderViz }
    ]
  };
})();
