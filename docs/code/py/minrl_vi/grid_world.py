"""Lưới tất định: phần thưởng nhận khi BƯỚC VÀO ô, giá trị của trạng thái kết thúc bằng 0.

Chuyển thể từ minrl/environment/grid_world.py (MIT). Bỏ lớp GridWorldEnv (bộ chuyển Gymnasium)
vì phần dạng bảng không cần tới.
"""

from enum import IntEnum
import copy

import numpy as np


class Action(IntEnum):
    UP = 0
    RIGHT = 1
    DOWN = 2
    LEFT = 3


### [GridWorld]
class GridWorld:
    def __init__(
        self, size=3, random_seed=None, start_state=0, terminal_states=None, step_reward=-0.1
    ):
        if not isinstance(size, int) or size < 3:
            raise ValueError("size phải là số nguyên >= 3")
        self.size, self.n_states, self.n_actions = size, size * size, 4
        self.start_state = start_state
        # Mặc định: góc trên phải và góc dưới trái là bẫy (-1), góc dưới phải là đích (+1).
        # Bẫy KẾT THÚC tập, không phải tường.
        self.terminal_states = (
            dict(terminal_states)
            if terminal_states is not None
            else {size - 1: -1.0, size * (size - 1): -1.0, size * size - 1: 1.0}
        )
        self.step_reward = float(step_reward)
        self.rng = np.random.default_rng(random_seed)
        self.action_effects = {
            Action.UP: (-1, 0),
            Action.RIGHT: (0, 1),
            Action.DOWN: (1, 0),
            Action.LEFT: (0, -1),
        }
        self.reset()

    def _check_state(self, state):
        if not isinstance(state, (int, np.integer)) or not 0 <= state < self.n_states:
            raise ValueError(f"trạng thái không hợp lệ: {state}")

    def _pos_to_state(self, pos):
        row, col = pos
        return row * self.size + col

    def _state_to_pos(self, state):
        self._check_state(state)
        return divmod(int(state), self.size)

    def reset(self):
        if self.start_state in self.terminal_states:
            raise ValueError("start_state không được là trạng thái kết thúc")
        self.current_pos = self._state_to_pos(self.start_state)
        return self.start_state

    def transition(self, state, action):
        """Mô hình p(s', r | s, a): trả về (s', r, kết_thúc) mà không đổi vị trí hiện tại."""
        row, col = self._state_to_pos(state)
        dr, dc = self.action_effects[Action(action)]
        if state in self.terminal_states:
            return int(state), 0.0, True
        # Đâm biên thì đứng yên tại chỗ.
        pos = (max(0, min(row + dr, self.size - 1)), max(0, min(col + dc, self.size - 1)))
        nxt = self._pos_to_state(pos)
        return (
            nxt,
            float(self.terminal_states.get(nxt, self.step_reward)),
            nxt in self.terminal_states,
        )

    def step(self, action):
        nxt, reward, done = self.transition(self._pos_to_state(self.current_pos), action)
        self.current_pos = self._state_to_pos(nxt)
        return nxt, reward, done, {}

    def get_valid_actions(self, state=None):
        """Hành động không đâm biên. Tác tử của minrl chỉ chọn trong tập này."""
        state = self._pos_to_state(self.current_pos) if state is None else state
        row, col = self._state_to_pos(state)
        if state in self.terminal_states:
            return []
        return [
            a
            for a, (dr, dc) in self.action_effects.items()
            if 0 <= row + dr < self.size and 0 <= col + dc < self.size
        ]
### [GridWorld]

    def clone(self):
        return copy.deepcopy(self)

    def render(self):
        """A: tác tử, T: trạng thái kết thúc, .: ô thường."""
        return "\n".join(
            " ".join(
                "A"
                if (r, c) == self.current_pos
                else "T"
                if r * self.size + c in self.terminal_states
                else "."
                for c in range(self.size)
            )
            for r in range(self.size)
        )


### [CliffWalking]
class CliffWalking(GridWorld):
    """(thêm) Bài toán đi bên vách đá của chương 3: lưới 4x12, xuất phát ở góc dưới trái (S),
    đích ở góc dưới phải (G), giữa hai ô là vách đá.

    Mỗi bước -1; rơi xuống vách đá -100 và bị đưa về S (tập KHÔNG kết thúc); đâm biên thì
    đứng yên, vẫn bị -1. Giống CliffWalking-v1 của Gymnasium. Cùng giao diện với GridWorld
    nên dùng chung được tác tử.
    """

    def __init__(self):
        self.rows, self.cols = 4, 12
        self.size = self.cols                      # để _pos_to_state dùng đúng số cột
        self.n_states, self.n_actions = self.rows * self.cols, 4
        self.start_state = (self.rows - 1) * self.cols
        self.goal = self.n_states - 1
        self.cliff = set(range(self.start_state + 1, self.goal))
        self.terminal_states = {self.goal: -1.0}
        self.action_effects = {
            Action.UP: (-1, 0),
            Action.RIGHT: (0, 1),
            Action.DOWN: (1, 0),
            Action.LEFT: (0, -1),
        }
        self.reset()

    def _state_to_pos(self, state):
        if not 0 <= state < self.n_states:
            raise ValueError(f"trạng thái không hợp lệ: {state}")
        return divmod(int(state), self.cols)

    def transition(self, state, action):
        row, col = self._state_to_pos(state)
        if state == self.goal:
            return int(state), 0.0, True
        dr, dc = self.action_effects[Action(action)]
        nxt = self._pos_to_state((max(0, min(row + dr, self.rows - 1)),
                                  max(0, min(col + dc, self.cols - 1))))
        if nxt in self.cliff:
            return self.start_state, -100.0, False
        return nxt, -1.0, nxt == self.goal

    def get_valid_actions(self, state=None):
        """Cả 4 hướng đều được chọn: đâm biên thì đứng yên và vẫn bị -1, như trong sách."""
        state = self._pos_to_state(self.current_pos) if state is None else state
        return [] if state == self.goal else list(range(4))
### [CliffWalking]

    def render(self, path=()):
        """S xuất phát, G đích, C vách đá; ô thuộc `path` vẽ bằng '*'."""
        rows = []
        for r in range(self.rows):
            line = []
            for c in range(self.cols):
                s = r * self.cols + c
                line.append("S" if s == self.start_state else "G" if s == self.goal
                            else "C" if s in self.cliff else "*" if s in path else ".")
            rows.append(" ".join(line))
        return "\n".join(rows)
