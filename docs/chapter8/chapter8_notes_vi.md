# Chương 8 Ghi chú trọng tâm

> Ghi chú của người dịch: đây là bản ghi chú tổng hợp kiến thức trọng tâm của [chương 8](chapter8/chapter8_vi), do người dịch biên soạn để đọc lại nhanh. Chương lý thuyết dẫn dắt từ ví dụ đến khái niệm; trang này chỉ giữ khái niệm, công thức, so sánh và chỗ dễ nhầm. Các ý không có trong sách được ghi rõ.

## 1. Bức tranh chung

**Điểm mạnh của DQN:** ổn định, dễ huấn luyện. Ước lượng $Q$ chỉ là **bài toán hồi quy** (nhìn hàm mất mát giảm là biết mô hình học tốt), và có $Q$ là **chắc chắn cải thiện được chính sách** (chương 6). Gradient chính sách thì kém ổn định, trước khi có PPO rất khó dùng.

**Điểm yếu lớn nhất:** **hành động liên tục**. DQN cần giải

$$
a=\arg\max_a Q(s,a)
$$

| Hành động | Ví dụ | Giải $\arg\max$ |
|---|---|---|
| Rời rạc | Atari: lên, xuống, trái, phải, bắn | thử **từng** hành động, dễ |
| Liên tục | góc vô lăng; robot 50 khớp → $\boldsymbol a$ là **vectơ số thực** 50 chiều | không vét cạn được |

Chương 8 đưa ra **4 phương án**.

## 2. Bốn phương án

**① Lấy mẫu hành động**
- Cách làm: lấy $N$ hành động $\{a_1,\ldots,a_N\}$, đưa cả lô vào $Q$, chọn cái lớn nhất.
- Ưu: đơn giản; GPU tính song song cả $N$ giá trị cùng lúc.
- Nhược: **không chính xác**, vì không lấy mẫu được quá nhiều.

**② Gradient ascent theo $a$**
- Cách làm: coi $a$ là tham số, đi lên theo gradient để tối đa $Q(s,a)$.
- Nhược: có thể không tìm được **cực đại toàn cục**; **tính toán rất nặng**, vì mỗi lần chọn hành động lại phải chạy cả một vòng tối ưu.

**③ Thiết kế kiến trúc mạng**
- Cách làm: thiết kế $Q$ sao cho $\arg\max$ có **nghiệm dạng đóng** (xem mục 3).
- Ưu: giải $\arg\max$ rất dễ.
- Nhược: **hạn chế** dạng hàm $Q$, không đặt tùy ý được.

**④ Không dùng DQN**
- Cách làm: kết hợp phương pháp dựa trên chính sách (PPO) với phương pháp dựa trên giá trị (DQN).
- Kết quả: **diễn viên-nhà phê bình (actor-critic)**, chương 9.

## 3. Phương án ③ chi tiết

Đưa trạng thái $\boldsymbol s$ vào mạng, được ba đầu ra: vectơ $\boldsymbol\mu(\boldsymbol s)$, ma trận $\boldsymbol\Sigma(\boldsymbol s)$, số vô hướng $V(\boldsymbol s)$. Hành động $\boldsymbol a$ chỉ tham gia ở bước cuối:

$$
Q(\boldsymbol s,\boldsymbol a)=-\big(\boldsymbol a-\boldsymbol\mu(\boldsymbol s)\big)^{\mathrm T}\boldsymbol\Sigma(\boldsymbol s)\big(\boldsymbol a-\boldsymbol\mu(\boldsymbol s)\big)+V(\boldsymbol s)
$$

- $\boldsymbol a$, $\boldsymbol\mu(\boldsymbol s)$: vectơ cột (mỗi chiều có thể là góc một khớp robot).
- $\boldsymbol\Sigma(\boldsymbol s)$: **ma trận xác định dương**, dựng bằng $\boldsymbol\Sigma=\boldsymbol L\boldsymbol L^{\mathrm T}$ với $\boldsymbol L$ tam giác dưới.
- Kết quả $Q$ là một **số vô hướng**.

**Tìm $\arg\max$:** số hạng dạng toàn phương **không âm**, lại có dấu trừ phía trước → càng nhỏ thì $Q$ càng lớn. Nhỏ nhất (bằng 0) khi

$$
\begin{aligned}\boldsymbol a^*&=\arg\max_{\boldsymbol a}Q(\boldsymbol s,\boldsymbol a)=\boldsymbol\mu(\boldsymbol s)\\ Q(\boldsymbol s,\boldsymbol a^*)&=V(\boldsymbol s)\end{aligned}
$$

💡 Hình dung: $Q$ theo $\boldsymbol a$ là một "**cái bát úp ngược**" có đỉnh tại $\boldsymbol\mu(\boldsymbol s)$, độ cao đỉnh là $V(\boldsymbol s)$, độ dốc hai bên do $\boldsymbol\Sigma(\boldsymbol s)$ quyết định.

⚠️ **Ghi chú của người dịch:**

- $\boldsymbol L\boldsymbol L^{\mathrm T}$ chỉ chắc chắn **xác định dương** khi đường chéo của $\boldsymbol L$ **dương** (thường lấy mũ hoặc softplus cho đường chéo); nếu không thì chỉ là nửa xác định dương.
- Phương án này chính là thuật toán **NAF** (normalized advantage functions, Gu và cộng sự, 2016). Số hạng toàn phương đóng vai **lợi thế** $A(\boldsymbol s,\boldsymbol a)\le 0$, nên đây cũng là dạng $Q=V+A$ như DQN đối đầu (chương 7).

**Định nghĩa:** ma trận đối xứng $\boldsymbol A$ cấp $n$ là **xác định dương** nếu $\boldsymbol x^{\mathrm T}\boldsymbol A\boldsymbol x>0$ với mọi vectơ $\boldsymbol x\neq\boldsymbol 0$.

## 4. Tự kiểm tra nhanh

1. Vì sao ước lượng $Q$ dễ hơn học trực tiếp một chính sách?
2. Vì sao DQN khó dùng với hành động liên tục? Bước nào bị vướng?
3. Phương án lấy mẫu hành động có ưu, nhược điểm gì?
4. Vì sao gradient ascent theo $a$ tốn kém?
5. Viết dạng $Q(\boldsymbol s,\boldsymbol a)$ của phương án ③. Vì sao $\arg\max_{\boldsymbol a}Q=\boldsymbol\mu(\boldsymbol s)$?
6. Vì sao $\boldsymbol\Sigma(\boldsymbol s)$ phải xác định dương? Dựng nó thế nào?
7. Phương án ③ phải trả giá gì?
8. Phương án ④ dẫn tới loại thuật toán nào?

👉 Kiểm tra trí nhớ bằng [flashcard và quiz của chương 8](review/index.html?ch=8 ':ignore :target=_self'), xem đáp án tham khảo ở [Chương 8 Bài tập](chapter8/chapter8_questions&keywords_vi).
