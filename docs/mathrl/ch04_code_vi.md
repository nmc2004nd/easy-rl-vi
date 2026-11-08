# Chương 4 · Code

> Ghi chú của người biên soạn: trang này không có trong sách. Nó cài đặt lại các thuật toán của [chương 4](mathrl/ch04_vi) bằng numpy, theo đúng ký hiệu của sách, rồi đối chiếu với lớp `PolicyOptimizer` của [MinRL](https://github.com/10-OASIS-01/minrl/tree/ed5eb99) (Yibin Liu, giấy phép MIT). Ký hiệu theo [Quy ước ký hiệu](notation_vi): $v_k$, $q_k$ là giá trị trung gian của vòng lặp $k$; $v_{\pi_k}$ là giá trị trạng thái thật của chính sách $\pi_k$.

Bấm **▶ Chạy** để chạy code ngay trong trình duyệt. Lần đầu phải tải Python, mất khoảng 10–20 giây. Các khối trên trang dùng chung biến như notebook: chạy một khối thì các khối phía trên chưa chạy sẽ được tự chạy trước. Bấm **Sửa** để đổi tham số rồi chạy lại.

## 1. Thế giới lưới của sách

<small class="viz-ref">Hình 2.7, 3.4 · mục "Kiểm tra bằng mã" của chương 3</small>

Hàm `make_grid` trả về mô hình dưới dạng hai mảng: `P[s, a, s']` $= p(s'\mid s,a)$ và `R[s, a]` $= r(s,a)$. Đây là đúng hàm ở mục kiểm tra bằng mã của chương 3, có thêm tham số `shape`, `forbidden`, `target` để dựng các lưới khác. Hàm đã nạp sẵn trong mô-đun `zhao_grid`, cùng hàm vẽ `plot_grid`.

```pyrun
import numpy as np
import matplotlib.pyplot as plt
from zhao_grid import make_grid, value_iteration, plot_grid, print_policy

P, R = make_grid()                       # r_boundary = r_forbidden = -1, r_target = 1
print("P:", P.shape, " R:", R.shape)     # 25 trạng thái, 5 hành động
v_star, pi_star = value_iteration(P, R, gamma=0.9)
plot_grid(v_star, pi_star, title="v* và π* (hình 3.4a)")
```

[zhao_grid.py](../code/py/zhao_grid.py ':include :type=code :fragment=make_grid')

Khác biệt cần nhớ so với lưới của MinRL (mục 5): ở đây ô đích và ô cấm **không** kết thúc tập. Tác tử vào ô cấm chỉ bị phạt rồi đi tiếp, và có thêm hành động $a_5$ "đứng yên".

## 2. Lặp giá trị

<small class="viz-ref">Mục 4.1 · thuật toán 4.1 · bảng 4.1–4.3</small>

### 2.1 Theo từng phần tử, đúng như thuật toán 4.1

Mỗi vòng lặp đi qua chuỗi $v_k(s) \to q_k(s,a) \to \pi_{k+1}(s) \to v_{k+1}(s) = \max_a q_k(s,a)$.

| Thuật toán 4.1 | Dòng code |
|---|---|
| $q_k(s,a) = r(s,a) + \gamma \sum_{s'} p(s'\mid s,a)\, v_k(s')$ | `q[s, a] = R[s, a] + gamma * P[s, a] @ v` |
| $a_k^{\ast}(s) = \arg\max_a q_k(s,a)$ | `pi[s] = q[s].argmax()` |
| $v_{k+1}(s) = \max_a q_k(s,a)$ | `v_new[s] = q[s].max()` |
| dừng khi $\lVert v_{k+1} - v_k \rVert$ nhỏ | `if np.abs(v_new - v).max() < tol` |

```pyrun
def value_iteration_elementwise(P, R, gamma, tol=1e-6, verbose=False):
    n_s, n_a = R.shape
    v = np.zeros(n_s)                                   # v_0
    for k in range(10_000):
        q = np.zeros((n_s, n_a))
        pi = np.zeros(n_s, dtype=int)
        v_new = np.zeros(n_s)
        for s in range(n_s):
            for a in range(n_a):
                q[s, a] = R[s, a] + gamma * P[s, a] @ v  # q_k(s,a)
            pi[s] = q[s].argmax()                        # π_{k+1}: tham lam
            v_new[s] = q[s].max()                        # v_{k+1}(s) = max_a q_k(s,a)
        if verbose:
            print(f"k = {k}: π_{k+1} = {[f'a{a+1}' for a in pi]}, v_{k+1} = {v_new.round(2)}")
        if np.abs(v_new - v).max() < tol:
            return v_new, pi, k + 1
        v = v_new
```

### 2.2 Ví dụ lưới 2×2

Lưới ở hình 4.2 có ô cấm $s_2$ và ô đích $s_4$. Ta chạy ba vòng đầu để so với bảng 4.2, 4.3 và các giá trị $v_1$, $v_2$ trong sách:

```pyrun
P2, R2 = make_grid(shape=(2, 2), forbidden={(0, 1)}, target=(1, 1))
v = np.zeros(4)
for k in range(3):
    q = R2 + 0.9 * P2 @ v                    # dạng ma trận của vòng lặp trong 2.1
    print(f"k = {k}\nq_{k} =\n{q.round(2)}")
    print(f"π_{k+1}: {[f'a{a+1}' for a in q.argmax(axis=1)]}   v_{k+1} = {q.max(axis=1).round(2)}\n")
    v = q.max(axis=1)
```

Ở $k = 0$, $q_0(s_1, a_3) = q_0(s_1, a_5) = 0$. Sách chọn $a_5$ (đứng yên), còn `argmax` của numpy lấy chỉ số nhỏ nhất nên chọn $a_3$. Cả hai đều đúng, vì chọn hành động nào trong các hành động cùng đạt cực đại cũng không ảnh hưởng tới sự hội tụ. Các giá trị $v_1 = (0, 1, 1, 1)$ và $v_2 = (0.9, 1.9, 1.9, 1.9)$ khớp với sách.

### 2.3 Trên lưới 5×5

```pyrun
v_vi, pi_vi, n_iter = value_iteration_elementwise(P, R, gamma=0.9)
print(f"Hội tụ sau {n_iter} vòng lặp")
print(v_vi.reshape(5, 5).round(1))
print_policy(pi_vi)
```

## 3. Lặp chính sách

<small class="viz-ref">Mục 4.2 · thuật toán 4.2 · hình 4.4</small>

Mỗi vòng có hai bước:

1. **Đánh giá chính sách**: tìm $v_{\pi_k}$ từ phương trình Bellman $v_{\pi_k} = r_{\pi_k} + \gamma P_{\pi_k} v_{\pi_k}$. Ở đây dùng nghiệm dạng đóng: giải hệ tuyến tính $(I - \gamma P_{\pi_k})\, v = r_{\pi_k}$. Mục 4 dùng phép lặp.
2. **Cải thiện chính sách**: $\pi_{k+1}(s) = \arg\max_a q_{\pi_k}(s,a)$.

Với chính sách tất định `pi` (mảng chỉ số hành động), $P_{\pi}$ và $r_\pi$ chỉ là các hàng của `P`, `R` ứng với hành động đã chọn: `P[np.arange(n), pi]`.

```pyrun
def policy_evaluation_exact(P, R, pi, gamma):
    n = len(pi)
    P_pi, r_pi = P[np.arange(n), pi], R[np.arange(n), pi]
    return np.linalg.solve(np.eye(n) - gamma * P_pi, r_pi)     # v_π = (I - γP_π)^{-1} r_π

def policy_iteration(P, R, gamma, pi0, max_iter=100):
    pi, history = np.array(pi0), []
    for k in range(max_iter):
        v = policy_evaluation_exact(P, R, pi, gamma)            # 1. đánh giá: v_{π_k}
        history.append((pi.copy(), v))
        q = R + gamma * P @ v                                   # q_{π_k}(s,a)
        pi_new = q.argmax(axis=1)                               # 2. cải thiện: π_{k+1}
        if np.array_equal(pi_new, pi):
            return pi, v, history
        pi = pi_new
    return pi, v, history
```

Bây giờ dựng lại hình 4.4: $r_{\text{forbidden}} = -10$, xuất phát từ một chính sách tất định ngẫu nhiên. Chính sách ban đầu trong sách không được cho cụ thể, nên ta tự sinh một chính sách bằng hạt giống `seed=0`.

```pyrun
P10, R10 = make_grid(r_forbidden=-10)
pi0 = np.random.default_rng(0).integers(0, 5, size=25)        # π_0 ngẫu nhiên
pi_pi, v_pi, history = policy_iteration(P10, R10, 0.9, pi0)
print(f"Hội tụ sau {len(history) - 1} lần cải thiện")

show = [0, 1, 2, 3, 5, len(history) - 1]
fig, axes = plt.subplots(2, 3, figsize=(8.4, 6))
for ax, k in zip(axes.flat, show):
    pi_k, v_k = history[k]
    plot_grid(v_k, pi_k, title=f"π_{k} và v_π{k}", ax=ax)
plt.tight_layout()
```

Hai hiện tượng mà sách nêu đều thấy rõ. Thứ nhất, các ô **gần đích** tìm được hành động đúng trước, rồi thông tin lan dần ra xa. Thứ hai, ở $\pi_0$, ô nào chọn "đứng yên" trong ô cấm có giá trị $-10/(1-0.9) = -100$. Giá trị cuối cùng phải trùng với $v^{\ast}$ tìm bằng lặp giá trị:

```pyrun
v_star10, _ = value_iteration(P10, R10, 0.9, tol=1e-10)
print("‖v_π_cuối − v*‖∞ =", np.abs(v_pi - v_star10).max())
```

## 4. Lặp chính sách cắt cụt

<small class="viz-ref">Mục 4.3 · thuật toán 4.3 · hình 4.5</small>

Thay vì giải chính xác $v_{\pi_k}$, ta chỉ lặp $j_{\text{truncate}}$ bước $v \leftarrow r_{\pi_k} + \gamma P_{\pi_k} v$, khởi tạo từ $v$ của vòng trước. Với $j_{\text{truncate}} = 1$ ta được lặp giá trị, còn khi $j_{\text{truncate}} \to \infty$ ta được lặp chính sách. Khối dưới vẽ sai số $\lVert v_k - v^{\ast}\rVert_\infty$ theo số vòng lặp ngoài. Đó là số liệu của bảng ở mục "Kiểm tra bằng số" trong chương 4, nhưng vẽ thành đường.

```pyrun
def truncated_policy_iteration(P, R, gamma, j_truncate, n_iter=60):
    n = P.shape[0]
    v, pi, history = np.zeros(n), np.zeros(n, dtype=int), []   # π_0: luôn đi lên
    for k in range(n_iter):
        P_pi, r_pi = P[np.arange(n), pi], R[np.arange(n), pi]
        for _ in range(j_truncate):                            # đánh giá cắt cụt
            v = r_pi + gamma * P_pi @ v
        history.append(v.copy())
        pi = (R + gamma * P @ v).argmax(axis=1)                # cải thiện
    return v, pi, history

plt.figure(figsize=(5.5, 3.2))
for j in [1, 3, 10, 100]:
    _, _, h = truncated_policy_iteration(P, R, 0.9, j)
    err = [np.abs(x - v_star).max() for x in h]
    plt.semilogy(range(1, len(err) + 1), np.maximum(err, 1e-12), label=f"j_truncate = {j}")
plt.xlabel("vòng lặp ngoài k"); plt.ylabel("‖v_k − v*‖∞")
plt.legend(); plt.grid(alpha=.3)
```

## 5. Đối chiếu với MinRL

Lớp `PolicyOptimizer` của MinRL cài cả hai thuật toán cho `GridWorld` của nó. Lớp này đã nạp sẵn trong gói `minrl_vi`. Code viết theo kiểu "từng trạng thái một" (một vòng `for` qua các trạng thái, không dùng ma trận), rất gần với thuật toán 4.1 và 4.2.

[policy_optimization.py](../code/py/minrl_vi/policy_optimization.py ':include :type=code :fragment=PolicyOptimizer')

| | Sách (Zhao) | MinRL |
|---|---|---|
| Kết thúc | Không có trạng thái kết thúc, bài toán kéo dài vô hạn | Ô đích và ô bẫy kết thúc tập, giá trị của chúng bằng 0 (`(not done) * V[s']`) |
| Hành động | 5 hành động, gồm "đứng yên"; đâm biên bị phạt $r_{\text{boundary}}$ | 4 hướng; hành động đâm biên bị loại (`get_valid_actions`) |
| Phần thưởng | Nhận khi vào ô: $0$, $r_{\text{forbidden}}$ hoặc $r_{\text{target}}$ | Nhận khi vào ô: `step_reward` hoặc phần thưởng của ô kết thúc |
| Lặp giá trị | $v_{k+1}(s) = \max_a q_k(s,a)$ | `state_values[s] = action_values(s, old_values).max()`, cùng kiểu cập nhật đồng bộ (dùng `old_values`) |
| Đánh giá trong lặp chính sách | Giải đúng hoặc lặp tới hội tụ | Lặp tới khi thay đổi `< theta` (`PolicyEvaluator`) |

```pyrun
from minrl_vi import GridWorld, PolicyOptimizer

env = GridWorld(size=4)
opt = PolicyOptimizer(env, gamma=0.9)
policy_vi, V_vi = opt.value_iteration()
policy_pi, V_pi = PolicyOptimizer(env, gamma=0.9).policy_iteration()
print(V_vi.reshape(4, 4).round(3))
print("Lặp giá trị và lặp chính sách cho cùng V:", np.allclose(V_vi, V_pi))
opt.print_policy(policy_vi)                 # T: trạng thái kết thúc
```

Trên lưới của MinRL, cả hai thuật toán cũng cho cùng một giá trị tối ưu. Ô càng gần đích thì giá trị càng lớn, giống hiện tượng thứ hai của hình 4.4.

## 6. Bài tập

1. Ở mục 2.3, đổi `gamma=0.9` thành `0.5` rồi `0.0`. So với hình 3.4b, c.
2. Ở mục 3, đổi `seed` của $\pi_0$ vài lần. Số lần cải thiện có thay đổi không? Giá trị cuối cùng có thay đổi không?
3. Ở mục 4, ghi lại thời gian chạy của mỗi $j_{\text{truncate}}$ (dùng `time.perf_counter()`). Giá trị nào cho kết quả đủ tốt nhanh nhất?
4. Viết `policy_evaluation_iterative(P, R, pi, gamma, tol)` thay cho `policy_evaluation_exact`, rồi kiểm tra hai hàm cho cùng kết quả.

<details>
<summary>Gợi ý đáp án</summary>

1. Với $\gamma = 0.5$, chính sách trở nên thiển cận: tác tử đi đường vòng tránh mọi ô cấm, và các ô xa đích có giá trị gần 0. Với $\gamma = 0$, tác tử chỉ nhìn phần thưởng tức thời. Mọi ô không kề đích đều có $v^{\ast} = 0$ (chỉ cần tránh biên và ô cấm), còn những ô kề đích thì đi vào đích. Đúng như hình 3.4b, c.
2. Số lần cải thiện thay đổi theo $\pi_0$, nhưng giá trị cuối cùng luôn là $v^{\ast}$, vì $v^{\ast}$ là duy nhất. Chính sách cuối cùng có thể khác nhau ở những ô có nhiều hành động cùng tối ưu.
3. Tùy máy. Khi người biên soạn đo (dừng lúc sai số dưới $10^{-4}$), $j_{\text{truncate}} = 1$ cần 111 vòng ngoài, $10$ cần 14 vòng, $20$ cần 8 vòng, còn $50$ và $100$ cần 7 vòng. Thời gian ngắn nhất rơi vào khoảng $j_{\text{truncate}} = 10$–$20$: số vòng ngoài ít hơn lặp giá trị nhiều, mà mỗi vòng lại rẻ hơn lặp chính sách đầy đủ.
4. `v = np.zeros(n)`, rồi lặp `v_new = r_pi + gamma * P_pi @ v` cho tới khi `np.abs(v_new - v).max() < tol`. Kết quả khớp với `np.linalg.solve` tới cỡ `tol / (1 - gamma)`.

</details>
