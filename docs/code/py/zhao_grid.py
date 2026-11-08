"""Thế giới lưới 5x5 của sách Shiyu Zhao (hình 2.7, 3.4) và hàm vẽ dùng chung.

Ô đánh số s = hàng * 5 + cột, hàng và cột tính từ 0, hàng 0 ở trên cùng.
Hành động: a1 lên, a2 phải, a3 xuống, a4 trái, a5 đứng yên (chỉ số 0..4 trong code).
Khác với GridWorld của minrl: ô đích và ô cấm KHÔNG kết thúc tập. Tác tử vào ô cấm
chỉ bị phạt rồi đi tiếp; tới ô đích vẫn được chọn hành động như mọi ô khác.
"""

import numpy as np

FORBIDDEN = {(1, 1), (1, 2), (2, 2), (3, 1), (3, 3), (4, 1)}
TARGET = (3, 2)
MOVES = [(-1, 0), (0, 1), (1, 0), (0, -1), (0, 0)]
ARROWS = ["↑", "→", "↓", "←", "○"]


### [make_grid]
def make_grid(r_boundary=-1, r_forbidden=-1, r_target=1, r_other=0,
              shape=(5, 5), forbidden=FORBIDDEN, target=TARGET):
    """Trả về P[s, a, s'] = p(s'|s,a) và R[s, a] = r(s,a). Mặc định là lưới 5x5 của sách."""
    n_rows, n_cols = shape
    n_s, n_a = n_rows * n_cols, len(MOVES)
    P = np.zeros((n_s, n_a, n_s))
    R = np.zeros((n_s, n_a))
    for i in range(n_rows):
        for j in range(n_cols):
            s = i * n_cols + j
            for a, (di, dj) in enumerate(MOVES):
                ni, nj = i + di, j + dj
                if not (0 <= ni < n_rows and 0 <= nj < n_cols):   # đâm biên: dội lại
                    ni, nj, r = i, j, r_boundary
                elif (ni, nj) == target:
                    r = r_target
                elif (ni, nj) in forbidden:
                    r = r_forbidden
                else:
                    r = r_other
                P[s, a, ni * n_cols + nj] = 1.0
                R[s, a] = r
    return P, R
### [make_grid]


### [value_iteration]
def value_iteration(P, R, gamma, tol=1e-6):
    """Lặp giá trị: trả về (v*, chính sách tham lam dạng mảng chỉ số hành động)."""
    v = np.zeros(P.shape[0])
    while True:
        q = R + gamma * P @ v          # q_k(s,a) = r(s,a) + γ Σ_s' p(s'|s,a) v_k(s')
        v_new = q.max(axis=1)          # v_{k+1}(s) = max_a q_k(s,a)
        if np.abs(v_new - v).max() < tol:
            return v_new, q.argmax(axis=1)
        v = v_new
### [value_iteration]


def step(P, R, s, a, rng=None):
    """Lấy mẫu một bước (s, a) -> (r, s'). Lưới này tất định nên không cần rng."""
    if rng is None:
        s_next = int(P[s, a].argmax())
    else:
        s_next = int(rng.choice(P.shape[2], p=P[s, a]))
    return float(R[s, a]), s_next


def print_policy(pi, shape=(5, 5)):
    """In chính sách tất định (mảng chỉ số hành động) thành lưới mũi tên."""
    pi = np.asarray(pi)
    if pi.ndim == 2:                   # chính sách ngẫu nhiên: lấy hành động xác suất lớn nhất
        pi = pi.argmax(axis=1)
    n_rows, n_cols = shape
    for i in range(n_rows):
        print(" ".join(ARROWS[pi[i * n_cols + j]] for j in range(n_cols)))


def plot_grid(v=None, pi=None, title=None, ax=None, fmt="{:.1f}",
              shape=(5, 5), forbidden=FORBIDDEN, target=TARGET):
    """Vẽ lưới như trong sách: ô cấm màu cam, ô đích màu xanh, giá trị và mũi tên chính sách.

    pi có thể là mảng chỉ số hành động (tất định) hoặc ma trận |S|x5 xác suất (ngẫu nhiên).
    """
    import matplotlib.pyplot as plt
    from matplotlib.patches import Rectangle, Circle

    n_rows, n_cols = shape
    if ax is None:
        _, ax = plt.subplots(figsize=(0.64 * n_cols, 0.64 * n_rows))
    probs = None
    if pi is not None:
        pi = np.asarray(pi)
        probs = np.eye(len(MOVES))[pi] if pi.ndim == 1 else pi
    for i in range(n_rows):
        for j in range(n_cols):
            color = "#f6b26b" if (i, j) in forbidden else "#6fa8dc" if (i, j) == target else "white"
            y = n_rows - 1 - i
            ax.add_patch(Rectangle((j, y), 1, 1, facecolor=color, edgecolor="#555", lw=0.8))
            s = i * n_cols + j
            if v is not None:
                ax.text(j + 0.5, y + 0.5, fmt.format(v[s]), ha="center", va="center",
                        fontsize=8 if probs is None else 6.5,
                        color="#333" if probs is None else "#777")
            if probs is not None:
                for a, (di, dj) in enumerate(MOVES):
                    p = probs[s, a]
                    if p <= 1e-9:
                        continue
                    cx, cy = j + 0.5, y + 0.5
                    if a == 4:
                        ax.add_patch(Circle((cx, cy), 0.12, fill=False, color="#2e7d32", lw=1.2))
                    else:
                        L = 0.38 * p
                        ax.arrow(cx, cy, dj * L, -di * L, head_width=0.1, head_length=0.08,
                                 length_includes_head=True, color="#2e7d32", lw=1.2)
    ax.set_xlim(0, n_cols)
    ax.set_ylim(0, n_rows)
    ax.set_aspect("equal")
    ax.set_xticks([])
    ax.set_yticks([])
    if title:
        ax.set_title(title, fontsize=9)
    return ax
