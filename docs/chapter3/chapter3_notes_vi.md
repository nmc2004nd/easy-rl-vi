# Chương 3 Ghi chú trọng tâm

> Ghi chú của người dịch: đây là bản ghi chú tổng hợp kiến thức trọng tâm của [chương 3](chapter3/chapter3_vi), do người dịch biên soạn để đọc lại nhanh. Chương lý thuyết dẫn dắt từ ví dụ đến khái niệm; trang này chỉ giữ khái niệm, công thức, so sánh và chỗ dễ nhầm. Các ý không có trong sách được ghi rõ.

## 1. Bức tranh chung

**Phương pháp dạng bảng (tabular method):** biểu diễn giá trị/chính sách bằng **bảng tra cứu**, mỗi ô ứng với một trạng thái (hoặc một cặp trạng thái-hành động).

Chương 2 giải MDP khi **biết** $P$ và $R$ (quy hoạch động). Chương 3 bỏ giả định đó: **không mô hình (model-free)**, chỉ học từ quỹ đạo do tác tử tương tác với môi trường sinh ra.

| | Dự đoán (cho $\pi$, tìm $V_\pi$) | Điều khiển (tìm $\pi^*$) |
|---|---|---|
| Có mô hình (chương 2) | đánh giá chính sách bằng DP | lặp chính sách, lặp giá trị |
| **Không mô hình (chương 3)** | **MC**, **TD(0)**, TD $n$ bước | **MC + $\varepsilon$-tham lam**, **Sarsa**, **Q-learning** |

## 2. Có mô hình và không mô hình

| | Có mô hình (model-based) | Không mô hình (model-free) |
|---|---|---|
| Biết gì | $P[s_{t+1},r_t\mid s_t,a_t]$ và $R[s_t,a_t]$ | không biết |
| Tương tác môi trường | không cần | **bắt buộc**, thu thập quỹ đạo |
| Phương pháp | lặp chính sách, lặp giá trị | MC, TD, Sarsa, Q-learning |
| Ví dụ con gấu | biết "giả chết → gấu bỏ đi" với xác suất 1 | lần đầu gặp gấu, không biết xác suất nào |

💡 Dùng không mô hình khi mô hình **chưa biết**, hoặc **quá lớn** để tính lặp (Atari, cờ vây, chứng khoán...).

## 3. Bảng Q và lợi tức

**Bảng Q:** hàng = trạng thái, cột = hành động, ô = $Q(s,a)$ = tổng phần thưởng tương lai kỳ vọng nếu ở $s$ làm $a$. Khởi tạo bằng 0, cập nhật dần qua tương tác. Bảng đã huấn luyện xong giống một "cẩm nang sống".

- Vì sao đánh giá hành động bằng **tổng phần thưởng tương lai**? Phần thưởng thường trễ. Ví dụ xe cứu thương: vượt đèn đỏ bị phạt ngay, nhưng đưa bệnh nhân tới viện nhanh được thưởng lớn hơn nhiều.
- **Nhiệm vụ liên tục (continuing task)** không có điểm kết thúc → cộng hết phần thưởng tương lai là vô lý → cần chiết khấu $\gamma$.

**Tính lợi tức ngược từ cuối về đầu** (dùng nhiều trong code):

$$
G_t=r_{t+1}+\gamma G_{t+1}
$$

Ví dụ vách đá, $\gamma=0.6$, mỗi bước $-1$, $G_{13}=0$:

$$
\begin{aligned}
G_{12}&=-1+0.6\times 0=-1\\
G_{11}&=-1+0.6\times(-1)=-1.6\\
G_{10}&=-1+0.6\times(-1.6)=-1.96\\
G_{9}&=-1+0.6\times(-1.96)\approx-2.18\\
G_{8}&=-1+0.6\times(-2.176)\approx-2.3
\end{aligned}
$$

| $\gamma$ | Cách nhìn |
|---|---|
| $0$ | thiển cận, chỉ xét phần thưởng một bước |
| $1$ | nhìn xa, cộng hết phần thưởng về sau |
| $0.6$ | dung hòa, phần thưởng xa ảnh hưởng ít |

**Bài toán đi bên vách đá (cliff walking):** từ S đến G, mỗi bước $-1$, rơi vách đá $-100$ và **quay về S** (trò chơi không kết thúc), đến G mới kết thúc.

## 4. Dự đoán bằng Monte Carlo (MC)

Lấy mẫu nhiều quỹ đạo theo $\pi$, **trung bình lợi tức thực tế**:

