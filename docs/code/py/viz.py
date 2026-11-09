"""Hàm vẽ và tạo ảnh động (GIF) cho các trang Code.

Chạy trên máy: ảnh GIF được lưu vào thư mục hiện tại (hoặc thư mục trong biến môi trường
CODE_FIG_DIR, script dựng trang dùng biến này để lưu thẳng vào docs/img/code/...).
"""

import os

import numpy as np

SAVED = []          # tên các file GIF đã lưu (script dựng trang đọc danh sách này)


def save_gif(draw, n_frames, name, fps=4, figsize=(6, 3), dpi=80, hold_last=4):
    """Vẽ từng khung bằng draw(fig, i) rồi lưu thành GIF.

    hold_last: số khung lặp lại ở cuối để người xem kịp nhìn kết quả cuối cùng.
    """
    import matplotlib.pyplot as plt
    from matplotlib.animation import FuncAnimation, PillowWriter

    fig = plt.figure(figsize=figsize, dpi=dpi)
    frames = list(range(n_frames)) + [n_frames - 1] * hold_last

    def update(i):
        fig.clear()
        draw(fig, i)

    anim = FuncAnimation(fig, update, frames=frames)
    path = os.path.join(os.environ.get("CODE_FIG_DIR", "."), name)
    anim.save(path, writer=PillowWriter(fps=fps), dpi=dpi)
    plt.close(fig)
    SAVED.append(name)
    return path


def plot_cliff(ax, env, Q=None, path=(), agent=None, title=None):
    """Vẽ lưới vách đá 4x12: màu nền theo max_a Q(s,a), mũi tên chính sách tham lam,
    đường đi `path` (danh sách trạng thái) và vị trí tác tử `agent`."""
    from matplotlib.patches import Rectangle, Circle

    rows, cols = env.rows, env.cols
    if Q is not None:
        V = Q.max(axis=1)
        lo = min(V.min(), -1e-9)
    for s in range(env.n_states):
        r, c = divmod(s, cols)
        y = rows - 1 - r
        if s in env.cliff:
            color = "#555"
        elif s == env.goal:
            color = "#6fa8dc"
        elif Q is not None:
            t = 1 - V[s] / lo if lo < 0 else 1.0           # 1: tốt (gần 0), 0: tệ nhất
            color = (1 - 0.35 * (1 - t), 1 - 0.15 * (1 - t), 1 - 0.05 * (1 - t))
        else:
            color = "white"
        ax.add_patch(Rectangle((c, y), 1, 1, facecolor=color, edgecolor="#bbb", lw=0.5))
        if s == env.start_state:
            ax.text(c + 0.5, y + 0.5, "S", ha="center", va="center", fontsize=8, weight="bold")
        elif s == env.goal:
            ax.text(c + 0.5, y + 0.5, "G", ha="center", va="center", fontsize=8, weight="bold")
    if path:
        pts = [divmod(env.start_state, cols)] + [divmod(s, cols) for s in path]
        xs = [c + 0.5 for r, c in pts]
        ys = [rows - 1 - r + 0.5 for r, c in pts]
        ax.plot(xs, ys, color="#e8710a", lw=2.2, alpha=0.9)
    if agent is not None:
        r, c = divmod(agent, cols)
        ax.add_patch(Circle((c + 0.5, rows - 1 - r + 0.5), 0.32, color="#d93025", zorder=5))
    ax.set_xlim(0, cols)
    ax.set_ylim(0, rows)
    ax.set_aspect("equal")
    ax.set_xticks([])
    ax.set_yticks([])
    if title:
        ax.set_title(title, fontsize=9)
    return ax


def plot_values(ax, V, shape, title=None, vmin=-1, vmax=1, terminal=()):
    """Bản đồ nhiệt giá trị trạng thái, in số trong từng ô."""
    rows, cols = shape
    ax.imshow(np.asarray(V).reshape(rows, cols), cmap="RdYlGn", vmin=vmin, vmax=vmax)
    for s, v in enumerate(V):
        r, c = divmod(s, cols)
        ax.text(c, r, "T" if s in terminal else f"{v:.2f}", ha="center", va="center", fontsize=7)
    ax.set_xticks([])
    ax.set_yticks([])
    if title:
        ax.set_title(title, fontsize=9)
    return ax
