# Chương 1 Ghi chú trọng tâm

> Ghi chú của người dịch: đây là bản ghi chú tổng hợp kiến thức trọng tâm của [chương 1](chapter1/chapter1_vi), do người dịch biên soạn để đọc lại nhanh. Chương lý thuyết dẫn dắt từ ví dụ đến khái niệm; trang này đi ngược lại: khái niệm, công thức, so sánh, chỗ dễ nhầm. Các ý không có trong sách được ghi rõ.

## 1. Bài toán học tăng cường

**Một câu:** tác tử (agent) tương tác với môi trường (environment) qua nhiều bước, mục tiêu là **tối đa hóa phần thưởng tích lũy kỳ vọng** (expected cumulative reward), không phải phần thưởng của một bước.

Vòng tương tác ở mỗi bước $t$:

$$
s_t \xrightarrow{\ \text{tác tử chọn}\ } a_t \xrightarrow{\ \text{môi trường trả về}\ } (r_{t+1},\ s_{t+1})
$$

- `env.step(action)` trong Gym/Gymnasium chính là một lượt $S \to A \to R \to S'$.
- **Quỹ đạo (trajectory):** $\tau=(s_0,a_0,s_1,a_1,\ldots)$. Một ván chơi trọn vẹn = một **tập (episode)**.
- **Rollout:** từ trạng thái hiện tại, lấy mẫu hành động để sinh ra quỹ đạo.

## 2. Vì sao RL khó hơn học có giám sát

| | Học có giám sát | Học tăng cường |
|---|---|---|
| Dữ liệu | i.i.d., độc lập với nhau | chuỗi thời gian, tương quan mạnh |
| Phản hồi | nhãn đúng, ngay lập tức | chỉ có phần thưởng (vô hướng), thường **trễ** |
| Biết hành động đúng? | có (nhãn) | không, phải **thử-và-sai** |
| Ai tạo dữ liệu? | có sẵn, cố định | chính tác tử, **hành động ảnh hưởng dữ liệu về sau** |
| Giới hạn trên | xấp xỉ con người (người gán nhãn) | có thể vượt con người (AlphaGo) |

💡 **Nhớ:** 4 đặc trưng của RL = thử-và-sai · phần thưởng trễ · thời gian quan trọng (dữ liệu không i.i.d.) · hành động ảnh hưởng dữ liệu nhận được sau đó.

⚠️ **Hệ quả của đặc trưng cuối:** tác tử học kém thì dữ liệu thu được cũng kém, dữ liệu kém lại làm tác tử học kém hơn. Vì vậy RL rất quan tâm tới việc **cải thiện chính sách một cách ổn định**.

## 3. Phần thưởng, lịch sử, trạng thái

- **Phần thưởng** $r$: tín hiệu phản hồi **vô hướng** do môi trường đưa ra. Độ **thưa** (sparsity) của phần thưởng quyết định độ khó của bài toán.
- Trọng tâm: **đánh đổi phần thưởng ngắn hạn và dài hạn**. Hành động hiện tại có thể không đem lại gì ngay nhưng quyết định kết quả cuối.
- **Lịch sử:** $H_t = o_1,a_1,r_1,\ldots,o_t,a_t,r_t$. **Trạng thái** là hàm của lịch sử: $S_t=f(H_t)$.

| | Trạng thái (state) | Quan sát (observation) |
|---|---|---|
| Nội dung | mô tả **đầy đủ** thế giới | mô tả **một phần** trạng thái |
| Ví dụ | toàn bộ trạng thái trong của game | khung hình trên màn hình, các lá bài đã lật |

| | Quan sát được hoàn toàn | Quan sát được một phần |
|---|---|---|
| Tác tử thấy | toàn bộ: $o_t=s_t^e=s_t^a$ | chỉ một phần |
| Mô hình hóa | **MDP** | **POMDP**, bộ bảy $(S,A,T,R,\Omega,O,\gamma)$ |

💡 POMDP là dạng **tổng quát** của MDP: thêm không gian quan sát $O$ và xác suất quan sát $\Omega(o\mid s,a)$.

## 4. Không gian hành động

| Rời rạc (discrete) | Liên tục (continuous) |
|---|---|
| số hành động hữu hạn | hành động là vectơ số thực |
| Atari, cờ vây, robot đi 4 hướng | điều khiển robot, đi theo góc bất kỳ 360° |
| Gym: `spaces.Discrete(n)` | Gym: `spaces.Box(low, high)` |

## 5. Ba thành phần của tác tử

Một tác tử có **một hoặc nhiều** trong ba thành phần:

