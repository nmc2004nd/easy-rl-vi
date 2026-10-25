# Chương 5 Ghi chú trọng tâm

> Ghi chú của người dịch: đây là bản ghi chú tổng hợp kiến thức trọng tâm của [chương 5](chapter5/chapter5_vi), do người dịch biên soạn để đọc lại nhanh. Chương lý thuyết dẫn dắt từ ví dụ đến khái niệm; trang này chỉ giữ khái niệm, công thức, so sánh và chỗ dễ nhầm. Các ý không có trong sách được ghi rõ.

## 1. Bức tranh chung

**Vấn đề của gradient chính sách (chương 4):** kỳ vọng lấy theo $\tau\sim p_\theta(\tau)$. Cập nhật $\theta$ một lần là dữ liệu cũ hết dùng → phải lấy mẫu lại → **phần lớn thời gian dành cho lấy mẫu**.

**Ý tưởng của chương 5:** để một chính sách $\theta'$ (cố định) tương tác lấy dữ liệu, rồi dùng **cùng một lô dữ liệu** cập nhật $\theta$ **nhiều lần**. Công cụ: **lấy mẫu theo trọng số quan trọng**. Cái giá: $\theta$ và $\theta'$ không được khác nhau quá nhiều → **PPO** giữ chúng gần nhau.

$$
\text{gradient chính sách}\ \xrightarrow{\ \text{importance sampling}\ }\ J^{\theta'}(\theta)\ \xrightarrow{\ \text{giữ }\theta\approx\theta'\ }\ \text{TRPO / PPO-penalty / PPO-clip}
$$

| | On-policy | Off-policy |
|---|---|---|
| Tác tử học và tác tử tương tác | **là một** | **khác nhau** |
| Ví dụ | gradient chính sách, Sarsa | Q-learning |

## 2. Lấy mẫu theo trọng số quan trọng (importance sampling)

Muốn tính kỳ vọng theo $p$ nhưng chỉ lấy mẫu được từ $q$:

$$
\mathbb{E}_{x\sim p}[f(x)]=\int f(x)\,p(x)\,\mathrm dx=\int f(x)\frac{p(x)}{q(x)}q(x)\,\mathrm dx=\mathbb{E}_{x\sim q}\Big[f(x)\frac{p(x)}{q(x)}\Big]
$$

- $\dfrac{p(x)}{q(x)}$ là **trọng số quan trọng**, hiệu chỉnh khác biệt giữa hai phân phối.
- Điều kiện duy nhất: không được có chỗ $q(x)=0$ mà $p(x)\neq 0$.

⚠️ **Kỳ vọng bằng nhau nhưng phương sai thì không:**

$$
\operatorname{Var}_{x\sim p}[f(x)]=\mathbb{E}_{x\sim p}\big[f(x)^2\big]-\big(\mathbb{E}_{x\sim p}[f(x)]\big)^2
$$

$$
\operatorname{Var}_{x\sim q}\Big[f(x)\frac{p(x)}{q(x)}\Big]=\mathbb{E}_{x\sim p}\Big[f(x)^2\frac{p(x)}{q(x)}\Big]-\big(\mathbb{E}_{x\sim p}[f(x)]\big)^2
$$

Số hạng đầu có thêm $\frac{p(x)}{q(x)}$ → $p$, $q$ khác nhau nhiều thì **phương sai rất lớn**.

💡 Ví dụ hình 5.1: $p$ dồn bên trái (nơi $f<0$), $q$ dồn bên phải (nơi $f>0$). Lấy ít mẫu từ $q$ thì toàn rơi bên phải → ước lượng **dương**, trong khi đáp án đúng **âm**. Chỉ khi lấy đủ nhiều, vài mẫu hiếm bên trái (trọng số rất lớn) mới kéo kết quả về đúng.

## 3. Áp vào gradient chính sách

Dữ liệu do $\theta'$ lấy mẫu, tham số cần học là $\theta$. Tính theo từng cặp trạng thái-hành động:

$$
\mathbb{E}_{(s_t,a_t)\sim\pi_{\theta'}}\Big[\frac{p_\theta(s_t,a_t)}{p_{\theta'}(s_t,a_t)}A^{\theta}(s_t,a_t)\,\nabla\log p_\theta(a_t\mid s_t)\Big]
$$

**Hai phép xấp xỉ:**

