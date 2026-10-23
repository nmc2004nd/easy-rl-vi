/* Thí nghiệm tương tác và sơ đồ trực quan cho chương 10 (phần thưởng thưa).
 * Trang index.html tải file này khi ch10.json có "extras": "ch10-extras.js".
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
  var css10 = String.raw`
  .rx svg.plot { display: block; width: 100%; height: auto; overflow: visible; }
  .rx svg.plot text { fill: var(--muted); font-size: 11px; font-family: inherit; }
  .rx svg.plot .lbl { fill: var(--text); font-weight: 600; }
  .rx .stat3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; margin-top: 10px; }
  .rx .stat3 > div { background: var(--surface-2); border-radius: 10px; padding: 8px 10px; font-size: .86rem; }
  .rx .stat3 b { display: block; font-size: 1.05rem; font-variant-numeric: tabular-nums; }
  .rx .insight, .rx .lead, .rx .tscroll { position: relative; }
  .rx .gpair { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-top: 8px; }
  .rx .gpair .cap { text-align: center; font-weight: 600; font-size: .86rem; margin-bottom: 4px; }
  .rx .gbox { max-width: 360px; margin: 0 auto; }
  .rx .busy { color: var(--muted); font-size: .88rem; }`;
  var st10 = document.createElement('style'); st10.textContent = css10; document.head.appendChild(st10);
  var C3 = 'var(--accent-text)';
  function table(head, rows) { return '<div class="tscroll"><table class="cmp"' + (head.length > 3 ? ' style="min-width:620px"' : '') + '><thead><tr>' + head.map(function (x) { return '<th>' + x + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.map(function (r) { return '<tr>' + r.map(function (x) { return '<td>' + x + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>'; }
  function smooth(a, w) { return a.map(function (_, i) { var s = 0, n = 0; for (var j = Math.max(0, i - w + 1); j <= i; j++) { s += a[j]; n++; } return s / n; }); }
  function argmaxRand(q, r) { var m = Math.max.apply(null, q), b = []; for (var k = 0; k < q.length; k++) if (q[k] === m) b.push(k); return b[Math.floor(r() * b.length)]; }
  // vẽ lưới ô: cell(s) -> { fill, op, txt, stroke }
  function drawGrid(box, R, C, cell, aria) {
    var W = 320, cs = W / C, s = '<svg class="plot" viewBox="0 0 ' + W + ' ' + (R * cs) + '" role="img" aria-label="' + aria + '">';
    for (var i = 0; i < R * C; i++) {
      var d = cell(i), x = (i % C) * cs, y = Math.floor(i / C) * cs;
      s += '<rect x="' + (x + 0.5).toFixed(1) + '" y="' + (y + 0.5).toFixed(1) + '" width="' + (cs - 1).toFixed(1) + '" height="' + (cs - 1).toFixed(1) + '" rx="2" fill="' + (d.fill || 'var(--surface-2)') + '" fill-opacity="' + (d.op == null ? 1 : d.op) + '"' + (d.stroke ? ' stroke="' + d.stroke + '" stroke-width="2"' : '') + '/>';
      if (d.txt) s += '<text x="' + (x + cs / 2) + '" y="' + (y + cs / 2 + 4) + '" text-anchor="middle" class="lbl" style="font-size:' + Math.min(11, cs * 0.6) + 'px">' + d.txt + '</text>';
    }
    box.innerHTML = s + '</svg>';
  }

  // ---------- mê cung dùng chung (16×16, tường ngang chắn giữa) ----------
  var MZ = (function () {
    var R = 16, C = 16, W = {}, WR = 5; for (var c = 3; c < C; c++) W[WR * C + c] = 1;
    var START = (R - 1) * C, GOAL = C - 1, DR = [-1, 0, 1, 0], DC = [0, 1, 0, -1];
    function mv(s, a) { var r = Math.floor(s / C) + DR[a], c = s % C + DC[a]; if (r < 0 || c < 0 || r >= R || c >= C) return s; var n = r * C + c; return W[n] ? s : n; }
    var BD = new Array(R * C).fill(1e9); BD[GOAL] = 0; var q = [GOAL];
    while (q.length) { var u = q.shift(); for (var a = 0; a < 4; a++) { var v = mv(u, a); if (BD[v] > BD[u] + 1) { BD[v] = BD[u] + 1; q.push(v); } } }
    var DM = 0; BD.forEach(function (d) { if (d < 1e9 && d > DM) DM = d; });
    function man(s) { return Math.floor(s / C) + (C - 1 - s % C); }
    return { R: R, C: C, W: W, START: START, GOAL: GOAL, mv: mv, BD: BD, DM: DM, man: man, MM: 2 * (R - 1) };
  })();
  function mzCell(s, extra) {
    if (MZ.W[s]) return { fill: 'var(--text)', op: 0.75 };
    if (s === MZ.START) return { fill: 'var(--surface-2)', txt: 'S', stroke: extra && extra.ring };
    if (s === MZ.GOAL) return { fill: C3, op: 0.35, txt: 'G' };
    return null;
  }

  function renderLab(root, ctx) {
    root.innerHTML = '';
    root.classList.add('rx');

    // ============ 1. Đứa trẻ ============
    var b1 = h('<section class="blk">' +
      '<h2>1. Đứa trẻ: chơi hay học? (hình 10.1)</h2>' +
      '<p class="lead">Chơi: $+1$ ngay, $-100$ sau 100 giờ. Học: $-1$ ngay, $+100$ sau 100 giờ. Cây kẹo mút $c$ được thêm vào phần thưởng ngay khi học (phần thưởng do người lớn thiết kế, không phải phần thưởng thật).</p>' +
      '<div class="ctrl"><label for="kd-g">$\\gamma$</label><input id="kd-g" type="range" min="0.8" max="0.999" step="0.001" value="0.9"><span class="val" id="kd-g-v"></span>' +
      '<label for="kd-c">kẹo $c$</label><input id="kd-c" type="range" min="0" max="3" step="0.1" value="0"><span class="val" id="kd-c-v"></span></div>' +
      '<div class="legend"><span class="li"><span class="sw" style="background:var(--s2)"></span>$Q(\\text{chơi})$</span><span class="li"><span class="sw" style="background:var(--s1)"></span>$Q(\\text{học})$</span></div>' +
      '<div class="chart" id="kd-chart"></div><div class="calc" id="kd-calc"></div><div class="insight" id="kd-ins"></div></section>');
    root.appendChild(b1);
    function kdDraw() {
      var g = +b1.querySelector('#kd-g').value, c = +b1.querySelector('#kd-c').value;
      b1.querySelector('#kd-g-v').textContent = fmtNum(g, 3); b1.querySelector('#kd-c-v').textContent = fmtNum(c, 1);
      var gs = [], qp = [], qs = []; for (var x = 0.8; x <= 0.9995; x += 0.002) { gs.push(x); var f = Math.pow(x, 100); qp.push(1 - 100 * f); qs.push(-1 + c + 100 * f); }
      var gp = Math.pow(g, 100), QP = 1 - 100 * gp, QS = -1 + c + 100 * gp;
      lineChart(b1.querySelector('#kd-chart'), { series: [{ name: 'Q(chơi)', color: 'var(--s2)', values: qp }, { name: 'Q(học)', color: 'var(--s1)', values: qs }], xs: gs, xFmt: function (v) { return fmtNum(v, 3); }, yMin: -40, yMax: 40, yTicks: [-40, -20, 0, 20, 40], dec: 0, xLabel: 'γ', refs: [{ y: 0, label: '' }],
        marks: [{ x: g, y: QP, color: 'var(--s2)' }, { x: g, y: QS, color: 'var(--s1)' }], aria: 'Q của chơi và học theo gamma' });
      var thr = Math.pow(Math.max(1e-12, (2 - c) / 200), 0.01);
      katexBlock(b1.querySelector('#kd-calc'), '\\begin{aligned}&\\gamma^{100} = ' + texRaw(g, 3) + '^{100} = ' + (gp < 0.001 ? gp.toExponential(2).replace('.', '{,}').replace(/e(-?\d+)/, '\\cdot 10^{$1}') : texRaw(gp, 4)) +
        '\\\\&Q(\\text{chơi}) = 1 - 100\\gamma^{100} = ' + texRaw(QP, 3) + ',\\qquad Q(\\text{học}) = -1 + ' + texRaw(c, 1) + ' + 100\\gamma^{100} = ' + texRaw(QS, 3) +
        '\\\\&\\text{học tốt hơn khi } \\gamma > \\big(\\tfrac{2 - c}{200}\\big)^{1/100}' + (c >= 2 ? '\\ \\text{(với } c \\ge 2 \\text{: mọi } \\gamma)' : ' = ' + texRaw(thr, 3)) + '\\end{aligned}');
      b1.querySelector('#kd-ins').innerHTML = (QS > QP ? 'Đứa trẻ chọn <b>học</b>.' : 'Đứa trẻ chọn <b>chơi</b>.') + ' ' +
        (c === 0 ? 'Không có kẹo, cần $\\gamma > 0{,}955$ mới thấy được phần thưởng sau 100 giờ. Đứa trẻ chiết khấu nặng ($\\gamma$ nhỏ) nên gần như chỉ so $+1$ với $-1$. Kéo kẹo $c$ lên khoảng 2 để thấy phần thưởng thiết kế đổi quyết định.' :
          'Với kẹo $c = ' + texRaw(c, 1) + '$, ngưỡng $\\gamma$ hạ xuống. Kẹo không đổi phần thưởng thật của việc học (vẫn là $+100$ sau 100 giờ), nhưng đưa một phần “lợi ích” về ngay hiện tại, nơi tác tử chiết khấu nặng nhìn thấy được.');
      ctx.typeset(b1.querySelector('#kd-ins'));
    }
    ['#kd-g', '#kd-c'].forEach(function (id) { b1.querySelector(id).oninput = kdDraw; });
    kdDraw(); onResize(kdDraw);

    // ============ 2. Thiết kế phần thưởng trên mê cung ============
    var METH = [['sparse', 'Chỉ phần thưởng thưa', 'var(--muted)'], ['near', '“Càng gần càng thưởng”', 'var(--s2)'], ['potM', 'Tiềm năng, $\\Phi$ theo đường chim bay', C3], ['potB', 'Tiềm năng, $\\Phi$ theo đường đi thật', 'var(--s1)'], ['cur', 'Tò mò (đếm số lần ghé)', '#8b5cf6']];
    var b2 = h('<section class="blk">' +
      '<h2>2. Phần thưởng thưa và các cách thêm phần thưởng (mục 10.1–10.2)</h2>' +
      '<p class="lead">Mê cung 16×16: đi từ $S$ tới $G$, có bức tường chắn (ô đen) nên phải vòng qua bên trái. Chỉ tới $G$ mới được $+1$. Q-learning dạng bảng ($\\alpha = 0{,}5$, $\\gamma = 0{,}95$, $\\varepsilon = 0{,}1$), tối đa 300 bước mỗi tập; ngắn nhất ' + MZ.BD[MZ.START] + ' bước. Năm cách:</p>' +
      '<ul class="rxs" style="margin:0 0 8px;padding-left:1.2em">' +
      '<li><b>Thưa</b>: chỉ $+1$ ở đích.</li>' +
      '<li><b>“Càng gần càng thưởng”</b>: mỗi bước thêm $0{,}05\\,(1 - d(s\')/d_{\\max})$, $d$ là khoảng cách chim bay tới đích (kiểu “tấm ván càng gần cột càng tốt”).</li>' +
      '<li><b>Tiềm năng</b>: thêm $\\gamma\\Phi(s\') - \\Phi(s)$ với $\\Phi(s) = 1 - d(s)/d_{\\max}$; hai phiên bản: $d$ chim bay (tri thức sai, bỏ qua tường) và $d$ theo đường đi thật (tri thức đúng).</li>' +
      '<li><b>Tò mò</b>: thêm $0{,}1/\\sqrt{N(s\')}$, $N$ là số lần đã tới ô đó (bản dạng bảng của “chỗ chưa biết thì thưởng”).</li></ul>' +
      '<div class="legend">' + METH.map(function (m) { return '<span class="li"><span class="sw" style="background:' + m[2] + '"></span>' + m[1] + '</span>'; }).join('') + '</div>' +
      '<h3 class="sub">Tỉ lệ tập tới được đích (8 lần chạy, làm trơn 10 tập)</h3><div class="chart" id="sh-chart"><p class="busy">Đang chạy…</p></div>' +
      '<div class="ctrl"><span class="rxs">Xem nơi tác tử hay tới (50 tập cuối, lần chạy 1):</span><div class="seg" id="sh-m">' + METH.map(function (m, i) { return '<button type="button" data-v="' + m[0] + '" aria-pressed="' + (i === 1) + '">' + ['Thưa', 'Càng gần', 'Chim bay', 'Đường thật', 'Tò mò'][i] + '</button>'; }).join('') + '</div></div>' +
      '<div class="gbox" id="sh-grid"></div><div class="tscroll" id="sh-tab"></div><div class="insight" id="sh-ins"></div></section>');
    root.appendChild(b2);
    function shRun(mode, E, r, keepVis) {
      var Q = [], N = new Array(256).fill(0), g = 0.95, out = [], vis = keepVis ? new Array(256).fill(0) : null;
      for (var s = 0; s < 256; s++) Q.push([0, 0, 0, 0]);
      var phi = function (s) { return mode === 'potB' ? 1 - MZ.BD[s] / MZ.DM : 1 - MZ.man(s) / MZ.MM; };
      for (var e = 0; e < E; e++) {
        var st = MZ.START, ok = 0;
        for (var t = 0; t < 300; t++) {
          var a = r() < 0.1 ? Math.floor(r() * 4) : argmaxRand(Q[st], r), s2 = MZ.mv(st, a), done = s2 === MZ.GOAL, rew = done ? 1 : 0; N[s2]++;
          if (mode === 'near') rew += 0.05 * (1 - MZ.man(s2) / MZ.MM);
          else if (mode === 'potM' || mode === 'potB') rew += g * phi(s2) - phi(st);
          else if (mode === 'cur') rew += 0.1 / Math.sqrt(N[s2]);
          Q[st][a] += 0.5 * (rew + (done ? 0 : g * Math.max.apply(null, Q[s2])) - Q[st][a]);
          st = s2; if (vis && e >= E - 50) vis[st]++;
          if (done) { ok = 1; break; }
        }
        out.push(ok);
      }
      return { out: out, vis: vis };
    }
    var shRes = null;
    function shGrid() {
      if (!shRes) return;
      var md = segVal(b2.querySelector('#sh-m')), v = shRes.vis[md], mx = Math.max.apply(null, v.filter(function (x, i) { return i !== MZ.GOAL; })) || 1;
      drawGrid(b2.querySelector('#sh-grid'), 16, 16, function (s) { return mzCell(s) || { fill: 'var(--s1)', op: 0.06 + 0.9 * Math.sqrt(v[s] / mx) }; }, 'Số lần tác tử tới mỗi ô');
    }
    function shAll() {
      var E = 300, RU = 8, curves = [], last = [], vis = {};
      METH.forEach(function (m, j) {
        var acc = new Array(E).fill(0);
        for (var i = 0; i < RU; i++) { var o = shRun(m[0], E, seeded(50 + i), i === 0); o.out.forEach(function (x, k) { acc[k] += x / RU; }); if (i === 0) vis[m[0]] = o.vis; }
        curves.push(smooth(acc, 10)); last.push(acc);
      });
      shRes = { vis: vis };
      lineChart(b2.querySelector('#sh-chart'), { series: METH.map(function (m, j) { return { name: m[1].replace(/\$[^$]*\$/g, 'Φ'), color: m[2], values: curves[j] }; }), yMin: 0, yMax: 1, yTicks: [0, 0.25, 0.5, 0.75, 1], dec: 2, xLabel: 'Tập', aria: 'Tỉ lệ tới đích theo tập' });
      var avg = function (a, k0, k1) { var s = 0; for (var k = k0; k < k1; k++) s += a[k]; return s / (k1 - k0); };
      b2.querySelector('#sh-tab').innerHTML = table(['Cách', 'Tập 1–50', 'Tập 51–150', 'Tập 251–300'], METH.map(function (m, j) { return [m[1], fmtNum(100 * avg(last[j], 0, 50), 0) + '%', fmtNum(100 * avg(last[j], 50, 150), 0) + '%', fmtNum(100 * avg(last[j], 250, 300), 0) + '%']; }));
      var A = function (k) { return 100 * avg(last[k], 250, 300); };
      b2.querySelector('#sh-ins').innerHTML = '<b>Thưa</b>: sau 300 tập mới tới đích ' + fmtNum(A(0), 0) + '% số tập; khám phá ngẫu nhiên hiếm khi vòng qua tường. ' +
        '<b>“Càng gần càng thưởng”</b> (' + fmtNum(A(1), 0) + '%): tác tử phát hiện đứng ở sát tường, ngay dưới đích, là chỗ được thưởng nhiều nhất và <b>ở lì</b> đó ăn thưởng (bấm “Càng gần” để xem), giống robot đập tấm ván vào cột. ' +
        '<b>Tiềm năng</b> không tạo được chỗ “ăn thưởng mãi” (tab Chứng minh): với $\\Phi$ đúng thì học rất nhanh (' + fmtNum(100 * avg(last[3], 0, 50), 0) + '% ngay 50 tập đầu); với $\\Phi$ chim bay (tri thức sai) thì lúc đầu bị dẫn vào ngõ cụt dưới tường, chậm hơn, nhưng cuối cùng vẫn tìm ra đường (' + fmtNum(A(2), 0) + '%) vì chính sách tối ưu không đổi. ' +
        '<b>Tò mò</b> (' + fmtNum(A(4), 0) + '%) không cần biết đích ở đâu: chỉ thưởng ô ít ghé, nên tác tử tự lan ra khắp mê cung cho tới khi chạm $G$.';
      ctx.typeset(b2.querySelector('#sh-tab')); ctx.typeset(b2.querySelector('#sh-ins'));
      shGrid();
    }
    seg(b2.querySelector('#sh-m'), shGrid);
    setTimeout(shAll, 30);
    onResize(function () { if (shRes) shAll(); });

    // ============ 3. Lá cây bay ============
    var b3 = h('<section class="blk">' +
      '<h2>3. Tò mò và lá cây bay (mục 10.2, hình 10.4–10.5)</h2>' +
      '<p class="lead">Phòng 10×10 <b>không có phần thưởng thật</b>; tác tử chỉ có phần thưởng tò mò. Ở ô “lá cây bay” (ô 🍃) hình ảnh thay đổi ngẫu nhiên giữa $K$ kiểu mỗi bước. Mô hình dự đoán dạng bảng: với mỗi $(s, a)$ nó đếm các quan sát tiếp theo đã gặp, $r^i = 1 - \\hat P(\\text{quan sát thật} \\mid s, a)$. Có thêm hành động “đứng yên”. Q-learning, 5000 bước, 10 lần chạy.<br><b>Không có $\\boldsymbol\\phi$</b>: dự đoán cả hình ảnh. <b>Có $\\boldsymbol\\phi$</b>: dự đoán đặc trưng đã lọc bỏ phần ngẫu nhiên (thứ không giúp đoán hành động).</p>' +
      '<div class="ctrl"><label for="tv-k">$K$</label><input id="tv-k" type="range" min="2" max="20" step="1" value="10"><span class="val" id="tv-k-v"></span></div>' +
      '<div class="gpair"><div><div class="cap">Không có $\\boldsymbol\\phi$ (lần chạy 1)</div><div class="gbox" id="tv-g0"></div></div><div><div class="cap">Có $\\boldsymbol\\phi$ (lần chạy 1)</div><div class="gbox" id="tv-g1"></div></div></div>' +
      '<div class="legend"><span class="li"><span class="sw" style="background:var(--s2)"></span>không có $\\boldsymbol\\phi$</span><span class="li"><span class="sw" style="background:var(--s1)"></span>có $\\boldsymbol\\phi$</span></div>' +
      '<h3 class="sub">Số ô đã khám phá (trên 100)</h3><div class="chart" id="tv-chart"></div><div class="stat3" id="tv-stat"></div><div class="calc" id="tv-calc"></div><div class="insight" id="tv-ins"></div></section>');
    root.appendChild(b3);
    var TVR = 10, TVC = 10, TV = 7 * 10 + 7, TVS = 99, TDR = [-1, 0, 1, 0, 0], TDC = [0, 1, 0, -1, 0];
    function tvMv(s, a) { var r = Math.floor(s / TVC) + TDR[a], c = s % TVC + TDC[a]; if (r < 0 || c < 0 || r >= TVR || c >= TVC) return s; return r * TVC + c; }
    function tvRun(feat, K, T, r) {
      var Q = [], cnt = {}, tot = {}, vis = new Array(100).fill(0), seen = {}, nSeen = 0, s = TVS, cov = [], ex = null;
      for (var i = 0; i < 100; i++) Q.push([0, 0, 0, 0, 0]);
      for (var t = 0; t < T; t++) {
        var a = r() < 0.05 ? Math.floor(r() * 5) : argmaxRand(Q[s], r), s2 = tvMv(s, a), ch = s2 === TV ? Math.floor(r() * K) : 0, obs = feat ? s2 : s2 * 100 + ch, key = s * 5 + a;
        if (!cnt[key]) { cnt[key] = {}; tot[key] = 0; }
        var p = tot[key] ? (cnt[key][obs] || 0) / tot[key] : 0, ri = 1 - p;
        if (s === TV && a === 4 && tot[key] >= 20 && !ex) ex = { n: tot[key], c: cnt[key][obs] || 0, ri: ri };
        cnt[key][obs] = (cnt[key][obs] || 0) + 1; tot[key]++;
        Q[s][a] += 0.5 * (ri + 0.9 * Math.max.apply(null, Q[s2]) - Q[s][a]);
        s = s2; vis[s]++; if (!seen[s]) { seen[s] = 1; nSeen++; }
        if (t % 100 === 99) cov.push(nSeen);
      }
      return { vis: vis, cov: cov, tvf: vis[TV] / T, n: nSeen, ex: ex };
    }
    function tvDraw() {
      var K = +b3.querySelector('#tv-k').value; b3.querySelector('#tv-k-v').textContent = K;
      var res = [0, 1].map(function (f) {
        var RU = 10, cov = null, tvf = 0, n = 0, one = null;
        for (var i = 0; i < RU; i++) { var o = tvRun(f, K, 5000, seeded(70 + i)); if (!cov) cov = o.cov.map(function () { return 0; }); o.cov.forEach(function (v, k) { cov[k] += v / RU; }); tvf += o.tvf / RU; n += o.n / RU; if (i === 0) one = o; }
        return { cov: cov, tvf: tvf, n: n, one: one };
      });
      [0, 1].forEach(function (f) {
        var v = res[f].one.vis, mx = Math.max.apply(null, v) || 1;
        drawGrid(b3.querySelector('#tv-g' + f), 10, 10, function (s) { return { fill: f ? 'var(--s1)' : 'var(--s2)', op: 0.05 + 0.9 * Math.sqrt(v[s] / mx), txt: s === TV ? '🍃' : s === TVS ? 'S' : '' }; }, 'Số lần tới mỗi ô');
      });
      lineChart(b3.querySelector('#tv-chart'), { series: [{ name: 'không có φ', color: 'var(--s2)', values: res[0].cov }, { name: 'có φ', color: 'var(--s1)', values: res[1].cov }], xs: res[0].cov.map(function (_, i) { return (i + 1) * 100; }), xFmt: function (v) { return v; }, yMin: 0, yMax: 100, yTicks: [0, 25, 50, 75, 100], dec: 0, xLabel: 'Bước', aria: 'Số ô đã khám phá theo bước' });
      b3.querySelector('#tv-stat').innerHTML = '<div>Thời gian ở ô 🍃<b>' + fmtNum(100 * res[0].tvf, 0) + '% · ' + fmtNum(100 * res[1].tvf, 0) + '%</b></div><div>Số ô đã tới sau 5000 bước<b>' + fmtNum(res[0].n, 0) + ' · ' + fmtNum(res[1].n, 0) + '</b></div>';
      var ex = res[0].one.ex;
      katexBlock(b3.querySelector('#tv-calc'), '\\begin{aligned}&\\text{ô 🍃, đứng yên, không có } \\boldsymbol\\phi:\\ \\mathbb E[r^i] = 1 - \\tfrac1K = 1 - \\tfrac1{' + K + '} = ' + texRaw(1 - 1 / K, 3) + (ex ? '\\quad(\\text{ví dụ sau } ' + ex.n + ' \\text{ lần: kiểu này gặp } ' + ex.c + ' \\text{ lần, } r^i = 1 - \\tfrac{' + ex.c + '}{' + ex.n + '} = ' + texRaw(ex.ri, 3) + ')' : '') +
        '\\\\&\\text{chuyển trạng thái tất định, sau lần đầu: } r^i = 1 - \\tfrac{n}{n} = 0\\end{aligned}');
      b3.querySelector('#tv-ins').innerHTML = 'Không có $\\boldsymbol\\phi$, ô 🍃 <b>mãi mãi</b> khó dự đoán nên phần thưởng tò mò ở đó không bao giờ giảm: tác tử dành ' + fmtNum(100 * res[0].tvf, 0) + '% thời gian đứng xem lá cây bay và khám phá được ít ô hơn. Có $\\boldsymbol\\phi$, phần ngẫu nhiên bị lọc nên ô 🍃 trở nên nhàm chán như mọi ô khác, tác tử đi khắp phòng. Đây đúng là lý do hình 10.5 thêm bộ trích xuất đặc trưng và mạng 2.';
      ctx.typeset(b3.querySelector('#tv-ins'));
    }
    b3.querySelector('#tv-k').addEventListener('change', tvDraw);
    b3.querySelector('#tv-k').oninput = function () { b3.querySelector('#tv-k-v').textContent = b3.querySelector('#tv-k').value; };
    tvDraw(); onResize(tvDraw);

    // ============ 4. Giáo trình ngược ============
    var b4 = h('<section class="blk">' +
      '<h2>4. Sinh giáo trình ngược (mục 10.3, hình 10.7–10.8)</h2>' +
      '<p class="lead">Cùng mê cung 16×16, <b>chỉ phần thưởng thưa</b>, Q-learning như thí nghiệm 2 (tối đa 100 bước mỗi tập). Mỗi vòng: từ các trạng thái “vừa phải” của vòng trước, đi ngẫu nhiên 3–6 bước để lấy 8 trạng thái xuất phát mới; chơi 4 tập từ mỗi trạng thái và đo tỉ lệ tới đích. <b>Giữ</b> trạng thái có tỉ lệ vừa phải (lớn hơn 0 và nhỏ hơn 1), <b>bỏ</b> trạng thái quá khó (0) và quá dễ (1). Nếu không có trạng thái vừa phải nào thì đi tiếp từ các trạng thái quá dễ.</p>' +
      '<div class="ctrl"><button type="button" class="btn pri" id="rc-one">Vòng tiếp</button><button type="button" class="btn" id="rc-20">+20 vòng</button><button type="button" class="btn" id="rc-reset">Đặt lại</button></div>' +
      '<div class="legend"><span class="li"><span class="sw box" style="background:' + C3 + '"></span>vừa phải: giữ</span><span class="li"><span class="sw box" style="background:var(--muted)"></span>quá dễ: bỏ</span><span class="li"><span class="sw box" style="background:var(--s2)"></span>quá khó: bỏ</span><span class="li"><span class="sw box" style="background:var(--s1);opacity:.35"></span>ô đã từng là trạng thái xuất phát</span></div>' +
      '<div class="gbox" id="rc-grid"></div><div class="stat3" id="rc-stat"></div><div class="insight" id="rc-ins"></div>' +
      '<h3 class="sub">So sánh: luôn xuất phát từ $S$ và giáo trình ngược (8 lần chạy, cùng 3000 tập)</h3>' +
      '<div class="ctrl"><button type="button" class="btn" id="rc-cmp">Chạy so sánh</button></div>' +
      '<div class="legend"><span class="li"><span class="sw" style="background:var(--muted)"></span>luôn từ $S$</span><span class="li"><span class="sw" style="background:var(--s1)"></span>giáo trình ngược</span></div>' +
      '<div class="chart" id="rc-chart"></div><div class="insight" id="rc-cins">Bấm “Chạy so sánh”.</div></section>');
    root.appendChild(b4);
    function rcEp(Q, s, r, learn) {
      for (var t = 0; t < 100; t++) {
        var a = r() < 0.1 ? Math.floor(r() * 4) : argmaxRand(Q[s], r), s2 = MZ.mv(s, a), done = s2 === MZ.GOAL;
        if (learn) Q[s][a] += 0.5 * ((done ? 1 : 0) + (done ? 0 : 0.95 * Math.max.apply(null, Q[s2])) - Q[s][a]);
        s = s2; if (done) return 1;
      }
      return 0;
    }
    function rcNew(seed) { var Q = []; for (var s = 0; s < 256; s++) Q.push([0, 0, 0, 0]); return { Q: Q, r: seeded(seed), good: [MZ.GOAL], used: 0, it: 0, last: [], ever: {} }; }
    function rcIter(o) {
      var r = o.r, cand = [];
      var walk = function (s, n) { for (var i = 0; i < n; i++) s = MZ.mv(s, Math.floor(r() * 4)); return s; };
      for (var j = 0; j < 8; j++) { var c = walk(o.good[Math.floor(r() * o.good.length)], 3 + Math.floor(r() * 4)); if (c !== MZ.GOAL) cand.push(c); }
      var mid = [], easy = [], res = [];
      cand.forEach(function (c) { var ok = 0; for (var m = 0; m < 4; m++) { ok += rcEp(o.Q, c, r, true); o.used++; } var rate = ok / 4; res.push([c, rate]); o.ever[c] = 1; if (rate > 0 && rate < 1) mid.push(c); else if (rate === 1) easy.push(c); });
      if (mid.length) o.good = mid; else if (easy.length) o.good = easy;
      o.last = res; o.it++;
    }
    function rcEval(Q, r) { var ok = 0; for (var i = 0; i < 20; i++) ok += rcEp(Q, MZ.START, r, false); return ok / 20; }
    var rc = rcNew(1);
    function rcDraw() {
      var mp = {}; rc.last.forEach(function (x) { mp[x[0]] = x[1]; });
      drawGrid(b4.querySelector('#rc-grid'), 16, 16, function (s) {
        var base = mzCell(s); if (base) return base;
        if (mp[s] != null) return { fill: mp[s] === 0 ? 'var(--s2)' : mp[s] === 1 ? 'var(--muted)' : C3, op: 0.9, txt: Math.round(mp[s] * 4) + '/4' };
        return rc.ever[s] ? { fill: 'var(--s1)', op: 0.3 } : { fill: 'var(--surface-2)' };
      }, 'Các trạng thái xuất phát của giáo trình ngược');
      var far = Math.max.apply(null, rc.good.map(function (g) { return MZ.BD[g]; }));
      b4.querySelector('#rc-stat').innerHTML = '<div>Vòng<b>' + rc.it + '</b></div><div>Số tập đã chơi<b>' + rc.used + '</b></div><div>Trạng thái giữ lại xa đích nhất (số bước)<b>' + far + ' / ' + MZ.BD[MZ.START] + '</b></div><div>Tới đích khi xuất phát từ $S$ (20 tập thử, không học)<b>' + fmtNum(100 * rcEval(rc.Q, seeded(999)), 0) + '%</b></div>';
      ctx.typeset(b4.querySelector('#rc-stat'));
      b4.querySelector('#rc-ins').innerHTML = !rc.it ? 'Bấm “Vòng tiếp”. Số trong ô là số tập tới đích (trên 4) của trạng thái xuất phát đó ở vòng này.' :
        'Vùng các trạng thái xuất phát lan dần từ $G$ ra xa, vòng qua tường về phía $S$. Ở mỗi vòng tác tử chỉ học những trạng thái “vừa sức”: đủ gần để đôi khi chạm được đích, nhưng chưa thành thạo.';
      ctx.typeset(b4.querySelector('#rc-ins'));
    }
    b4.querySelector('#rc-one').onclick = function () { rcIter(rc); rcDraw(); };
    b4.querySelector('#rc-20').onclick = function () { for (var i = 0; i < 20; i++) rcIter(rc); rcDraw(); };
    b4.querySelector('#rc-reset').onclick = function () { rc = rcNew(1); rcDraw(); };
    b4.querySelector('#rc-cmp').onclick = function () {
      var btn = this; btn.disabled = true; btn.textContent = 'Đang chạy…';
      setTimeout(function () {
        var RU = 8, B = 3000, EV = 100, A0 = null, A1 = null;
        for (var i = 0; i < RU; i++) {
          var r = seeded(200 + i), Q = rcNew(0).Q, a0 = [];
          for (var e = 0; e < B; e++) { rcEp(Q, MZ.START, r, true); if (e % EV === EV - 1) a0.push(rcEval(Q, r)); }
          var o = rcNew(300 + i), a1 = [], nxt = EV;
          while (o.used < B) { rcIter(o); while (o.used >= nxt && a1.length < B / EV) { a1.push(rcEval(o.Q, o.r)); nxt += EV; } }
          if (!A0) { A0 = a0.map(function () { return 0; }); A1 = a0.map(function () { return 0; }); }
          a0.forEach(function (v, k) { A0[k] += v / RU; }); a1.forEach(function (v, k) { A1[k] += v / RU; });
        }
        lineChart(b4.querySelector('#rc-chart'), { series: [{ name: 'luôn từ S', color: 'var(--muted)', values: A0 }, { name: 'giáo trình ngược', color: 'var(--s1)', values: A1 }], xs: A0.map(function (_, k) { return (k + 1) * EV; }), xFmt: function (v) { return v; }, yMin: 0, yMax: 1, yTicks: [0, 0.25, 0.5, 0.75, 1], dec: 2, xLabel: 'Số tập đã chơi', aria: 'Tỉ lệ tới đích từ S theo số tập' });
        var at = function (A, k) { return fmtNum(100 * A[k], 0) + '%'; };
        b4.querySelector('#rc-cins').innerHTML = 'Tỉ lệ tới đích khi xuất phát từ $S$ (tập thử, không học) sau 1000 / 2000 / 3000 tập: luôn từ $S$: ' + at(A0, 9) + ' / ' + at(A0, 19) + ' / ' + at(A0, 29) + '; giáo trình ngược: <b>' + at(A1, 9) + ' / ' + at(A1, 19) + ' / ' + at(A1, 29) + '</b>. ' +
          'Xuất phát từ $S$ với tối đa 100 bước, khám phá ngẫu nhiên gần như không bao giờ vòng qua được tường tới $G$, nên Q-learning không có tín hiệu nào để học. Giáo trình ngược học từ gần đích ra, nên dù cùng số tập vẫn học được đường đi.';
        ctx.typeset(b4.querySelector('#rc-cins'));
        btn.disabled = false; btn.textContent = 'Chạy lại so sánh';
      }, 30);
    };
    rcDraw();
    ctx.typeset(root);
  }

  // ======================================================================
  // TAB "Sơ đồ"
  // ======================================================================
  function renderMap(root, ctx) {
    root.innerHTML = '';
    root.classList.add('rx');

    var m1 = h('<section class="blk"><h2>Các hướng giải quyết phần thưởng thưa</h2>' + table(['Hướng', 'Thêm gì', 'Cần gì', 'Rủi ro'], [
      ['Thiết kế phần thưởng (10.1)', 'phần thưởng phụ do người thiết kế', 'tri thức chuyên ngành', 'tác tử “ăn gian” phần thưởng (tấm ván đập cột); dạng tiềm năng thì an toàn'],
      ['Tò mò, ICM (10.2)', '$r^i$ = sai số dự đoán trạng thái tiếp theo', 'mô hình dự đoán, bộ trích xuất đặc trưng', 'nghiện thứ ngẫu nhiên (lá cây bay) nếu không có $\\boldsymbol\\phi$'],
      ['Học theo giáo trình (10.3)', 'thứ tự nhiệm vụ từ dễ đến khó', 'người thiết kế giáo trình', 'giáo trình kém thì không giúp'],
      ['Giáo trình ngược (10.3)', 'trạng thái xuất phát lan dần từ đích', 'đặt được tác tử ở trạng thái gần đích', 'cần môi trường cho phép chọn trạng thái xuất phát'],
      ['Phân cấp, HRL (10.4)', 'tầng trên đưa ra mục tiêu con', 'cách biểu diễn mục tiêu con', 'tầng trên đặt mục tiêu bất khả thi (bị phạt)']]) + '</section>');
    root.appendChild(m1);

    var m2 = h('<section class="blk"><h2>Mô-đun tò mò nội tại đầy đủ (hình 10.5)</h2><div class="flow">' +
      '<div class="fb"><div class="fx">$s_t,\\ s_{t+1} \\to$ bộ trích xuất đặc trưng $\\to \\boldsymbol\\phi(s_t),\\ \\boldsymbol\\phi(s_{t+1})$</div><div class="fy">Chỉ giữ thông tin liên quan tới hành động.</div></div><div class="fa">↓</div>' +
      '<div class="fb"><div class="fx">Mạng 1 (mô hình thuận): $\\big(a_t,\\ \\boldsymbol\\phi(s_t)\\big) \\to \\hat{\\boldsymbol\\phi}(s_{t+1})$</div><div class="fy">$r^i_t$ = độ khác giữa $\\hat{\\boldsymbol\\phi}(s_{t+1})$ và $\\boldsymbol\\phi(s_{t+1})$: càng khó dự đoán càng thưởng.</div></div><div class="fa">↓</div>' +
      '<div class="fb"><div class="fx">Mạng 2 (mô hình ngược): $\\big(\\boldsymbol\\phi(s_t),\\ \\boldsymbol\\phi(s_{t+1})\\big) \\to \\hat a_t$</div><div class="fy">Huấn luyện để $\\hat a_t$ gần $a_t$ thật; nhờ đó $\\boldsymbol\\phi$ bỏ gió thổi cỏ lay, lá cây bay.</div></div><div class="fa">↓</div>' +
      '<div class="fb eq"><div class="fx">Tác tử tối đa hóa $\\sum_t\\big(r_t + r^i_t\\big)$</div><div class="fy">Phần thưởng thật cộng phần thưởng tò mò.</div></div></div></section>');
    root.appendChild(m2);

    // ---- HRL: thời gian chạm ----
    var m3 = h('<section class="blk"><h2>Vì sao mục tiêu con giúp khám phá (mục 10.4, hình 10.11)</h2>' +
      '<p class="lead">Bước ngẫu nhiên trên chuỗi $n$ ô (sát tường ở ô 0). Không có mục tiêu con: phải tự đi tới ô $n$. Có $k$ mục tiêu con cách đều (như các điểm hồng của tầng trên): mỗi lần chỉ cần tới mục tiêu con kế tiếp, tới rồi thì mục tiêu con đó thành “tường” mới. 400 lần mô phỏng.</p>' +
      '<div class="ctrl"><label for="hr-n">$n$</label><input id="hr-n" type="range" min="10" max="60" step="2" value="30"><span class="val" id="hr-n-v"></span>' +
      '<label for="hr-k">$k$</label><input id="hr-k" type="range" min="1" max="10" step="1" value="3"><span class="val" id="hr-k-v"></span></div>' +
      '<div class="chart" id="hr-bars"></div><div class="calc" id="hr-calc"></div><div class="insight" id="hr-ins"></div></section>');
    root.appendChild(m3);
    function hrDraw() {
      var n = +m3.querySelector('#hr-n').value, k = +m3.querySelector('#hr-k').value;
      m3.querySelector('#hr-n-v').textContent = n; m3.querySelector('#hr-k-v').textContent = k;
      var r = seeded(5), sim = function (segs) { var tot = 0, T = 400; for (var i = 0; i < T; i++) { var steps = 0, lo = 0, pos = 0; segs.forEach(function (g) { while (pos < g) { pos += (pos === lo || r() < 0.5) ? 1 : -1; steps++; } lo = g; }); tot += steps / T; } return tot; };
      var subs = []; for (var j = 1; j <= k; j++) subs.push(Math.round(j * n / k));
      var s0 = sim([n]), s1 = sim(subs), mx = Math.max(s0, s1);
      var box = m3.querySelector('#hr-bars'), W = Math.max(300, box.clientWidth), H = 110, lab = 150, bw = W - lab - 60;
      var row = function (y, v, txt, col) { return '<text x="0" y="' + (y + 15) + '" class="lbl">' + txt + '</text><rect x="' + lab + '" y="' + y + '" width="' + Math.max(2, v / mx * bw).toFixed(1) + '" height="22" rx="4" fill="' + col + '"/><text x="' + (lab + v / mx * bw + 6) + '" y="' + (y + 15) + '">' + fmtNum(v, 0) + '</text>'; };
      box.innerHTML = '<svg class="plot" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Số bước trung bình">' + row(14, s0, 'không mục tiêu con', 'var(--s2)') + row(60, s1, k + ' mục tiêu con', 'var(--s1)') + '</svg>';
      katexBlock(m3.querySelector('#hr-calc'), '\\text{lý thuyết: } n^2 = ' + n * n + ',\\qquad k\\Big(\\frac nk\\Big)^2 = \\frac{n^2}{k} = ' + texRaw(n * n / k, 1) + '\\qquad(\\text{mô phỏng: } ' + texRaw(s0, 0) + '\\ \\text{và}\\ ' + texRaw(s1, 0) + ')');
      m3.querySelector('#hr-ins').innerHTML = 'Mục tiêu con giảm số bước khoảng ' + fmtNum(s0 / s1, 1) + ' lần. Với phần thưởng thưa, điều này nghĩa là tầng dưới thường xuyên chạm được “phần thưởng” (đạt mục tiêu con), còn tầng trên chỉ cần học chọn chuỗi mục tiêu con hợp lý. Tầm nhìn đặt quá xa (k nhỏ) thì tầng dưới khó đạt và tầng trên bị phạt.';
    }
    ['#hr-n', '#hr-k'].forEach(function (id) { m3.querySelector(id).oninput = hrDraw; });
    hrDraw(); onResize(hrDraw);
    ctx.typeset(root);
  }

  // ======================================================================
  // TAB "Mô phỏng": liên kết tới các trang docs/viz
  // ======================================================================
  var VIZ = [
    ['icm.html', 'Mục 10.2', 'Mô-đun tò mò nội tại', 'Mạng nơ-ron thật; dự đoán quan sát thô và dự đoán đặc trưng φ khi có lá cây bay.'],
    ['hrl.html', 'Mục 10.4', 'Học tăng cường phân cấp', 'Tầng trên đặt điểm hồng, tầng dưới đi tới đó; đổi tầm nhìn; so sánh với Q-learning phẳng.']
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