### 5.1 Chính sách (policy): "làm gì?"

Hàm từ trạng thái sang hành động.

| Ngẫu nhiên (stochastic) | Tất định (deterministic) |
|---|---|
| $\pi(a\mid s)=p(a_t=a\mid s_t=s)$ | $a^*=\arg\max_a \pi(a\mid s)$ |
| ra **phân phối**, rồi lấy mẫu | ra **một** hành động |
| tự có khám phá, khó bị đối thủ đoán | cùng trạng thái luôn cùng hành động |

💡 RL **thường dùng chính sách ngẫu nhiên**: giúp khám phá, và đa dạng hành động khi đối kháng nhiều tác tử.

### 5.2 Hàm giá trị (value function): "tốt đến đâu?"

**Lợi nhuận (return)** từ bước $t$, có chiết khấu $\gamma\in[0,1]$:

$$
G_t=\sum_{k=0}^{\infty}\gamma^k r_{t+k+1}=r_{t+1}+\gamma r_{t+2}+\gamma^2 r_{t+3}+\cdots
$$

$$
V_\pi(s)=\mathbb{E}_\pi\left[G_t \mid s_t=s\right]
$$

$$
Q_\pi(s,a)=\mathbb{E}_\pi\left[G_t \mid s_t=s,\ a_t=a\right]
$$

| | $V_\pi(s)$ | $Q_\pi(s,a)$ |
|---|---|---|
| Đầu vào | trạng thái | trạng thái **và** hành động |
| Ý nghĩa | đứng ở $s$, theo $\pi$ thì được bao nhiêu | ở $s$, làm $a$ trước, **rồi mới** theo $\pi$ |
| Dùng để | đánh giá trạng thái | **chọn hành động trực tiếp**: $\arg\max_a Q(s,a)$ |

- $\gamma$: "100 đồng hôm nay đáng giá hơn 100 đồng 10 ngày nữa". $\gamma$ nhỏ → tác tử thiển cận; $\gamma$ gần 1 → nhìn xa. *(ghi chú của người dịch)*
- Chỉ số $\pi$ trong $\mathbb{E}_\pi$: giá trị **phụ thuộc chính sách**. Đổi chính sách thì giá trị đổi.

⚠️ **Dễ nhầm (ghi chú của người dịch):** **phần thưởng** $r$ là thứ môi trường cho **ngay một bước**; **giá trị** $V$, $Q$ là **dự đoán tổng phần thưởng tương lai** (kỳ vọng của $G_t$). Một trạng thái có phần thưởng 0 vẫn có thể có giá trị rất cao, nếu nó dẫn tới đích.

### 5.3 Mô hình (model): "thế giới sẽ ra sao?"

Hai phần, là hiểu biết của tác tử về môi trường:

- Xác suất chuyển trạng thái:

$$
p^a_{ss'}=p\left(s_{t+1}=s'\mid s_t=s,\ a_t=a\right)
$$

- Hàm phần thưởng:

$$
R(s,a)=\mathbb{E}\left[r_{t+1}\mid s_t=s,\ a_t=a\right]
$$

### 5.4 Ví dụ mê cung (mỗi bước $-1$)

- **Dựa trên chính sách:** mỗi ô ghi **một mũi tên** (hành động tốt nhất).
- **Dựa trên giá trị:** mỗi ô ghi **một con số** (ô xuất phát $-16$ = còn 16 bước). Tác tử nhìn ô lân cận, đi về phía ô có giá trị lớn hơn → **chính sách suy ra từ giá trị**.

## 6. Phân loại tác tử

**Theo thứ được học:**

| Loại | Học gì | Ví dụ (các chương sau) |
|---|---|---|
| Dựa trên giá trị (value-based) | hàm giá trị; chính sách **ngầm**, suy ra bằng $\arg\max$ | Q-learning, Sarsa, DQN |
| Dựa trên chính sách (policy-based) | chính sách, trực tiếp ra xác suất hành động | Policy Gradient |
| Diễn viên-nhà phê bình (actor-critic) | **cả hai**: actor chọn hành động, critic chấm điểm | A2C, A3C, DDPG |

⚠️ Dựa trên giá trị gặp khó khi hành động **liên tục** hoặc rất nhiều (không thể $\arg\max$ trên vô hạn hành động). Khi đó dùng dựa trên chính sách hoặc actor-critic.

**Theo việc có mô hình môi trường hay không:**

