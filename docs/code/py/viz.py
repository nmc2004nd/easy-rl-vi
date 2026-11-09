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


def plot_values(ax, V, shape, title=None, vmin=-1, vmax=1, terminal=(), arrows=None):
    """Bản đồ nhiệt giá trị trạng thái, in số trong từng ô.

    arrows: (tùy chọn) danh sách ký hiệu hành động cho từng ô, in dưới con số.
    """
    rows, cols = shape
    ax.imshow(np.asarray(V).reshape(rows, cols), cmap="RdYlGn", vmin=vmin, vmax=vmax)
    for s, v in enumerate(V):
        r, c = divmod(s, cols)
        if s in terminal:
            ax.text(c, r, "T", ha="center", va="center", fontsize=9, weight="bold")
            continue
        dy = -0.15 if arrows is not None else 0
        ax.text(c, r + dy, f"{v:.2f}", ha="center", va="center", fontsize=7)
        if arrows is not None:
            ax.text(c, r + 0.25, arrows[s], ha="center", va="center", fontsize=10)
    ax.set_xticks([])
    ax.set_yticks([])
    if title:
        ax.set_title(title, fontsize=9)
    return ax


def smooth(x, k=20):
    """Trung bình trượt k điểm (để đường cong học bớt nhiễu)."""
    x = np.asarray(x, dtype=float)
    if len(x) < k:
        return x
    return np.convolve(x, np.ones(k) / k, mode="valid")


def plot_returns(curves, xlabel="tập", ylabel="tổng phần thưởng", k=20, ax=None, title=None):
    """Vẽ nhiều đường cong học: curves = {tên: danh sách tổng thưởng mỗi tập}."""
    import matplotlib.pyplot as plt

    if ax is None:
        _, ax = plt.subplots(figsize=(5.5, 3))
    for name, ys in curves.items():
        ax.plot(ys, alpha=0.25)
        s = smooth(ys, k)
        ax.plot(np.arange(len(ys) - len(s), len(ys)), s, label=name, color=ax.lines[-1].get_color())
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    ax.grid(alpha=0.3)
    ax.legend()
    if title:
        ax.set_title(title, fontsize=9)
    return ax


def rollout(env, act, seed=0, max_steps=500):
    """Chạy một tập với hàm chọn hành động act(observation) -> action.
    Trả về (danh sách quan sát, danh sách hành động, tổng phần thưởng)."""
    obs, _ = env.reset(seed=seed)
    observations, actions, total = [obs], [], 0.0
    for _ in range(max_steps):
        a = act(obs)
        obs, r, terminated, truncated, _ = env.step(a)
        observations.append(obs)
        actions.append(a)
        total += r
        if terminated or truncated:
            break
    return observations, actions, total


def draw_cartpole(ax, state, action=None, title=None):
    """Vẽ CartPole từ quan sát (x, x_dot, theta, theta_dot): xe là hình chữ nhật, gậy dài 1."""
    from matplotlib.patches import Rectangle

    x, _, theta, _ = state
    ax.axhline(0, color="#999", lw=1)
    ax.axvspan(-2.4, 2.4, ymin=0, ymax=0.02, color="#ddd")
    ax.add_patch(Rectangle((x - 0.25, -0.05), 0.5, 0.2, color="#4f5bf0"))
    ax.plot([x, x + np.sin(theta)], [0.1, 0.1 + np.cos(theta)], color="#c8701a", lw=5,
            solid_capstyle="round")
    if action is not None:
        d = 0.35 if action == 1 else -0.35
        ax.annotate("", xy=(x + d + np.sign(d) * 0.25, 0.05), xytext=(x + np.sign(d) * 0.25, 0.05),
                    arrowprops=dict(arrowstyle="->", color="#d93025", lw=1.6))
    ax.set_xlim(-2.6, 2.6)
    ax.set_ylim(-0.3, 1.3)
    ax.set_aspect("equal")
    ax.axis("off")
    if title:
        ax.set_title(title, fontsize=9)


def draw_pendulum(ax, state, torque=None, title=None):
    """Vẽ Pendulum từ quan sát (cos θ, sin θ, θ_dot); θ = 0 là thẳng đứng hướng lên."""
    cos_t, sin_t = state[0], state[1]
    ax.plot([0, -sin_t], [0, cos_t], color="#c8701a", lw=6, solid_capstyle="round")
    ax.plot(0, 0, "o", color="#333")
    if torque is not None:
        ax.text(0, -1.25, f"mô-men = {float(np.ravel(torque)[0]):+.2f}", ha="center", fontsize=8)
    ax.set_xlim(-1.3, 1.3)
    ax.set_ylim(-1.4, 1.3)
    ax.set_aspect("equal")
    ax.axis("off")
    if title:
        ax.set_title(title, fontsize=9)


def cartpole_gif(policies, name, seed=0, stride=5, max_steps=500, fps=12):
    """GIF CartPole cho một hoặc nhiều chính sách: policies = {tên: act(obs) -> action}.

    Mỗi chính sách chạy một tập trên CartPole-v1 (cùng seed); vẽ một khung sau mỗi `stride` bước.
    Tập kết thúc sớm thì giữ nguyên khung cuối.
    """
    import gymnasium as gym

    runs = {}
    for label, act in policies.items():
        obs, acts, total = rollout(gym.make("CartPole-v1"), act, seed=seed, max_steps=max_steps)
        runs[label] = (obs, acts, total)
    n = max(len(o) for o, _, _ in runs.values())
    frames = list(range(0, n, stride)) + [n - 1]

    def draw(fig, i):
        t = frames[i]
        for k, (label, (obs, acts, total)) in enumerate(runs.items()):
            ax = fig.add_subplot(len(runs), 1, k + 1)
            j = min(t, len(obs) - 1)
            ended = j == len(obs) - 1 and len(obs) - 1 < max_steps
            status = f"đổ sau {len(obs) - 1} bước" if ended else f"bước {j}"
            draw_cartpole(ax, obs[j], acts[j] if j < len(acts) else None, title=f"{label} · {status}")

    return save_gif(draw, len(frames), name, fps=fps, figsize=(4.2, 1.7 * len(runs)), dpi=72,
                    hold_last=6)
