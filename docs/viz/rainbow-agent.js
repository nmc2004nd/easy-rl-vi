/* Tác tử DQN có các kỹ thuật của chương 7: DQN kép, đối đầu, phát lại ưu tiên, nhiều bước.
 * Cần nn.js (window.NN) và dqn-agent.js (window.DQN, để dùng môi trường CartPole).
 * Dùng được cả trong trình duyệt (window.Rainbow) lẫn Node (module.exports).
 */
(function (root) {
  'use strict';
  var isNode = typeof module !== 'undefined' && module.exports;
  var NN = isNode ? require('./nn.js') : root.NN;
  var DQN = isNode ? require('./dqn-agent.js') : root.DQN;

  // ---------- cây tổng cho phát lại ưu tiên: lấy mẫu tỉ lệ với ưu tiên trong O(log n) ----------
  function SumTree(cap) { this.cap = cap; this.tree = new Float64Array(2 * cap); this.data = new Array(cap); this.ptr = 0; this.n = 0; }
  SumTree.prototype.update = function (leaf, p) { var i = leaf + this.cap, ch = p - this.tree[i]; while (i >= 1) { this.tree[i] += ch; i >>= 1; } };
  SumTree.prototype.add = function (p, d) { var leaf = this.ptr; this.data[leaf] = d; this.update(leaf, p); this.ptr = (this.ptr + 1) % this.cap; this.n = Math.min(this.n + 1, this.cap); return leaf; };
  SumTree.prototype.total = function () { return this.tree[1]; };
  SumTree.prototype.get = function (v) { var i = 1; while (i < this.cap) { var l = 2 * i; if (v <= this.tree[l]) i = l; else { v -= this.tree[l]; i = l + 1; } } return i - this.cap; };
  SumTree.prototype.p = function (leaf) { return this.tree[leaf + this.cap]; };

  // o: { nIn, nA, hidden, lr, gamma, buf, batch, C, double, dueling, per, nstep, perAlpha, perBeta0, betaSteps, rand }
  function Agent(o) {
    this.o = o; this.rand = o.rand || Math.random;
    var nOut = o.dueling ? o.nA + 1 : o.nA;
    this.net = new NN.MLP([o.nIn, o.hidden, o.hidden, nOut], this.rand);
    this.tgt = this.net.clone();
    this.tree = new SumTree(o.buf); this.maxP = 1; this.list = [];
    this.nq = []; this.updates = 0; this.copies = 0; this.lastLoss = null;
  }
  Agent.prototype.qOf = function (net, x) {
    var out = net.forward(x); if (!this.o.dueling) return out;
    var A = out.slice(1), m = A.reduce(function (a, b) { return a + b; }, 0) / A.length;
    return A.map(function (a) { return out[0] + a - m; });
  };
  Agent.prototype.q = function (x) { return this.qOf(this.net, x); };
  Agent.prototype.act = function (x, eps) {
    if (this.rand() < eps) return { a: Math.floor(this.rand() * this.o.nA), rnd: true };
    var q = this.q(x), b = 0; for (var i = 1; i < q.length; i++) if (q[i] > q[b]) b = i;
    return { a: b, rnd: false, q: q };
  };
  Agent.prototype.size = function () { return this.o.per ? this.tree.n : this.list.length; };
  Agent.prototype._push = function (e) {
    if (this.o.per) this.tree.add(Math.pow(this.maxP, this.o.perAlpha), e);
    else { this.list.push(e); if (this.list.length > this.o.buf) this.list.shift(); }
  };
  // nhiều bước: gom N bước liên tiếp thành một mẫu (x, a, R = Σ γ^k r, x_N, done, γ^N)
  Agent.prototype.observe = function (x, a, r, x2, done) {
    var N = this.o.nstep || 1, g = this.o.gamma, self = this;
    this.nq.push({ x: x, a: a, r: r, x2: x2, done: done });
    function emit() {
      var R = 0, gk = 1, last = self.nq[0], d = false;
      for (var k = 0; k < self.nq.length && k < N; k++) { var t = self.nq[k]; R += gk * t.r; gk *= g; last = t; if (t.done) { d = true; break; } }
      var f = self.nq[0];
      self._push({ x: f.x, a: f.a, R: R, xn: last.x2, done: d, gn: gk });
      self.nq.shift();
    }
    if (this.nq.length >= N) emit();
    if (done) while (this.nq.length) emit();
  };
  Agent.prototype.learn = function (keep) {
    var o = this.o, n = this.size(); if (n < o.batch) return null;
    var B = o.batch, idx = [], ws = [], beta = Math.min(1, o.perBeta0 + (1 - o.perBeta0) * this.updates / o.betaSteps), es = [];
    if (o.per) {
      var tot = this.tree.total(), seg = tot / B, pmin = Infinity;
      for (var k = 0; k < B; k++) { var leaf = this.tree.get(seg * k + this.rand() * seg); if (leaf >= n) leaf = n - 1; idx.push(leaf); es.push(this.tree.data[leaf]); }
      var Pi = idx.map(function (lf) { return this.tree.p(lf) / tot; }, this), wmax = 0;
      ws = Pi.map(function (P) { var w = Math.pow(n * Math.max(P, 1e-12), -beta); if (w > wmax) wmax = w; return w; });
      ws = ws.map(function (w) { return w / wmax; });
    } else {
      for (var k2 = 0; k2 < B; k2++) { var j = Math.floor(this.rand() * n); idx.push(j); es.push(this.list[j]); ws.push(1); }
    }
    var self = this, loss = 0, batch = [], tdAbs = [];
    es.forEach(function (e, i) {
      var y;
      if (e.done) y = e.R;
      else {
        var qt = self.qOf(self.tgt, e.xn), aStar;
        if (o.double) { var qo = self.q(e.xn); aStar = 0; for (var a = 1; a < qo.length; a++) if (qo[a] > qo[aStar]) aStar = a; }
        else { aStar = 0; for (var a2 = 1; a2 < qt.length; a2++) if (qt[a2] > qt[aStar]) aStar = a2; }
        y = e.R + e.gn * qt[aStar];
      }
      var qv = self.q(e.x), err = qv[e.a] - y, gsc = ws[i] * err / B, gvec = new Array(o.dueling ? o.nA + 1 : o.nA).fill(0);
      if (keep && i === 0) {
        var raw = self.net.forward(e.x), info = { e: e, y: y, q: qv, w: ws[i], beta: beta };
        if (!e.done) { info.qt = self.qOf(self.tgt, e.xn); info.qo = o.double ? self.q(e.xn) : null; }
        if (o.dueling) info.VA = raw;
        if (o.per) { info.P = self.tree.p(idx[0]) / self.tree.total(); info.n = n; }
        self.lastInfo = info;
      }
      if (o.dueling) { gvec[0] = gsc; for (var k3 = 0; k3 < o.nA; k3++) gvec[1 + k3] = gsc * ((k3 === e.a ? 1 : 0) - 1 / o.nA); }
      else gvec[e.a] = gsc;
      batch.push({ x: e.x, g: gvec }); loss += ws[i] * 0.5 * err * err / B; tdAbs.push(Math.abs(err));
    });
    this.net.trainGrad(batch, o.lr);
    if (o.per) idx.forEach(function (lf, i) { var p = tdAbs[i] + 1e-3; if (p > self.maxP) self.maxP = p; self.tree.update(lf, Math.pow(p, o.perAlpha)); });
    this.updates++; this.lastLoss = loss;
    if (this.updates % o.C === 0) { this.tgt.copyFrom(this.net); this.copies++; }
    return { loss: loss, beta: beta };
  };

  // huấn luyện trên CartPole; ghi lại tổng thưởng và (ước lượng Q, lợi tức chiết khấu thật) trung bình mỗi tập
  var CP = DQN.CP;
  function trainCartPole(o, episodes, cap, epsDecay, onEp) {
    var ag = new Agent(o), steps = 0, rets = [], qEst = [], qTrue = [];
    for (var ep = 0; ep < episodes; ep++) {
      var s = CP.reset(ag.rand), traj = [];
      for (var t = 0; t < cap; t++) {
        var x = CP.norm(s), eps = Math.max(0.05, 1 - steps / epsDecay), a = ag.act(x, eps).a, r2 = CP.step(s, a);
        var end = r2.done || t === cap - 1;
        ag.observe(x, a, 1, CP.norm(r2.s), end);
        traj.push(x); s = r2.s; steps++;
        ag.learn();
        if (end) break;
      }
      var T = traj.length, G = 0, gs = [];
      for (var k = T - 1; k >= 0; k--) { G = 1 + o.gamma * G; gs.unshift(G); }
      var qe = 0; traj.forEach(function (xx) { qe += Math.max.apply(null, ag.q(xx)) / T; });
      rets.push(T); qEst.push(qe); qTrue.push(gs.reduce(function (a2, b) { return a2 + b; }, 0) / T);
      if (onEp) onEp(ep, ag);
    }
    return { rets: rets, qEst: qEst, qTrue: qTrue };
  }

  var Rainbow = { Agent: Agent, SumTree: SumTree, trainCartPole: trainCartPole };
  if (isNode) module.exports = Rainbow; else root.Rainbow = Rainbow;
})(this);