| Xấp xỉ | Lý do |
|---|---|
| $A^\theta(s_t,a_t)\approx A^{\theta'}(s_t,a_t)$ | dữ liệu do $\theta'$ sinh ra, chỉ ước lượng được lợi thế theo $\theta'$ |
| $p_\theta(s_t)\approx p_{\theta'}(s_t)$ | trạng thái ít phụ thuộc chính sách; và $p_\theta(s_t)$ **gần như không tính được** (ảnh có thể không bao giờ lặp lại) |

Còn lại tỉ số $\dfrac{p_\theta(a_t\mid s_t)}{p_{\theta'}(a_t\mid s_t)}$: **dễ tính**, chỉ cần đưa $s_t$ vào hai mạng chính sách.

$$
\mathbb{E}_{(s_t,a_t)\sim\pi_{\theta'}}\Big[\frac{p_\theta(a_t\mid s_t)}{p_{\theta'}(a_t\mid s_t)}A^{\theta'}(s_t,a_t)\,\nabla\log p_\theta(a_t\mid s_t)\Big] \tag{5.5}
$$

**Suy ngược ra hàm mục tiêu** (dùng $\nabla f=f\,\nabla\log f$; khi lấy gradient theo $\theta$ thì $p_{\theta'}$ và $A^{\theta'}$ là hằng số):

$$
J^{\theta'}(\theta)=\mathbb{E}_{(s_t,a_t)\sim\pi_{\theta'}}\Big[\frac{p_\theta(a_t\mid s_t)}{p_{\theta'}(a_t\mid s_t)}A^{\theta'}(s_t,a_t)\Big]
$$

💡 Ký hiệu $J^{\theta'}(\theta)$: **$\theta$ trong ngoặc** là tham số đang tối ưu; **$\theta'$ ở chỉ số trên** là chính sách đang làm mẫu (tương tác với môi trường).

## 4. TRPO và PPO: giữ $\theta$ gần $\theta'$

Importance sampling hỏng khi $p_\theta(a_t\mid s_t)$ và $p_{\theta'}(a_t\mid s_t)$ khác nhau nhiều → thêm ràng buộc **độ phân kỳ KL**.

- **TRPO** (tối ưu chính sách vùng tin cậy, tiền thân của PPO):

$$
\begin{aligned}&\max_\theta\ J^{\theta'}(\theta)\\ &\text{với ràng buộc } \mathrm{KL}(\theta,\theta')<\delta\end{aligned}
$$

- **PPO:**

$$
J_{\mathrm{PPO}}^{\theta'}(\theta)=J^{\theta'}(\theta)-\beta\,\mathrm{KL}(\theta,\theta') \tag{5.6}
$$

| | TRPO | PPO |
|---|---|---|
| KL nằm ở đâu | ràng buộc **bên ngoài** mục tiêu | **trong** mục tiêu, như số hạng chính quy hóa |
| Tối ưu | khó, gradient không xử lý trực tiếp ràng buộc được | gradient ascent bình thường |
| Hiệu năng | gần như nhau | gần như nhau, **dễ cài đặt hơn nhiều** |

**KL giữa hai diễn viên là khoảng cách hành vi, không phải khoảng cách tham số:** cho cùng trạng thái $s$, so hai phân phối hành động đầu ra, rồi lấy trung bình trên các trạng thái.

⚠️ **Vì sao không dùng L1/L2 trên tham số?** Tham số đổi ít mà hành động có thể đổi nhiều, và ngược lại. Thứ ta quan tâm là **hành động**.

⚠️ **Dễ nhầm: PPO là on-policy.** Dù dùng importance sampling, PPO chỉ dùng dữ liệu của **chính sách vòng trước** $\theta'$, và ràng buộc KL giữ $\theta\approx\theta'$, nên chính sách hành vi và chính sách mục tiêu coi như **là một**.

## 5. PPO-penalty (PPO1)

$$
J_{\mathrm{PPO}}^{\theta^k}(\theta)=J^{\theta^k}(\theta)-\beta\,\mathrm{KL}(\theta,\theta^k)
$$

$$
J^{\theta^k}(\theta)\approx\sum_{(s_t,a_t)}\frac{p_\theta(a_t\mid s_t)}{p_{\theta^k}(a_t\mid s_t)}A^{\theta^k}(s_t,a_t)
$$

**Mỗi vòng lặp $k$:**

1. Dùng $\theta^k$ tương tác, lấy mẫu nhiều cặp $(s_t,a_t)$.
2. Ước lượng lợi thế $A^{\theta^k}(s_t,a_t)$.
3. Cập nhật $\theta$ **nhiều lần** trên **cùng lô dữ liệu** để tối đa hóa $J_{\mathrm{PPO}}^{\theta^k}(\theta)$.

**Phạt KL thích nghi (adaptive KL penalty):** chỉnh $\beta$ động.

| Sau khi tối ưu | Nghĩa là | Làm gì |
|---|---|---|
| $\mathrm{KL}(\theta,\theta^k)>\mathrm{KL}_{\max}$ | số hạng phạt quá yếu | **tăng** $\beta$ |
| $\mathrm{KL}(\theta,\theta^k)<\mathrm{KL}_{\min}$ | số hạng phạt quá mạnh, $\theta$ sắp giống hệt $\theta^k$ | **giảm** $\beta$ |

## 6. PPO-clip (PPO2)

Bỏ hẳn KL, thay bằng **cắt tỉ số**. Đặt $r_t(\theta)=\dfrac{p_\theta(a_t\mid s_t)}{p_{\theta^k}(a_t\mid s_t)}$ (ký hiệu $r_t$ là của người dịch, cho gọn):

$$
\begin{aligned}
J_{\mathrm{PPO2}}^{\theta^k}(\theta)\approx\sum_{(s_t,a_t)}\min\Big(&r_t(\theta)\,A^{\theta^k}(s_t,a_t),\\
&\operatorname{clip}\big(r_t(\theta),1-\varepsilon,1+\varepsilon\big)A^{\theta^k}(s_t,a_t)\Big)
\end{aligned} \tag{5.8}
$$

- $\operatorname{clip}(x,1-\varepsilon,1+\varepsilon)$: nhỏ hơn $1-\varepsilon$ thì ra $1-\varepsilon$; lớn hơn $1+\varepsilon$ thì ra $1+\varepsilon$; ở giữa thì giữ nguyên.
- $\varepsilon$ là siêu tham số, thường **0.1 hoặc 0.2**. Ví dụ $\varepsilon=0.2$: tỉ số bị kẹp trong $[0.8,\ 1.2]$.

**Đọc công thức theo dấu của $A$** (hình 5.3):

| Lợi thế | Hành động | Xác suất | Dừng khi tỉ số chạm |
|---|---|---|---|
| $A>0$ | tốt | tăng | $1+\varepsilon$ |
| $A<0$ | tồi | giảm | $1-\varepsilon$ |

Quá ngưỡng đó, mục tiêu không tăng thêm nữa, nên không còn lý do đẩy tiếp.

💡 Kết quả: $p_\theta$ không bao giờ đi quá xa $p_{\theta^k}$, mà không cần tính KL. Trông phức tạp nhưng **cài đặt rất đơn giản**.

💡 Hình 5.4: trên nhiều nhiệm vụ, PPO nếu không tốt nhất thì cũng tốt thứ hai. PPO là thuật toán mặc định của OpenAI.

## 7. Tự kiểm tra nhanh

1. Vì sao gradient chính sách tốn nhiều thời gian lấy mẫu?
2. Viết công thức importance sampling. Điều kiện để dùng được là gì?
3. Vì sao $p$ và $q$ khác nhau nhiều thì importance sampling cho kết quả tệ? Giải thích bằng phương sai và bằng hình 5.1.
4. Hai phép xấp xỉ nào được dùng để đi tới (5.5)? Vì sao bỏ được $p_\theta(s_t)/p_{\theta'}(s_t)$?
5. Ý nghĩa của $\theta$ và $\theta'$ trong $J^{\theta'}(\theta)$?
6. TRPO và PPO khác nhau ở đâu? Vì sao thường dùng PPO?
7. KL giữa hai diễn viên đo cái gì? Vì sao không đo khoảng cách tham số?
8. Vì sao PPO là on-policy dù dùng importance sampling?
9. Phạt KL thích nghi chỉnh $\beta$ thế nào?
10. Với $\varepsilon=0.2$, $A>0$: khi nào PPO-clip ngừng tăng $p_\theta(a_t\mid s_t)$? Còn $A<0$?

👉 Xem trực quan: [mục tiêu thay thế và vùng tin cậy](viz/ppo-trust.html ':ignore :target=_blank') · [PPO-clip và PPO-penalty từng bước](viz/ppo.html ':ignore :target=_blank').

👉 Kiểm tra trí nhớ bằng [flashcard và quiz của chương 5](review/index.html?ch=5 ':ignore :target=_self'), xem đáp án tham khảo ở [Chương 5 Bài tập](chapter5/chapter5_questions&keywords_vi).
