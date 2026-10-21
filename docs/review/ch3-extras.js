/* Thí nghiệm tương tác và sơ đồ trực quan cho chương 3 (phương pháp dạng bảng).
 * Trang index.html tải file này khi ch3.json có "extras": "ch3-extras.js".
 * File đăng ký window.ReviewExtras = { tabs: [{ id, label, render(el, ctx) }] }.
 */
(function () {
  'use strict';

  // ---------- CSS ----------
  var css = String.raw`
  .rx { --s1:#2a78d6; --s2:#eb6834; --cliff:#4a5563; }
  @media (prefers-color-scheme: dark) {
    :root:where(:not([data-theme="light"])) .rx { --s1:#3987e5; --s2:#d95926; --cliff:#0b0e12; }
  }
  :root[data-theme="dark"] .rx { --s1:#3987e5; --s2:#d95926; --cliff:#0b0e12; }
  .rx section.blk { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; box-shadow: var(--shadow); padding: 20px; margin-bottom: 16px; }
  .rx h2 { margin: 0 0 4px; font-size: 1.1rem; }
  .rx h3.sub { margin: 18px 0 4px; font-size: .98rem; }
  .rx .lead { color: var(--muted); margin: 0 0 12px; font-size: .93rem; }
  .rx .ctrl { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 12px; margin: 10px 0; }
  .rx .ctrl label { font-weight: 600; font-size: .92rem; }
  .rx input[type=range] { flex: 1; min-width: 130px; accent-color: var(--s1); }
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
  /* chuỗi bước ngẫu nhiên */
  .rx .walk { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; margin: 10px 0 4px; }
  .rx .wn { text-align: center; }
  .rx .wn .node { width: 42px; height: 42px; margin: 0 auto; border-radius: 50%; border: 2px solid var(--border); display: grid; place-items: center;
                  font-weight: 700; background: var(--surface); transition: background .2s, border-color .2s, color .2s; }
  .rx .wn .node.term { border-radius: 10px; background: var(--surface-2); }
  .rx .wn .node.on { border-color: var(--hl, #c98a12); background: var(--hl, #c98a12); color: #fff; }
  .rx .wn .rw { font-size: .76rem; color: var(--muted); margin-top: 4px; }
  .rx .traj { font-size: .86rem; color: var(--muted); min-height: 1.6em; margin-top: 6px; word-break: break-word; }
  /* lưới vách đá */
  .rx .cliffs { display: grid; grid-template-columns: minmax(0, 1fr); gap: 14px; margin-top: 10px; }
  .rx .cbox .cap { font-size: .88rem; font-weight: 700; margin-bottom: 4px; display: flex; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
  .rx .cbox .cap span { font-weight: 500; color: var(--muted); font-variant-numeric: tabular-nums; }
  .rx .cg { display: grid; grid-template-columns: repeat(12, 1fr); gap: 2px; }
  .rx .cc { aspect-ratio: 1; border-radius: 4px; background: var(--surface-2); position: relative; display: grid; place-items: center;
            font-size: clamp(.5rem, 1.8vw, .8rem); font-weight: 700; line-height: 1; transition: background-color .2s; }
  .rx .cc.cliff { background: var(--cliff); color: #fff; }
  .rx .cc.fall { background: var(--s2); }
  .rx .cc .lb { position: absolute; top: 1px; left: 3px; font-size: .55rem; opacity: .75; }
  .rx .cc.agent::after { content: ""; position: absolute; width: 46%; height: 46%; border-radius: 50%; background: var(--hl, #c98a12); box-shadow: 0 0 0 2px var(--surface); }
  /* sơ đồ backup 2x2 */
  .rx .quad { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  .rx .qc { background: var(--surface-2); border-radius: 12px; padding: 10px 12px; }
  .rx .qc h3 { margin: 0; font-size: .98rem; }
  .rx .qc .ax { font-size: .78rem; color: var(--muted); }
  .rx .qc svg { width: 100%; max-width: 240px; display: block; margin: 6px auto; }
  .rx .qc .f { font-size: .82rem; overflow-x: auto; }
  .rx .chips { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
  .rx .chip { font-size: .74rem; font-weight: 700; border-radius: 6px; padding: 1px 7px; background: var(--surface); color: var(--muted); }
  .rx .chip.y { background: var(--accent-soft); color: var(--accent-text); }
  .rx .axes { display: flex; justify-content: space-between; font-size: .8rem; color: var(--muted); margin: 6px 2px 0; }
  .rx table.cmp { width: 100%; border-collapse: collapse; font-size: .88rem; }
  .rx table.cmp th, .rx table.cmp td { padding: 7px 6px; border-bottom: 1px solid var(--border); text-align: center; vertical-align: middle; }
  .rx table.cmp th:first-child, .rx table.cmp td:first-child { text-align: left; }
  .rx .tscroll { overflow-x: auto; }
  /* Sarsa vs Q-learning */
  .rx .tl { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin: 8px 0; }
  .rx .tk { border-radius: 8px; padding: 4px 10px; font-size: .9rem; background: var(--surface-2); border: 2px solid transparent; }
  .rx .tk.use { border-color: var(--s1); }
  .rx .tk.skip { opacity: .35; text-decoration: line-through; }
  .rx .qrow { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; max-width: 420px; }
  .rx .qa { background: var(--surface-2); border-radius: 10px; padding: 6px; text-align: center; font-variant-numeric: tabular-nums; border: 2px solid transparent; }
  .rx .qa .an { font-size: .78rem; color: var(--muted); }
  .rx .qa .qv { font-weight: 700; }
  .rx .qa.max { border-color: var(--s2); }
  .rx .qa.pick { background: var(--accent-soft); }
  .rx .two { display: grid; grid-template-columns: minmax(0, 1fr); gap: 10px; margin-top: 10px; }
  .rx .two > div { background: var(--surface-2); border-radius: 12px; padding: 8px 12px; overflow-x: auto; min-width: 0; }
  .rx .two h3 { margin: 0 0 2px; font-size: .95rem; }
  /* gia phả */
  .rx .lanes { display: grid; gap: 12px; }
  .rx .lane { border: 1px solid var(--border); border-radius: 12px; padding: 12px; }
  .rx .lane .lt { font-weight: 700; margin-bottom: 8px; }
  .rx .lane .lt span { font-weight: 500; color: var(--muted); font-size: .85rem; }
  .rx .flow { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
  .rx .fb { background: var(--surface-2); border-radius: 10px; padding: 6px 10px; font-size: .88rem; text-align: center; }
  .rx .fb.eq { background: var(--accent-soft); }
  .rx .fa { color: var(--muted); font-size: 1.1rem; }
  @media (max-width: 600px) {
    .rx section.blk { padding: 16px 12px; }
    .rx .wn .node { width: 34px; height: 34px; font-size: .85rem; }
    .rx .walk { gap: 3px; }
    .rx .quad { grid-template-columns: 1fr; }
    .rx .cc .lb { display: none; }
  }`;
  var styleEl = document.createElement('style'); styleEl.textContent = css; document.head.appendChild(styleEl);

  // ---------- tiện ích ----------
  function h(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }
  function fmtNum(x, d) { return x.toLocaleString('vi-VN', { minimumFractionDigits: d, maximumFractionDigits: d }); }
  // số trong công thức: bỏ số 0 thừa ở cuối, dấu phẩy thập phân viết {,} cho KaTeX
  function texRaw(x, d) { var v = +x.toFixed(d); return (v === 0 ? 0 : v).toLocaleString('vi-VN', { maximumFractionDigits: d }).replace(',', '{,}'); }
  function tex(x, d) { var s = texRaw(x, d); return x < 0 ? '(' + s + ')' : s; }
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

  // Biểu đồ nhiều đường với đường dọc theo chuột và chú giải nổi
  function multiLine(box, opt) {
    // opt: { series: [{ name, color, values }], yMin, yMax, yTicks, dec, xLabel, xFirst, tipFmt }
    var W = Math.max(280, box.clientWidth), H = 220, m = { l: 44, r: 12, t: 12, b: 34 };
    var iw = W - m.l - m.r, ih = H - m.t - m.b;
    var n = Math.max.apply(null, opt.series.map(function (s) { return s.values.length; }));
    var x = function (i) { return m.l + (n <= 1 ? 0 : i / (n - 1) * iw); };
    var y = function (v) { v = Math.max(opt.yMin, Math.min(opt.yMax, v)); return m.t + ih - (v - opt.yMin) / (opt.yMax - opt.yMin) * ih; };
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (opt.aria || '') + '"><g class="grid">';
    opt.yTicks.forEach(function (v) { s += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(v) + '" y2="' + y(v) + '"/>'; });
    s += '</g>';
    opt.yTicks.forEach(function (v) { s += '<text x="' + (m.l - 6) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + fmtNum(v, opt.dec || 0) + '</text>'; });
    s += '<text x="' + m.l + '" y="' + (H - m.b + 16) + '" text-anchor="start">' + (opt.xFirst || 1) + '</text><text x="' + (W - m.r) + '" y="' + (H - m.b + 16) + '" text-anchor="end">' + n + '</text>';
    s += '<text x="' + (m.l + iw / 2) + '" y="' + (H - 2) + '" text-anchor="middle">' + opt.xLabel + '</text>';
    opt.series.forEach(function (se) {
      if (!se.values.length) return;
      var d = se.values.map(function (v, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1); }).join('');
      s += '<path d="' + d + '" fill="none" stroke="' + se.color + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>';
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
      xh.setAttribute('x1', x(i)); xh.setAttribute('x2', x(i)); xh.style.display = '';
      var rows = [];
      opt.series.forEach(function (se, k) {
        var v = se.values[i];
        if (v == null) { dots[k].style.display = 'none'; return; }
        dots[k].setAttribute('cx', x(i)); dots[k].setAttribute('cy', y(v)); dots[k].style.display = '';
        rows.push('<span class="sw dot" style="background:' + se.color + '"></span> ' + se.name + ': <b>' + fmtNum(v, opt.tipDec == null ? 2 : opt.tipDec) + '</b>');
      });
      tip.innerHTML = '<div>' + opt.xLabel + ' ' + (i + (opt.xFirst || 1)) + '</div>' + rows.join('<br>');
      tip.style.display = 'block';
      var left = x(i) / W * r.width + 12;
      if (left + tip.offsetWidth > r.width) left -= tip.offsetWidth + 24;
      tip.style.left = Math.max(0, left) + 'px'; tip.style.top = '0px';
    }
    hit.addEventListener('pointermove', show); hit.addEventListener('pointerdown', show);
    hit.addEventListener('pointerleave', function () { tip.style.display = 'none'; xh.style.display = 'none'; dots.forEach(function (d) { d.style.display = 'none'; }); });
  }

  // ======================================================================
  // TAB "Thí nghiệm"
  // ======================================================================

  // ---- Bước ngẫu nhiên 5 trạng thái (Sutton & Barto, ví dụ 6.2) ----
  // trạng thái 0 và 6 là kết thúc; 1..5 = A..E; bắt đầu ở C; sang phải tới 6 được +1, mọi bước khác 0; γ = 1
  var WL = ['⊥', 'A', 'B', 'C', 'D', 'E', '⊥'];
  var TRUE_V = [0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 0];
  function rwEpisode(rand) {
    var s = 3, tr = [3];
    while (s > 0 && s < 6) { s += rand() < 0.5 ? -1 : 1; tr.push(s); }
    return tr;
  }
  function rms(V) { var e = 0; for (var i = 1; i <= 5; i++) e += (V[i] - TRUE_V[i]) * (V[i] - TRUE_V[i]); return Math.sqrt(e / 5); }
  function tdEpisode(V, tr, a, log) {
    for (var t = 0; t + 1 < tr.length; t++) {
      var s = tr[t], s2 = tr[t + 1], r = s2 === 6 ? 1 : 0, old = V[s];
      V[s] = old + a * (r + V[s2] - old);
      if (log) log.push({ s: s, s2: s2, r: r, old: old, v2: V[s2], nw: V[s] });
    }
  }
  function mcEpisode(V, tr, a, log) {
    var G = tr[tr.length - 1] === 6 ? 1 : 0; // γ = 1, phần thưởng duy nhất ở cuối nên G_t như nhau với mọi t
    for (var t = 0; t + 1 < tr.length; t++) {
      var s = tr[t], old = V[s];
      V[s] = old + a * (G - old);
      if (log) log.push({ s: s, G: G, old: old, nw: V[s] });
    }
  }
  function seeded(seed) {
    var st = seed >>> 0;
    return function () { st = (st + 0x6D2B79F5) >>> 0; var t = st; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }

  // ---- Vách đá 4×12 ----
  var CR = 4, CC = 12, CS = 36, CGOAL = 47;
  var DR = [-1, 0, 1, 0], DC = [0, 1, 0, -1], ARW = ['↑', '→', '↓', '←'];
  function isCliff(s) { var r = Math.floor(s / CC), c = s % CC; return r === 3 && c > 0 && c < 11; }
  function cliffStep(s, a) {
    var r = Math.floor(s / CC), c = s % CC;
    var nr = Math.min(CR - 1, Math.max(0, r + DR[a])), nc = Math.min(CC - 1, Math.max(0, c + DC[a])), ns = nr * CC + nc;
    if (isCliff(ns)) return { s: CS, r: -100, fell: ns };
    return { s: ns, r: -1 };
  }
  function argmaxAll(q) { var m = Math.max(q[0], q[1], q[2], q[3]), b = []; for (var a = 0; a < 4; a++) if (q[a] === m) b.push(a); return b; }
  function egreedy(Q, s, eps, rand) {
    if (rand() < eps) return Math.floor(rand() * 4);
    var b = argmaxAll(Q[s]); return b[Math.floor(rand() * b.length)];
  }
  function newQ() { var Q = []; for (var i = 0; i < CR * CC; i++) Q.push([0, 0, 0, 0]); return Q; }
  function trainCliff(alg, eps, alpha, E, rand) {
    var Q = newQ(), rets = [];
    for (var e = 0; e < E; e++) {
      var s = CS, a = egreedy(Q, s, eps, rand), tot = 0, n = 0;
      while (s !== CGOAL && n < 2000) {
        n++;
        var o = cliffStep(s, a), s2 = o.s, tgt, a2;
        tot += o.r;
        if (alg === 'sarsa') {
          a2 = egreedy(Q, s2, eps, rand);
          tgt = o.r + (s2 === CGOAL ? 0 : Q[s2][a2]);
          Q[s][a] += alpha * (tgt - Q[s][a]);
          s = s2; a = a2;
        } else {
          tgt = o.r + (s2 === CGOAL ? 0 : Math.max.apply(null, Q[s2]));
          Q[s][a] += alpha * (tgt - Q[s][a]);
          s = s2; a = egreedy(Q, s, eps, rand);
        }
      }
      rets.push(tot);
    }
    return { Q: Q, rets: rets };
  }
  function greedyPath(Q) {
    var s = CS, seen = {}, p = [];
    while (s !== CGOAL && !seen[s] && p.length < 60) {
      seen[s] = 1;
      var a = Q[s].indexOf(Math.max.apply(null, Q[s]));
      p.push({ s: s, a: a });
      var o = cliffStep(s, a);
      if (o.fell != null) return { steps: p, ok: false, fell: true };
      s = o.s;
    }
    return { steps: p, ok: s === CGOAL };
  }

  function renderLab(root, ctx) {
    root.innerHTML = '';
    root.classList.add('rx');

    // ---------------- 1. MC và TD trên bước ngẫu nhiên ----------------
    var b1 = h(String.raw`<section class="blk"><h2>1. Monte Carlo và TD trên bước ngẫu nhiên</h2>
      <p class="lead">Ví dụ 6.2 của Sutton & Barto (bổ sung của người dịch, minh họa mục 3.3). Bắt đầu ở $C$, mỗi bước sang trái hoặc phải với xác suất $0{,}5$; ra mép phải được $+1$, mép trái $0$; $\gamma = 1$. Giá trị thật: $V(A..E) = \tfrac{1}{6}, \tfrac{2}{6}, \ldots, \tfrac{5}{6}$. Cả hai bắt đầu với $V = 0{,}5$.</p>
      <div class="walk" id="rw-walk"></div>
      <div class="traj" id="rw-traj">Bấm “1 tập” để xem tác tử đi và hai phương pháp cập nhật.</div>
      <div class="ctrl"><label for="rw-atd">$\alpha$ của TD</label><input type="range" id="rw-atd" min="0.01" max="0.3" step="0.01" value="0.1"><span class="val" id="rw-atd-v"></span></div>
      <div class="ctrl"><label for="rw-amc">$\alpha$ của MC</label><input type="range" id="rw-amc" min="0.01" max="0.3" step="0.01" value="0.02"><span class="val" id="rw-amc-v"></span></div>
      <div class="ctrl"><button class="btn primary" id="rw-one">1 tập</button><button class="btn" id="rw-ten">+10 tập</button><button class="btn" id="rw-hund">+100 tập</button><button class="btn" id="rw-reset">Đặt lại</button></div>
      <div class="rxs" id="rw-stats"></div>
      <div class="legend"><span class="li"><span class="sw dot" style="background:var(--s1)"></span>TD(0)</span><span class="li"><span class="sw dot" style="background:var(--s2)"></span>Monte Carlo</span><span class="li"><span class="sw" style="background:var(--text);height:2px"></span>giá trị thật</span></div>
      <div class="chart" id="rw-chart"></div>
      <div class="calc" id="rw-calc"><span class="rxs">Phép tính của tập gần nhất sẽ hiện ở đây.</span></div>
      <h3 class="sub">Sai số trung bình qua 100 lần chạy</h3>
      <p class="lead">Sai số RMS giữa $V$ ước lượng và giá trị thật, lấy trung bình 100 lần chạy độc lập (mỗi lần 100 tập) với hai $\alpha$ đang chọn ở trên.</p>
      <div class="ctrl"><button class="btn" id="rw-avg">Chạy 100 lần</button></div>
      <div class="legend"><span class="li"><span class="sw" style="background:var(--s1)"></span>TD(0)</span><span class="li"><span class="sw" style="background:var(--s2)"></span>Monte Carlo</span></div>
      <div class="chart" id="rw-err"></div>
      <div class="insight" id="rw-ins">Quan sát: ở tập đầu tiên, TD <b>chỉ đổi một ô</b> (ô sát mép tập kết thúc), vì mọi ô khác có $r + V(s') - V(s) = 0 + 0{,}5 - 0{,}5 = 0$. MC thì đổi <b>mọi ô</b> đã đi qua, cùng về một hướng.</div>
      </section>`);
    root.appendChild(b1);
    var walk = b1.querySelector('#rw-walk');
    WL.forEach(function (l, i) {
      walk.appendChild(h('<div class="wn"><div class="node' + (i === 0 || i === 6 ? ' term' : '') + '">' + l + '</div><div class="rw">' + (i === 6 ? 'thưởng +1' : i === 0 ? 'thưởng 0' : '') + '</div></div>'));
    });
    var nodes = walk.querySelectorAll('.node');
    var aTD = b1.querySelector('#rw-atd'), aMC = b1.querySelector('#rw-amc');
    var Vtd, Vmc, eps, busy = false, timer = null;
    function resetRW() { clearTimeout(timer); busy = false; Vtd = [0, .5, .5, .5, .5, .5, 0]; Vmc = Vtd.slice(); eps = 0; drawRW(); b1.querySelector('#rw-calc').innerHTML = '<span class="rxs">Phép tính của tập gần nhất sẽ hiện ở đây.</span>'; b1.querySelector('#rw-traj').textContent = 'Bấm “1 tập” để xem tác tử đi và hai phương pháp cập nhật.'; nodes.forEach(function (n) { n.classList.remove('on'); }); }
    function drawRW() {
      b1.querySelector('#rw-atd-v').textContent = fmtNum(+aTD.value, 2);
      b1.querySelector('#rw-amc-v').textContent = fmtNum(+aMC.value, 2);
      b1.querySelector('#rw-stats').innerHTML = 'Số tập: <b>' + eps + '</b> · RMS của TD: <b>' + fmtNum(rms(Vtd), 3) + '</b> · RMS của MC: <b>' + fmtNum(rms(Vmc), 3) + '</b>';
      // biểu đồ chấm: mỗi trạng thái một cột, vạch là giá trị thật
      var box = b1.querySelector('#rw-chart'), W = Math.max(280, box.clientWidth), H = 190, m = { l: 36, r: 8, t: 10, b: 24 };
      var iw = W - m.l - m.r, ih = H - m.t - m.b, band = iw / 5;
      var y = function (v) { return m.t + ih - v * ih; };
      var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Giá trị ước lượng của TD và MC so với giá trị thật"><g class="grid">';
      [0, .25, .5, .75, 1].forEach(function (v) { s += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y(v) + '" y2="' + y(v) + '"/>'; });
      s += '</g>';
      [0, .25, .5, .75, 1].forEach(function (v) { s += '<text x="' + (m.l - 6) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + fmtNum(v, 2) + '</text>'; });
      for (var i = 1; i <= 5; i++) {
        var cx = m.l + band * (i - 0.5);
        s += '<line x1="' + (cx - 18) + '" x2="' + (cx + 18) + '" y1="' + y(TRUE_V[i]) + '" y2="' + y(TRUE_V[i]) + '" stroke="var(--text)" stroke-width="2" stroke-linecap="round"/>';
        s += '<line x1="' + (cx - 7) + '" x2="' + (cx - 7) + '" y1="' + y(TRUE_V[i]) + '" y2="' + y(Vtd[i]) + '" stroke="var(--s1)" stroke-width="1.5" opacity=".5"/>';
        s += '<line x1="' + (cx + 7) + '" x2="' + (cx + 7) + '" y1="' + y(TRUE_V[i]) + '" y2="' + y(Vmc[i]) + '" stroke="var(--s2)" stroke-width="1.5" opacity=".5"/>';
        s += '<circle cx="' + (cx - 7) + '" cy="' + y(Vtd[i]) + '" r="5" fill="var(--s1)" stroke="var(--surface)" stroke-width="2"/>';
        s += '<circle cx="' + (cx + 7) + '" cy="' + y(Vmc[i]) + '" r="5" fill="var(--s2)" stroke="var(--surface)" stroke-width="2"/>';
        s += '<text x="' + cx + '" y="' + (H - 6) + '" text-anchor="middle">' + WL[i] + '</text>';
        s += '<rect class="hit" data-i="' + i + '" x="' + (m.l + band * (i - 1)) + '" y="' + m.t + '" width="' + band + '" height="' + ih + '" fill="transparent"/>';
      }
      box.innerHTML = s + '</svg><div class="tip"></div>';
      var svg = box.querySelector('svg'), tip = box.querySelector('.tip');
      svg.querySelectorAll('.hit').forEach(function (hit) {
        function show() {
          var i = +hit.getAttribute('data-i'), r = svg.getBoundingClientRect();
          tip.innerHTML = '<b>' + WL[i] + '</b><br>thật: ' + fmtNum(TRUE_V[i], 3) + '<br><span class="sw dot" style="background:var(--s1)"></span> TD: ' + fmtNum(Vtd[i], 3) + '<br><span class="sw dot" style="background:var(--s2)"></span> MC: ' + fmtNum(Vmc[i], 3);
          tip.style.display = 'block';
          var left = (m.l + band * (i - 0.5)) / W * r.width + 22;
          if (left + tip.offsetWidth > r.width) left -= tip.offsetWidth + 44;
          tip.style.left = Math.max(0, left) + 'px'; tip.style.top = '0px';
        }
        hit.addEventListener('pointerenter', show); hit.addEventListener('pointerdown', show);
        hit.addEventListener('pointerleave', function () { tip.style.display = 'none'; });
      });
    }
    function trajText(tr, upto) {
      return 'Quỹ đạo: ' + tr.slice(0, upto + 1).map(function (s, k) { return k === tr.length - 1 ? WL[s] + (s === 6 ? ' (+1)' : ' (0)') : WL[s]; }).join(' → ');
    }
    function showCalc(tr, tdLog, mcLog) {
      var calc = b1.querySelector('#rw-calc'), a1 = +aTD.value, a2 = +aMC.value;
      calc.innerHTML = '<div class="rxs"><b>TD(0)</b>: cập nhật ngay sau mỗi bước, mục tiêu $r + V(s\')$. Các bước làm $V$ đổi:</div><div id="c-td"></div>' +
        '<div class="rxs" style="margin-top:6px"><b>Monte Carlo</b>: đợi hết tập, $G = ' + (tr[tr.length - 1] === 6 ? 1 : 0) + '$ cho mọi bước (vì $\\gamma = 1$, thưởng chỉ ở cuối). Lần thăm đầu của mỗi ô:</div><div id="c-mc"></div>';
      var tdl = tdLog.filter(function (u) { return Math.abs(u.nw - u.old) > 1e-12; });
      var tdTex = tdl.length ? tdl.slice(-3).map(function (u) {
        return 'V(' + WL[u.s] + ') \\leftarrow ' + texRaw(u.old, 3) + ' + ' + texRaw(a1, 2) + '\\,(' + u.r + ' + ' + texRaw(u.v2, 3) + ' - ' + texRaw(u.old, 3) + ') = ' + texRaw(u.nw, 3);
      }).join(' \\\\ ') : '\\text{không có ô nào đổi (mọi sai số TD bằng 0)}';
      if (tdl.length > 3) tdTex = '\\cdots \\\\ ' + tdTex;
      var seen = {}, mcl = mcLog.filter(function (u) { if (seen[u.s]) return false; seen[u.s] = 1; return true; });
      var mcTex = mcl.slice(0, 3).map(function (u) {
        return 'V(' + WL[u.s] + ') \\leftarrow ' + texRaw(u.old, 3) + ' + ' + texRaw(a2, 2) + '\\,(' + u.G + ' - ' + texRaw(u.old, 3) + ') = ' + texRaw(u.nw, 3);
      }).join(' \\\\ ') + (mcl.length > 3 ? ' \\\\ \\cdots' : '');
      katexBlock(calc.querySelector('#c-td'), '\\begin{array}{l}' + tdTex + '\\end{array}');
      katexBlock(calc.querySelector('#c-mc'), '\\begin{array}{l}' + mcTex + '\\end{array}');
      ctx.typeset(calc);
    }
    function oneEpisode() {
      if (busy) return;
      busy = true;
      var tr = rwEpisode(Math.random), tdLog = [], i = 0;
      var a1 = +aTD.value;
      (function tick() {
        nodes.forEach(function (n, k) { n.classList.toggle('on', k === tr[i]); });
        b1.querySelector('#rw-traj').textContent = trajText(tr, i);
        if (i > 0) {
          // TD cập nhật ngay khi vừa đi xong bước i-1 → i
          var s = tr[i - 1], s2 = tr[i], r = s2 === 6 ? 1 : 0, old = Vtd[s];
          Vtd[s] = old + a1 * (r + Vtd[s2] - old);
          tdLog.push({ s: s, s2: s2, r: r, old: old, v2: Vtd[s2], nw: Vtd[s] });
          drawRW();
        }
        if (i < tr.length - 1) { i++; timer = setTimeout(tick, tr.length > 14 ? 160 : 320); return; }
        var mcLog = []; mcEpisode(Vmc, tr, +aMC.value, mcLog);
        eps++; drawRW(); showCalc(tr, tdLog, mcLog); busy = false;
      })();
    }
    function many(k) {
      if (busy) return;
      for (var j = 0; j < k; j++) { var tr = rwEpisode(Math.random); tdEpisode(Vtd, tr, +aTD.value); mcEpisode(Vmc, tr, +aMC.value); eps++; }
      nodes.forEach(function (n) { n.classList.remove('on'); });
      b1.querySelector('#rw-traj').textContent = 'Đã chạy thêm ' + k + ' tập.';
      drawRW();
    }
    var errData = null;
    function runAvg() {
      var a1 = +aTD.value, a2 = +aMC.value, R = 100, E = 100, td = new Array(E).fill(0), mc = new Array(E).fill(0);
      for (var k = 0; k < R; k++) {
        var rand = seeded(1000 + k), V1 = [0, .5, .5, .5, .5, .5, 0], V2 = V1.slice();
        for (var e = 0; e < E; e++) { var tr = rwEpisode(rand); tdEpisode(V1, tr, a1); mcEpisode(V2, tr, a2); td[e] += rms(V1) / R; mc[e] += rms(V2) / R; }
      }
      errData = { td: td, mc: mc, a1: a1, a2: a2 };
      drawErr();
      var better = td[E - 1] < mc[E - 1] ? 'TD' : 'MC';
      b1.querySelector('#rw-ins').innerHTML = 'Với $\\alpha_{\\text{TD}} = ' + texRaw(a1, 2) + '$, $\\alpha_{\\text{MC}} = ' + texRaw(a2, 2) + '$: sau 100 tập, sai số TD là <b>' + fmtNum(td[E - 1], 3) + '</b>, MC là <b>' + fmtNum(mc[E - 1], 3) + '</b> (' + better + ' tốt hơn). ' +
        'Thử tăng $\\alpha$: đường giảm nhanh hơn lúc đầu nhưng <b>dừng ở mức cao hơn</b>, vì bước lớn khiến ước lượng dao động quanh giá trị thật. Trên bài này TD thường thắng MC với mọi $\\alpha$ hợp lý: nhờ tận dụng tính chất Markov, phương sai thấp hơn.';
      ctx.typeset(b1.querySelector('#rw-ins'));
    }
    function drawErr() {
      if (!errData) { b1.querySelector('#rw-err').innerHTML = '<div class="rxs">Bấm “Chạy 100 lần”.</div>'; return; }
      multiLine(b1.querySelector('#rw-err'), {
        series: [{ name: 'TD(0)', color: 'var(--s1)', values: errData.td }, { name: 'Monte Carlo', color: 'var(--s2)', values: errData.mc }],
        yMin: 0, yMax: 0.25, yTicks: [0, .05, .1, .15, .2, .25], dec: 2, tipDec: 3, xLabel: 'Tập', aria: 'Sai số RMS theo số tập của TD và Monte Carlo'
      });
    }
    aTD.oninput = aMC.oninput = function () { drawRW(); };
    b1.querySelector('#rw-one').onclick = oneEpisode;
    b1.querySelector('#rw-ten').onclick = function () { many(10); };
    b1.querySelector('#rw-hund').onclick = function () { many(100); };
    b1.querySelector('#rw-reset').onclick = resetRW;
    b1.querySelector('#rw-avg').onclick = runAvg;
    resetRW(); drawErr();
    ctx.typeset(b1);

    // ---------------- 2. Sarsa và Q-learning trên vách đá ----------------
    var b2 = h(String.raw`<section class="blk"><h2>2. Sarsa và Q-learning trên vách đá</h2>
      <p class="lead">Mục 3.4.3 và hình 3.9. Lưới 4×12, mỗi bước $-1$, rơi vách $-100$ rồi về $S$; $\gamma = 1$. Cả hai dùng chính sách hành vi $\varepsilon$-tham lam với $\varepsilon$ <b>cố định</b>, huấn luyện 500 tập, lấy trung bình 20 lần chạy.</p>
      <div class="ctrl"><label for="cw-eps">$\varepsilon$</label><input type="range" id="cw-eps" min="0" max="0.3" step="0.01" value="0.1"><span class="val" id="cw-eps-v"></span></div>
      <div class="ctrl"><label for="cw-alpha">$\alpha$</label><input type="range" id="cw-alpha" min="0.1" max="1" step="0.05" value="0.5"><span class="val" id="cw-alpha-v"></span></div>
      <div class="ctrl"><button class="btn primary" id="cw-train">Huấn luyện</button><button class="btn" id="cw-walk" disabled>Xem một tập (theo $\varepsilon$-tham lam)</button><span class="rxs" id="cw-status"></span></div>
      <div class="legend"><span class="li"><span class="sw" style="background:var(--s1)"></span>Sarsa</span><span class="li"><span class="sw" style="background:var(--s2)"></span>Q-learning</span></div>
      <div class="chart" id="cw-chart"></div>
      <div class="cliffs">
        <div class="cbox"><div class="cap">Sarsa: đường tham lam đã học <span id="cw-sp"></span></div><div class="cg" id="cw-g0"></div></div>
        <div class="cbox"><div class="cap">Q-learning: đường tham lam đã học <span id="cw-qp"></span></div><div class="cg" id="cw-g1"></div></div>
      </div>
      <div class="rxs" style="margin-top:6px">Ô tối: vách đá. Màu nền: $\max_a Q(s, a)$ (đậm hơn = gần đích hơn). Mũi tên: đường đi tham lam từ $S$.</div>
      <div class="insight" id="cw-ins">Bấm “Huấn luyện”.</div>
      </section>`);
    root.appendChild(b2);
    var eIn = b2.querySelector('#cw-eps'), aIn = b2.querySelector('#cw-alpha');
    var grids = [b2.querySelector('#cw-g0'), b2.querySelector('#cw-g1')], cells = [[], []];
    grids.forEach(function (g, k) {
      for (var s = 0; s < CR * CC; s++) {
        var c = h('<div class="cc' + (isCliff(s) ? ' cliff' : '') + '"></div>');
        if (s === CS) c.innerHTML = '<span class="lb">S</span>';
        if (s === CGOAL) c.innerHTML = '<span class="lb">G</span>';
        g.appendChild(c); cells[k].push(c);
      }
    });
    var res = null, walking = null;
    function lbls() { b2.querySelector('#cw-eps-v').textContent = fmtNum(+eIn.value, 2); b2.querySelector('#cw-alpha-v').textContent = fmtNum(+aIn.value, 2); }
    function smooth(a, w) { var o = []; for (var i = 0; i < a.length; i++) { var s = 0, n = 0; for (var j = Math.max(0, i - w + 1); j <= i; j++) { s += a[j]; n++; } o.push(s / n); } return o; }
    function drawGrid(k, Q, path) {
      var mx = -Infinity, mn = Infinity;
      for (var s = 0; s < CR * CC; s++) { if (isCliff(s) || s === CGOAL) continue; var v = Math.max.apply(null, Q[s]); mx = Math.max(mx, v); mn = Math.min(mn, v); }
      var onPath = {};
      if (path) path.steps.forEach(function (p) { onPath[p.s] = p.a; });
      for (s = 0; s < CR * CC; s++) {
        var c = cells[k][s];
        c.classList.remove('agent', 'fall');
        if (isCliff(s)) continue;
        var lb = s === CS ? '<span class="lb">S</span>' : s === CGOAL ? '<span class="lb">G</span>' : '';
        if (s === CGOAL) { c.style.background = 'color-mix(in srgb, var(--s' + (k + 1) + ') 85%, var(--surface-2))'; c.innerHTML = lb; continue; }
        var v = Math.max.apply(null, Q[s]), t = mx > mn ? (v - mn) / (mx - mn) : 0;
        c.style.background = 'color-mix(in srgb, var(--s' + (k + 1) + ') ' + Math.round(Math.sqrt(t) * 55) + '%, var(--surface-2))';
        c.style.color = t > 0.7 ? '#fff' : 'var(--text)';
        c.innerHTML = lb + (onPath[s] != null ? ARW[onPath[s]] : '');
        c.title = 'max Q = ' + fmtNum(v, 1);
      }
    }
    function train() {
      if (walking) { clearTimeout(walking); walking = null; }
      var st = b2.querySelector('#cw-status'); st.textContent = 'Đang huấn luyện…';
      b2.querySelector('#cw-train').disabled = true;
      setTimeout(function () {
        var eps = +eIn.value, alpha = +aIn.value, RUNS = 20, E = 500;
        var out = {};
        ['sarsa', 'q'].forEach(function (alg) {
          var avg = new Array(E).fill(0), pickQ = null, okRuns = 0;
          for (var k = 0; k < RUNS; k++) {
            var r = trainCliff(alg, eps, alpha, E, seeded(77 + k * 13 + (alg === 'q' ? 5000 : 0)));
            r.rets.forEach(function (v, i) { avg[i] += v / RUNS; });
            // lưới hiển thị lần chạy đầu tiên có đường tham lam hoàn chỉnh (vài lần chạy còn ô hòa nhau gây vòng lặp)
            if (greedyPath(r.Q).ok) { okRuns++; if (!pickQ) pickQ = r.Q; }
          }
          out[alg] = { avg: avg, Q: pickQ || r.Q, okRuns: okRuns, tail: avg.slice(-100).reduce(function (a, b) { return a + b; }, 0) / 100 };
        });
        res = { eps: eps, alpha: alpha, sarsa: out.sarsa, q: out.q };
        drawCliff();
        st.textContent = '';
        b2.querySelector('#cw-train').disabled = false;
        b2.querySelector('#cw-walk').disabled = false;
      }, 30);
    }
    function drawCliff() {
      if (!res) { b2.querySelector('#cw-chart').innerHTML = '<div class="rxs">Biểu đồ tổng phần thưởng mỗi tập sẽ hiện ở đây.</div>'; return; }
      multiLine(b2.querySelector('#cw-chart'), {
        series: [{ name: 'Sarsa', color: 'var(--s1)', values: smooth(res.sarsa.avg, 10) }, { name: 'Q-learning', color: 'var(--s2)', values: smooth(res.q.avg, 10) }],
        yMin: -100, yMax: 0, yTicks: [-100, -75, -50, -25, 0], dec: 0, tipDec: 1, xLabel: 'Tập', aria: 'Tổng phần thưởng mỗi tập của Sarsa và Q-learning'
      });
      var pS = greedyPath(res.sarsa.Q), pQ = greedyPath(res.q.Q);
      drawGrid(0, res.sarsa.Q, pS); drawGrid(1, res.q.Q, pQ);
      function plen(p) { return p.ok ? p.steps.length + ' bước' : 'chưa ra đường hoàn chỉnh'; }
      b2.querySelector('#cw-sp').textContent = plen(pS); b2.querySelector('#cw-qp').textContent = plen(pQ);
      function row(p) { return p.ok ? Math.min.apply(null, p.steps.map(function (x) { return Math.floor(x.s / CC); }).filter(function (r, i) { return i > 0; })) : null; }
      var ins = 'Trung bình 100 tập cuối (đang huấn luyện, có khám phá): Sarsa <b>' + fmtNum(res.sarsa.tail, 1) + '</b>, Q-learning <b>' + fmtNum(res.q.tail, 1) + '</b>. ';
      if (res.eps === 0) {
        ins += 'Với $\\varepsilon = 0$ không có bước ngẫu nhiên nên hai thuật toán gần như trùng nhau: Sarsa với hành động tham lam chính là Q-learning. (Bảng khởi tạo 0 nên vẫn tự khám phá được nhờ "lạc quan" ban đầu.)';
      } else {
        ins += 'Q-learning học đường <b>sát vách</b> (tối ưu, 13 bước) vì mục tiêu dùng $\\max$, coi như sau này không bao giờ đi ngẫu nhiên; nhưng trong lúc huấn luyện, các bước ngẫu nhiên khiến nó <b>thỉnh thoảng rơi vách</b> nên tổng thưởng thấp hơn. ' +
          'Sarsa tính cả các bước ngẫu nhiên vào $Q$ nên chọn đường <b>xa vách</b>: dài hơn nhưng an toàn. Giảm $\\varepsilon$ về gần 0 thì khoảng cách giữa hai đường biến mất.';
      }
      var rS = row(pS), rQ = row(pQ);
      if (rS != null && rQ != null && res.eps > 0) ins += ' Trên lưới: Sarsa đi vòng lên hàng ' + (rS + 1) + ' (tính từ trên), Q-learning đi ở hàng ' + (rQ + 1) + ', ngay trên vách.';
      ins += '<br><span class="rxs">Đường tham lam hoàn chỉnh từ $S$ tới $G$: Sarsa ' + res.sarsa.okRuns + '/20 lần chạy, Q-learning ' + res.q.okRuns + '/20; lưới hiển thị lần chạy đầu tiên có đường hoàn chỉnh. Với $\\varepsilon$ cố định, Sarsa đôi khi để lại vòng lặp ở các ô ít được thăm.</span>';
      b2.querySelector('#cw-ins').innerHTML = ins;
      ctx.typeset(b2.querySelector('#cw-ins'));
    }
    function walkOnce() {
      if (!res) return;
      if (walking) { clearTimeout(walking); walking = null; }
      var Qs = [res.sarsa.Q, res.q.Q], pos = [CS, CS], tot = [0, 0], done = [false, false], falls = [0, 0], n = 0;
      var caps = [b2.querySelector('#cw-sp'), b2.querySelector('#cw-qp')];
      drawCliff();
      (function tick() {
        n++;
        var fellNow = false;
        for (var k = 0; k < 2; k++) {
          if (done[k]) continue;
          cells[k].forEach(function (c) { c.classList.remove('agent', 'fall'); });
          var a = egreedy(Qs[k], pos[k], res.eps, Math.random), o = cliffStep(pos[k], a);
          tot[k] += o.r;
          if (o.fell != null) { falls[k]++; fellNow = true; cells[k][o.fell].classList.add('fall'); }
          pos[k] = o.s;
          cells[k][pos[k]].classList.add('agent');
          if (pos[k] === CGOAL || n >= 200) done[k] = true;
          caps[k].textContent = 'tổng thưởng ' + tot[k] + ' · rơi ' + falls[k] + ' lần' + (done[k] ? (pos[k] === CGOAL ? ' · tới đích' : ' · dừng sau 200 bước') : '');
        }
        if (!done[0] || !done[1]) walking = setTimeout(tick, fellNow ? 450 : 120); else walking = null;
      })();
    }
    eIn.oninput = aIn.oninput = lbls;
    b2.querySelector('#cw-train').onclick = train;
    b2.querySelector('#cw-walk').onclick = walkOnce;
    lbls(); drawCliff();
    ctx.typeset(b2);

    onResize(function () { drawRW(); drawErr(); if (res) drawCliff(); });
  }

  // ======================================================================
  // TAB "Sơ đồ"
  // ======================================================================
  // cây nhị phân 1-2-4-8; trả về SVG với các cạnh/nút được tô theo phương pháp
  function tree(kind) {
    var W = 240, H = 150, lv = [16, 56, 96, 136], pos = [];
    for (var d = 0; d < 4; d++) {
      var n = 1 << d, row = [];
      for (var i = 0; i < n; i++) row.push([W * (i + 0.5) / n, lv[d]]);
      pos.push(row);
    }
    // cạnh/nút được dùng
    var useE = {}, useN = { '0-0': 'root' };
    function mark(d, i, how) { useN[d + '-' + i] = how; }
    function edge(d, i) { useE[d + '-' + i] = 1; } // cạnh từ (d-1, i>>1) tới (d, i)
    if (kind === 'dp') { edge(1, 0); edge(1, 1); mark(1, 0, 'boot'); mark(1, 1, 'boot'); }
    if (kind === 'td') { edge(1, 1); mark(1, 1, 'boot'); }
    if (kind === 'mc') { edge(1, 1); edge(2, 2); edge(3, 5); mark(1, 1, 'pass'); mark(2, 2, 'pass'); mark(3, 5, 'end'); }
    if (kind === 'ex') { for (d = 1; d < 4; d++) for (i = 0; i < (1 << d); i++) { edge(d, i); mark(d, i, d === 3 ? 'end' : 'pass'); } }
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true">';
    for (d = 1; d < 4; d++) for (i = 0; i < (1 << d); i++) {
      var a = pos[d - 1][i >> 1], b = pos[d][i], on = useE[d + '-' + i];
      s += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" stroke="' + (on ? 'var(--s1)' : 'var(--border)') + '" stroke-width="' + (on ? 2.5 : 1.2) + '"/>';
    }
    for (d = 0; d < 4; d++) for (i = 0; i < (1 << d); i++) {
      var p = pos[d][i], how = useN[d + '-' + i], fill = 'var(--surface)', stroke = 'var(--border)';
      if (how === 'root') { fill = 'var(--s1)'; stroke = 'var(--s1)'; }
      else if (how === 'boot') { fill = 'var(--hl, #c98a12)'; stroke = 'var(--hl, #c98a12)'; }
      else if (how === 'pass') { fill = 'var(--surface)'; stroke = 'var(--s1)'; }
      else if (how === 'end') { fill = 'var(--text)'; stroke = 'var(--text)'; }
      if (d === 3) s += '<rect x="' + (p[0] - 5.5) + '" y="' + (p[1] - 5.5) + '" width="11" height="11" rx="2" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.8"/>';
      else s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (d === 0 ? 8 : 6.5) + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.8"/>';
    }
    return s + '</svg>';
  }

  function renderMap(root, ctx) {
    root.innerHTML = '';
    root.classList.add('rx');

    // ---- 1. Góc nhìn thống nhất ----
    var Q4 = [
      ['td', 'Sai phân thời gian', 'nông · hẹp', 'V(s_t) \\leftarrow V(s_t) + \\alpha\\big(r_{t+1} + \\gamma V(s_{t+1}) - V(s_t)\\big)', [1, 1, 0]],
      ['dp', 'Quy hoạch động', 'nông · rộng', 'V(s_t) \\leftarrow \\mathbb{E}_\\pi\\big[r_{t+1} + \\gamma V(s_{t+1})\\big]', [1, 0, 1]],
      ['mc', 'Monte Carlo', 'sâu · hẹp', 'V(s_t) \\leftarrow V(s_t) + \\alpha\\big(G_t - V(s_t)\\big)', [0, 1, 0]],
      ['ex', 'Tìm kiếm vét cạn', 'sâu · rộng', '\\text{xét mọi nhánh đến khi kết thúc}', [0, 0, 1]]
    ];
    var b1 = h('<section class="blk"><h2>1. Góc nhìn thống nhất: backup rộng hay hẹp, nông hay sâu</h2>' +
      '<p class="lead">Mục 3.3.3, hình 3.19–3.22. Mỗi cây là các trạng thái có thể xảy ra kể từ $s_t$ (gốc, màu xanh). Cạnh tô xanh là phần được dùng trong <b>một</b> lần cập nhật.</p>' +
      '<div class="legend"><span class="li"><span class="sw dot" style="background:var(--s1)"></span>trạng thái được cập nhật</span><span class="li"><span class="sw dot" style="background:var(--hl,#c98a12)"></span>dùng ước lượng $V$ (bootstrapping)</span><span class="li"><span class="sw box" style="background:var(--text)"></span>trạng thái kết thúc</span></div>' +
      '<div class="quad">' + Q4.map(function (q) {
        return '<div class="qc"><h3>' + q[1] + '</h3><div class="ax">' + q[2] + '</div>' + tree(q[0]) + '<div class="f" data-tex="' + q[3].replace(/"/g, '&quot;') + '"></div><div class="chips">' +
          '<span class="chip' + (q[4][0] ? ' y' : '') + '">' + (q[4][0] ? '✓' : '✗') + ' bootstrapping</span>' +
          '<span class="chip' + (q[4][1] ? ' y' : '') + '">' + (q[4][1] ? '✓' : '✗') + ' lấy mẫu</span>' +
          '<span class="chip' + (q[4][2] ? ' y' : '') + '">' + (q[4][2] ? '✓' : '✗') + ' cần mô hình</span></div></div>';
      }).join('') + '</div>' +
      '<div class="axes"><span>← một bước (nông)</span><span>đến hết tập (sâu) →</span></div>' +
      '<div class="insight">TD là điểm xuất phát: <b>mở rộng</b> ra mọi nhánh thì thành DP (cần mô hình để biết các nhánh và xác suất); <b>đào sâu</b> đến hết tập thì thành MC (không cần $V$ của trạng thái khác). Ở giữa là TD $n$ bước: $n = 1$ là TD, $n = \\infty$ là MC.</div></section>');
    root.appendChild(b1);
    b1.querySelectorAll('[data-tex]').forEach(function (el) { katexBlock(el, el.getAttribute('data-tex')); });
    ctx.typeset(b1);

    // ---- 2. Bảng so sánh ----
    var b2 = h(String.raw`<section class="blk"><h2>2. Bảng so sánh DP, MC, TD</h2>
      <p class="lead">Mục 3.3, bài tập 3-5 và phỏng vấn 3-6, 3-7.</p>
      <div class="tscroll"><table class="cmp">
        <thead><tr><th></th><th>Quy hoạch động</th><th>Monte Carlo</th><th>TD</th></tr></thead>
        <tbody>
          <tr><td>Mục tiêu cập nhật</td><td>$\mathbb{E}_\pi[r + \gamma V(s')]$</td><td>$G_t$</td><td>$r_{t+1} + \gamma V(s_{t+1})$</td></tr>
          <tr><td>Cần mô hình $P, R$</td><td>✓</td><td>✗</td><td>✗</td></tr>
          <tr><td>Bootstrapping</td><td>✓</td><td>✗</td><td>✓</td></tr>
          <tr><td>Lấy mẫu</td><td>✗</td><td>✓</td><td>✓</td></tr>
          <tr><td>Cần tập hoàn chỉnh</td><td>không</td><td><b>có</b></td><td>không</td></tr>
          <tr><td>Học trực tuyến, nhiệm vụ liên tục</td><td>(không tương tác)</td><td>✗</td><td>✓</td></tr>
          <tr><td>Cập nhật những trạng thái nào</td><td>mọi trạng thái</td><td>trên quỹ đạo, cuối tập</td><td>trạng thái vừa rời, mỗi bước</td></tr>
          <tr><td>Độ chệch / phương sai</td><td>(tính chính xác kỳ vọng)</td><td>không chệch / <b>lớn</b></td><td><b>có chệch</b> / nhỏ</td></tr>
          <tr><td>Hợp với môi trường</td><td>biết mô hình, nhỏ</td><td>không Markov</td><td>Markov</td></tr>
        </tbody></table></div></section>`);
    root.appendChild(b2);
    ctx.typeset(b2);

    // ---- 3. Sarsa vs Q-learning: cùng một bước, hai mục tiêu ----
    var b3 = h(String.raw`<section class="blk"><h2>3. Sarsa và Q-learning: cùng một bước, hai mục tiêu</h2>
      <p class="lead">Mục 3.4.1–3.4.2, hình 3.34. Tác tử ở $s$ làm $a$, nhận $r = -1$, sang $s'$. Bảng $Q(s', \cdot)$ bên dưới; chính sách hành vi $\varepsilon$-tham lam chọn $a'$. $Q(s, a) = -5$, $\gamma = 0{,}9$, $\alpha = 0{,}5$.</p>
      <div class="ctrl"><label for="sq-eps">$\varepsilon$</label><input type="range" id="sq-eps" min="0" max="1" step="0.05" value="0.3"><span class="val" id="sq-eps-v"></span>
        <button class="btn primary" id="sq-step">Lấy mẫu $a'$</button><button class="btn" id="sq-new">Bảng $Q$ khác</button></div>
      <div class="qrow" id="sq-q"></div>
      <div class="rxs" id="sq-note" style="margin-top:6px"></div>
      <div class="tl" id="sq-tl"></div>
      <div class="two">
        <div><h3 style="color:var(--s1)">Sarsa (on-policy)</h3><div id="sq-s"></div></div>
        <div><h3 style="color:var(--s2)">Q-learning (off-policy)</h3><div id="sq-ql"></div></div>
      </div>
      <div class="insight" id="sq-ins"></div></section>`);
    root.appendChild(b3);
    var sqQ = [-6, -3, -8, -4], pick = null, explored = false, nPick = 0, nDiff = 0;
    var eIn = b3.querySelector('#sq-eps'), ACT = ['↑', '→', '↓', '←'];
    function drawSQ() {
      b3.querySelector('#sq-eps-v').textContent = fmtNum(+eIn.value, 2);
      var mx = Math.max.apply(null, sqQ), am = sqQ.indexOf(mx);
      b3.querySelector('#sq-q').innerHTML = sqQ.map(function (v, k) {
        return '<div class="qa' + (k === am ? ' max' : '') + (k === pick ? ' pick' : '') + '"><div class="an">' + ACT[k] + (k === am ? ' · max' : '') + (k === pick ? ' · $a\'$' : '') + '</div><div class="qv">' + fmtNum(v, 0) + '</div></div>';
      }).join('');
      var eps = +eIn.value;
      b3.querySelector('#sq-note').innerHTML = 'Viền cam: hành động có $Q$ lớn nhất. Nền xanh lá: $a\'$ được lấy mẫu. Xác suất $a\' = $ hành động tham lam: $1 - \\varepsilon + \\varepsilon / 4 = ' + texRaw(1 - eps + eps / 4, 3) + '$.';
      var tl = ['s', 'a', 'r', "s'", "a'"];
      b3.querySelector('#sq-tl').innerHTML = '<span class="rxs">Sarsa dùng:</span>' + tl.map(function (t) { return '<span class="tk use">$' + t + '$</span>'; }).join('') +
        '<span class="rxs" style="margin-left:8px">Q-learning dùng:</span>' + tl.map(function (t, i) { return '<span class="tk ' + (i === 4 ? 'skip' : 'use') + '">$' + t + '$</span>'; }).join('');
      var g = 0.9, al = 0.5, q0 = -5, r = -1;
      var ql = r + g * mx, qlNew = q0 + al * (ql - q0);
      katexBlock(b3.querySelector('#sq-ql'), '\\begin{aligned}\\text{mục tiêu} &= r + \\gamma \\max_{a\'} Q(s\', a\') \\\\ &= -1 + ' + texRaw(g, 1) + ' \\cdot ' + tex(mx, 0) + ' = ' + texRaw(ql, 2) + '\\\\ Q(s, a) &\\leftarrow -5 + ' + texRaw(al, 1) + '\\,\\big(' + texRaw(ql, 2) + ' - (-5)\\big) \\\\ &= ' + texRaw(qlNew, 3) + '\\end{aligned}');
      if (pick == null) {
        b3.querySelector('#sq-s').innerHTML = '<span class="rxs">Sarsa phải <b>đợi</b> chọn xong $a\'$ mới cập nhật được. Bấm “Lấy mẫu $a\'$”.</span>';
      } else {
        var sv = r + g * sqQ[pick], sNew = q0 + al * (sv - q0);
        katexBlock(b3.querySelector('#sq-s'), '\\begin{aligned}\\text{mục tiêu} &= r + \\gamma Q(s\', a\') \\\\ &= -1 + ' + texRaw(g, 1) + ' \\cdot ' + tex(sqQ[pick], 0) + ' = ' + texRaw(sv, 2) + '\\\\ Q(s, a) &\\leftarrow -5 + ' + texRaw(al, 1) + '\\,\\big(' + texRaw(sv, 2) + ' - (-5)\\big) \\\\ &= ' + texRaw(sNew, 3) + '\\end{aligned}');
      }
      var ins;
      if (pick == null) ins = 'Q-learning đã cập nhật được ngay: nó không cần biết $a\'$, chỉ cần $\\max$.';
      else if (pick === am) ins = 'Lần này $a\'$ trùng hành động tham lam' + (explored ? ' (dù là bước ngẫu nhiên)' : '') + ' nên hai mục tiêu <b>bằng nhau</b>.';
      else ins = 'Bước <b>khám phá</b> đã chọn $a\'$ kém hơn: mục tiêu của Sarsa thấp hơn. Sarsa “tính” cả rủi ro này vào $Q(s, a)$; Q-learning bỏ qua vì nó học chính sách tham lam. Đây là lý do Sarsa né vách đá.';
      if (nPick) ins += '<br><span class="rxs">Đã lấy mẫu ' + nPick + ' lần, hai mục tiêu khác nhau ' + nDiff + ' lần (' + fmtNum(nDiff / nPick * 100, 0) + '%). Kỳ vọng: $\\varepsilon \\cdot 3/4 = ' + texRaw(eps * 0.75 * 100, 1) + '\\%$.</span>';
      b3.querySelector('#sq-ins').innerHTML = ins;
      ctx.typeset(b3);
    }
    b3.querySelector('#sq-step').onclick = function () {
      var eps = +eIn.value, am = sqQ.indexOf(Math.max.apply(null, sqQ));
      explored = Math.random() < eps;
      pick = explored ? Math.floor(Math.random() * 4) : am;
      nPick++; if (pick !== am) nDiff++;
      drawSQ();
    };
    b3.querySelector('#sq-new').onclick = function () {
      var vals; do { vals = [0, 0, 0, 0].map(function () { return -Math.floor(Math.random() * 10) - 1; }); } while (vals.filter(function (v) { return v === Math.max.apply(null, vals); }).length > 1);
      sqQ = vals; pick = null; nPick = 0; nDiff = 0; drawSQ();
    };
    eIn.oninput = function () { nPick = 0; nDiff = 0; drawSQ(); };
    drawSQ();

    // ---- 4. Gia phả các phương pháp dạng bảng ----
    var b4 = h(String.raw`<section class="blk"><h2>4. Gia phả các phương pháp dạng bảng</h2>
      <p class="lead">Tóm tắt hình 3.35 và các chương 2–3.</p>
      <div class="lanes">
        <div class="lane"><div class="lt">Có mô hình <span>· biết $P$, $R$ · chương 2</span></div>
          <div class="flow"><span class="fb">Đánh giá chính sách lặp<br><small>kỳ vọng Bellman</small></span><span class="fa">→</span><span class="fb">Lặp chính sách</span><span class="fa">·</span><span class="fb">Lặp giá trị<br><small>tối ưu Bellman</small></span></div></div>
        <div class="lane"><div class="lt">Không mô hình · dự đoán <span>· cho trước $\pi$, ước lượng $V_\pi$ · mục 3.3</span></div>
          <div class="flow"><span class="fb">Monte Carlo<br><small>mục tiêu $G_t$</small></span><span class="fa">↔</span><span class="fb">TD $n$ bước<br><small>$G_t^{n}$</small></span><span class="fa">↔</span><span class="fb">TD(0)<br><small>$r + \gamma V(s')$</small></span></div></div>
        <div class="lane"><div class="lt">Không mô hình · điều khiển <span>· ước lượng $Q$, cải thiện $\varepsilon$-tham lam (GPI) · mục 3.4</span></div>
          <div class="flow"><span class="fb">MC $\varepsilon$-tham lam<br><small>mục tiêu $G_t$</small></span><span class="fa">→</span><span class="fb eq">Sarsa · on-policy<br><small>$r + \gamma Q(s', a')$</small></span><span class="fa">·</span><span class="fb eq">Q-learning · off-policy<br><small>$r + \gamma \max_{a'} Q(s', a')$</small></span></div></div>
      </div>
      <div class="insight">Mọi luật cập nhật đều có chung khung trung bình tăng dần: <b>ước lượng mới = ước lượng cũ + $\alpha$ × (mục tiêu − ước lượng cũ)</b>. Chỉ có <b>mục tiêu</b> là khác nhau.</div></section>`);
    root.appendChild(b4);
    ctx.typeset(b4);

    onResize(function () {});
  }

  // ======================================================================
  // TAB "Mô phỏng": liên kết tới các trang docs/viz
  // ======================================================================
  var VIZ = [
    ['td-control.html', 'Mục 3.2–3.4', 'Sarsa và Q-learning từng bước', 'Bảng $Q$ cập nhật từng bước bằng số thật trên vách đá và kho báu; hệ số chiết khấu $\\gamma$.'],
    ['nstep-td.html', 'Mục 3.3.2', 'TD $n$ bước', 'Cập nhật trễ $n$ bước; ô nào nhận thông tin sau một tập; chọn $n$ tốt nhất.'],
    ['mc-control.html', 'Mục 3.4', 'Monte Carlo điều khiển', 'Sinh tập rồi quét ngược $G \\leftarrow \\gamma G + r$; khởi đầu khám phá và $\\varepsilon$-tham lam.']
  ];
  function renderViz(root, ctx) {
    root.innerHTML = '';
    root.classList.add('rx');
    var b = h('<section class="blk"><h2>Mô phỏng thuật toán</h2>' +
      '<p class="lead">Chạy từng bước các thuật toán của chương, kèm phép tính bằng số thật. Mở trong cùng tab; bấm “← Các mô phỏng” để quay lại danh sách.</p>' +
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
