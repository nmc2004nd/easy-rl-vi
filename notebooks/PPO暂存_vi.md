## Giới thiệu nguyên lý

PPO là một thuật toán on-policy, có hiệu năng khá tốt, tiền thân của nó là thuật toán TRPO, cũng là một loại thuật toán policy gradient (gradient chính sách), nó là thuật toán học tăng cường mặc định hiện nay của OpenAI, nguyên lý cụ thể có thể tham khảo [Giảng giải thuật toán PPO](../docs/chapter5/chapter5_vi.md). Thuật toán PPO chủ yếu có hai biến thể, một là kết hợp KL penalty (phạt KL), một là dùng phương pháp clip (cắt), bài này cài đặt biến thể sau tức ```PPO-clip```.
## Mã giả
Muốn cài đặt thì trước hết phải hiểu mã giả, mã giả như sau:
![Mô tả hình ảnh](assets/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0pvaG5KaW0w,size_16,color_FFFFFF,t_70.png)
Đây là một hình khá phù hợp tìm được trên Google, tác giả hơi lười nên không sửa, ```k``` ở trên chính là episode (tập) thứ ```k```, bước thứ sáu là tối ưu bằng phương pháp giảm gradient ngẫu nhiên (SGD), hàm mất mát ở đây (tức phần phía sau ```argmax```) có thể hơi khó hiểu, có thể tham khảo [PPO paper](https://arxiv.org/abs/1707.06347), như sau:
![Mô tả hình ảnh](assets/20210323154236878.png)
Bước thứ bảy là một hàm mất mát bình phương, tức bình phương hiệu giữa lợi tức thực tế và lợi tức kỳ vọng.
## Thực hành code
[Bấm để xem code đầy đủ](https://github.com/JohnJim0816/rl-tutorials/tree/master/PPO)
### PPOmemory
Trước hết bước thứ ba cần thu thập thông tin của một quỹ đạo, ta có thể định nghĩa một ```PPOmemory``` để lưu các thông tin liên quan:
```python
class PPOMemory:
    def __init__(self, batch_size):
        self.states = []
        self.probs = []
        self.vals = []
        self.actions = []
        self.rewards = []
        self.dones = []
        self.batch_size = batch_size
    def sample(self):
        batch_step = np.arange(0, len(self.states), self.batch_size)
        indices = np.arange(len(self.states), dtype=np.int64)
        np.random.shuffle(indices)
        batches = [indices[i:i+self.batch_size] for i in batch_step]
        return np.array(self.states),\
                np.array(self.actions),\
                np.array(self.probs),\
                np.array(self.vals),\
                np.array(self.rewards),\
                np.array(self.dones),\
                batches

    def push(self, state, action, probs, vals, reward, done):
        self.states.append(state)
        self.actions.append(action)
        self.probs.append(probs)
        self.vals.append(vals)
        self.rewards.append(reward)
        self.dones.append(done)

    def clear(self):
        self.states = []
        self.probs = []
        self.actions = []
        self.rewards = []
        self.dones = []
        self.vals = []
```
Hàm push ở đây là đưa các đại lượng liên quan thu được vào memory, sample là lấy mẫu ngẫu nhiên ra, thuận tiện cho bước giảm gradient ngẫu nhiên ở bước thứ sáu.
### PPO model
model chính là hai mạng actor (diễn viên) và critic (nhà phê bình):
```python
import torch.nn as nn
from torch.distributions.categorical import Categorical
class Actor(nn.Module):
    def __init__(self,n_states, n_actions,
            hidden_dim=256):
        super(Actor, self).__init__()

        self.actor = nn.Sequential(
                nn.Linear(n_states, hidden_dim),
                nn.ReLU(),
                nn.Linear(hidden_dim, hidden_dim),
                nn.ReLU(),
                nn.Linear(hidden_dim, n_actions),
                nn.Softmax(dim=-1)
        )
    def forward(self, state):
        dist = self.actor(state)
        dist = Categorical(dist)
        return dist

class Critic(nn.Module):
    def __init__(self, n_states,hidden_dim=256):
        super(Critic, self).__init__()
        self.critic = nn.Sequential(
                nn.Linear(n_states, hidden_dim),
                nn.ReLU(),
                nn.Linear(hidden_dim, hidden_dim),
                nn.ReLU(),
                nn.Linear(hidden_dim, 1)
        )
    def forward(self, state):
        value = self.critic(state)
        return value
```
Ở đây Actor là để có được một phân phối xác suất (Categorical, cũng có thể là phân phối khác, có thể tìm hiểu torch distributions), critic dựa vào trạng thái hiện tại để có được một giá trị, số chiều đầu vào ở đây có thể là ```n_states+n_actions```, tức là đưa cả thông tin action vào mạng critic, như vậy sẽ tốt hơn một chút, bạn nào quan tâm có thể thử.

### PPO update
Định nghĩa một hàm update chủ yếu để cài đặt bước thứ sáu và bước thứ bảy trong mã giả:
```python
def update(self):
    for _ in range(self.n_epochs):
        state_arr, action_arr, old_prob_arr, vals_arr,\
        reward_arr, dones_arr, batches = \
                self.memory.sample()
        values = vals_arr
        ### compute advantage ###
        advantage = np.zeros(len(reward_arr), dtype=np.float32)
        for t in range(len(reward_arr)-1):
            discount = 1
            a_t = 0
            for k in range(t, len(reward_arr)-1):
                a_t += discount*(reward_arr[k] + self.gamma*values[k+1]*\
                        (1-int(dones_arr[k])) - values[k])
                discount *= self.gamma*self.gae_lambda
            advantage[t] = a_t
        advantage = torch.tensor(advantage).to(self.device)
        ### SGD ###
        values = torch.tensor(values).to(self.device)
        for batch in batches:
            states = torch.tensor(state_arr[batch], dtype=torch.float).to(self.device)
            old_probs = torch.tensor(old_prob_arr[batch]).to(self.device)
            actions = torch.tensor(action_arr[batch]).to(self.device)
            dist = self.actor(states)
            critic_value = self.critic(states)
            critic_value = torch.squeeze(critic_value)
            new_probs = dist.log_prob(actions)
            prob_ratio = new_probs.exp() / old_probs.exp()
            weighted_probs = advantage[batch] * prob_ratio
            weighted_clipped_probs = torch.clamp(prob_ratio, 1-self.policy_clip,
                    1+self.policy_clip)*advantage[batch]
            actor_loss = -torch.min(weighted_probs, weighted_clipped_probs).mean()
            returns = advantage[batch] + values[batch]
            critic_loss = (returns-critic_value)**2
            critic_loss = critic_loss.mean()
            total_loss = actor_loss + 0.5*critic_loss
            self.actor_optimizer.zero_grad()
            self.critic_optimizer.zero_grad()
            total_loss.backward()
            self.actor_optimizer.step()
            self.critic_optimizer.step()
    self.memory.clear()
```
Phần này trước tiên trích xuất thông tin quỹ đạo đã thu thập từ memory, sau đó tính GAE, tức advantage (lợi thế), tiếp theo dùng giảm gradient ngẫu nhiên để cập nhật mạng, cuối cùng xóa memory để thu thập thông tin quỹ đạo tiếp theo.

Kết quả cuối cùng như sau:
![Mô tả hình ảnh](assets/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0pvaG5KaW0w,size_16,color_FFFFFF,t_70-20210405110725113.png)