# Quy ước ký hiệu

> Ghi chú của người biên soạn: các tài liệu học tăng cường dùng ký hiệu rất khác nhau, ngay trong cùng một cuốn sách. Trang này chọn **một chuẩn chung** cho cả site và đưa ra **bảng quy đổi** từ ký hiệu của các chương EasyRL sang chuẩn đó.
>
> - Phần [Nền tảng toán học (Shiyu Zhao)](mathrl/README_vi) tuân thủ chặt chuẩn này.
> - Các chương EasyRL **giữ nguyên ký hiệu của sách gốc** để bản dịch trung thành. Khi đọc chéo, tra bảng quy đổi ở mục 3.
>
> Chuẩn được chọn theo sách của Zhao, vốn gần như trùng với Sutton và Barto, *Reinforcement Learning: An Introduction* (2018), tài liệu chuẩn của ngành.

## 1. Sáu quy tắc chung

| # | Quy tắc | Ví dụ |
|---|---|---|
| 1 | **Chữ hoa nghiêng là biến ngẫu nhiên** | $S_t, A_t, R_{t+1}, G_t$ |
| 2 | **Chữ thường là một giá trị cụ thể** (một mẫu, một trạng thái được chỉ định) | $s, a, r, s'$; quỹ đạo đã quan sát $s_t, a_t, r_{t+1}$ |
| 3 | **Chữ viết hoa nét cong là tập hợp** | $\mathcal S, \mathcal A(s), \mathcal R(s,a)$ |
| 4 | **Phần thưởng của bước $t$ mang chỉ số $t+1$**: chọn $A_t$ ở $S_t$ thì nhận $R_{t+1}$ và tới $S_{t+1}$ | $S_t \xrightarrow{A_t} S_{t+1}, R_{t+1}$ |
| 5 | **Giá trị thật viết thường, có chỉ số chính sách**; **giá trị ước lượng có chỉ số bước lặp** hoặc dấu mũ | thật: $v_\pi, q_\pi$; ước lượng: $v_k, q_t, \hat q(s,a,w)$ |
| 6 | **Tham số: $w$ cho hàm giá trị, $\theta$ cho chính sách** | $\hat v(s,w)$, $\pi(a \mid s,\theta)$ |

Hai quy ước nhỏ thêm:

- $\doteq$ nghĩa là "được định nghĩa là".
- $\ge, \le$ giữa hai vectơ hoặc ma trận là so sánh **từng phần tử**.

## 2. Bảng ký hiệu chuẩn

### 2.1 MDP và quỹ đạo