$$
V_\pi(s)=\mathbb{E}_{\tau\sim\pi}\left[G_t \mid s_t=s\right]
$$

Mỗi lần thăm $s$: $N(s)\leftarrow N(s)+1$, $S(s)\leftarrow S(s)+G_t$, rồi $V(s)=S(s)/N(s)$. Theo **luật số lớn**, $N(s)\to\infty$ thì $V(s)\to V_\pi(s)$.

**Trung bình tăng dần (incremental mean):**

$$
\mu_t=\mu_{t-1}+\frac{1}{t}\left(x_t-\mu_{t-1}\right)
$$

($x_t-\mu_{t-1}$ là phần dư, $\frac1t$ đóng vai tốc độ học.) Áp vào MC, rồi thay $\frac{1}{N(s_t)}$ bằng $\alpha$:

$$
V(s_t)\leftarrow V(s_t)+\alpha\left(G_t-V(s_t)\right)
$$

💡 **Mẫu chung của mọi phép cập nhật trong chương:** *ước lượng mới = ước lượng cũ + $\alpha$ × (mục tiêu − ước lượng cũ)*. Các thuật toán chỉ khác nhau ở **mục tiêu**.

| MC so với DP | MC | DP |
|---|---|---|
| Cần mô hình | **không** | có |
| Cập nhật | chỉ trạng thái **trên quỹ đạo** | **tất cả** trạng thái |
| Bootstrapping | không | có |

⚠️ MC chỉ dùng được cho MDP **có kết thúc** (phải đợi hết tập mới có $G_t$).

## 5. Sai phân thời gian (TD)

TD **nằm giữa MC và DP**: không mô hình (như MC), có bootstrapping (như DP), học được từ tập chưa hoàn chỉnh.

**TD(0)**, cập nhật sau **mỗi bước**:

$$
V(s_t)\leftarrow V(s_t)+\alpha\Big(\underbrace{r_{t+1}+\gamma V(s_{t+1})}_{\text{mục tiêu TD}}-V(s_t)\Big)
$$

- **Mục tiêu TD (TD target):** $r_{t+1}+\gamma V(s_{t+1})$ = phần thưởng thật một bước + giá trị **ước lượng** của bước sau.
- **Sai số TD (TD error):** $\delta=r_{t+1}+\gamma V(s_{t+1})-V(s_t)$.
- Mục tiêu TD chỉ là **ước lượng**, vì hai lý do: (1) lấy mẫu thay cho kỳ vọng; (2) dùng $V$ đang ước lượng chứ không phải $V_\pi$ thật.

💡 Hình ảnh: phản xạ có điều kiện của Pavlov. Tiếng chuông (trạng thái trước) dần có giá trị vì luôn đi trước thức ăn (phần thưởng). Giá trị **lan ngược** từ trạng thái có phần thưởng về các trạng thái trước nó.

| | TD | MC |
|---|---|---|
| Khi nào cập nhật | **mỗi bước** (học trực tuyến) | **hết tập** |
| Chuỗi chưa hoàn chỉnh | học được | không |
| Môi trường liên tục (không kết thúc) | dùng được | không |
| Tính chất Markov | **tận dụng** → hiệu quả hơn trong môi trường Markov | không giả định → hiệu quả hơn khi không Markov |
| Phương sai | **thấp** | cao |

💡 Ví dụ lái xe đi làm: kẹt xe ở ngã tư A thì TD **cập nhật ngay** thời gian dự kiến; MC **đợi tới công ty** mới cập nhật.

⚠️ **Dễ nhầm (ghi chú của người dịch):** MC dùng lợi tức thật nên **không chệch** nhưng **phương sai cao** (cộng nhiều phần thưởng ngẫu nhiên); TD dùng ước lượng $V(s_{t+1})$ nên **chệch** (khi $V$ chưa đúng) nhưng **phương sai thấp**.

## 6. TD $n$ bước: cầu nối TD và MC

$$
G_t^{n}=r_{t+1}+\gamma r_{t+2}+\cdots+\gamma^{n-1}r_{t+n}+\gamma^{n}V(s_{t+n})
$$

$$
V(s_t)\leftarrow V(s_t)+\alpha\left(G_t^{n}-V(s_t)\right)
$$

| $n$ | Mục tiêu | Là |
|---|---|---|
| $1$ | $r_{t+1}+\gamma V(s_{t+1})$ | TD(0) |
| $2$ | $r_{t+1}+\gamma r_{t+2}+\gamma^2V(s_{t+2})$ | TD 2 bước |
| $\infty$ | $r_{t+1}+\gamma r_{t+2}+\cdots+\gamma^{T-t-1}r_T$ | **MC** |

