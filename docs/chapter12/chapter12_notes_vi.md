# Chương 12 Ghi chú trọng tâm

> Ghi chú của người dịch: đây là bản ghi chú tổng hợp kiến thức trọng tâm của [chương 12](chapter12/chapter12_vi), do người dịch biên soạn để đọc lại nhanh. Chương lý thuyết dẫn dắt từ ví dụ đến khái niệm; trang này chỉ giữ khái niệm, công thức, so sánh và chỗ dễ nhầm. Các ý không có trong sách được ghi rõ.

## 1. Bức tranh chung

Chương 12 giải bài toán **hành động liên tục** mà Q-learning, DQN không xử lý được (chương 8):

- **DDPG** = DQN + một **mạng chính sách tất định** đưa thẳng ra hành động → cấu trúc **actor-critic**.
- **TD3** = DDPG + **3 mẹo** chống ước lượng $Q$ quá cao.

💡 DDPG chính là phương pháp **gradient chính sách đạo hàm theo đường đi** ở chương 9.

## 2. Hành động rời rạc và liên tục

| | Rời rạc | Liên tục |
|---|---|---|
| Đặc điểm | **đếm được** | **không đếm được** |
| Ví dụ | CartPole (2), Frozen Lake (4), Pong (6 phím) | lực đẩy xe, góc vô lăng, điện áp 4 cánh quạt |
| Chính sách | **ngẫu nhiên** $\pi_\theta(a_t\mid s_t)$ | **tất định** $\mu_\theta(s_t)$ |
| Tầng đầu ra | **softmax**: xác suất, tổng bằng 1 | **tanh**: giới hạn trong $[-1,1]$, rồi co giãn |

- **Chính sách ngẫu nhiên:** cùng $s$, hành động được **rút theo xác suất** (như bốc thăm).
- **Chính sách tất định:** tham số cố định thì cùng $s$ **luôn ra cùng** $a$.

**Ví dụ co giãn:** mạng ra $2{,}8$ → $\tanh$ ra $0{,}99$ → phạm vi tốc độ $[-2,2]$ → nhân $2$ → hành động $1{,}98$.

## 3. DDPG: tên gọi và cấu trúc

**Tách tên:**

- **Sâu (deep):** dùng mạng nơ-ron.
- **Tất định (deterministic):** đưa ra hành động tất định → dùng được với hành động liên tục.
- **Gradient chính sách (policy gradient):** có mạng chính sách, nhưng cập nhật **sau mỗi bước** (REINFORCE thì mỗi tập).

**Hai mạng chính:**

- **Diễn viên** $\mu_\theta(s)$: mạng chính sách, tham số $\theta$, đưa ra hành động.
- **Nhà phê bình** $Q_w(s,a)$: mạng Q, tham số $w$, chấm điểm hành động.

💡 **Hình ảnh sân khấu (hình 12.6):**

- Diễn viên biểu diễn → giám khảo (nhà phê bình) chấm điểm $Q_w(s,a)$.
- Diễn viên chỉnh $\theta$ để **điểm giám khảo** cao hơn; nó **không quan tâm khán giả**, chỉ chiều giám khảo.
- Giám khảo chỉnh $w$ theo **phản hồi khán giả**, tức **phần thưởng thực** $r$ từ môi trường → chấm ngày càng chuẩn.
- Lúc đầu cả hai đều ngẫu nhiên; nhờ $r$ mà dần dần cùng tốt lên.

## 4. Hàm mất mát của hai mạng

**Diễn viên (hình 12.7):** DQN tìm hành động làm $Q$ lớn nhất; DDPG cũng vậy, nhưng để diễn viên làm. Tối đa hóa $Q$ = tối thiểu hóa $-Q$, thay $a=\mu_\theta(s)$:

$$
\mathcal L(\theta)=-\,Q_w\big(s,\mu_\theta(s)\big)
$$

**Nhà phê bình (hình 12.8):** giống DQN, khớp $Q_w(s,a)$ với mục tiêu bằng **sai số bình phương trung bình**:

$$
\begin{aligned}
Q_\text{target}&=r+\gamma\,Q_{\bar w}\big(s',\mu_{\bar\theta}(s')\big)\\
\mathcal L(w)&=\big(Q_w(s,a)-Q_\text{target}\big)^2
\end{aligned}
$$

