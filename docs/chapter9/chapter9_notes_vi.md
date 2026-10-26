# Chương 9 Ghi chú trọng tâm

> Ghi chú của người dịch: đây là bản ghi chú tổng hợp kiến thức trọng tâm của [chương 9](chapter9/chapter9_vi), do người dịch biên soạn để đọc lại nhanh. Chương lý thuyết dẫn dắt từ ví dụ đến khái niệm; trang này chỉ giữ khái niệm, công thức, so sánh và chỗ dễ nhầm. Các ý không có trong sách được ghi rõ.

## 1. Bức tranh chung

**Diễn viên-nhà phê bình (actor-critic)** = gradient chính sách + học sai phân thời gian (TD).

- **Diễn viên (actor):** hàm chính sách $\pi_\theta(a\mid s)$, học cách hành động để lợi tức lớn nhất.
- **Nhà phê bình (critic):** hàm giá trị, ví dụ $V_\pi(s)$, đánh giá diễn viên tốt hay xấu.
- Nhờ nhà phê bình, có thể **cập nhật từng bước**, không phải đợi hết tập như REINFORCE.

| Thuật toán | Ý chính |
|---|---|
| REINFORCE (chương 4) | dùng lợi tức lấy mẫu $G$, phương sai lớn |
| **A2C** | thay $G-b$ bằng **lợi thế** ước lượng từ $V$ |
| **A3C** | A2C + **nhiều tiến trình bất đồng bộ** |
| Gradient chính sách đạo hàm theo đường đi | nhà phê bình $Q$ chỉ cho diễn viên **nên làm gì** |

## 2. Vì sao cần nhà phê bình

Gradient chính sách có đường cơ sở:

$$
\nabla \bar{R}_{\theta} \approx \frac{1}{N} \sum_{n=1}^{N} \sum_{t=1}^{T_{n}}\Big(\underbrace{\sum_{t'=t}^{T_{n}} \gamma^{t'-t} r_{t'}^{n}}_{G_t^n}-b\Big) \nabla \log p_{\theta}\big(a_{t}^{n} \mid s_{t}^{n}\big) \tag{9.1}
$$

- $G$ là **biến ngẫu nhiên**: cùng $(s,a)$ nhưng mỗi lần chơi ra kết quả khác nhau, phương sai **rất lớn**.
- Mỗi lần cập nhật chỉ lấy mẫu được **ít** quỹ đạo → lỡ lấy phải mẫu xấu là cập nhật tệ.

⭐ **Ý tưởng:** đừng dùng **giá trị lấy mẫu** của $G$, hãy dùng **giá trị kỳ vọng** của nó, do một mạng (nhà phê bình) ước lượng.

**Hai loại nhà phê bình** (đã gặp ở chương 6):

- $V_\pi(s)$: vào $s$, ra **một số**, là kỳ vọng phần thưởng tích lũy từ $s$ theo $\pi$.
- $Q_\pi(s,a)$: vào $s$, ra **một giá trị cho mỗi $a$**, là kỳ vọng phần thưởng tích lũy khi làm $a$ tại $s$ rồi theo $\pi$.

## 3. Diễn viên-nhà phê bình lợi thế (A2C)

**Bước 1: thay từng số hạng bằng kỳ vọng.**

$$
\begin{aligned}\mathbb{E}\big[G_t^n\big]&=Q_{\pi_\theta}\big(s_t^n,a_t^n\big)\\ b&=V_{\pi_\theta}\big(s_t^n\big)\end{aligned}
$$

$V$ là kỳ vọng của $Q$ theo hành động, nên $Q-V$ có cả dương lẫn âm, đúng vai trò của "$G-b$". Đó là **hàm lợi thế**:

$$
A^{\theta}(s,a)=Q_{\pi_\theta}(s,a)-V_{\pi_\theta}(s)
$$

**Bước 2: chỉ ước lượng một mạng.** Hai mạng $Q$ và $V$ thì rủi ro ước lượng sai **gấp đôi**. Dùng

$$
Q_{\pi}\big(s_t^n,a_t^n\big)=\mathbb{E}\big[r_t^n+V_\pi\big(s_{t+1}^n\big)\big]
$$

rồi **bỏ phép kỳ vọng** → lợi thế chỉ cần $V$:

$$
A\approx r_t^n+V_\pi\big(s_{t+1}^n\big)-V_\pi\big(s_t^n\big)
$$

- **Được:** không cần mạng $Q$.
- **Mất:** thêm một biến ngẫu nhiên $r_t$. Nhưng $r_t$ là phần thưởng **một bước**, phương sai nhỏ hơn nhiều so với $G$ (tổng mọi phần thưởng tương lai).
- Vì sao bỏ kỳ vọng được? Sách trả lời theo **thực nghiệm**: bài báo A3C thử nhiều cách, cách này tốt nhất.

**Công thức cập nhật diễn viên:**

$$
\nabla \bar{R}_{\theta} \approx \frac{1}{N} \sum_{n=1}^{N} \sum_{t=1}^{T_{n}}\Big(r_{t}^{n}+V_{\pi}\big(s_{t+1}^{n}\big)-V_{\pi}\big(s_{t}^{n}\big)\Big) \nabla \log p_{\theta}\big(a_{t}^{n} \mid s_{t}^{n}\big) \tag{9.2}
$$

**Quy trình (hình 9.4):** $\pi$ tương tác, thu dữ liệu → dùng dữ liệu **ước lượng $V$** (TD hoặc MC) → dùng $V$ cập nhật $\pi$ theo (9.2) → lặp lại.

⚠️ **Dễ nhầm:** trong A2C, dữ liệu **không** dùng thẳng để cập nhật chính sách như gradient chính sách; nó dùng để học $V$ trước, rồi $V$ mới dùng để cập nhật diễn viên.

⚠️ **Ghi chú của người dịch:**

- (9.2) bỏ qua chiết khấu. Dạng có $\gamma$ chính là **sai số TD** $\delta_t=r_t+\gamma V(s_{t+1})-V(s_t)$; ở trạng thái kết thúc lấy $V(s_{t+1})=0$.
- Nếu $V$ đúng bằng $V_\pi$ thì $\mathbb{E}[\delta_t\mid s_t,a_t]=A(s_t,a_t)$, tức $\delta_t$ là ước lượng **không thiên lệch** của lợi thế. Khi $V$ chỉ là xấp xỉ thì có thiên lệch, đổi lại phương sai nhỏ: đúng sự đánh đổi MC và TD ở chương 3.
- Nhà phê bình học bằng hồi quy, ví dụ tối thiểu $\big(r_t+\gamma V(s_{t+1})-V(s_t)\big)^2$ với mục tiêu được giữ cố định khi lấy gradient.

## 4. Hai mẹo khi cài đặt A2C

**① Dùng chung các tầng đầu.**

- Nhà phê bình $V_\pi(s)$: vào $s$, ra một số vô hướng.
- Diễn viên $\pi(s)$: vào $s$, ra **phân phối hành động** (rời rạc) hoặc **vectơ** (liên tục).
- Cùng đầu vào $s$ → dùng chung vài tầng đầu. Với ảnh Atari, phần dùng chung thường là **CNN** trích đặc trưng cấp cao.

**② Khám phá bằng ràng buộc entropy.** Ràng buộc phân phối do $\pi$ đưa ra sao cho **entropy không quá nhỏ**, tức xác suất các hành động đều hơn → tác tử chịu thử nhiều hành động khác nhau.

💡 **Ghi chú của người dịch:** khi cài đặt thường cộng thêm $\beta\,\mathcal H\big(\pi_\theta(\cdot\mid s)\big)$ vào hàm mục tiêu của diễn viên, $\beta$ là hệ số nhỏ (ví dụ $0{,}01$).

## 5. Diễn viên-nhà phê bình lợi thế bất đồng bộ (A3C)

💡 Hình ảnh: **Ảnh phân thân** của Naruto, nhiều bản sao cùng luyện tập rồi gom kinh nghiệm lại → nhanh hơn.

**Quy trình (hình 9.7):**

1. Có một **mạng toàn cục** (global network) gồm mạng chính sách và mạng giá trị, dùng chung các tầng đầu. Tham số ban đầu $\theta_1$.
2. Nhiều **tiến trình (worker)**, mỗi tiến trình chạy trên **một CPU** (8 tiến trình cần ít nhất 8 CPU).
3. Mỗi tiến trình **sao chép** tham số toàn cục về, tự tương tác với môi trường (nên cho dữ liệu đa dạng, ví dụ mỗi tiến trình xuất phát ở chỗ khác nhau).
4. Tính gradient, **gửi về** trung tâm để cập nhật tham số toàn cục.

⭐ **"Bất đồng bộ":** các tiến trình **không chờ nhau**. Một tiến trình lấy $\theta_1$, lúc gửi gradient về thì tham số toàn cục có thể đã bị tiến trình khác đổi thành $\theta_2$. Không sao, gradient vẫn được áp vào $\theta_2$ như thường.

⚠️ **Dễ nhầm:**

- **A2C** = A3C **bỏ** phần bất đồng bộ, không phải một thuật toán khác hẳn.
- A3C cần **nhiều CPU**; không có thì dùng A2C.

## 6. Gradient chính sách đạo hàm theo đường đi

**pathwise derivative policy gradient**. Ví dụ *Hikaru no Go*: Hikaru là diễn viên, Sai là nhà phê bình.

| | Nhà phê bình thường | Đạo hàm theo đường đi |
|---|---|---|
| Sai nói gì | "nước phi ngựa nhỏ là **không tốt**" | "đừng đi phi ngựa nhỏ, **nên đi phi ngựa lớn**" |
| Diễn viên biết | hành động của mình tốt hay xấu | **hành động nào** mới tốt |

**Hai cách nhìn, cùng một việc:**

- **Từ DQN:** hành động liên tục làm $\arg\max_a Q$ khó giải (chương 8, phương án ④) → học thêm một diễn viên làm **bộ giải** (solver):

$$
\pi'(s)=\arg\max_a Q_\pi(s,a)
$$

- **Từ actor-critic:** nhà phê bình cũ chỉ cho biết "tốt hay không", nay cho biết luôn "thế nào là tốt".

**Cách huấn luyện (hình 9.8):** nối diễn viên với $Q$ thành **một mạng lớn**: $s\to$ diễn viên $\to a\to Q(s,a)$. **Cố định** tham số $Q$, chỉ chỉnh tham số diễn viên bằng gradient ascent để đầu ra $Q$ lớn nhất.

💡 Đây chính là **GAN có điều kiện**: $Q$ là bộ phân biệt (discriminator), diễn viên là bộ sinh (generator).

**Từ DQN sang đạo hàm theo đường đi, 4 thay đổi (hình 9.11):**

1. Chọn $a_t$ bằng **diễn viên $\pi$** (có khám phá) thay cho $Q$.
2. Mục tiêu dùng **diễn viên mục tiêu** $\hat\pi$ thay cho $\max$:

$$
y=r_i+\hat{Q}\big(s_{i+1},\hat{\pi}(s_{i+1})\big)
$$

3. Học thêm $\pi$ để $Q\big(s_i,\pi(s_i)\big)$ **lớn nhất**.
4. Ngoài $\hat Q=Q$, còn đặt lại $\hat\pi=\pi$ sau mỗi $C$ bước.

Các mẹo của DQN (phát lại kinh nghiệm, khám phá…) gần như dùng lại được hết.

⚠️ **Dễ nhầm:** nhà phê bình ở đây là $Q(s,a)$ (cần đầu vào $a$ để lấy gradient theo $a$), **không phải** $V(s)$ như A2C.

⚠️ **Ghi chú của người dịch:**

- Gradient của diễn viên đi **xuyên qua** $Q$ theo quy tắc dây chuyền, nên mới gọi là "theo đường đi":

$$
\begin{aligned}&\nabla_\theta Q\big(s,\pi_\theta(s)\big)\\&=\nabla_a Q(s,a)\big|_{a=\pi_\theta(s)}\,\nabla_\theta\pi_\theta(s)\end{aligned}
$$

- Phương pháp này chính là **DDPG** (chương 12). Ở đó mạng mục tiêu thường được cập nhật **mềm** (soft update) thay vì sao chép sau mỗi $C$ bước.

## 7. Liên hệ với GAN

GAN và actor-critic **rất giống nhau**, đều khó huấn luyện. Bài báo "Connecting Generative Adversarial Network and Actor-Critic Methods" liệt kê kỹ thuật mỗi bên đã dùng, để bên này thử mượn của bên kia.

| Kỹ thuật | GAN | Actor-critic |
|---|---|---|
| Đóng băng khi học | có | có |
| Chuẩn hóa theo lô | có | có |
| Làm mượt nhãn, trung bình lịch sử, phân biệt theo lô nhỏ | có | không |
| Phát lại kinh nghiệm, chính quy hóa entropy, tính tương thích | không | có |
| Mạng mục tiêu | không áp dụng | có |

## 8. Tự kiểm tra nhanh

1. Vì sao REINFORCE có phương sai lớn? Nhà phê bình giải quyết thế nào?
2. Phân biệt hai loại nhà phê bình $V_\pi(s)$ và $Q_\pi(s,a)$.
3. Viết hàm lợi thế. Vì sao nó thay được "$G-b$"?
4. Vì sao A2C chỉ ước lượng $V$? Viết lợi thế chỉ dùng $V$ và nêu cái được, cái mất.
5. Quy trình A2C khác gradient chính sách ở chỗ nào?
6. Hai mẹo khi cài đặt A2C là gì?
7. A3C chạy thế nào? "Bất đồng bộ" nghĩa là gì? A2C khác A3C ở đâu?
8. Trong đạo hàm theo đường đi, nhà phê bình cho diễn viên thêm thông tin gì? Diễn viên được huấn luyện ra sao?
9. Nêu 4 thay đổi từ DQN sang đạo hàm theo đường đi.
10. Vì sao phương pháp này giống GAN có điều kiện?

👉 Xem trực quan: [A2C từng bước](viz/a2c.html ':ignore :target=_blank') · [A3C: các Ảnh phân thân](viz/a3c.html ':ignore :target=_blank').

👉 Kiểm tra trí nhớ bằng [flashcard và quiz của chương 9](review/index.html?ch=9 ':ignore :target=_self'), xem đáp án tham khảo ở [Chương 9 Bài tập](chapter9/chapter9_questions&keywords_vi).
