# Chương 2 Ghi chú trọng tâm

> Ghi chú của người dịch: đây là bản ghi chú tổng hợp kiến thức trọng tâm của [chương 2](chapter2/chapter2_vi), do người dịch biên soạn để đọc lại nhanh. Chương lý thuyết dẫn dắt từ ví dụ đến khái niệm; trang này chỉ giữ khái niệm, công thức, so sánh và chỗ dễ nhầm. Các ý không có trong sách được ghi rõ.

## 1. Bức tranh chung

**MDP là khung cơ bản của học tăng cường.** Chương 2 xây MDP qua ba bậc, mỗi bậc thêm một thứ:

| Bậc | Thành phần | Thêm gì | Hình ảnh trong sách |
|---|---|---|---|
| Quá trình Markov (MP) | $\langle S, P\rangle$ | | |
| Quá trình phần thưởng Markov (MRP) | $\langle S, P, R, \gamma\rangle$ | phần thưởng $R$, chiết khấu $\gamma$ | thuyền giấy **trôi theo dòng nước** |
| Quá trình quyết định Markov (MDP) | $\langle S, A, P, R, \gamma\rangle$ | **hành động** $a$ | người lái đò **điều khiển** thuyền |

Sau đó chương giải hai bài toán trên MDP (khi **đã biết** $P$ và $R$):

- **Dự đoán**: cho $\pi$, tính $V_\pi$ → **đánh giá chính sách**.
- **Điều khiển**: tìm $\pi^*$ và $V^*$ → **lặp chính sách**, **lặp giá trị**.

## 2. Tính chất Markov và chuỗi Markov

**Tính chất Markov:** tương lai chỉ phụ thuộc hiện tại, không phụ thuộc quá khứ:

$$
p\left(s_{t+1} \mid s_t\right)=p\left(s_{t+1} \mid h_t\right), \qquad h_t=\{s_1,\ldots,s_t\}
$$

- **Chuỗi Markov:** quá trình Markov thời gian rời rạc, số trạng thái hữu hạn.
- **Ma trận chuyển trạng thái** $\boldsymbol P$: phần tử hàng $s$, cột $s'$ là $p(s'\mid s)$. **Mỗi hàng cộng lại bằng 1.**
- Có $\boldsymbol P$ thì **lấy mẫu** được quỹ đạo, ví dụ $s_3, s_4, s_5, s_6, s_6$.

## 3. MRP: lợi tức và hàm giá trị

| Khái niệm | Định nghĩa |
|---|---|
| Tầm (horizon) | số bước tối đa của một tập |
| Lợi tức (return) | $G_t=r_{t+1}+\gamma r_{t+2}+\gamma^2 r_{t+3}+\cdots+\gamma^{T-t-1}r_T$ |
| Hàm giá trị trạng thái | $V(s)=\mathbb{E}\left[G_t \mid s_t=s\right]$ |

**Bốn lý do dùng chiết khấu $\gamma$:**

1. Tránh lợi tức vô hạn khi quá trình có vòng lặp, không kết thúc.
2. Mô hình môi trường không hoàn hảo → tương lai bất định, nên tin ít hơn.
3. Phần thưởng có giá trị thực tế thì nhận sớm tốt hơn (tiền bây giờ giá trị hơn tiền sau này).
4. Ưu tiên phần thưởng tức thời.

$\gamma=0$: chỉ quan tâm phần thưởng hiện tại. $\gamma=1$: tương lai và hiện tại như nhau. $\gamma$ là **siêu tham số**.

**Ví dụ tính tay** ($\boldsymbol R=[5,0,0,0,0,0,10]$, $\gamma=0.5$, tập dài 4 bước):

$$
G(s_4,s_5,s_6,s_7)=0+0.5\times 0+0.25\times 0+0.125\times 10=1.25
$$

💡 Phần thưởng ở bước thứ $k$ (tính từ 0) bị nhân $\gamma^k$. Phần thưởng ở $s_7$ là bước thứ 3 nên bị chiết khấu 3 lần.

## 4. Phương trình Bellman (MRP)