💡 $n$ càng lớn: càng nhiều phần thưởng thật, càng ít bootstrapping.

## 7. Bootstrapping và lấy mẫu

| Phương pháp | Bootstrapping | Lấy mẫu | Cập nhật |
|---|---|---|---|
| DP | **có** | **không** (tính kỳ vọng đầy đủ) | $V(s_t)\leftarrow\mathbb{E}_\pi[r_{t+1}+\gamma V(s_{t+1})]$ |
| MC | **không** | **có** | đi hết một nhánh, $\alpha(G_t-V(s_t))$ |
| TD | **có** | **có** | đi một bước, $\alpha(r_{t+1}+\gamma V(s_{t+1})-V(s_t))$ |

💡 Nhìn trên cây backup (hình 3.22): TD mở **rộng** hết các nhánh → DP; TD đi **sâu** tới cuối → MC; vừa rộng vừa sâu → **tìm kiếm vét cạn**.

## 8. Điều khiển không mô hình: lặp chính sách tổng quát (GPI)

Lặp chính sách vẫn là hai bước luân phiên: **đánh giá** rồi **cải thiện tham lam**. Nhưng cải thiện từ $V$ cần mô hình:

$$
Q_{\pi_i}(s,a)=R(s,a)+\gamma\sum_{s'}P(s'\mid s,a)\,V_{\pi_i}(s') \quad\text{← không có } R,\ P
$$

⭐ **Cách giải: ước lượng thẳng $Q$** (bằng MC hoặc TD) thay vì $V$, rồi cải thiện bằng $\pi(s)=\arg\max_a Q(s,a)$, không cần mô hình.

### MC + khởi đầu khám phá (hình 3.25)

- **Khởi đầu khám phá (exploring start):** mỗi tập bắt đầu từ một cặp $(s_0,a_0)$ ngẫu nhiên, mọi cặp đều có xác suất > 0 → mọi cặp đều được thăm.
- Quét tập **ngược** ($t=T-1,\ldots,0$), $G\leftarrow\gamma G+r_{t+1}$; với **lần thăm đầu tiên** của $(s_t,a_t)$: thêm $G$ vào danh sách, $Q$ = trung bình, $\pi(s_t)=\arg\max_a Q(s_t,a)$.

### MC + $\varepsilon$-tham lam (hình 3.26)

Với xác suất $1-\varepsilon$ chọn hành động tham lam, với xác suất $\varepsilon$ chọn ngẫu nhiên:

$$
a=\begin{cases}\arg\max_a Q(s,a) & (1-\varepsilon)\\ \text{ngẫu nhiên} & (\varepsilon)\end{cases}
$$

- $\varepsilon$ **giảm dần** theo thời gian (hình 3.26: $\varepsilon=1/k$): đầu thì khám phá nhiều, sau thì khai thác nhiều.
- Định lý: chính sách $\varepsilon$-tham lam $\pi'$ theo $Q_\pi$ luôn là **cải thiện**: $V_\pi(s)\le V_{\pi'}(s)$.

## 9. Sarsa: TD on-policy

Đổi TD từ cập nhật $V$ sang cập nhật $Q$:

$$
Q(s_t,a_t)\leftarrow Q(s_t,a_t)+\alpha\Big[r_{t+1}+\gamma Q(s_{t+1},a_{t+1})-Q(s_t,a_t)\Big]
$$

- Tên **Sarsa** = bộ năm cần cho mỗi lần cập nhật: $(s_t,a_t,r_{t+1},s_{t+1},a_{t+1})$.
- $a_{t+1}$ là hành động **thật sự sẽ làm** ở bước sau (chọn bằng $\varepsilon$-tham lam).
- **Cập nhật mềm (soft update):** mỗi lần chỉ nhích một phần $\alpha$ về phía mục tiêu.
- Code tác tử chỉ cần hai phương thức: **chọn hành động** từ bảng Q, và **cập nhật** bảng Q.

**Mở rộng:**

- Sarsa $n$ bước:

$$
Q_t^{n}=r_{t+1}+\gamma r_{t+2}+\cdots+\gamma^{n-1}r_{t+n}+\gamma^{n}Q(s_{t+n},a_{t+n})
$$

- Sarsa($\lambda$): trung bình có trọng số của mọi $Q_t^n$:

$$
Q_t^{\lambda}=(1-\lambda)\sum_{n=1}^{\infty}\lambda^{n-1}Q_t^{n}
$$

## 10. Q-learning: TD off-policy

