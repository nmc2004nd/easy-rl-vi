/* Thí nghiệm tương tác và sơ đồ trực quan cho chương 6 (mạng Q sâu).
 * Trang index.html tải file này khi ch6.json có "extras": "ch6-extras.js".
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
  var css6 = String.raw`
  .rx svg.plot { display: block; width: 100%; height: auto; overflow: visible; }
  .rx svg.plot text { fill: var(--muted); font-size: 11px; font-family: inherit; }
  .rx svg.plot .lbl { fill: var(--text); font-weight: 600; }
  .rx .stat3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; margin-top: 10px; }
  .rx .stat3 > div { background: var(--surface-2); border-radius: 10px; padding: 8px 10px; font-size: .86rem; }
  .rx .stat3 b { display: block; font-size: 1.05rem; font-variant-numeric: tabular-nums; }
  .rx .eps8 { display: grid; gap: 6px; margin: 8px 0; }
  .rx .ep { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; font-size: .9rem; }
  .rx .ep .no { width: 3.2em; color: var(--muted); font-variant-numeric: tabular-nums; }
  .rx .st { border-radius: 8px; padding: 2px 9px; font-weight: 700; background: var(--surface-2); }
  .rx .st.a { background: var(--hl-soft, #fbf1dc); }
  .rx .rw { border: 0; border-radius: 8px; padding: 2px 9px; font: inherit; font-weight: 700; cursor: pointer; background: var(--surface-2); color: var(--muted); }
  .rx .rw.one { background: var(--accent-soft); color: var(--accent-text); }
  .rx .ar { color: var(--muted); }
  .rx .buf { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 4px; margin: 8px 0; }
  .rx .slot { aspect-ratio: 1; border-radius: 6px; background: var(--surface-2); display: grid; place-items: center; font-size: .66rem; font-weight: 700; color: #fff; position: relative; }
  .rx .slot.pick { box-shadow: 0 0 0 3px var(--text); }
  .rx .slot.on { box-shadow: 0 0 0 3px var(--s2); }
  .rx .slot.new::after { content: ""; position: absolute; top: -3px; right: -3px; width: 8px; height: 8px; border-radius: 50%; background: var(--s2); }
  @media (max-width: 600px) { .rx .buf { grid-template-columns: repeat(8, minmax(0, 1fr)); } }`;
  var st6 = document.createElement('style'); st6.textContent = css6; document.head.appendChild(st6);
  var C3 = '#1f9d6b', C4 = '#8b5cf6';
  function gauss(r) { var u = r() || 1e-12, v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function hist(box, sets, lo, hi, nb, opt) {
    // sets: [{ vals, color, name }]; vẽ chồng hai histogram trong suốt + vạch đáp án
    var W = Math.max(300, box.clientWidth), H = 150, m = { l: 30, r: 10, t: 8, b: 26 }, iw = W - m.l - m.r, ih = H - m.t - m.b;
    var X = function (v) { return m.l + (v - lo) / (hi - lo) * iw; }, cnts = sets.map(function (s) {
      var c = new Array(nb).fill(0); s.vals.forEach(function (v) { var k = Math.floor((v - lo) / (hi - lo) * nb); k = Math.max(0, Math.min(nb - 1, k)); c[k]++; }); return c;
    }), mx = Math.max.apply(null, cnts.map(function (c) { return Math.max.apply(null, c); }));
    var s = '<svg class="plot" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (opt.aria || '') + '">';
    cnts.forEach(function (c, j) { c.forEach(function (n, k) { var h = n / mx * ih; s += '<rect x="' + (X(lo + k * (hi - lo) / nb) + 0.5).toFixed(1) + '" y="' + (m.t + ih - h).toFixed(1) + '" width="' + (iw / nb - 1).toFixed(1) + '" height="' + h.toFixed(1) + '" fill="' + sets[j].color + '" fill-opacity=".55"/>'; }); });
    if (opt.truth != null) s += '<line x1="' + X(opt.truth) + '" x2="' + X(opt.truth) + '" y1="' + m.t + '" y2="' + (m.t + ih) + '" stroke="var(--text)" stroke-width="2" stroke-dasharray="4 3"/><text class="lbl" x="' + (X(opt.truth) + 4) + '" y="' + (m.t + 10) + '">' + opt.truthLabel + '</text>';
    var step = (hi - lo) / 6; for (var t = 0; t <= 6; t++) s += '<text x="' + X(lo + t * step) + '" y="' + (H - 8) + '" text-anchor="middle">' + fmtNum(lo + t * step, 0) + '</text>';
    box.innerHTML = s + '</svg>';
  }

  function renderLab(root, ctx) {
    root.innerHTML = '';
    root.classList.add('rx');

    // ============ 1. Hình 6.5 ============
    var b1 = h('<section class="blk">' +
      '<h2>1. Monte Carlo và sai phân thời gian trên cùng dữ liệu (hình 6.5)</h2>' +
      '<p class="lead">Tám tập quan sát được. Bấm vào số phần thưởng để đổi giữa 0 và 1 và xem hai ước lượng thay đổi thế nào.</p>' +
      '<div class="eps8" id="e8"></div><div class="calc" id="e8-calc"></div>' +
      '<h3 class="sub">Đáp án nào đúng? Sinh thêm dữ liệu theo một trong hai “thế giới”</h3>' +
      '<div class="ctrl"><div class="seg" id="e8-w"><button type="button" data-v="sig" aria-pressed="true">$s_a$ là dấu hiệu: sau $s_a$, $s_b$ luôn được 0</button><button type="button" data-v="ind" aria-pressed="false">$s_a$ không ảnh hưởng: $s_b$ được 1 với xác suất $\\tfrac34$</button></div>' +
      '<button type="button" class="btn" id="e8-more">+20 tập bắt đầu ở $s_a$</button><button type="button" class="btn" id="e8-reset">Về 8 tập ban đầu</button></div>' +
      '<div class="insight" id="e8-ins"></div></section>');
    root.appendChild(b1);
    var E8;
    function e8Reset() { E8 = [{ a: true, r: 0 }]; for (var i = 0; i < 6; i++) E8.push({ a: false, r: 1 }); E8.push({ a: false, r: 0 }); E8.extra = 0; e8Draw(); }
    function e8Draw() {
      var box = b1.querySelector('#e8');
      var shown = E8.slice(0, 8);
      box.innerHTML = shown.map(function (e, i) {
        return '<div class="ep"><span class="no">tập ' + (i + 1) + '</span>' + (e.a ? '<span class="st a">s<sub>a</sub></span><span class="ar">→ r = 0 →</span>' : '') +
          '<span class="st">s<sub>b</sub></span><span class="ar">→ r =</span><button type="button" class="rw' + (e.r ? ' one' : '') + '" data-i="' + i + '">' + e.r + '</button><span class="ar">→ kết thúc</span></div>';
      }).join('') + (E8.length > 8 ? '<div class="rxs">… và ' + (E8.length - 8) + ' tập thêm (bắt đầu ở $s_a$)</div>' : '');
      ctx.typeset(box);
      var nb = E8.length, sb = E8.reduce(function (a, e) { return a + e.r; }, 0), A = E8.filter(function (e) { return e.a; }), sa = A.reduce(function (a, e) { return a + e.r; }, 0);
      var vb = sb / nb, mc = sa / A.length;
      katexBlock(b1.querySelector('#e8-calc'), '\\begin{aligned}&V(s_b) = \\frac{' + sb + '}{' + nb + '} = ' + texRaw(vb, 3) + '\\qquad(\\text{mọi tập đều qua } s_b)\\\\' +
        '&\\text{MC: } V(s_a) = \\frac{\\text{tổng lợi tức sau } s_a}{\\text{số lần gặp } s_a} = \\frac{' + sa + '}{' + A.length + '} = ' + texRaw(mc, 3) + '\\\\' +
        '&\\text{TD: } V(s_a) = r + V(s_b) = 0 + ' + texRaw(vb, 3) + ' = ' + texRaw(vb, 3) + '\\end{aligned}');
      var ins = b1.querySelector('#e8-ins');
      if (!E8.extra) ins.innerHTML = 'Với 8 tập của sách: MC cho $V(s_a) = 0$ (chỉ có một lần gặp $s_a$, sau đó được 0), TD cho $\\tfrac34$ (tin rằng $s_b$ là $s_b$, bất kể đến từ đâu). Hai cách dựa trên hai giả định khác nhau. Sinh thêm dữ liệu để xem cách nào đúng trong mỗi “thế giới”.';
      else {
        var w = segVal(b1.querySelector('#e8-w'));
        ins.innerHTML = w === 'sig' ? 'Trong thế giới “$s_a$ là dấu hiệu”, giá trị thật của $s_a$ là $0$. MC vẫn cho đúng $' + texRaw(mc, 2) + '$, còn TD cho $' + texRaw(vb, 2) + '$: TD <b>sai</b> vì giả định Markov (giá trị của $s_b$ không phụ thuộc quá khứ) không còn đúng.'
          : 'Trong thế giới “$s_a$ không ảnh hưởng”, giá trị thật của $s_a$ là $\\tfrac34$. Cả hai dần tới đó, nhưng TD đã đúng ngay từ đầu nhờ dùng chung thông tin của <b>mọi</b> lần gặp $s_b$; MC chỉ dùng các tập đi qua $s_a$ nên dao động nhiều hơn (hiện $' + texRaw(mc, 2) + '$).';
      }
      ctx.typeset(ins);
    }
    b1.querySelector('#e8').addEventListener('click', function (e) { var b = e.target.closest('.rw'); if (!b) return; var e0 = E8[+b.dataset.i]; e0.r = 1 - e0.r; e8Draw(); });
    var e8Rand = seeded(5);
    b1.querySelector('#e8-more').onclick = function () {
      var w = segVal(b1.querySelector('#e8-w'));
      for (var i = 0; i < 20; i++) E8.push({ a: true, r: w === 'sig' ? 0 : (e8Rand() < 0.75 ? 1 : 0) });
      E8.extra += 20; e8Draw();
    };
    seg(b1.querySelector('#e8-w'), e8Reset);
    b1.querySelector('#e8-reset').onclick = e8Reset;
    e8Reset();

    // ============ 2. Phương sai và độ chệch ============
    var b2 = h('<section class="blk">' +
      '<h2>2. Phương sai của Monte Carlo, độ chệch của sai phân thời gian (hình 6.4)</h2>' +
      '<p class="lead">Từ $s_t$ còn $T$ bước tới hết tập; mỗi phần thưởng là $\\pm 1$ ngẫu nhiên (phương sai 1), nên giá trị thật $V(s_t) = 0$. Mục tiêu Monte Carlo: $G = \\sum$ của $T$ phần thưởng. Mục tiêu sai phân thời gian: $r_t + \\hat V(s_{t+1})$, với $\\hat V(s_{t+1})$ là ước lượng hiện có, lệch khỏi giá trị thật một lượng $\\delta$.</p>' +
      '<div class="ctrl"><label for="vb-t">$T$</label><input id="vb-t" type="range" min="1" max="50" step="1" value="20"><span class="val" id="vb-t-v"></span>' +
      '<label for="vb-d">$\\delta$</label><input id="vb-d" type="range" min="-4" max="4" step="0.5" value="1"><span class="val" id="vb-d-v"></span></div>' +
      '<div class="legend"><span class="li"><span class="sw box" style="background:var(--s2)"></span>mục tiêu MC: $G$</span><span class="li"><span class="sw box" style="background:var(--s1)"></span>mục tiêu TD: $r_t + \\hat V(s_{t+1})$</span></div>' +
      '<div class="chart" id="vb-hist"></div><div class="stat3" id="vb-stat"></div><div class="insight" id="vb-ins"></div></section>');
    root.appendChild(b2);
    var vbRand = seeded(8);
    function vbAll() {
      var T = +b2.querySelector('#vb-t').value, d = +b2.querySelector('#vb-d').value;
      b2.querySelector('#vb-t-v').textContent = T; b2.querySelector('#vb-d-v').textContent = fmtNum(d, 1);
      var mc = [], td = [];
      for (var i = 0; i < 3000; i++) { var g = 0; for (var k = 0; k < T; k++) g += vbRand() < 0.5 ? 1 : -1; mc.push(g); td.push((vbRand() < 0.5 ? 1 : -1) + d); }
      var lim = Math.max(6, Math.ceil(2.5 * Math.sqrt(T)), Math.abs(d) + 3);
      hist(b2.querySelector('#vb-hist'), [{ vals: mc, color: 'var(--s2)' }, { vals: td, color: 'var(--s1)' }], -lim, lim, Math.min(60, 2 * lim + 1), { truth: 0, truthLabel: 'đúng = 0', aria: 'Phân bố mục tiêu MC và TD' });
      var mseMC = T, mseTD = 1 + d * d;
      b2.querySelector('#vb-stat').innerHTML = '<div>MC: độ chệch / phương sai<b>0 / ' + T + '</b></div><div>TD: độ chệch / phương sai<b>' + fmtNum(d, 1) + ' / 1</b></div>' +
        '<div>Sai số bình phương trung bình MC<b>' + fmtNum(mseMC, 2) + '</b></div><div>Sai số bình phương trung bình TD = $1 + \\delta^2$<b>' + fmtNum(mseTD, 2) + '</b></div>';
      ctx.typeset(b2.querySelector('#vb-stat'));
      b2.querySelector('#vb-ins').innerHTML = (mseMC > mseTD ? 'Ở đây mục tiêu <b>TD tốt hơn</b>: dù lệch $\\delta = ' + texRaw(d, 1) + '$, phương sai của nó chỉ là 1, còn MC cộng $T = ' + T + '$ phần thưởng ngẫu nhiên nên phương sai bằng $T$.'
        : mseMC < mseTD ? 'Ở đây mục tiêu <b>MC tốt hơn</b>: tập ngắn ($T = ' + T + '$) nên phương sai MC nhỏ, trong khi $\\hat V(s_{t+1})$ lệch nhiều ($\\delta = ' + texRaw(d, 1) + '$) làm TD chệch.'
        : 'Hai mục tiêu có sai số như nhau ở thiết lập này.') + ' Phương sai MC tăng theo $T$ (tab Chứng minh), còn độ chệch TD giảm dần khi $\\hat V$ được học tốt hơn: đó là lý do thực tế TD được dùng phổ biến hơn.';
      ctx.typeset(b2.querySelector('#vb-ins'));
    }
    ['#vb-t', '#vb-d'].forEach(function (id) { b2.querySelector(id).oninput = vbAll; });
    onResize(vbAll);
    vbAll();

    // ============ 3. Khám phá ============
    var DISH = ['gà tiêu cay', 'bún bò', 'cơm tấm', 'phở'], DM = [0.6, 0.8, 0.4, 0.7], DSD = 0.25;
    var b3 = h('<section class="blk">' +
      '<h2>3. Khám phá: lần nào cũng gọi gà tiêu cay? (hình 6.11)</h2>' +
      '<p class="lead">Quán có 4 món, điểm ngon trung bình (bạn không biết) là ' + DISH.map(function (d, i) { return d + ' $' + texRaw(DM[i], 1) + '$'; }).join(', ') + ', mỗi lần ăn dao động $\\pm$ một chút. $Q(\\text{món})$ là trung bình điểm các lần đã ăn, khởi tạo bằng 0. Mỗi lần chọn món theo một chiến lược.</p>' +
      '<div class="ctrl"><label for="ex-e">$\\varepsilon$</label><input id="ex-e" type="range" min="0" max="0.5" step="0.05" value="0.1"><span class="val" id="ex-e-v"></span>' +
      '<label for="ex-t">$T$</label><input id="ex-t" type="range" min="0.02" max="0.5" step="0.02" value="0.1"><span class="val" id="ex-t-v"></span>' +
      '<button type="button" class="btn pri" id="ex-run">Chạy 500 lần × 300 bữa</button></div>' +
      '<div class="legend"><span class="li"><span class="sw" style="background:var(--muted)"></span>tham lam ($\\varepsilon = 0$)</span><span class="li"><span class="sw" style="background:var(--s2)"></span>$\\varepsilon$-tham lam</span><span class="li"><span class="sw" style="background:var(--s1)"></span>Boltzmann</span></div>' +
      '<div class="chart" id="ex-chart"></div><div class="insight" id="ex-ins">Bấm “Chạy”.</div>' +
      '<h3 class="sub">Xác suất chọn món theo Boltzmann khi $Q$ đã gần đúng</h3>' +
      '<div class="bars" id="ex-bars" style="grid-template-columns:repeat(4,minmax(0,1fr));max-width:560px"></div><div class="calc" id="ex-calc"></div></section>');
    root.appendChild(b3);
    function pickDish(Q, kind, eps, T, r) {
      if (kind === 'greedy' || kind === 'eps') {
        if (kind === 'eps' && r() < eps) return Math.floor(r() * 4);
        var mx = Math.max.apply(null, Q), b = []; Q.forEach(function (q, i) { if (q === mx) b.push(i); }); return b[Math.floor(r() * b.length)];
      }
      var p = softmax(Q.map(function (q) { return q / T; })), u = r(), a = 0, c = p[0]; while (u > c && a < 3) { a++; c += p[a]; } return a;
    }
    var exCmp = null;
    function exBars() {
      var T = +b3.querySelector('#ex-t').value, p = softmax(DM.map(function (q) { return q / T; }));
      b3.querySelector('#ex-bars').innerHTML = p.map(function (v, k) { return '<div class="bar"><div class="track"><div class="fill" style="height:' + (v * 100).toFixed(1) + '%"></div></div><div class="pv">' + fmtNum(v, 3) + '</div><div class="nm">' + DISH[k] + '</div></div>'; }).join('');
      katexBlock(b3.querySelector('#ex-calc'), '\\pi(a) = \\frac{e^{Q(a)/T}}{\\sum_{a\'} e^{Q(a\')/T}},\\quad Q = ' + vec(DM, 1) + ',\\ T = ' + texRaw(T, 2));
    }
    function exLabels() { b3.querySelector('#ex-e-v').textContent = fmtNum(+b3.querySelector('#ex-e').value, 2); b3.querySelector('#ex-t-v').textContent = fmtNum(+b3.querySelector('#ex-t').value, 2); exBars(); }
    function exDraw() {
      if (!exCmp) return;
      lineChart(b3.querySelector('#ex-chart'), { series: [{ name: 'Tham lam', color: 'var(--muted)', values: exCmp.greedy }, { name: 'ε-tham lam', color: 'var(--s2)', values: exCmp.eps }, { name: 'Boltzmann', color: 'var(--s1)', values: exCmp.boltz }],
        yMin: 0, yMax: 100, yTicks: [0, 25, 50, 75, 100], dec: 0, tipDec: 1, xLabel: 'Bữa thứ', aria: 'Phần trăm số lần chọn món ngon nhất' });
    }
    b3.querySelector('#ex-run').onclick = function () {
      var btn = this; btn.disabled = true;
      setTimeout(function () {
        var eps = +b3.querySelector('#ex-e').value, T = +b3.querySelector('#ex-t').value, RU = 500, S = 300, r = seeded(13), out = {}, firstLock = 0;
        ['greedy', 'eps', 'boltz'].forEach(function (kind) {
          var best = new Array(S).fill(0);
          for (var i = 0; i < RU; i++) {
            var Q = [0, 0, 0, 0], n = [0, 0, 0, 0], tried = {};
            for (var t = 0; t < S; t++) {
              var a = pickDish(Q, kind, eps, T, r), x = DM[a] + DSD * gauss(r); n[a]++; Q[a] += (x - Q[a]) / n[a]; tried[a] = 1;
              if (a === 1) best[t] += 100 / RU;
            }
            if (kind === 'greedy' && Object.keys(tried).length === 1) firstLock++;
          }
          out[kind] = best.map(function (_, t) { var s = 0, c = 0; for (var j = Math.max(0, t - 9); j <= t; j++) { s += best[j]; c++; } return s / c; });
        });
        exCmp = out; exDraw();
        var fin = function (k) { return fmtNum(out[k][S - 1], 0); };
        b3.querySelector('#ex-ins').innerHTML = 'Sau 300 bữa, tỉ lệ chọn món ngon nhất (bún bò): tham lam <b>' + fin('greedy') + '%</b>, $\\varepsilon$-tham lam <b>' + fin('eps') + '%</b>, Boltzmann <b>' + fin('boltz') + '%</b>. ' +
          'Chiến lược tham lam thuần: món đầu tiên được ăn có điểm dương nên $Q$ của nó lớn hơn 0, các món khác vẫn là 0, nên ' + Math.round(firstLock / RU * 100) + '% số lần chạy <b>chỉ ăn đúng một món</b> suốt 300 bữa, đúng câu chuyện gà tiêu cay. ' +
          '$\\varepsilon$-tham lam luôn dành $\\varepsilon$ cho thử ngẫu nhiên nên tìm ra món ngon nhưng mãi “phí” một phần; Boltzmann thử các món suýt ngon nhiều hơn món dở. Đổi $\\varepsilon$ và $T$ để so sánh.';
        ctx.typeset(b3.querySelector('#ex-ins'));
        btn.disabled = false;
      }, 30);
    };
    ['#ex-e', '#ex-t'].forEach(function (id) { b3.querySelector(id).oninput = exLabels; });
    onResize(exDraw);
    exLabels();

    // ============ 4. Bộ đệm phát lại ============
    var CAP = 24, BS = 6, PCOL = ['#2a78d6', '#eb6834', '#1f9d6b', '#8b5cf6', '#c98a12', '#d14d8b', '#4a5563'];
    var b4 = h('<section class="blk">' +
      '<h2>4. Bộ đệm phát lại (hình 6.12–6.13)</h2>' +
      '<p class="lead">Mỗi ô là một kinh nghiệm $(s_t, a_t, r_t, s_{t+1})$; màu cho biết nó được sinh bởi <b>phiên bản chính sách</b> nào ($\\pi$ được cập nhật sau mỗi 8 bước). Bộ đệm chứa ' + CAP + ' mẫu, đầy thì bỏ mẫu cũ nhất. So sánh lô ' + BS + ' mẫu lấy <b>ngẫu nhiên từ bộ đệm</b> (viền đen) với lô gồm ' + BS + ' bước <b>vừa đi</b> (viền cam).</p>' +
      '<div class="ctrl"><button type="button" class="btn pri" id="rb-one">+1 bước</button><button type="button" class="btn" id="rb-ten">+10 bước</button><button type="button" class="btn" id="rb-samp">Lấy lô khác</button><button type="button" class="btn" id="rb-reset">Đặt lại</button></div>' +
      '<div class="buf" id="rb-buf"></div><div class="stat3" id="rb-stat"></div><div class="insight" id="rb-ins"></div></section>');
    root.appendChild(b4);
    var RB, rbRand = seeded(19);
    function rbReset() { RB = { t: 0, buf: [], pick: [] }; for (var i = 0; i < 30; i++) rbAdd(); rbSample(); rbDraw(); }
    function rbAdd() { RB.buf.push({ t: RB.t, v: Math.floor(RB.t / 8), ep: Math.floor(RB.t / 5) }); RB.t++; if (RB.buf.length > CAP) RB.buf.shift(); }
    function rbSample() { var idx = []; while (idx.length < BS) { var k = Math.floor(rbRand() * RB.buf.length); if (idx.indexOf(k) < 0) idx.push(k); } RB.pick = idx; }
    function rbDraw() {
      var n = RB.buf.length;
      b4.querySelector('#rb-buf').innerHTML = RB.buf.map(function (x, i) {
        return '<div class="slot' + (RB.pick.indexOf(i) >= 0 ? ' pick' : '') + (i >= n - BS ? ' on' : '') + (i === n - 1 ? ' new' : '') + '" style="background:' + PCOL[x.v % PCOL.length] + '" title="bước ' + x.t + ', π phiên bản ' + x.v + '">' + x.t + '</div>';
      }).join('');
      var vr = {}, er = {}, ar = 0, vo = {}, eo = {}, ao = 0;
      RB.pick.forEach(function (k) { var x = RB.buf[k]; vr[x.v] = 1; er[x.ep] = 1; ar += (RB.t - 1 - x.t) / BS; });
      RB.buf.slice(n - BS).forEach(function (x) { vo[x.v] = 1; eo[x.ep] = 1; ao += (RB.t - 1 - x.t) / BS; });
      b4.querySelector('#rb-stat').innerHTML = '<div>Lô ngẫu nhiên: số tập khác nhau<b>' + Object.keys(er).length + '</b></div><div>Lô vừa đi: số tập khác nhau<b>' + Object.keys(eo).length + '</b></div>' +
        '<div>Lô ngẫu nhiên: số phiên bản $\\pi$<b>' + Object.keys(vr).length + '</b></div><div>Lô ngẫu nhiên: “tuổi” trung bình (bước)<b>' + fmtNum(ar, 1) + '</b></div>';
      ctx.typeset(b4.querySelector('#rb-stat'));
      b4.querySelector('#rb-ins').innerHTML = 'Lô gồm các bước vừa đi (viền cam) rơi vào 1–2 tập liên tiếp: các mẫu rất <b>tương quan</b>. Lô lấy ngẫu nhiên (viền đen) trải ra ' + Object.keys(er).length + ' tập và ' + Object.keys(vr).length + ' phiên bản chính sách: <b>đa dạng</b> hơn, và mỗi kinh nghiệm còn nằm trong bộ đệm ' + CAP + ' bước nên có thể được lấy lại nhiều lần. Vì lô chứa dữ liệu của các chính sách cũ, DQN là thuật toán <b>off-policy</b>.';
      ctx.typeset(b4.querySelector('#rb-ins'));
    }
    b4.querySelector('#rb-one').onclick = function () { rbAdd(); rbSample(); rbDraw(); };
    b4.querySelector('#rb-ten').onclick = function () { for (var i = 0; i < 10; i++) rbAdd(); rbSample(); rbDraw(); };
    b4.querySelector('#rb-samp').onclick = function () { rbSample(); rbDraw(); };
    b4.querySelector('#rb-reset').onclick = rbReset;
    rbReset();

    ctx.typeset(root);
  }

  // ======================================================================
  // TAB "Sơ đồ"
  // ======================================================================
  function renderMap(root, ctx) {
    root.innerHTML = '';
    root.classList.add('rx');

    // ---- 1. Vòng cải thiện chính sách ----
    var m1 = h('<section class="blk"><h2>Hàm Q giúp cải thiện chính sách thế nào (hình 6.8)</h2><div class="flow">' +
      [['\\pi', 'Diễn viên hiện tại (ban đầu có thể ngẫu nhiên) tương tác, thu dữ liệu.'],
       ['Q_\\pi(s, a)', 'Học hàm Q của $\\pi$ bằng TD hoặc MC: ở $s$ ép làm $a$, sau đó theo $\\pi$, được bao nhiêu.'],
       ['\\pi\'(s) = \\arg\\max_a Q_\\pi(s, a)', 'Chính sách mới. Định lý: $V_{\\pi\'}(s) \\ge V_\\pi(s)$ với mọi $s$ (tab Chứng minh).'],
       ['\\pi \\leftarrow \\pi\'', 'Lặp lại. DQN làm vòng này liên tục: hành động theo $\\arg\\max Q$ (cộng khám phá) và học $Q$ cùng lúc.']
      ].map(function (s, i) { return (i ? '<div class="fa">↓</div>' : '') + '<div class="fb' + (i === 3 ? ' eq' : '') + '"><div class="fx">$' + s[0] + '$</div><div class="fy">' + s[1] + '</div></div>'; }).join('') + '</div></section>');
    root.appendChild(m1);

    // ---- 2. Mèo đuổi chuột ----
    var m2 = h('<section class="blk"><h2>Mèo đuổi chuột: mạng mục tiêu (hình 6.10)</h2>' +
      '<p class="lead">Ví dụ một tham số: $Q_w = w$; mục tiêu $y = r + \\gamma\\,k\\,\\hat w$ với $r = 1$, $\\gamma k = 0{,}8$ (trạng thái kế tiếp có giá trị gắn với cùng tham số), nên điểm cố định là $w^* = 5$. Mèo là $w$ (ước lượng), chuột là $y$ (mục tiêu). Mạng mục tiêu: $\\hat w$ chỉ được sao chép từ $w$ sau mỗi $C$ bước.</p>' +
      '<div class="ctrl"><label>$C$</label><div class="seg" id="cm-c"><button type="button" data-v="1" aria-pressed="true">1 (không có mạng mục tiêu)</button><button type="button" data-v="5" aria-pressed="false">5</button><button type="button" data-v="15" aria-pressed="false">15</button></div>' +
      '<label for="cm-a">$\\alpha$</label><input id="cm-a" type="range" min="0.1" max="1" step="0.05" value="0.3"><span class="val" id="cm-a-v"></span></div>' +
      '<div class="legend"><span class="li"><span class="sw" style="background:var(--s1)"></span>mèo: $Q_w = w$</span><span class="li"><span class="sw" style="background:var(--s2)"></span>chuột: mục tiêu $y$</span></div>' +
      '<div class="chart" id="cm-chart"></div><div class="insight" id="cm-ins"></div></section>');
    root.appendChild(m2);
    function cmAll() {
      var C = +segVal(m2.querySelector('#cm-c')), a = +m2.querySelector('#cm-a').value, w = 0, wh = 0, W = [], Y = [];
      m2.querySelector('#cm-a-v').textContent = fmtNum(a, 2);
      for (var t = 0; t <= 60; t++) {
        if (t % C === 0) wh = w;
        var y = 1 + 0.8 * wh; W.push(w); Y.push(y);
        w += a * (y - w);
      }
      lineChart(m2.querySelector('#cm-chart'), { series: [{ name: 'mèo w', color: 'var(--s1)', values: W }, { name: 'chuột y', color: 'var(--s2)', values: Y }],
        yMin: 0, yMax: 6, yTicks: [0, 1, 2, 3, 4, 5, 6], dec: 0, tipDec: 3, xLabel: 'Bước cập nhật', xFirst: 0, refs: [{ y: 5, label: 'w* = 5' }], aria: 'Ước lượng và mục tiêu theo bước' });
      m2.querySelector('#cm-ins').innerHTML = C === 1 ? 'Không có mạng mục tiêu: <b>mỗi bước</b> mèo tiến lại gần thì chuột cũng dịch theo (vì $y$ dùng chính $w$). Mục tiêu không bao giờ đứng yên.'
        : 'Có mạng mục tiêu: chuột <b>đứng yên ' + C + ' bước</b> (đoạn bậc thang), mèo đuổi kịp như một bài toán hồi quy bình thường, rồi chuột mới nhảy tới chỗ mới. Ở ví dụ một tham số này cả hai cách đều hội tụ; với mạng nơ-ron lớn, nơi cập nhật một chỗ làm thay đổi giá trị ở nhiều chỗ khác, mục tiêu di động liên tục có thể làm huấn luyện dao động hoặc phân kỳ (hình 6.10c), và mục tiêu đứng yên giúp ổn định.';
      ctx.typeset(m2.querySelector('#cm-ins'));
    }
    seg(m2.querySelector('#cm-c'), cmAll);
    m2.querySelector('#cm-a').oninput = cmAll;
    onResize(cmAll);
    cmAll();

    // ---- 3. Bảng so sánh ----
    function table(head, rows) { return '<div class="tscroll"><table class="cmp"><thead><tr>' + head.map(function (x) { return '<th>' + x + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.map(function (r) { return '<tr>' + r.map(function (x) { return '<td>' + x + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>'; }
    var m3 = h('<section class="blk"><h2>Tóm tắt các lựa chọn trong chương</h2>' +
      '<h3 class="sub">Ước lượng $V_\\pi$</h3>' + table(['', 'Monte Carlo', 'Sai phân thời gian'], [
        ['Mục tiêu hồi quy', '$G_a$ (tổng tới hết tập)', '$r_t + V_\\pi(s_{t+1})$'],
        ['Cần chơi hết tập?', 'Có', 'Không, một bước là đủ'],
        ['Phương sai', 'Lớn', 'Nhỏ'],
        ['Độ chệch', 'Không', 'Có, nếu $V_\\pi(s_{t+1})$ sai'],
        ['Giả định', 'Không cần Markov', 'Markov'],
        ['Thực tế', 'Ít dùng', 'Dùng phổ biến']]) +
      '<h3 class="sub">Khám phá</h3>' + table(['', '$\\varepsilon$-tham lam', 'Boltzmann'], [
        ['Chọn hành động', '$\\arg\\max Q$ với xác suất $1-\\varepsilon$, còn lại ngẫu nhiên', 'Theo $e^{Q/T}$ chuẩn hóa'],
        ['Hành động suýt tốt nhất', 'Được thử bằng hành động tồi', 'Được thử nhiều hơn hành động tồi'],
        ['Điều chỉnh', '$\\varepsilon$ giảm dần', '$T$ giảm dần']]) +
      '<h3 class="sub">Q-learning và DQN</h3>' + table(['', 'Q-learning (chương 3)', 'DQN'], [
        ['Biểu diễn $Q$', 'Bảng', 'Mạng nơ-ron $Q_\\phi$'],
        ['Mục tiêu', '$r + \\gamma\\max_a Q(s\', a)$', '$r + \\gamma\\max_a \\hat Q(s\', a)$ (mạng mục tiêu)'],
        ['Dữ liệu cập nhật', 'Bước vừa đi', 'Lô ngẫu nhiên từ bộ đệm phát lại'],
        ['Loại', 'Off-policy', 'Off-policy']]) +
      '</section>');
    root.appendChild(m3);
    ctx.typeset(root);
  }

  // ======================================================================
  // TAB "Mô phỏng": liên kết tới các trang docs/viz
  // ======================================================================
  var VIZ = [
    ['dqn.html', 'Mục 6.6', 'DQN từng bước', 'Mạng nơ-ron nhỏ trên lưới 5×5; bộ đệm, lô, mục tiêu từ $\\hat Q$, sao chép sau $C$ lần cập nhật.'],
    ['dqn-cartpole.html', 'Mục 6.3–6.6', 'DQN trên CartPole', 'Huấn luyện trong trình duyệt; bật/tắt phát lại kinh nghiệm và mạng mục tiêu; so sánh nhiều lần chạy.']
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