| Ký hiệu | Ý nghĩa |
|---|---|
| $\mathcal S$, $\mathcal A(s)$, $\mathcal R(s,a)$ | không gian trạng thái, không gian hành động tại $s$, tập phần thưởng của $(s,a)$ |
| $n = \lvert\mathcal S\rvert$ | số trạng thái |
| $S_t, A_t, R_{t+1}$ | trạng thái, hành động, phần thưởng (biến ngẫu nhiên) tại bước $t$ |
| $p(s' \mid s,a)$ | xác suất chuyển trạng thái |
| $p(r \mid s,a)$ | xác suất phần thưởng |
| $p(s',r \mid s,a)$ | xác suất đồng thời (dạng Sutton–Barto) |
| $r(s,a) = \sum_r p(r \mid s,a)\, r$ | phần thưởng tức thời kỳ vọng của cặp $(s,a)$ |
| $\gamma \in (0,1)$ | hệ số chiết khấu |
| $G_t = R_{t+1} + \gamma R_{t+2} + \cdots$ | lợi tức chiết khấu từ bước $t$ |
| $\tau$ | một quỹ đạo |

### 2.2 Chính sách

| Ký hiệu | Ý nghĩa |
|---|---|
| $\pi(a \mid s)$ | chính sách (ngẫu nhiên), xác suất chọn $a$ ở $s$ |
| $\mu(s)$ | chính sách tất định |
| $\pi(a \mid s, \theta)$, $\mu(s,\theta)$ | chính sách có tham số $\theta$ |
| $\pi^*$ | chính sách tối ưu |
| $\pi_b$ | chính sách hành vi (sinh dữ liệu) trong học ngoài chính sách |
| $\pi_k$ | chính sách ở vòng lặp thứ $k$ |

### 2.3 Hàm giá trị

| Ký hiệu | Ý nghĩa |
|---|---|
| $v_\pi(s) = \mathbb E[G_t \mid S_t = s]$ | giá trị trạng thái |
| $q_\pi(s,a) = \mathbb E[G_t \mid S_t = s, A_t = a]$ | giá trị hành động |
| $v^*(s)$, $q^*(s,a)$ | giá trị tối ưu ($= v_{\pi^*}$, $q_{\pi^*}$) |
| $\delta_\pi(s,a) = q_\pi(s,a) - v_\pi(s)$ | hàm lợi thế (advantage) |
| $v_k$ | ước lượng ở vòng lặp thứ $k$ (thuật toán có mô hình) |
| $v_t(s)$, $q_t(s,a)$ | ước lượng ở bước thời gian $t$ (thuật toán học từ mẫu) |
| $\hat v(s,w)$, $\hat q(s,a,w)$ | hàm giá trị xấp xỉ với tham số $w$ |
| $w_T$ | tham số của mạng mục tiêu (target network) |
| $\delta_t$ | sai số TD tại bước $t$ |

### 2.4 Dạng ma trận–vectơ

| Ký hiệu | Ý nghĩa |
|---|---|
| $v_\pi \in \mathbb R^n$ | vectơ giá trị trạng thái |
| $r_\pi \in \mathbb R^n$, $[r_\pi]_s = \sum_a \pi(a \mid s)\, r(s,a)$ | vectơ phần thưởng tức thời trung bình theo $\pi$ |
| $P_\pi \in \mathbb R^{n \times n}$, $[P_\pi]_{ij} = p_\pi(s_j \mid s_i)$ | ma trận chuyển trạng thái theo $\pi$ |
| $I$, $\mathbf 1$ | ma trận đơn vị, vectơ toàn số 1 |

### 2.5 Tối ưu và học

| Ký hiệu | Ý nghĩa |
|---|---|
| $\alpha_t$, $\alpha_w$, $\alpha_\theta$ | cỡ bước (tốc độ học) |
| $\varepsilon$ | tham số khám phá của chính sách $\varepsilon$-tham lam |
| $d_\pi(s)$ | phân phối dừng của trạng thái dưới $\pi$ |
| $J(\theta)$ | hàm mục tiêu của gradient chính sách |
| $\bar v_\pi$, $\bar r_\pi$ | giá trị trung bình, phần thưởng trung bình một bước (hai dạng của $J(\theta)$) |

## 3. Bảng quy đổi từ EasyRL

Các chương EasyRL dựa trên nhiều bài giảng khác nhau (Bolei Zhou cho chương 1–2, Hung-yi Lee cho chương 4–11, Li Kejiao cho chương 3 và 12), nên ký hiệu đổi theo nhóm chương.

### 3.1 Chương 1–3 (theo Bolei Zhou và Li Kejiao)

| EasyRL viết | Chuẩn | Ghi chú |
|---|---|---|
| $V(s)$, $V_\pi(s)$, $V^\pi(s)$ | $v_\pi(s)$ | $V(s)$ không ghi $\pi$ vẫn là giá trị của chính sách đang xét |
| $Q(s,a)$, $Q_\pi(s,a)$ | $q_\pi(s,a)$ | trong thuật toán (bảng Q, Sarsa, Q-learning), $Q$ là **ước lượng**, tương ứng $q_t(s,a)$ |
| $V^*(s)$, $Q^*(s,a)$ | $v^*(s)$, $q^*(s,a)$ | |
| $\pi^*$ | $\pi^*$ | giống nhau |
| $s_t, a_t, r_t$ | $S_t, A_t, R_{t+1}$ hoặc $s_t, a_t, r_{t+1}$ | EasyRL không phân biệt biến ngẫu nhiên và giá trị cụ thể |
| $G_t = r_{t+1} + \gamma r_{t+2} + \cdots$ | $G_t = R_{t+1} + \gamma R_{t+2} + \cdots$ | chương 2–3 đã dùng chỉ số $t+1$, khớp chuẩn |
| $R(s)$ (trong MRP) | $r_\pi(s)$ | phần thưởng tức thời kỳ vọng tại $s$ |
| $R(s,a)$ | $r(s,a)$ | phần thưởng tức thời kỳ vọng của $(s,a)$ |
| $p(s' \mid s)$, $P(s' \mid s)$ | $p_\pi(s' \mid s)$ | chuyển trạng thái khi đã cố định chính sách |
| $P(s' \mid s,a)$, $p(s' \mid s,a)$ | $p(s' \mid s,a)$ | |
| $S$, $A$ (tập hợp) | $\mathcal S$, $\mathcal A$ | EasyRL đôi khi dùng chữ thẳng cho tập, dễ lẫn với biến ngẫu nhiên |
| $\boldsymbol P$, $\boldsymbol P_\pi$ (ma trận) | $P_\pi$ | |

### 3.2 Chương 4–11 (theo Hung-yi Lee)

| EasyRL viết | Chuẩn | Ghi chú |
|---|---|---|
| $r_t$ (sau khi chọn $a_t$ ở $s_t$) | $R_{t+1}$ | ⚠️ **lệch một chỉ số**: Hung-yi Lee đánh số phần thưởng theo bước của hành động |
| $V^\pi(s)$, $V_\pi(s)$, $V(s)$ | $v_\pi(s)$ | chương 6 dùng cả hai cách viết |
| $Q^\pi(s,a)$, $Q_\pi(s,a)$ | $q_\pi(s,a)$ | |
| $\pi_\theta(a \mid s)$, $p_\theta(a_t \mid s_t)$ | $\pi(a \mid s,\theta)$ | |
| $p_\theta(\tau)$ | $p(\tau \mid \theta)$ | xác suất quỹ đạo |
| $R(\tau)$ | $G_0$ trên quỹ đạo $\tau$ | tổng phần thưởng của cả quỹ đạo, thường không chiết khấu |
| $\bar R_\theta$ | $J(\theta)$ | phần thưởng kỳ vọng cần tối đa hóa |
| $A^\theta(s_t,a_t)$, $A(s,a)$ | $\delta_\pi(s,a)$ | hàm lợi thế; chuẩn tránh chữ $A$ vì trùng biến ngẫu nhiên hành động $A_t$ |
| $\theta'$, $\theta^k$ (PPO, chính sách cũ dùng lấy mẫu) | $\pi_b$ | đóng vai trò chính sách hành vi |
| $Q_\phi$, $Q_w$ (mạng Q) | $\hat q(s,a,w)$ | |
| $\hat Q$ (mạng mục tiêu, chương 6–7) | $\hat q(s,a,w_T)$ | |
| $\delta$ (sai số TD, chương 9) | $\delta_t$ | |

### 3.3 Chương 12 (DDPG, TD3)

| EasyRL viết | Chuẩn | Ghi chú |
|---|---|---|
| $\mu_\theta(s)$ | $\mu(s,\theta)$ | chính sách tất định có tham số |
| $Q_w(s,a)$ | $\hat q(s,a,w)$ | nhà phê bình |
| $\mu_{\bar\theta}$, $Q_{\bar w}$ | $\mu(s,\theta_T)$, $\hat q(s,a,w_T)$ | mạng mục tiêu |

### 3.4 Sách Zhao (bản PDF gốc)

Phần tổng hợp dùng đúng ký hiệu của Zhao, trừ một chỗ:

| Zhao viết | Chuẩn | Ghi chú |
|---|---|---|
| $\beta(a \mid s)$ (chương 10) | $\pi_b(a \mid s)$ | chương 5 và 7 sách đã dùng $\pi_b$; thống nhất về một ký hiệu |

## 4. Ba chỗ hay nhầm khi đọc chéo

1. **Chỉ số phần thưởng.** Cùng một phần thưởng, EasyRL chương 4–11 viết $r_t$, còn chuẩn viết $R_{t+1}$. Vì vậy mục tiêu TD trong EasyRL dạng $r_t + \gamma V(s_{t+1})$ chính là $R_{t+1} + \gamma v(S_{t+1})$ theo chuẩn. Hai công thức giống nhau; chỉ khác cách đánh số.
2. **$Q$ là giá trị thật hay ước lượng?** Trong lý thuyết, $q_\pi$ là giá trị thật của chính sách. Trong thuật toán, bảng Q hay mạng Q là **ước lượng** đang được cập nhật. Chuẩn tách hai thứ này bằng chỉ số: $q_t$ hoặc $\hat q(\cdot, w)$.
3. **Chữ $A$.** $A_t$ là hành động (biến ngẫu nhiên); $A(s,a)$ trong EasyRL là hàm lợi thế. Chuẩn dùng $\delta_\pi(s,a)$ cho hàm lợi thế để tránh trùng. Lưu ý thêm: $\delta_t$ (sai số TD) là một **ước lượng mẫu** của $\delta_\pi$.
