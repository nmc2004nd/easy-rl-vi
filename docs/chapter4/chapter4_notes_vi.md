# Chương 4 Ghi chú trọng tâm

> Ghi chú của người dịch: đây là bản ghi chú tổng hợp kiến thức trọng tâm của [chương 4](chapter4/chapter4_vi), do người dịch biên soạn để đọc lại nhanh. Chương lý thuyết dẫn dắt từ ví dụ đến khái niệm; trang này chỉ giữ khái niệm, công thức, so sánh và chỗ dễ nhầm. Các ý không có trong sách được ghi rõ.

## 1. Bức tranh chung

Chương 3 học **giá trị** (bảng Q) rồi suy ra chính sách. Chương 4 **học thẳng chính sách**: chính sách là một mạng nơ-ron $\pi_\theta$, chỉnh tham số $\theta$ bằng **đi lên theo gradient** để phần thưởng kỳ vọng lớn nhất.

| | Dựa trên giá trị (chương 3) | Gradient chính sách (chương 4) |
|---|---|---|
| Học gì | $Q(s,a)$ | $\pi_\theta(a\mid s)$ trực tiếp |
| Chính sách | suy ra bằng $\arg\max_a Q$ | mạng đưa ra **xác suất** các hành động, rồi lấy mẫu |
| Cập nhật | bảng Q theo mục tiêu TD | tham số $\theta$ theo gradient |

**Ba thành phần** (hình 4.1):

| Thành phần | Ví dụ trò chơi | Ví dụ cờ vây | Ta điều khiển được? |
|---|---|---|---|
| Diễn viên (actor) | người cầm cần điều khiển | AlphaGo | **có**: chỉnh $\theta$ |
| Môi trường | máy chơi game | đối thủ | không |
| Hàm phần thưởng | luật tính điểm | luật cờ vây | không |

**Mạng chính sách:** đầu vào là quan sát (ảnh trò chơi), đầu ra có **một nơ-ron cho mỗi hành động**, ví dụ trái 0.7, phải 0.2, bắn 0.1.

## 2. Hàm mục tiêu

Một tập cho quỹ đạo $\tau=\{s_1,a_1,s_2,a_2,\ldots,s_T,a_T\}$, tổng phần thưởng $R(\tau)=\sum_t r_t$.

**Xác suất của quỹ đạo:**

$$
p_\theta(\tau)=p(s_1)\prod_{t=1}^{T}\underbrace{p_\theta(a_t\mid s_t)}_{\text{diễn viên}}\ \underbrace{p(s_{t+1}\mid s_t,a_t)}_{\text{môi trường}}
$$

**Phần thưởng kỳ vọng** (cần tối đa hóa):

$$
\bar R_\theta=\sum_\tau R(\tau)\,p_\theta(\tau)=\mathbb{E}_{\tau\sim p_\theta(\tau)}\left[R(\tau)\right]
$$

💡 $R(\tau)$ là **biến ngẫu nhiên** (cả diễn viên lẫn môi trường đều ngẫu nhiên), nên chỉ tối đa hóa được **kỳ vọng** của nó.

## 3. Suy ra gradient chính sách

Ba bước, mỗi bước một mẹo:

**① Chỉ $p_\theta(\tau)$ phụ thuộc $\theta$:**

$$
\nabla\bar R_\theta=\sum_\tau R(\tau)\,\nabla p_\theta(\tau)
$$

**② Mẹo log-đạo hàm** $\nabla f(x)=f(x)\,\nabla\log f(x)$, biến tổng thành kỳ vọng:

$$
\nabla\bar R_\theta=\sum_\tau R(\tau)\,p_\theta(\tau)\,\nabla\log p_\theta(\tau)=\mathbb{E}_{\tau\sim p_\theta}\left[R(\tau)\,\nabla\log p_\theta(\tau)\right]
$$

**③ Các số hạng của môi trường biến mất**, vì $p(s_1)$ và $p(s_{t+1}\mid s_t,a_t)$ không phụ thuộc $\theta$:

$$
\nabla\log p_\theta(\tau)=\sum_{t=1}^{T}\nabla\log p_\theta(a_t\mid s_t)
$$

**Lấy mẫu $N$ quỹ đạo để xấp xỉ kỳ vọng**, được công thức chính của chương:

$$
\nabla\bar R_\theta\approx\frac{1}{N}\sum_{n=1}^{N}\sum_{t=1}^{T_n}R(\tau^n)\,\nabla\log p_\theta(a_t^n\mid s_t^n) \tag{4.4}
$$

$$
\theta\leftarrow\theta+\eta\,\nabla\bar R_\theta
$$

