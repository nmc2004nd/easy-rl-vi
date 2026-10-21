/* Thí nghiệm tương tác và sơ đồ trực quan cho chương 2 (MDP).
 * Trang index.html tải file này khi ch2.json có "extras": "ch2-extras.js".
 * File đăng ký window.ReviewExtras = { tabs: [{ id, label, render(el, ctx) }] }.
 */
(function () {
  'use strict';

  // ---------- CSS ----------
  var css = String.raw`
  .rx { --s1:#2a78d6; --s2:#eb6834; --s3:#1baf7a;
        --q100:#cde2fb; --q200:#9ec5f4; --q300:#6da7ec; --q400:#3987e5; --q500:#256abf; --q600:#184f95; --term:#c9cfd6; }
  @media (prefers-color-scheme: dark) {
    :root:where(:not([data-theme="light"])) .rx { --s1:#3987e5; --s2:#d95926; --s3:#199e70; --term:#3a4552; }
  }
  :root[data-theme="dark"] .rx { --s1:#3987e5; --s2:#d95926; --s3:#199e70; --term:#3a4552; }
  .rx section.blk { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; box-shadow: var(--shadow); padding: 20px; margin-bottom: 16px; }
  .rx h2 { margin: 0 0 4px; font-size: 1.1rem; }
  .rx h3.sub { margin: 18px 0 4px; font-size: .98rem; }
  .rx .lead { color: var(--muted); margin: 0 0 12px; font-size: .93rem; }
  .rx .ctrl { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 12px; margin: 10px 0; }
  .rx .ctrl label { font-weight: 600; font-size: .92rem; }
  .rx input[type=range] { flex: 1; min-width: 150px; accent-color: var(--s1); }
  .rx .val { font-variant-numeric: tabular-nums; font-weight: 700; min-width: 3em; }
  .rx .rxs { font-size: .88rem; color: var(--muted); font-variant-numeric: tabular-nums; }
  .rx .rxs b { color: var(--text); }
  .rx .legend { display: flex; flex-wrap: wrap; gap: 6px 16px; font-size: .85rem; margin: 6px 0 4px; }
  .rx .legend .li { display: inline-flex; align-items: center; gap: 6px; }
  .rx .sw { width: 12px; height: 3px; border-radius: 2px; display: inline-block; flex: none; }
  .rx .sw.box { height: 10px; border-radius: 3px; }
  .rx .chart { position: relative; width: 100%; }
  .rx .chart svg { display: block; width: 100%; overflow: visible; }
  .rx .chart text { fill: var(--muted); font-size: 11px; font-family: inherit; }
  .rx .grid line { stroke: var(--border); stroke-width: 1; }
  .rx .tip { position: absolute; pointer-events: none; background: var(--surface); border: 1px solid var(--border); border-radius: 8px;
             box-shadow: var(--shadow); padding: 6px 10px; font-size: .8rem; white-space: nowrap; display: none; z-index: 2; }
  .rx .insight { background: var(--accent-soft); border-radius: 12px; padding: 10px 14px; font-size: .92rem; margin-top: 10px; }
  .rx .seg { display: inline-flex; background: var(--surface-2); border-radius: 10px; padding: 3px; gap: 3px; flex-wrap: wrap; }
  .rx .seg button { border: 0; background: transparent; color: var(--muted); font: inherit; font-weight: 600; font-size: .86rem; padding: 6px 12px; border-radius: 8px; cursor: pointer; }
  .rx .seg button[aria-pressed=true] { background: var(--surface); color: var(--text); box-shadow: var(--shadow); }
  /* chuỗi 7 trạng thái */
  .rx .chain { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; margin: 8px 0 4px; }
  .rx .st { text-align: center; }
  .rx .st .node { width: 44px; height: 44px; margin: 0 auto; border-radius: 50%; border: 2px solid var(--border); display: grid; place-items: center;
                  font-weight: 700; background: var(--surface); transition: background .2s, border-color .2s; }
  .rx .st .node.on { border-color: var(--s2); background: var(--s2); color: #fff; }
  .rx .st .rw { font-size: .78rem; color: var(--muted); margin-top: 4px; }
  .rx .st .rw b { color: var(--text); }
  .rx .traj { font-size: .85rem; color: var(--muted); min-height: 1.6em; margin-top: 6px; word-break: break-word; }
  /* lưới 4x4 */
  .rx .gw { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; max-width: 380px; margin: 10px auto 0; }
  .rx .gc { aspect-ratio: 1; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;
            font-variant-numeric: tabular-nums; transition: background .2s, color .2s; }
  .rx .gc .v { font-weight: 700; font-size: .95rem; }
  .rx .gc .id { position: absolute; top: 3px; left: 6px; font-size: .65rem; opacity: .7; }
  .rx .gc .ar { font-size: .78rem; line-height: 1; letter-spacing: 1px; margin-top: 2px; min-height: 1em; }
  .rx .gc.term { background: var(--term); color: var(--text); }
  .rx .gw-note { font-size: .85rem; color: var(--muted); text-align: center; margin-top: 8px; min-height: 2.6em; }
  /* bậc thang MP → MRP → MDP */
  .rx .ladder { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .rx .rung { background: var(--surface-2); border-radius: 12px; padding: 12px; }
  .rx .rung h3 { margin: 0 0 2px; font-size: .98rem; }
  .rx .rung .tp { font-size: .9rem; margin-bottom: 6px; }
  .rx .rung svg { width: 100%; height: auto; display: block; margin: 4px 0; }
  .rx .rung svg text { font-family: KaTeX_Main, 'Times New Roman', serif; font-size: 12px; fill: var(--muted); }
  .rx .rung svg .mi { font-family: KaTeX_Math, 'Times New Roman', serif; font-style: italic; }
  .rx .rung .meta { font-size: .82rem; color: var(--muted); }
  .rx .plus { font-size: .82rem; color: var(--accent-text); font-weight: 600; margin-bottom: 4px; }
  .rx .bridge { margin-top: 10px; background: var(--accent-soft); border-radius: 12px; padding: 10px 14px; font-size: .92rem; }
  /* sơ đồ backup */
  .rx .bk-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .rx .bk { position: relative; max-width: 560px; min-width: 500px; margin: 6px auto 0; }
  .rx .bk-hint { display: none; font-size: .8rem; color: var(--muted); text-align: center; }
  @media (max-width: 600px) { .rx .bk-hint { display: block; } }
  .rx .bk svg { width: 100%; display: block; }
  .rx .bk .lab { position: absolute; transform: translate(-50%, -50%); font-size: .8rem; white-space: nowrap; background: var(--surface); padding: 0 3px; border-radius: 4px; }
  .rx .bk .lab.val { font-weight: 700; font-size: .85rem; }
  .rx .bk .lab.nm { background: transparent; font-size: .95rem; }
  .rx .bk .lab.hl { color: var(--accent-text); }
  .rx .bk-calc { font-size: .9rem; margin-top: 8px; overflow-x: auto; }
  /* bản đồ thuật toán */
  .rx .lanes { display: grid; gap: 12px; }
  .rx .lane { border: 1px solid var(--border); border-radius: 12px; padding: 12px; }
  .rx .lane .lt { font-weight: 700; margin-bottom: 8px; }
  .rx .lane .lt span { font-weight: 500; color: var(--muted); font-size: .85rem; }
  .rx .flow { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
  .rx .fb { background: var(--surface-2); border-radius: 10px; padding: 6px 10px; font-size: .88rem; text-align: center; }
  .rx .fb.eq { background: var(--accent-soft); }
  .rx .fa { color: var(--muted); font-size: 1.1rem; }
  .rx .cycle { display: inline-flex; flex-direction: column; align-items: center; gap: 2px; background: var(--surface-2); border-radius: 12px; padding: 6px 10px; font-size: .86rem; }
  .rx .cycle .row { display: flex; align-items: center; gap: 8px; margin: 0; }
  @media (max-width: 600px) {
    .rx section.blk { padding: 16px 14px; }
    .rx .ladder { grid-template-columns: 1fr; }
    .rx .st .node { width: 36px; height: 36px; font-size: .85rem; }
    .rx .chain { gap: 3px; }
  }`;
  var styleEl = document.createElement('style'); styleEl.textContent = css; document.head.appendChild(styleEl);

  // ---------- tiện ích ----------
  function h(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }
  function fmtNum(x, d) { return x.toLocaleString('vi-VN', { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function tex(x, d) { return fmtNum(x, d).replace(',', '{,}').replace('−', '-'); }
  function cssVar(el, name) { return getComputedStyle(el).getPropertyValue(name).trim(); }
  function onResize(fn) {
    var last = window.innerWidth, t = null;
    window.addEventListener('resize', function () {
      if (window.innerWidth === last) return; last = window.innerWidth;
      clearTimeout(t); t = setTimeout(fn, 150);
    });
  }

  // Biểu đồ cột có vạch tham chiếu (giá trị ước lượng so với nghiệm đúng)
  function barChart(box, opt) {
    // opt: { labels, values, ref, yMin, yMax, yTicks, color, fmt, typeset }
    var W = Math.max(280, box.clientWidth), H = 210, m = { l: 36, r: 8, t: 12, b: 26 };
    var iw = W - m.l - m.r, ih = H - m.t - m.b, n = opt.values.length;
    var band = iw / n, bw = Math.min(24, band * 0.55);
    var y = function (v) { return m.t + ih - (v - opt.yMin) / (opt.yMax - opt.yMin) * ih; };
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (opt.aria || '') + '"><g class="grid">';
    opt.yTicks.forEach(function (v) { s += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(v) + '" y2="' + y(v) + '"/>'; });
    s += '</g>';
    opt.yTicks.forEach(function (v) { s += '<text x="' + (m.l - 6) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + fmtNum(v, 0) + '</text>'; });
    var base = y(Math.max(opt.yMin, 0));
    opt.values.forEach(function (v, i) {
      var cx = m.l + band * i + band / 2, top = y(v), x0 = cx - bw / 2;
      var hgt = Math.abs(base - top), r = Math.min(4, hgt), up = top < base;
      if (hgt > 0.5) {
        var d = up
          ? 'M' + x0 + ' ' + base + 'V' + (top + r) + 'Q' + x0 + ' ' + top + ' ' + (x0 + r) + ' ' + top + 'H' + (x0 + bw - r) + 'Q' + (x0 + bw) + ' ' + top + ' ' + (x0 + bw) + ' ' + (top + r) + 'V' + base + 'Z'
          : 'M' + x0 + ' ' + base + 'V' + (top - r) + 'Q' + x0 + ' ' + top + ' ' + (x0 + r) + ' ' + top + 'H' + (x0 + bw - r) + 'Q' + (x0 + bw) + ' ' + top + ' ' + (x0 + bw) + ' ' + (top - r) + 'V' + base + 'Z';
        s += '<path d="' + d + '" fill="' + opt.color + '"/>';
      }
      if (opt.ref) {
        var ry = y(opt.ref[i]);
        s += '<line x1="' + (cx - bw / 2 - 5) + '" x2="' + (cx + bw / 2 + 5) + '" y1="' + ry + '" y2="' + ry + '" stroke="var(--text)" stroke-width="2" stroke-linecap="round"/>';
      }
      s += '<text x="' + cx + '" y="' + (H - m.b + 16) + '" text-anchor="middle">' + opt.labels[i] + '</text>';
      s += '<rect class="hit" data-i="' + i + '" x="' + (m.l + band * i) + '" y="' + m.t + '" width="' + band + '" height="' + ih + '" fill="transparent"/>';
    });
    s += '</svg>';
    box.innerHTML = s + '<div class="tip"></div>';
    var svg = box.querySelector('svg'), tip = box.querySelector('.tip');
    svg.querySelectorAll('.hit').forEach(function (hit) {
      function show() {
        var i = +hit.getAttribute('data-i'), r = svg.getBoundingClientRect();
        tip.style.display = 'block';
        tip.innerHTML = opt.tip(i);
        if (opt.typeset) opt.typeset(tip);
        var left = (m.l + band * (i + 0.5)) / W * r.width + 10;
        if (left + tip.offsetWidth > r.width) left -= tip.offsetWidth + 20;
        tip.style.left = Math.max(0, left) + 'px'; tip.style.top = '0px';
      }
      hit.addEventListener('pointerenter', show); hit.addEventListener('pointerdown', show);
      hit.addEventListener('pointerleave', function () { tip.style.display = 'none'; });
    });
  }

  // Biểu đồ đường một chuỗi + đường tham chiếu (trung bình Monte Carlo hội tụ)
  function lineChart(box, opt) {
    var W = Math.max(280, box.clientWidth), H = 200, m = { l: 40, r: 12, t: 14, b: 32 };
    var iw = W - m.l - m.r, ih = H - m.t - m.b, vals = opt.values, n = Math.max(2, vals.length);
    var x = function (i) { return m.l + i / (n - 1) * iw; };
    var y = function (v) { return m.t + ih - (v - opt.yMin) / (opt.yMax - opt.yMin) * ih; };
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (opt.aria || '') + '"><g class="grid">';
    opt.yTicks.forEach(function (v) { s += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(v) + '" y2="' + y(v) + '"/>'; });
    s += '</g>';
    opt.yTicks.forEach(function (v) { s += '<text x="' + (m.l - 6) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + fmtNum(v, opt.dec || 1) + '</text>'; });
    s += '<text x="' + m.l + '" y="' + (H - m.b + 16) + '" text-anchor="start">1</text><text x="' + (W - m.r) + '" y="' + (H - m.b + 16) + '" text-anchor="end">' + vals.length + '</text>';
    s += '<text x="' + (m.l + iw / 2) + '" y="' + (H - 2) + '" text-anchor="middle">' + opt.xLabel + '</text>';
    s += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(opt.ref) + '" y2="' + y(opt.ref) + '" stroke="var(--text)" stroke-width="1"/>' +
         '<text x="' + (W - m.r) + '" y="' + (y(opt.ref) - 5) + '" text-anchor="end" style="fill:var(--text)">' + opt.refLabel + '</text>';
    if (vals.length) {
      var d = vals.map(function (v, i) { return (i ? 'L' : 'M') + x(vals.length === 1 ? 0 : i * (n - 1) / (vals.length - 1)).toFixed(1) + ' ' + y(Math.max(opt.yMin, Math.min(opt.yMax, v))).toFixed(1); }).join('');
      s += '<path d="' + d + '" fill="none" stroke="' + opt.color + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>';
      var lv = vals[vals.length - 1];
      s += '<circle cx="' + (W - m.r) + '" cy="' + y(Math.max(opt.yMin, Math.min(opt.yMax, lv))) + '" r="4" fill="' + opt.color + '" stroke="var(--surface)" stroke-width="2"/>';
    }
    s += '</svg>';
    box.innerHTML = s;
  }

  // Giải hệ tuyến tính A x = b (khử Gauss, ma trận nhỏ)
  function solve(A, b) {
    var n = b.length, M = A.map(function (row, i) { return row.concat([b[i]]); });
    for (var c = 0; c < n; c++) {
      var p = c;
      for (var r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
      var tmp = M[c]; M[c] = M[p]; M[p] = tmp;
      for (r = 0; r < n; r++) {
        if (r === c) continue;
        var f = M[r][c] / M[c][c];
        for (var k = c; k <= n; k++) M[r][k] -= f * M[c][k];
      }
    }
    return M.map(function (row, i) { return row[n] / row[i]; });
  }

  // ======================================================================
  // TAB "Thí nghiệm"
  // ======================================================================
  // MRP 7 trạng thái của hình 2.3/2.4: s1, s7 ở lại 0,6; trạng thái giữa sang trái 0,4, sang phải 0,4, ở lại 0,2
  var N = 7, R = [5, 0, 0, 0, 0, 0, 10];
  var P = [];
  for (var i = 0; i < N; i++) {
    var row = new Array(N).fill(0);
    if (i === 0) { row[0] = 0.6; row[1] = 0.4; }
    else if (i === N - 1) { row[N - 1] = 0.6; row[N - 2] = 0.4; }
    else { row[i - 1] = 0.4; row[i + 1] = 0.4; row[i] = 0.2; }
    P.push(row);
  }
  var LBL = ['s1', 's2', 's3', 's4', 's5', 's6', 's7'];

  function renderLab(root, ctx) {
    root.innerHTML = '';
    root.classList.add('rx');

    // ---- 1. Ba cách tính giá trị của MRP ----
    var b1 = h(String.raw`<section class="blk"><h2>1. Ba cách tính giá trị của quá trình phần thưởng Markov</h2>
      <p class="lead">Chuỗi 7 trạng thái của hình 2.3–2.4: $s_1$ và $s_7$ ở lại với xác suất 0,6; các trạng thái giữa sang trái 0,4, sang phải 0,4, ở lại 0,2. Phần thưởng $\boldsymbol{R} = [5, 0, 0, 0, 0, 0, 10]$. Mục 2.2.</p>
      <div class="chain" id="chain"></div>
      <div class="ctrl"><label for="g2">$\gamma$ =</label><span class="val" id="g2v"></span><input id="g2" type="range" min="0" max="0.95" step="0.05" value="0.5"></div>
      <h3 class="sub">a) Nghiệm giải tích $\boldsymbol{V} = (\boldsymbol{I} - \gamma \boldsymbol{P})^{-1} \boldsymbol{R}$</h3>
      <div class="rxs" id="exact"></div>
      <h3 class="sub">b) Quy hoạch động: lặp $V_{k+1}(s) = R(s) + \gamma \sum_{s'} p(s' \mid s)\, V_k(s')$</h3>
      <div class="ctrl"><button class="btn" id="dp1">Lặp 1 lần</button><button class="btn" id="dpall">Lặp đến hội tụ</button><button class="btn" id="dp0">Đặt lại</button><span class="rxs" id="dpst"></span></div>
      <div class="legend"><span class="li"><span class="sw box" style="background:var(--s1)"></span>$V_k$ (ước lượng hiện tại)</span><span class="li"><span class="sw" style="background:var(--text)"></span>nghiệm giải tích</span></div>
      <div class="chart" id="dpchart"></div>
      <h3 class="sub">c) Monte Carlo: thả thuyền giấy và lấy trung bình lợi tức</h3>
      <div class="ctrl"><label for="mcs">Bắt đầu từ</label><select id="mcs" class="btn"></select><button class="btn" id="mc1">Thả 1 thuyền</button><button class="btn" id="mc100">Thả 100 thuyền</button><button class="btn" id="mc0">Đặt lại</button></div>
      <div class="traj" id="traj"></div>
      <div class="chart" id="mcchart"></div>
      <div class="insight" id="ins1"></div></section>`);
    root.appendChild(b1);
    var gIn = b1.querySelector('#g2'), sel = b1.querySelector('#mcs');
    LBL.forEach(function (l, i) { var o = document.createElement('option'); o.value = i; o.textContent = 's' + (i + 1); if (i === 3) o.selected = true; sel.appendChild(o); });
    var gamma, exact, Vk, k, mcG = [], mcAvg = [], lastBoat = null;
    function exactV(g) {
      var A = P.map(function (r, i) { return r.map(function (p, j) { return (i === j ? 1 : 0) - g * p; }); });
      return solve(A, R);
    }
    function drawChain(highlight) {
      b1.querySelector('#chain').innerHTML = LBL.map(function (l, i) {
        return '<div class="st"><div class="node' + (i === highlight ? ' on' : '') + '">$s_{' + (i + 1) + '}$</div><div class="rw">$R = ' + R[i] + '$</div></div>';
      }).join('');
      ctx.typeset(b1.querySelector('#chain'));
    }
    function yRange() {
      var mx = Math.max.apply(null, exact.concat(Vk)) * 1.1, step = mx > 40 ? 20 : mx > 20 ? 10 : 5;
      var top = Math.max(step, Math.ceil(mx / step) * step), ticks = [];
      for (var t = 0; t <= top; t += step) ticks.push(t);
      return { top: top, ticks: ticks };
    }
    function drawExact() {
      b1.querySelector('#exact').innerHTML = exact.map(function (v, i) { return '$V(s_{' + (i + 1) + '}) = ' + tex(v, 2) + '$'; }).join(' · ');
      ctx.typeset(b1.querySelector('#exact'));
    }
    function drawDP() {
      var yr = yRange();
      barChart(b1.querySelector('#dpchart'), {
        labels: LBL, values: Vk, ref: exact, yMin: 0, yMax: yr.top, yTicks: yr.ticks, color: cssVar(root, '--s1'), typeset: ctx.typeset, aria: 'Giá trị ước lượng của quy hoạch động',
        tip: function (i) { return '$V_{' + k + '}(s_{' + (i + 1) + '}) = ' + tex(Vk[i], 3) + '$ · đúng: $' + tex(exact[i], 3) + '$'; }
      });
      var err = Math.max.apply(null, Vk.map(function (v, i) { return Math.abs(v - exact[i]); }));
      b1.querySelector('#dpst').innerHTML = 'Số lần lặp $k = ' + k + '$ · sai số lớn nhất $' + tex(err, 4) + '$';
      ctx.typeset(b1.querySelector('#dpst'));
    }
    function dpStep() {
      Vk = R.map(function (r, i) { return r + gamma * P[i].reduce(function (acc, p, j) { return acc + p * Vk[j]; }, 0); });
      k += 1;
    }
    function sampleReturn(start) {
      var s = start, G = 0, disc = 1, path = [s];
      for (var t = 0; t < 400; t++) {
        G += disc * R[s]; disc *= gamma;
        if (disc < 1e-6) break;
        var u = Math.random(), acc = 0, nx = s;
        for (var j = 0; j < N; j++) { acc += P[s][j]; if (u < acc) { nx = j; break; } }
        s = nx; if (path.length < 14) path.push(s);
      }
      return { G: G, path: path };
    }
    function drawMC(last) {
      var st = +sel.value, ref = exact[st];
      var mx = Math.max(ref * 1.6, Math.max.apply(null, mcAvg.concat([1])) * 1.15), step = mx > 40 ? 20 : mx > 20 ? 10 : mx > 8 ? 5 : mx > 4 ? 2 : 1;
      var top = Math.ceil(mx / step) * step, ticks = []; for (var t = 0; t <= top; t += step) ticks.push(t);
      lineChart(b1.querySelector('#mcchart'), {
        values: mcAvg, yMin: 0, yMax: top, yTicks: ticks, dec: 0, color: cssVar(root, '--s2'), xLabel: 'Số thuyền đã thả',
        ref: ref, refLabel: 'giá trị đúng ' + fmtNum(ref, 2), aria: 'Trung bình lợi tức Monte Carlo'
      });
      var traj = b1.querySelector('#traj');
      last = last || lastBoat;
      if (last) {
        traj.innerHTML = 'Thuyền vừa thả: $' + last.path.map(function (s) { return 's_{' + (s + 1) + '}'; }).join(' \\to ') + (last.path.length >= 14 ? ' \\to \\cdots' : '') +
          '$ · lợi tức $g = ' + tex(last.G, 2) + '$ · trung bình ' + mcG.length + ' thuyền: $' + tex(mcAvg[mcAvg.length - 1], 2) + '$';
      } else traj.innerHTML = 'Chưa thả thuyền nào. Bấm "Thả 1 thuyền" để xem một quỹ đạo.';
      ctx.typeset(traj);
    }
    function launch(n) {
      var last;
      for (var i = 0; i < n; i++) {
        last = sampleReturn(+sel.value); mcG.push(last.G);
        mcAvg.push(mcG.reduce(function (a, b) { return a + b; }, 0) / mcG.length);
      }
      lastBoat = last;
      drawChain(last.path[last.path.length - 1]);
      drawMC(last);
    }
    function resetMC() { mcG = []; mcAvg = []; lastBoat = null; drawChain(+sel.value); drawMC(null); }
    function setGamma() {
      gamma = +gIn.value; exact = exactV(gamma); Vk = new Array(N).fill(0); k = 0;
      b1.querySelector('#g2v').textContent = fmtNum(gamma, 2);
      drawExact(); drawDP(); resetMC();
      b1.querySelector('#ins1').innerHTML = 'Ba cách cho <b>cùng một đáp án</b>. Nghiệm giải tích chính xác nhưng tốn $O(N^3)$; quy hoạch động <b>lặp phương trình Bellman</b> (bootstrapping), sai số giảm theo cấp số nhân với tỉ lệ $\\gamma$; Monte Carlo <b>không cần biết</b> $\\boldsymbol{P}$, chỉ cần lấy mẫu quỹ đạo, nhưng trung bình dao động và hội tụ chậm. Thử tăng $\\gamma$: quy hoạch động cần nhiều vòng lặp hơn.';
      ctx.typeset(b1.querySelector('#ins1'));
    }
    gIn.addEventListener('input', setGamma);
    b1.querySelector('#dp1').onclick = function () { dpStep(); drawDP(); };
    b1.querySelector('#dpall').onclick = function () {
      var it = 0;
      (function run() {
        var before = Vk.slice(); dpStep(); drawDP(); it++;
        var d = Math.max.apply(null, Vk.map(function (v, i) { return Math.abs(v - before[i]); }));
        if (d > 1e-4 && it < 500) setTimeout(run, 60);
      })();
    };
    b1.querySelector('#dp0').onclick = function () { Vk = new Array(N).fill(0); k = 0; drawDP(); };
    b1.querySelector('#mc1').onclick = function () { launch(1); };
    b1.querySelector('#mc100').onclick = function () { launch(100); };
    b1.querySelector('#mc0').onclick = resetMC;
    sel.onchange = resetMC;
    ctx.typeset(b1.querySelector('.lead')); ctx.typeset(b1.querySelector('.ctrl')); b1.querySelectorAll('h3.sub, .legend').forEach(function (e) { ctx.typeset(e); });
    setGamma();

    // ---- 2. Thế giới lưới 4×4 ----
    var b2 = h(String.raw`<section class="blk"><h2>2. Thế giới lưới 4×4: đánh giá chính sách, lặp giá trị, lặp chính sách</h2>
      <p class="lead">Lưới của hình 2.18: hai ô xám (0 và 15) là trạng thái kết thúc, mỗi bước nhận $-1$, đi ra ngoài biên thì đứng yên, $\gamma = 1$. Mỗi lần bấm "Bước tiếp" là một lần cập nhật <b>đồng bộ</b> cho mọi ô. Mục 2.3.9–2.3.13.</p>
      <div class="ctrl"><div class="seg" role="group">
        <button data-m="pe" aria-pressed="true">Đánh giá chính sách ngẫu nhiên</button><button data-m="vi" aria-pressed="false">Lặp giá trị</button><button data-m="pi" aria-pressed="false">Lặp chính sách</button></div></div>
      <div class="ctrl"><button class="btn primary" id="gwstep">Bước tiếp</button><button class="btn" id="gwrun">Chạy đến hội tụ</button><button class="btn" id="gwreset">Đặt lại</button><span class="rxs" id="gwst"></span></div>
      <div class="insight" id="gweq" style="margin-top:0"></div>
      <div class="gw" id="gw"></div><div class="gw-note" id="gwnote"></div></section>`);
    root.appendChild(b2);
    var ACT = [[-1, 0, '↑'], [1, 0, '↓'], [0, -1, '←'], [0, 1, '→']];
    function isTerm(s) { return s === 0 || s === 15; }
    function nxt(s, a) { var r = Math.floor(s / 4) + ACT[a][0], c = s % 4 + ACT[a][1]; return (r < 0 || r > 3 || c < 0 || c > 3) ? s : r * 4 + c; }
    var mode = 'pe', V, pol, kk, phase, timer = null, conv = false;
    function uniformPol() { var p = []; for (var s = 0; s < 16; s++) p.push([0.25, 0.25, 0.25, 0.25]); return p; }
    function greedy(Vv) {
      var p = [];
      for (var s = 0; s < 16; s++) {
        var qs = ACT.map(function (_, a) { return -1 + Vv[nxt(s, a)]; }), mx = Math.max.apply(null, qs);
        var best = qs.map(function (q) { return Math.abs(q - mx) < 1e-9 ? 1 : 0; }), cnt = best.reduce(function (a, b) { return a + b; }, 0);
        p.push(best.map(function (b) { return b / cnt; }));
      }
      return p;
    }
    function evalSweep(Vv, pp) {
      var nv = Vv.slice(), d = 0;
      for (var s = 0; s < 16; s++) {
        if (isTerm(s)) continue;
        var v = 0; for (var a = 0; a < 4; a++) v += pp[s][a] * (-1 + Vv[nxt(s, a)]);
        d = Math.max(d, Math.abs(v - Vv[s])); nv[s] = v;
      }
      return { V: nv, d: d };
    }
    function viSweep(Vv) {
      var nv = Vv.slice(), d = 0;
      for (var s = 0; s < 16; s++) {
        if (isTerm(s)) continue;
        var v = -Infinity; for (var a = 0; a < 4; a++) v = Math.max(v, -1 + Vv[nxt(s, a)]);
        d = Math.max(d, Math.abs(v - Vv[s])); nv[s] = v;
      }
      return { V: nv, d: d };
    }
    var lastD = null;
    function reset() {
      clearTimeout(timer); timer = null;
      V = new Array(16).fill(0); pol = uniformPol(); kk = 0; phase = 'eval'; conv = false; lastD = null; drawGW();
    }
    function step() {
      if (conv) return false;
      if (mode === 'pe') {
        var r = evalSweep(V, pol); V = r.V; kk++; lastD = r.d; if (r.d < 1e-3) conv = true;
      } else if (mode === 'vi') {
        var r2 = viSweep(V); V = r2.V; kk++; lastD = r2.d; if (r2.d < 1e-9) conv = true;
      } else {
        if (phase === 'eval') { // đánh giá chính sách hiện tại đến hội tụ
          var it = 0, rr; do { rr = evalSweep(V, pol); V = rr.V; it++; } while (rr.d > 1e-4 && it < 2000);
          phase = 'improve'; lastD = it;
        } else {
          var np = greedy(V), same = np.every(function (row, s) { return row.every(function (p, a) { return Math.abs(p - pol[s][a]) < 1e-9; }); });
          pol = np; kk++; phase = 'eval'; if (same) conv = true;
        }
      }
      drawGW(); return !conv;
    }
    function arrowsOf(p) { return p.map(function (x, a) { return x > 0 ? ACT[a][2] : ''; }).join(''); }
    function drawGW() {
      var mn = Math.min.apply(null, V), RAMP = ['--q100', '--q200', '--q300', '--q400', '--q500', '--q600'];
      var showPol = mode === 'pi' || (mode === 'vi' && kk > 0);
      var dispPol = mode === 'pi' ? pol : greedy(V);
      b2.querySelector('#gw').innerHTML = V.map(function (v, s) {
        if (isTerm(s)) return '<div class="gc term"><span class="id">' + s + '</span><span class="v">0</span><span class="ar">kết thúc</span></div>';
        var t = mn < 0 ? v / mn : 0, step = Math.min(RAMP.length - 1, Math.floor((1 - t) * RAMP.length));
        var fg = step >= 3 ? '#fff' : '#0b2a4f';
        return '<div class="gc" style="background:var(' + RAMP[step] + ');color:' + fg + '"><span class="id">' + s + '</span><span class="v">' + fmtNum(v, Math.abs(v) >= 10 ? 1 : 2).replace('-', '−') + '</span>' +
          '<span class="ar">' + (showPol ? arrowsOf(dispPol[s]) : '') + '</span></div>';
      }).join('');
      var stt = b2.querySelector('#gwst'), note = b2.querySelector('#gwnote'), eq = b2.querySelector('#gweq');
      if (mode === 'pe') {
        eq.innerHTML = String.raw`$V_{k+1}(s) = \sum_{a} \pi(a \mid s) \left( -1 + V_k(s') \right)$ với $\pi(a \mid s) = 0{,}25$ cho cả 4 hướng (phương trình kỳ vọng Bellman).`;
        stt.innerHTML = 'Lần lặp $k = ' + kk + '$' + (lastD != null ? ' · thay đổi lớn nhất $' + tex(lastD, 3) + '$' : '') + (conv ? ' · <b>đã hội tụ</b>' : '');
        note.innerHTML = conv ? 'Hội tụ về $V_\\pi$ của chính sách ngẫu nhiên: ô 1 có giá trị khoảng $-14$, ô 3 khoảng $-22$, giống hình 2.18. Đi ngẫu nhiên thì trung bình rất lâu mới tới đích.' :
          'Giá trị <b>lan dần</b> từ hai ô kết thúc ra xa. Đánh giá chính sách cần khá nhiều lần lặp (thử "Chạy đến hội tụ").';
      } else if (mode === 'vi') {
        eq.innerHTML = String.raw`$V_{k+1}(s) = \max_{a} \left( -1 + V_k(s') \right)$ (phương trình tối ưu Bellman). Mũi tên là chính sách tham lam theo $V_k$.`;
        stt.innerHTML = 'Lần lặp $k = ' + kk + '$' + (lastD != null ? ' · thay đổi lớn nhất $' + tex(lastD, 3) + '$' : '') + (conv ? ' · <b>đã hội tụ</b>' : '');
        note.innerHTML = conv ? 'Hội tụ về $V^*$: giá trị $= -$(số bước ngắn nhất tới ô kết thúc). Bây giờ mũi tên mới là <b>chính sách tối ưu</b>.' :
          'Mỗi lần lặp giá trị đúng lan thêm <b>một bước</b>. Mũi tên ở bước trung gian <b>chưa có ý nghĩa</b>, chỉ đáng tin khi đã hội tụ.';
      } else {
        eq.innerHTML = String.raw`Xen kẽ: <b>đánh giá</b> $\pi_i$ đến hội tụ (phương trình kỳ vọng Bellman), rồi <b>cải thiện</b> $\pi_{i+1}(s) = \arg\max_a \left( -1 + V_{\pi_i}(s') \right)$.`;
        stt.innerHTML = 'Vòng cải thiện $i = ' + kk + '$ · bước tiếp theo: <b>' + (conv ? 'đã hội tụ' : phase === 'eval' ? 'đánh giá chính sách' : 'cải thiện chính sách') + '</b>' +
          (phase === 'improve' && lastD ? ' (vừa đánh giá xong sau ' + lastD + ' lần quét)' : '');
        note.innerHTML = conv ? 'Cải thiện thêm không làm chính sách đổi nữa: đã có <b>chính sách tối ưu</b>, cùng kết quả với lặp giá trị.' :
          'Mỗi vòng cho ra một <b>chính sách hoàn chỉnh</b>. Thường chỉ sau vài vòng là chính sách đã tối ưu.';
      }
      ctx.typeset(eq); ctx.typeset(stt); ctx.typeset(note);
    }
    b2.querySelectorAll('.seg button').forEach(function (bt) {
      bt.onclick = function () {
        mode = bt.getAttribute('data-m');
        b2.querySelectorAll('.seg button').forEach(function (x) { x.setAttribute('aria-pressed', x === bt ? 'true' : 'false'); });
        reset();
      };
    });
    b2.querySelector('#gwstep').onclick = function () { clearTimeout(timer); timer = null; step(); };
    b2.querySelector('#gwrun').onclick = function () {
      clearTimeout(timer);
      (function run() { if (step()) timer = setTimeout(run, mode === 'pe' ? 25 : 450); else timer = null; })();
    };
    b2.querySelector('#gwreset').onclick = reset;
    ctx.typeset(b2.querySelector('.lead'));
    reset();

    onResize(function () { drawDP(); drawMC(null); });
  }

  // ======================================================================
  // TAB "Sơ đồ"
  // ======================================================================
  function renderMap(root, ctx) {
    root.innerHTML = '';
    root.classList.add('rx');

    // ---- 1. Bậc thang MP → MRP → MDP ----
    function mini(kind) {
      // ba nút trạng thái; MRP có thêm phần thưởng; MDP có nút hành động (chấm đen). Chữ dùng font KaTeX cho giống công thức.
      var sv = function (i) { return '<tspan class="mi">s</tspan><tspan baseline-shift="sub" font-size="8">' + i + '</tspan>'; };
      var s = '<svg viewBox="0 0 220 120" aria-hidden="true"><defs><marker id="ah-' + kind + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" fill="var(--muted)"/></marker></defs>';
      var line = function (x1, y1, x2, y2) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#ah-' + kind + ')"/>'; };
      var txt = function (x, y, html, anchor, extra) { return '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') + '"' + (extra || '') + '>' + html + '</text>'; };
      var nodes;
      if (kind === 'mdp') {
        nodes = [[30, 50], [190, 50], [150, 102]];
        s += line(46, 46, 86, 34) + txt(64, 30, '<tspan class="mi">a</tspan>') + '<circle cx="94" cy="32" r="6" fill="var(--text)"/>' +
             line(100, 33, 172, 46) + txt(140, 30, '0,7') + line(99, 37, 138, 90) + txt(128, 66, '0,3', 'start');
      } else {
        nodes = [[30, 52], [110, 22], [190, 52]];
        s += line(45, 44, 93, 27) + txt(62, 28, '0,4') + line(127, 27, 175, 44) + txt(158, 28, '0,4') + line(172, 64, 48, 64) + txt(110, 80, '0,6');
      }
      nodes.forEach(function (n, i) {
        s += '<circle cx="' + n[0] + '" cy="' + n[1] + '" r="15" fill="var(--surface)" stroke="var(--s1)" stroke-width="2"/>' +
             txt(n[0], n[1] + 4, sv(i + 1), 'middle', ' style="fill:var(--text)"');
      });
      if (kind === 'mrp') {
        [[30, 52, 5], [110, 22, 0], [190, 52, 10]].forEach(function (r, i) {
          s += txt(r[0], i === 1 ? r[1] + 30 : r[1] + 32, '<tspan class="mi">R</tspan> = ' + r[2], 'middle', ' style="fill:var(--s2)"');
        });
      }
      return s + '</svg>';
    }
    var b1 = h(String.raw`<section class="blk"><h2>1. Bậc thang: quá trình Markov → MRP → MDP</h2>
      <p class="lead">Mỗi bậc thêm một thành phần. Mục 2.1–2.3.</p>
      <div class="ladder">
        <div class="rung"><h3>Quá trình Markov</h3><div class="tp">$\langle S, P \rangle$</div>MINI_MP<div class="meta">Trạng thái tự chuyển theo $p(s' \mid s)$. Chỉ có "dòng chảy", chưa có thưởng.</div></div>
        <div class="rung"><div class="plus">+ phần thưởng $R$, chiết khấu $\gamma$</div><h3>Quá trình phần thưởng Markov</h3><div class="tp">$\langle S, P, R, \gamma \rangle$</div>MINI_MRP<div class="meta"><b>Thuyền giấy trôi theo dòng</b>: nhận thưởng nhưng không điều khiển được. Có $V(s)$.</div></div>
        <div class="rung"><div class="plus">+ hành động $A$</div><h3>Quá trình quyết định Markov</h3><div class="tp">$\langle S, A, P, R, \gamma \rangle$</div>MINI_MDP<div class="meta"><b>Người lái đò</b>: chọn hành động $a$ (chấm đen), rồi môi trường chuyển theo $p(s' \mid s, a)$. Có $V_\pi$, $Q_\pi$.</div></div>
      </div>
      <div class="bridge">Cố định một chính sách $\pi$ thì MDP <b>trở về</b> MRP: $\;P_\pi(s' \mid s) = \sum_a \pi(a \mid s)\, p(s' \mid s, a)$, $\;r_\pi(s) = \sum_a \pi(a \mid s)\, R(s, a)$. Vì vậy đánh giá chính sách dùng lại được mọi công cụ của MRP.</div></section>`
      .replace('MINI_MP', mini('mp')).replace('MINI_MRP', mini('mrp')).replace('MINI_MDP', mini('mdp')));
    root.appendChild(b1);
    ctx.typeset(b1);

    // ---- 2. Sơ đồ backup có số ----
    var G = 0.9;
    var TREE = {
      a: [{ name: 'a_1', R: 1, kids: [{ p: 0.8, v: 4 }, { p: 0.2, v: 0 }] }, { name: 'a_2', R: 0, kids: [{ p: 0.5, v: 10 }, { p: 0.5, v: -2 }] }]
    };
    var b2 = h(String.raw`<section class="blk"><h2>2. Sơ đồ backup: giá trị đi ngược từ lá lên gốc</h2>
      <p class="lead">Vòng tròn rỗng là trạng thái, chấm đen là cặp trạng thái-hành động (hình 2.10–2.11). Ví dụ có số với $\gamma = 0{,}9$: tầng dưới tính $Q(s, a)$ từ $V(s')$, tầng trên tính $V(s)$ từ $Q$. Mục 2.3.5.</p>
      <div class="ctrl"><div class="seg" role="group"><button data-k="exp" aria-pressed="true">Kỳ vọng: $V_\pi$</button><button data-k="opt" aria-pressed="false">Tối ưu: $V^*$</button></div>
        <label for="pa">$\pi(a_1 \mid s)$ =</label><span class="val" id="pav"></span><input id="pa" type="range" min="0" max="1" step="0.05" value="0.6"></div>
      <div class="bk-scroll"><div class="bk" id="bk"></div></div><div class="bk-hint">← Vuốt ngang để xem hết sơ đồ →</div><div class="bk-calc" id="bkcalc"></div><div class="insight" id="bkins"></div></section>`);
    root.appendChild(b2);
    var bkMode = 'exp', paIn = b2.querySelector('#pa');
    function drawBackup() {
      var pa = +paIn.value, pis = [pa, 1 - pa];
      b2.querySelector('#pav').textContent = fmtNum(pa, 2);
      var Q = TREE.a.map(function (a) { return a.R + G * a.kids.reduce(function (acc, k) { return acc + k.p * k.v; }, 0); });
      var Vexp = pis[0] * Q[0] + pis[1] * Q[1], Vopt = Math.max(Q[0], Q[1]), best = Q[0] >= Q[1] ? 0 : 1;
      // toạ độ (viewBox 520 × 300)
      var root_ = [260, 40], an = [[140, 150], [380, 150]], leaves = [[50, 260], [200, 260], [320, 260], [470, 260]];
      var s = '<svg viewBox="0 0 520 300" aria-label="Sơ đồ backup">';
      an.forEach(function (p, i) {
        var hl = bkMode === 'opt' && i === best;
        s += '<line x1="' + root_[0] + '" y1="' + (root_[1] + 16) + '" x2="' + p[0] + '" y2="' + (p[1] - 8) + '" stroke="' + (hl ? 'var(--accent)' : 'var(--border)') + '" stroke-width="' + (hl ? 3 : 2) + '"/>';
        TREE.a[i].kids.forEach(function (k, j) {
          var lf = leaves[i * 2 + j];
          s += '<line x1="' + p[0] + '" y1="' + (p[1] + 8) + '" x2="' + lf[0] + '" y2="' + (lf[1] - 16) + '" stroke="var(--border)" stroke-width="2"/>';
        });
      });
      s += '<circle cx="' + root_[0] + '" cy="' + root_[1] + '" r="16" fill="var(--surface)" stroke="var(--s1)" stroke-width="2.5"/>';
      an.forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="8" fill="var(--text)"/>'; });
      leaves.forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="16" fill="var(--surface)" stroke="var(--s1)" stroke-width="2"/>'; });
      s += '</svg>';
      // nhãn HTML phủ lên SVG (để KaTeX hiển thị được)
      function lab(x, y, html, cls) { return '<div class="lab ' + (cls || '') + '" style="left:' + (x / 520 * 100) + '%;top:' + (y / 300 * 100) + '%">' + html + '</div>'; }
      var L = '';
      L += lab(root_[0], root_[1], '$s$', 'nm');
      L += lab(root_[0] + 96, root_[1], (bkMode === 'exp' ? '$V_\\pi(s) = ' + tex(Vexp, 3) + '$' : '$V^*(s) = ' + tex(Vopt, 2) + '$'), 'val hl');
      an.forEach(function (p, i) {
        L += lab((root_[0] + p[0]) / 2 + (i ? 30 : -30), (root_[1] + p[1]) / 2 - 4, bkMode === 'exp' ? '$\\pi(' + TREE.a[i].name + ' \\mid s) = ' + tex(pis[i], 2) + '$' : '$' + TREE.a[i].name + '$');
        L += lab(p[0] + (i ? 62 : -62), p[1], '$Q(s, ' + TREE.a[i].name + ') = ' + tex(Q[i], 2) + '$', 'val' + (bkMode === 'opt' && i === best ? ' hl' : ''));
        L += lab(p[0], p[1] + 26, '$R = ' + TREE.a[i].R + '$');
        TREE.a[i].kids.forEach(function (k, j) {
          var lf = leaves[i * 2 + j];
          L += lab((p[0] + lf[0]) / 2 + (j ? 22 : -22), (p[1] + lf[1]) / 2 + 4, '$p = ' + tex(k.p, 1) + '$');
          L += lab(lf[0], lf[1] + 28, "$V(s') = " + k.v + '$');
        });
      });
      var box = b2.querySelector('#bk');
      box.innerHTML = s + L;
      var calc = String.raw`$$\begin{aligned} Q(s, a_1) &= 1 + 0{,}9\,(0{,}8 \cdot 4 + 0{,}2 \cdot 0) = 3{,}88 \\ Q(s, a_2) &= 0 + 0{,}9\,(0{,}5 \cdot 10 + 0{,}5 \cdot (-2)) = 3{,}6 \\ ` +
        (bkMode === 'exp'
          ? 'V_\\pi(s) &= ' + tex(pis[0], 2) + ' \\cdot 3{,}88 + ' + tex(pis[1], 2) + ' \\cdot 3{,}6 = ' + tex(Vexp, 3)
          : 'V^*(s) &= \\max(3{,}88;\\ 3{,}6) = 3{,}88 \\quad \\Rightarrow \\quad \\pi^*(s) = a_1') + ' \\end{aligned}$$';
      b2.querySelector('#bkcalc').innerHTML = calc;
      b2.querySelector('#bkins').innerHTML = bkMode === 'exp'
        ? 'Phương trình <b>kỳ vọng</b> Bellman lấy <b>trung bình theo $\\pi$</b>. Kéo thanh trượt: $V_\\pi(s)$ thay đổi theo chính sách nhưng <b>không bao giờ vượt</b> $V^*(s) = 3{,}88$; bằng nhau khi $\\pi(a_1 \\mid s) = 1$.'
        : 'Phương trình <b>tối ưu</b> Bellman <b>lấy max</b> thay vì trung bình: chọn nhánh có $Q$ lớn nhất (tô xanh). Thanh trượt không ảnh hưởng $V^*$ vì $V^*$ không phụ thuộc chính sách đang dùng.';
      ctx.typeset(box); ctx.typeset(b2.querySelector('#bkcalc')); ctx.typeset(b2.querySelector('#bkins'));
    }
    b2.querySelectorAll('.seg button').forEach(function (bt) {
      bt.onclick = function () {
        bkMode = bt.getAttribute('data-k');
        b2.querySelectorAll('.seg button').forEach(function (x) { x.setAttribute('aria-pressed', x === bt ? 'true' : 'false'); });
        drawBackup();
      };
    });
    paIn.addEventListener('input', drawBackup);
    ctx.typeset(b2.querySelector('.lead')); ctx.typeset(b2.querySelector('.ctrl'));
    drawBackup();

    // ---- 3. Bản đồ các thuật toán quy hoạch động ----
    var b3 = h(String.raw`<section class="blk"><h2>3. Bản đồ thuật toán quy hoạch động (bảng 2.1)</h2>
      <p class="lead">Cả ba đều là <b>lập kế hoạch</b>: phải biết $p(s' \mid s, a)$ và $R(s, a)$. Khác nhau ở bài toán và phương trình Bellman dùng để lặp. Mục 2.3.6–2.3.14.</p>
      <div class="lanes">
        <div class="lane"><div class="lt">Dự đoán <span>(prediction): cho trước chính sách, tính giá trị</span></div>
          <div class="flow"><div class="fb">MDP + $\pi$</div><div class="fa">→</div><div class="fb eq">Đánh giá chính sách lặp<br>phương trình <b>kỳ vọng</b> Bellman</div><div class="fa">→</div><div class="fb">$V_\pi$</div></div></div>
        <div class="lane"><div class="lt">Điều khiển bằng lặp chính sách <span>(policy iteration)</span></div>
          <div class="flow"><div class="fb">MDP, $\pi_0$ tùy ý</div><div class="fa">→</div>
            <div class="cycle"><div class="row"><div class="fb eq">Đánh giá: tính $V_{\pi_i}$<br>(phương trình <b>kỳ vọng</b>)</div></div><div class="fa">⇅</div><div class="row"><div class="fb eq">Cải thiện: $\pi_{i+1} = \arg\max_a Q_{\pi_i}$<br>(tham lam)</div></div></div>
            <div class="fa">→</div><div class="fb">$V^*, \pi^*$<br><small>khi $\pi$ không đổi</small></div></div></div>
        <div class="lane"><div class="lt">Điều khiển bằng lặp giá trị <span>(value iteration)</span></div>
          <div class="flow"><div class="fb">MDP, $V_0 = 0$</div><div class="fa">→</div><div class="fb eq">Lặp $V_{k+1}(s) = \max_a \left( R + \gamma \sum p\, V_k \right)$<br>phương trình <b>tối ưu</b> Bellman</div><div class="fa">→</div><div class="fb">$V^*$, rồi rút chính sách<br>$\pi^*(s) = \arg\max_a Q^*(s, a)$</div></div></div>
      </div>
      <div class="insight">Khi <b>không biết</b> mô hình môi trường, không dùng được quy hoạch động; chương 3 sẽ học từ kinh nghiệm bằng Monte Carlo, Sarsa và Q-learning (Q-learning chính là phiên bản "lấy mẫu" của phương trình tối ưu Bellman).</div></section>`);
    root.appendChild(b3);
    ctx.typeset(b3);
  }

  // ---------- tab Mô phỏng: liên kết tới các trang docs/viz ----------
  var VIZ = [
    ['mrp-return.html', 'Mục 2.2', 'Lợi tức và giá trị trong MRP', 'Monte Carlo, quy hoạch động và nghiệm giải tích trên chuỗi 7 trạng thái.'],
    ['policy-eval.html', 'Mục 2.3.9', 'Đánh giá chính sách', 'Lặp (2.18) trên lưới 4×4 từng ô; đồng bộ so với tại chỗ.'],
    ['policy-iter.html', 'Mục 2.3.11', 'Lặp chính sách', 'Đánh giá ⇄ cải thiện; bảng $Q(s,a)$ và các ô đổi hướng.'],
    ['value-iter.html', 'Mục 2.3.12', 'Lặp giá trị', 'Làn sóng giá trị $V_1 \\to V_7$ và rút trích chính sách.'],
    ['gridworld.html', 'Mục 2.3.13', 'Sân chơi thế giới lưới', 'Tự vẽ bản đồ, chỉnh $\\gamma$ và xác suất trượt, so sánh hai thuật toán.']
  ];
  function renderViz(root, ctx) {
    root.classList.add('rx');
    var b = h('<section class="blk"><h2>Mô phỏng thuật toán</h2>' +
      '<p class="lead">Chạy từng bước các thuật toán của chương, kèm phép tính bằng số thật ở mỗi ô. Mở trong cùng tab; bấm “← Các mô phỏng” để quay lại danh sách.</p>' +
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
