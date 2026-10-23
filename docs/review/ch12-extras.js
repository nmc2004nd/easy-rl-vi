/* Thí nghiệm tương tác và sơ đồ trực quan cho chương 12 (DDPG và TD3).
 * Trang index.html tải file này khi ch12.json có "extras": "ch12-extras.js".
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
  var css12 = String.raw`
  .rx svg.plot { display: block; width: 100%; height: auto; overflow: visible; }
  .rx svg.plot text { fill: var(--muted); font-size: 11px; font-family: inherit; }
  .rx svg.plot .lbl { fill: var(--text); font-weight: 600; }
  .rx .stat3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; margin-top: 10px; }
  .rx .stat3 > div { background: var(--surface-2); border-radius: 10px; padding: 8px 10px; font-size: .86rem; }
  .rx .stat3 b { display: block; font-size: 1.05rem; font-variant-numeric: tabular-nums; }
  .rx .insight, .rx .lead, .rx .tscroll { position: relative; }
  .rx .hm { max-width: 460px; margin: 6px auto 0; }`;
  var st12 = document.createElement('style'); st12.textContent = css12; document.head.appendChild(st12);
  var C3 = 'var(--accent-text)';
  function gauss(r) { var u = r() || 1e-12, v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function table(head, rows) { return '<div class="tscroll"><table class="cmp"' + (head.length > 4 ? ' style="min-width:620px"' : '') + '><thead><tr>' + head.map(function (x) { return '<th>' + x + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.map(function (r) { return '<tr>' + r.map(function (x) { return '<td>' + x + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>'; }
  function mean(a) { return a.reduce(function (x, y) { return x + y; }, 0) / a.length; }
  function sd(a) { var m = mean(a); return Math.sqrt(a.reduce(function (x, y) { return x + (y - m) * (y - m); }, 0) / a.length); }
  // vẽ nhiều đường trên cùng trục x tùy ý
  function curves(box, xs, series, opt) {
    var W = Math.max(300, box.clientWidth), H = opt.h || 190, m = { l: 36, r: 10, t: 10, b: 26 }, iw = W - m.l - m.r, ih = H - m.t - m.b;
    var x0 = xs[0], x1 = xs[xs.length - 1], X = function (v) { return m.l + (v - x0) / (x1 - x0) * iw; }, Y = function (v) { v = Math.max(opt.lo, Math.min(opt.hi, v)); return m.t + ih - (v - opt.lo) / (opt.hi - opt.lo) * ih; };
    var s = '<svg class="plot" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (opt.aria || '') + '"><g class="grid">';
    opt.yt.forEach(function (v) { s += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + Y(v) + '" y2="' + Y(v) + '"/>'; });
    s += '</g>';
    opt.yt.forEach(function (v) { s += '<text x="' + (m.l - 5) + '" y="' + (Y(v) + 4) + '" text-anchor="end">' + fmtNum(v, opt.yd || 0) + '</text>'; });
    opt.xt.forEach(function (v) { s += '<text x="' + X(v) + '" y="' + (H - 8) + '" text-anchor="middle">' + fmtNum(v, opt.xd || 0) + '</text>'; });
    series.forEach(function (se) { s += '<path d="' + se.v.map(function (v, i) { return (i ? 'L' : 'M') + X(xs[i]).toFixed(1) + ' ' + Y(v).toFixed(1); }).join('') + '" fill="none" stroke="' + se.c + '" stroke-width="' + (se.w || 2) + '"' + (se.dash ? ' stroke-dasharray="' + se.dash + '"' : '') + ' stroke-opacity="' + (se.op || 1) + '"/>'; });
    (opt.marks || []).forEach(function (mk) { s += '<circle cx="' + X(mk.x) + '" cy="' + Y(mk.y) + '" r="' + (mk.r || 5) + '" fill="' + mk.c + '" stroke="var(--surface)" stroke-width="2"/>'; if (mk.t) s += '<text class="lbl" x="' + (X(mk.x) + 7) + '" y="' + (Y(mk.y) - 7) + '">' + mk.t + '</text>'; });
    if (opt.vline != null) s += '<line x1="' + X(opt.vline) + '" x2="' + X(opt.vline) + '" y1="' + m.t + '" y2="' + (m.t + ih) + '" stroke="var(--muted)" stroke-dasharray="4 4"/>';
    box.innerHTML = s + '</svg>';
  }

  function renderLab(root, ctx) {
    root.innerHTML = '';
    root.classList.add('rx');

    // ============ 1. Đầu ra tanh ============
    var b1 = h('<section class="blk">' +
      '<h2>1. Đầu ra hành động liên tục: tanh rồi co giãn (mục 12.1, hình 12.3)</h2>' +
      '<p class="lead">Lớp cuối của mạng chính sách đưa ra số thực $z$; $a = a_{\\max}\\tanh z$. Ví dụ của sách: $z = 2{,}8$, phạm vi $[-2, 2]$.</p>' +
      '<div class="ctrl"><label for="th-z">$z$</label><input id="th-z" type="range" min="-5" max="5" step="0.1" value="2.8"><span class="val" id="th-z-v"></span>' +
      '<label for="th-a">$a_{\\max}$</label><input id="th-a" type="range" min="0.5" max="3" step="0.5" value="2"><span class="val" id="th-a-v"></span></div>' +
      '<div class="legend"><span class="li"><span class="sw" style="background:var(--s1)"></span>$a = a_{\\max}\\tanh z$</span><span class="li"><span class="sw" style="background:var(--s2)"></span>$\\partial a/\\partial z = a_{\\max}(1 - \\tanh^2 z)$</span></div>' +
      '<div class="chart" id="th-plot"></div><div class="calc" id="th-calc"></div><div class="insight" id="th-ins"></div></section>');
    root.appendChild(b1);
    function thDraw() {
      var z = +b1.querySelector('#th-z').value, am = +b1.querySelector('#th-a').value, t = Math.tanh(z), d = am * (1 - t * t);
      b1.querySelector('#th-z-v').textContent = fmtNum(z, 1); b1.querySelector('#th-a-v').textContent = fmtNum(am, 1);
      var xs = []; for (var x = -5; x <= 5.0001; x += 0.05) xs.push(x);
      curves(b1.querySelector('#th-plot'), xs, [{ v: xs.map(function (x2) { return am * Math.tanh(x2); }), c: 'var(--s1)' }, { v: xs.map(function (x2) { var tt = Math.tanh(x2); return am * (1 - tt * tt); }), c: 'var(--s2)' }],
        { lo: -3, hi: 3, yt: [-3, -2, -1, 0, 1, 2, 3], xt: [-5, -2.5, 0, 2.5, 5], xd: 1, marks: [{ x: z, y: am * t, c: 'var(--s1)' }, { x: z, y: d, c: 'var(--s2)' }], vline: z, aria: 'Hàm tanh và đạo hàm' });
      katexBlock(b1.querySelector('#th-calc'), '\\begin{aligned}&\\tanh(' + texRaw(z, 1) + ') = ' + texRaw(t, 4) + ',\\quad a = ' + texRaw(am, 1) + '\\cdot' + tex(t, 4) + ' = ' + texRaw(am * t, 3) + '\\\\&\\frac{\\partial a}{\\partial z} = ' + texRaw(am, 1) + '\\,(1 - ' + texRaw(t * t, 4) + ') = ' + texRaw(d, 4) + '\\end{aligned}');
      b1.querySelector('#th-ins').innerHTML = Math.abs(z) > 2 ? 'Hành động đã sát biên ($' + texRaw(am * t, 2) + '$ trong $[\\pm' + texRaw(am, 1) + ']$) và <b>bão hòa</b>: đạo hàm chỉ còn ' + fmtNum(d, 3) + ', gradient từ nhà phê bình qua tầng tanh bị nhân với số rất nhỏ, diễn viên gần như ngừng học. Vì vậy thường giữ $z$ ở vùng giữa (khởi tạo nhỏ, có khi phạt $z^2$).' : 'Ở vùng giữa, tanh gần như tuyến tính và đạo hàm lớn: diễn viên đổi hành động dễ dàng theo gradient của nhà phê bình. Kéo $z$ ra xa (như 2,8 của sách) để thấy bão hòa.';
      ctx.typeset(b1.querySelector('#th-ins'));
    }
    ['#th-z', '#th-a'].forEach(function (id) { b1.querySelector(id).oninput = thDraw; });
    thDraw(); onResize(thDraw);

    // ============ 2. Diễn viên leo theo nhà phê bình ============
    var b2 = h('<section class="blk">' +
      '<h2>2. Diễn viên chiều theo giám khảo: $\\nabla_\\theta Q\\big(s, \\mu_\\theta(s)\\big)$ (mục 12.2, hình 12.6–12.7)</h2>' +
      '<p class="lead">Nhà phê bình đã học xong (cố định): $Q(s, a) = -\\big(a - a^*(s)\\big)^2$ với $a^*(s) = 1{,}5\\sin(\\pi s)$, $s \\in [-1, 1]$, $a \\in [-2, 2]$; nền càng sáng thì $Q$ càng lớn. Diễn viên $\\mu_\\theta(s) = 2\\tanh\\big(\\theta_0 + \\theta_1 s + \\theta_2 s^2 + \\theta_3 s^3\\big)$. Mỗi bước: lấy 32 trạng thái, đi lên theo $\\nabla_a Q\\cdot\\nabla_\\theta\\mu_\\theta$ (bước 0,05). Mũi tên là $\\nabla_a Q$ tại hành động của diễn viên: giám khảo chỉ hướng nên đổi.</p>' +
      '<div class="ctrl"><span class="rxs">Khởi tạo</span><div class="seg" id="ac-i"><button type="button" data-v="small" aria-pressed="true">$\\theta$ nhỏ</button><button type="button" data-v="sat" aria-pressed="false">$\\theta_0 = 4$ (bão hòa)</button></div>' +
      '<span class="rxs">Tối ưu</span><div class="seg" id="ac-o"><button type="button" data-v="adam" aria-pressed="true">Adam</button><button type="button" data-v="sgd" aria-pressed="false">SGD thường</button></div>' +
      '<button type="button" class="btn pri" id="ac-1">+1 bước</button><button type="button" class="btn" id="ac-50">+50 bước</button><button type="button" class="btn" id="ac-r">Đặt lại</button></div>' +
      '<div class="legend"><span class="li"><span class="sw" style="background:var(--s1)"></span>diễn viên $\\mu_\\theta(s)$</span><span class="li"><span class="sw" style="background:var(--s2)"></span>tốt nhất $a^*(s) = \\arg\\max_a Q$</span><span class="li"><span class="sw" style="background:var(--text)"></span>$\\nabla_a Q$</span></div>' +
      '<div class="hm" id="ac-plot"></div><div class="stat3" id="ac-stat"></div><div class="calc" id="ac-calc"></div><div class="insight" id="ac-ins"></div></section>');
    root.appendChild(b2);
    function astar(s) { return 1.5 * Math.sin(Math.PI * s); }
    var ac;
    function acReset() { var sat = segVal(b2.querySelector('#ac-i')) === 'sat'; ac = { th: [sat ? 4 : 0.1, 0, 0, 0], m: [0, 0, 0, 0], v: [0, 0, 0, 0], t: 0, it: 0, r: seeded(31), hist: [] }; ac.hist.push(acGap()); acDraw(); }
    function acMu(s) { var z = ac.th[0] + ac.th[1] * s + ac.th[2] * s * s + ac.th[3] * s * s * s; return { z: z, a: 2 * Math.tanh(z) }; }
    function acGap() { var g = 0; for (var i = 0; i <= 40; i++) { var s = -1 + i / 20, a = acMu(s).a; g += (a - astar(s)) * (a - astar(s)) / 41; } return g; }
    function acStep() {
      var g = [0, 0, 0, 0], ex = null;
      for (var k = 0; k < 32; k++) {
        var s = -1 + 2 * ac.r(), mu = acMu(s), dQ = -2 * (mu.a - astar(s)), t = Math.tanh(mu.z), da = 2 * (1 - t * t), ps = [1, s, s * s, s * s * s];
        for (var j = 0; j < 4; j++) g[j] += dQ * da * ps[j] / 32;
        if (!ex) ex = { s: s, a: mu.a, z: mu.z, dQ: dQ, da: da };
      }
      ac.t++; var b1_ = 0.9, b2_ = 0.999, sgd = segVal(b2.querySelector('#ac-o')) === 'sgd';
      for (var j2 = 0; j2 < 4; j2++) { if (sgd) { ac.th[j2] += 0.05 * g[j2]; continue; } ac.m[j2] = b1_ * ac.m[j2] + (1 - b1_) * g[j2]; ac.v[j2] = b2_ * ac.v[j2] + (1 - b2_) * g[j2] * g[j2]; ac.th[j2] += 0.05 * (ac.m[j2] / (1 - Math.pow(b1_, ac.t))) / (Math.sqrt(ac.v[j2] / (1 - Math.pow(b2_, ac.t))) + 1e-8); }
      ac.it++; ac.ex = ex; ac.g = g; ac.hist.push(acGap());
    }
    function acDraw() {
      var box = b2.querySelector('#ac-plot'), W = 460, H = 300, m = { l: 34, r: 10, t: 10, b: 28 }, iw = W - m.l - m.r, ih = H - m.t - m.b;
      var X = function (s) { return m.l + (s + 1) / 2 * iw; }, Y = function (a) { return m.t + (2 - a) / 4 * ih; }, NX = 40, NY = 30;
      var sv = '<svg class="plot" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Bản đồ Q(s, a), diễn viên và mũi tên gradient">';
      for (var i = 0; i < NX; i++) for (var j = 0; j < NY; j++) {
        var s = -1 + (i + 0.5) * 2 / NX, a = 2 - (j + 0.5) * 4 / NY, q = -(a - astar(s)) * (a - astar(s)), t = Math.max(0, 1 + q / 9);
        sv += '<rect x="' + (m.l + i * iw / NX).toFixed(1) + '" y="' + (m.t + j * ih / NY).toFixed(1) + '" width="' + (iw / NX + 0.4).toFixed(1) + '" height="' + (ih / NY + 0.4).toFixed(1) + '" fill="' + C3 + '" fill-opacity="' + (0.04 + 0.6 * Math.pow(t, 3)).toFixed(3) + '"/>';
      }
      var p1 = '', p2 = '';
      for (var k = 0; k <= 80; k++) { var s2 = -1 + k / 40; p1 += (k ? 'L' : 'M') + X(s2).toFixed(1) + ' ' + Y(astar(s2)).toFixed(1); p2 += (k ? 'L' : 'M') + X(s2).toFixed(1) + ' ' + Y(acMu(s2).a).toFixed(1); }
      sv += '<path d="' + p1 + '" fill="none" stroke="var(--s2)" stroke-width="2" stroke-dasharray="6 4"/><path d="' + p2 + '" fill="none" stroke="var(--s1)" stroke-width="3"/>';
      for (var k2 = 0; k2 < 9; k2++) {
        var s3 = -0.9 + k2 * 0.225, a3 = acMu(s3).a, gq = -2 * (a3 - astar(s3)), L = Math.max(-60, Math.min(60, gq * 12)), y0 = Y(a3), y1 = y0 - L;
        if (Math.abs(L) > 3) sv += '<line x1="' + X(s3) + '" x2="' + X(s3) + '" y1="' + y0 + '" y2="' + y1 + '" stroke="var(--text)" stroke-width="2"/><path d="M' + (X(s3) - 4) + ' ' + (y1 + (L > 0 ? 6 : -6)) + 'L' + X(s3) + ' ' + y1 + 'L' + (X(s3) + 4) + ' ' + (y1 + (L > 0 ? 6 : -6)) + '" fill="none" stroke="var(--text)" stroke-width="2"/>';
      }
      [-2, -1, 0, 1, 2].forEach(function (a4) { sv += '<text x="' + (m.l - 5) + '" y="' + (Y(a4) + 4) + '" text-anchor="end">' + a4 + '</text>'; });
      [-1, 0, 1].forEach(function (s4) { sv += '<text x="' + X(s4) + '" y="' + (H - 10) + '" text-anchor="middle">' + s4 + '</text>'; });
      sv += '<text x="' + (W - m.r) + '" y="' + (H - 10) + '" text-anchor="end">s</text><text x="4" y="14">a</text>';
      box.innerHTML = sv + '</svg>';
      b2.querySelector('#ac-stat').innerHTML = '<div>Bước<b>' + ac.it + '</b></div><div>TB $(\\mu_\\theta(s) - a^*(s))^2$<b>' + fmtNum(ac.hist[ac.hist.length - 1], 3) + '</b></div><div>$\\theta$<b>' + ac.th.map(function (x) { return fmtNum(x, 2); }).join('; ') + '</b></div>';
      ctx.typeset(b2.querySelector('#ac-stat'));
      var e = ac.ex;
      if (e) katexBlock(b2.querySelector('#ac-calc'), '\\text{một mẫu: } s = ' + texRaw(e.s, 2) + ',\\ a = \\mu_\\theta(s) = ' + texRaw(e.a, 2) + ',\\ \\frac{\\partial Q}{\\partial a} = -2(a - a^*) = ' + texRaw(e.dQ, 2) + ',\\ \\frac{\\partial a}{\\partial z} = ' + texRaw(e.da, 3) + '\\ \\Rightarrow\\ \\frac{\\partial Q}{\\partial z} = ' + texRaw(e.dQ * e.da, 3));
      else b2.querySelector('#ac-calc').innerHTML = '<span class="rxs">Bấm “+1 bước”.</span>';
      var sat = segVal(b2.querySelector('#ac-i')) === 'sat';
      b2.querySelector('#ac-ins').innerHTML = !ac.it ? (sat ? 'Khởi tạo bão hòa: diễn viên đưa ra gần $+2$ ở mọi trạng thái. Mũi tên chỉ xuống rất mạnh, nhưng qua tầng tanh gradient bị nhân với số rất nhỏ.' : 'Mũi tên chỉ hướng giám khảo muốn hành động đổi. Diễn viên không cần biết $a^*(s)$, cũng không cần thử nhiều hành động để tìm $\\arg\\max$ như DQN: chỉ đi theo $\\nabla_a Q$.') :
        'Sau ' + ac.it + ' bước, sai lệch bình phương trung bình so với hành động tốt nhất là ' + fmtNum(ac.hist[ac.hist.length - 1], 3) + ' (ban đầu ' + fmtNum(ac.hist[0], 3) + '). ' + (sat ? (segVal(b2.querySelector('#ac-o')) === 'sgd' ? 'Khởi tạo bão hòa với SGD thường: diễn viên <b>kẹt</b>, sai lệch gần như không đổi dù giám khảo “la lớn”, vì gradient bị tầng tanh nhân với khoảng 0,0013 (đúng hiệu ứng ở thí nghiệm 1). Đổi sang Adam để so sánh.' : 'Với khởi tạo bão hòa, những bước đầu gần như không nhúc nhích: đúng hiệu ứng tanh bão hòa ở thí nghiệm 1. Adam chia gradient cho độ lớn trung bình của chính nó nên gradient nhỏ vẫn thành bước đi đáng kể, diễn viên dần thoát ra (chậm hơn hẳn khởi tạo nhỏ). Thử SGD thường để thấy nó kẹt hẳn.') : 'Đường xanh dần ôm theo đường cam: diễn viên học được $\\arg\\max_a Q(s, a)$ cho mọi $s$ (vai trò “bộ giải” của chương 9).');
      ctx.typeset(b2.querySelector('#ac-ins'));
    }
    seg(b2.querySelector('#ac-i'), acReset); seg(b2.querySelector('#ac-o'), acReset);
    b2.querySelector('#ac-1').onclick = function () { acStep(); acDraw(); };
    b2.querySelector('#ac-50').onclick = function () { for (var i = 0; i < 50; i++) acStep(); acDraw(); };
    b2.querySelector('#ac-r').onclick = acReset;
    acReset();

    // ============ 3. Ước lượng quá cao và các mẹo TD3 ============
    var b3 = h('<section class="blk">' +
      '<h2>3. Diễn viên “săn” sai số của nhà phê bình; TD3 sửa (mục 12.3, hình 12.9)</h2>' +
      '<p class="lead">Một trạng thái, hành động $a \\in [-1, 1]$, $Q$ thật $= 1 - (a - 0{,}3)^2$. Mỗi nhà phê bình học được $Q_i = Q + e_i$, với $e_i$ là tổng của 8 “gai” sai số ngẫu nhiên (độ cao $\\mathcal N(0, \\sigma^2)$, độ rộng $w$, vị trí ngẫu nhiên): không chệch ở từng điểm. Diễn viên chọn $a_1 = \\arg\\max_a Q_1(a)$. So sánh giá trị mục tiêu với $Q$ thật tại hành động đó, 2000 lần lấy mẫu.</p>' +
      '<div class="ctrl"><label for="ov-s">$\\sigma$</label><input id="ov-s" type="range" min="0.05" max="0.5" step="0.05" value="0.2"><span class="val" id="ov-s-v"></span>' +
      '<label for="ov-w">$w$</label><input id="ov-w" type="range" min="0.02" max="0.3" step="0.02" value="0.06"><span class="val" id="ov-w-v"></span><button type="button" class="btn" id="ov-new">Lấy mẫu khác</button></div>' +
      '<div class="legend"><span class="li"><span class="sw" style="background:var(--text)"></span>$Q$ thật</span><span class="li"><span class="sw" style="background:var(--s1)"></span>$Q_1$</span><span class="li"><span class="sw" style="background:var(--s2)"></span>$Q_2$</span><span class="li"><span class="sw" style="background:' + C3 + '"></span>$\\min(Q_1, Q_2)$ làm trơn</span></div>' +
      '<div class="chart" id="ov-plot"></div><div class="tscroll" id="ov-tab"></div><div class="insight" id="ov-ins"></div></section>');
    root.appendChild(b3);
    var ovSeed = 1;
    function ovFn(r, sg, w) { var b = []; for (var k = 0; k < 8; k++) b.push([-1.2 + 2.4 * r(), sg * gauss(r)]); return function (a) { var e = 0; b.forEach(function (x) { e += x[1] * Math.exp(-(a - x[0]) * (a - x[0]) / (2 * w * w)); }); return e; }; }
    function qT(a) { return 1 - (a - 0.3) * (a - 0.3); }
    var AS = []; for (var i3 = 0; i3 <= 200; i3++) AS.push(-1 + i3 / 100);
    function ovOne(r, sg, w) {
      var e1 = ovFn(r, sg, w), e2 = ovFn(r, sg, w), best = -1e9, a1 = 0;
      AS.forEach(function (a) { var v = qT(a) + e1(a); if (v > best) { best = v; a1 = a; } });
      var mn = function (a) { return qT(a) + Math.min(e1(a), e2(a)); }, SM = [-0.2, -0.1, 0, 0.1, 0.2], SW = SM.map(function (x) { return Math.exp(-x * x / (2 * 0.01)); }), sw = SW.reduce(function (x, y) { return x + y; }, 0);
      var smooth = 0; SM.forEach(function (d, k) { var aa = Math.max(-1, Math.min(1, a1 + d)); smooth += SW[k] / sw * (mn(aa) - qT(aa)); });
      return { e1: e1, e2: e2, a1: a1, ddpg: e1(a1), dbl: Math.min(e1(a1), e2(a1)), td3: smooth, regret: 1 - qT(a1) };
    }
    function ovDraw() {
      var sg = +b3.querySelector('#ov-s').value, w = +b3.querySelector('#ov-w').value;
      b3.querySelector('#ov-s-v').textContent = fmtNum(sg, 2); b3.querySelector('#ov-w-v').textContent = fmtNum(w, 2);
      var o = ovOne(seeded(ovSeed), sg, w);
      var mnS = AS.map(function (a) { var SM = [-0.2, -0.1, 0, 0.1, 0.2], s = 0, ws = 0; SM.forEach(function (d) { var ww = Math.exp(-d * d / 0.02), aa = Math.max(-1, Math.min(1, a + d)); s += ww * (qT(aa) + Math.min(o.e1(aa), o.e2(aa))); ws += ww; }); return s / ws; });
      curves(b3.querySelector('#ov-plot'), AS, [{ v: AS.map(qT), c: 'var(--text)', w: 2.5 }, { v: AS.map(function (a) { return qT(a) + o.e1(a); }), c: 'var(--s1)' }, { v: AS.map(function (a) { return qT(a) + o.e2(a); }), c: 'var(--s2)', op: 0.7 }, { v: mnS, c: C3, dash: '5 4' }],
        { lo: -1.5, hi: 2, yt: [-1, 0, 1, 2], xt: [-1, -0.5, 0, 0.5, 1], xd: 1, marks: [{ x: o.a1, y: qT(o.a1) + o.e1(o.a1), c: 'var(--s1)', t: 'a₁' }, { x: o.a1, y: qT(o.a1), c: 'var(--text)', r: 4 }], vline: o.a1, aria: 'Q thật, hai nhà phê bình và hành động diễn viên chọn' });
      var r = seeded(5000), A = { ddpg: [], dbl: [], td3: [], regret: [] };
      for (var k = 0; k < 2000; k++) { var q = ovOne(r, sg, w); A.ddpg.push(q.ddpg); A.dbl.push(q.dbl); A.td3.push(q.td3); A.regret.push(q.regret); }
      b3.querySelector('#ov-tab').innerHTML = table(['Giá trị mục tiêu dùng', 'Độ chệch TB so với $Q$ thật tại $a_1$', 'Độ lệch chuẩn'], [
        ['DDPG: $Q_1(a_1)$', '<b>' + fmtNum(mean(A.ddpg), 3) + '</b>', fmtNum(sd(A.ddpg), 3)],
        ['Q kép có cắt: $\\min(Q_1, Q_2)(a_1)$', fmtNum(mean(A.dbl), 3), fmtNum(sd(A.dbl), 3)],
        ['+ làm trơn: TB của $\\min(Q_1, Q_2)$ quanh $a_1$ (nhiễu $\\pm 0{,}2$)', fmtNum(mean(A.td3), 3), fmtNum(sd(A.td3), 3)]]);
      ctx.typeset(b3.querySelector('#ov-tab'));
      b3.querySelector('#ov-ins').innerHTML = 'Mỗi $Q_i$ không chệch tại từng điểm, nhưng diễn viên chọn đúng chỗ $Q_1$ cao nhất, thường là chỗ có gai dương: tại đó $Q_1$ cao hơn thật trung bình <b>' + fmtNum(mean(A.ddpg), 3) + '</b>, và chính hành động đó kém hành động tốt nhất ' + fmtNum(mean(A.regret), 3) + ' về $Q$ thật (diễn viên bị lừa). Lấy $\\min$ với $Q_2$ (sai số độc lập) đưa độ chệch về ' + fmtNum(mean(A.dbl), 3) + ' (âm nhẹ: ước lượng thấp an toàn hơn). Làm trơn thêm san phẳng các gai hẹp' + (w < 0.12 ? ', đặc biệt hiệu quả khi gai hẹp như ở đây' : '; với gai rộng ($w$ lớn) hiệu quả làm trơn giảm, đúng như tab Chứng minh') + '.';
      ctx.typeset(b3.querySelector('#ov-ins'));
    }
    ['#ov-s', '#ov-w'].forEach(function (id) { b3.querySelector(id).addEventListener('change', ovDraw); b3.querySelector(id).oninput = function () { b3.querySelector('#ov-s-v').textContent = fmtNum(+b3.querySelector('#ov-s').value, 2); b3.querySelector('#ov-w-v').textContent = fmtNum(+b3.querySelector('#ov-w').value, 2); }; });
    b3.querySelector('#ov-new').onclick = function () { ovSeed++; ovDraw(); };
    ovDraw(); onResize(ovDraw);

    // ============ 4. Cập nhật mềm ============
    var b4 = h('<section class="blk">' +
      '<h2>4. Mạng mục tiêu: chép cứng (DQN) và cập nhật mềm (DDPG)</h2>' +
      '<p class="lead">Một tham số $w$ của mạng thật thay đổi theo thời gian (trôi dần, có nhiễu). Mạng mục tiêu $\\bar w$: chép cứng mỗi $C$ bước, hoặc cập nhật mềm $\\bar w \\leftarrow \\tau w + (1 - \\tau)\\bar w$ mỗi bước.</p>' +
      '<div class="ctrl"><label for="sf-t">$\\tau$</label><input id="sf-t" type="range" min="0.002" max="0.1" step="0.002" value="0.01"><span class="val" id="sf-t-v"></span>' +
      '<label for="sf-c">$C$</label><input id="sf-c" type="range" min="10" max="300" step="10" value="100"><span class="val" id="sf-c-v"></span></div>' +
      '<div class="legend"><span class="li"><span class="sw" style="background:var(--muted)"></span>$w$ mạng thật</span><span class="li"><span class="sw" style="background:var(--s2)"></span>chép cứng mỗi $C$ bước</span><span class="li"><span class="sw" style="background:var(--s1)"></span>cập nhật mềm</span></div>' +
      '<div class="chart" id="sf-plot"></div><div class="insight" id="sf-ins"></div></section>');
    root.appendChild(b4);
    function sfDraw() {
      var tau = +b4.querySelector('#sf-t').value, C = +b4.querySelector('#sf-c').value; b4.querySelector('#sf-t-v').textContent = fmtNum(tau, 3); b4.querySelector('#sf-c-v').textContent = C;
      var r = seeded(9), T = 600, w = [], hard = [], soft = [], x = 0, hd = 0, sv = 0;
      for (var t = 0; t < T; t++) { x += 0.02 * Math.sin(t / 60) + 0.05 * gauss(r); w.push(x); if (t % C === 0) hd = x; hard.push(hd); sv = tau * x + (1 - tau) * sv; soft.push(sv); }
      var xs = w.map(function (_, i) { return i; }), lo = Math.min.apply(null, w.concat(soft)) - 0.2, hi = Math.max.apply(null, w.concat(soft)) + 0.2;
      curves(b4.querySelector('#sf-plot'), xs, [{ v: w, c: 'var(--muted)', w: 1.2 }, { v: hard, c: 'var(--s2)' }, { v: soft, c: 'var(--s1)' }], { lo: lo, hi: hi, yt: [Math.ceil(lo), Math.round((lo + hi) / 2), Math.floor(hi)], xt: [0, 200, 400, 600], aria: 'Tham số mạng thật và hai kiểu mạng mục tiêu' });
      b4.querySelector('#sf-ins').innerHTML = 'Chép cứng: mục tiêu đứng yên rồi <b>nhảy bậc</b> mỗi ' + C + ' bước. Cập nhật mềm: mục tiêu đi theo <b>mượt</b>, trễ khoảng $1/\\tau \\approx ' + Math.round(1 / tau) + '$ bước (trung bình động mũ, tab Chứng minh). Cả hai đều giữ $Q_{\\text{target}}$ ổn định hơn so với dùng thẳng mạng thật; DDPG chọn kiểu mềm.';
      ctx.typeset(b4.querySelector('#sf-ins'));
    }
    ['#sf-t', '#sf-c'].forEach(function (id) { b4.querySelector(id).oninput = sfDraw; });
    sfDraw(); onResize(sfDraw);

    // ============ 5. Nhiễu OU và nhiễu Gauss ============
    var b5 = h('<section class="blk">' +
      '<h2>5. Nhiễu khám phá: OU hay Gauss? (mục 12.2)</h2>' +
      '<p class="lead">Hành động $= \\mu_\\theta(s) + $ nhiễu. Ở đây diễn viên luôn đưa ra 0 để chỉ nhìn nhiễu. Nhiễu Gauss: mỗi bước độc lập $\\mathcal N(0, \\sigma^2)$. Nhiễu OU (dạng rời rạc): $n_{t+1} = (1 - \\theta_{\\text{OU}})\\,n_t + \\sigma\\sqrt{\\theta_{\\text{OU}}(2 - \\theta_{\\text{OU}})}\\,\\mathcal N(0, 1)$, có “quán tính” nên tương quan theo thời gian; hệ số được chọn để độ lệch chuẩn mỗi bước cũng là $\\sigma$, so sánh cho công bằng. Vị trí xe $x_{t+1} = x_t + 0{,}1\\cdot\\text{hành động}$.</p>' +
      '<div class="ctrl"><label for="ou-t">$\\theta_{\\text{OU}}$</label><input id="ou-t" type="range" min="0.02" max="1" step="0.02" value="0.15"><span class="val" id="ou-t-v"></span><label for="ou-s">$\\sigma$</label><input id="ou-s" type="range" min="0.1" max="1" step="0.1" value="0.3"><span class="val" id="ou-s-v"></span></div>' +
      '<div class="legend"><span class="li"><span class="sw" style="background:var(--s2)"></span>Gauss</span><span class="li"><span class="sw" style="background:var(--s1)"></span>OU</span></div>' +
      '<h3 class="sub">Nhiễu theo thời gian</h3><div class="chart" id="ou-n"></div><h3 class="sub">Vị trí xe theo thời gian</h3><div class="chart" id="ou-x"></div><div class="stat3" id="ou-stat"></div><div class="insight" id="ou-ins"></div></section>');
    root.appendChild(b5);
    function ouDraw() {
      var th = +b5.querySelector('#ou-t').value, sg = +b5.querySelector('#ou-s').value; b5.querySelector('#ou-t-v').textContent = fmtNum(th, 2); b5.querySelector('#ou-s-v').textContent = fmtNum(sg, 1);
      var r = seeded(4), T = 200, nG = [], nO = [], xG = [], xO = [], o = 0, a = 0, b = 0;
      for (var t = 0; t < T; t++) { var g = sg * gauss(r); o = (1 - th) * o + sg * Math.sqrt(th * (2 - th)) * gauss(r); nG.push(g); nO.push(o); a += 0.1 * g; b += 0.1 * o; xG.push(a); xO.push(b); }
      var xs = nG.map(function (_, i) { return i; }), lim = Math.max(1, Math.ceil(Math.max.apply(null, nO.concat(nG).map(Math.abs))));
      curves(b5.querySelector('#ou-n'), xs, [{ v: nG, c: 'var(--s2)', w: 1.2, op: 0.8 }, { v: nO, c: 'var(--s1)' }], { lo: -lim, hi: lim, yt: [-lim, 0, lim], xt: [0, 100, 200], h: 150, aria: 'Nhiễu Gauss và OU' });
      var lx = Math.max(0.5, Math.ceil(2 * Math.max.apply(null, xO.concat(xG).map(Math.abs))) / 2);
      curves(b5.querySelector('#ou-x'), xs, [{ v: xG, c: 'var(--s2)' }, { v: xO, c: 'var(--s1)' }], { lo: -lx, hi: lx, yt: [-lx, 0, lx], yd: 1, xt: [0, 100, 200], h: 150, aria: 'Vị trí xe' });
      // thống kê nhiều lần
      var r2 = seeded(8), eG = [], eO = [];
      for (var k = 0; k < 400; k++) { var o2 = 0, a2 = 0, b2_ = 0; for (var t2 = 0; t2 < T; t2++) { a2 += 0.1 * sg * gauss(r2); o2 = (1 - th) * o2 + sg * Math.sqrt(th * (2 - th)) * gauss(r2); b2_ += 0.1 * o2; } eG.push(Math.abs(a2)); eO.push(Math.abs(b2_)); }
      b5.querySelector('#ou-stat').innerHTML = '<div>Độ lệch chuẩn của nhiễu mỗi bước<b>Gauss ' + fmtNum(sg, 2) + ' · OU ' + fmtNum(sg, 2) + ' (như nhau)</b></div><div>TB khoảng cách xe đi xa sau 200 bước (400 lần)<b>Gauss ' + fmtNum(mean(eG), 2) + ' · OU ' + fmtNum(mean(eO), 2) + '</b></div>';
      b5.querySelector('#ou-ins').innerHTML = 'Nhiễu Gauss đổi dấu liên tục nên các cú đẩy triệt tiêu nhau, xe chỉ rung quanh chỗ cũ. Cùng độ lớn mỗi bước, nhiễu OU giữ cùng một hướng nhiều bước liền nên xe đi xa hơn (gấp khoảng ' + fmtNum(mean(eO) / mean(eG), 1) + ' lần ở đây): khám phá “có quán tính”, hợp với hệ vật lý có quán tính mà DDPG gốc nhắm tới. Nhưng sách lưu ý kết quả gần đây cho thấy nhiễu Gauss đơn giản cũng đủ tốt; và khi <b>kiểm thử thì không thêm nhiễu</b>.';
    }
    ['#ou-t', '#ou-s'].forEach(function (id) { b5.querySelector(id).oninput = ouDraw; });
    ouDraw(); onResize(ouDraw);
    ctx.typeset(root);
  }

  // ======================================================================
  // TAB "Sơ đồ"
  // ======================================================================
  function renderMap(root, ctx) {
    root.innerHTML = '';
    root.classList.add('rx');
    var m1 = h('<section class="blk"><h2>DQN → DDPG → TD3</h2>' + table(['', 'DQN (ch. 6)', 'DDPG (12.2)', 'TD3 (12.3)'], [
      ['Hành động', 'rời rạc', 'liên tục', 'liên tục'],
      ['Chọn hành động', '$\\arg\\max_a Q(s, a)$', 'diễn viên $\\mu_\\theta(s)$ + nhiễu', 'như DDPG'],
      ['Mục tiêu', '$r + \\gamma\\max_{a\'}\\hat Q(s\', a\')$', '$r + \\gamma Q_{\\bar w}(s\', \\mu_{\\bar\\theta}(s\'))$', '$r + \\gamma\\min_i Q_{i,\\text{targ}}(s\', a_{\\text{TD3}})$'],
      ['Số mạng', '2', '4', '6 (2 nhà phê bình + 1 diễn viên, mỗi cái có mạng mục tiêu)'],
      ['Mạng mục tiêu', 'chép cứng mỗi $C$ bước', 'cập nhật mềm $\\tau$', 'cập nhật mềm $\\tau$'],
      ['Cập nhật diễn viên', '—', 'mỗi bước', 'trễ: mỗi 2 bước'],
      ['Dữ liệu', 'bộ đệm, off-policy', 'bộ đệm, off-policy', 'bộ đệm, off-policy']]) + '</section>');
    root.appendChild(m1);
    var m2 = h('<section class="blk"><h2>Bốn mạng của DDPG và luồng dữ liệu (hình 12.8)</h2><div class="flow">' +
      '<div class="fb"><div class="fx">Tương tác: $a = \\mu_\\theta(s) + \\text{nhiễu}$; lưu $(s, a, r, s\')$ vào bộ đệm</div></div><div class="fa">↓</div>' +
      '<div class="fb"><div class="fx">target\\_P: $a\' = \\mu_{\\bar\\theta}(s\')$ $\\ \\to\\ $ target\\_Q: $Q_{\\text{target}} = r + \\gamma Q_{\\bar w}(s\', a\')$</div><div class="fy">Hai mạng mục tiêu chỉ dùng để tính mục tiêu cho ổn định.</div></div><div class="fa">↓</div>' +
      '<div class="fb"><div class="fx">Mạng Q ($w$): giảm $\\big(Q_w(s, a) - Q_{\\text{target}}\\big)^2$</div><div class="fy">Giám khảo học từ phản hồi của khán giả (phần thưởng).</div></div><div class="fa">↓</div>' +
      '<div class="fb"><div class="fx">Mạng chính sách ($\\theta$): giảm $-Q_w\\big(s, \\mu_\\theta(s)\\big)$</div><div class="fy">Diễn viên chỉ chiều theo giám khảo: $\\nabla_\\theta = \\nabla_a Q\\cdot\\nabla_\\theta\\mu$.</div></div><div class="fa">↓</div>' +
      '<div class="fb eq"><div class="fx">$\\bar w \\leftarrow \\tau w + (1 - \\tau)\\bar w$, $\\bar\\theta \\leftarrow \\tau\\theta + (1 - \\tau)\\bar\\theta$</div></div></div></section>');
    root.appendChild(m2);
    var m3 = h('<section class="blk"><h2>Ba mẹo của TD3 sửa gì</h2>' + table(['Mẹo', 'Làm gì', 'Sửa vấn đề nào'], [
      ['Q-learning kép có cắt', 'hai nhà phê bình, mục tiêu lấy $\\min$', 'ước lượng quá cao ở chỗ diễn viên “săn” được'],
      ['Cập nhật chính sách trễ', 'nhà phê bình cập nhật 2 lần thì diễn viên 1 lần', 'diễn viên đi theo giám khảo chưa chấm chuẩn'],
      ['Làm trơn chính sách mục tiêu', 'thêm nhiễu bị cắt vào $a\'$ mục tiêu', 'gai sai số hẹp của $Q$ theo hành động']]) +
      '<p class="rxs" style="margin:10px 0 0">D4PG (câu hỏi phỏng vấn 12-3) đi hướng khác: nhà phê bình phân phối, lợi tức $N$ bước, nhiều diễn viên song song, phát lại ưu tiên.</p></section>');
    root.appendChild(m3);
    ctx.typeset(root);
  }

  // ======================================================================
  // TAB "Mô phỏng": liên kết tới các trang docs/viz
  // ======================================================================
  var VIZ = [
    ['ddpg.html', 'Mục 12.2', 'DDPG trên con lắc', 'Bốn mạng nơ-ron thật; bản đồ giám khảo và diễn viên; phép tính từng lần cập nhật.'],
    ['td3.html', 'Mục 12.3', 'DDPG và TD3: bật/tắt từng mẹo', 'Ước lượng Q so với giá trị thật như hình 12.9; bảng bỏ từng mẹo.']
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
