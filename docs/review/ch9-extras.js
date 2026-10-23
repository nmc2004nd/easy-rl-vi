/* Thí nghiệm tương tác và sơ đồ trực quan cho chương 9 (diễn viên-nhà phê bình).
 * Trang index.html tải file này khi ch9.json có "extras": "ch9-extras.js".
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
    opt.yTicks.forEach(function (v) { s += '<text x="' + (m.l - 6) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + (opt.yFmt ? opt.yFmt(v) : fmtNum(v, opt.dec || 0)) + '</text>'; });
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
        rows.push('<span class="sw dot" style="background:' + se.color + '"></span> ' + se.name + ': <b>' + (opt.tipFmt ? opt.tipFmt(v) : fmtNum(v, dd)) + '</b>' +
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
  var css9 = String.raw`
  .rx svg.plot { display: block; width: 100%; height: auto; overflow: visible; }
  .rx svg.plot text { fill: var(--muted); font-size: 11px; font-family: inherit; }
  .rx svg.plot .lbl { fill: var(--text); font-weight: 600; }
  .rx .stat3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; margin-top: 10px; }
  .rx .stat3 > div { background: var(--surface-2); border-radius: 10px; padding: 8px 10px; font-size: .86rem; }
  .rx .stat3 b { display: block; font-size: 1.05rem; font-variant-numeric: tabular-nums; }
  .rx .insight, .rx .lead, .rx .tscroll { position: relative; }
  .rx table.cmp td.hl { background: var(--hl-soft, #fbf1dc); font-weight: 700; }
  .rx .chain { display: flex; gap: 4px; justify-content: center; flex-wrap: wrap; margin: 8px 0; }
  .rx .chain span { min-width: 34px; padding: 4px 2px; border-radius: 8px; text-align: center; font-size: .74rem; border: 1px solid var(--border); background: var(--surface); font-variant-numeric: tabular-nums; }
  .rx .chain span b { display: block; font-size: .82rem; }
  .rx .chain span.cur { border-color: var(--s2); box-shadow: inset 0 0 0 1px var(--s2); }
  .rx .chain span.goal { background: var(--accent-soft); }`;
  var st9 = document.createElement('style'); st9.textContent = css9; document.head.appendChild(st9);
  var C3 = 'var(--accent-text)';
  function gauss(r) { var u = r() || 1e-12, v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function table(head, rows) { return '<div class="tscroll"><table class="cmp"' + (head.length > 3 ? ' style="min-width:620px"' : '') + '><thead><tr>' + head.map(function (x) { return '<th>' + x + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.map(function (r) { return '<tr>' + r.map(function (x) { return '<td>' + x + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>'; }
  function mean(a) { return a.reduce(function (x, y) { return x + y; }, 0) / a.length; }
  function sd(a) { var m = mean(a); return Math.sqrt(a.reduce(function (x, y) { return x + (y - m) * (y - m); }, 0) / a.length); }
  function smooth(a, w) { return a.map(function (_, i) { var s = 0, n = 0; for (var j = Math.max(0, i - w + 1); j <= i; j++) { s += a[j]; n++; } return s / n; }); }
  function sm2(z) { var m = Math.max(z[0], z[1]), e0 = Math.exp(z[0] - m), e1 = Math.exp(z[1] - m); return e1 / (e0 + e1); }

  function renderLab(root, ctx) {
    root.innerHTML = '';
    root.classList.add('rx');

    // ============ 1. Phương sai và độ chệch ============
    var b1 = h('<section class="blk">' +
      '<h2>1. Ước lượng lợi thế: $G - V(s)$ hay $r + V(s\') - V(s)$? (mục 9.3)</h2>' +
      '<p class="lead">Chuỗi $L$ ô, hai đầu là ô kết thúc; vào ô phải được $+1$, ô trái được 0. Chính sách: chọn “phải” với xác suất $0{,}6$; hành động đi đúng hướng với xác suất $0{,}8$, trượt ngược $0{,}2$. Mỗi bước có thêm nhiễu phần thưởng $\\mathcal N(0, \\sigma^2)$. $\\gamma = 1$. Ta ước lượng lợi thế $A(s, \\text{phải})$ ở ô giữa bằng 2000 lần lấy mẫu, theo hai cách, với nhà phê bình $\\hat V = V_\\pi + e$ ($e$ là sai số ngẫu nhiên cố định cho mỗi ô, độ lớn tới $\\varepsilon$).</p>' +
      '<div class="ctrl"><label for="vb-l">$L$</label><input id="vb-l" type="range" min="5" max="21" step="2" value="11"><span class="val" id="vb-l-v"></span>' +
      '<label for="vb-s">$\\sigma$</label><input id="vb-s" type="range" min="0" max="1" step="0.05" value="0.3"><span class="val" id="vb-s-v"></span>' +
      '<label for="vb-e">$\\varepsilon$</label><input id="vb-e" type="range" min="0" max="0.3" step="0.02" value="0"><span class="val" id="vb-e-v"></span></div>' +
      '<div class="legend"><span class="li"><span class="sw box" style="background:var(--s1)"></span>Monte Carlo: $G - \\hat V(s)$</span><span class="li"><span class="sw box" style="background:var(--s2)"></span>TD (A2C): $r + \\hat V(s\') - \\hat V(s)$</span><span class="li"><span class="sw" style="background:var(--text)"></span>$A$ đúng</span></div>' +
      '<div class="chart" id="vb-plot"></div><div class="tscroll" id="vb-tab"></div><div class="calc" id="vb-calc"></div><div class="insight" id="vb-ins"></div></section>');
    root.appendChild(b1);
    function vbRun() {
      var L = +b1.querySelector('#vb-l').value, sg = +b1.querySelector('#vb-s').value, ep = +b1.querySelector('#vb-e').value;
      b1.querySelector('#vb-l-v').textContent = L; b1.querySelector('#vb-s-v').textContent = fmtNum(sg, 2); b1.querySelector('#vb-e-v').textContent = fmtNum(ep, 2);
      var pr = 0.6 * 0.8 + 0.4 * 0.2, rho = (1 - pr) / pr, W = [], s0 = (L + 1) / 2, ur = seeded(91), e = [0];
      for (var k = 0; k <= L + 1; k++) W.push((1 - Math.pow(rho, k)) / (1 - Math.pow(rho, L + 1)));
      for (var k2 = 1; k2 <= L; k2++) e.push(ep * (2 * ur() - 1)); e.push(0);
      var Vh = function (k) { return k === 0 || k === L + 1 ? 0 : W[k] + e[k]; };
      var Q = 0.8 * W[s0 + 1] + 0.2 * W[s0 - 1], A = Q - W[s0];
      var r = seeded(92), mc = [], td = [], lens = [];
      for (var n = 0; n < 2000; n++) {
        var s = s0, G = 0, first = true, T = 0;
        while (s > 0 && s <= L && T < 2000) {
          var right = first ? true : r() < 0.6, mv = (r() < 0.8) === right ? 1 : -1, s2 = s + mv, rw = sg * gauss(r) + (s2 === L + 1 ? 1 : 0);
          if (first) td.push(rw + Vh(s2) - Vh(s));
          G += rw; s = s2; first = false; T++;
        }
        mc.push(G - Vh(s0)); lens.push(T);
      }
      return { L: L, sg: sg, ep: ep, A: A, Q: Q, V: W[s0], mc: mc, td: td, len: mean(lens), bias: 0.8 * e[s0 + 1] + 0.2 * e[s0 - 1], es: e[s0], s0: s0, W: W, Vh: Vh };
    }
    function vbDraw() {
      var o = vbRun(), box = b1.querySelector('#vb-plot');
      var lo = Math.min(quant(o.mc, 0.005), quant(o.td, 0.005), o.A - 0.2), hi = Math.max(quant(o.mc, 0.995), quant(o.td, 0.995), o.A + 0.2), NB = 44, bw = (hi - lo) / NB;
      var hist = function (a) { var c = new Array(NB).fill(0); a.forEach(function (v) { var i = Math.floor((v - lo) / bw); if (i >= 0 && i < NB) c[i]++; }); return c; };
      var hm = hist(o.mc), ht = hist(o.td), mx = Math.max.apply(null, hm.concat(ht));
      var Wd = Math.max(300, box.clientWidth), H = 180, m = { l: 10, r: 10, t: 10, b: 24 }, iw = Wd - m.l - m.r, ih = H - m.t - m.b, x = function (v) { return m.l + (v - lo) / (hi - lo) * iw; };
      var s = '<svg class="plot" viewBox="0 0 ' + Wd + ' ' + H + '" role="img" aria-label="Phân bố hai cách ước lượng lợi thế">';
      [[hm, 'var(--s1)'], [ht, 'var(--s2)']].forEach(function (hh) { hh[0].forEach(function (c, i) { if (!c) return; var y = c / mx * ih; s += '<rect x="' + (x(lo + i * bw) + 1).toFixed(1) + '" y="' + (m.t + ih - y).toFixed(1) + '" width="' + Math.max(1, iw / NB - 2).toFixed(1) + '" height="' + y.toFixed(1) + '" rx="2" fill="' + hh[1] + '" fill-opacity=".6"/>'; }); });
      s += '<line x1="' + x(o.A) + '" x2="' + x(o.A) + '" y1="' + m.t + '" y2="' + (m.t + ih) + '" stroke="var(--text)" stroke-width="2"/><text class="lbl" x="' + (x(o.A) + 4) + '" y="' + (m.t + 10) + '">A</text>';
      s += '<line x1="' + m.l + '" x2="' + (Wd - m.r) + '" y1="' + (m.t + ih) + '" y2="' + (m.t + ih) + '" stroke="var(--border)"/>';
      [lo, (lo + hi) / 2, hi].forEach(function (v, i) { s += '<text x="' + x(v) + '" y="' + (H - 6) + '" text-anchor="' + ['start', 'middle', 'end'][i] + '">' + fmtNum(v, 2) + '</text>'; });
      box.innerHTML = s + '</svg>';
      var mm = mean(o.mc), mt = mean(o.td), sm = sd(o.mc), st = sd(o.td);
      b1.querySelector('#vb-tab').innerHTML = '<table class="cmp"><thead><tr><th>Cách ước lượng</th><th>Trung bình</th><th>Độ lệch chuẩn</th><th>Chệch làm sai gradient</th></tr></thead><tbody>' +
        '<tr><td>Monte Carlo $G - \\hat V(s)$</td><td>' + fmtNum(mm, 3) + '</td><td' + (sm > st ? ' class="hl"' : '') + '>' + fmtNum(sm, 3) + '</td><td>0</td></tr>' +
        '<tr><td>TD $r + \\hat V(s\') - \\hat V(s)$</td><td>' + fmtNum(mt, 3) + '</td><td' + (st > sm ? ' class="hl"' : '') + '>' + fmtNum(st, 3) + '</td><td' + (Math.abs(o.bias) > 0.005 ? ' class="hl"' : '') + '>' + fmtNum(o.bias, 3) + '</td></tr></tbody></table>';
      katexBlock(b1.querySelector('#vb-calc'), '\\begin{aligned}&s = ' + o.s0 + ':\\quad Q_\\pi(s, \\text{phải}) = 0{,}8\\,V_\\pi(s{+}1) + 0{,}2\\,V_\\pi(s{-}1) = 0{,}8\\cdot' + texRaw(o.W[o.s0 + 1], 3) + ' + 0{,}2\\cdot' + texRaw(o.W[o.s0 - 1], 3) + ' = ' + texRaw(o.Q, 3) +
        '\\\\&A = Q_\\pi - V_\\pi(s) = ' + texRaw(o.Q, 3) + ' - ' + texRaw(o.V, 3) + ' = ' + texRaw(o.A, 3) + ',\\qquad \\text{số bước trung bình mỗi tập: } ' + texRaw(o.len, 1) +
        (o.ep ? '\\\\&\\text{TD: } \\mathbb E[\\hat\\delta] - A = \\underbrace{0{,}8\\,e(s{+}1) + 0{,}2\\,e(s{-}1)}_{' + texRaw(o.bias, 3) + '} - \\underbrace{e(s)}_{' + texRaw(o.es, 3) + '},\\qquad \\text{MC: } \\mathbb E[G - \\hat V(s)] - A = -e(s)' : '') + '\\end{aligned}');
      b1.querySelector('#vb-ins').innerHTML = 'Cả hai đều quanh $A = ' + texRaw(o.A, 3) + '$ khi $\\varepsilon = 0$, nhưng $G$ cộng nhiễu của <b>cả tập</b> (trung bình ' + fmtNum(o.len, 1) + ' bước) nên độ lệch chuẩn MC gấp khoảng <b>' + fmtNum(sm / Math.max(st, 1e-9), 1) + ' lần</b> TD. Tăng $L$ hoặc $\\sigma$ để thấy MC càng loãng, còn TD gần như không đổi.' +
        (o.ep ? ' Với nhà phê bình sai ($\\varepsilon > 0$): phần $-e(s)$ chỉ phụ thuộc $s$ nên giống đường cơ sở, không làm sai gradient; nhưng TD còn phần $\\mathbb E[e(s\')]$ = ' + fmtNum(o.bias, 3) + ': <b>chệch</b>. Đó là cái giá của việc bỏ phép lấy kỳ vọng và dùng $V$ thay $G$.' : ' Kéo $\\varepsilon$ để xem cái giá: nhà phê bình sai thì TD bị chệch.');
      ctx.typeset(b1.querySelector('#vb-tab')); ctx.typeset(b1.querySelector('#vb-ins'));
    }
    ['#vb-l', '#vb-s', '#vb-e'].forEach(function (id) { b1.querySelector(id).oninput = vbDraw; });
    vbDraw(); onResize(vbDraw);

    // ============ 2. REINFORCE và A2C ============
    var N2 = 8, G2 = 0.98;
    var b2 = h('<section class="blk">' +
      '<h2>2. REINFORCE và A2C trên hành lang có nhiễu (mục 9.1, 9.3)</h2>' +
      '<p class="lead">Hành lang ' + N2 + ' ô, bắt đầu ở ô 0, đi tới cuối được $+1$; mỗi bước $-0{,}02$ cộng nhiễu $\\mathcal N(0, \\sigma^2)$; $\\gamma = 0{,}98$; tối đa 200 bước. Chính sách softmax dạng bảng (mỗi ô một cặp logit), nhà phê bình $V$ dạng bảng. Ít bước nhất có thể là ' + N2 + '.</p>' +
      '<div class="ctrl"><span class="rxs">Nhiễu $\\sigma$</span><div class="seg" id="rc-s"><button type="button" data-v="0" aria-pressed="false">0</button><button type="button" data-v="0.5" aria-pressed="true">0,5</button><button type="button" data-v="1" aria-pressed="false">1</button></div></div>' +
      '<div class="legend"><span class="li"><span class="sw" style="background:var(--muted)"></span>REINFORCE ($G$)</span><span class="li"><span class="sw" style="background:var(--s1)"></span>REINFORCE + đường cơ sở $V$ ($G - V$)</span><span class="li"><span class="sw" style="background:var(--s2)"></span>A2C ($r + \\gamma V(s\') - V(s)$)</span></div>' +
      '<div class="chart" id="rc-chart"></div><div class="insight" id="rc-ins"></div>' +
      '<h3 class="sub">Xem từng bước cập nhật của A2C</h3>' +
      '<div class="ctrl"><button type="button" class="btn pri" id="rc-step">Bước tiếp</button><button type="button" class="btn" id="rc-ep">Hết tập</button><button type="button" class="btn" id="rc-reset">Đặt lại</button><span class="rxs" id="rc-info"></span></div>' +
      '<div class="chain" id="rc-chain"></div><div class="calc" id="rc-calc"></div></section>');
    root.appendChild(b2);
    function chainRun(alg, sig, eps, seed) {
      var r = seeded(seed), th = [], V = [], out = [], lrA = 0.1, lrC = 0.2;
      for (var i = 0; i < N2; i++) { th.push([0, 0]); V.push(0); }
      for (var e = 0; e < eps; e++) {
        var s = 0, traj = [];
        while (traj.length < 200) {
          var p = sm2(th[s]), a = r() < p ? 1 : 0, s2 = Math.max(0, s + (a ? 1 : -1)), done = s2 >= N2, rew = (done ? 1 : 0) - 0.02 + sig * gauss(r);
          traj.push([s, a, rew, p]);
          if (alg === 'a2c') { var d = rew + (done ? 0 : G2 * V[s2]) - V[s]; V[s] += lrC * d; var gp = a ? 1 - p : -p; th[s][1] += lrA * d * gp; th[s][0] -= lrA * d * gp; }
          if (done) break; s = s2;
        }
        if (alg !== 'a2c') { var G = 0; for (var k = traj.length - 1; k >= 0; k--) { var t = traj[k]; G = t[2] + G2 * G; var adv = G - (alg === 'rfb' ? V[t[0]] : 0); if (alg === 'rfb') V[t[0]] += lrC * (G - V[t[0]]); var gp2 = t[1] ? 1 - t[3] : -t[3]; th[t[0]][1] += lrA * adv * gp2; th[t[0]][0] -= lrA * adv * gp2; } }
        out.push(traj.length);
      }
      return out;
    }
    function rcDraw() {
      var sig = +segVal(b2.querySelector('#rc-s')), R = 40, E = 300, algs = [['rf', 'var(--muted)', 'REINFORCE'], ['rfb', 'var(--s1)', 'REINFORCE + V'], ['a2c', 'var(--s2)', 'A2C']], res = {};
      algs.forEach(function (al) { var acc = new Array(E).fill(0); for (var k = 0; k < R; k++) chainRun(al[0], sig, E, k + 1).forEach(function (v, i) { acc[i] += v / R; }); res[al[0]] = acc; });
      lineChart(b2.querySelector('#rc-chart'), { series: algs.map(function (al) { return { name: al[2], color: al[1], values: smooth(res[al[0]], 10) }; }), yMin: 0, yMax: 160, yTicks: [0, 40, 80, 120, 160], tipDec: 1, xLabel: 'Tập', refs: [{ y: N2, label: 'tối ưu: ' + N2 + ' bước' }], aria: 'Số bước tới đích theo tập' });
      var last = function (k) { return mean(res[k].slice(-50)); };
      b2.querySelector('#rc-ins').innerHTML = 'Số bước trung bình 50 tập cuối (' + R + ' lần chạy): REINFORCE ' + fmtNum(last('rf'), 1) + ', REINFORCE + $V$ ' + fmtNum(last('rfb'), 1) + ', A2C <b>' + fmtNum(last('a2c'), 1) + '</b>. ' +
        (sig === 0 ? 'Không có nhiễu thì ba cách gần như ngang nhau: $G$ ít ngẫu nhiên nên lợi ích của nhà phê bình nhỏ.' : 'Có nhiễu, $G$ cộng nhiễu của mọi bước nên REINFORCE học chậm (có lúc còn tệ đi); trừ đường cơ sở đỡ hơn; A2C chỉ dùng nhiễu của <b>một</b> bước nên học nhanh và ổn định nhất.');
      ctx.typeset(b2.querySelector('#rc-ins'));
    }
    seg(b2.querySelector('#rc-s'), rcDraw);
    rcDraw(); onResize(rcDraw);
    // từng bước A2C
    var ag;
    function agReset() { ag = { r: seeded(7), th: [], V: [], s: 0, ep: 1, t: 0, last: null }; for (var i = 0; i < N2; i++) { ag.th.push([0, 0]); ag.V.push(0); } agDraw(); }
    function agStep() {
      var sig = +segVal(b2.querySelector('#rc-s')), s = ag.s, p = sm2(ag.th[s]), a = ag.r() < p ? 1 : 0, s2 = Math.max(0, s + (a ? 1 : -1)), done = s2 >= N2, rew = (done ? 1 : 0) - 0.02 + sig * gauss(ag.r);
      var v0 = ag.V[s], vn = done ? 0 : ag.V[s2], d = rew + G2 * vn - v0, gp = a ? 1 - p : -p;
      ag.V[s] += 0.2 * d; ag.th[s][1] += 0.1 * d * gp; ag.th[s][0] -= 0.1 * d * gp;
      ag.last = { s: s, a: a, s2: s2, done: done, rew: rew, v0: v0, vn: vn, d: d, p: p, p2: sm2(ag.th[s]), gp: gp };
      ag.t++; if (done || ag.t >= 200) { ag.s = 0; ag.ep++; ag.t = 0; } else ag.s = s2;
    }
    function agDraw() {
      b2.querySelector('#rc-chain').innerHTML = ag.V.map(function (v, k) { return '<span class="' + (k === ag.s ? 'cur' : '') + '">ô ' + k + '<b>' + fmtNum(v, 2) + '</b>' + fmtNum(sm2(ag.th[k]), 2) + '</span>'; }).join('') + '<span class="goal">đích<b>+1</b>&nbsp;</span>';
      b2.querySelector('#rc-info').innerHTML = 'Tập ' + ag.ep + ', bước ' + ag.t + '. Mỗi ô: $V(s)$ (đậm) và $\\pi(\\text{phải} \\mid s)$.';
      ctx.typeset(b2.querySelector('#rc-info'));
      var L = ag.last, el = b2.querySelector('#rc-calc');
      if (!L) { el.innerHTML = '<span class="rxs">Bấm “Bước tiếp”.</span>'; return; }
      katexBlock(el, '\\begin{aligned}&s = ' + L.s + ',\\ a = \\text{' + (L.a ? 'phải' : 'trái') + '},\\ r = ' + texRaw(L.rew, 3) + ',\\ s\' = ' + (L.done ? '\\text{đích}' : L.s2) +
        '\\\\&\\delta = r + \\gamma V(s\') - V(s) = ' + texRaw(L.rew, 3) + ' + 0{,}98\\cdot' + tex(L.vn, 3) + ' - ' + tex(L.v0, 3) + ' = ' + texRaw(L.d, 3) +
        '\\\\&\\text{nhà phê bình: } V(s) \\leftarrow ' + texRaw(L.v0, 3) + ' + 0{,}2\\cdot' + tex(L.d, 3) + ' = ' + texRaw(L.v0 + 0.2 * L.d, 3) +
        '\\\\&\\text{diễn viên: } z_{\\text{' + (L.a ? 'phải' : 'trái') + '}} \\mathrel{+}= 0{,}1\\cdot\\delta\\cdot(1 - \\pi(a \\mid s)) = 0{,}1\\cdot' + tex(L.d, 3) + '\\cdot' + tex(Math.abs(L.gp), 3) + ',\\quad \\pi(\\text{phải} \\mid s): ' + texRaw(L.p, 3) + ' \\to ' + texRaw(L.p2, 3) + '\\end{aligned}');
    }
    b2.querySelector('#rc-step').onclick = function () { agStep(); agDraw(); };
    b2.querySelector('#rc-ep').onclick = function () { var e = ag.ep; while (ag.ep === e) agStep(); agDraw(); };
    b2.querySelector('#rc-reset').onclick = agReset;
    agReset();

    // ============ 3. Entropy ============
    var b3 = h('<section class="blk">' +
      '<h2>3. Mẹo 2: chính quy hóa entropy (mục 9.3)</h2>' +
      '<p class="lead">Máy đánh bạc 3 tay: $a_1$ luôn cho $1$; $a_2$ cho $10$ với xác suất $0{,}15$, còn lại $0$ (trung bình $1{,}5$, <b>tốt nhất</b> nhưng hay “xịt”); $a_3$ luôn cho $0{,}5$. Chính sách softmax, gradient chính sách với lợi thế $r - b$ ($b$ là trung bình động), bước học $0{,}4$, thêm $\\beta\\,\\nabla H$. 300 lần chạy × 1000 bước.</p>' +
      '<div class="ctrl"><span class="rxs">$\\beta$</span><div class="seg" id="en-b"><button type="button" data-v="0.1" aria-pressed="false">0,1</button><button type="button" data-v="0.3" aria-pressed="true">0,3</button><button type="button" data-v="1" aria-pressed="false">1</button></div></div>' +
      '<div class="legend"><span class="li"><span class="sw" style="background:var(--muted)"></span>$\\beta = 0$ (không entropy)</span><span class="li"><span class="sw" style="background:var(--s1)"></span>$\\beta$ đã chọn</span></div>' +
      '<h3 class="sub">Trung bình $\\pi(a_2)$ qua các lần chạy</h3><div class="chart" id="en-chart"></div><div class="stat3" id="en-stat"></div><div class="calc" id="en-calc"></div><div class="insight" id="en-ins"></div></section>');
    root.appendChild(b3);
    function enRun(beta, seed, T) {
      var r = seeded(seed), z = [0, 0, 0], b = 0, tr = [], rs = 0, pk = null;
      for (var t = 0; t < T; t++) {
        var m = Math.max(z[0], z[1], z[2]), e = z.map(function (x) { return Math.exp(x - m); }), S = e[0] + e[1] + e[2], p = e.map(function (x) { return x / S; });
        if (t === 30) pk = p.slice();
        var u = r(), a = u < p[0] ? 0 : u < p[0] + p[1] ? 1 : 2, rew = a === 0 ? 1 : a === 1 ? (r() < 0.15 ? 10 : 0) : 0.5, A = rew - b; b += 0.1 * (rew - b);
        var H = -p.reduce(function (q, x) { return q + x * Math.log(Math.max(x, 1e-12)); }, 0);
        for (var k = 0; k < 3; k++) z[k] += 0.4 * (A * ((k === a ? 1 : 0) - p[k]) + beta * (-p[k] * (Math.log(Math.max(p[k], 1e-12)) + H)));
        if (t % 10 === 0) tr.push(p[1]);
        if (t >= T - 100) rs += rew / 100;
      }
      return { tr: tr, pB: tr[tr.length - 1], rs: rs, pk: pk };
    }
    function enAgg(beta) { var R = 300, T = 1000, acc = null, best = 0, rs = 0, pk = null; for (var i = 0; i < R; i++) { var o = enRun(beta, i + 1, T); if (!acc) acc = o.tr.map(function () { return 0; }); o.tr.forEach(function (v, j) { acc[j] += v / R; }); if (o.pB > 0.5) best++; rs += o.rs / R; if (i === 0) pk = o.pk; } return { acc: acc, best: best / R, rs: rs, pk: pk }; }
    var en0 = enAgg(0);
    function enDraw() {
      var beta = +segVal(b3.querySelector('#en-b')), o = enAgg(beta);
      lineChart(b3.querySelector('#en-chart'), { series: [{ name: 'β = 0', color: 'var(--muted)', values: en0.acc }, { name: 'β = ' + fmtNum(beta, 1), color: 'var(--s1)', values: o.acc }], xs: en0.acc.map(function (_, i) { return i * 10; }), xFmt: function (v) { return v; }, yMin: 0, yMax: 1, yTicks: [0, 0.25, 0.5, 0.75, 1], dec: 2, xLabel: 'Bước', refs: [{ y: 1 / 3, label: 'đều: 1/3' }], aria: 'Xác suất chọn tay tốt nhất theo thời gian' });
      b3.querySelector('#en-stat').innerHTML = '<div>Tìm ra $a_2$ (cuối cùng $\\pi(a_2) > 0{,}5$)<b>β = 0: ' + fmtNum(100 * en0.best, 0) + '% · β = ' + fmtNum(beta, 1) + ': ' + fmtNum(100 * o.best, 0) + '%</b></div><div>Thưởng trung bình 100 bước cuối (tối đa 1,5)<b>β = 0: ' + fmtNum(en0.rs, 2) + ' · β = ' + fmtNum(beta, 1) + ': ' + fmtNum(o.rs, 2) + '</b></div>';
      ctx.typeset(b3.querySelector('#en-stat'));
      var p = o.pk, H = -p.reduce(function (q, x) { return q + x * Math.log(x); }, 0), g = p.map(function (x) { return -x * (Math.log(x) + H); });
      katexBlock(b3.querySelector('#en-calc'), '\\begin{aligned}&\\text{lần chạy 1, bước 30: } \\pi = ' + vec(p, 3) + ',\\quad H = -\\textstyle\\sum_k \\pi_k\\ln\\pi_k = ' + texRaw(H, 3) + '\\ (\\max = \\ln 3 \\approx 1{,}099)' +
        '\\\\&\\frac{\\partial H}{\\partial z_k} = -\\pi_k(\\ln\\pi_k + H) = ' + vec(g, 3) + '\\quad\\Rightarrow\\quad \\beta\\nabla H\\ \\text{nâng hành động hiếm, hạ hành động đang chiếm ưu thế}\\end{aligned}');
      b3.querySelector('#en-ins').innerHTML = 'Không có entropy, nhiều lần chạy thấy $a_2$ “xịt” vài lần đầu, dồn xác suất vào $a_1$ (luôn cho 1) rồi gần như không thử lại $a_2$: chỉ ' + fmtNum(100 * en0.best, 0) + '% lần chạy tìm ra tay tốt nhất. ' +
        (beta >= 1 ? 'Nhưng $\\beta$ quá lớn thì chính sách bị kéo gần về đều, không dám chọn hẳn $a_2$: thưởng cuối lại thấp. Cần $\\beta$ vừa phải.' : 'Thêm $\\beta\\,H$ giữ cho các hành động khác vẫn được thử, nên tìm ra $a_2$ thường hơn (' + fmtNum(100 * o.best, 0) + '%). Thử $\\beta = 1$ để thấy mặt trái.');
      ctx.typeset(b3.querySelector('#en-ins'));
    }
    seg(b3.querySelector('#en-b'), enDraw);
    enDraw(); onResize(enDraw);

    // ============ 4. Đạo hàm theo đường đi ============
    var b4 = h('<section class="blk">' +
      '<h2>4. Nhà phê bình nói “tốt/xấu” hay chỉ hướng? (mục 9.5)</h2>' +
      '<p class="lead">Một trạng thái, hành động liên tục $a$, nhà phê bình đã học xong $Q(a) = -(a - 2)^2$ (tốt nhất $a = 2$). Diễn viên bắt đầu ở $\\mu = -1$, bước học $\\alpha = 0{,}05$.<br><b>Diễn viên-nhà phê bình thường</b>: chính sách $a \\sim \\mathcal N(\\mu, 0{,}5^2)$, lấy mẫu $B$ hành động, nhà phê bình chỉ trả về số $A = Q(a) - V$; gradient $\\frac1B\\sum_i A_i\\,\\nabla_\\mu\\log\\pi(a_i) = \\frac1B\\sum_i A_i\\frac{a_i - \\mu}{0{,}5^2}$.<br><b>Đạo hàm theo đường đi</b>: $a = \\mu$, gradient $\\frac{\\partial Q}{\\partial a}(\\mu)$.</p>' +
      '<div class="ctrl"><span class="rxs">Số mẫu $B$ mỗi lần cập nhật</span><div class="seg" id="pw-b"><button type="button" data-v="1" aria-pressed="true">1</button><button type="button" data-v="4" aria-pressed="false">4</button><button type="button" data-v="16" aria-pressed="false">16</button></div></div>' +
      '<div class="legend"><span class="li"><span class="sw" style="background:var(--s1)"></span>thường: trung bình 200 lần chạy (dải 10%–90%)</span><span class="li"><span class="sw" style="background:var(--s2)"></span>đạo hàm theo đường đi</span></div>' +
      '<h3 class="sub">$\\mu$ theo số lần cập nhật</h3><div class="chart" id="pw-chart"></div><div class="calc" id="pw-calc"></div><div class="insight" id="pw-ins"></div></section>');
    root.appendChild(b4);
    function pwDraw() {
      var B = +segVal(b4.querySelector('#pw-b')), K = 60, al = 0.05, sg = 0.5, R = 200, runs = [], pw = [-1];
      for (var k = 0; k < K; k++) pw.push(pw[k] + al * (-2 * (pw[k] - 2)));
      var one = null;
      for (var i = 0; i < R; i++) {
        var r = seeded(300 + i), mu = -1, tr = [mu];
        for (var k2 = 0; k2 < K; k2++) {
          var V = -(mu - 2) * (mu - 2) - sg * sg, g = 0, smp = [];
          for (var j = 0; j < B; j++) { var a = mu + sg * gauss(r), A = -(a - 2) * (a - 2) - V; g += A * (a - mu) / (sg * sg) / B; if (i === 0 && k2 === 0) smp.push([a, A]); }
          if (i === 0 && k2 === 0) one = { smp: smp, g: g, V: V };
          mu += al * g; tr.push(mu);
        }
        runs.push(tr);
      }
      var mn = [], lo = [], hi = [];
      for (var t = 0; t <= K; t++) { var col = runs.map(function (x) { return x[t]; }); mn.push(mean(col)); lo.push(quant(col, 0.1)); hi.push(quant(col, 0.9)); }
      lineChart(b4.querySelector('#pw-chart'), { series: [{ name: 'thường (TB)', color: 'var(--s1)', values: mn, lo: lo, hi: hi }, { name: 'đường đi', color: 'var(--s2)', values: pw }], yMin: -2, yMax: 3, yTicks: [-2, -1, 0, 1, 2, 3], dec: 0, xFirst: 0, xLabel: 'Lần cập nhật', refs: [{ y: 2, label: 'tốt nhất a = 2' }], aria: 'Tham số mu theo số lần cập nhật' });
      var rows = one.smp.slice(0, 2).map(function (x, i) { return '&a_' + (i + 1) + ' = ' + texRaw(x[0], 3) + ',\\ A_' + (i + 1) + ' = Q(a_' + (i + 1) + ') - V = ' + texRaw(x[1], 3) + ',\\ A_' + (i + 1) + '\\frac{a_' + (i + 1) + ' - \\mu}{0{,}25} = ' + texRaw(x[1] * (x[0] + 1) / 0.25, 3); });
      katexBlock(b4.querySelector('#pw-calc'), '\\begin{aligned}&\\text{lần cập nhật đầu, } \\mu = -1:\\quad V = \\mathbb E_a[Q(a)] = -(\\mu - 2)^2 - 0{,}5^2 = ' + texRaw(one.V, 2) + '\\\\' + rows.join('\\\\') + (B > 2 ? '\\\\&\\ldots' : '') +
        '\\\\&\\text{thường: } \\hat g = ' + texRaw(one.g, 3) + '\\qquad\\text{đường đi: } \\frac{\\partial Q}{\\partial a}(\\mu) = -2(\\mu - 2) = 6\\end{aligned}');
      var end = runs.map(function (x) { return x[K]; });
      b4.querySelector('#pw-ins').innerHTML = 'Với hàm $Q$ bậc hai này, kỳ vọng của gradient “thường” đúng bằng $\\partial Q/\\partial a(\\mu)$ (cả hai không chệch), nhưng mỗi lần chỉ có một con số $A$ nói “tốt” hay “xấu”, nên ước lượng rất nhiễu: sau ' + K + ' lần cập nhật với $B = ' + B + '$, $\\mu$ nằm trong khoảng ' + fmtNum(quant(end, 0.1), 2) + ' đến ' + fmtNum(quant(end, 0.9), 2) + ' (10%–90%). Đạo hàm theo đường đi đi thẳng tới ' + fmtNum(pw[K], 2) + ' mỗi lần như nhau, giống Sai chỉ thẳng cho Hikaru nước nên đi. Đổi lại, nó cần $Q$ khả vi theo $a$ (hành động liên tục) và tin vào $Q$ hoàn toàn.';
      ctx.typeset(b4.querySelector('#pw-ins'));
    }
    seg(b4.querySelector('#pw-b'), pwDraw);
    pwDraw(); onResize(pwDraw);
    ctx.typeset(root);
  }

  // ======================================================================
  // TAB "Sơ đồ"
  // ======================================================================
  function renderMap(root, ctx) {
    root.innerHTML = '';
    root.classList.add('rx');

    var m1 = h('<section class="blk"><h2>Họ diễn viên-nhà phê bình</h2>' + table(['Thuật toán', 'Nhà phê bình', 'Tín hiệu cho diễn viên', 'Cập nhật khi', 'Dữ liệu'], [
      ['REINFORCE (ch. 4)', 'không có (có thể dùng $b$)', '$G_t - b$', 'hết tập', 'cùng chính sách'],
      ['A2C (9.3)', '$V(s)$', '$r_t + \\gamma V(s_{t+1}) - V(s_t)$', 'từng bước / vài bước', 'cùng chính sách'],
      ['A3C (9.4)', '$V(s)$, mạng toàn cục', 'như A2C, nhiều tiến trình bất đồng bộ', 'mỗi tiến trình gửi gradient', 'cùng chính sách'],
      ['Đạo hàm theo đường đi (9.5)', '$Q(s, a)$', '$\\nabla_a Q(s, a)$ (hướng đổi hành động)', 'từng bước, lấy mẫu từ bộ đệm', 'khác chính sách (bộ đệm phát lại)']]) +
      '<p class="rxs" style="margin:10px 0 0">Đạo hàm theo đường đi chính là ý tưởng của DDPG (chương 12).</p></section>');
    root.appendChild(m1);

    // ---- A3C: gradient cũ ----
    var m2 = h('<section class="blk"><h2>A3C: nhiều Ảnh phân thân và gradient “cũ” (hình 9.7)</h2>' +
      '<p class="lead">Bài toán đồ chơi: tối thiểu hóa $f(\\theta) = \\tfrac12\\|\\theta\\|^2$, $\\theta \\in \\mathbb R^2$, xuất phát $(4;\\ 3)$, gradient có nhiễu $\\mathcal N(0, 1)$. Mỗi tiến trình mất 0,8–1,2 đơn vị thời gian để tính một gradient trên bản sao tham số nó lấy lúc bắt đầu, rồi gửi về: $\\theta \\leftarrow \\theta - \\eta\\,g$. Trung bình 100 lần chạy.</p>' +
      '<div class="ctrl"><span class="rxs">Bước học $\\eta$</span><div class="seg" id="a3-e"><button type="button" data-v="0.05" aria-pressed="false">0,05</button><button type="button" data-v="0.1" aria-pressed="true">0,1</button><button type="button" data-v="0.2" aria-pressed="false">0,2</button></div></div>' +
      '<div class="legend"><span class="li"><span class="sw" style="background:var(--muted)"></span>1 tiến trình</span><span class="li"><span class="sw" style="background:var(--s1)"></span>4 tiến trình</span><span class="li"><span class="sw" style="background:var(--s2)"></span>16 tiến trình</span></div>' +
      '<h3 class="sub">$f(\\theta)$ theo thời gian thật (thang log)</h3><div class="chart" id="a3-chart"></div>' +
      '<h3 class="sub">8 lần cập nhật đầu với 4 tiến trình</h3><div id="a3-tab"></div><div class="insight" id="a3-ins"></div></section>');
    root.appendChild(m2);
    function a3Sim(K, eta, Tend, seed, log) {
      var r = seeded(seed), th = [4, 3], ver = 0, ws = [], out = [], stale = 0, n = 0, grid = 0;
      for (var k = 0; k < K; k++) ws.push({ t: 0.8 + 0.4 * r(), th: th.slice(), v: 0 });
      while (true) {
        var i = 0; for (var k2 = 1; k2 < K; k2++) if (ws[k2].t < ws[i].t) i = k2;
        var w = ws[i]; if (w.t > Tend) break;
        while (grid <= w.t) { out.push(0.5 * (th[0] * th[0] + th[1] * th[1])); grid += 0.5; }
        var g = [w.th[0] + gauss(r), w.th[1] + gauss(r)];
        th[0] -= eta * g[0]; th[1] -= eta * g[1];
        if (log && log.length < 8) log.push({ w: i + 1, t: w.t, v0: w.v, v1: ver });
        stale += ver - w.v; n++; ver++; w.th = th.slice(); w.v = ver; w.t += 0.8 + 0.4 * r();
      }
      while (grid <= Tend) { out.push(0.5 * (th[0] * th[0] + th[1] * th[1])); grid += 0.5; }
      return { out: out, stale: stale / n, n: n };
    }
    function a3Draw() {
      var eta = +segVal(m2.querySelector('#a3-e')), Ks = [[1, 'var(--muted)'], [4, 'var(--s1)'], [16, 'var(--s2)']], res = [], st = [], nu = [];
      Ks.forEach(function (kk) { var acc = null, s = 0, n = 0; for (var i = 0; i < 100; i++) { var o = a3Sim(kk[0], eta, 20, i + 1); if (!acc) acc = o.out.map(function () { return 0; }); o.out.forEach(function (v, j) { acc[j] += Math.min(v, 1e4) / 100; }); s += o.stale / 100; n += o.n / 100; } res.push(acc.map(function (v) { return Math.log10(Math.max(v, 1e-3)); })); st.push(s); nu.push(n); });
      lineChart(m2.querySelector('#a3-chart'), { series: Ks.map(function (kk, i) { return { name: kk[0] + ' tiến trình', color: kk[1], values: res[i] }; }), xs: res[0].map(function (_, i) { return i * 0.5; }), xFmt: function (v) { return fmtNum(v, 0); },
        yMin: -2, yMax: 3, yTicks: [-2, -1, 0, 1, 2, 3], yFmt: function (v) { return ['0,01', '0,1', '1', '10', '100', '1000'][v + 2]; }, tipFmt: function (v) { return fmtNum(Math.pow(10, v), 3); }, xLabel: 'Thời gian', aria: 'Giá trị hàm mục tiêu theo thời gian' });
      var log = []; a3Sim(4, eta, 20, 1, log);
      m2.querySelector('#a3-tab').innerHTML = table(['Lần', 'Tiến trình', 'Lúc gửi', 'Tính trên', 'Áp vào', 'Cũ bao nhiêu phiên bản'], log.map(function (l, i) { return [i + 1, l.w, fmtNum(l.t, 2), '$\\theta_{' + l.v0 + '}$', '$\\theta_{' + l.v1 + '}$', l.v1 - l.v0]; }));
      var end = res.map(function (a) { return Math.pow(10, a[a.length - 1]); }), at5 = res.map(function (a) { return Math.pow(10, a[10]); });
      m2.querySelector('#a3-ins').innerHTML = 'Trong 20 đơn vị thời gian: 1 tiến trình cập nhật khoảng ' + fmtNum(nu[0], 0) + ' lần, 4 tiến trình ' + fmtNum(nu[1], 0) + ' lần, 16 tiến trình ' + fmtNum(nu[2], 0) + ' lần; gradient trung bình cũ ' + fmtNum(st[1], 1) + ' và ' + fmtNum(st[2], 1) + ' phiên bản. ' +
        'Tại thời điểm 5: $f$ = ' + fmtNum(at5[0], 2) + ' / ' + fmtNum(at5[1], 2) + ' / ' + fmtNum(at5[2], 2) + '. ' +
        (end[2] > 10 * end[1] ? 'Với $\\eta = ' + texRaw(eta, 2) + '$, 16 tiến trình <b>mất ổn định</b>: mỗi gradient đã cũ khoảng ' + fmtNum(st[2], 0) + ' bước nên cả nhóm cùng đẩy theo một hướng đã lỗi thời và vọt quá. Nhiều Ảnh phân thân nhanh hơn, nhưng phải giảm bước học.' : 'Nhiều tiến trình thì nhanh hơn rõ rệt dù gradient cũ, đúng như sách nói “không sao, vẫn áp gradient như thường”. Thử $\\eta = 0{,}2$ để thấy giới hạn.');
      ctx.typeset(m2);
    }
    seg(m2.querySelector('#a3-e'), a3Draw);
    a3Draw(); onResize(a3Draw);

    var m3 = h('<section class="blk"><h2>Từ DQN tới đạo hàm theo đường đi: 4 thay đổi (hình 9.11)</h2>' + table(['', 'DQN', 'Đạo hàm theo đường đi'], [
      ['(1) Chọn hành động', '$a_t = \\arg\\max_a Q(s_t, a)$ ($\\varepsilon$-tham lam)', '$a_t = \\pi(s_t)$ (có khám phá)'],
      ['(2) Mục tiêu', '$y = r_i + \\max_a\\hat Q(s_{i+1}, a)$', '$y = r_i + \\hat Q\\big(s_{i+1}, \\hat\\pi(s_{i+1})\\big)$'],
      ['(3) Học thêm', '(không)', 'cập nhật $\\pi$ để $Q\\big(s_i, \\pi(s_i)\\big)$ lớn nhất'],
      ['(4) Mạng mục tiêu', '$\\hat Q = Q$ sau mỗi $C$ bước', 'thêm $\\hat\\pi = \\pi$ sau mỗi $C$ bước']]) +
      '<div class="flow" style="margin-top:12px"><div class="fb"><div class="fx">$s \\to$ diễn viên $\\pi \\to a \\to$ nhà phê bình $Q(s, a)$ (cố định)</div><div class="fy">Nối thành một mạng lớn; đi lên theo gradient của đầu ra $Q$, chỉ chỉnh tham số diễn viên.</div></div><div class="fa">=</div>' +
      '<div class="fb eq"><div class="fx">$z \\to$ bộ sinh $\\to x \\to$ bộ phân biệt (cố định)</div><div class="fy">GAN có điều kiện: diễn viên là bộ sinh, nhà phê bình là bộ phân biệt (mục 9.6).</div></div></div></section>');
    root.appendChild(m3);
    ctx.typeset(root);
  }

  // ======================================================================
  // TAB "Mô phỏng": liên kết tới các trang docs/viz
  // ======================================================================
  var VIZ = [
    ['a2c.html', 'Mục 9.3', 'A2C từng bước', 'Nhà phê bình và diễn viên cập nhật sau mỗi bước bằng sai số TD; so sánh với REINFORCE trên cùng lưới.'],
    ['a3c.html', 'Mục 9.4', 'A3C: các Ảnh phân thân', 'Nhiều tiến trình bất đồng bộ, gradient cũ bao nhiêu phiên bản; so sánh 1, 2, 4, 8 tiến trình.']
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