⭐ **Hệ quả quan trọng:** tính gradient **không cần biết mô hình môi trường**, và $R(\tau)$ **không cần khả vi**.

💡 **Ý nghĩa trực quan:** cặp $(s_t,a_t)$ nằm trong quỹ đạo có $R(\tau)>0$ → **tăng** xác suất làm $a_t$ ở $s_t$; $R(\tau)<0$ → **giảm**.

⚠️ Dữ liệu của gradient chính sách thường **chỉ dùng một lần**: lấy mẫu → cập nhật $\theta$ → bỏ dữ liệu → lấy mẫu lại bằng $\theta$ mới. (Lý do: kỳ vọng tính theo $p_\theta$, đổi $\theta$ thì dữ liệu cũ không còn đúng phân phối. Chương 5 sẽ xử lý chuyện này; ghi chú của người dịch.)

## 4. Gradient chính sách = phân loại có trọng số

| | Phân loại thông thường | Gradient chính sách |
|---|---|---|
| Đầu vào | ảnh | trạng thái $s$ |
| Lớp | thứ có trong ảnh | hành động $a$ |
| Nhãn | do người gán, **đúng** | hành động **lấy mẫu được**, chưa chắc đúng |
| Trọng số mỗi mẫu | như nhau | $R(\tau)$ của tập chứa mẫu đó |

Mục tiêu cần tối đa hóa của gradient chính sách:

$$
\frac{1}{N}\sum_{n=1}^{N}\sum_{t=1}^{T_n}R(\tau^n)\log p_\theta(a_t^n\mid s_t^n) \tag{4.5}
$$

💡 **Khác biệt duy nhất:** mỗi mẫu được **nhân trọng số** $R(\tau)$; bỏ $R(\tau)$ đi là đúng mục tiêu log-likelihood của bài phân loại. Tối thiểu hóa entropy chéo = tối đa hóa log-likelihood, nên cài đặt bằng PyTorch/TensorFlow gần như bài phân loại.

## 5. Mẹo 1: thêm đường cơ sở (baseline)

**Vấn đề:** nhiều trò chơi có phần thưởng **luôn dương** (Pong: 0 đến 21) → mọi hành động đều bị đẩy xác suất lên. Vì **xác suất phải chuẩn hóa** (tổng bằng 1), hành động **không được lấy mẫu** sẽ bị giảm xác suất, dù chưa chắc là hành động tồi.

**Cách giải:** trừ đi $b$ để trọng số có cả dương lẫn âm:

$$
\nabla\bar R_\theta\approx\frac{1}{N}\sum_{n=1}^{N}\sum_{t=1}^{T_n}\big(R(\tau^n)-b\big)\,\nabla\log p_\theta(a_t^n\mid s_t^n)
$$

- $R(\tau)>b$ → tăng xác suất; $R(\tau)<b$ (dù dương nhưng nhỏ) → giảm.
- Chọn $b\approx\mathbb{E}[R(\tau)]$: **trung bình** các $R(\tau)$ ghi được trong lúc huấn luyện.

⚠️ **Ghi chú của người dịch:** trừ $b$ **không làm lệch** gradient kỳ vọng, vì

$$
\mathbb{E}_{a\sim\pi_\theta}\left[\nabla\log\pi_\theta(a\mid s)\right]=\nabla\sum_a\pi_\theta(a\mid s)=\nabla 1=0
$$

Đường cơ sở chỉ làm **giảm phương sai** của ước lượng.

## 6. Mẹo 2: gán điểm phù hợp (credit assignment)

**Vấn đề:** cùng một tập, mọi cặp $(s,a)$ nhận **cùng** trọng số $R(\tau)$. Ván thắng không có nghĩa mọi hành động đều tốt.

Ví dụ hình 4.12a: $(s_a,a_1)$ được $+5$, $(s_b,a_2)$ được $0$, $(s_c,a_3)$ được $-2$, tổng $+3$. Điểm đúng của $(s_b,a_2)$ phải là **$-2$** (chỉ tính phần thưởng **từ lúc đó trở đi**), không phải $+3$.

**Bước 1: chỉ cộng phần thưởng từ $t$ trở đi** (phần thưởng trước $t$ không phải công của $a_t$):

$$
\nabla\bar R_\theta\approx\frac{1}{N}\sum_{n=1}^{N}\sum_{t=1}^{T_n}\Big(\sum_{t'=t}^{T_n}r_{t'}^n-b\Big)\nabla\log p_\theta(a_t^n\mid s_t^n)
$$

**Bước 2: chiết khấu** (hành động càng xa thì ảnh hưởng càng ít, $\gamma$ thường 0.9 hoặc 0.99):

