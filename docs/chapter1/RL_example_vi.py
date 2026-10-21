import gym
import numpy as np


class SimpleAgent:
    def __init__(self, env):
        pass

    def decide(self, observation): # Ra quyết định
        position, velocity = observation
        lb = min(-0.09 * (position + 0.25) ** 2 + 0.03,
                0.3 * (position + 0.9) ** 4 - 0.008)
        ub = -0.07 * (position + 0.38) ** 2 + 0.07
        if lb < velocity < ub:
            action = 2
        else:
            action = 0
        return action # Trả về hành động

    def learn(self, *args): # Học
        pass


def play(env, agent, render=False, train=False):
    episode_reward = 0. # Ghi lại tổng phần thưởng của tập (episode), khởi tạo bằng 0
    observation = env.reset() # Đặt lại môi trường trò chơi, bắt đầu tập mới
    while True: # Lặp liên tục cho đến khi tập kết thúc
        if render: # Kiểm tra có hiển thị hay không
            env.render() # Hiển thị giao diện đồ họa, có thể đóng bằng env.close()
        action = agent.decide(observation)
        next_observation, reward, done, _ = env.step(action) # Thực hiện hành động
        episode_reward += reward # Cộng dồn phần thưởng của tập
        if train: # Kiểm tra có huấn luyện tác tử hay không
            agent.learn(observation, action, reward, done) # Học
        if done: # Tập kết thúc, thoát vòng lặp
            break
        observation = next_observation
    return episode_reward # Trả về tổng phần thưởng của tập


env = gym.make('MountainCar-v0')
env.seed(3) # Đặt hạt giống ngẫu nhiên (random seed) để kết quả có thể tái lập
agent = SimpleAgent(env)
print('Không gian quan sát = {}'.format(env.observation_space))
print('Không gian hành động = {}'.format(env.action_space))
print('Phạm vi quan sát = {} ~ {}'.format(env.observation_space.low,
        env.observation_space.high))
print('Số hành động = {}'.format(env.action_space.n))

episode_reward = play(env, agent, render=True)
print('Phần thưởng của tập = {}'.format(episode_reward))

episode_rewards = [play(env, agent) for _ in range(100)]
print('Phần thưởng trung bình của tập = {}'.format(np.mean(episode_rewards)))
