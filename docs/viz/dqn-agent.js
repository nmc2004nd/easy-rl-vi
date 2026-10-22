/* Tác tử DQN và môi trường CartPole cho các trang mô phỏng chương 6.
 * Cần nn.js (window.NN). Dùng được cả trong trình duyệt (window.DQN) lẫn Node (module.exports).
 */
(function (root) {
  'use strict';
  var NN = typeof module !== 'undefined' && module.exports ? require('./nn.js') : root.NN;

  // ---------- tác tử DQN (hình 6.14) ----------
  // o: { sizes, lr, gamma, buf, batch, C, replay (bool), target (bool), rand }
  function Agent(o) {
    this.o = o; this.rand = o.rand || Math.random;
    this.net = new NN.MLP(o.sizes, this.rand);
    this.tgt = this.net.clone();
    this.buf = []; this.updates = 0; this.copies = 0; this.lastLoss = null;
  }
  Agent.prototype.q = function (x) { return this.net.forward(x); };
  Agent.prototype.qt = function (x) { return this.tgt.forward(x); };
  Agent.prototype.act = function (x, eps) {
    if (this.rand() < eps) return { a: Math.floor(this.rand() * this.o.sizes[this.o.sizes.length - 1]), rnd: true };
    var q = this.q(x), b = 0; for (var i = 1; i < q.length; i++) if (q[i] > q[b]) b = i;
    return { a: b, rnd: false, q: q };
  };
  // e: { x, a, r, x2, done, ... (các trường hiển thị thêm) }
  Agent.prototype.store = function (e) { this.buf.push(e); if (this.buf.length > this.o.buf) this.buf.shift(); };
  // một lần cập nhật: lấy lô, tính mục tiêu y bằng mạng mục tiêu (hoặc chính mạng Q nếu tắt), một bước Adam
  Agent.prototype.learn = function (keep) {
    var n = this.buf.length; if (!n) return null;
    var B = Math.min(this.o.batch, n), idx = [];
    if (this.o.replay) for (var k = 0; k < B; k++) idx.push(Math.floor(this.rand() * n));
    else for (var k2 = 0; k2 < B; k2++) idx.push(n - 1 - k2); // không phát lại: dùng các bước vừa đi
    var tn = this.o.target ? this.tgt : this.net, g = this.o.gamma, self = this, rows = [];
    var batch = idx.map(function (i) {
      var e = self.buf[i], qn = e.done ? null : tn.forward(e.x2), y = e.done ? e.r : e.r + g * Math.max.apply(null, qn);
      if (keep) rows.push({ i: i, e: e, qn: qn, y: y, q: self.net.forward(e.x)[e.a] });
      return { x: e.x, a: e.a, y: y };
    });
    this.lastLoss = this.net.train(batch, this.o.lr);
    this.updates++;
    var copied = false;
    if (this.o.target && this.updates % this.o.C === 0) { this.tgt.copyFrom(this.net); this.copies++; copied = true; }
    if (!this.o.target) this.tgt.copyFrom(this.net);
    return { rows: rows, loss: this.lastLoss, copied: copied, idx: idx };
  };

  // ---------- CartPole (phương trình như gym CartPole) ----------
  var CP = {
    G: 9.8, MC: 1, MP: 0.1, L: 0.5, F: 10, TAU: 0.02, XLIM: 2.4, TLIM: 12 * Math.PI / 180,
    reset: function (rand) { return [0, 0, 0, 0].map(function () { return rand() * 0.1 - 0.05; }); },
    step: function (s, a) {
      var tm = CP.MC + CP.MP, pml = CP.MP * CP.L, f = a ? CP.F : -CP.F, x = s[0], xd = s[1], th = s[2], thd = s[3];
      var ct = Math.cos(th), st = Math.sin(th), temp = (f + pml * thd * thd * st) / tm;
      var tha = (CP.G * st - ct * temp) / (CP.L * (4 / 3 - CP.MP * ct * ct / tm)), xa = temp - pml * tha * ct / tm;
      x += CP.TAU * xd; xd += CP.TAU * xa; th += CP.TAU * thd; thd += CP.TAU * tha;
      return { s: [x, xd, th, thd], r: 1, done: x < -CP.XLIM || x > CP.XLIM || th < -CP.TLIM || th > CP.TLIM };
    },
    norm: function (s) { return [s[0] / 2.4, s[1] / 3, s[2] / 0.21, s[3] / 3]; }
  };
  // huấn luyện nhanh (không vẽ); dùng cho phần so sánh. Trả về tổng thưởng từng tập.
  function trainCartPole(o, episodes, cap, epsDecay) {
    var ag = new Agent(o), steps = 0, rets = [];
    for (var ep = 0; ep < episodes; ep++) {
      var s = CP.reset(ag.rand), R = 0;
      for (var t = 0; t < cap; t++) {
        var eps = Math.max(0.05, 1 - steps / epsDecay), a = ag.act(CP.norm(s), eps).a, o2 = CP.step(s, a);
        ag.store({ x: CP.norm(s), a: a, r: 1, x2: CP.norm(o2.s), done: o2.done });
        s = o2.s; steps++; R++;
        if (ag.buf.length >= o.batch) ag.learn(false);
        if (o2.done) break;
      }
      rets.push(R);
    }
    return rets;
  }

  var DQN = { Agent: Agent, CP: CP, trainCartPole: trainCartPole };
  if (typeof module !== 'undefined' && module.exports) module.exports = DQN; else root.DQN = DQN;
})(this);