$$
\nabla\bar R_\theta\approx\frac{1}{N}\sum_{n=1}^{N}\sum_{t=1}^{T_n}\Big(\sum_{t'=t}^{T_n}\gamma^{t'-t}r_{t'}^n-b\Big)\nabla\log p_\theta(a_t^n\mid s_t^n)
$$

Ví dụ: sau $a_t$ được $+1, +3, -5$ thì điểm của $a_t$ là $1+3\gamma-5\gamma^2$.

## 7. Hàm lợi thế (advantage function)

$$
A^\theta(s_t,a_t)=\sum_{t'=t}^{T_n}\gamma^{t'-t}r_{t'}^n-b
$$

- Đo hành động $a_t$ **tốt hơn các hành động khác bao nhiêu** → **lợi thế tương đối**, không phải tốt tuyệt đối.
- Chỉ số $\theta$: dữ liệu do chính sách $\pi_\theta$ tương tác sinh ra.
- $b$ có thể **phụ thuộc trạng thái**, thường do một mạng ước lượng; mạng ước lượng $A^\theta$ gọi là **nhà phê bình (critic)** → mở đường cho actor-critic (chương 9).

## 8. REINFORCE: gradient chính sách Monte Carlo

| | Monte Carlo (REINFORCE) | Sai phân thời gian |
|---|---|---|
| Cập nhật | **mỗi tập** một lần | **mỗi bước** một lần |
| Tổng phần thưởng tương lai | tính thật: $G_t$ | xấp xỉ bằng hàm Q |

**Gradient của REINFORCE** dùng $G_t$ làm trọng số:

$$
\nabla\bar R_\theta\approx\frac{1}{N}\sum_{n=1}^{N}\sum_{t=1}^{T_n}G_t^n\,\nabla\log\pi_\theta(a_t^n\mid s_t^n)
$$

**Tính $G_t$ ngược từ cuối tập** (một hàm trong code: vào là danh sách phần thưởng, ra là danh sách $G_t$):

$$
G_t=\sum_{k=t+1}^{T}\gamma^{k-t-1}r_k=r_{t+1}+\gamma G_{t+1}
$$

**Quy trình** (hình 4.20):

1. `sample()`: mạng chính sách ra xác suất, lấy mẫu hành động, chơi hết một tập.
2. Tính $G_t$ ngược, được $(s_1,a_1,G_1),\ldots,(s_T,a_T,G_T)$.
3. `learn()`: dựng hàm mất mát, đưa cho bộ tối ưu (Adam).

**Hàm mất mát cho mỗi bước** (one-hot của hành động thật × log xác suất):

$$
\text{mất mát}=-G_t\cdot\underbrace{[0,1,0]}_{a_t\text{ thực tế}}\cdot\log\underbrace{[0.2,0.5,0.3]}_{\pi(a\mid s,\theta)}=-G_t\log\pi(a_t\mid s_t,\theta)
$$

⚠️ **Dễ nhầm:** có **dấu trừ** vì bộ tối ưu **tối thiểu hóa** mất mát, còn ta muốn **tối đa hóa** $G_t\log\pi$.

💡 So với nhận dạng chữ số viết tay: ở đó nhãn one-hot là **đáp án đúng**. Ở đây hành động thật chưa chắc đúng, nên phải nhân $G_t$: $G_t$ lớn → hành động tốt → mẫu này quan trọng; $G_t$ nhỏ → cập nhật ít.

## 9. Tự kiểm tra nhanh

1. Viết $p_\theta(\tau)$. Phần nào ta điều khiển được?
2. Suy ra (4.4) qua ba bước. Vì sao các số hạng của môi trường biến mất?
3. Vì sao $R(\tau)$ không cần khả vi?
4. Gradient chính sách giống và khác bài phân loại ở đâu?
5. Phần thưởng luôn dương gây ra vấn đề gì? Đường cơ sở giải quyết thế nào? Chọn $b$ ra sao?
6. Trong ví dụ hình 4.12a, điểm đúng của $(s_b,a_2)$ là bao nhiêu? Vì sao?
7. Hàm lợi thế là gì? Vì sao gọi là "tương đối"?
8. REINFORCE khác TD ở đâu? Viết công thức tính $G_t$ ngược.
9. Vì sao hàm mất mát của REINFORCE có dấu trừ?

👉 Xem trực quan: [gradient ước lượng và đường cơ sở](viz/pg-sample.html ':ignore :target=_blank') · [REINFORCE từng bước](viz/reinforce.html ':ignore :target=_blank').

👉 Kiểm tra trí nhớ bằng [flashcard và quiz của chương 4](review/index.html?ch=4 ':ignore :target=_self'), xem đáp án tham khảo ở [Chương 4 Bài tập](chapter4/chapter4_questions&keywords_vi).