| | Có mô hình (model-based) | Không mô hình (model-free) |
|---|---|---|
| Ý tưởng | học/biết $P(s_{t+1}\mid s_t,a_t)$, $R(s_t,a_t)$, lập kế hoạch trong "thế giới ảo" | tương tác trực tiếp môi trường thật, học từ phản hồi |
| Mẫu cần | **ít** hơn (huấn luyện trong thế giới ảo) | **rất nhiều** (Space Invaders ~200 triệu khung hình) |
| Tổng quát hóa | kém hơn, vì mô hình ảo lệch thực tế | tốt hơn |
| Ưu thế | "khả năng tưởng tượng": dự đoán trước | đơn giản, nhiều mã nguồn mở |
| Hiện nay | | **đa số** RL sâu dùng loại này |

💡 **Mẹo phân biệt:** trước khi hành động, tác tử có **dự đoán được** trạng thái và phần thưởng bước sau không? Có → có thể dùng có mô hình.

💡 Có mô hình = không mô hình **+ một bước mô hình hóa môi trường**.

## 7. Học và lập kế hoạch

| Học (learning) | Lập kế hoạch (planning) |
|---|---|
| môi trường **chưa biết** | môi trường **đã biết** (quy tắc, mô hình) |
| phải tương tác để cải thiện chính sách | tính toán, **không cần tương tác** |

💡 Hướng phổ biến: **học mô hình trước, rồi dùng nó để lập kế hoạch**.

## 8. Khám phá và khai thác

- **Khám phá (exploration):** thử hành động mới, có thể tốt hơn, có thể "trắng tay".
- **Khai thác (exploitation):** làm điều đã biết là tốt.
- Số lần thử có hạn → tăng bên này thì giảm bên kia: **thế lưỡng nan khám phá-khai thác**.

Mô hình lý thuyết: **$K$-armed bandit** (RL một bước, $K$ tay cần, xác suất nhả xu chưa biết).

| Chiến lược | Ước lượng tay cần | Phần thưởng tích lũy |
|---|---|---|
| Chỉ khám phá | tốt | kém: phí nhiều lần kéo tay cần dở |
| Chỉ khai thác | kém: dễ kẹt ở tay cần chưa phải tốt nhất | kém |
| **Cân bằng** | đủ tốt | **tốt nhất** |

Ví dụ trong sách: chọn nhà hàng, quảng cáo, khoan dầu, *Street Fighter*.

## 9. Thực hành với Gymnasium

> Sách dùng `gym==0.25.2`; bản dịch đã chuyển sang Gymnasium.

```python
import gymnasium as gym
env = gym.make("CartPole-v0")
observation, info = env.reset(seed=0)
observation, reward, terminated, truncated, info = env.step(action)
done = terminated or truncated   # tương đương 'done' của Gym cũ
env.close()                      # đóng cửa sổ đúng cách
```

- `terminated`: tập kết thúc theo bài toán (sào đổ). `truncated`: bị cắt do hết giới hạn bước.
- `env.action_space.sample()`: hành động ngẫu nhiên (chưa học gì).
- CartPole: 2 hành động; quan sát 4 chiều (vị trí, vận tốc xe, góc sào, vận tốc đỉnh sào); +1 mỗi bước còn đứng.
- MountainCar: quan sát `Box` 2 chiều (vị trí, vận tốc), hành động `Discrete(3)`. `SimpleAgent` trong sách **không học**, chỉ ra quyết định theo công thức cố định.

## 10. Tự kiểm tra nhanh

Đọc xong chương 1, bạn nên trả lời được không cần nhìn sách:

1. Kể 4 điểm khác nhau giữa RL và học có giám sát.
2. Phần thưởng trễ là gì, vì sao nó làm việc huấn luyện khó?
3. Trạng thái khác quan sát thế nào? Khi nào dùng MDP, khi nào dùng POMDP?
4. Viết định nghĩa $G_t$, $V_\pi(s)$, $Q_\pi(s,a)$. Vì sao có $Q$ là chọn được hành động?
5. Chính sách ngẫu nhiên có lợi gì so với tất định?
6. Value-based, policy-based, actor-critic khác nhau ở thứ được học ra sao?
7. Ưu và nhược điểm của RL có mô hình so với không mô hình?
8. Vì sao chỉ khám phá hoặc chỉ khai thác đều không tối đa hóa được phần thưởng tích lũy?

👉 Kiểm tra trí nhớ bằng [flashcard, quiz và lab của chương 1](review/index.html?ch=1 ':ignore :target=_self'), xem đáp án tham khảo ở [Chương 1 Bài tập](chapter1/chapter1_questions&keywords_vi).
