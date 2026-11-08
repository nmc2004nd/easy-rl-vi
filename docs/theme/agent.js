// Một tác tử Q-learning học bài toán vách đá (Chương 3) ngay trên trang chủ.
// Màu ô là giá trị max_a Q(s, a) tác tử đã học, mũi tên là chính sách tham lam hiện tại.
// Dùng: EasyAgent.mount(phần tử .home-agent). Tự dừng khi khuất màn hình hoặc khi phần tử bị gỡ.
(function () {
  var COLS = 12;
  var ROWS = 4;
  var START = { x: 0, y: 3 };
  var GOAL = { x: 11, y: 3 };
  var MOVES = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // lên, phải, xuống, trái
  var ALPHA = 0.5;
  var GAMMA = 1;
  var EPS = 0.1;
  var OPTIMAL = -13;
  var SPEEDS = [{ label: 'Chậm', sps: 5 }, { label: 'Vừa', sps: 16 }, { label: 'Nhanh', sps: 70 }, { label: 'Siêu tốc', sps: 600 }];
  var HISTORY = 80;

  function isCliff(x, y) { return y === 3 && x > 0 && x < 11; }
  function css(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

  function mount(root) {
    if (!root || root.dataset.ready) return;
    root.dataset.ready = '1';
    root.innerHTML =
      '<div class="agent-head">' +
        '<div class="agent-title"><b>Q-learning trên bài toán vách đá</b>' +
        '<span>Tác tử bắt đầu không biết gì. Mỗi bước bị trừ 1 điểm, rơi xuống vách đá bị trừ 100 và quay về ô xuất phát. ' +
        'Ô càng đậm thì giá trị học được càng cao; mũi tên là hướng đi tác tử đang tin là tốt nhất.</span></div>' +
        '<div class="agent-ctrl">' +
          '<button type="button" data-act="play"></button>' +
          '<button type="button" data-act="speed"></button>' +
          '<button type="button" data-act="reset">Học lại</button>' +
        '</div>' +
      '</div>' +
      '<div class="agent-stage"><canvas class="agent-grid" role="img" aria-label="Lưới 12 × 4 của bài toán vách đá"></canvas></div>' +
      '<div class="agent-foot">' +
        '<div class="agent-stats" aria-live="off">' +
          '<span>Tập <b data-k="ep">1</b></span><span>Bước trong tập <b data-k="steps">0</b></span>' +
          '<span>Tổng thưởng tập trước <b data-k="ret">–</b></span><span>Số lần rơi <b data-k="falls">0</b></span>' +
        '</div>' +
        '<div class="agent-chart"><div class="agent-chart-title">Tổng thưởng mỗi tập (80 tập gần nhất)</div>' +
          '<svg class="agent-spark" preserveAspectRatio="none"></svg><div class="agent-tip" hidden></div></div>' +
        '<a class="agent-more" href="#/chapter3/chapter3_vi">Hiểu thuật toán này ở Chương 3 →</a>' +
      '</div>';

    var canvas = root.querySelector('canvas');
    var ctx = canvas.getContext('2d');
    var spark = root.querySelector('.agent-spark');
    var tip = root.querySelector('.agent-tip');
    var btnPlay = root.querySelector('[data-act="play"]');
    var btnSpeed = root.querySelector('[data-act="speed"]');
    var stat = {};
    root.querySelectorAll('[data-k]').forEach(function (el) { stat[el.dataset.k] = el; });

    var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var st = {};
    var playing = !calm;
    var speed = 1;
    var visible = true;
    var colors = {};
    var cell = 40;
    var raf = 0;
    var last = 0;
    var acc = 0;

    function reset() {
      st = {
        Q: [], seen: [], pos: { x: START.x, y: START.y }, prev: { x: START.x, y: START.y },
        trail: [], ep: 1, steps: 0, ret: 0, lastRet: null, falls: 0, history: [], pops: []
      };
      for (var i = 0; i < COLS * ROWS; i++) { st.Q.push([0, 0, 0, 0]); st.seen.push(0); }
      renderSpark();
      paintStats();
    }

    function idx(p) { return p.y * COLS + p.x; }
    function best(q) {
      var b = 0;
      for (var a = 1; a < 4; a++) if (q[a] > q[b]) b = a;
      return b;
    }

    function step() {
      var s = idx(st.pos);
      var q = st.Q[s];
      var a;
      if (Math.random() < EPS) {
        a = Math.floor(Math.random() * 4);
      } else {
        // ε-tham lam; khi các hành động bằng nhau thì chọn ngẫu nhiên để tác tử không kẹt ở góc.
        var top = q[best(q)];
        var ties = [0, 1, 2, 3].filter(function (k) { return q[k] === top; });
        a = ties[Math.floor(Math.random() * ties.length)];
      }
      var nx = Math.min(COLS - 1, Math.max(0, st.pos.x + MOVES[a][0]));
      var ny = Math.min(ROWS - 1, Math.max(0, st.pos.y + MOVES[a][1]));
      var r = -1;
      var done = false;
      st.prev = { x: st.pos.x, y: st.pos.y };
      if (isCliff(nx, ny)) {
        r = -100;
        st.falls++;
        st.pops.push({ x: nx, y: ny, text: '−100', t: 0, bad: true });
        nx = START.x; ny = START.y;
        st.trail = [];
      } else if (nx === GOAL.x && ny === GOAL.y) {
        done = true;
      }
      var next = { x: nx, y: ny };
      var target = done ? r : r + GAMMA * Math.max.apply(null, st.Q[idx(next)]);
      q[a] += ALPHA * (target - q[a]);
      st.seen[s]++;
      st.ret += r;
      st.steps++;
      st.trail.push({ x: st.pos.x, y: st.pos.y });
      if (st.trail.length > 10) st.trail.shift();
      st.pos = next;
      if (done || st.steps > 2000) {
        st.lastRet = st.ret;
        st.history.push(st.ret);
        if (st.history.length > HISTORY) st.history.shift();
        if (done) st.pops.push({ x: GOAL.x, y: GOAL.y, text: st.ret >= OPTIMAL ? 'Tối ưu!' : 'Đến đích', t: 0, bad: false });
        st.ep++;
        st.steps = 0;
        st.ret = 0;
        st.pos = { x: START.x, y: START.y };
        st.prev = { x: START.x, y: START.y };
        st.trail = [];
        renderSpark();
      }
    }

    function readColors() {
      colors = {
        accent: css('--accent') || '#4f5bf0', text: css('--text') || '#10262e', muted: css('--muted') || '#4e6670',
        border: css('--border') || '#d5e8ee', surface: css('--surface') || '#f0f9fb', card: css('--card') || '#fff'
      };
    }

    function size() {
      var w = canvas.parentElement.clientWidth;
      cell = Math.max(18, Math.min(68, Math.floor(w / COLS)));
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = cell * COLS * dpr;
      canvas.height = cell * ROWS * dpr;
      canvas.style.width = cell * COLS + 'px';
      canvas.style.height = cell * ROWS + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(0);
    }

    function roundRect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    function arrow(cx, cy, a, len) {
      var dx = MOVES[a][0];
      var dy = MOVES[a][1];
      ctx.beginPath();
      ctx.moveTo(cx - dx * len, cy - dy * len);
      ctx.lineTo(cx + dx * len, cy + dy * len);
      ctx.moveTo(cx + dx * len, cy + dy * len);
      ctx.lineTo(cx + dx * len * 0.35 - dy * len * 0.55, cy + dy * len * 0.35 + dx * len * 0.55);
      ctx.moveTo(cx + dx * len, cy + dy * len);
      ctx.lineTo(cx + dx * len * 0.35 + dy * len * 0.55, cy + dy * len * 0.35 - dx * len * 0.55);
      ctx.stroke();
    }

    // frac: tiến độ (0..1) giữa ô trước và ô hiện tại, để tác tử trượt mượt ở tốc độ chậm.
    function draw(frac) {
      var W = cell * COLS;
      var H = cell * ROWS;
      var g = 3;
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      for (var y = 0; y < ROWS; y++) {
        for (var x = 0; x < COLS; x++) {
          var px = x * cell + g / 2;
          var py = y * cell + g / 2;
          var s = y * COLS + x;
          roundRect(px, py, cell - g, cell - g, Math.min(8, cell / 5));
          if (isCliff(x, y)) {
            ctx.fillStyle = 'rgba(229, 72, 77, .16)';
            ctx.fill();
            ctx.save();
            ctx.clip();
            ctx.strokeStyle = 'rgba(229, 72, 77, .45)';
            ctx.lineWidth = 2;
            for (var k = -cell; k < cell * 2; k += 8) {
              ctx.beginPath();
              ctx.moveTo(px + k, py + cell);
              ctx.lineTo(px + k + cell, py);
              ctx.stroke();
            }
            ctx.restore();
            continue;
          }
          ctx.fillStyle = colors.surface;
          ctx.fill();
          if (st.seen[s]) {
            var v = Math.max.apply(null, st.Q[s]);
            var t = Math.max(0, Math.min(1, 1 + v / 16));
            ctx.globalAlpha = 0.1 + 0.62 * t;
            ctx.fillStyle = colors.accent;
            ctx.fill();
            ctx.globalAlpha = 0.5 + 0.3 * t;
            ctx.strokeStyle = t > 0.55 ? '#ffffff' : colors.text;
            ctx.lineWidth = Math.max(1.5, cell / 22);
            arrow(px + (cell - g) / 2, py + (cell - g) / 2, best(st.Q[s]), cell * 0.2);
            ctx.globalAlpha = 1;
          }
        }
      }
      ctx.font = '700 ' + Math.round(cell * 0.24) + 'px "Be Vietnam Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = colors.muted;
      ctx.fillText('S', START.x * cell + cell * 0.22, START.y * cell + cell * 0.24);
      ctx.font = Math.round(cell * 0.5) + 'px sans-serif';
      ctx.fillText('🏆', GOAL.x * cell + cell / 2, GOAL.y * cell + cell / 2 + 1);
      if (cell >= 30) {
        ctx.font = '600 ' + Math.round(cell * 0.26) + 'px "Be Vietnam Pro", sans-serif';
        ctx.fillStyle = 'rgba(229, 72, 77, .9)';
        ctx.fillText('Vách đá', 6 * cell, 3 * cell + cell / 2);
      }

      // vệt đi của tác tử
      for (var i = 0; i < st.trail.length; i++) {
        var p = st.trail[i];
        ctx.globalAlpha = (i + 1) / st.trail.length * 0.35;
        ctx.fillStyle = colors.accent;
        ctx.beginPath();
        ctx.arc(p.x * cell + cell / 2, p.y * cell + cell / 2, cell * 0.12, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // tác tử
      var f = Math.min(1, frac);
      var ease = f * (2 - f);
      var ax = (st.prev.x + (st.pos.x - st.prev.x) * ease) * cell + cell / 2;
      var ay = (st.prev.y + (st.pos.y - st.prev.y) * ease) * cell + cell / 2;
      if (Math.abs(st.pos.x - st.prev.x) + Math.abs(st.pos.y - st.prev.y) > 1) { ax = st.pos.x * cell + cell / 2; ay = st.pos.y * cell + cell / 2; }
      var glow = ctx.createRadialGradient(ax, ay, 0, ax, ay, cell * 0.6);
      glow.addColorStop(0, 'rgba(99, 102, 241, .5)');
      glow.addColorStop(1, 'rgba(99, 102, 241, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(ax, ay, cell * 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = colors.card;
      ctx.strokeStyle = colors.accent;
      ctx.lineWidth = Math.max(2, cell / 14);
      ctx.beginPath();
      ctx.arc(ax, ay, cell * 0.24, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = colors.text;
      ctx.beginPath();
      ctx.arc(ax - cell * 0.08, ay - cell * 0.03, cell * 0.035, 0, Math.PI * 2);
      ctx.arc(ax + cell * 0.08, ay - cell * 0.03, cell * 0.035, 0, Math.PI * 2);
      ctx.fill();

      // chữ nổi: −100 khi rơi, "Đến đích" khi tới cúp
      ctx.font = '800 ' + Math.round(cell * 0.34) + 'px "Be Vietnam Pro", sans-serif';
      st.pops = st.pops.filter(function (pp) { return pp.t < 1; });
      st.pops.forEach(function (pp) {
        ctx.globalAlpha = 1 - pp.t;
        ctx.fillStyle = pp.bad ? '#e5484d' : colors.accent;
        ctx.fillText(pp.text, Math.min(W - cell, Math.max(cell, pp.x * cell + cell / 2)), pp.y * cell + cell / 2 - pp.t * cell * 0.9);
      });
      ctx.globalAlpha = 1;
    }

    function paintStats() {
      stat.ep.textContent = st.ep;
      stat.steps.textContent = st.steps;
      stat.ret.textContent = st.lastRet === null ? '–' : String(st.lastRet).replace('-', '−');
      stat.falls.textContent = st.falls;
      btnPlay.textContent = playing ? 'Tạm dừng' : 'Chạy';
      btnPlay.setAttribute('aria-pressed', playing ? 'true' : 'false');
      btnSpeed.textContent = 'Tốc độ: ' + SPEEDS[speed].label;
    }

    // Đường tổng thưởng mỗi tập, kèm vạch tham chiếu ở mức tối ưu −13.
    function renderSpark() {
      var w = 300;
      var h = 64;
      var hs = st.history;
      var lo = -160;
      var y = function (v) { return 4 + (h - 8) * (Math.max(lo, v) / lo); };
      var html = '<line class="spark-ref" x1="0" x2="' + w + '" y1="' + y(OPTIMAL) + '" y2="' + y(OPTIMAL) + '"/>';
      if (hs.length > 1) {
        var pts = hs.map(function (v, i) { return (i / (HISTORY - 1) * w).toFixed(1) + ',' + y(v).toFixed(1); });
        html += '<polyline class="spark-area" points="0,' + h + ' ' + pts.join(' ') + ' ' + ((hs.length - 1) / (HISTORY - 1) * w).toFixed(1) + ',' + h + '"/>';
        html += '<polyline class="spark-line" points="' + pts.join(' ') + '"/>';
        var lx = (hs.length - 1) / (HISTORY - 1) * w;
        html += '<circle class="spark-dot" cx="' + lx.toFixed(1) + '" cy="' + y(hs[hs.length - 1]).toFixed(1) + '" r="3.5"/>';
      }
      html += '<line class="spark-cross" x1="0" x2="0" y1="0" y2="' + h + '" visibility="hidden"/>';
      spark.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      spark.innerHTML = html;
    }

    spark.addEventListener('pointermove', function (e) {
      var hs = st.history;
      if (!hs.length) return;
      var box = spark.getBoundingClientRect();
      var i = Math.round((e.clientX - box.left) / box.width * (HISTORY - 1));
      i = Math.max(0, Math.min(hs.length - 1, i));
      var cross = spark.querySelector('.spark-cross');
      var x = i / (HISTORY - 1) * 300;
      cross.setAttribute('x1', x);
      cross.setAttribute('x2', x);
      cross.setAttribute('visibility', 'visible');
      var epNo = st.ep - hs.length + i;
      tip.hidden = false;
      tip.textContent = 'Tập ' + epNo + ': ' + String(hs[i]).replace('-', '−') + (hs[i] >= OPTIMAL ? ' (tối ưu)' : '');
      tip.style.left = Math.min(box.width - 10, Math.max(10, x / 300 * box.width)) + 'px';
    });
    spark.addEventListener('pointerleave', function () {
      tip.hidden = true;
      var cross = spark.querySelector('.spark-cross');
      if (cross) cross.setAttribute('visibility', 'hidden');
    });

    function loop(now) {
      raf = 0;
      if (!root.isConnected) return;
      var dt = Math.min(0.1, (now - (last || now)) / 1000);
      last = now;
      var sps = SPEEDS[speed].sps;
      if (playing) {
        acc += dt * sps;
        var n = Math.floor(acc);
        acc -= n;
        for (var i = 0; i < n; i++) step();
        if (n) paintStats();
      }
      st.pops.forEach(function (pp) { pp.t += dt * 1.4; });
      draw(sps > 30 ? 1 : acc);
      schedule();
    }

    function schedule() {
      if (raf || !visible || document.hidden || !root.isConnected) return;
      if (!playing && !st.pops.length) { last = 0; draw(1); return; }
      raf = requestAnimationFrame(loop);
    }

    btnPlay.addEventListener('click', function () { playing = !playing; paintStats(); schedule(); });
    btnSpeed.addEventListener('click', function () { speed = (speed + 1) % SPEEDS.length; paintStats(); });
    root.querySelector('[data-act="reset"]').addEventListener('click', function () { reset(); playing = true; paintStats(); schedule(); });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; schedule(); }).observe(root);
    }
    document.addEventListener('visibilitychange', schedule);
    if (window.ResizeObserver) new ResizeObserver(function () { if (root.isConnected) size(); }).observe(canvas.parentElement);
    new MutationObserver(function () { readColors(); draw(1); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () { readColors(); draw(1); });

    readColors();
    reset();
    size();
    paintStats();
    schedule();
  }

  window.EasyAgent = { mount: mount };
})();
