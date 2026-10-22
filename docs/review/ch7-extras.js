/* Thí nghiệm tương tác và sơ đồ trực quan cho chương 7 (các kỹ thuật nâng cao của DQN).
 * Trang index.html tải file này khi ch7.json có "extras": "ch7-extras.js".
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
  var css7 = String.raw`
  .rx svg.plot { display: block; width: 100%; height: auto; overflow: visible; }
  .rx svg.plot text { fill: var(--muted); font-size: 11px; font-family: inherit; }
  .rx svg.plot .lbl { fill: var(--text); font-weight: 600; }
  .rx .stat3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; margin-top: 10px; }
  .rx .stat3 > div { background: var(--surface-2); border-radius: 10px; padding: 8px 10px; font-size: .86rem; }
  .rx .stat3 b { display: block; font-size: 1.05rem; font-variant-numeric: tabular-nums; }
  .rx table.cmp td.hl { background: var(--hl-soft, #fbf1dc); font-weight: 700; }
  .rx .acts { display: grid; gap: 3px; margin: 8px 0; overflow-x: auto; }
  .rx .acts .row { display: flex; gap: 3px; align-items: center; }
  .rx .acts .lb { width: 6.5em; flex: none; font-size: .8rem; color: var(--muted); }
  .rx .acts span.c { width: 26px; height: 26px; flex: none; border-radius: 6px; display: grid; place-items: center; font-weight: 700; font-size: .8rem; color: #fff; }
  .rx .acts span.L { background: var(--s1); }
  .rx .acts span.R { background: var(--s2); }`;
  var st7 = document.createElement('style'); st7.textContent = css7; document.head.appendChild(st7);
  var C3 = '#1f9d6b';
  function gauss(r) { var u = r() || 1e-12, v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function table(head, rows, cls) { return '<div class="tscroll"><table class="cmp">' + '<thead><tr>' + head.map(function (x) { return '<th>' + x + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.map(function (r, i) { return '<tr>' + r.map(function (x, j) { return '<td' + (cls && cls[i] && cls[i][j] ? ' class="' + cls[i][j] + '"' : '') + '>' + x + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>'; }

  function renderLab(root, ctx) {
    root.innerHTML = '';
    root.classList.add('rx');

    // ============ 1. Ước lượng quá cao ============
    var b1 = h('<section class="blk">' +
      '<h2>1. Ước lượng quá cao: DQN và DQN kép (hình 7.2)</h2>' +
      '<p class="lead">Ở trạng thái $s\'$ có $K$ hành động, giá trị thật của <b>mọi</b> hành động đều bằng 0. Hai mạng (đang học $Q$ và mục tiêu $\\hat Q$) ước lượng có nhiễu độc lập, độ lệch chuẩn $\\sigma$, trung bình 0 (không chệch). DQN dùng $\\max_a\\hat Q(s\', a)$; DDQN dùng $\\hat Q(s\', \\arg\\max_a Q(s\', a))$. Giá trị đúng của cả hai là 0.</p>' +
      '<div class="ctrl"><label for="ov-k">$K$</label><input id="ov-k" type="range" min="2" max="20" step="1" value="4"><span class="val" id="ov-k-v"></span>' +
      '<label for="ov-s">$\\sigma$</label><input id="ov-s" type="range" min="0.1" max="2" step="0.1" value="1"><span class="val" id="ov-s-v"></span>' +
      '<button type="button" class="btn pri" id="ov-one">Lấy mẫu một lần</button></div>' +
      '<div class="chart" id="ov-bars"></div><div class="calc" id="ov-calc"></div>' +
      '<h3 class="sub">Độ chệch trung bình (4000 lần lấy mẫu) theo số hành động $K$</h3>' +
      '<div class="legend"><span class="li"><span class="sw" style="background:var(--s2)"></span>DQN: $\\mathbb{E}[\\max_a\\hat Q]$</span><span class="li"><span class="sw" style="background:var(--s1)"></span>DDQN</span></div>' +
      '<div class="chart" id="ov-chart"></div><div class="insight" id="ov-ins"></div></section>');
    root.appendChild(b1);
    var ovRand = seeded(3), ovLast = null;
    function ovK() { return +b1.querySelector('#ov-k').value; }
    function ovS() { return +b1.querySelector('#ov-s').value; }
    function ovSample() { var K = ovK(), s = ovS(), q1 = [], q2 = []; for (var k = 0; k < K; k++) { q1.push(s * gauss(ovRand)); q2.push(s * gauss(ovRand)); } return { q1: q1, q2: q2 }; }
    function ovBars() {
      var box = b1.querySelector('#ov-bars');
      if (!ovLast) { box.innerHTML = ''; b1.querySelector('#ov-calc').innerHTML = '<span class="rxs">Bấm “Lấy mẫu một lần”.</span>'; return; }
      var K = ovLast.q1.length, W = Math.max(300, box.clientWidth), H = 170, m = { l: 34, r: 8, t: 10, b: 24 }, iw = W - m.l - m.r, ih = H - m.t - m.b;
      var lim = Math.max(1, Math.ceil(Math.max.apply(null, ovLast.q1.concat(ovLast.q2).map(Math.abs)))), y = function (v) { return m.t + ih / 2 - v / lim * ih / 2; };
      var a1 = 0, a2 = 0; ovLast.q1.forEach(function (v, k) { if (v > ovLast.q1[a1]) a1 = k; }); ovLast.q2.forEach(function (v, k) { if (v > ovLast.q2[a2]) a2 = k; });
      var bw = iw / K, s = '<svg class="plot" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Ước lượng Q của từng hành động">';
      s += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(0) + '" y2="' + y(0) + '" stroke="var(--text)" stroke-width="1.5"/><text x="' + (m.l - 4) + '" y="' + (y(0) + 4) + '" text-anchor="end">0</text>';
      ovLast.q1.forEach(function (v, k) {
        var x = m.l + k * bw, w = bw * 0.36;
        [[v, 'var(--s1)', x + bw * 0.12, k === a1], [ovLast.q2[k], 'var(--s2)', x + bw * 0.52, k === a2]].forEach(function (b) {
          var y0 = y(0), y1 = y(b[0]); s += '<rect x="' + b[2].toFixed(1) + '" y="' + Math.min(y0, y1).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + Math.abs(y1 - y0).toFixed(1) + '" rx="2" fill="' + b[1] + '" fill-opacity="' + (b[3] ? 1 : 0.4) + '"/>';
        });
        if (K <= 12) s += '<text x="' + (x + bw / 2) + '" y="' + (H - 6) + '" text-anchor="middle">a' + (k + 1) + '</text>';
      });
      box.innerHTML = s + '</svg>';
      var dqn = ovLast.q2[a2], ddqn = ovLast.q2[a1];
      katexBlock(b1.querySelector('#ov-calc'), '\\begin{aligned}&\\text{DQN: } \\max_a\\hat Q(s\', a) = \\hat Q(s\', a_{' + (a2 + 1) + '}) = ' + texRaw(dqn, 2) + '\\\\&\\text{DDQN: } a^* = \\arg\\max_a Q(s\', a) = a_{' + (a1 + 1) + '},\\quad \\hat Q(s\', a^*) = ' + texRaw(ddqn, 2) + '\\\\&\\text{giá trị đúng: } 0\\end{aligned}');
    }
    var ovCurve = null;
    function ovStats() {
      var s = ovS(), KS = [], dq = [], dd = [], r = seeded(17);
      for (var K = 1; K <= 20; K++) {
        var a = 0, b = 0, n = 4000;
        for (var i = 0; i < n; i++) { var m1 = -1e9, i1 = 0, q2 = [], m2 = -1e9; for (var k = 0; k < K; k++) { var x1 = s * gauss(r), x2 = s * gauss(r); q2.push(x2); if (x1 > m1) { m1 = x1; i1 = k; } if (x2 > m2) m2 = x2; } a += m2 / n; b += q2[i1] / n; }
        KS.push(K); dq.push(a); dd.push(b);
      }
      ovCurve = { KS: KS, dq: dq, dd: dd };
      ovChart();
      var K0 = ovK();
      b1.querySelector('#ov-ins').innerHTML = 'Với $K = ' + K0 + '$, $\\sigma = ' + texRaw(s, 1) + '$: DQN chệch lên trung bình <b>' + fmtNum(dq[K0 - 1], 2) + '</b>, DDQN chỉ <b>' + fmtNum(dd[K0 - 1], 2) + '</b>. Từng ước lượng đều không chệch, nhưng $\\max$ của chúng thì chệch, và càng nhiều hành động, càng nhiễu thì càng chệch (khoảng $\\sigma\\sqrt{2\\ln K}$). DDQN chọn bằng mạng này, đánh giá bằng mạng kia có nhiễu độc lập, nên hết chệch lên (tab Chứng minh). Trong DQN thật, độ chệch này còn bị bootstrapping truyền ngược qua nhiều bước nên tích lũy thành đường đỏ ở hình 7.1.';
      ctx.typeset(b1.querySelector('#ov-ins'));
    }
    function ovChart() { if (!ovCurve) return; lineChart(b1.querySelector('#ov-chart'), { series: [{ name: 'DQN', color: 'var(--s2)', values: ovCurve.dq }, { name: 'DDQN', color: 'var(--s1)', values: ovCurve.dd }], xs: ovCurve.KS, xFmt: function (v) { return 'K = ' + v; }, yMin: -0.5, yMax: Math.max(1, Math.ceil(Math.max.apply(null, ovCurve.dq) * 2) / 2), yTicks: [-0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4].filter(function (t) { return t <= Math.max(1, Math.ceil(Math.max.apply(null, ovCurve.dq) * 2) / 2); }), dec: 1, tipDec: 3, xLabel: 'Số hành động', refs: [{ y: 0, label: 'đúng = 0' }], aria: 'Độ chệch theo số hành động' }); }
    function ovLabels() { b1.querySelector('#ov-k-v').textContent = ovK(); b1.querySelector('#ov-s-v').textContent = fmtNum(ovS(), 1); }
    b1.querySelector('#ov-k').oninput = function () { ovLabels(); ovLast = null; ovBars(); ovStats(); };
    b1.querySelector('#ov-s').oninput = function () { ovLabels(); ovLast = null; ovBars(); ovStats(); };
    b1.querySelector('#ov-one').onclick = function () { ovLast = ovSample(); ovBars(); };
    b1.querySelector('#ov-bars').insertAdjacentHTML('beforebegin', '<div class="legend"><span class="li"><span class="sw box" style="background:var(--s1)"></span>$Q$ (mạng đang học, dùng để chọn trong DDQN)</span><span class="li"><span class="sw box" style="background:var(--s2)"></span>$\\hat Q$ (mạng mục tiêu)</span><span class="li">cột đậm: hành động có giá trị lớn nhất của mạng đó</span></div>');
    onResize(function () { ovBars(); ovChart(); });
    ovLabels(); ovLast = ovSample(); ovBars(); ovStats();

    // ============ 2. Dueling ============
    var TQ = [5, 4, 6];
    var b2 = h('<section class="blk">' +
      '<h2>2. DQN đối đầu: học được cả hành động chưa được lấy mẫu (hình 7.4)</h2>' +
      '<p class="lead">Một trạng thái, 3 hành động, giá trị thật $Q = (5;\\ 4;\\ 6)$. Tác tử chỉ lấy mẫu được $a_1$ và $a_2$; <b>$a_3$ không bao giờ được thử</b>. Mỗi lần cập nhật: chọn $a_1$ hoặc $a_2$, mục tiêu = giá trị thật + nhiễu nhỏ, một bước giảm gradient (tốc độ học $0{,}1$) cho ba mô hình cùng lúc.</p>' +
      '<div class="ctrl"><button type="button" class="btn pri" id="du-one">1 lần cập nhật</button><button type="button" class="btn" id="du-many">+50 lần</button><button type="button" class="btn" id="du-reset">Đặt lại</button><span class="rxs">Đã cập nhật <b id="du-k">0</b> lần</span></div>' +
      '<div id="du-tab"></div><div class="insight" id="du-ins"></div></section>');
    root.appendChild(b2);
    var DU, duRand = seeded(23);
    function duReset() { DU = { k: 0, tab: [0, 0, 0], u: { V: 0, A: [0, 0, 0] }, c: { V: 0, A: [0, 0, 0] } }; duDraw(); }
    function qU() { return DU.u.A.map(function (a) { return DU.u.V + a; }); }
    function qC() { var m = (DU.c.A[0] + DU.c.A[1] + DU.c.A[2]) / 3; return DU.c.A.map(function (a) { return DU.c.V + a - m; }); }
    function duStep() {
      var a = duRand() < 0.5 ? 0 : 1, y = TQ[a] + 0.3 * gauss(duRand), lr = 0.1, e;
      e = y - DU.tab[a]; DU.tab[a] += lr * e;
      e = y - qU()[a]; DU.u.V += lr * e; DU.u.A[a] += lr * e;
      e = y - qC()[a]; DU.c.V += lr * e; for (var k = 0; k < 3; k++) DU.c.A[k] += lr * e * ((k === a ? 1 : 0) - 1 / 3);
      DU.k++;
    }
    function duDraw() {
      b2.querySelector('#du-k').textContent = DU.k;
      var qu = qU(), qc = qC(), mc = (DU.c.A[0] + DU.c.A[1] + DU.c.A[2]) / 3;
      var f = function (v) { return fmtNum(v, 2); };
      b2.querySelector('#du-tab').innerHTML = table(['Mô hình', '$Q(a_1)$', '$Q(a_2)$', '$Q(a_3)$ <span class="rxs">(chưa thử)</span>', 'Tham số'], [
        ['Giá trị thật', '5', '4', '6', ''],
        ['Bảng $Q$ (DQN thường)', f(DU.tab[0]), f(DU.tab[1]), f(DU.tab[2]), 'mỗi ô một số riêng'],
        ['Đối đầu, không ràng buộc', f(qu[0]), f(qu[1]), f(qu[2]), '$V = ' + texRaw(DU.u.V, 2) + '$, $A = ' + vec(DU.u.A, 2) + '$'],
        ['Đối đầu, $A$ trung bình 0', f(qc[0]), f(qc[1]), f(qc[2]), '$V = ' + texRaw(DU.c.V, 2) + '$, $A - \\bar A = ' + vec(DU.c.A.map(function (x) { return x - mc; }), 2) + '$']
      ], [null, [0, 0, 0, 'hl'], [0, 0, 0, 'hl'], [0, 0, 0, 'hl']]);
      ctx.typeset(b2.querySelector('#du-tab'));
      b2.querySelector('#du-ins').innerHTML = !DU.k ? 'Mọi mô hình bắt đầu từ 0. Bấm cập nhật và để ý cột $Q(a_3)$.'
        : 'Bảng $Q$ không bao giờ đụng tới $a_3$ nên $Q(a_3)$ vẫn là $0$. Hai mô hình đối đầu kéo $Q(a_3)$ lên tới ' + f(qu[2]) + ' và ' + f(qc[2]) + ': khi sửa $V$ để khớp $a_1, a_2$, mức chung của trạng thái được nâng lên cho <b>mọi</b> hành động. Với ràng buộc trung bình 0, $V$ đúng bằng trung bình các $Q$ (tab Chứng minh). $Q(a_3)$ vẫn chưa đúng 6, vì không có dữ liệu nào nói $a_3$ tốt hơn mức chung, nhưng đã gần hơn nhiều so với 0.';
      ctx.typeset(b2.querySelector('#du-ins'));
    }
    b2.querySelector('#du-one').onclick = function () { duStep(); duDraw(); };
    b2.querySelector('#du-many').onclick = function () { for (var i = 0; i < 50; i++) duStep(); duDraw(); };
    b2.querySelector('#du-reset').onclick = duReset;
    duReset();

    // ============ 3. PER ============
    var b3 = h('<section class="blk">' +
      '<h2>3. Phát lại ưu tiên trên bài “vách đá mù” (bổ sung)</h2>' +
      '<p class="lead">Ví dụ trong bài báo PER. Chuỗi $n$ trạng thái; ở mỗi trạng thái, một hành động đi tiếp, hành động kia kết thúc tập với phần thưởng 0; chỉ đi đúng hết $n$ bước mới được $+1$. Bộ đệm chứa kinh nghiệm của $2^n$ tập đi ngẫu nhiên, nên chuyển tiếp có thưởng <b>rất hiếm</b>. Học bảng $Q$ bằng cách lấy mẫu từ bộ đệm cho tới khi sai số nhỏ hơn $10^{-3}$, so sánh lấy mẫu đều với lấy mẫu ưu tiên $P(i) \\propto |\\delta_i| + \\epsilon$.</p>' +
      '<div class="ctrl"><label for="pe-n">$n$</label><input id="pe-n" type="range" min="4" max="10" step="1" value="8"><span class="val" id="pe-n-v"></span><button type="button" class="btn pri" id="pe-run">Chạy 5 lần</button></div>' +
      '<div class="stat3" id="pe-stat"></div>' +
      '<div class="legend"><span class="li"><span class="sw" style="background:var(--muted)"></span>lấy mẫu đều</span><span class="li"><span class="sw" style="background:var(--s1)"></span>ưu tiên</span></div>' +
      '<div class="chart" id="pe-chart"></div><div class="insight" id="pe-ins">Bấm “Chạy”.</div>' +
      '<h3 class="sub">Công thức lấy mẫu và trọng số bù độ lệch</h3>' +
      '<div class="ctrl"><label for="pe-a">$\\alpha$</label><input id="pe-a" type="range" min="0" max="1" step="0.1" value="0.6"><span class="val" id="pe-a-v"></span><label for="pe-b">$\\beta$</label><input id="pe-b" type="range" min="0" max="1" step="0.1" value="0.4"><span class="val" id="pe-b-v"></span></div>' +
      '<div id="pe-tab"></div></section>');
    root.appendChild(b3);
    function cliffBuf(n, rand) {
      var T = [], M = Math.pow(2, n), succ = false;
      for (var m = 0; m < M || !succ; m++) { var s = 0; while (true) { var a = rand() < 0.5 ? 1 : 0; if (!a) { T.push({ s: s, a: 0, r: 0, d: true }); break; } if (s === n - 1) { T.push({ s: s, a: 1, r: 1, d: true }); succ = true; break; } T.push({ s: s, a: 1, r: 0, d: false }); s++; } }
      return T;
    }
    function cliffRun(n, per, rand, T) {
      var g = 1 - 1 / n, Q = [], pr = T.map(function () { return 1; }), tot = T.length, k = 0, curve = [];
      for (var s = 0; s < n; s++) Q.push([0, 0]);
      var err = function () { var e = 0; for (var s2 = 0; s2 < n; s2++) e += Math.pow(Q[s2][1] - Math.pow(g, n - 1 - s2), 2) + Q[s2][0] * Q[s2][0]; return e / (2 * n); };
      while (k < 60000) {
        if (k % 50 === 0) { var e0 = err(); curve.push(e0); if (e0 < 1e-3) break; }
        var i; if (!per) i = Math.floor(rand() * T.length); else { var u = rand() * tot; i = 0; while (i < T.length - 1 && u > pr[i]) { u -= pr[i]; i++; } }
        var e = T[i], y = e.d ? e.r : e.r + g * Math.max(Q[e.s + 1][0], Q[e.s + 1][1]), dlt = y - Q[e.s][e.a]; Q[e.s][e.a] += 0.5 * dlt;
        if (per) { var np = Math.abs(dlt) + 1e-3; tot += np - pr[i]; pr[i] = np; }
        k++;
      }
      return { k: k, curve: curve };
    }
    var peRes = null;
    function peChart() {
      if (!peRes) return;
      var lg = function (a) { return a.map(function (v) { return Math.log10(Math.max(v, 1e-4)); }); };
      lineChart(b3.querySelector('#pe-chart'), { series: [{ name: 'Đều', color: 'var(--muted)', values: lg(peRes.u) }, { name: 'Ưu tiên', color: 'var(--s1)', values: lg(peRes.p) }],
        yMin: -3.2, yMax: 0, yTicks: [-3, -2, -1, 0], dec: 0, tipDec: 2, xLabel: 'Lần cập nhật (×50)', refs: [{ y: -3, label: 'ngưỡng 10⁻³' }], aria: 'log10 sai số theo số lần cập nhật' });
    }
    b3.querySelector('#pe-run').onclick = function () {
      var btn = this; btn.disabled = true;
      setTimeout(function () {
        var n = +b3.querySelector('#pe-n').value, r = seeded(2), U = [], P = [], cu = null, cp = null, bl = 0, nr = 0;
        for (var i = 0; i < 5; i++) { var T = cliffBuf(n, r); bl += T.length / 5; nr += T.filter(function (x) { return x.r > 0; }).length / 5; var a = cliffRun(n, false, r, T), b = cliffRun(n, true, r, T); U.push(a.k); P.push(b.k); if (!cu) { cu = a.curve; cp = b.curve; } }
        peRes = { u: cu, p: cp }; peChart();
        var mu = U.reduce(function (x, y) { return x + y; }, 0) / 5, mp = P.reduce(function (x, y) { return x + y; }, 0) / 5;
        b3.querySelector('#pe-stat').innerHTML = '<div>Kích thước bộ đệm (TB)<b>' + fmtNum(bl, 0) + '</b></div><div>Số mẫu có thưởng (TB)<b>' + fmtNum(nr, 1) + '</b></div><div>Số lần cập nhật, lấy đều<b>' + fmtNum(mu, 0) + '</b></div><div>Số lần cập nhật, ưu tiên<b>' + fmtNum(mp, 0) + '</b></div>';
        b3.querySelector('#pe-ins').innerHTML = 'Với $n = ' + n + '$: lấy mẫu ưu tiên cần ít hơn khoảng <b>' + fmtNum(mu / mp, 1) + ' lần</b>. Lấy đều thì phần lớn lần cập nhật rơi vào các mẫu “kết thúc với 0” đã học xong; ưu tiên thì sau khi một mẫu đã khớp ($|\\delta|$ nhỏ), nó ít được lấy lại, nhường chỗ cho mẫu có thưởng hiếm và các mẫu ngay trước nó, nơi thông tin đang lan truyền. Đồ thị là lần chạy đầu tiên (trục tung theo thang log).';
        ctx.typeset(b3.querySelector('#pe-ins'));
        btn.disabled = false;
      }, 30);
    };
    var TD = [2, 1, 0.5, 0.2, 0.1];
    function peTab() {
      var a = +b3.querySelector('#pe-a').value, bb = +b3.querySelector('#pe-b').value;
      b3.querySelector('#pe-a-v').textContent = fmtNum(a, 1); b3.querySelector('#pe-b-v').textContent = fmtNum(bb, 1);
      var p = TD.map(function (d) { return Math.pow(d, a); }), S = p.reduce(function (x, y) { return x + y; }, 0), P = p.map(function (x) { return x / S; }), Nn = TD.length;
      var w = P.map(function (q) { return Math.pow(1 / (Nn * q), bb); }), wm = Math.max.apply(null, w);
      b3.querySelector('#pe-tab').innerHTML = table(['Mẫu', '$|\\delta_i|$', '$P(i) = p_i^{\\alpha}/\\sum_k p_k^{\\alpha}$', '$w_i = \\big(\\tfrac{1}{N P(i)}\\big)^{\\beta}$ (chia cho max)'],
        TD.map(function (d, i) { return [i + 1, fmtNum(d, 1), fmtNum(P[i], 3), fmtNum(w[i] / wm, 3)]; }));
      ctx.typeset(b3.querySelector('#pe-tab'));
    }
    ['#pe-a', '#pe-b'].forEach(function (id) { b3.querySelector(id).oninput = peTab; });
    b3.querySelector('#pe-n').oninput = function () { b3.querySelector('#pe-n-v').textContent = b3.querySelector('#pe-n').value; };
    b3.querySelector('#pe-n').oninput();
    onResize(peChart);
    peTab();

    // ============ 4. Mạng nhiễu ============
    var b4 = h('<section class="blk">' +
      '<h2>4. Mạng nhiễu và $\\varepsilon$-tham lam: khám phá có hệ thống hay ngẫu nhiên</h2>' +
      '<p class="lead">Một trạng thái $s$ được gặp 10 lần trong mỗi tập. $Q(s, \\text{trái}) = 1{,}0$, $Q(s, \\text{phải}) = 0{,}9$. Mỗi ô là hành động được chọn ở lần gặp đó (<b style="color:var(--s1)">T</b>: trái, <b style="color:var(--s2)">P</b>: phải). $\\varepsilon$-tham lam lấy ngẫu nhiên ở <b>mỗi bước</b>; mạng nhiễu lấy nhiễu cho tham số <b>một lần mỗi tập</b> (ở đây mô phỏng bằng nhiễu cộng vào hai giá trị $Q$).</p>' +
      '<div class="ctrl"><label for="nz-e">$\\varepsilon$</label><input id="nz-e" type="range" min="0.1" max="0.6" step="0.05" value="0.3"><span class="val" id="nz-e-v"></span><label for="nz-s">độ lớn nhiễu</label><input id="nz-s" type="range" min="0.05" max="0.5" step="0.05" value="0.15"><span class="val" id="nz-s-v"></span><button type="button" class="btn" id="nz-re">Lấy mẫu lại</button></div>' +
      '<div class="acts" id="nz"></div><div class="insight" id="nz-ins"></div></section>');
    root.appendChild(b4);
    var nzRand = seeded(31);
    function nzDraw() {
      var e = +b4.querySelector('#nz-e').value, sg = +b4.querySelector('#nz-s').value;
      b4.querySelector('#nz-e-v').textContent = fmtNum(e, 2); b4.querySelector('#nz-s-v').textContent = fmtNum(sg, 2);
      var rows = '', sw1 = 0, sw2 = 0;
      for (var ep = 0; ep < 6; ep++) {
        var r1 = '<div class="row"><span class="lb">ε-tham lam, tập ' + (ep + 1) + '</span>', prev = null;
        for (var t = 0; t < 10; t++) { var a = nzRand() < e ? (nzRand() < 0.5 ? 0 : 1) : 0; r1 += '<span class="c ' + (a ? 'R' : 'L') + '">' + (a ? 'P' : 'T') + '</span>'; if (prev != null && prev !== a) sw1++; prev = a; }
        rows += r1 + '</div>';
      }
      rows += '<div class="row" style="height:8px"></div>';
      for (var ep2 = 0; ep2 < 6; ep2++) {
        var nL = 1 + sg * gauss(nzRand), nR = 0.9 + sg * gauss(nzRand), a2 = nR > nL ? 1 : 0, r2 = '<div class="row"><span class="lb">mạng nhiễu, tập ' + (ep2 + 1) + '</span>';
        for (var t2 = 0; t2 < 10; t2++) r2 += '<span class="c ' + (a2 ? 'R' : 'L') + '">' + (a2 ? 'P' : 'T') + '</span>';
        rows += r2 + '</div>';
      }
      b4.querySelector('#nz').innerHTML = rows;
      b4.querySelector('#nz-ins').innerHTML = '$\\varepsilon$-tham lam: trong cùng một tập, ở cùng trạng thái mà hành động đổi qua đổi lại (' + sw1 + ' lần đổi trong 6 tập), giống “thử bừa”. Mạng nhiễu: mỗi tập <b>nhất quán</b> một hành động ở trạng thái đó, nhưng các tập khác nhau có thể thử hành động khác: khám phá <b>phụ thuộc trạng thái</b>, có hệ thống. Nhờ vậy tác tử có thể đi theo một hướng mới đủ lâu để thấy hậu quả của nó.';
      ctx.typeset(b4.querySelector('#nz-ins'));
    }
    ['#nz-e', '#nz-s'].forEach(function (id) { b4.querySelector(id).oninput = nzDraw; });
    b4.querySelector('#nz-re').onclick = nzDraw;
    nzDraw();

    ctx.typeset(root);
  }

  // ======================================================================
  // TAB "Sơ đồ"
  // ======================================================================
  function renderMap(root, ctx) {
    root.innerHTML = '';
    root.classList.add('rx');

    var m1 = h('<section class="blk"><h2>Mục tiêu hồi quy của từng biến thể</h2>' + table(['Biến thể', 'Mục tiêu $y$ cho $Q(s_t, a_t)$', 'Thay đổi gì'], [
      ['DQN', '$r_t + \\gamma\\max_a\\hat Q(s_{t+1}, a)$', '(chương 6)'],
      ['DQN kép', '$r_t + \\gamma\\hat Q\\big(s_{t+1}, \\arg\\max_a Q(s_{t+1}, a)\\big)$', 'Mạng đang học chọn, mạng mục tiêu đánh giá'],
      ['Nhiều bước', '$\\sum_{k=0}^{N}\\gamma^k r_{t+k} + \\gamma^{N+1}\\max_a\\hat Q(s_{t+N+1}, a)$', 'Thêm phần thưởng thật, bớt dựa vào $\\hat Q$'],
      ['Đối đầu', 'như DQN', 'Kiến trúc: $Q = V + A - \\bar A$'],
      ['PER', 'như DQN, nhân trọng số $w_i$', 'Lấy mẫu theo $|\\delta_i|$'],
      ['Mạng nhiễu', 'như DQN', 'Hành động theo $\\arg\\max\\tilde Q$, nhiễu tham số theo tập'],
      ['Phân phối', 'phân phối của $r_t + \\gamma Z(s_{t+1}, a^*)$', 'Học cả phân phối thay vì trung bình']]) + '</section>');
    root.appendChild(m1);

    // ---- phân phối ----
    var m2 = h('<section class="blk"><h2>Hàm Q phân phối: cùng trung bình, khác rủi ro (hình 7.8–7.9)</h2>' +
      '<div class="ctrl"><div class="seg" id="ds-p"><button type="button" data-v="0" aria-pressed="true">Hai hành động cùng trung bình</button><button type="button" data-v="1" aria-pressed="false">Phần thưởng hiếm vượt khoảng</button></div></div>' +
      '<div class="ctrl" id="ds-ctl"><label for="ds-q">xác suất được 100</label><input id="ds-q" type="range" min="0" max="0.2" step="0.01" value="0.05"><span class="val" id="ds-q-v"></span></div>' +
      '<div class="chart" id="ds-plot"></div><div class="calc" id="ds-calc"></div><div class="insight" id="ds-ins"></div></section>');
    root.appendChild(m2);
    var BINS = [-10, -5, 0, 5, 10];
    function dsDraw() {
      var md = segVal(m2.querySelector('#ds-p')), box = m2.querySelector('#ds-plot');
      m2.querySelector('#ds-ctl').style.display = md === '1' ? '' : 'none';
      var dists, names;
      if (md === '0') { dists = [[0.1, 0.1, 0.6, 0.1, 0.1], [0, 0.3, 0.4, 0.3, 0]]; names = ['$a_1$', '$a_2$']; }
      else { var q = +m2.querySelector('#ds-q').value; m2.querySelector('#ds-q-v').textContent = fmtNum(q, 2); dists = [[0, 0.2 * (1 - q), 0.6 * (1 - q), 0.2 * (1 - q), q]]; names = ['$a$']; }
      var W = Math.max(300, box.clientWidth), H = 160, m = { l: 30, r: 10, t: 10, b: 24 }, iw = W - m.l - m.r, ih = H - m.t - m.b, bw = iw / 5, cols = ['var(--s1)', 'var(--s2)'];
      var s = '<svg class="plot" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Phân phối phần thưởng theo cột">';
      dists.forEach(function (d, j) { d.forEach(function (p, k) { var hh = p * ih, x = m.l + k * bw + (dists.length > 1 ? (j ? bw * 0.5 : bw * 0.1) : bw * 0.2), w = dists.length > 1 ? bw * 0.4 : bw * 0.6; s += '<rect x="' + x.toFixed(1) + '" y="' + (m.t + ih - hh).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + hh.toFixed(1) + '" rx="3" fill="' + cols[j] + '" fill-opacity=".85"/>'; }); });
      BINS.forEach(function (b, k) { s += '<text x="' + (m.l + k * bw + bw / 2) + '" y="' + (H - 6) + '" text-anchor="middle">' + b + '</text>'; });
      box.innerHTML = s + '</svg>';
      var mean = function (d) { return d.reduce(function (a, p, k) { return a + p * BINS[k]; }, 0); }, vr = function (d) { var mu = mean(d); return d.reduce(function (a, p, k) { return a + p * Math.pow(BINS[k] - mu, 2); }, 0); };
      if (md === '0') {
        katexBlock(m2.querySelector('#ds-calc'), '\\begin{aligned}&a_1:\\ \\mathbb{E} = ' + texRaw(mean(dists[0]), 2) + ',\\quad \\operatorname{Var} = ' + texRaw(vr(dists[0]), 2) + '\\\\&a_2:\\ \\mathbb{E} = ' + texRaw(mean(dists[1]), 2) + ',\\quad \\operatorname{Var} = ' + texRaw(vr(dists[1]), 2) + '\\end{aligned}');
        m2.querySelector('#ds-ins').innerHTML = 'DQN thường chỉ thấy hai số $Q$ bằng nhau ($0$). Hàm Q phân phối thấy $a_1$ có đuôi rủi ro ($\\pm 10$) còn $a_2$ thì không: khi trung bình như nhau có thể chọn $a_2$ để tránh rủi ro.';
      } else {
        var q2 = +m2.querySelector('#ds-q').value, trueMean = (1 - q2) * 0 + q2 * 100;
        katexBlock(m2.querySelector('#ds-calc'), '\\begin{aligned}&\\text{thật: } \\mathbb{E}[R] = ' + texRaw(1 - q2, 2) + '\\cdot 0 + ' + texRaw(q2, 2) + '\\cdot 100 = ' + texRaw(trueMean, 2) + '\\\\&\\text{phân phối bị giới hạn trong } [-10, 10]\\text{: } \\mathbb{E} = ' + texRaw(mean(dists[0]), 2) + '\\end{aligned}');
        m2.querySelector('#ds-ins').innerHTML = 'Phần thưởng 100 nằm ngoài khoảng $[-10, 10]$ nên bị dồn vào cột 10 (hoặc bị bỏ): trung bình theo phân phối chỉ còn ' + fmtNum(mean(dists[0]), 2) + ' thay vì ' + fmtNum(trueMean, 2) + '. Hàm Q phân phối có xu hướng <b>ước lượng quá thấp</b>, nên trong Rainbow, DDQN (chống ước lượng quá cao) gần như không còn tác dụng (hình 7.11).';
      }
      ctx.typeset(m2.querySelector('#ds-ins'));
    }
    seg(m2.querySelector('#ds-p'), dsDraw);
    m2.querySelector('#ds-q').oninput = dsDraw;
    onResize(dsDraw);
    dsDraw();

    var m3 = h('<section class="blk"><h2>Rainbow: mỗi “màu” giải quyết gì (hình 7.10–7.11)</h2>' + table(['Thành phần', 'Giải quyết', 'Bỏ khỏi Rainbow thì (hình 7.11)'], [
      ['DQN kép', 'Ước lượng quá cao', 'Gần như không đổi'],
      ['Đối đầu', 'Dùng dữ liệu hiệu quả hơn ($V$ chung)', 'Kém đi một chút'],
      ['Phát lại ưu tiên', 'Dồn cập nhật vào mẫu khó', 'Tụt'],
      ['Nhiều bước', 'Cân bằng MC và TD', '<b>Tụt mạnh nhất</b>'],
      ['Mạng nhiễu', 'Khám phá có hệ thống', 'Kém đi một chút'],
      ['Phân phối', 'Giữ thông tin cả phân phối', 'Học nhanh như thường nhưng hội tụ kém hơn']]) +
      '<p class="rxs" style="margin:10px 0 0">Điểm trên trục dọc là <b>trung vị</b> qua các trò chơi Atari, vì điểm các trò chơi chênh nhau rất lớn.</p></section>');
    root.appendChild(m3);
    ctx.typeset(root);
  }

  // ======================================================================
  // TAB "Mô phỏng": liên kết tới các trang docs/viz
  // ======================================================================
  var VIZ = [
    ['maxbias.html', 'Mục 7.1', 'Thiên lệch do max', 'Q-learning và Q-learning kép từng bước trên ví dụ 6.7 của Sutton & Barto.'],
    ['rainbow-mini.html', 'Mục 7.1–7.4, 7.7', 'Rainbow thu nhỏ trên CartPole', 'Bật/tắt DQN kép, đối đầu, phát lại ưu tiên, nhiều bước; bỏ từng thành phần như hình 7.11.']
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
