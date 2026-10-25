# Chương 6 Ghi chú trọng tâm

> Ghi chú của người dịch: đây là bản ghi chú tổng hợp kiến thức trọng tâm của [chương 6](chapter6/chapter6_vi), do người dịch biên soạn để đọc lại nhanh. Chương lý thuyết dẫn dắt từ ví dụ đến khái niệm; trang này chỉ giữ khái niệm, công thức, so sánh và chỗ dễ nhầm. Các ý không có trong sách được ghi rõ.

## 1. Bức tranh chung

**Vấn đề của bảng Q (chương 3):** trạng thái liên tục hoặc cực nhiều (ảnh Atari) → không lưu bảng được → **lời nguyền số chiều**.

**Xấp xỉ hàm giá trị (value function approximation):** dùng một hàm có tham số, thường là mạng nơ-ron (**mạng Q**), thay cho bảng:

$$
Q_\phi(\boldsymbol s,\boldsymbol a)\approx Q_\pi(\boldsymbol s,\boldsymbol a)
$$

⭐ **DQN = Q-learning + mạng nơ-ron + 3 mẹo**: mạng mục tiêu, khám phá, phát lại kinh nghiệm.

| | Q-learning (chương 3) | DQN |
|---|---|---|
| Lưu $Q$ | bảng | mạng sâu |
| Dữ liệu học | dùng ngay bước vừa đi | lấy mẫu ngẫu nhiên từ **bộ đệm phát lại** |
| Mục tiêu tính bằng | chính bảng $Q$ | **mạng mục tiêu** $\hat Q$ cố định |

DQN là thuật toán **dựa trên giá trị**: thứ học được là **nhà phê bình (critic)**, không phải chính sách.

## 2. Nhà phê bình: hàm giá trị trạng thái $V_\pi$

$V_\pi(s)$: chính sách $\pi$ nhìn thấy $s$ thì từ đó đến hết trò chơi được **phần thưởng tích lũy kỳ vọng** bao nhiêu. Đầu vào trạng thái, đầu ra một số vô hướng.

⚠️ **Giá trị phụ thuộc diễn viên.** Nhà phê bình không chấm điểm trạng thái "vô căn cứ": cùng trạng thái nhiều quái vật, $\pi$ giỏi được điểm cao, $\pi$ đứng yên bị bắn chết thì $V_\pi(s)$ nhỏ. **Đổi diễn viên thì $V$ đổi.**

**Hai cách huấn luyện $V_\pi$ (đều là bài toán hồi quy):**

- **Monte Carlo:** đầu vào $s_a$ thì đầu ra phải gần lợi tức thật $G_a$.
- **Sai phân thời gian:** $V_\pi(s_t)-V_\pi(s_{t+1})$ phải gần $r_t$.

| | Monte Carlo | Sai phân thời gian |
|---|---|---|
| Cần chơi hết tập | **có** | không, chỉ cần một bước chuyển |
| Phương sai | **lớn**: $G_a$ là tổng của rất nhiều $r$ | **nhỏ**: chỉ một $r$ |
| Nhược điểm | tốn thời gian, phương sai lớn | $V_\pi(s_{t+1})$ ước lượng chưa chắc đúng |
| Dùng nhiều hơn | | **TD** |

💡 Vì sao phương sai MC lớn: $\operatorname{Var}[kX]=k^2\operatorname{Var}[X]$, tổng nhiều biến ngẫu nhiên thì phương sai cộng dồn.

⚠️ **Ghi chú của người dịch:** chương 6 viết TD **không có $\gamma$**, ví dụ $V_\pi(s_t)=V_\pi(s_{t+1})+r_t$ (tức ngầm $\gamma=1$). Dạng đầy đủ là $V_\pi(s_t)=r_t+\gamma V_\pi(s_{t+1})$.

**Ví dụ 8 tập (hình 6.5):** $s_b$ xuất hiện 8 lần, 6 lần được 1, 2 lần được 0 → $V(s_b)=\frac34$. $s_a$ chỉ xuất hiện một lần: $s_a$ ($r=0$) → $s_b$ ($r=0$).

| | $V(s_a)$ | Giả định |
|---|---|---|
| MC | $0$ | $s_a$ **ảnh hưởng** tới $s_b$ (gặp $s_a$ thì $s_b$ hết phần thưởng) |
| TD | $\frac34$ | lần $s_b$ được 0 đó chỉ là **xui**, không do $s_a$ |

TD tính: $V(s_a)=V(s_b)+r=\frac34+0=\frac34$.

💡 Cả hai đều "đúng", vì chúng dựa trên **giả định khác nhau**.

## 3. Hàm giá trị hành động $Q_\pi$

