/* Mạng nơ-ron nhỏ cho các trang mô phỏng DQN (docs/viz/dqn*.html).
 * Perceptron nhiều tầng, kích hoạt ReLU ở tầng ẩn, đầu ra tuyến tính (mỗi hành động một giá trị Q),
 * tối ưu bằng Adam trên mất mát bình phương chỉ của hành động đã chọn.
 * Dùng được cả trong trình duyệt (window.NN) lẫn Node (module.exports).
 */
(function (root) {
  'use strict';

  function seeded(seed) {
    var st = seed >>> 0;
    return function () { st = (st + 0x6D2B79F5) >>> 0; var t = st; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }

  // sizes: [đầu vào, ẩn 1, ..., đầu ra]
  function MLP(sizes, rand) {
    rand = rand || Math.random;
    this.sizes = sizes.slice();
    this.W = []; this.b = [];
    for (var l = 0; l < sizes.length - 1; l++) {
      var nIn = sizes[l], nOut = sizes[l + 1], sc = Math.sqrt(2 / nIn), w = new Float64Array(nIn * nOut);
      for (var i = 0; i < w.length; i++) w[i] = (rand() * 2 - 1) * sc * Math.sqrt(3) / 2;
      this.W.push(w); this.b.push(new Float64Array(nOut));
    }
    this.t = 0;
    this.mW = this.W.map(function (w) { return new Float64Array(w.length); }); this.vW = this.W.map(function (w) { return new Float64Array(w.length); });
    this.mb = this.b.map(function (b) { return new Float64Array(b.length); }); this.vb = this.b.map(function (b) { return new Float64Array(b.length); });
  }
  MLP.prototype.clone = function () {
    var c = Object.create(MLP.prototype);
    c.sizes = this.sizes.slice();
    c.W = this.W.map(function (w) { return new Float64Array(w); }); c.b = this.b.map(function (b) { return new Float64Array(b); });
    c.t = 0; c.mW = []; c.vW = []; c.mb = []; c.vb = [];
    return c;
  };
  MLP.prototype.copyFrom = function (o) {
    for (var l = 0; l < this.W.length; l++) { this.W[l].set(o.W[l]); this.b[l].set(o.b[l]); }
  };
  // lan truyền xuôi; trả về các kích hoạt từng tầng (dùng cho lan truyền ngược)
  MLP.prototype.forwardAll = function (x) {
    var acts = [Float64Array.from(x)], L = this.W.length;
    for (var l = 0; l < L; l++) {
      var a = acts[l], nIn = this.sizes[l], nOut = this.sizes[l + 1], w = this.W[l], z = new Float64Array(nOut);
      for (var j = 0; j < nOut; j++) {
        var s = this.b[l][j];
        for (var i = 0; i < nIn; i++) s += a[i] * w[i * nOut + j];
        z[j] = l < L - 1 ? (s > 0 ? s : 0) : s;
      }
      acts.push(z);
    }
    return acts;
  };
  MLP.prototype.forward = function (x) { var a = this.forwardAll(x); return Array.prototype.slice.call(a[a.length - 1]); };
  // một bước Adam trên lô: mất mát ½·(y − Q(s, a))², trung bình theo lô. batch: [{ x, a, y }]
  MLP.prototype.train = function (batch, lr) {
    var L = this.W.length, gW = this.W.map(function (w) { return new Float64Array(w.length); }), gb = this.b.map(function (b) { return new Float64Array(b.length); }), loss = 0, self = this;
    batch.forEach(function (sm) {
      var acts = self.forwardAll(sm.x), out = acts[L], d = new Float64Array(out.length);
      var err = out[sm.a] - sm.y; d[sm.a] = err / batch.length; loss += 0.5 * err * err / batch.length;
      for (var l = L - 1; l >= 0; l--) {
        var a = acts[l], nIn = self.sizes[l], nOut = self.sizes[l + 1], w = self.W[l], dPrev = new Float64Array(nIn);
        for (var j = 0; j < nOut; j++) {
          var dj = d[j]; if (dj === 0) continue;
          gb[l][j] += dj;
          for (var i = 0; i < nIn; i++) { gW[l][i * nOut + j] += a[i] * dj; dPrev[i] += w[i * nOut + j] * dj; }
        }
        if (l > 0) for (var i2 = 0; i2 < nIn; i2++) if (a[i2] <= 0) dPrev[i2] = 0;
        d = dPrev;
      }
    });
    this.t++;
    var b1 = 0.9, b2 = 0.999, eps = 1e-8, c1 = 1 - Math.pow(b1, this.t), c2 = 1 - Math.pow(b2, this.t);
    for (var l = 0; l < L; l++) {
      [[this.W[l], gW[l], this.mW[l], this.vW[l]], [this.b[l], gb[l], this.mb[l], this.vb[l]]].forEach(function (q) {
        var p = q[0], g = q[1], m = q[2], v = q[3];
        for (var k = 0; k < p.length; k++) {
          m[k] = b1 * m[k] + (1 - b1) * g[k]; v[k] = b2 * v[k] + (1 - b2) * g[k] * g[k];
          p[k] -= lr * (m[k] / c1) / (Math.sqrt(v[k] / c2) + eps);
        }
      });
    }
    return loss;
  };

  // một bước Adam với gradient theo đầu ra cho sẵn: batch [{ x, g }], g[k] = ∂L/∂out_k (đã chia cỡ lô nếu cần)
  MLP.prototype.trainGrad = function (batch, lr) {
    var L = this.W.length, gW = this.W.map(function (w) { return new Float64Array(w.length); }), gb = this.b.map(function (b) { return new Float64Array(b.length); }), self = this;
    batch.forEach(function (sm) {
      var acts = self.forwardAll(sm.x), d = Float64Array.from(sm.g);
      for (var l = L - 1; l >= 0; l--) {
        var a = acts[l], nIn = self.sizes[l], nOut = self.sizes[l + 1], w = self.W[l], dPrev = new Float64Array(nIn);
        for (var j = 0; j < nOut; j++) {
          var dj = d[j]; if (dj === 0) continue;
          gb[l][j] += dj;
          for (var i = 0; i < nIn; i++) { gW[l][i * nOut + j] += a[i] * dj; dPrev[i] += w[i * nOut + j] * dj; }
        }
        if (l > 0) for (var i2 = 0; i2 < nIn; i2++) if (a[i2] <= 0) dPrev[i2] = 0;
        d = dPrev;
      }
    });
    this.t++;
    var b1 = 0.9, b2 = 0.999, eps = 1e-8, c1 = 1 - Math.pow(b1, this.t), c2 = 1 - Math.pow(b2, this.t);
    for (var l = 0; l < L; l++) {
      [[this.W[l], gW[l], this.mW[l], this.vW[l]], [this.b[l], gb[l], this.mb[l], this.vb[l]]].forEach(function (q) {
        var p = q[0], g = q[1], m = q[2], v = q[3];
        for (var k = 0; k < p.length; k++) {
          m[k] = b1 * m[k] + (1 - b1) * g[k]; v[k] = b2 * v[k] + (1 - b2) * g[k] * g[k];
          p[k] -= lr * (m[k] / c1) / (Math.sqrt(v[k] / c2) + eps);
        }
      });
    }
  };

  // gradient của mất mát theo đầu vào, với g = ∂L/∂out cho sẵn (không cập nhật tham số); dùng cho ∇_a Q
  MLP.prototype.inputGrad = function (x, g) {
    var acts = this.forwardAll(x), L = this.W.length, d = Float64Array.from(g);
    for (var l = L - 1; l >= 0; l--) {
      var a = acts[l], nIn = this.sizes[l], nOut = this.sizes[l + 1], w = this.W[l], dPrev = new Float64Array(nIn);
      for (var j = 0; j < nOut; j++) { var dj = d[j]; if (dj === 0) continue; for (var i = 0; i < nIn; i++) dPrev[i] += w[i * nOut + j] * dj; }
      if (l > 0) for (var i2 = 0; i2 < nIn; i2++) if (a[i2] <= 0) dPrev[i2] = 0;
      d = dPrev;
    }
    return Array.prototype.slice.call(d);
  };

  var NN = { MLP: MLP, seeded: seeded };
  if (typeof module !== 'undefined' && module.exports) module.exports = NN; else root.NN = NN;
})(this);
