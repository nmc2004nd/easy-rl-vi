"""Dự đoán: đánh giá một chính sách cố định bằng phương trình kỳ vọng Bellman.

Chuyển thể từ minrl/agents/policy_evaluation.py (MIT).
"""

import numpy as np


def random_policy(env):
    """Chính sách ngẫu nhiên đều trên các hành động hợp lệ: policy[s] là vector xác suất."""
    policy = {}
    for state in range(env.n_states):
        probs = np.zeros(env.n_actions)
        actions = env.get_valid_actions(state)
        if actions:
            probs[actions] = 1 / len(actions)
        policy[state] = probs
    return policy


### [PolicyEvaluator]
class PolicyEvaluator:
    def __init__(self, env, gamma=0.99):
        self.env, self.gamma = env, gamma
        self.state_values = np.zeros(env.n_states)

    def evaluate_policy(self, policy, theta=1e-8, max_iterations=10000):
        self.state_values.fill(0)
        for _ in range(max_iterations):
            old_values = self.state_values.copy()
            for state in range(self.env.n_states):
                if state in self.env.terminal_states:
                    continue
                probs = np.asarray(policy[state])
                value = 0.0
                # V(s) = Σ_a π(a|s) [ r + γ V(s') ]  (s' kết thúc thì không cộng V(s'))
                for action, probability in enumerate(probs):
                    nxt, reward, done = self.env.transition(state, action)
                    value += probability * (reward + self.gamma * (not done) * old_values[nxt])
                self.state_values[state] = value
            if np.max(np.abs(old_values - self.state_values)) < theta:
                break
        return self.state_values.copy()
### [PolicyEvaluator]