$Q_\pi(s,a)$: ở $s$ **bắt buộc** làm $a$ (dù $\pi$ có thể không chọn $a$), sau đó **để $\pi$ chơi tiếp**; phần thưởng tích lũy kỳ vọng là bao nhiêu.

| Cách viết | Đầu vào | Đầu ra | Dùng cho |
|---|---|---|---|
| Hình 6.6a | $(s,a)$ | một số | hành động **rời rạc và liên tục** |
| Hình 6.6b | $s$ | **một số cho mỗi hành động** | chỉ hành động **rời rạc** |

## 4. Cải thiện chính sách từ $Q$

Có $Q_\pi$ thì có chính sách tốt hơn, **không cần mạng chính sách riêng**:

$$
\pi'(s)=\arg\max_a Q_\pi(s,a) \tag{6.4}
$$

"Tốt hơn" nghĩa là $V_{\pi'}(s)\ge V_\pi(s)$ **với mọi** $s$. Vòng lặp: $\pi$ tương tác → học $Q_\pi$ (MC hoặc TD) → $\pi'$ → thay $\pi$ bằng $\pi'$ → lặp lại.

**Chứng minh trong hai bước:**

① Lệch khỏi $\pi$ **một bước** theo $\pi'$ đã không tệ hơn:

$$
V_\pi(s)=Q_\pi(s,\pi(s))\le\max_a Q_\pi(s,a)=Q_\pi(s,\pi'(s))
$$

② Theo $\pi'$ **ở mọi bước** thì càng không tệ hơn: khai triển $Q_\pi(s,\pi'(s))=\mathbb{E}[r_t+V_\pi(s_{t+1})]$, rồi áp lại ① cho $V_\pi(s_{t+1})$, $V_\pi(s_{t+2})$, ...

$$
\begin{aligned}
V_\pi(s)&\le\mathbb{E}\left[r_t+V_\pi(s_{t+1})\mid s_t=s,a_t=\pi'(s_t)\right]\\
&\le\mathbb{E}\left[r_t+r_{t+1}+V_\pi(s_{t+2})\mid\cdots\right]\\
&\le\cdots\le\mathbb{E}\left[r_t+r_{t+1}+r_{t+2}+\cdots\mid\cdots\right]=V_{\pi'}(s)
\end{aligned}
$$

⚠️ Phép $\arg\max_a$ chỉ dễ khi hành động **rời rạc** (thử từng hành động). Hành động **liên tục** thì không làm được → các chương sau giải quyết.

## 5. Mẹo 1: mạng mục tiêu (target network)

**Vấn đề:** huấn luyện $Q$ như hồi quy với mục tiêu $r_t+Q_\pi(s_{t+1},\pi(s_{t+1}))$. Nhưng mục tiêu dùng **chính mạng đang học** → mỗi lần cập nhật thì mục tiêu cũng chạy → **huấn luyện bất ổn định**.

**Cách giải:** dùng hai mạng.

| | Mạng Q $Q$ (bên trái) | Mạng mục tiêu $\hat Q$ (bên phải) |
|---|---|---|
| Vai trò | đưa ra $Q(s_t,a_t)$ cần khớp | sinh **mục tiêu** |
| Cập nhật | mỗi bước, bằng gradient descent | **cố định**; cứ $C$ lần (ví dụ $C=100$) chép từ $Q$ sang |
| Lúc đầu | | $\hat Q=Q$ |

Với $\hat Q$ cố định, việc học $Q$ trở thành **hồi quy thông thường**: tối thiểu sai số bình phương trung bình giữa $Q(s_t,a_t)$ và mục tiêu.

💡 **Mèo đuổi chuột:** mèo = ước lượng Q, chuột = mục tiêu Q. Cả hai cùng chạy thì đuổi lung tung. Cho chuột **đứng yên vài bước** (cố định $\hat Q$) thì mèo kịp đuổi tới.

⚠️ Hai mạng **không** được cập nhật cùng lúc.

## 6. Mẹo 2: khám phá

**Vấn đề:** chính sách từ $Q$ là $\arg\max$ → **tất định**. Lúc đầu mọi $Q(s,a)=0$; lỡ thử $a_2$ được thưởng thì $Q(s,a_2)$ lớn nhất → mãi chỉ chọn $a_2$, các hành động khác không bao giờ được ước lượng. (Ví dụ: chỉ gọi một món ở nhà hàng; con rắn slither.io chỉ biết đi lên.)

**$\varepsilon$-tham lam:**

$$
a=\begin{cases}\arg\max_a Q(s,a) & \text{xác suất } 1-\varepsilon\\ \text{ngẫu nhiên} & \text{xác suất } \varepsilon\end{cases}
$$

Thường $1-\varepsilon=0.9$, và $\varepsilon$ **giảm dần** khi huấn luyện.

**Khám phá Boltzmann** (giả sử $Q(s,a)\ge 0$):

$$
\pi(a\mid s)=\frac{e^{Q(s,a)/T}}{\sum_{a'\in A}e^{Q(s,a')/T}}
$$

| Hệ số nhiệt độ $T$ | Hành vi |
|---|---|
| rất lớn | các hành động gần như đều nhau → **khám phá** |
| rất nhỏ | ưu tiên $Q$ lớn → **khai thác** |
| $\to 0$ | chỉ chọn hành động tối ưu |

## 7. Mẹo 3: phát lại kinh nghiệm (experience replay)

**Bộ đệm phát lại (replay buffer / replay memory):** lưu các mẫu $(s_t,a_t,r_t,s_{t+1})$, ví dụ tới 50.000 mẫu; đầy thì bỏ mẫu cũ nhất. Mỗi lần cập nhật, **lấy ngẫu nhiên một lô** từ bộ đệm.

- Mẫu trong bộ đệm đến từ **nhiều chính sách cũ khác nhau** → DQN là **off-policy**.

**Hai lợi ích:**

1. **Tiết kiệm tương tác:** tương tác với môi trường mới là bước chậm (huấn luyện trên GPU nhanh). Mỗi mẫu được dùng lại nhiều lần.
2. **Lô đa dạng:** dữ liệu trong lô đến từ nhiều chính sách, nhiều thời điểm → huấn luyện tốt hơn so với lô toàn mẫu giống nhau.

⚠️ **Dùng kinh nghiệm không phải của $\pi$ để ước lượng $Q_\pi$ có sao không?** Không sao. Ta lấy mẫu **từng bước chuyển** chứ không phải cả quỹ đạo; mục tiêu chỉ cần $(s,a,r,s')$.

## 8. Thuật toán DQN (hình 6.14)

1. Khởi tạo $Q$ và $\hat Q=Q$.
2. Mỗi bước $t$:
   - Chọn $a_t$ theo $Q$ có khám phá ($\varepsilon$-tham lam hoặc Boltzmann), nhận $r_t$, $s_{t+1}$.
   - Lưu $(s_t,a_t,r_t,s_{t+1})$ vào bộ đệm phát lại.
   - Lấy **một lô** $(s_i,a_i,r_i,s_{i+1})$ từ bộ đệm (chưa chắc là mẫu vừa lưu).
   - Tính mục tiêu bằng **mạng mục tiêu**, rồi cập nhật $Q$ để $Q(s_i,a_i)$ gần $y$ (hồi quy).
   - Cứ $C$ lần cập nhật thì đặt $\hat Q=Q$.

$$
y=r_i+\max_a\hat Q(s_{i+1},a)
$$

⚠️ **Ghi chú của người dịch:** hình 6.14 bỏ qua $\gamma$. Dạng đầy đủ: $y=r_i+\gamma\max_a\hat Q(s_{i+1},a)$; nếu $s_{i+1}$ là trạng thái kết thúc thì $y=r_i$.

## 9. Tự kiểm tra nhanh

1. Vì sao cần xấp xỉ hàm giá trị? Mạng Q có hai cách viết nào, mỗi cách dùng cho loại hành động nào?
2. Vì sao nói giá trị của trạng thái phụ thuộc vào diễn viên?
3. MC và TD huấn luyện $V_\pi$ khác nhau thế nào? Vì sao phương sai của MC lớn hơn?
4. Trong ví dụ 8 tập, MC và TD cho $V(s_a)$ bằng bao nhiêu? Mỗi cách dựa trên giả định gì?
5. Định nghĩa $Q_\pi(s,a)$. "Bắt buộc làm $a$" nghĩa là gì?
6. Chứng minh $\pi'(s)=\arg\max_a Q_\pi(s,a)$ không tệ hơn $\pi$.
7. Vì sao cần mạng mục tiêu? Giải thích bằng ví dụ mèo đuổi chuột.
8. Vì sao DQN cần khám phá? $\varepsilon$-tham lam và Boltzmann khác nhau thế nào? $T$ lớn/nhỏ có tác dụng gì?
9. Hai lợi ích của phát lại kinh nghiệm? Vì sao nó làm DQN thành off-policy?
10. Viết các bước của DQN và công thức mục tiêu đầy đủ (có $\gamma$ và trạng thái kết thúc).

👉 Xem trực quan: [DQN từng bước trên lưới](viz/dqn.html ':ignore :target=_blank') · [DQN trên CartPole, bật/tắt từng mẹo](viz/dqn-cartpole.html ':ignore :target=_blank').

👉 Kiểm tra trí nhớ bằng [flashcard và quiz của chương 6](review/index.html?ch=6 ':ignore :target=_self'), xem đáp án tham khảo ở [Chương 6 Bài tập](chapter6/chapter6_questions&keywords_vi).
