/* Thí nghiệm tương tác và sơ đồ trực quan cho chương 1.
 * Trang index.html tải file này khi ch1.json có "extras": "ch1-extras.js".
 * File đăng ký window.ReviewExtras = { tabs: [{ id, label, render(el, ctx) }] }.
 */
(function () {
  'use strict';

  // ---------- CSS riêng cho phần mở rộng ----------
  var css = `
  .rx { --s1:#2a78d6; --s2:#eb6834; --s3:#1baf7a;
        --q100:#cde2fb; --q200:#9ec5f4; --q300:#6da7ec; --q400:#3987e5; --q500:#256abf; --q600:#184f95;
        --wall:#c9cfd6; --fog:#d7dce2; }
  @media (prefers-color-scheme: dark) {
    :root:where(:not([data-theme="light"])) .rx { --s1:#3987e5; --s2:#d95926; --s3:#199e70; --wall:#3a4552; --fog:#2a323c; }
  }
  :root[data-theme="dark"] .rx { --s1:#3987e5; --s2:#d95926; --s3:#199e70; --wall:#3a4552; --fog:#2a323c; }
  .rx section.blk { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; box-shadow: var(--shadow); padding: 20px; margin-bottom: 16px; }
  .rx h2 { margin: 0 0 4px; font-size: 1.1rem; }
  .rx .lead { color: var(--muted); margin: 0 0 14px; font-size: .93rem; }
  .rx .ctrl { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 14px; margin: 10px 0; }
  .rx .ctrl label { font-weight: 600; font-size: .92rem; }
  .rx input[type=range] { flex: 1; min-width: 160px; accent-color: var(--s1); }
  .rx .val { font-variant-numeric: tabular-nums; font-weight: 700; min-width: 3.2em; }
  .rx .tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin: 12px 0; }
  .rx .tile { background: var(--surface-2); border-radius: 12px; padding: 10px 12px; }
  .rx .tile .lbl { font-size: .8rem; color: var(--muted); display: flex; align-items: center; gap: 6px; }
  .rx .tile .num .katex { font-size: 1em; }
  .rx .tile .num { font-size: 1.35rem; font-weight: 700; font-variant-numeric: tabular-nums; }
  .rx .tile .sub { font-size: .8rem; color: var(--muted); }
  .rx .tile.win { outline: 2px solid var(--accent); }
  .rx .sw { width: 12px; height: 3px; border-radius: 2px; display: inline-block; flex: none; }
  .rx .legend { display: flex; flex-wrap: wrap; gap: 6px 16px; font-size: .85rem; margin: 6px 0 4px; }
  .rx .legend .li { display: inline-flex; align-items: center; gap: 6px; }
  .rx .chart { position: relative; width: 100%; }
  .rx .chart svg { display: block; width: 100%; overflow: visible; }
  .rx .chart text { fill: var(--muted); font-size: 11px; font-family: inherit; }
  .rx .grid line { stroke: var(--border); stroke-width: 1; }
  .rx .tip { position: absolute; pointer-events: none; background: var(--surface); border: 1px solid var(--border); border-radius: 8px;
             box-shadow: var(--shadow); padding: 6px 10px; font-size: .8rem; white-space: nowrap; display: none; z-index: 2; }
  .rx .tip b { font-variant-numeric: tabular-nums; }
  .rx .insight { background: var(--accent-soft); border-radius: 12px; padding: 10px 14px; font-size: .92rem; margin-top: 10px; }
  .rx .arms { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
  .rx .arm { border: 1px solid var(--border); background: var(--surface); border-radius: 12px; padding: 10px 4px 8px; text-align: center; cursor: pointer; font: inherit; color: var(--text); }
  .rx .arm:hover:not([disabled]) { border-color: var(--s1); }
  .rx .arm[disabled] { cursor: default; opacity: .85; }
  .rx .arm .nm { font-weight: 700; }
  .rx .arm .meter { height: 56px; margin: 6px auto; width: 22px; background: var(--surface-2); border-radius: 4px; position: relative; overflow: hidden; }
  .rx .arm .meter i { position: absolute; left: 0; right: 0; bottom: 0; background: var(--s1); border-radius: 4px 4px 0 0; transition: height .2s; }
  .rx .arm .meter u { position: absolute; left: -2px; right: -2px; height: 2px; background: var(--text); }
  .rx .arm .st { font-size: .75rem; color: var(--muted); line-height: 1.35; }
  .rx .flash { animation: rxflash .5s; }
  @keyframes rxflash { from { background: var(--good-soft); } to { background: var(--surface); } }
  .rx .flash0 { animation: rxflash0 .5s; }
  @keyframes rxflash0 { from { background: var(--surface-2); } to { background: var(--surface); } }
  .rx .seg { display: inline-flex; background: var(--surface-2); border-radius: 10px; padding: 3px; gap: 3px; flex-wrap: wrap; }
  .rx .seg button { border: 0; background: transparent; color: var(--muted); font: inherit; font-weight: 600; font-size: .86rem; padding: 6px 12px; border-radius: 8px; cursor: pointer; }
  .rx .seg button[aria-pressed=true] { background: var(--surface); color: var(--text); box-shadow: var(--shadow); }
  /* vòng tương tác */
  .rx .loop { display: grid; grid-template-columns: 1fr 1.1fr 1fr; align-items: center; gap: 6px; }
  .rx .box { border: 2px solid var(--border); border-radius: 14px; padding: 12px 8px; text-align: center; transition: border-color .3s, box-shadow .3s; background: var(--surface); }
  .rx .box h3 { margin: 0 0 6px; font-size: 1rem; }
  .rx .box.on { border-color: var(--accent); box-shadow: 0 0 0 4px var(--accent-soft); }
  .rx .chips { display: flex; flex-direction: column; gap: 4px; font-size: .8rem; }
  .rx .chip { background: var(--surface-2); border-radius: 6px; padding: 2px 6px; }
  .rx .wire { display: flex; flex-direction: column; gap: 18px; font-size: .85rem; text-align: center; }
  .rx .wire svg { width: 100%; height: 22px; display: block; }
  .rx .wire path { stroke: var(--border); stroke-width: 2; fill: none; transition: stroke .3s; }
  .rx .wire .on path { stroke: var(--accent); }
  .rx .wire .dot { fill: var(--accent); opacity: 0; }
  .rx .wire .on .dot { opacity: 1; }
  .rx .steps { list-style: none; padding: 0; margin: 14px 0 0; display: grid; gap: 6px; counter-reset: st; }
  .rx .steps li { padding: 6px 10px 6px 36px; border-radius: 10px; position: relative; color: var(--muted); transition: background .3s, color .3s; }
  .rx .steps li::before { counter-increment: st; content: counter(st); position: absolute; left: 10px; top: 6px; width: 18px; height: 18px; border-radius: 50%;
                          background: var(--surface-2); color: var(--muted); font-size: .75rem; font-weight: 700; display: grid; place-items: center; }
  .rx .steps li.on { background: var(--accent-soft); color: var(--text); }
  .rx .steps li.on::before { background: var(--accent); color: #fff; }
  /* Venn */
  .rx .venn-wrap { display: grid; gap: 12px; }
  .rx .venn { max-width: 470px; width: 100%; margin: 0 auto; }
  .rx .venn-note { font-size: .82rem; color: var(--muted); text-align: center; margin-top: 2px; }
  .rx .venn svg { width: 100%; display: block; }
  .rx .venn .ring { fill: none; stroke-width: 2; }
  .rx .venn .hit { cursor: pointer; }
  .rx .venn text { font-family: inherit; pointer-events: none; }
  .rx .venn .ttl { font-weight: 700; font-size: 15px; fill: var(--text); }
  .rx .venn .rl { font-size: 12.5px; fill: var(--text); font-weight: 600; }
  .rx .venn .rl2 { font-size: 11px; fill: var(--muted); font-weight: 500; }
  .rx .detail { background: var(--surface-2); border-radius: 12px; padding: 14px; font-size: .92rem; min-height: 180px; }
  .rx .detail h3 { margin: 0 0 6px; font-size: 1rem; }
  .rx .detail .ex { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 6px; }
  .rx .detail .ex a, .rx .detail .ex span { background: var(--surface); border: 1px solid var(--border); border-radius: 999px; padding: 1px 10px; font-size: .82rem; }
  /* mê cung */
  .rx .maze { display: grid; gap: 3px; margin: 10px auto 0; max-width: 460px; user-select: none; }
  .rx .cell { aspect-ratio: 1; border-radius: 6px; display: grid; place-items: center; font-size: .78rem; font-weight: 600; font-variant-numeric: tabular-nums;
              position: relative; cursor: pointer; transition: background .25s, color .25s; }
  .rx .cell.wall { background: var(--wall); cursor: default; }
  .rx .cell.goal { outline: 2px solid var(--good); outline-offset: -2px; }
  .rx .cell .ag { position: absolute; inset: 18%; border-radius: 50%; background: var(--s2); box-shadow: 0 0 0 2px var(--surface); }
  .rx .cell.fog { background: var(--fog) !important; color: transparent !important; }
  .rx .cell.fog .arr { visibility: hidden; }
  .rx .cell .arr { font-size: 1.05rem; line-height: 1; }
  .rx .maze-note { font-size: .82rem; color: var(--muted); text-align: center; margin-top: 8px; }
  /* không gian hành động */
  .rx .acts { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .rx .act { background: var(--surface-2); border-radius: 12px; padding: 12px; text-align: center; }
  .rx .act svg { width: 140px; height: 140px; display: block; margin: 6px auto; }
  .rx .act .pad { display: grid; grid-template-columns: repeat(3, 38px); gap: 4px; justify-content: center; margin: 8px auto; }
  .rx .act .pad button { height: 38px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); color: var(--text); font-size: 1.1rem; cursor: pointer; }
  .rx .act .pad button.sel { border-color: var(--s2); background: var(--s2); color: #fff; }
  @media (max-width: 560px) {
    .rx section.blk { padding: 16px 14px; }
    .rx .acts { grid-template-columns: 1fr; }
    .rx .tiles { grid-template-columns: 1fr; }
    .rx .tile { display: flex; flex-wrap: wrap; align-items: baseline; column-gap: 12px; }
    .rx .tile .lbl { flex-basis: 100%; }
    .rx .loop { grid-template-columns: 1fr 1fr 1fr; font-size: .85rem; }
    .rx .arms { gap: 5px; }
    .rx .arm { padding: 8px 2px 6px; }
  }`;
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // ---------- tiện ích ----------
  function h(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }
  function fmtNum(x, d) { return x.toLocaleString('vi-VN', { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function rng(seed) { // mulberry32: số ngẫu nhiên có seed để đường cong ổn định khi kéo thanh trượt
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function tex(x, d) { return fmtNum(x, d).replace(',', '{,}'); } // số thập phân kiểu Việt trong LaTeX
  function cssVar(el, name) { return getComputedStyle(el).getPropertyValue(name).trim(); }
  var SVGNS = 'http://www.w3.org/2000/svg';

  // ---------- biểu đồ đường (dùng cho mô phỏng ε-tham lam) ----------
  function lineChart(box, opt) {
    // opt: { series: [{ name, color, values }], yMin, yMax, yTicks, xLabel, ref: { y, label }, fmtY }
    box.innerHTML = '';
    var W = Math.max(280, box.clientWidth), H = 250, m = { l: 40, r: 14, t: 14, b: 34 };
    var iw = W - m.l - m.r, ih = H - m.t - m.b;
    var n = opt.series[0].values.length;
    var x = function (i) { return m.l + (n === 1 ? 0 : i / (n - 1) * iw); };
    var y = function (v) { return m.t + ih - (v - opt.yMin) / (opt.yMax - opt.yMin) * ih; };
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (opt.aria || '') + '"><g class="grid">';
    opt.yTicks.forEach(function (v) { s += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(v) + '" y2="' + y(v) + '"/>'; });
    s += '</g>';
    opt.yTicks.forEach(function (v) { s += '<text x="' + (m.l - 6) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + opt.fmtY(v) + '</text>'; });
    var xt = opt.xTicks || [0, Math.round((n - 1) / 2), n - 1];
    xt.forEach(function (i) { s += '<text x="' + x(i) + '" y="' + (H - m.b + 16) + '" text-anchor="middle">' + (i + 1) + '</text>'; });
    s += '<text x="' + (m.l + iw / 2) + '" y="' + (H - 2) + '" text-anchor="middle">' + opt.xLabel + '</text>';
    if (opt.ref) {
      s += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(opt.ref.y) + '" y2="' + y(opt.ref.y) + '" stroke="var(--muted)" stroke-width="1"/>' +
           '<text x="' + (W - m.r) + '" y="' + (y(opt.ref.y) - 5) + '" text-anchor="end">' + opt.ref.label + '</text>';
    }
    opt.series.forEach(function (se) {
      var d = se.values.map(function (v, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1); }).join('');
      s += '<path d="' + d + '" fill="none" stroke="' + se.color + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>';
      s += '<circle cx="' + x(n - 1) + '" cy="' + y(se.values[n - 1]) + '" r="4" fill="' + se.color + '" stroke="var(--surface)" stroke-width="2"/>';
    });
    s += '<g class="hover" style="display:none"><line class="xh" y1="' + m.t + '" y2="' + (m.t + ih) + '" stroke="var(--muted)" stroke-width="1"/>' +
         opt.series.map(function (se) { return '<circle r="4" fill="' + se.color + '" stroke="var(--surface)" stroke-width="2"/>'; }).join('') + '</g>';
    s += '<rect x="' + m.l + '" y="' + m.t + '" width="' + iw + '" height="' + ih + '" fill="transparent"/></svg>';
    box.innerHTML = s + '<div class="tip"></div>';
    var svg = box.querySelector('svg'), hov = svg.querySelector('.hover'), tip = box.querySelector('.tip');
    var rect = svg.querySelector('rect:last-of-type');
    function move(ev) {
      var r = svg.getBoundingClientRect(), px = (ev.clientX - r.left) * W / r.width;
      var i = Math.max(0, Math.min(n - 1, Math.round((px - m.l) / iw * (n - 1))));
      hov.style.display = '';
      hov.querySelector('.xh').setAttribute('x1', x(i)); hov.querySelector('.xh').setAttribute('x2', x(i));
      var dots = hov.querySelectorAll('circle');
      opt.series.forEach(function (se, k) { dots[k].setAttribute('cx', x(i)); dots[k].setAttribute('cy', y(se.values[i])); });
      tip.style.display = 'block';
      tip.innerHTML = '<div style="margin-bottom:2px">' + opt.xLabel + ' <b>' + (i + 1) + '</b></div>' + opt.series.map(function (se) {
        return '<div><span class="sw" style="background:' + se.color + '"></span> ' + se.name + ': <b>' + opt.fmtY(se.values[i], true) + '</b></div>';
      }).join('');
      if (opt.typeset) opt.typeset(tip);
      var left = x(i) / W * r.width + 12;
      if (left + tip.offsetWidth > r.width) left = x(i) / W * r.width - tip.offsetWidth - 12;
      tip.style.left = Math.max(0, left) + 'px'; tip.style.top = '8px';
    }
    rect.addEventListener('pointermove', move);
    rect.addEventListener('pointerdown', move);
    rect.addEventListener('pointerleave', function () { hov.style.display = 'none'; tip.style.display = 'none'; });
  }

  // ---------- biểu đồ cột (trọng số γ^k) ----------
  function columnChart(box, opt) {
    // opt: { values, color, highlight: { i, label }, fmtY, xLabel }
    box.innerHTML = '';
    var W = Math.max(280, box.clientWidth), H = 220, m = { l: 36, r: 8, t: 26, b: 34 };
    var iw = W - m.l - m.r, ih = H - m.t - m.b, n = opt.values.length;
    var band = iw / n, bw = Math.min(24, band * 0.6);
    var y = function (v) { return m.t + ih - v * ih; };
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (opt.aria || '') + '"><g class="grid">';
    [0, 0.5, 1].forEach(function (v) { s += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(v) + '" y2="' + y(v) + '"/>'; });
    s += '</g>';
    [0, 0.5, 1].forEach(function (v) { s += '<text x="' + (m.l - 6) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + opt.fmtY(v) + '</text>'; });
    opt.values.forEach(function (v, i) {
      var cx = m.l + band * i + band / 2, top = y(v), x0 = cx - bw / 2, hgt = Math.max(0, m.t + ih - top), r = Math.min(4, hgt);
      var d = 'M' + x0 + ' ' + (m.t + ih) + 'V' + (top + r) + 'Q' + x0 + ' ' + top + ' ' + (x0 + r) + ' ' + top + 'H' + (x0 + bw - r) +
              'Q' + (x0 + bw) + ' ' + top + ' ' + (x0 + bw) + ' ' + (top + r) + 'V' + (m.t + ih) + 'Z';
      s += '<path d="' + d + '" fill="' + opt.color + '"/>';
      s += '<rect class="hit" data-i="' + i + '" x="' + (m.l + band * i) + '" y="' + m.t + '" width="' + band + '" height="' + ih + '" fill="transparent"/>';
      if (i % (n > 12 ? 2 : 1) === 0 || i === opt.highlight.i) s += '<text x="' + cx + '" y="' + (H - m.b + 16) + '" text-anchor="middle">' + i + '</text>';
      if (i === opt.highlight.i) {
        s += '<text x="' + cx + '" y="' + (top - 8) + '" text-anchor="middle" style="fill:var(--text);font-weight:600">' + opt.highlight.label + '</text>';
      }
    });
    s += '<text x="' + (m.l + iw / 2) + '" y="' + (H - 2) + '" text-anchor="middle">' + opt.xLabel + '</text></svg>';
    box.innerHTML = s + '<div class="tip"></div>';
    var svg = box.querySelector('svg'), tip = box.querySelector('.tip');
    svg.querySelectorAll('.hit').forEach(function (hit) {
      function show() {
        var i = +hit.getAttribute('data-i'), r = svg.getBoundingClientRect();
        tip.style.display = 'block';
        tip.innerHTML = '$k = ' + i + '$ · trọng số $\\gamma^{k} = ' + tex(opt.values[i], 3) + '$';
        if (opt.typeset) opt.typeset(tip);
        var left = (m.l + band * (i + 0.5)) / W * r.width + 10;
        if (left + tip.offsetWidth > r.width) left -= tip.offsetWidth + 20;
        tip.style.left = Math.max(0, left) + 'px'; tip.style.top = '0px';
      }
      hit.addEventListener('pointerenter', show); hit.addEventListener('pointerdown', show);
      hit.addEventListener('pointerleave', function () { tip.style.display = 'none'; });
    });
  }

  function onResize(fn) {
    var last = window.innerWidth, t = null;
    window.addEventListener('resize', function () {
      if (window.innerWidth === last) return; last = window.innerWidth;
      clearTimeout(t); t = setTimeout(fn, 150);
    });
  }

  // ======================================================================
  // TAB "Thí nghiệm"
  // ======================================================================
  var PROBS = [0.25, 0.4, 0.5, 0.6, 0.75]; // xác suất nhả xu của 5 tay cần (tay tốt nhất: 0,75)

  function renderLab(root, ctx) {
    root.innerHTML = '';
    root.classList.add('rx');

    // ---- 1. Tự chơi máy 5 tay cần ----
    var TURNS = 30;
    var b1 = h('<section class="blk"><h2>1. Tự chơi máy đánh bạc 5 tay cần</h2>' +
      '<p class="lead">Mỗi tay cần nhả xu với một xác suất bạn không biết. Bạn có <b>' + TURNS + ' lượt</b>. Muốn nhiều xu thì phải vừa <b>khám phá</b> (thử tay khác) vừa <b>khai thác</b> (kéo tay đang tốt nhất). Mục 1.6.</p>' +
      '<div class="arms"></div><div class="ctrl" style="justify-content:space-between"><span class="status"></span><button class="btn" data-act="reset">Chơi lại (đổi máy)</button></div>' +
      '<div class="insight hidden"></div></section>');
    root.appendChild(b1);
    var game;
    function newGame() {
      var p = PROBS.slice().sort(function () { return Math.random() - 0.5; });
      game = { p: p, n: [0, 0, 0, 0, 0], w: [0, 0, 0, 0, 0], left: TURNS, coins: 0 };
      drawGame();
    }
    function drawGame(flashIdx, won) {
      var arms = b1.querySelector('.arms'), over = game.left === 0;
      arms.innerHTML = game.p.map(function (p, i) {
        var est = game.n[i] ? game.w[i] / game.n[i] : 0;
        return '<button class="arm' + (i === flashIdx ? (won ? ' flash' : ' flash0') : '') + '" data-i="' + i + '"' + (over ? ' disabled' : '') +
          ' aria-label="Tay ' + (i + 1) + '"><div class="nm">Tay ' + (i + 1) + '</div>' +
          '<div class="meter"><i style="height:' + (est * 100) + '%"></i>' + (over ? '<u style="bottom:' + (p * 100) + '%"></u>' : '') + '</div>' +
          '<div class="st">' + game.w[i] + '/' + game.n[i] + ' xu' + (over ? '<br>thật: ' + fmtNum(p, 2) : '') + '</div></button>';
      }).join('');
      arms.querySelectorAll('.arm').forEach(function (a) { a.onclick = function () { pull(+a.getAttribute('data-i')); }; });
      b1.querySelector('.status').innerHTML = over ? 'Hết lượt · Tổng: <b>' + game.coins + ' xu</b>' :
        'Còn <b>' + game.left + '</b> lượt · Tổng: <b>' + game.coins + ' xu</b>';
      var ins = b1.querySelector('.insight');
      if (over) {
        var best = game.p.indexOf(Math.max.apply(null, game.p)), tried = game.n.filter(function (x) { return x > 0; }).length;
        var pctBest = Math.round(game.n[best] / TURNS * 100);
        ins.classList.remove('hidden');
        ins.innerHTML = 'Tay tốt nhất là <b>Tay ' + (best + 1) + '</b> (xác suất ' + fmtNum(game.p[best], 2) + '); bạn kéo nó <b>' + game.n[best] + '/' + TURNS + '</b> lần (' + pctBest + '%) và đã thử ' + tried + '/5 tay. ' +
          'Nếu biết trước và luôn kéo tay đó, trung bình được ' + fmtNum(TURNS * game.p[best], 1) + ' xu. ' +
          (tried <= 2 ? 'Bạn khám phá khá ít, nên dễ bỏ sót tay tốt hơn.' : pctBest >= 50 ? 'Bạn cân bằng khám phá và khai thác khá tốt!' :
            'Bạn khám phá nhiều nhưng chưa dồn đủ lượt cho tay tốt nhất.') +
          ' Vạch đen trên mỗi cột là xác suất thật; cột xanh là ước lượng của bạn.';
      } else ins.classList.add('hidden');
    }
    function pull(i) {
      if (game.left <= 0) return;
      var won = Math.random() < game.p[i];
      game.n[i] += 1; game.w[i] += won ? 1 : 0; game.coins += won ? 1 : 0; game.left -= 1;
      drawGame(i, won);
    }
    b1.querySelector('[data-act=reset]').onclick = newGame;
    newGame();

    // ---- 2. Mô phỏng ε-tham lam ----
    var T = 300, RUNS = 400;
    var b2 = h('<section class="blk"><h2>2. Để máy tự học: chiến lược $\\varepsilon$-tham lam</h2>' +
      '<p class="lead">Với xác suất $\\varepsilon$ tác tử chọn ngẫu nhiên một tay (khám phá), còn lại chọn tay có ước lượng cao nhất (khai thác). Mỗi đường là trung bình của ' + RUNS + ' lần chơi, mỗi lần ' + T + ' lượt, với 5 tay có xác suất 0,25 / 0,4 / 0,5 / 0,6 / 0,75.</p>' +
      '<div class="ctrl"><label for="eps">$\\varepsilon$ =</label><span class="val" id="eps-val"></span><input id="eps" type="range" min="0" max="1" step="0.01" value="0.1"></div>' +
      '<div class="legend"></div><div class="chart" id="eps-chart"></div><div class="tiles" id="eps-tiles"></div><div class="insight" id="eps-ins"></div></section>');
    root.appendChild(b2);

    function simulate(eps, seed) {
      var rand = rng(seed), K = PROBS.length, best = K - 1;
      var avg = new Float64Array(T), bestPick = 0, total = 0;
      for (var r = 0; r < RUNS; r++) {
        var q = new Float64Array(K), n = new Float64Array(K), sum = 0;
        for (var t = 0; t < T; t++) {
          var a;
          if (rand() < eps) a = Math.floor(rand() * K);
          else { // argmax, phá hòa ngẫu nhiên
            var mx = -1, cnt = 0;
            for (var k = 0; k < K; k++) {
              if (q[k] > mx) { mx = q[k]; a = k; cnt = 1; }
              else if (q[k] === mx) { cnt++; if (rand() * cnt < 1) a = k; }
            }
          }
          var rw = rand() < PROBS[a] ? 1 : 0;
          n[a] += 1; q[a] += (rw - q[a]) / n[a];
          sum += rw; avg[t] += sum / (t + 1);
          if (t >= T - 100 && a === best) bestPick++;
        }
        total += sum;
      }
      for (var i = 0; i < T; i++) avg[i] /= RUNS;
      return { avg: Array.from(avg), total: total / RUNS, best: bestPick / (RUNS * 100) };
    }
    var greedy = simulate(0, 11), explore = simulate(1, 13), cur = null;
    var epsInput = b2.querySelector('#eps');
    function drawEps() {
      var eps = +epsInput.value;
      cur = simulate(eps, 12);
      b2.querySelector('#eps-val').textContent = fmtNum(eps, 2);
      var c1 = cssVar(root, '--s1'), c2 = cssVar(root, '--s2'), c3 = cssVar(root, '--s3');
      var series = [
        { name: '$\\varepsilon = ' + tex(eps, 2) + '$ (bạn chọn)', color: c1, values: cur.avg, d: cur },
        { name: 'Chỉ khai thác ($\\varepsilon = 0$)', color: c2, values: greedy.avg, d: greedy },
        { name: 'Chỉ khám phá ($\\varepsilon = 1$)', color: c3, values: explore.avg, d: explore }
      ];
      b2.querySelector('.legend').innerHTML = series.map(function (s) { return '<span class="li"><span class="sw" style="background:' + s.color + '"></span><span>' + s.name + '</span></span>'; }).join('');
      lineChart(b2.querySelector('#eps-chart'), {
        series: series, yMin: 0.3, yMax: 0.8, yTicks: [0.3, 0.4, 0.5, 0.6, 0.7, 0.8], xLabel: 'Lượt', xTicks: [0, 99, 199, 299],
        ref: { y: 0.75, label: 'tốt nhất có thể (0,75)' }, typeset: ctx.typeset, aria: 'Phần thưởng trung bình theo lượt',
        fmtY: function (v, full) { return fmtNum(v, full ? 3 : 1); }
      });
      var maxTotal = Math.max(cur.total, greedy.total, explore.total);
      b2.querySelector('#eps-tiles').innerHTML = series.map(function (s) {
        return '<div class="tile' + (s.d.total === maxTotal ? ' win' : '') + '"><div class="lbl"><span class="sw" style="background:' + s.color + '"></span><span>' + s.name + '</span></div>' +
          '<div class="num">' + fmtNum(s.d.total, 1) + ' xu</div><div class="sub">chọn đúng tay tốt nhất ' + Math.round(s.d.best * 100) + '% ở 100 lượt cuối</div></div>';
      }).join('');
      var ins;
      if (eps < 0.02) ins = 'Với $\\varepsilon \\approx 0$, tác tử thường <b>kẹt</b> ở tay đầu tiên cho ra xu, vì không bao giờ thử lại tay khác. Đây là nhược điểm của <b>chỉ khai thác</b>.';
      else if (eps <= 0.25) ins = 'Một chút khám phá ($\\varepsilon$ khoảng 0,05–0,2) giúp tác tử tìm ra tay tốt nhất mà vẫn dành phần lớn lượt để khai thác. Thường đây là vùng cho nhiều xu nhất.';
      else if (eps < 0.9) ins = 'Khám phá nhiều thì ước lượng chính xác, nhưng tốn quá nhiều lượt cho tay kém, nên tổng xu giảm.';
      else ins = 'Với $\\varepsilon \\approx 1$, tác tử <b>chỉ khám phá</b>: ước lượng mọi tay rất tốt nhưng gần như không tận dụng hiểu biết đó, nên phần thưởng chỉ quanh mức trung bình 0,5.';
      b2.querySelector('#eps-ins').innerHTML = ins + ' Rê chuột (hoặc chạm) lên biểu đồ để xem giá trị từng lượt.';
      ctx.typeset(b2.querySelector('#eps-ins')); ctx.typeset(b2.querySelector('.legend')); ctx.typeset(b2.querySelector('#eps-tiles'));
    }
    var pending = false;
    epsInput.addEventListener('input', function () {
      if (pending) return; pending = true;
      requestAnimationFrame(function () { pending = false; drawEps(); });
    });

    // ---- 3. Hệ số chiết khấu γ ----
    var K = 14, DELAY = 9;
    var b3 = h('<section class="blk"><h2>3. Hệ số chiết khấu $\\gamma$: nhận ít ngay hay nhiều sau?</h2>' +
      '<p class="lead">Lợi tức $G_t = \\sum_{k=0}^{\\infty} \\gamma^{k} r_{t+k+1}$: phần thưởng ở bước $k$ được nhân với trọng số $\\gamma^{k}$. So sánh hai lựa chọn: <b>A</b> nhận <b>1 xu ngay</b> ($k = 0$), <b>B</b> nhận <b>10 xu</b> nhưng phải chờ tới $k = ' + DELAY + '$. Mục 1.4.2.</p>' +
      '<div class="ctrl"><label for="gam">$\\gamma$ =</label><span class="val" id="gam-val"></span><input id="gam" type="range" min="0" max="1" step="0.01" value="0.9"></div>' +
      '<div class="chart" id="gam-chart"></div><div class="tiles" id="gam-tiles"></div><div class="insight" id="gam-ins"></div></section>');
    root.appendChild(b3);
    var gamInput = b3.querySelector('#gam');
    var cross = Math.pow(0.1, 1 / DELAY);
    function drawGamma() {
      var g = +gamInput.value, vals = [];
      for (var k = 0; k <= K; k++) vals.push(Math.pow(g, k));
      b3.querySelector('#gam-val').textContent = fmtNum(g, 2);
      columnChart(b3.querySelector('#gam-chart'), {
        values: vals, color: cssVar(root, '--s1'), xLabel: 'Bước <tspan font-style="italic">k</tspan>', typeset: ctx.typeset, aria: 'Trọng số chiết khấu theo bước',
        highlight: { i: DELAY, label: 'B: 10 xu' }, fmtY: function (v, full) { return fmtNum(v, full ? 3 : 1); }
      });
      var gA = 1, gB = 10 * Math.pow(g, DELAY);
      var maze = g >= 1 ? -16 : -(1 - Math.pow(g, 16)) / (1 - g);
      b3.querySelector('#gam-tiles').innerHTML =
        '<div class="tile' + (gA > gB ? ' win' : '') + '"><div class="lbl">Lựa chọn A: 1 xu ngay</div><div class="num">$G = 1$</div><div class="sub">' + (gA > gB ? 'tác tử chọn A' : '&nbsp;') + '</div></div>' +
        '<div class="tile' + (gB >= gA ? ' win' : '') + '"><div class="lbl">Lựa chọn B: 10 xu sau ' + DELAY + ' bước</div><div class="num">$G = 10\\gamma^{' + DELAY + '} = ' + fmtNum(gB, 2).replace(',', '{,}') + '$</div><div class="sub">' + (gB >= gA ? 'tác tử chọn B' : '&nbsp;') + '</div></div>' +
        '<div class="tile"><div class="lbl"><span>Mê cung: giá trị ô xuất phát (16 bước, mỗi bước $-1$)</span></div><div class="num">$V = ' + tex(maze, 2) + '$</div><div class="sub">$V = -\\sum_{k=0}^{15} \\gamma^{k}$</div></div>';
      b3.querySelector('#gam-ins').innerHTML = 'Điểm hòa: $10\\gamma^{' + DELAY + '} = 1 \\Leftrightarrow \\gamma = 0{,}1^{1/' + DELAY + '} \\approx ' + fmtNum(cross, 3).replace(',', '{,}') + '$. ' +
        (g < cross ? 'Với $\\gamma$ nhỏ, tác tử <b>thiển cận</b>: 10 xu ở xa bị chiết khấu quá mạnh nên chọn 1 xu ngay.' :
          'Với $\\gamma$ đủ lớn, tác tử <b>nhìn xa</b>: chịu chờ để lấy phần thưởng lớn hơn.') +
        ' Khi $\\gamma = 1$, giá trị ô xuất phát của mê cung đúng bằng $-16$ như trong sách.';
      ctx.typeset(b3);
    }
    var pendingG = false;
    gamInput.addEventListener('input', function () {
      if (pendingG) return; pendingG = true;
      requestAnimationFrame(function () { pendingG = false; drawGamma(); });
    });

    ctx.typeset(root);
    drawEps(); drawGamma();
    onResize(function () { drawEps(); drawGamma(); });
  }

  // ======================================================================
  // TAB "Sơ đồ"
  // ======================================================================
  var NB = 'https://github.com/nmc2004nd/easy-rl-vi/blob/main/notebooks/';

  function renderMap(root, ctx) {
    root.innerHTML = '';
    root.classList.add('rx');

    // ---- 1. Vòng tương tác ----
    var b1 = h('<section class="blk"><h2>1. Vòng tương tác tác tử – môi trường</h2>' +
      '<p class="lead">Mọi bài toán học tăng cường đều là vòng lặp này. Mục 1.2.1.</p>' +
      '<div class="loop">' +
        '<div class="box" id="lp-agent"><h3>Tác tử</h3><div class="chips"><span class="chip">Chính sách $\\pi$</span><span class="chip">Hàm giá trị $V, Q$</span><span class="chip">Mô hình (tùy chọn)</span></div></div>' +
        '<div class="wire">' +
          '<div id="lp-act"><div>hành động $a_t$</div><svg viewBox="0 0 100 22" preserveAspectRatio="none"><path d="M2 11H94M86 4L96 11L86 18"/><circle class="dot" r="4" cy="11" cx="10"><animate attributeName="cx" from="6" to="90" dur="1.4s" repeatCount="indefinite"/></circle></svg></div>' +
          '<div id="lp-obs"><svg viewBox="0 0 100 22" preserveAspectRatio="none"><path d="M98 11H6M14 4L4 11L14 18"/><circle class="dot" r="4" cy="11" cx="90"><animate attributeName="cx" from="94" to="10" dur="1.4s" repeatCount="indefinite"/></circle></svg><div>trạng thái $s_{t+1}$, phần thưởng $r_{t+1}$</div></div>' +
        '</div>' +
        '<div class="box" id="lp-env"><h3>Môi trường</h3><div class="chips"><span class="chip">$p(s_{t+1} \\mid s_t, a_t)$</span><span class="chip">$R(s_t, a_t)$</span></div></div>' +
      '</div>' +
      '<ol class="steps"><li>Tác tử nhận trạng thái (hoặc quan sát) $s_t$.</li><li>Tác tử chọn hành động $a_t \\sim \\pi(a \\mid s_t)$ và gửi cho môi trường.</li>' +
      '<li>Môi trường chuyển sang trạng thái mới theo xác suất chuyển, tính phần thưởng.</li><li>Môi trường trả về $s_{t+1}$ và $r_{t+1}$; tác tử dùng chúng để học, rồi lặp lại ở bước thời gian tiếp theo.</li></ol>' +
      '<div class="ctrl"><button class="btn" id="lp-toggle">Tạm dừng</button><span class="muted" style="font-size:.85rem">Mục tiêu: tối đa hóa $\\mathbb{E}\\left[\\sum_k \\gamma^k r_{t+k+1}\\right]$, không phải phần thưởng của một bước.</span></div></section>');
    root.appendChild(b1);
    var stepEls = b1.querySelectorAll('.steps li'), step = 0, playing = true, timer = null;
    function showStep() {
      stepEls.forEach(function (li, i) { li.classList.toggle('on', i === step); });
      b1.querySelector('#lp-agent').classList.toggle('on', step === 0 || step === 1);
      b1.querySelector('#lp-env').classList.toggle('on', step === 2);
      b1.querySelector('#lp-act').classList.toggle('on', step === 1);
      b1.querySelector('#lp-obs').classList.toggle('on', step === 3);
    }
    function tick() { step = (step + 1) % 4; showStep(); }
    function play() { clearInterval(timer); timer = setInterval(tick, 1800); }
    b1.querySelector('#lp-toggle').onclick = function () {
      playing = !playing; this.textContent = playing ? 'Tạm dừng' : 'Chạy tiếp';
      if (playing) play(); else clearInterval(timer);
    };
    stepEls.forEach(function (li, i) { li.style.cursor = 'pointer'; li.onclick = function () { step = i; showStep(); if (playing) play(); }; });
    showStep(); play();

    // ---- 2. Venn: các loại tác tử ----
    var REG = {
      v:   { t: 'Dựa trên giá trị (value-based), không mô hình', d: 'Học tường minh hàm giá trị ($V$ hoặc $Q$); chính sách được <b>suy ra ngầm</b>: chọn $a$ có $Q(s, a)$ lớn nhất. Hợp với không gian hành động rời rạc.', ex: [['Q-learning', 'Q-learning/QLearning_vi.ipynb'], ['Sarsa', 'Sarsa_vi.ipynb'], ['DQN', 'DQN_vi.ipynb']] },
      p:   { t: 'Dựa trên chính sách (policy-based), không mô hình', d: 'Học <b>trực tiếp</b> chính sách $\\pi(a \\mid s)$, cho ra xác suất các hành động; không học hàm giá trị. Dùng được cho hành động liên tục.', ex: [['Gradient chính sách (REINFORCE)', 'PolicyGradient_vi.ipynb']] },
      vp:  { t: 'Diễn viên-nhà phê bình (actor-critic), không mô hình', d: 'Học <b>cả hai</b>: diễn viên là chính sách chọn hành động, nhà phê bình là hàm giá trị đánh giá hành động đó. Thường học nhanh và ổn định hơn gradient chính sách thuần.', ex: [['A2C', 'A2C_vi.ipynb'], ['PPO', 'PPO_vi.ipynb'], ['DDPG', 'DDPG_vi.ipynb'], ['TD3', 'TD3_vi.ipynb'], ['SAC', 'SAC_vi.ipynb']] },
      m:   { t: 'Chỉ có mô hình: lập kế hoạch', d: 'Biết (hoặc đã học được) $p(s\' \\mid s, a)$ và $R(s, a)$ thì có thể <b>tính toán trong thế giới ảo</b> để tìm lời giải mà không cần thử ngoài môi trường thật. Xem mục 1.5 Học và lập kế hoạch.', ex: [['Lặp giá trị (value iteration)', 'Value%20Iteration/value_iteration_vi.ipynb']] },
      vm:  { t: 'Có mô hình + dựa trên giá trị', d: 'Dùng mô hình môi trường để <b>sinh thêm kinh nghiệm ảo</b> hoặc lập kế hoạch, kết hợp với việc học hàm giá trị. Ít cần tương tác thật hơn (hiệu quả dữ liệu), nhưng tổng quát hóa kém nếu mô hình lệch.', ex: [['Dyna-Q (ngoài sách)', null]] },
      pm:  { t: 'Có mô hình + dựa trên chính sách', d: 'Dùng mô hình để <b>thử chính sách trong thế giới ảo</b> rồi cải thiện chính sách. Có "khả năng tưởng tượng": dự đoán trước điều sắp xảy ra.', ex: [] },
      vpm: { t: 'Có mô hình + diễn viên-nhà phê bình', d: 'Đủ cả ba thành phần: mô hình, chính sách và hàm giá trị. Hình 1.20 trong sách đặt các phương pháp có mô hình ở phần giao với vòng "Mô hình".', ex: [] },
      out: { t: 'Nhấn vào một vùng', d: 'Sơ đồ này là hình 1.20 trong sách: mỗi tác tử có <b>một, hai hoặc cả ba</b> thành phần. Vùng nằm ngoài vòng "Mô hình" là <b>không mô hình (model-free)</b>; vùng giao với vòng "Mô hình" là <b>có mô hình (model-based)</b>.', ex: [] }
    };
    var C = { v: { x: 150, y: 125, r: 92 }, p: { x: 270, y: 125, r: 92 }, m: { x: 210, y: 228, r: 92 } };
    var b2 = h('<section class="blk"><h2>2. Các loại tác tử: tác tử có những thành phần nào?</h2>' +
      '<p class="lead">Nhấn vào từng vùng để xem tác tử loại đó học gì và thuật toán tiêu biểu (kèm notebook). Mục 1.4.4.</p>' +
      '<div class="venn-wrap"><div><div class="venn"></div><div class="venn-note">Phần nằm ngoài vòng "Mô hình" là không mô hình (model-free); phần giao với vòng "Mô hình" là có mô hình (model-based).</div></div><div class="detail" aria-live="polite"></div></div></section>');
    root.appendChild(b2);
    function vennSvg(sel) {
      var s = '<svg viewBox="0 0 420 352" role="img" aria-label="Sơ đồ Venn các loại tác tử"><defs>';
      ['v', 'p', 'm'].forEach(function (k) { s += '<clipPath id="cp-' + k + '"><circle cx="' + C[k].x + '" cy="' + C[k].y + '" r="' + C[k].r + '"/></clipPath>'; });
      if (sel && sel !== 'out') {
        var outs = ['v', 'p', 'm'].filter(function (k) { return sel.indexOf(k) < 0; });
        s += '<mask id="mk"><rect width="420" height="352" fill="#fff"/>' + outs.map(function (k) { return '<circle cx="' + C[k].x + '" cy="' + C[k].y + '" r="' + C[k].r + '" fill="#000"/>'; }).join('') + '</mask>';
      }
      s += '</defs>';
      var colors = { v: 'var(--s1)', p: 'var(--s2)', m: 'var(--s3)' };
      ['v', 'p', 'm'].forEach(function (k) { s += '<circle cx="' + C[k].x + '" cy="' + C[k].y + '" r="' + C[k].r + '" fill="' + colors[k] + '" fill-opacity=".10"/>'; });
      if (sel && sel !== 'out') {
        var g = '<rect width="420" height="352" fill="var(--accent)" fill-opacity=".35" mask="url(#mk)"/>';
        sel.split('').forEach(function (k) { g = '<g clip-path="url(#cp-' + k + ')">' + g + '</g>'; });
        s += g;
      }
      ['v', 'p', 'm'].forEach(function (k) { s += '<circle class="ring" cx="' + C[k].x + '" cy="' + C[k].y + '" r="' + C[k].r + '" stroke="' + colors[k] + '"/>'; });
      s += '<text class="ttl" x="96" y="26" text-anchor="middle">Hàm giá trị</text><text class="ttl" x="324" y="26" text-anchor="middle">Chính sách</text>' +
           '<text class="ttl" x="210" y="346" text-anchor="middle">Mô hình</text>';
      function lbl(x, y, a, b, cls) {
        return '<text class="' + (cls || 'rl') + '" x="' + x + '" y="' + (b ? y - 7 : y) + '" text-anchor="middle">' + a + '</text>' +
          (b ? '<text class="' + (cls || 'rl') + '" x="' + x + '" y="' + (y + 8) + '" text-anchor="middle">' + b + '</text>' : '');
      }
      s += lbl(103, 110, 'Dựa trên', 'giá trị') + lbl(317, 110, 'Dựa trên', 'chính sách') + lbl(210, 82, 'Actor-', 'critic') +
           lbl(160, 189, 'Mô hình', '+ giá trị', 'rl2') + lbl(258, 189, 'Mô hình', '+ chính sách', 'rl2') + lbl(210, 158, 'Đủ cả 3', null, 'rl2') +
           lbl(210, 278, 'Lập kế hoạch');
      s += '<rect class="hit" width="420" height="352" fill="transparent"/></svg>';
      return s;
    }
    var vsel = null;
    function regionAt(px, py) {
      var key = ['v', 'p', 'm'].filter(function (k) { var c = C[k]; return (px - c.x) * (px - c.x) + (py - c.y) * (py - c.y) <= c.r * c.r; }).join('');
      return key || 'out';
    }
    function drawVenn() {
      var box = b2.querySelector('.venn');
      box.innerHTML = vennSvg(vsel);
      var svg = box.querySelector('svg');
      svg.querySelector('.hit').addEventListener('click', function (ev) {
        var r = svg.getBoundingClientRect();
        vsel = regionAt((ev.clientX - r.left) * 420 / r.width, (ev.clientY - r.top) * 352 / r.height);
        drawVenn();
      });
      var R = REG[vsel] || REG.out;
      var det = b2.querySelector('.detail');
      det.innerHTML = '<h3>' + R.t + '</h3><div>' + R.d + '</div>' + (R.ex.length ? '<div class="ex">' + R.ex.map(function (e) {
        return e[1] ? '<a href="' + NB + e[1] + '" target="_blank" rel="noopener">' + e[0] + ' ↗</a>' : '<span>' + e[0] + '</span>';
      }).join('') + '</div>' : '');
      ctx.typeset(det);
    }
    drawVenn();

    // ---- 3. Mê cung: giá trị, chính sách, quan sát một phần ----
    var MAZE = [
      'S...#....',
      '.##.#.##.',
      '.#.....#.',
      '.#.###.#.',
      '...#...#G'
    ];
    var R = MAZE.length, Cn = MAZE[0].length, goal = null, start = null;
    for (var r = 0; r < R; r++) for (var c = 0; c < Cn; c++) { if (MAZE[r][c] === 'G') goal = [r, c]; if (MAZE[r][c] === 'S') start = [r, c]; }
    // khoảng cách ngắn nhất tới đích (BFS) → giá trị V = −khoảng cách (mỗi bước −1, γ = 1)
    var dist = MAZE.map(function (row) { return row.split('').map(function () { return Infinity; }); });
    var qq = [goal]; dist[goal[0]][goal[1]] = 0;
    var DIRS = [[-1, 0, '↑'], [1, 0, '↓'], [0, -1, '←'], [0, 1, '→']];
    while (qq.length) {
      var cu = qq.shift();
      DIRS.forEach(function (d) {
        var nr = cu[0] + d[0], nc = cu[1] + d[1];
        if (nr < 0 || nc < 0 || nr >= R || nc >= Cn || MAZE[nr][nc] === '#' || dist[nr][nc] !== Infinity) return;
        dist[nr][nc] = dist[cu[0]][cu[1]] + 1; qq.push([nr, nc]);
      });
    }
    var maxD = 0; dist.forEach(function (row) { row.forEach(function (d) { if (d !== Infinity && d > maxD) maxD = d; }); });
    function bestDir(r, c) {
      var best = null;
      DIRS.forEach(function (d) {
        var nr = r + d[0], nc = c + d[1];
        if (nr < 0 || nc < 0 || nr >= R || nc >= Cn || MAZE[nr][nc] === '#') return;
        if (!best || dist[nr][nc] < dist[r + best[0]][c + best[1]]) best = d;
      });
      return best;
    }
    var b3 = h('<section class="blk"><h2>3. Mê cung: giá trị, chính sách và quan sát một phần</h2>' +
      '<p class="lead">Mỗi bước nhận $-1$. Giá trị một ô $= -$(số bước ngắn nhất tới đích), giống hình 1.16–1.18. Nhấn vào một ô để đặt tác tử, rồi bấm "Đi" để tác tử đi theo ô lân cận có giá trị lớn nhất. Mục 1.4.3 và 1.2.3.</p>' +
      '<div class="ctrl"><div class="seg" role="group"><button data-mode="value" aria-pressed="true">Giá trị $V(s)$</button><button data-mode="policy" aria-pressed="false">Chính sách $\\pi(s)$</button><button data-mode="fog" aria-pressed="false">Quan sát một phần</button></div>' +
      '<button class="btn primary" id="mz-go">Đi</button></div>' +
      '<div class="maze"></div><div class="maze-note"></div></section>');
    root.appendChild(b3);
    var mode = 'value', agent = start.slice(), walking = null;
    var RAMP = ['--q100', '--q200', '--q300', '--q400', '--q500', '--q600'];
    function drawMaze() {
      var box = b3.querySelector('.maze');
      box.style.gridTemplateColumns = 'repeat(' + Cn + ', 1fr)';
      var html = '';
      for (var r = 0; r < R; r++) for (var c = 0; c < Cn; c++) {
        var ch = MAZE[r][c], isAg = agent[0] === r && agent[1] === c;
        if (ch === '#') { html += '<div class="cell wall" aria-hidden="true"></div>'; continue; }
        var d = dist[r][c];
        var step = Math.min(RAMP.length - 1, Math.floor((1 - d / (maxD + 1)) * RAMP.length));
        var bg = 'var(' + RAMP[step] + ')', fg = step >= 3 ? '#fff' : '#0b2a4f';
        var fog = mode === 'fog' && (Math.abs(r - agent[0]) > 1 || Math.abs(c - agent[1]) > 1);
        var inner = '';
        if (mode === 'value' || mode === 'fog') inner = d === 0 ? 'Đích' : '−' + d;
        if (mode === 'policy') inner = d === 0 ? 'Đích' : '<span class="arr">' + bestDir(r, c)[2] + '</span>';
        html += '<div class="cell' + (ch === 'G' ? ' goal' : '') + (fog ? ' fog' : '') + '" data-r="' + r + '" data-c="' + c + '" style="background:' + bg + ';color:' + fg + '" title="' + (d === 0 ? 'Đích' : 'V = −' + d) + '">' +
          inner + (isAg ? '<span class="ag" aria-label="tác tử"></span>' : '') + '</div>';
      }
      box.innerHTML = html;
      box.querySelectorAll('.cell[data-r]').forEach(function (cell) {
        cell.onclick = function () { if (walking) return; agent = [+cell.getAttribute('data-r'), +cell.getAttribute('data-c')]; drawMaze(); };
      });
      var d0 = dist[agent[0]][agent[1]];
      b3.querySelector('.maze-note').innerHTML =
        mode === 'value' ? 'Tác tử đang ở ô có $V = ' + (d0 ? '-' + d0 : '0') + '$. Ô càng đậm càng gần đích (giá trị càng lớn).' :
        mode === 'policy' ? 'Mũi tên là chính sách tốt nhất: ở mỗi ô đi sang ô lân cận có giá trị lớn nhất. Đây là cách <b>suy ra chính sách từ hàm giá trị</b>.' :
        'Tác tử chỉ <b>quan sát được ô $3 \\times 3$ quanh mình</b> (môi trường quan sát được một phần, POMDP). Trạng thái thật của cả mê cung bị che; thử bấm "Đi" và chú ý vùng nhìn thấy di chuyển theo tác tử.';
      ctx.typeset(b3.querySelector('.maze-note'));
    }
    b3.querySelectorAll('.seg button').forEach(function (bt) {
      bt.onclick = function () {
        mode = bt.getAttribute('data-mode');
        b3.querySelectorAll('.seg button').forEach(function (x) { x.setAttribute('aria-pressed', x === bt ? 'true' : 'false'); });
        drawMaze();
      };
    });
    b3.querySelector('#mz-go').onclick = function () {
      if (walking) return;
      walking = setInterval(function () {
        var d = dist[agent[0]][agent[1]];
        if (d === 0) { clearInterval(walking); walking = null; setTimeout(function () { agent = start.slice(); drawMaze(); }, 900); return; }
        var bd = bestDir(agent[0], agent[1]); agent = [agent[0] + bd[0], agent[1] + bd[1]]; drawMaze();
      }, 280);
    };
    ctx.typeset(b3.querySelector('.ctrl'));
    ctx.typeset(b3.querySelector('.lead'));
    drawMaze();

    // ---- 4. Không gian hành động ----
    var b4 = h('<section class="blk"><h2>4. Không gian hành động: rời rạc và liên tục</h2>' +
      '<p class="lead">Robot đi mê cung chỉ có 4 hướng (rời rạc, hữu hạn); robot có thể quay bất kỳ góc nào (liên tục, hành động là số thực). Mục 1.3.</p>' +
      '<div class="acts">' +
        '<div class="act"><b>Rời rạc</b>: $\\mathcal{A} = \\{\\uparrow, \\downarrow, \\leftarrow, \\rightarrow\\}$' +
          '<div class="pad"><span></span><button data-a="0" aria-label="lên">↑</button><span></span><button data-a="2" aria-label="trái">←</button><span></span><button data-a="3" aria-label="phải">→</button><span></span><button data-a="1" aria-label="xuống">↓</button><span></span></div>' +
          '<div class="muted" style="font-size:.85rem">Chỉ có <b>4</b> hành động, như Atari, cờ vây. Hợp với các phương pháp dựa trên giá trị (chọn $\\arg\\max_a Q(s,a)$).</div></div>' +
        '<div class="act"><b>Liên tục</b>: $a \\in [0^\\circ, 360^\\circ)$' +
          '<svg viewBox="-70 -70 140 140" aria-label="Hướng quay"><circle r="60" fill="none" stroke="var(--border)" stroke-width="2"/><g id="dial"><line x1="0" y1="0" x2="0" y2="-50" stroke="var(--s2)" stroke-width="4" stroke-linecap="round"/><path d="M0 -60 L-7 -46 L7 -46 Z" fill="var(--s2)"/></g><circle r="5" fill="var(--text)"/></svg>' +
          '<div class="ctrl" style="margin:0"><input id="ang" type="range" min="0" max="359.9" step="0.1" value="45"><span class="val" id="ang-val"></span></div>' +
          '<div class="muted" style="font-size:.85rem">Có <b>vô số</b> hành động, như góc lái, mô-men khớp robot. Không thể duyệt hết để lấy $\\arg\\max$, nên hay dùng phương pháp dựa trên chính sách hoặc actor-critic.</div></div>' +
      '</div></section>');
    root.appendChild(b4);
    b4.querySelectorAll('.pad button').forEach(function (bt) {
      bt.onclick = function () { b4.querySelectorAll('.pad button').forEach(function (x) { x.classList.toggle('sel', x === bt); }); };
    });
    var ang = b4.querySelector('#ang');
    function drawAng() {
      b4.querySelector('#dial').setAttribute('transform', 'rotate(' + ang.value + ')');
      b4.querySelector('#ang-val').textContent = fmtNum(+ang.value, 1) + '°';
    }
    ang.addEventListener('input', drawAng); drawAng();
    ctx.typeset(b4);
    ctx.typeset(b1); ctx.typeset(b2.querySelector('.lead'));
  }

  window.ReviewExtras = {
    tabs: [
      { id: 'lab', label: 'Thí nghiệm', render: renderLab },
      { id: 'map', label: 'Sơ đồ', render: renderMap }
    ]
  };
})();
