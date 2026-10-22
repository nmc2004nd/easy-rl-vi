/* Thí nghiệm tương tác và sơ đồ trực quan cho chương 8 (DQN cho hành động liên tục).
 * Trang index.html tải file này khi ch8.json có "extras": "ch8-extras.js".
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
  var css8 = String.raw`
  .rx svg.plot { display: block; width: 100%; height: auto; overflow: visible; touch-action: manipulation; }
  .rx svg.plot text { fill: var(--muted); font-size: 11px; font-family: inherit; }
  .rx svg.plot .lbl { fill: var(--text); font-weight: 600; }
  .rx .stat3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; margin-top: 10px; }
  .rx .stat3 > div { background: var(--surface-2); border-radius: 10px; padding: 8px 10px; font-size: .86rem; }
  .rx .stat3 b { display: block; font-size: 1.05rem; font-variant-numeric: tabular-nums; }
  .rx .hm { max-width: 420px; margin: 8px auto 0; cursor: crosshair; }
  .rx .insight, .rx .lead, .rx .tscroll { position: relative; }
  .rx .two { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 4px 18px; }`;
  var st8 = document.createElement('style'); st8.textContent = css8; document.head.appendChild(st8);
  var C3 = 'var(--accent-text)';
  function table(head, rows) { return '<div class="tscroll"><table class="cmp"' + (head.length > 3 ? ' style="min-width:600px"' : '') + '>' + '<thead><tr>' + head.map(function (x) { return '<th>' + x + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.map(function (r) { return '<tr>' + r.map(function (x) { return '<td>' + x + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>'; }

  // hàm Q một chiều dùng chung: đỉnh hẹp cao (toàn cục) ở 0,6 và đỉnh rộng thấp (cục bộ) ở −0,5
  var P1 = { a: 1, c: 0.6, w: 0.08 }, P2 = { a: 0.6, c: -0.5, w: 0.3 };
  function q1(a) { return P1.a * Math.exp(-Math.pow((a - P1.c) / P1.w, 2)) + P2.a * Math.exp(-Math.pow((a - P2.c) / P2.w, 2)); }
  function dq1(a) { return [P1, P2].reduce(function (s, p) { var u = (a - p.c) / p.w; return s + p.a * Math.exp(-u * u) * (-2 * u / p.w); }, 0); }
  var QMAX = (function () { var m = -1; for (var i = 0; i <= 4000; i++) m = Math.max(m, q1(-1 + i / 2000)); return m; })();
  // vẽ đường cong Q(a) trên [−1, 1], kèm các điểm
  function curve(box, pts, opt) {
    var W = Math.max(300, box.clientWidth), H = 190, m = { l: 34, r: 10, t: 12, b: 26 }, iw = W - m.l - m.r, ih = H - m.t - m.b;
    var x = function (a) { return m.l + (a + 1) / 2 * iw; }, y = function (v) { return m.t + ih - v / 1.1 * ih; };
    var s = '<svg class="plot" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (opt.aria || 'Hàm Q theo hành động') + '"><g class="grid">';
    [0, 0.5, 1].forEach(function (v) { s += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(v) + '" y2="' + y(v) + '"/>'; });
    s += '</g>';
    [0, 0.5, 1].forEach(function (v) { s += '<text x="' + (m.l - 5) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + fmtNum(v, 1) + '</text>'; });
    [-1, -0.5, 0, 0.5, 1].forEach(function (a) { s += '<text x="' + x(a) + '" y="' + (H - 8) + '" text-anchor="middle">' + fmtNum(a, 1) + '</text>'; });
    var d = ''; for (var i = 0; i <= 400; i++) { var a = -1 + i / 200; d += (i ? 'L' : 'M') + x(a).toFixed(1) + ' ' + y(q1(a)).toFixed(1); }
    s += '<path d="' + d + '" fill="none" stroke="var(--muted)" stroke-width="2"/>';
    if (opt.path) { var pd = opt.path.map(function (a, k) { return (k ? 'L' : 'M') + x(a).toFixed(1) + ' ' + y(q1(a)).toFixed(1); }).join(''); s += '<path d="' + pd + '" fill="none" stroke="var(--s2)" stroke-width="1.5" stroke-dasharray="3 3"/>'; }
    pts.forEach(function (p) { s += '<circle cx="' + x(p.a).toFixed(1) + '" cy="' + y(q1(p.a)).toFixed(1) + '" r="' + (p.r || 4) + '" fill="' + p.c + '" stroke="var(--surface)" stroke-width="2"/>'; });
    box.innerHTML = s + '</svg>';
  }

  function renderLab(root, ctx) {
    root.innerHTML = '';
    root.classList.add('rx');

    // ============ 1. Lấy mẫu ============
    var b1 = h('<section class="blk">' +
      '<h2>1. Phương án 1: lấy mẫu $N$ hành động (mục 8.1)</h2>' +
      '<p class="lead">Hàm $Q(s, a)$ theo hành động một chiều $a \\in [-1, 1]$ có một đỉnh <b>hẹp</b> cao (cực đại toàn cục, $a \\approx 0{,}6$) và một đỉnh rộng thấp. Lấy mẫu đều $N$ hành động, chọn cái có $Q$ lớn nhất.</p>' +
      '<div class="ctrl"><label for="sm-n">$N$</label><input id="sm-n" type="range" min="1" max="50" step="1" value="8"><span class="val" id="sm-n-v"></span>' +
      '<button type="button" class="btn pri" id="sm-go">Lấy mẫu lại</button></div>' +
      '<div class="legend"><span class="li"><span class="sw dot" style="background:var(--s1)"></span>mẫu</span><span class="li"><span class="sw dot" style="background:var(--s2)"></span>mẫu được chọn</span></div>' +
      '<div class="chart" id="sm-plot"></div><div class="calc" id="sm-calc"></div>' +
      '<h3 class="sub">Lời nguyền số chiều: $Q$ lớn nhất tìm được, trung bình 300 lần</h3>' +
      '<p class="rxs" style="margin:0">Hành động $d$ chiều trong $[-1, 1]^d$, $Q(\\boldsymbol a) = \\exp\\!\\big(-\\|\\boldsymbol a - \\boldsymbol a^*\\|^2 / (2\\cdot 0{,}3^2)\\big)$, giá trị lớn nhất bằng 1.</p>' +
      '<div class="legend" id="sm-leg"></div><div class="chart" id="sm-chart"></div><div class="insight" id="sm-ins"></div></section>');
    root.appendChild(b1);
    var smRand = seeded(8), smPts = [];
    function smSample() { var n = +b1.querySelector('#sm-n').value; smPts = []; for (var i = 0; i < n; i++) smPts.push(-1 + 2 * smRand()); }
    function smDraw() {
      var n = smPts.length; b1.querySelector('#sm-n-v').textContent = n;
      var best = 0; smPts.forEach(function (a, i) { if (q1(a) > q1(smPts[best])) best = i; });
      curve(b1.querySelector('#sm-plot'), smPts.map(function (a, i) { return { a: a, c: i === best ? 'var(--s2)' : 'var(--s1)', r: i === best ? 6 : 4 }; }), { aria: 'Các hành động được lấy mẫu trên đường Q' });
      var ab = smPts[best], hit = 1 - Math.pow(1 - 0.08, n);
      katexBlock(b1.querySelector('#sm-calc'), '\\begin{aligned}&\\hat a = \\arg\\max_{i \\le ' + n + '} Q(s, a_i) = ' + texRaw(ab, 3) + ',\\quad Q(s, \\hat a) = ' + texRaw(q1(ab), 3) + '\\quad(\\max_a Q = ' + texRaw(QMAX, 3) + ')' +
        '\\\\&P(\\text{ít nhất một mẫu trong đỉnh hẹp } |a - 0{,}6| < 0{,}08) = 1 - (1 - 0{,}08)^{' + n + '} = ' + texRaw(hit, 3) + '\\end{aligned}');
    }
    b1.querySelector('#sm-n').oninput = function () { smSample(); smDraw(); };
    b1.querySelector('#sm-go').onclick = function () { smSample(); smDraw(); };
    var DIMS = [[1, 'var(--s1)'], [2, C3], [5, 'var(--s2)'], [10, 'var(--muted)']], NS = [1, 2, 5, 10, 20, 50, 100, 200, 500];
    var smCurve = (function () {
      var r = seeded(81), out = DIMS.map(function () { return NS.map(function () { return 0; }); }), T = 300;
      DIMS.forEach(function (dd, j) {
        var d = dd[0];
        for (var t = 0; t < T; t++) {
          var star = []; for (var k = 0; k < d; k++) star.push(-0.6 + 1.2 * r());
          var best = 0, ni = 0;
          for (var i = 1; i <= NS[NS.length - 1]; i++) {
            var s2 = 0; for (var k2 = 0; k2 < d; k2++) { var u = -1 + 2 * r() - star[k2]; s2 += u * u; }
            best = Math.max(best, Math.exp(-s2 / (2 * 0.09)));
            if (i === NS[ni]) { out[j][ni] += best / T; ni++; }
          }
        }
      });
      return out;
    })();
    b1.querySelector('#sm-leg').innerHTML = DIMS.map(function (d) { return '<span class="li"><span class="sw" style="background:' + d[1] + '"></span>$d = ' + d[0] + '$</span>'; }).join('');
    function smChart() {
      lineChart(b1.querySelector('#sm-chart'), { series: DIMS.map(function (d, j) { return { name: 'd = ' + d[0], color: d[1], values: smCurve[j] }; }),
        xs: NS.map(function (n) { return Math.log10(n); }), xFmt: function (v) { return Math.round(Math.pow(10, v)); }, yMin: 0, yMax: 1, yTicks: [0, 0.25, 0.5, 0.75, 1], dec: 2, xLabel: 'số mẫu N (thang log)', aria: 'Q lớn nhất tìm được theo số mẫu và số chiều' });
    }
    var i500 = NS.length - 1;
    b1.querySelector('#sm-ins').innerHTML = 'Với $N = 500$ mẫu: $d = 1$ đạt ' + fmtNum(smCurve[0][i500], 2) + ', $d = 2$ đạt ' + fmtNum(smCurve[1][i500], 2) + ', $d = 5$ chỉ ' + fmtNum(smCurve[2][i500], 2) + ', $d = 10$ chỉ ' + fmtNum(smCurve[3][i500], 2) +
      '. Số mẫu cần để giữ cùng độ chính xác tăng theo <b>hàm mũ</b> của số chiều, nên với robot 50 khớp, lấy mẫu gần như vô dụng. Ở đường cong phía trên, kéo $N$ nhỏ để thấy mẫu tốt nhất thường rơi vào đỉnh rộng thấp.';
    smSample(); smDraw(); smChart();
    onResize(function () { smDraw(); smChart(); });

    // ============ 2. Gradient ascent ============
    var b2 = h('<section class="blk">' +
      '<h2>2. Phương án 2: đi lên theo gradient (mục 8.2)</h2>' +
      '<p class="lead">Cùng hàm $Q$ như trên. Bắt đầu từ $a_0$, lặp $a_{k+1} = a_k + \\eta\\,\\dfrac{\\partial Q}{\\partial a}(a_k)$. Bấm vào đồ thị để chọn điểm xuất phát.</p>' +
      '<div class="ctrl"><label for="ga-a0">$a_0$</label><input id="ga-a0" type="range" min="-1" max="1" step="0.01" value="-0.2"><span class="val" id="ga-a0-v"></span>' +
      '<label for="ga-eta">$\\eta$</label><input id="ga-eta" type="range" min="0.001" max="0.01" step="0.001" value="0.003"><span class="val" id="ga-eta-v"></span></div>' +
      '<div class="ctrl"><button type="button" class="btn pri" id="ga-step">Bước tiếp</button><button type="button" class="btn" id="ga-run">Chạy tới hội tụ</button><button type="button" class="btn" id="ga-many">Thử 200 điểm xuất phát ngẫu nhiên</button></div>' +
      '<div class="chart" id="ga-plot"></div><div class="calc" id="ga-calc"></div><div class="stat3" id="ga-stat"></div><div class="insight" id="ga-ins"></div></section>');
    root.appendChild(b2);
    var gaPath = [];
    function gaA0() { return +b2.querySelector('#ga-a0').value; }
    function gaEta() { return +b2.querySelector('#ga-eta').value; }
    function gaStep(a) { return Math.max(-1, Math.min(1, a + gaEta() * dq1(a))); }
    function gaRun(a) { for (var k = 0; k < 5000; k++) { var b = gaStep(a); if (Math.abs(b - a) < 1e-5) return { a: b, k: k + 1 }; a = b; } return { a: a, k: 5000 }; }
    function gaReset() { gaPath = [gaA0()]; gaDraw(); }
    function gaDraw() {
      b2.querySelector('#ga-a0-v').textContent = fmtNum(gaA0(), 2); b2.querySelector('#ga-eta-v').textContent = fmtNum(gaEta(), 3);
      var a = gaPath[gaPath.length - 1];
      curve(b2.querySelector('#ga-plot'), [{ a: gaPath[0], c: 'var(--muted)' }, { a: a, c: 'var(--s2)', r: 6 }], { path: gaPath, aria: 'Quỹ đạo đi lên theo gradient' });
      var g = dq1(a), nx = gaStep(a);
      katexBlock(b2.querySelector('#ga-calc'), '\\begin{aligned}&k = ' + (gaPath.length - 1) + ':\\quad a_k = ' + texRaw(a, 4) + ',\\quad Q(a_k) = ' + texRaw(q1(a), 4) + '\\\\&a_{k+1} = a_k + \\eta\\,Q\'(a_k) = ' + texRaw(a, 4) + ' + ' + texRaw(gaEta(), 3) + '\\cdot ' + tex(g, 4) + ' = ' + texRaw(nx, 4) + '\\end{aligned}');
      var done = Math.abs(nx - a) < 1e-5, glob = Math.abs(a - P1.c) < 0.05, flat = Math.abs(a - P1.c) > 0.3 && Math.abs(a - P2.c) > 0.6, k = gaPath.length - 1;
      b2.querySelector('#ga-ins').innerHTML = !done ? (k >= 300 && Math.abs(a - P1.c) < 0.3 ? 'Không hội tụ: $\\eta$ quá lớn so với độ cong của đỉnh hẹp nên $a$ nhảy qua nhảy lại quanh đỉnh. Đỉnh càng nhọn thì bước phải càng nhỏ, càng tốn nhiều bước.' : 'Mỗi lần chọn hành động phải lặp như vậy nhiều bước (mỗi bước là một lần lan truyền xuôi và ngược qua mạng $Q$).')
        : glob ? 'Hội tụ về <b>cực đại toàn cục</b> sau ' + k + ' bước.' : flat ? 'Dừng ở <b>vùng phẳng</b> sau ' + k + ' bước: gradient gần bằng 0 nên $a$ gần như không đổi, dù chưa ở đỉnh nào.' : ('Hội tụ về <b>cực đại cục bộ</b> $a \\approx ' + texRaw(a, 2) + '$, $Q \\approx ' + texRaw(q1(a), 2) + '$ sau ' + (gaPath.length - 1) + ' bước, trong khi $\\max_a Q = ' + texRaw(QMAX, 2) + '$. Gradient chỉ nhìn được độ dốc tại chỗ, không thấy đỉnh hẹp bên kia.');
      ctx.typeset(b2.querySelector('#ga-ins'));
    }
    b2.querySelector('#ga-step').onclick = function () { gaPath.push(gaStep(gaPath[gaPath.length - 1])); gaDraw(); };
    b2.querySelector('#ga-run').onclick = function () { var a = gaPath[gaPath.length - 1]; for (var k = 0; k < 5000; k++) { var b = gaStep(a); gaPath.push(b); if (Math.abs(b - a) < 1e-5) break; a = b; } gaDraw(); };
    b2.querySelector('#ga-a0').oninput = gaReset;
    b2.querySelector('#ga-eta').oninput = function () { gaReset(); b2.querySelector('#ga-stat').innerHTML = ''; };
    b2.querySelector('#ga-plot').addEventListener('click', function (e) {
      var svg = e.currentTarget.querySelector('svg'); if (!svg) return; var r = svg.getBoundingClientRect(), W = svg.viewBox.baseVal.width;
      var a = ((e.clientX - r.left) / r.width * W - 34) / (W - 44) * 2 - 1; a = Math.max(-1, Math.min(1, Math.round(a * 100) / 100));
      b2.querySelector('#ga-a0').value = a; gaReset();
    });
    b2.querySelector('#ga-many').onclick = function () {
      var r = seeded(82), ok = 0, loc = 0, steps = 0, T = 200;
      for (var t = 0; t < T; t++) { var o = gaRun(-1 + 2 * r()); if (Math.abs(o.a - P1.c) < 0.05) ok++; else if (Math.abs(o.a - P2.c) < 0.05) loc++; steps += o.k / T; }
      b2.querySelector('#ga-stat').innerHTML = '<div>Tới cực đại toàn cục<b>' + ok + '/' + T + ' (' + fmtNum(100 * ok / T, 0) + '%)</b></div><div>Kẹt ở cực đại cục bộ<b>' + loc + '/' + T + '</b></div><div>Dừng ở vùng phẳng hoặc không hội tụ<b>' + (T - ok - loc) + '/' + T + '</b></div><div>Số bước trung bình mỗi lần chọn hành động<b>' + fmtNum(steps, 0) + '</b></div>';
    };
    gaReset();
    onResize(gaDraw);

    // ============ 3. NAF ============
    var b3 = h('<section class="blk">' +
      '<h2>3. Phương án 3: hàm $Q$ bậc hai (mục 8.3, hình 8.1)</h2>' +
      '<p class="lead">Hành động hai chiều $\\boldsymbol a = (a_1;\\ a_2)$. Mạng đưa ra $\\boldsymbol\\mu(\\boldsymbol s)$, $V(\\boldsymbol s)$ và ma trận tam giác dưới $\\boldsymbol L$; $\\boldsymbol\\Sigma = \\boldsymbol L\\boldsymbol L^{\\mathrm T}$. Màu càng đậm thì $Q$ càng lớn. Bấm vào bản đồ để tính $Q$ tại một hành động.</p>' +
      '<div class="ctrl"><div class="seg" id="nf-mode"><button type="button" data-v="L" aria-pressed="true">$\\boldsymbol\\Sigma = \\boldsymbol L\\boldsymbol L^{\\mathrm T}$</button><button type="button" data-v="S" aria-pressed="false">Nhập thẳng $\\boldsymbol\\Sigma$ (sai cách)</button></div></div>' +
      '<div class="two"><div>' +
      '<div class="ctrl"><label for="nf-m1">$\\mu_1$</label><input id="nf-m1" type="range" min="-0.8" max="0.8" step="0.05" value="0.3"><span class="val" id="nf-m1-v"></span></div>' +
      '<div class="ctrl"><label for="nf-m2">$\\mu_2$</label><input id="nf-m2" type="range" min="-0.8" max="0.8" step="0.05" value="-0.2"><span class="val" id="nf-m2-v"></span></div>' +
      '</div><div>' +
      '<div class="ctrl"><label for="nf-p1" id="nf-p1-l"></label><input id="nf-p1" type="range" min="0.2" max="2" step="0.05" value="1.2"><span class="val" id="nf-p1-v"></span></div>' +
      '<div class="ctrl"><label for="nf-p2" id="nf-p2-l"></label><input id="nf-p2" type="range" min="-2" max="2" step="0.05" value="0.6"><span class="val" id="nf-p2-v"></span></div>' +
      '<div class="ctrl"><label for="nf-p3" id="nf-p3-l"></label><input id="nf-p3" type="range" min="0.2" max="2" step="0.05" value="0.8"><span class="val" id="nf-p3-v"></span></div>' +
      '</div></div>' +
      '<div class="chart hm" id="nf-plot"></div><div class="calc" id="nf-calc"></div><div class="insight" id="nf-ins"></div></section>');
    root.appendChild(b3);
    var V0 = 2, nfPick = null;
    function nfMode() { return segVal(b3.querySelector('#nf-mode')); }
    function nfVals() {
      var g = function (id) { return +b3.querySelector(id).value; }, mu = [g('#nf-m1'), g('#nf-m2')], p = [g('#nf-p1'), g('#nf-p2'), g('#nf-p3')], S, Lm = null;
      if (nfMode() === 'L') { Lm = [[p[0], 0], [p[1], p[2]]]; S = [[p[0] * p[0], p[0] * p[1]], [p[0] * p[1], p[1] * p[1] + p[2] * p[2]]]; }
      else S = [[p[0], p[1]], [p[1], p[2]]];
      var tr = S[0][0] + S[1][1], det = S[0][0] * S[1][1] - S[0][1] * S[1][0], disc = Math.sqrt(Math.max(0, tr * tr / 4 - det));
      return { mu: mu, S: S, L: Lm, ev: [tr / 2 + disc, tr / 2 - disc] };
    }
    function nfQ(v, a) { var x = [a[0] - v.mu[0], a[1] - v.mu[1]]; return -(x[0] * (v.S[0][0] * x[0] + v.S[0][1] * x[1]) + x[1] * (v.S[1][0] * x[0] + v.S[1][1] * x[1])) + V0; }
    function nfLabels() {
      var L = nfMode() === 'L', set = function (id, t) { b3.querySelector(id).innerHTML = t; };
      set('#nf-p1-l', L ? '$L_{11}$' : '$\\Sigma_{11}$'); set('#nf-p2-l', L ? '$L_{21}$' : '$\\Sigma_{12}$'); set('#nf-p3-l', L ? '$L_{22}$' : '$\\Sigma_{22}$');
      b3.querySelector('#nf-p3').min = L ? '0.2' : '-1';
      ctx.typeset(b3.querySelector('.two'));
    }
    function nfDraw() {
      var v = nfVals(), g = function (id, d) { b3.querySelector(id + '-v').textContent = fmtNum(+b3.querySelector(id).value, d); };
      g('#nf-m1', 2); g('#nf-m2', 2); g('#nf-p1', 2); g('#nf-p2', 2); g('#nf-p3', 2);
      var box = b3.querySelector('#nf-plot'), W = Math.min(420, Math.max(260, box.clientWidth)), m = 30, iw = W - m - 8, G = 36, cs = iw / G;
      var x = function (a) { return m + (a + 1) / 2 * iw; }, y = function (a) { return 8 + (1 - a) / 2 * iw; };
      var s = '<svg class="plot" viewBox="0 0 ' + W + ' ' + (iw + 36) + '" role="img" aria-label="Bản đồ nhiệt Q theo hành động hai chiều">', best = { q: -Infinity };
      for (var i = 0; i < G; i++) for (var j = 0; j < G; j++) {
        var a = [-1 + (i + 0.5) * 2 / G, 1 - (j + 0.5) * 2 / G], q = nfQ(v, a), t = Math.max(0, Math.min(1, (q - (V0 - 3)) / 3));
        if (q > best.q) best = { q: q, a: a };
        s += '<rect x="' + (m + i * cs).toFixed(1) + '" y="' + (8 + j * cs).toFixed(1) + '" width="' + (cs + 0.4).toFixed(1) + '" height="' + (cs + 0.4).toFixed(1) + '" fill="var(--s1)" fill-opacity="' + (0.05 + 0.9 * t * t).toFixed(3) + '"/>';
      }
      s += '<rect x="' + m + '" y="8" width="' + iw + '" height="' + iw + '" fill="none" stroke="var(--border)"/>';
      [-1, 0, 1].forEach(function (a) { s += '<text x="' + x(a) + '" y="' + (iw + 22) + '" text-anchor="middle">' + a + '</text><text x="' + (m - 5) + '" y="' + (y(a) + 4) + '" text-anchor="end">' + a + '</text>'; });
      s += '<text x="' + (W - 8) + '" y="' + (iw + 34) + '" text-anchor="end">a₁</text><text x="4" y="16">a₂</text>';
      var pd = v.ev[1] > 1e-9;
      s += '<circle cx="' + x(v.mu[0]) + '" cy="' + y(v.mu[1]) + '" r="6" fill="var(--s2)" stroke="var(--surface)" stroke-width="2"/><text class="lbl" x="' + (x(v.mu[0]) + 9) + '" y="' + (y(v.mu[1]) - 7) + '">μ</text>';
      if (!pd) s += '<rect x="' + (x(best.a[0]) - 6) + '" y="' + (y(best.a[1]) - 6) + '" width="12" height="12" fill="none" stroke="var(--text)" stroke-width="2"/>';
      if (nfPick) s += '<circle cx="' + x(nfPick[0]) + '" cy="' + y(nfPick[1]) + '" r="5" fill="none" stroke="var(--text)" stroke-width="2"/>';
      box.innerHTML = s + '</svg>';
      box.querySelector('svg').onclick = function (e) {
        var r = this.getBoundingClientRect(), px = (e.clientX - r.left) / r.width * W, py = (e.clientY - r.top) / r.width * W;
        var a1 = (px - m) / iw * 2 - 1, a2 = 1 - (py - 8) / iw * 2; if (Math.abs(a1) > 1 || Math.abs(a2) > 1) return;
        nfPick = [Math.round(a1 * 100) / 100, Math.round(a2 * 100) / 100]; nfDraw();
      };
      var M = function (A) { return '\\begin{pmatrix}' + texRaw(A[0][0], 2) + ' & ' + texRaw(A[0][1], 2) + '\\\\' + texRaw(A[1][0], 2) + ' & ' + texRaw(A[1][1], 2) + '\\end{pmatrix}'; };
      var rows = [];
      if (v.L) rows.push('&\\boldsymbol\\Sigma = \\boldsymbol L\\boldsymbol L^{\\mathrm T} = ' + M(v.L) + M([[v.L[0][0], v.L[1][0]], [0, v.L[1][1]]]) + ' = ' + M(v.S));
      else rows.push('&\\boldsymbol\\Sigma = ' + M(v.S));
      rows.push('&\\text{giá trị riêng: } \\lambda_1 = ' + texRaw(v.ev[0], 3) + ',\\ \\lambda_2 = ' + texRaw(v.ev[1], 3) + (pd ? '\\ \\Rightarrow\\ \\text{xác định dương}' : '\\ \\Rightarrow\\ \\text{không xác định dương}'));
      if (nfPick) {
        var d = [nfPick[0] - v.mu[0], nfPick[1] - v.mu[1]], qf = V0 - nfQ(v, nfPick);
        rows.push('&\\boldsymbol a = (' + texRaw(nfPick[0], 2) + ';\\ ' + texRaw(nfPick[1], 2) + '),\\ \\boldsymbol a - \\boldsymbol\\mu = (' + texRaw(d[0], 2) + ';\\ ' + texRaw(d[1], 2) + ')');
        rows.push('&(\\boldsymbol a - \\boldsymbol\\mu)^{\\mathrm T}\\boldsymbol\\Sigma(\\boldsymbol a - \\boldsymbol\\mu) = ' + texRaw(v.S[0][0], 2) + '\\cdot' + tex(d[0], 2) + '^2 + 2\\cdot' + tex(v.S[0][1], 2) + '\\cdot' + tex(d[0], 2) + '\\cdot' + tex(d[1], 2) + ' + ' + texRaw(v.S[1][1], 2) + '\\cdot' + tex(d[1], 2) + '^2 = ' + texRaw(qf, 3));
        rows.push('&Q(\\boldsymbol s, \\boldsymbol a) = -' + tex(qf, 3) + ' + V = -' + tex(qf, 3) + ' + ' + V0 + ' = ' + texRaw(V0 - qf, 3) + '\\quad(Q(\\boldsymbol s, \\boldsymbol\\mu) = V = ' + V0 + ')');
      }
      katexBlock(b3.querySelector('#nf-calc'), '\\begin{aligned}' + rows.join('\\\\') + '\\end{aligned}');
      b3.querySelector('#nf-ins').innerHTML = pd
        ? 'Dù kéo $\\boldsymbol L$ thế nào (đường chéo dương), $\\boldsymbol\\Sigma$ luôn xác định dương: bản đồ là một “quả đồi” với đỉnh duy nhất tại $\\boldsymbol\\mu$ (chấm cam), $Q(\\boldsymbol s, \\boldsymbol\\mu) = V = ' + V0 + '$. Chọn hành động chỉ cần đọc $\\boldsymbol\\mu$, không lấy mẫu, không lặp. $\\boldsymbol L_{21}$ làm đồi bị xoay nghiêng, $L_{11}$, $L_{22}$ làm đồi dốc hơn theo từng hướng.'
        : '$\\boldsymbol\\Sigma$ có giá trị riêng ' + (v.ev[1] < -1e-9 ? 'âm' : 'bằng 0') + ': $\\boldsymbol\\mu$ <b>không còn là đỉnh</b> mà là điểm yên ngựa (hoặc đỉnh không duy nhất). $Q$ lớn nhất trong khung nằm ở <b>biên</b> (ô vuông), tại $(' + texRaw(best.a[0], 2) + ';\\ ' + texRaw(best.a[1], 2) + ')$, $Q = ' + texRaw(best.q, 2) + ' > V$. Vì vậy mạng không đưa ra $\\boldsymbol\\Sigma$ trực tiếp mà đưa ra $\\boldsymbol L$.';
      ctx.typeset(b3.querySelector('#nf-ins'));
    }
    seg(b3.querySelector('#nf-mode'), function (md) {
      var set = function (id, v) { b3.querySelector(id).value = v; };
      nfLabels();
      if (md === 'L') { set('#nf-p1', 1.2); set('#nf-p2', 0.6); set('#nf-p3', 0.8); } else { set('#nf-p1', 1.5); set('#nf-p2', 0.3); set('#nf-p3', -0.6); }
      nfDraw();
    });
    ['#nf-m1', '#nf-m2', '#nf-p1', '#nf-p2', '#nf-p3'].forEach(function (id) { b3.querySelector(id).oninput = nfDraw; });
    nfPick = [-0.5, 0.5];
    nfLabels(); nfDraw();
    onResize(nfDraw);
    ctx.typeset(root);
  }

  // ======================================================================
  // TAB "Sơ đồ"
  // ======================================================================
  function renderMap(root, ctx) {
    root.innerHTML = '';
    root.classList.add('rx');

    var m1 = h('<section class="blk"><h2>Bốn cách xử lý $\\arg\\max_a Q(s, a)$ khi $a$ liên tục</h2>' + table(['Phương án', 'Cách tìm hành động', 'Chính xác?', 'Chi phí mỗi lần chọn', 'Điểm yếu'], [
      ['1. Lấy mẫu (8.1)', 'Thử $N$ hành động, lấy $Q$ lớn nhất', 'Gần đúng', '$N$ lần tính $Q$ (song song)', 'Tệ dần theo số chiều'],
      ['2. Gradient ascent (8.2)', '$a \\leftarrow a + \\eta\\nabla_a Q$', 'Cực đại cục bộ', 'Nhiều bước lặp', 'Chậm, dễ kẹt'],
      ['3. Kiến trúc đặc biệt (8.3)', 'Đọc thẳng $\\boldsymbol\\mu(\\boldsymbol s)$', 'Chính xác (với dạng đã chọn)', '1 lần lan truyền xuôi', '$Q$ bị ép thành bậc hai'],
      ['4. Không dùng DQN (8.4)', 'Diễn viên $\\pi(s)$ đưa ra $a$', 'Học được', '1 lần lan truyền xuôi', 'Cần học thêm một mạng']]) + '</section>');
    root.appendChild(m1);

    // ---- hạn chế của dạng bậc hai ----
    var m2 = h('<section class="blk"><h2>Hạn chế của phương án 3: một đỉnh duy nhất</h2>' +
      '<p class="lead">Xe gặp vật cản ở giữa: quay vô lăng sang trái ($a = -0{,}6$) hoặc sang phải ($a = 0{,}6$) đều tốt, đi thẳng ($a = 0$) thì đâm. $Q$ thật có hai đỉnh. Hãy thử chỉnh $\\mu$, $\\Sigma$, $V$ của $\\hat Q(a) = -\\Sigma(a - \\mu)^2 + V$ cho giống $Q$ thật nhất có thể.</p>' +
      '<div class="two"><div class="ctrl"><label for="bm-mu">$\\mu$</label><input id="bm-mu" type="range" min="-1" max="1" step="0.05" value="0.6"><span class="val" id="bm-mu-v"></span></div>' +
      '<div class="ctrl"><label for="bm-s">$\\Sigma$</label><input id="bm-s" type="range" min="0.1" max="3" step="0.1" value="1.2"><span class="val" id="bm-s-v"></span></div>' +
      '<div class="ctrl"><label for="bm-v">$V$</label><input id="bm-v" type="range" min="0" max="1.5" step="0.05" value="1"><span class="val" id="bm-v-v"></span></div></div>' +
      '<div class="legend"><span class="li"><span class="sw" style="background:var(--muted)"></span>$Q$ thật</span><span class="li"><span class="sw" style="background:var(--s1)"></span>$\\hat Q$ bậc hai</span><span class="li"><span class="sw dot" style="background:var(--s2)"></span>giá trị tại $a = -0{,}6;\\ 0;\\ 0{,}6$</span></div>' +
      '<div class="chart" id="bm-plot"></div><div class="calc" id="bm-calc"></div><div class="insight" id="bm-ins"></div></section>');
    root.appendChild(m2);
    function bmQ(a) { return Math.exp(-Math.pow((a + 0.6) / 0.22, 2)) + Math.exp(-Math.pow((a - 0.6) / 0.22, 2)); }
    function bmDraw() {
      var g = function (id) { return +m2.querySelector(id).value; }, mu = g('#bm-mu'), Sg = g('#bm-s'), Vv = g('#bm-v');
      m2.querySelector('#bm-mu-v').textContent = fmtNum(mu, 2); m2.querySelector('#bm-s-v').textContent = fmtNum(Sg, 1); m2.querySelector('#bm-v-v').textContent = fmtNum(Vv, 2);
      var qh = function (a) { return -Sg * (a - mu) * (a - mu) + Vv; };
      var box = m2.querySelector('#bm-plot'), W = Math.max(300, box.clientWidth), H = 200, m = { l: 34, r: 10, t: 12, b: 26 }, iw = W - m.l - m.r, ih = H - m.t - m.b;
      var x = function (a) { return m.l + (a + 1) / 2 * iw; }, y = function (v) { v = Math.max(-1, Math.min(1.6, v)); return m.t + ih - (v + 1) / 2.6 * ih; };
      var s = '<svg class="plot" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Q hai đỉnh và hàm bậc hai"><g class="grid">';
      [-1, -0.5, 0, 0.5, 1, 1.5].forEach(function (v) { s += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(v) + '" y2="' + y(v) + '"/>'; });
      s += '</g>';
      [-1, 0, 1].forEach(function (v) { s += '<text x="' + (m.l - 5) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + fmtNum(v, 1) + '</text>'; });
      [[-1, '−1 (trái)'], [0, '0 (thẳng)'], [1, '1 (phải)']].forEach(function (t, i) { s += '<text x="' + x(t[0]) + '" y="' + (H - 8) + '" text-anchor="' + ['start', 'middle', 'end'][i] + '">' + t[1] + '</text>'; });
      var d1 = '', d2 = '';
      for (var j = 0; j <= 200; j++) { var aa = -1 + j / 100; d1 += (j ? 'L' : 'M') + x(aa).toFixed(1) + ' ' + y(bmQ(aa)).toFixed(1); d2 += (j ? 'L' : 'M') + x(aa).toFixed(1) + ' ' + y(qh(aa)).toFixed(1); }
      s += '<path d="' + d1 + '" fill="none" stroke="var(--muted)" stroke-width="2"/><path d="' + d2 + '" fill="none" stroke="var(--s1)" stroke-width="2"/>';
      [-0.6, 0, 0.6].forEach(function (a) { if (qh(a) < -1) return; s += '<circle cx="' + x(a) + '" cy="' + y(qh(a)) + '" r="5" fill="var(--s2)" stroke="var(--surface)" stroke-width="2"/>'; });
      box.innerHTML = s + '</svg>';
      var L = qh(-0.6), M = qh(0), R = qh(0.6);
      katexBlock(m2.querySelector('#bm-calc'), '\\begin{aligned}&\\hat Q(-0{,}6) = ' + texRaw(L, 3) + ',\\quad \\hat Q(0) = ' + texRaw(M, 3) + ',\\quad \\hat Q(0{,}6) = ' + texRaw(R, 3) + '\\quad(\\text{thật: } 1;\\ 0;\\ 1)' +
        '\\\\&\\hat Q(0) - \\tfrac12\\big(\\hat Q(-0{,}6) + \\hat Q(0{,}6)\\big) = ' + texRaw(M, 3) + ' - ' + tex((L + R) / 2, 3) + ' = ' + texRaw(M - (L + R) / 2, 3) + ' = \\Sigma\\cdot 0{,}6^2 = ' + texRaw(Sg * 0.36, 3) + ' > 0\\end{aligned}');
      m2.querySelector('#bm-ins').innerHTML = 'Với <b>mọi</b> $\\mu$, $V$ và $\\Sigma > 0$: $\\hat Q(0) = \\tfrac12\\big(\\hat Q(-0{,}6) + \\hat Q(0{,}6)\\big) + 0{,}36\\,\\Sigma$, tức đi thẳng luôn được chấm <b>cao hơn</b> trung bình của rẽ trái và rẽ phải. Nếu $\\hat Q$ chấm cả hai hướng rẽ gần 1 như thật, nó buộc phải chấm đi thẳng còn cao hơn, trong khi thật là 0. Muốn khớp một đỉnh (như mặc định, $\\mu = 0{,}6$) thì phải chấm thấp hẳn đỉnh kia (đường bậc hai dưới $-1$ bị cắt khỏi khung). Đây là ý “hàm không thể thiết lập tùy ý” ở cuối mục 8.3.';
      ctx.typeset(m2.querySelector('#bm-ins'));
    }
    ['#bm-mu', '#bm-s', '#bm-v'].forEach(function (id) { m2.querySelector(id).oninput = bmDraw; });
    bmDraw(); onResize(bmDraw);

    // ---- từ DQN tới diễn viên-nhà phê bình ----
    var m3 = h('<section class="blk"><h2>Phương án 4: từ DQN tới diễn viên-nhà phê bình (hình 8.2)</h2><div class="flow">' +
      '<div class="fb"><div class="fx">DQN: $a = \\arg\\max_a Q(s, a)$</div><div class="fy">Chọn hành động bằng một bài toán tối ưu, khó khi $a$ liên tục.</div></div><div class="fa">↓</div>' +
      '<div class="fb"><div class="fx">Thay bài toán tối ưu bằng một mạng: diễn viên $a = \\pi_\\theta(s)$</div><div class="fy">Gradient chính sách / PPO (chương 4–5) học diễn viên.</div></div><div class="fa">↓</div>' +
      '<div class="fb"><div class="fx">Giữ một mạng đánh giá: nhà phê bình $Q_\\phi(s, a)$ hoặc $V_\\phi(s)$</div><div class="fy">Học bằng hồi quy TD giống DQN (chương 6).</div></div><div class="fa">↓</div>' +
      '<div class="fb eq"><div class="fx">Diễn viên-nhà phê bình (chương 9); DDPG cho hành động liên tục (chương 12)</div><div class="fy">Diễn viên đưa ra hành động liên tục trực tiếp; nhà phê bình chấm điểm để diễn viên cải thiện.</div></div>' +
      '</div></section>');
    root.appendChild(m3);
    ctx.typeset(root);
  }

  window.ReviewExtras = {
    tabs: [
      { id: 'lab', label: 'Thí nghiệm', render: renderLab },
      { id: 'map', label: 'Sơ đồ', render: renderMap }
    ]
  };
})();