$$
V(s)=\underbrace{R(s)}_{\text{phần thưởng tức thời}}+\underbrace{\gamma \sum_{s' \in S} p\left(s' \mid s\right) V\left(s'\right)}_{\text{tổng chiết khấu của giá trị tương lai}}
$$

- Ý nghĩa: **giá trị hiện tại = phần thưởng ngay + $\gamma$ × trung bình giá trị các trạng thái kế tiếp.**
- Mấu chốt của chứng minh: $\mathbb{E}[V(s_{t+1})\mid s_t]=\mathbb{E}[G_{t+1}\mid s_t]$, theo **công thức kỳ vọng toàn phần** (luật kỳ vọng lặp) cùng tính chất Markov.

**Dạng ma trận và nghiệm giải tích:**

$$
\boldsymbol V=\boldsymbol R+\gamma \boldsymbol P \boldsymbol V
\quad\Longrightarrow\quad
\boldsymbol V=(\boldsymbol I-\gamma \boldsymbol P)^{-1}\boldsymbol R
$$

⚠️ Nghịch đảo ma trận tốn $O(N^3)$. Chỉ dùng được cho MRP **rất nhỏ**. MRP lớn thì dùng phương pháp lặp.

## 5. Ba cách tính giá trị cho MRP lớn

| Phương pháp | Cách làm | Cần mô hình $P$? |
|---|---|---|
| **Monte Carlo (MC)** | lấy mẫu nhiều quỹ đạo từ $s$, **lấy trung bình** lợi tức: $V(s)\approx \frac{1}{N}\sum g$ | không, chỉ cần lấy mẫu được |
| **Quy hoạch động (DP)** | lặp $V'(s)=R(s)+\gamma\sum_{s'}P(s'\mid s)V(s')$ đến khi $\lVert V-V'\rVert<\epsilon$ | **có** |
| **Sai phân thời gian (TD)** | kết hợp MC và DP | (học ở chương 3) |

💡 **Bootstrapping:** cập nhật một ước lượng dựa trên **ước lượng khác** (DP dùng $V(s')$ để cập nhật $V(s)$). MC **không** bootstrapping, nó dùng lợi tức thật của quỹ đạo.

## 6. Từ MRP lên MDP

Thêm hành động vào xác suất chuyển và phần thưởng:

$$
p\left(s_{t+1}=s' \mid s_t=s, a_t=a\right)
$$

$$
R(s,a)=\mathbb{E}\left[r_t \mid s_t=s, a_t=a\right]
$$

**Chính sách:** $\pi(a\mid s)=p(a_t=a\mid s_t=s)$.

⭐ **MDP + chính sách cố định $\pi$ = MRP.** Lấy tổng theo hành động để loại bỏ $a$:

$$
P_\pi(s'\mid s)=\sum_{a\in A}\pi(a\mid s)\,p(s'\mid s,a)
$$

$$
r_\pi(s)=\sum_{a\in A}\pi(a\mid s)\,R(s,a)
$$

💡 Đây là lý do mọi công cụ của MRP (Bellman, ma trận, MC, DP) dùng lại được để **đánh giá chính sách** trong MDP.

| | MP / MRP | MDP |
|---|---|---|
| Chuyển trạng thái | $s \to s'$ trực tiếp theo $P$ | $s \to$ **chọn** $a$ (nút đen) $\to s'$ theo $p(s'\mid s,a)$ |
| Ai quyết định | không ai, trôi theo xác suất | tác tử chọn hành động, môi trường vẫn ngẫu nhiên |

## 7. Hàm giá trị trong MDP

$$
V_\pi(s)=\mathbb{E}_\pi\left[G_t \mid s_t=s\right]
$$

$$
Q_\pi(s,a)=\mathbb{E}_\pi\left[G_t \mid s_t=s, a_t=a\right]
$$

**Hai cầu nối V ↔ Q** (nhớ hai dòng này là suy ra được mọi thứ còn lại):

$$
V_\pi(s)=\sum_{a\in A}\pi(a\mid s)\,Q_\pi(s,a) \tag{2.8}
$$

$$
Q_\pi(s,a)=R(s,a)+\gamma\sum_{s'\in S}p(s'\mid s,a)\,V_\pi(s') \tag{2.9}
$$

- Thay (2.9) vào (2.8) → quan hệ giữa $V$ hiện tại và $V$ tương lai:

$$
V_\pi(s)=\sum_{a}\pi(a\mid s)\Big(R(s,a)+\gamma\sum_{s'}p(s'\mid s,a)\,V_\pi(s')\Big)
$$

- Thay (2.8) vào (2.9) → quan hệ giữa $Q$ hiện tại và $Q$ tương lai:

$$
Q_\pi(s,a)=R(s,a)+\gamma\sum_{s'}p(s'\mid s,a)\sum_{a'}\pi(a'\mid s')\,Q_\pi(s',a')
$$

Dạng kỳ vọng gọn (**phương trình kỳ vọng Bellman**):

$$
V_\pi(s)=\mathbb{E}_\pi\left[r_{t+1}+\gamma V_\pi(s_{t+1}) \mid s_t=s\right]
$$

$$
Q_\pi(s,a)=\mathbb{E}_\pi\left[r_{t+1}+\gamma Q_\pi(s_{t+1},a_{t+1}) \mid s_t=s,a_t=a\right]
$$

### Sơ đồ backup

- Vòng tròn **rỗng** = trạng thái; vòng tròn **đặc** (đen) = cặp trạng thái-hành động.
- Mỗi sơ đồ có **hai tầng lấy tổng**:
  - Sơ đồ của $V_\pi$: tổng theo $s'$ (lá → nút đen, trọng số $p$), rồi tổng theo $a$ (nút đen → gốc, trọng số $\pi$).
  - Sơ đồ của $Q_\pi$: ngược lại, tổng theo $a'$ trước, rồi theo $s'$.
- "Backup" = **đẩy thông tin giá trị từ trạng thái kế tiếp ngược về trạng thái hiện tại**.

## 8. Dự đoán và điều khiển

| | Dự đoán (prediction) | Điều khiển (control) |
|---|---|---|
| Đầu vào | MDP $\langle S,A,P,R,\gamma\rangle$ **và** $\pi$ | chỉ MDP |
| Đầu ra | $V_\pi$ | $V^*$ **và** $\pi^*$ |
| Tên khác | đánh giá chính sách | tìm chính sách tối ưu |
| Ví dụ lưới | chính sách ngẫu nhiên 0.25 mỗi hướng | tự tìm hướng đi tốt nhất |

💡 Hai bài toán **nối tiếp**: giải dự đoán trước, rồi dùng nó để giải điều khiển.

## 9. Quy hoạch động

Áp dụng được khi bài toán có:

- **Cấu trúc con tối ưu**: lời giải tối ưu ghép từ lời giải tối ưu của bài toán con.
- **Bài toán con chồng lấp**: bài toán con lặp lại, lưu kết quả để dùng lại.

MDP thỏa cả hai: phương trình Bellman cho cấu trúc đệ quy, còn hàm giá trị đóng vai bảng lưu kết quả.

⚠️ DP giải bài toán **lập kế hoạch**, không phải bài toán **học**: phải **biết hết** $P$ và $R$. Các chương sau bỏ giả định này.

## 10. Đánh giá chính sách (lặp)

Biến phương trình kỳ vọng Bellman thành **phép cập nhật**, lặp đến hội tụ:

$$
V^{t+1}(s)=\sum_{a\in A}\pi(a\mid s)\left(R(s,a)+\gamma\sum_{s'\in S}p(s'\mid s,a)\,V^t(s')\right) \tag{2.18}
$$

Dạng MRP tương đương: $V_{t+1}(s)=r_\pi(s)+\gamma\sum_{s'}P_\pi(s'\mid s)V_t(s')$.

| Backup đồng bộ (synchronous) | Backup bất đồng bộ (asynchronous) |
|---|---|
| mỗi vòng cập nhật **tất cả** trạng thái | mỗi vòng chỉ cập nhật **một phần** trạng thái |
| tốn tính toán | tiết kiệm, vì nhiều trạng thái không cần cập nhật |

💡 Trực quan trên thế giới lưới: giá trị **lan dần** từ các ô có phần thưởng ra các ô xung quanh, mỗi vòng lan thêm một bước.

## 11. Giá trị tối ưu và chính sách tối ưu

$$
V^*(s)=\max_\pi V_\pi(s), \qquad \pi^*(s)=\arg\max_\pi V_\pi(s)
$$

Có $Q^*$ thì rút ra $\pi^*$ ngay, bằng cách chọn tham lam:

$$
\pi^*(a\mid s)=\begin{cases}1, & a=\arg\max_{a\in A} Q^*(s,a)\\ 0, & \text{trường hợp khác}\end{cases}
$$

- $V^*$ là **duy nhất**; $\pi^*$ **có thể không duy nhất** (nhiều hành động cùng đạt giá trị tối ưu).
- Chính sách tối ưu thường **tất định** và **dừng** (không đổi theo thời gian).
- Vét cạn: $|A|^{|S|}$ chính sách → quá chậm, nên mới cần lặp chính sách và lặp giá trị.

**Phương trình tối ưu Bellman:**

$$
V^*(s)=\max_a Q^*(s,a)=\max_a\left(R(s,a)+\gamma\sum_{s'\in S}p(s'\mid s,a)\,V^*(s')\right)
$$

$$
Q^*(s,a)=R(s,a)+\gamma\sum_{s'\in S}p(s'\mid s,a)\max_{a'}Q^*(s',a')
$$

⚠️ **Dễ nhầm:** kỳ vọng Bellman lấy **trung bình theo $\pi$** ($\sum_a \pi(a\mid s)\cdots$); tối ưu Bellman lấy **max theo $a$**. Dạng $Q^*$ ở trên là nền tảng của **Q-learning** (chương 3).

⚠️ **Dễ nhầm (ghi chú của người dịch):** $\max_a(x_a+y_a)\neq\max_a x_a+\max_a y_a$ nói chung. Khi suy ra $V^*$ chỉ được tách **kỳ vọng**, không được tách $\max$.

## 12. Lặp chính sách và lặp giá trị

**Lặp chính sách (policy iteration):** "đá bóng qua lại" giữa hai bước, đến khi chính sách không đổi.

1. **Đánh giá chính sách:** giữ $\pi_i$ cố định, tính $V_{\pi_i}$ (lặp (2.18) đến hội tụ).
2. **Cải thiện chính sách:** tính bảng Q, rồi chọn tham lam (lấy max **từng cột** của bảng Q):

$$
Q_{\pi_i}(s,a)=R(s,a)+\gamma\sum_{s'}p(s'\mid s,a)\,V_{\pi_i}(s')
$$

$$
\pi_{i+1}(s)=\arg\max_a Q_{\pi_i}(s,a)
$$

💡 Cải thiện tham lam **không bao giờ làm chính sách tệ đi** (tăng đơn điệu). Khi cải thiện dừng lại thì $\max_a Q_\pi(s,a)=V_\pi(s)$, tức là phương trình tối ưu Bellman được thỏa → đã tối ưu.

**Lặp giá trị (value iteration):** dùng thẳng phương trình tối ưu Bellman làm phép cập nhật.

1. Khởi tạo $V_0(s)=0$ với mọi $s$.
2. Lặp $k=1,\ldots,H$, với mọi trạng thái $s$:

$$
Q_{k+1}(s,a)=R(s,a)+\gamma\sum_{s'}p(s'\mid s,a)\,V_k(s')
$$

$$
V_{k+1}(s)=\max_a Q_{k+1}(s,a)
$$

3. Hội tụ rồi **mới** rút chính sách:

$$
\pi(s)=\arg\max_a\Big[R(s,a)+\gamma\sum_{s'}p(s'\mid s,a)\,V_{H+1}(s')\Big]
$$

**Nguyên lý tối ưu:** $\pi$ tối ưu tại $s$ **khi và chỉ khi** $\pi$ tối ưu tại mọi $s'$ đến được từ $s$. Vì vậy giá trị tối ưu lan ngược từ đích ra, mỗi vòng lặp một bước.

| | Lặp chính sách | Lặp giá trị |
|---|---|---|
| Phương trình dùng | kỳ vọng Bellman (bước đánh giá) | **tối ưu** Bellman |
| Mỗi vòng lặp | đánh giá đầy đủ + cải thiện | một lần cập nhật có $\max$ |
| Kết quả giữa chừng | **luôn là chính sách hoàn chỉnh**, có ý nghĩa | $V$ và chính sách giữa chừng **không có ý nghĩa** |
| Rút chính sách | sau mỗi vòng | chỉ **một lần**, ở cuối |
| Kết quả cuối | $\pi^*$, $V^*$ | cùng $\pi^*$, $V^*$ |

## 13. Bảng tổng kết (bảng 2.1)

| Bài toán | Phương trình Bellman | Thuật toán |
|---|---|---|
| Dự đoán | kỳ vọng | đánh giá chính sách lặp |
| Điều khiển | kỳ vọng | lặp chính sách |
| Điều khiển | **tối ưu** | lặp giá trị |

## 14. Tự kiểm tra nhanh

1. MP, MRP, MDP khác nhau ở thành phần nào? Vì sao "MDP + $\pi$ = MRP"?
2. Tính tay $G$ của quỹ đạo $s_4,s_3,s_2,s_1$ với $\gamma=0.5$, $\boldsymbol R=[5,0,0,0,0,0,10]$.
3. Nêu 4 lý do dùng hệ số chiết khấu.
4. Viết phương trình Bellman của MRP và nghiệm giải tích. Vì sao không dùng nghiệm giải tích cho bài toán lớn?
5. MC và DP khác nhau thế nào? Bootstrapping là gì?
6. Viết (2.8), (2.9), rồi tự suy ra phương trình Bellman cho $V_\pi$ và cho $Q_\pi$.
7. Phương trình kỳ vọng Bellman khác phương trình tối ưu Bellman ở đâu?
8. Dự đoán và điều khiển: đầu vào, đầu ra?
9. Vì sao chính sách giữa chừng của lặp giá trị không có ý nghĩa, còn của lặp chính sách thì có?

👉 Xem trực quan: [lợi tức và giá trị MRP](viz/mrp-return.html ':ignore :target=_blank') · [đánh giá chính sách](viz/policy-eval.html ':ignore :target=_blank') · [lặp chính sách](viz/policy-iter.html ':ignore :target=_blank') · [lặp giá trị](viz/value-iter.html ':ignore :target=_blank') · [thế giới lưới](viz/gridworld.html ':ignore :target=_blank').

👉 Kiểm tra trí nhớ bằng [flashcard, quiz và chứng minh của chương 2](review/index.html?ch=2 ':ignore :target=_self'), xem đáp án tham khảo ở [Chương 2 Bài tập](chapter2/chapter2_questions&keywords_vi).