$$
Q(s_t,a_t)\leftarrow Q(s_t,a_t)+\alpha\Big[r_{t+1}+\gamma\max_{a}Q(s_{t+1},a)-Q(s_t,a_t)\Big]
$$

Hai chính sách tách biệt:

| | Chính sách hành vi $\mu$ (behavior) | Chính sách mục tiêu $\pi$ (target) |
|---|---|---|
| Vai trò | **tương tác** môi trường, thu thập dữ liệu | chính sách **cần học** |
| Trong Q-learning | $\varepsilon$-tham lam theo $Q$ | **tham lam**: $\pi(s)=\arg\max_{a'}Q(s,a')$ |
| Hình ảnh | người lính / cướp biển liều lĩnh | quân sư ở hậu phương |

💡 Vì mục tiêu là $\max_a Q(s_{t+1},a)$, Q-learning **không cần $a_{t+1}$**, chỉ cần $(s,a,r,s')$.

**Ba lợi ích của off-policy:**

1. Dùng chính sách khám phá mà vẫn học được chính sách tốt nhất.
2. Học từ quỹ đạo của người hoặc tác tử khác (học bắt chước).
3. Tái sử dụng quỹ đạo do chính sách cũ sinh ra → tiết kiệm tính toán.

## 11. Sarsa và Q-learning

⭐ **Công thức cập nhật giống hệt nhau, chỉ khác mục tiêu:**

| | Sarsa | Q-learning |
|---|---|---|
| Mục tiêu TD | $r_{t+1}+\gamma Q(s_{t+1},a_{t+1})$ | $r_{t+1}+\gamma\max_a Q(s_{t+1},a)$ |
| Loại | **on-policy**: một chính sách vừa hành động vừa học | **off-policy**: hành vi và mục tiêu tách biệt |
| Dữ liệu cần | $(s,a,r,s',a')$ | $(s,a,r,s')$ |
| Tính cách | **bảo thủ**, "nhát gan" | **liều lĩnh** (aggressive) |
| Vách đá | đường **an toàn**, xa mép vách | đường **ngắn nhất**, sát mép vách |
| Vì sao | biết bước sau có thể khám phá ngẫu nhiên rơi vách → tránh xa | giả định bước sau luôn tối ưu, không lo khám phá |

⚠️ **Dễ nhầm:** Q-learning **vẫn dùng $\varepsilon$-tham lam để hành động**. Cái "không cần khám phá" là **chính sách mục tiêu** (tham lam thuần), không phải hành vi.

⚠️ **Dễ nhầm (ghi chú của người dịch):** Q-learning học ra đường sát vách đá nhưng **trong lúc huấn luyện** (còn $\varepsilon$) lại hay rơi vách, nên tổng phần thưởng mỗi tập khi huấn luyện thường **thấp hơn** Sarsa. Đường "tối ưu" và phần thưởng lúc học là hai chuyện khác nhau.

## 12. Tự kiểm tra nhanh

1. Vì sao lặp chính sách/lặp giá trị không dùng được khi không có mô hình? Cách giải là gì?
2. Tính tay $G_{12},\ldots,G_8$ ở bài vách đá với $\gamma=0.6$.
3. Suy ra công thức trung bình tăng dần. Vì sao thay $\frac1N$ bằng $\alpha$?
4. Viết mục tiêu TD và sai số TD. Vì sao mục tiêu TD chỉ là ước lượng?
5. Nêu 4 điểm khác nhau giữa TD và MC.
6. TD $n$ bước với $n=1$ và $n=\infty$ là gì?
7. DP, MC, TD: phương pháp nào bootstrapping, phương pháp nào lấy mẫu?
8. Khởi đầu khám phá và $\varepsilon$-tham lam giải quyết vấn đề gì?
9. Viết công thức cập nhật Sarsa và Q-learning. Vì sao Q-learning không cần $a_{t+1}$?
10. Trên bài vách đá, vì sao Sarsa đi đường an toàn còn Q-learning đi sát mép?

👉 Xem trực quan: [MC điều khiển](viz/mc-control.html ':ignore :target=_blank') · [TD $n$ bước](viz/nstep-td.html ':ignore :target=_blank') · [Sarsa và Q-learning trên vách đá](viz/td-control.html ':ignore :target=_blank').

👉 Kiểm tra trí nhớ bằng [flashcard và quiz của chương 3](review/index.html?ch=3 ':ignore :target=_self'), xem đáp án tham khảo ở [Chương 3 Bài tập](chapter3/chapter3_questions&keywords_vi), thực hành ở [Dự án 1](chapter3/project1_vi).
