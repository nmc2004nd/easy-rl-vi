"""Bản chuyển thể tiếng Việt một phần của MinRL (https://github.com/10-OASIS-01/minrl).

Lấy từ commit ed5eb99 (2026-10-08), giấy phép MIT (xem LICENSE, bản quyền Yibin (Leon) Liu).
Phần dạng bảng (import thẳng từ minrl_vi) chỉ cần numpy. Các tác tử dùng mạng nơ-ron cần torch và
gymnasium, import từ mô-đun con: minrl_vi.deep_q_learning, minrl_vi.actor_critic, minrl_vi.ppo.
Chú thích đã dịch sang tiếng Việt; phần thêm mới so với bản gốc được ghi "(thêm)".
"""

from .grid_world import Action, GridWorld, CliffWalking
from .policy_evaluation import PolicyEvaluator, random_policy
from .policy_optimization import PolicyOptimizer

__all__ = ["Action", "GridWorld", "CliffWalking", "PolicyEvaluator", "PolicyOptimizer", "random_policy"]
