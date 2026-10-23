/* Tác tử DDPG / TD3 và môi trường con lắc (Pendulum) cho docs/viz/ddpg.html, td3.html.
 * Cần nn.js (window.NN). Dùng được cả trong trình duyệt (window.DDPG) lẫn Node (module.exports).
 */
(function (root) {
  'use strict';
  var isNode = typeof module !== 'undefined' && module.exports;
  var NN = isNode ? require('./nn.js') : root.NN;

  // ---------- con lắc như Pendulum của Gym: mô-men u ∈ [−2, 2], 200 bước mỗi tập ----------
  var PD = { G: 10, DT: 0.05, MAXV: 8, MAXU: 2, T: 200 };
  function angNorm(x) { return ((x + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI; }
  PD.reset = function (r) { return { th: (2 * r() - 1) * Math.PI, w: 2 * r() - 1 }; };
  PD.obs = function (s) { return [Math.cos(s.th), Math.sin(s.th), s.w / PD.MAXV]; };
  PD.step = function (s, u) {
    u = Math.max(-PD.MAXU, Math.min(PD.MAXU, u));
    var th = angNorm(s.th), cost = th * th + 0.1 * s.w * s.w + 0.001 * u * u;
    var w = s.w + (3 * PD.G / 2 * Math.sin(s.th) + 3 * u) * PD.DT; w = Math.max(-PD.MAXV, Math.min(PD.MAXV, w));
    return { s: { th: s.th + w * PD.DT, w: w }, r: -cost };
  };
  PD.angNorm = angNorm;

  function gauss(r) { var u = r() || 1e-12, v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

  // o: { hidden, lrA, lrC, gamma, tau, batch, buf, noise, twin, delay, smooth, smoothSig, smoothClip, rand }
  function Agent(o) {
    this.o = o; var r = this.rand = o.rand || Math.random, H = o.hidden || 32;
    this.actor = new NN.MLP([3, H, H, 1], r); this.actorT = this.actor.clone();
    this.c1 = new NN.MLP([4, H, H, 1], r); this.c1T = this.c1.clone();
    if (o.twin) { this.c2 = new NN.MLP([4, H, H, 1], r); this.c2T = this.c2.clone(); }
    // khởi tạo lớp cuối của diễn viên nhỏ để tránh tanh bão hòa ngay từ đầu
    var Wl = this.actor.W[this.actor.W.length - 1]; for (var i = 0; i < Wl.length; i++) Wl[i] *= 0.1; this.actorT.copyFrom(this.actor);
    this.buf = []; this.ptr = 0; this.updates = 0; this.steps = 0;
  }
  Agent.prototype.mu = function (net, x) { return PD.MAXU * Math.tanh(net.forward(x)[0]); };
  Agent.prototype.act = function (x, noise) { var a = this.mu(this.actor, x); if (noise) a += noise * PD.MAXU * gauss(this.rand); return Math.max(-PD.MAXU, Math.min(PD.MAXU, a)); };
  Agent.prototype.q = function (net, x, a) { return net.forward([x[0], x[1], x[2], a / PD.MAXU])[0]; };
  Agent.prototype.store = function (x, a, r, x2) {
    var e = { x: x, a: a, r: r, x2: x2 };
    if (this.buf.length < this.o.buf) this.buf.push(e); else { this.buf[this.ptr] = e; this.ptr = (this.ptr + 1) % this.o.buf; }
  };
  function soft(t, s, tau) { for (var l = 0; l < t.W.length; l++) { var a = t.W[l], b = s.W[l]; for (var k = 0; k < a.length; k++) a[k] += tau * (b[k] - a[k]); var c = t.b[l], d = s.b[l]; for (var k2 = 0; k2 < c.length; k2++) c[k2] += tau * (d[k2] - c[k2]); } }
  // một lần cập nhật; keep = true thì ghi lại phép tính của mẫu đầu tiên
  Agent.prototype.learn = function (keep) {
    var o = this.o, B = o.batch, n = this.buf.length; if (n < Math.max(B, o.warm || 0)) return null;
    var self = this, r = this.rand, cb1 = [], cb2 = [], info = null, lossC = 0;
    for (var k = 0; k < B; k++) {
      var e = this.buf[Math.floor(r() * n)], a2 = this.mu(this.actorT, e.x2), eps = 0;
      if (o.smooth) { eps = Math.max(-o.smoothClip, Math.min(o.smoothClip, o.smoothSig * PD.MAXU * gauss(r))); a2 = Math.max(-PD.MAXU, Math.min(PD.MAXU, a2 + eps)); }
      var q1t = this.q(this.c1T, e.x2, a2), qt = q1t, q2t = null;
      if (o.twin) { q2t = this.q(this.c2T, e.x2, a2); qt = Math.min(q1t, q2t); }
      var y = e.r + o.gamma * qt, xa = [e.x[0], e.x[1], e.x[2], e.a / PD.MAXU];
      var q1 = this.c1.forward(xa)[0]; cb1.push({ x: xa, a: 0, y: y }); lossC += 0.5 * (q1 - y) * (q1 - y) / B;
      if (o.twin) cb2.push({ x: xa, a: 0, y: y });
      if (keep && k === 0) info = { e: e, a2: a2, eps: eps, q1t: q1t, q2t: q2t, y: y, q1: q1 };
    }
    this.c1.train(cb1, o.lrC); if (o.twin) this.c2.train(cb2, o.lrC);
    this.updates++;
    var doActor = !o.delay || this.updates % 2 === 0, lossA = null;
    if (doActor) {
      var ab = []; lossA = 0;
      for (var k2 = 0; k2 < B; k2++) {
        var x = this.buf[Math.floor(r() * n)].x, z = this.actor.forward(x)[0], t = Math.tanh(z), a = PD.MAXU * t, xa2 = [x[0], x[1], x[2], t];
        var qv = this.c1.forward(xa2)[0], dqda = this.c1.inputGrad(xa2, [1])[3] / PD.MAXU; // ∂Q/∂a (đầu vào nhà phê bình là a/2)
        lossA -= qv / B;
        ab.push({ x: x, g: [-dqda * PD.MAXU * (1 - t * t) / B] });
        if (keep && k2 === 0 && info) { info.ax = x; info.aa = a; info.aq = qv; info.dqda = dqda; info.dadz = PD.MAXU * (1 - t * t); }
      }
      this.actor.trainGrad(ab, o.lrA);
      soft(this.actorT, this.actor, o.tau);
    }
    soft(this.c1T, this.c1, o.tau); if (o.twin) soft(this.c2T, this.c2, o.tau);
    if (info) { info.lossC = lossC; info.lossA = lossA; info.doActor = doActor; }
    return { lossC: lossC, lossA: lossA, doActor: doActor, info: info };
  };
  // chạy một tập không nhiễu; trả tổng thưởng, Q ước lượng tại trạng thái đầu và lợi tức chiết khấu thật
  Agent.prototype.evalEp = function (r, gamma) {
    var s = PD.reset(r), x = PD.obs(s), a0 = this.act(x, 0), q0 = this.q(this.c1, x, a0), G = 0, disc = 1, tot = 0;
    for (var t = 0; t < PD.T; t++) { var a = this.act(PD.obs(s), 0), st = PD.step(s, a); tot += st.r; G += disc * st.r; disc *= gamma; s = st.s; }
    return { ret: tot, q0: q0, g0: G };
  };

  // huấn luyện E tập; mỗi tập ghi tổng thưởng; cứ evalEvery tập thì đánh giá (Q ước lượng và thật)
  function train(o, E, onEp) {
    var ag = new Agent(o), r = ag.rand, rets = [], qEst = [], qTrue = [];
    for (var ep = 0; ep < E; ep++) {
      var s = PD.reset(r), tot = 0;
      for (var t = 0; t < PD.T; t++) {
        var x = PD.obs(s), a = ag.steps < (o.warm || 0) ? (2 * r() - 1) * PD.MAXU : ag.act(x, o.noise), st = PD.step(s, a);
        ag.store(x, a, st.r * (o.rScale || 1), PD.obs(st.s)); ag.steps++; tot += st.r; s = st.s;
        ag.learn(false);
      }
      rets.push(tot);
      var ev = ag.evalEp(r, o.gamma); qEst.push(ev.q0 / (o.rScale || 1)); qTrue.push(ev.g0);
      if (onEp) onEp(ep, ag, tot);
    }
    return { rets: rets, qEst: qEst, qTrue: qTrue, agent: ag };
  }

  var DDPG = { PD: PD, Agent: Agent, train: train, gauss: gauss };
  if (isNode) module.exports = DDPG; else root.DDPG = DDPG;
})(this);
