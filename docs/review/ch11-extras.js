/* Thí nghiệm tương tác và sơ đồ trực quan cho chương 11 (học bắt chước).
 * Trang index.html tải file này khi ch11.json có "extras": "ch11-extras.js".
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
  var css11 = String.raw`
  .rx svg.plot { display: block; width: 100%; height: auto; overflow: visible; }
  .rx svg.plot text { fill: var(--muted); font-size: 11px; font-family: inherit; }
  .rx svg.plot .lbl { fill: var(--text); font-weight: 600; }
  .rx .stat3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; margin-top: 10px; }
  .rx .stat3 > div { background: var(--surface-2); border-radius: 10px; padding: 8px 10px; font-size: .86rem; }
  .rx .stat3 b { display: block; font-size: 1.05rem; font-variant-numeric: tabular-nums; }
  .rx .insight, .rx .lead, .rx .tscroll { position: relative; }
  .rx .gbox { max-width: 380px; margin: 0 auto; }`;
  var st11 = document.createElement('style'); st11.textContent = css11; document.head.appendChild(st11);
  var C3 = 'var(--accent-text)';
  function gauss(r) { var u = r() || 1e-12, v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function table(head, rows) { return '<div class="tscroll"><table class="cmp"' + (head.length > 4 ? ' style="min-width:600px"' : '') + '><thead><tr>' + head.map(function (x) { return '<th>' + x + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.map(function (r) { return '<tr>' + r.map(function (x) { return '<td>' + x + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>'; }

  function renderLab(root, ctx) {
    root.innerHTML = '';
    root.classList.add('rx');

    // ============ 1. Nhân bản hành vi và DAgger ============
    var T = 40, Y = 15, HW = 2, NR = 5;
    function cen(t) { return Math.round(7 + 5 * Math.sin(t / T * 2 * Math.PI)); }
    function expert(t, y) { var d = cen(t + 1) - y; return d > 0 ? 1 : d < 0 ? -1 : 0; }
    function roll(pol, r, p) {
      var y = cen(0), path = [[0, y]];
      for (var t = 0; t < T; t++) {
        var a = pol(t, y); if (r() < p) a += r() < 0.5 ? -1 : 1; a = Math.max(-1, Math.min(1, a));
        y = Math.max(0, Math.min(Y - 1, y + a)); path.push([t + 1, y]);
        if (Math.abs(y - cen(t + 1)) > HW) return { path: path, crash: true };
      }
      return { path: path, crash: false };
    }
    var b1 = h('<section class="blk">' +
      '<h2>1. Nhân bản hành vi đâm tường, DAgger sửa (mục 11.1, hình 11.2–11.3)</h2>' +
      '<p class="lead">Con đường cong dài ' + T + ' bước (ô sáng), lệch quá ' + HW + ' ô khỏi tim đường là đâm tường. Mỗi bước chọn lên, thẳng hoặc xuống; với xác suất $p$ tay lái bị trượt thêm một nấc (gió, sai số). Chuyên gia luôn lái về tim đường. Diễn viên là một <b>bảng tra</b>: trạng thái $(t, y)$ đã có nhãn thì làm theo nhãn, <b>chưa từng thấy thì đi thẳng</b>. Minh họa của chuyên gia là <b>sạch</b> (chuyên gia không bao giờ trượt).</p>' +
      '<div class="ctrl"><label for="dg-p">$p$</label><input id="dg-p" type="range" min="0.02" max="0.3" step="0.02" value="0.1"><span class="val" id="dg-p-v"></span></div>' +
      '<div class="ctrl"><button type="button" class="btn" id="dg-bc">Bắt đầu: 5 minh họa sạch (BC)</button><button type="button" class="btn" id="dg-more">+50 minh họa sạch</button><button type="button" class="btn pri" id="dg-one">Vòng DAgger tiếp</button><button type="button" class="btn" id="dg-five">+5 vòng DAgger</button></div>' +
      '<div class="legend"><span class="li"><span class="sw dot" style="background:var(--text)"></span>trạng thái đã có nhãn</span><span class="li"><span class="sw" style="background:var(--s1)"></span>20 lần lái thử của diễn viên</span><span class="li"><span class="sw dot" style="background:var(--s2)"></span>chỗ đâm tường</span></div>' +
      '<div class="chart" id="dg-road"></div><div class="stat3" id="dg-stat"></div><div class="calc" id="dg-calc"></div>' +
      '<h3 class="sub">Tỉ lệ đâm tường (200 lần lái thử) qua các bước</h3><div class="chart" id="dg-chart"></div><div class="insight" id="dg-ins"></div></section>');
    root.appendChild(b1);
    var dg;
    function dgP() { return +b1.querySelector('#dg-p').value; }
    function dgLabel(path) { var n = 0, ex = null; path.forEach(function (q) { if (q[0] < T) { var k = q[0] * Y + q[1]; if (dg.D[k] == null) { n++; if (!ex && Math.abs(q[1] - cen(q[0])) >= 2) ex = q; } dg.D[k] = expert(q[0], q[1]); } }); return { n: n, ex: ex }; }
    function dgPol() { return function (t, y) { var v = dg.D[t * Y + y]; return v == null ? 0 : v; }; }
    function dgTest() { var r = seeded(900 + dg.hist.length), cr = 0, L = dgPol(); for (var i = 0; i < 200; i++) if (roll(L, r, dgP()).crash) cr++; return cr / 200; }
    function dgReset() { dg = { r: seeded(11), D: {}, hist: [], labels: [], step: 'BC', demos: 0, it: 0, lastEx: null }; for (var i = 0; i < 5; i++) dgLabel(roll(expert, dg.r, 0).path); dg.demos = 5; dg.hist.push(dgTest()); dg.labels.push('BC'); dgDraw(); }
    function dgDraw() {
      b1.querySelector('#dg-p-v').textContent = fmtNum(dgP(), 2);
      var box = b1.querySelector('#dg-road'), W = Math.max(300, box.clientWidth), cw = W / (T + 1), ch = Math.min(16, cw * 1.2), H = Y * ch + 4;
      var s = '<svg class="plot" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Con đường và các lần lái thử">';
      for (var t = 0; t <= T; t++) for (var y = 0; y < Y; y++) { var on = Math.abs(y - cen(t)) <= HW; s += '<rect x="' + (t * cw).toFixed(1) + '" y="' + (y * ch).toFixed(1) + '" width="' + (cw + 0.3).toFixed(1) + '" height="' + (ch + 0.3).toFixed(1) + '" fill="' + (on ? 'var(--surface-2)' : 'var(--text)') + '" fill-opacity="' + (on ? 1 : 0.12) + '"/>'; }
      Object.keys(dg.D).forEach(function (k) { var t2 = Math.floor(k / Y), y2 = k % Y; s += '<circle cx="' + ((t2 + 0.5) * cw).toFixed(1) + '" cy="' + ((y2 + 0.5) * ch).toFixed(1) + '" r="1.6" fill="var(--text)" fill-opacity=".55"/>'; });
      var r = seeded(500 + dg.hist.length), L = dgPol();
      for (var i = 0; i < 20; i++) {
        var o = roll(L, r, dgP());
        s += '<path d="' + o.path.map(function (q, k) { return (k ? 'L' : 'M') + ((q[0] + 0.5) * cw).toFixed(1) + ' ' + ((q[1] + 0.5) * ch).toFixed(1); }).join('') + '" fill="none" stroke="var(--s1)" stroke-opacity=".45" stroke-width="1.6"/>';
        if (o.crash) { var q = o.path[o.path.length - 1]; s += '<circle cx="' + ((q[0] + 0.5) * cw).toFixed(1) + '" cy="' + ((q[1] + 0.5) * ch).toFixed(1) + '" r="3.5" fill="var(--s2)"/>'; }
      }
      box.innerHTML = s + '</svg>';
      var cr = dg.hist[dg.hist.length - 1];
      b1.querySelector('#dg-stat').innerHTML = '<div>Đang ở<b>' + dg.labels[dg.labels.length - 1] + '</b></div><div>Số trạng thái có nhãn<b>' + Object.keys(dg.D).length + '</b></div><div>Minh họa sạch của chuyên gia<b>' + dg.demos + '</b></div><div>Tỉ lệ đâm tường<b>' + fmtNum(100 * cr, 0) + '%</b></div>';
      var e = dg.lastEx;
      if (e) katexBlock(b1.querySelector('#dg-calc'), '\\text{ví dụ nhãn mới: diễn viên ở } t = ' + e[0] + ',\\ y = ' + e[1] + '\\ (\\text{tim đường } ' + cen(e[0]) + ',\\ \\text{lệch } ' + (e[1] - cen(e[0])) + '),\\quad \\text{chuyên gia nói: } ' + ['\\text{lên}', '\\text{thẳng}', '\\text{xuống}'][expert(e[0], e[1]) + 1] + '\\ (' + ['\\uparrow', '\\rightarrow', '\\downarrow'][expert(e[0], e[1]) + 1] + ')');
      else b1.querySelector('#dg-calc').innerHTML = '<span class="rxs">5 minh họa sạch của chuyên gia đều đi đúng tim đường, nên bảng chỉ có nhãn trên đúng một đường (chấm đen).</span>';
      lineChart(b1.querySelector('#dg-chart'), { series: [{ name: 'Đâm tường', color: 'var(--s2)', values: dg.hist }], xs: dg.hist.map(function (_, i) { return i; }), xFmt: function (v) { return dg.labels[v] || ''; }, yMin: 0, yMax: 1, yTicks: [0, 0.25, 0.5, 0.75, 1], dec: 2, xLabel: 'Bước', aria: 'Tỉ lệ đâm tường' });
      var bc = dg.hist[0];
      b1.querySelector('#dg-ins').innerHTML = dg.it === 0 ? (dg.demos > 5 ? 'Thêm ' + (dg.demos - 5) + ' minh họa sạch mà tỉ lệ đâm vẫn ' + fmtNum(100 * cr, 0) + '%: chuyên gia không bao giờ trượt nên mọi minh họa trùng nhau, bảng vẫn không có nhãn ở chỗ lệch. Nhiều dữ liệu “đẹp” không giải quyết được vấn đề. Bấm “Vòng DAgger tiếp”.' :
        'Nhân bản hành vi: chỉ cần trượt một nấc là diễn viên vào trạng thái chưa từng thấy, đi thẳng mãi trong khi đường đang cong: <b>' + fmtNum(100 * cr, 0) + '%</b> lần lái thử đâm tường. Đây là cảnh hình 11.2.') :
        'Sau ' + dg.it + ' vòng DAgger (mỗi vòng diễn viên tự lái ' + NR + ' lần, chuyên gia gán nhãn mọi trạng thái nó gặp), tỉ lệ đâm từ ' + fmtNum(100 * bc, 0) + '% còn <b>' + fmtNum(100 * cr, 0) + '%</b>. Các chấm đen giờ phủ cả hai bên tim đường: có dữ liệu ở đúng những chỗ diễn viên hay lạc vào, kể cả lúc sắp đâm tường.';
      ctx.typeset(b1.querySelector('#dg-ins'));
    }
    function dgIter() { var ex = null; for (var i = 0; i < NR; i++) { var o = roll(dgPol(), dg.r, dgP()); var l = dgLabel(o.path); if (!ex && l.ex) ex = l.ex; } if (ex) dg.lastEx = ex; dg.it++; dg.hist.push(dgTest()); dg.labels.push('D' + dg.it); }
    b1.querySelector('#dg-bc').onclick = dgReset;
    b1.querySelector('#dg-more').onclick = function () { if (dg.it) dgReset(); for (var i = 0; i < 50; i++) dgLabel(roll(expert, dg.r, 0).path); dg.demos += 50; dg.hist.push(dgTest()); dg.labels.push('BC+' + (dg.demos - 5)); dgDraw(); };
    b1.querySelector('#dg-one').onclick = function () { dgIter(); dgDraw(); };
    b1.querySelector('#dg-five').onclick = function () { for (var i = 0; i < 5; i++) dgIter(); dgDraw(); };
    b1.querySelector('#dg-p').oninput = function () { b1.querySelector('#dg-p-v').textContent = fmtNum(dgP(), 2); };
    b1.querySelector('#dg-p').onchange = dgReset;
    dgReset(); onResize(dgDraw);

    // ============ 2. IRL khớp đặc trưng ============
    var MAP = ['RRRRRRRRG', 'Rgggggggg', 'Rgggggggg', 'RggWWgggg', 'RggWWWggg', 'RgggWWggg', 'Rgggggggg', 'Rgggggggg', 'Sgggggggg'];
    var NG = 9, TYPES = ['đường', 'cỏ', 'nước'];
    function typ(rw, cl) { var c = MAP[rw][cl]; return c === 'R' || c === 'S' ? 0 : c === 'W' ? 2 : c === 'g' ? 1 : -1; }
    function feats(path) { var f = [0, 0, 0]; path.forEach(function (p) { var t2 = typ(p[0], p[1]); if (t2 >= 0) f[t2]++; }); return f; }
    // đường đi tốt nhất (chỉ đi lên hoặc sang phải) cho phần thưởng w, quy hoạch động
    function bestPath(w) {
      var V = [], P = [];
      for (var rr = 0; rr < NG; rr++) { V.push([]); P.push([]); }
      for (var r2 = 0; r2 < NG; r2++) for (var c2 = NG - 1; c2 >= 0; c2--) {
        if (r2 === 0 && c2 === NG - 1) { V[r2][c2] = 0; continue; }
        var opts = [];
        if (r2 > 0) opts.push([r2 - 1, c2]);
        if (c2 < NG - 1) opts.push([r2, c2 + 1]);
        if ((r2 + c2) % 2) opts.reverse();
        var best = -1e9, bp = null;
        opts.forEach(function (o) { var t3 = typ(o[0], o[1]), v = (t3 >= 0 ? w[t3] : 0) + V[o[0]][o[1]]; if (v > best + 1e-9) { best = v; bp = o; } });
        V[r2][c2] = best; P[r2][c2] = bp;
      }
      var path = [], cur = [NG - 1, 0]; while (cur) { path.push(cur); if (cur[0] === 0 && cur[1] === NG - 1) break; cur = P[cur[0]][cur[1]]; }
      return path;
    }
    var EXP = {
      road: (function () { var p = []; for (var r3 = NG - 1; r3 >= 0; r3--) p.push([r3, 0]); for (var c3 = 1; c3 < NG; c3++) p.push([0, c3]); return p; })(),
      grass: (function () { var p = []; for (var c3 = 0; c3 < NG; c3++) p.push([NG - 1, c3]); for (var r3 = NG - 2; r3 >= 0; r3--) p.push([r3, NG - 1]); return p; })()
    };
    var b2 = h('<section class="blk">' +
      '<h2>2. Học tăng cường ngược: “bắn tên trước, vẽ bia sau” (mục 11.2, hình 11.7)</h2>' +
      '<p class="lead">Lưới 9×9: <b>đường</b>, <b>cỏ</b>, <b>nước</b>. Không có phần thưởng; chỉ có <b>một</b> minh họa của chuyên gia đi từ $S$ tới $G$. Phần thưởng cần học là tuyến tính: mỗi ô loại $k$ cho $w_k$, nên $R(\\tau) = \\boldsymbol w^{\\mathrm T}\\boldsymbol f(\\tau)$ với $\\boldsymbol f$ là số ô mỗi loại trên quỹ đạo. Để đơn giản, mọi quỹ đạo chỉ đi lên hoặc sang phải (cùng 16 bước), nên khác nhau chỉ ở chỗ đi qua loại ô nào. Mỗi vòng: diễn viên tìm quỹ đạo có $R$ lớn nhất theo $\\boldsymbol w$ hiện tại, rồi $\\boldsymbol w \\leftarrow \\boldsymbol w + 0{,}1\\,(\\hat{\\boldsymbol f} - \\boldsymbol f)$ để chuyên gia lại hơn diễn viên.</p>' +
      '<div class="ctrl"><span class="rxs">Phong cách của chuyên gia (như hình 11.9):</span><div class="seg" id="ir-s"><button type="button" data-v="road" aria-pressed="true">Đi trên đường</button><button type="button" data-v="grass" aria-pressed="false">Đi tắt qua cỏ</button></div></div>' +
      '<div class="ctrl"><button type="button" class="btn pri" id="ir-one">Vòng tiếp</button><button type="button" class="btn" id="ir-reset">Đặt lại</button></div>' +
      '<div class="legend"><span class="li"><span class="sw" style="background:var(--s2)"></span>chuyên gia $\\hat\\tau$</span><span class="li"><span class="sw" style="background:var(--s1)"></span>diễn viên $\\tau$ (tối ưu theo $\\boldsymbol w$ hiện tại)</span><span class="li"><span class="sw box" style="background:var(--muted);opacity:.45"></span>đường</span><span class="li"><span class="sw box" style="background:' + C3 + ';opacity:.3"></span>cỏ</span><span class="li"><span class="sw box" style="background:var(--s1);opacity:.45"></span>nước</span></div>' +
      '<div class="gbox" id="ir-grid"></div><div id="ir-tab"></div><div class="calc" id="ir-calc"></div><div class="insight" id="ir-ins"></div></section>');
    root.appendChild(b2);
    var ir;
    function irReset() { ir = { w: [0, 0, 0], it: 0, path: bestPath([0, 0, 0]), log: null }; irDraw(); }
    function irExp() { return EXP[segVal(b2.querySelector('#ir-s'))]; }
    function irStep() {
      var fh = feats(irExp()), f = feats(ir.path), w0 = ir.w.slice(), R0 = [dot(w0, fh), dot(w0, f)];
      ir.w = ir.w.map(function (x, k) { return x + 0.1 * (fh[k] - f[k]); });
      var newPath = bestPath(ir.w);
      ir.log = { w0: w0, fh: fh, f: f, R0: R0, R1: [dot(ir.w, fh), dot(ir.w, f)], same: f.join() === fh.join() };
      if (!ir.log.same) ir.learned = true;
      ir.path = newPath; ir.it++;
    }
    function dot(a, b) { return a.reduce(function (s, x, i) { return s + x * b[i]; }, 0); }
    function irDraw() {
      var box = b2.querySelector('#ir-grid'), W = 360, cs = W / NG, s = '<svg class="plot" viewBox="0 0 ' + W + ' ' + W + '" role="img" aria-label="Lưới địa hình và hai quỹ đạo">';
      for (var rr = 0; rr < NG; rr++) for (var cc = 0; cc < NG; cc++) {
        var t3 = typ(rr, cc), fill = t3 === 0 ? 'var(--muted)' : t3 === 1 ? C3 : t3 === 2 ? 'var(--s1)' : '#e6b422', op = t3 === 0 ? 0.45 : t3 === 1 ? 0.22 : t3 === 2 ? 0.45 : 0.9;
        s += '<rect x="' + (cc * cs + 1) + '" y="' + (rr * cs + 1) + '" width="' + (cs - 2) + '" height="' + (cs - 2) + '" rx="4" fill="' + fill + '" fill-opacity="' + op + '"/>';
        if (MAP[rr][cc] === 'S' || MAP[rr][cc] === 'G') s += '<text class="lbl" x="' + (cc * cs + cs / 2) + '" y="' + (rr * cs + cs / 2 + 5) + '" text-anchor="middle" style="font-size:15px">' + MAP[rr][cc] + '</text>';
      }
      var pp = function (p, col, dash, off) { return '<path d="' + p.map(function (q, k) { return (k ? 'L' : 'M') + (q[1] * cs + cs / 2 + off) + ' ' + (q[0] * cs + cs / 2 + off); }).join('') + '" fill="none" stroke="' + col + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"' + (dash ? ' stroke-dasharray="7 6"' : '') + '/>'; };
      s += pp(irExp(), 'var(--s2)', true, -4) + pp(ir.path, 'var(--s1)', false, 4);
      box.innerHTML = s + '</svg>';
      var fh = feats(irExp()), f = feats(ir.path);
      b2.querySelector('#ir-tab').innerHTML = table(['', 'đường', 'cỏ', 'nước'], [
        ['$\\boldsymbol w$ (phần thưởng mỗi ô)'].concat(ir.w.map(function (x) { return fmtNum(x, 1); })),
        ['$\\hat{\\boldsymbol f}$ (chuyên gia)'].concat(fh.map(String)),
        ['$\\boldsymbol f$ (diễn viên)'].concat(f.map(String))]);
      var L = ir.log;
      if (L) katexBlock(b2.querySelector('#ir-calc'), '\\begin{aligned}&\\text{vòng } ' + ir.it + ':\\ R(\\hat\\tau) = \\boldsymbol w^{\\mathrm T}\\hat{\\boldsymbol f} = ' + texRaw(L.R0[0], 1) + ',\\quad R(\\tau) = ' + texRaw(L.R0[1], 1) + (L.same ? '\\quad(\\text{bằng nhau})' : '') +
        '\\\\&\\boldsymbol w \\leftarrow ' + vec(L.w0, 1) + ' + 0{,}1\\,(' + vec(L.fh, 0) + ' - ' + vec(L.f, 0) + ') = ' + vec(ir.w, 1) +
        '\\\\&\\text{sau cập nhật: } R(\\hat\\tau) = ' + texRaw(L.R1[0], 1) + ',\\ R(\\tau_{\\text{cũ}}) = ' + texRaw(L.R1[1], 1) + '\\ \\Rightarrow\\ \\text{diễn viên tìm quỹ đạo mới}\\end{aligned}');
      else b2.querySelector('#ir-calc').innerHTML = '<span class="rxs">Lúc đầu $\\boldsymbol w = \\boldsymbol 0$: mọi quỹ đạo đều cho $R = 0$, diễn viên chọn bừa một đường. Bấm “Vòng tiếp”.</span>';
      var match = f.join() === fh.join();
      b2.querySelector('#ir-ins').innerHTML = match ? (ir.it && ir.learned ? 'Sau ' + ir.it + ' vòng, diễn viên đi qua đúng số ô mỗi loại như chuyên gia: $\\boldsymbol f = \\hat{\\boldsymbol f}$, nên <b>không hàm phần thưởng tuyến tính nào phân biệt được hai bên</b> nữa và thuật toán dừng (tab Chứng minh). Phần thưởng học được ' + (segVal(b2.querySelector('#ir-s')) === 'road' ? 'đánh giá đường cao nhất' : 'đánh giá cỏ cao hơn đường') + ' chỉ từ <b>một</b> minh họa. Đổi phong cách chuyên gia để thấy cùng thuật toán học ra phần thưởng (và cách lái) khác hẳn, như các hàng của hình 11.9. Lưu ý: $\\boldsymbol w$ học được không phải duy nhất; nó chỉ cần làm hành vi chuyên gia trở thành tối ưu.' : 'Diễn viên tình cờ đã đi giống chuyên gia; bấm “Vòng tiếp” cũng không đổi gì.') :
        (ir.it ? 'Mỗi vòng, $\\boldsymbol w$ tăng ở loại ô chuyên gia đi nhiều hơn diễn viên và giảm ở loại ô diễn viên đi nhiều hơn: “vẽ bia” quanh mũi tên của chuyên gia. Diễn viên vừa đạt điểm cao thì phần thưởng lại đổi (diễn viên “tức giận”).' : 'Chưa học gì. Bấm “Vòng tiếp”.');
      ctx.typeset(b2.querySelector('#ir-tab')); ctx.typeset(b2.querySelector('#ir-ins')); ctx.typeset(b2.querySelector('#ir-calc'));
    }
    seg(b2.querySelector('#ir-s'), irReset);
    b2.querySelector('#ir-one').onclick = function () { irStep(); irDraw(); };
    b2.querySelector('#ir-reset').onclick = irReset;
    irReset();

    // ============ 3. GAN một chiều ============
    var b3 = h('<section class="blk">' +
      '<h2>3. IRL là GAN: bộ phân biệt tiến về $\\tfrac12$ (mục 11.2, hình 11.8)</h2>' +
      '<p class="lead">“Minh họa chuyên gia” là các số lấy từ $\\mathcal N(2;\\ 0{,}5^2)$. <b>Bộ sinh</b> (diễn viên) đưa ra $x = \\mu + \\sigma z$, $z \\sim \\mathcal N(0, 1)$, bắt đầu với $\\mu = -2$, $\\sigma = 1{,}5$. <b>Bộ phân biệt</b> (hàm phần thưởng) $D(x) = \\mathrm{sigmoid}(w_0 + w_1x + w_2x^2/4)$ chấm điểm “giống chuyên gia”. Mỗi vòng: cập nhật $D$ (chấm chuyên gia cao, bộ sinh thấp), rồi cập nhật bộ sinh để tăng $\\log D(x)$. Lô 64.</p>' +
      '<div class="ctrl"><span class="rxs">Bộ phân biệt</span><div class="seg" id="gn-d"><button type="button" data-v="strong" aria-pressed="true">Học nhanh (5 bước, bước 0,5)</button><button type="button" data-v="weak" aria-pressed="false">Học chậm (1 bước, bước 0,05)</button></div>' +
      '<button type="button" class="btn pri" id="gn-run">+300 vòng</button><button type="button" class="btn" id="gn-reset">Đặt lại</button></div>' +
      '<div class="legend"><span class="li"><span class="sw" style="background:var(--s2)"></span>phân phối chuyên gia</span><span class="li"><span class="sw" style="background:var(--s1)"></span>phân phối bộ sinh</span><span class="li"><span class="sw" style="background:' + C3 + '"></span>$D(x)$</span></div>' +
      '<div class="chart" id="gn-plot"></div><div class="stat3" id="gn-stat"></div><div class="insight" id="gn-ins"></div></section>');
    root.appendChild(b3);
    var gn;
    function sigm(x) { return 1 / (1 + Math.exp(-x)); }
    function gnReset() { gn = { r: seeded(21), mu: -2, ls: Math.log(1.5), w: [0, 0, 0], it: 0 }; gnDraw(); }
    function gnIter() {
      var strong = segVal(b3.querySelector('#gn-d')) === 'strong', KD = strong ? 5 : 1, lrD = strong ? 0.5 : 0.05, B = 64, r = gn.r;
      for (var kd = 0; kd < KD; kd++) {
        var g = [0, 0, 0];
        for (var b = 0; b < B; b++) { var xr = 2 + 0.5 * gauss(r), xf = gn.mu + Math.exp(gn.ls) * gauss(r); [[xr, 1], [xf, 0]].forEach(function (p) { var f = [1, p[0], p[0] * p[0] / 4], d = sigm(gn.w[0] + gn.w[1] * f[1] + gn.w[2] * f[2]); for (var k = 0; k < 3; k++) g[k] += (p[1] - d) * f[k] / B; }); }
        for (var k2 = 0; k2 < 3; k2++) gn.w[k2] += lrD * g[k2];
      }
      var gm = 0, gs = 0;
      for (var b2i = 0; b2i < B; b2i++) { var z = gauss(r), sg = Math.exp(gn.ls), x = gn.mu + sg * z, d2 = sigm(gn.w[0] + gn.w[1] * x + gn.w[2] * x * x / 4), dx = (1 - d2) * (gn.w[1] + gn.w[2] * x / 2); gm += dx / B; gs += dx * z * sg / B; }
      gn.mu += 0.02 * gm; gn.ls += 0.02 * gs; gn.it++;
    }
    function gnDraw() {
      var box = b3.querySelector('#gn-plot'), W = Math.max(300, box.clientWidth), H = 200, m = { l: 30, r: 10, t: 10, b: 24 }, iw = W - m.l - m.r, ih = H - m.t - m.b;
      var x0 = -6, x1 = 6, X = function (v) { return m.l + (v - x0) / (x1 - x0) * iw; }, Yd = function (v) { return m.t + ih - Math.min(v, 1) * ih; };
      var sg = Math.exp(gn.ls), pdf = function (x, mu, s) { return Math.exp(-0.5 * Math.pow((x - mu) / s, 2)) / (s * Math.sqrt(2 * Math.PI)); }, mx = Math.max(pdf(2, 2, 0.5), pdf(gn.mu, gn.mu, sg));
      var dE = '', dG = '', dD = '';
      for (var i = 0; i <= 240; i++) { var x = x0 + (x1 - x0) * i / 240; dE += (i ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Yd(pdf(x, 2, 0.5) / mx).toFixed(1); dG += (i ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Yd(pdf(x, gn.mu, sg) / mx).toFixed(1); dD += (i ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Yd(sigm(gn.w[0] + gn.w[1] * x + gn.w[2] * x * x / 4)).toFixed(1); }
      var s = '<svg class="plot" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Phân phối chuyên gia, bộ sinh và D(x)">';
      s += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + Yd(0.5) + '" y2="' + Yd(0.5) + '" stroke="var(--muted)" stroke-dasharray="4 4"/><text x="' + (m.l - 4) + '" y="' + (Yd(0.5) + 4) + '" text-anchor="end">½</text><text x="' + (m.l - 4) + '" y="' + (Yd(1) + 8) + '" text-anchor="end">1</text>';
      s += '<path d="' + dE + '" fill="none" stroke="var(--s2)" stroke-width="2"/><path d="' + dG + '" fill="none" stroke="var(--s1)" stroke-width="2" stroke-dasharray="6 4"/><path d="' + dD + '" fill="none" stroke="' + C3 + '" stroke-width="2"/>';
      [-6, -4, -2, 0, 2, 4, 6].forEach(function (v) { s += '<text x="' + X(v) + '" y="' + (H - 6) + '" text-anchor="middle">' + v + '</text>'; });
      box.innerHTML = s + '</svg>';
      var r = seeded(77), dm = 0; for (var k = 0; k < 400; k++) { var xx = gn.mu + sg * gauss(r); dm += sigm(gn.w[0] + gn.w[1] * xx + gn.w[2] * xx * xx / 4) / 400; }
      b3.querySelector('#gn-stat').innerHTML = '<div>Vòng<b>' + gn.it + '</b></div><div>$\\mu$ (đích 2)<b>' + fmtNum(gn.mu, 2) + '</b></div><div>$\\sigma$ (đích 0,5)<b>' + fmtNum(sg, 2) + '</b></div><div>TB $D(x)$ trên mẫu bộ sinh<b>' + fmtNum(dm, 2) + '</b></div>';
      ctx.typeset(b3.querySelector('#gn-stat'));
      var strong = segVal(b3.querySelector('#gn-d')) === 'strong';
      b3.querySelector('#gn-ins').innerHTML = gn.it < 300 ? 'Lúc đầu $D$ dễ dàng chấm chuyên gia cao, bộ sinh thấp. Bộ sinh đi theo hướng làm $D$ tăng, tức về phía chuyên gia. Bấm “+300 vòng”.' :
        (Math.abs(gn.mu - 2) < 0.15 && Math.abs(sg - 0.5) < 0.1 ? 'Bộ sinh đã khớp phân phối chuyên gia, $D(x)$ gần như phẳng ở $\\tfrac12$: “chuyên gia và diễn viên đạt điểm như nhau”, đúng điểm dừng của IRL và của GAN (tab Chứng minh).' :
          strong ? 'Đang tiến gần; chạy thêm vài lần.' : 'Với bộ phân biệt học chậm, bộ sinh khớp được <b>trung bình</b> nhưng $\\sigma$ = ' + fmtNum(sg, 2) + ' khác 0,5: bộ phân biệt chưa kịp phát hiện độ rộng sai thì đã gần phẳng. Đây là một trong những lý do mục 11.2 nói IRL/GAN “chưa chắc hội tụ”: phụ thuộc nhiều vào cách huấn luyện hai bên.');
      ctx.typeset(b3.querySelector('#gn-ins'));
    }
    b3.querySelector('#gn-run').onclick = function () { for (var i = 0; i < 300; i++) gnIter(); gnDraw(); };
    b3.querySelector('#gn-reset').onclick = gnReset;
    seg(b3.querySelector('#gn-d'), gnReset);
    gnReset(); onResize(gnDraw);
    ctx.typeset(root);
  }

  // ======================================================================
  // TAB "Sơ đồ"
  // ======================================================================
  function renderMap(root, ctx) {
    root.innerHTML = '';
    root.classList.add('rx');
    var m1 = h('<section class="blk"><h2>Các cách học bắt chước</h2>' + table(['Cách', 'Học gì', 'Dữ liệu', 'Điểm yếu'], [
      ['Nhân bản hành vi (11.1)', '$\\pi(a \\mid s)$ bằng học có giám sát', 'cặp $(s, a)$ của chuyên gia', 'trạng thái chưa thấy; học cả thói quen thừa; sai số tích lũy cỡ $\\varepsilon T^2$'],
      ['DAgger (11.1)', 'như trên', 'trạng thái <b>diễn viên</b> gặp + nhãn của chuyên gia', 'cần chuyên gia luôn sẵn sàng gán nhãn (“hy sinh một chuyên gia”)'],
      ['Học tăng cường ngược (11.2)', 'hàm phần thưởng $R$, rồi diễn viên', 'vài quỹ đạo chuyên gia + tương tác với môi trường', 'như GAN: chưa chắc hội tụ'],
      ['Ngôi thứ ba (11.3)', 'đặc trưng không phân biệt được góc nhìn', 'chuyên gia quay từ góc khác', 'cần huấn luyện đối kháng miền']]) + '</section>');
    root.appendChild(m1);
    var m2 = h('<section class="blk"><h2>Ba lĩnh vực, một cấu trúc (hình 11.8, mục 11.4)</h2>' + table(['Học tăng cường ngược', 'GAN', 'Sinh câu, chatbot'], [
      ['minh họa chuyên gia $\\hat\\tau$', 'ảnh thật', 'câu, hội thoại của con người'],
      ['diễn viên', 'bộ sinh', 'mô hình sinh câu'],
      ['quỹ đạo của diễn viên $\\tau$', 'ảnh bộ sinh vẽ', 'câu máy viết'],
      ['hàm phần thưởng $R$', 'bộ phân biệt $D$', 'bộ phân biệt của GAN chuỗi'],
      ['$R(\\hat\\tau)$ cao, $R(\\tau)$ thấp', '$D$(thật) cao, $D$(giả) thấp', 'câu người cao, câu máy thấp'],
      ['kết thúc: hai bên điểm như nhau', '$D = \\tfrac12$', 'không phân biệt được câu người và câu máy']]) +
      '<p class="rxs" style="margin:10px 0 0">Còn <b>nhân bản hành vi</b> tương ứng với <b>hợp lý cực đại</b> (dự đoán chữ tiếp theo) trong sinh câu.</p></section>');
    root.appendChild(m2);
    var m3 = h('<section class="blk"><h2>Vòng lặp học tăng cường ngược (hình 11.7)</h2><div class="flow">' +
      '<div class="fb"><div class="fx">Chuyên gia $\\hat\\theta$ chơi $N$ ván: $\\hat\\tau_1, \\ldots, \\hat\\tau_N$</div><div class="fy">Chỉ làm một lần.</div></div><div class="fa">↓</div>' +
      '<div class="fb"><div class="fx">Diễn viên $\\theta$ chơi $N$ ván: $\\tau_1, \\ldots, \\tau_N$</div></div><div class="fa">↓</div>' +
      '<div class="fb"><div class="fx">Cập nhật hàm phần thưởng: $R(\\hat\\tau_n)$ tăng, $R(\\tau_n)$ giảm</div><div class="fy">“Bắn tên trước, vẽ bia sau”: chuyên gia luôn giỏi nhất.</div></div><div class="fa">↓</div>' +
      '<div class="fb"><div class="fx">Học tăng cường thường: diễn viên mới tối đa hóa $R$ mới</div><div class="fy">Quay lại bước 2.</div></div><div class="fa">↓</div>' +
      '<div class="fb eq"><div class="fx">Dừng khi $R$ không còn phân biệt được chuyên gia và diễn viên</div></div></div></section>');
    root.appendChild(m3);
    var m4 = h('<section class="blk"><h2>Học bắt chước ngôi thứ ba (hình 11.10–11.11)</h2><div class="flow">' +
      '<div class="fb"><div class="fx">Ảnh ngôi thứ ba (nhìn người khác) và ảnh ngôi thứ nhất (tự làm) $\\to$ bộ trích xuất đặc trưng</div></div><div class="fa">↓</div>' +
      '<div class="fb"><div class="fx">Bộ phân loại miền cố đoán: đặc trưng này đến từ góc nhìn nào?</div><div class="fy">Bộ trích xuất đặc trưng được huấn luyện để <b>lừa</b> bộ phân loại miền (huấn luyện đối kháng miền, cũng là một kiểu GAN).</div></div><div class="fa">↓</div>' +
      '<div class="fb eq"><div class="fx">Đặc trưng chỉ còn “thứ quan trọng nhất”, không phụ thuộc góc nhìn</div><div class="fy">Kinh nghiệm nhìn người khác đánh golf dùng được khi tự đánh golf.</div></div></div></section>');
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