⚠️ **Dễ nhầm:** khi tối ưu diễn viên, **chỉ cập nhật $\theta$**, $w$ được giữ nguyên; $-Q$ là hàm hợp của $\theta$ qua $a=\mu_\theta(s)$.

## 5. Bốn mạng, bộ đệm, khám phá

**Vì sao cần mạng mục tiêu:** giống DQN, $Q_\text{target}$ **không ổn định**, và $Q_{\bar w}(s',a')$ bản thân cũng là ước lượng.

| Mạng | Tham số | Vai trò |
|---|---|---|
| Diễn viên | $\theta$ | đưa ra hành động, được tối ưu |
| Nhà phê bình | $w$ | chấm $Q_w(s,a)$, được tối ưu |
| target\_P | $\bar\theta$ | đưa ra $a'=\mu_{\bar\theta}(s')$ cho mục tiêu |
| target\_Q | $\bar w$ | tính $Q_{\bar w}(s',a')$ cho mục tiêu |

Hai mạng mục tiêu **giữ tham số cố định một thời gian** rồi mới đồng bộ từ mạng chính, chỉ để $Q_\text{target}$ ổn định hơn.

**Phát lại kinh nghiệm:** lưu $(s,a,r,s')$ vào bộ đệm rồi lấy mẫu → DDPG là thuật toán **off-policy**.

**Khám phá:** chính sách **tất định** thì tự nó không thử đủ nhiều hành động → **thêm nhiễu vào hành động** khi huấn luyện.

- Bài báo gốc dùng **nhiễu OU** (Ornstein-Uhlenbeck), có **tương quan theo thời gian**.
- Kết quả gần đây: **nhiễu Gauss** không tương quan, trung bình $0$ cũng rất tốt, lại đơn giản hơn → hay dùng hơn.
- Có thể **giảm dần** nhiễu khi huấn luyện; khi **kiểm thử** thì **không** thêm nhiễu.

⚠️ **Ghi chú của người dịch:** sách nói DDPG cập nhật mạng mục tiêu "hơi khác DQN" nhưng không viết công thức. Trong bài báo và code DDPG, đó là **cập nhật mềm** (soft update) sau **mỗi** bước, với $\tau$ nhỏ (ví dụ $0{,}005$):

$$
\begin{aligned}
\bar w&\leftarrow\tau w+(1-\tau)\bar w\\
\bar\theta&\leftarrow\tau\theta+(1-\tau)\bar\theta
\end{aligned}
$$

Mạng mục tiêu vì vậy chỉ "trôi" chậm theo mạng chính, thay vì được sao chép cả khối sau mỗi $C$ bước như DQN.

## 6. Vấn đề của DDPG

- Rất **nhạy** với siêu tham số và cách điều chỉnh.
- Hàm $Q$ bắt đầu **ước lượng quá cao** đáng kể → diễn viên **khai thác sai số** của $Q$ → chính sách bị phá hỏng (hình 12.9).

💡 Cách đo $Q$ thật: theo chính sách hiện tại lấy mẫu **1000 quỹ đạo** bằng Monte Carlo, lấy trung bình $G$, rồi so với $Q$ mạng đưa ra.

⚠️ Đây cũng là bệnh **ước lượng quá cao** của DQN (chương 7), nhưng nặng hơn, vì diễn viên chủ động đi tìm chỗ $Q$ bị đánh giá cao.

## 7. TD3: ba mẹo

**twin delayed DDPG**: "twin" là hai hàm Q, "delayed" là cập nhật trễ.

**① Q-learning kép có cắt (clipped double Q-learning).** Học **hai** hàm Q, $Q_{\phi_1}$ và $Q_{\phi_2}$, cùng một mục tiêu, lấy giá trị **nhỏ hơn**. Viết gọn $Q'_i=Q_{\phi_{i,\text{targ}}}$, $\mu'=\mu_{\theta,\text{targ}}$ (các mạng mục tiêu):

$$
\begin{aligned}q'&=\min_{i=1,2}Q'_i\big(s',a_\text{TD3}(s')\big)\\ y(r,s',d)&=r+\gamma(1-d)\,q'\end{aligned}
$$

($d=1$ nếu $s'$ là trạng thái kết thúc.)

**② Cập nhật chính sách trễ (delayed policy updates).** Cố định diễn viên thì nhà phê bình thường hội tụ đúng; cập nhật cùng lúc mà không có mạng mục tiêu thì bất ổn. → Cập nhật nhà phê bình **thường xuyên hơn**, thường **2 lần** nhà phê bình mới **1 lần** chính sách.

**③ Làm trơn chính sách mục tiêu (target policy smoothing).** Thêm **nhiễu bị cắt** vào hành động mục tiêu:

$$
\begin{aligned}\tilde a&=\mu'(s')+\operatorname{clip}(\epsilon,-c,c)\\ a_\text{TD3}(s')&=\operatorname{clip}\big(\tilde a,\ a_\text{low},\ a_\text{high}\big)\end{aligned}
$$

với $\epsilon\sim N(0,\sigma)$. Nhờ đó $Q$ thay đổi **trơn** theo hành động, một "đỉnh nhọn" sai số của $Q$ khó bị khai thác. Đây là một kiểu **chính quy hóa**.

⚠️ **Dễ nhầm:** có **hai loại nhiễu** khác nhau trong TD3:

- Nhiễu **khám phá**: thêm vào hành động **thực hiện** trong môi trường (Gauss, trung bình $0$), tắt khi kiểm thử.
- Nhiễu **làm trơn**: thêm vào hành động **mục tiêu** $a_\text{TD3}(s')$ khi tính $y$, bị cắt trong $[-c,c]$.

💡 **Ghi chú của người dịch:**

- Lấy $\min$ có thể làm $Q$ hơi **ước lượng thấp**, nhưng ước lượng thấp không bị diễn viên khai thác, nên an toàn hơn ước lượng cao.
- Trong bài báo TD3, các **mạng mục tiêu** cũng chỉ được cập nhật mềm cùng lúc với chính sách, tức cũng bị trễ.

## 8. So sánh và nhận xét (hình 12.10)

- "Our DDPG" (tác giả TD3 tự cài) và DDPG bản chính thức cho kết quả **khác nhau** → DDPG **rất nhạy** với khởi tạo và tham số. TD3 ít nhạy hơn.
- Bài báo TD3: TD3 hơn **SAC** (soft actor-critic); bài báo SAC: SAC hơn TD3 → nhiều thuật toán học tăng cường **nhạy với tham số và điều kiện ban đầu**, đừng tin tuyệt đối một bảng so sánh.
- Code PyTorch của tác giả TD3 viết rất tốt, có thể học như thư viện chuẩn.
- TD3 cũng là **off-policy**, chính sách **tất định**, khám phá bằng nhiễu Gauss có thể giảm dần, kiểm thử không nhiễu.

## 9. Tự kiểm tra nhanh

1. Phân biệt chính sách ngẫu nhiên và tất định. Tầng đầu ra của mỗi loại là gì?
2. Mạng ra $2{,}8$, phạm vi hành động $[-2,2]$: hành động cuối cùng là bao nhiêu?
3. Giải thích từng chữ trong tên DDPG. DDPG cập nhật chính sách khi nào?
4. Diễn viên và nhà phê bình trong DDPG lần lượt học từ đâu?
5. Viết hàm mất mát của diễn viên và của nhà phê bình.
6. DDPG có mấy mạng? Hai mạng mục tiêu dùng để làm gì?
7. Vì sao DDPG là off-policy? Vì sao phải thêm nhiễu vào hành động?
8. DDPG hay gặp vấn đề gì? Đo $Q$ thật bằng cách nào?
9. Nêu 3 mẹo của TD3 và mỗi mẹo sửa điều gì.
10. Trong TD3 có hai loại nhiễu nào, thêm vào đâu?

👉 Xem trực quan: [DDPG trên con lắc](viz/ddpg.html ':ignore :target=_blank') · [TD3: bật/tắt từng mẹo](viz/td3.html ':ignore :target=_blank').

👉 Kiểm tra trí nhớ bằng [flashcard và quiz của chương 12](review/index.html?ch=12 ':ignore :target=_self'), xem đáp án tham khảo ở [Chương 12 Bài tập](chapter12/chapter12_questions&keywords_vi), thực hành ở [Dự án 3](chapter12/project3_vi).
