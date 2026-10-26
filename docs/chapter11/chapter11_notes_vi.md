# Chương 11 Ghi chú trọng tâm

> Ghi chú của người dịch: đây là bản ghi chú tổng hợp kiến thức trọng tâm của [chương 11](chapter11/chapter11_vi), do người dịch biên soạn để đọc lại nhanh. Chương lý thuyết dẫn dắt từ ví dụ đến khái niệm; trang này chỉ giữ khái niệm, công thức, so sánh và chỗ dễ nhầm. Các ý không có trong sách được ghi rõ.

## 1. Bức tranh chung

**Học bắt chước (imitation learning, IL):** **không có phần thưởng**, chỉ có **minh họa của chuyên gia** (expert demonstration). Tác tử vẫn tương tác được với môi trường nhưng không nhận phần thưởng nào.

- Tên khác: học từ minh họa (learning from demonstration), học việc (apprenticeship learning), học bằng quan sát (learning by watching).
- Khi nào dùng: **khó định nghĩa phần thưởng** nhưng **dễ thu minh họa**, ví dụ ô tô tự lái (bản ghi người lái), chatbot (hội thoại người thật).

| Phương pháp | Học cái gì từ minh họa |
|---|---|
| **Nhân bản hành vi** (BC) | học thẳng **chính sách**: $s\to a$ |
| ↳ **DAgger** | BC + thu thêm nhãn chuyên gia ở trạng thái **diễn viên tự gặp** |
| **Học tăng cường ngược** (IRL) | học **hàm phần thưởng** trước, rồi mới học chính sách |

💡 IRL còn gọi là **điều khiển tối ưu ngược** (inverse optimal control).

## 2. Nhân bản hành vi (behavior cloning, BC)

**Chính là học có giám sát:** chuyên gia ở $s_i$ làm $a_i$ → huấn luyện diễn viên sao cho vào $s_i$ thì ra $a_i$.

💡 **Ghi chú của người dịch:** hành động rời rạc thì tối thiểu entropy chéo $-\log\pi_\theta(a_i\mid s_i)$; liên tục thì thường dùng sai số bình phương $\|\pi_\theta(s_i)-a_i\|^2$.

**Ba vấn đề của BC:**

**① Trạng thái quan sát được rất hạn chế.** Chuyên gia lái giỏi, **không bao giờ** sắp đâm tường; Mario chuyên gia không bao giờ nhảy hụt ống. Diễn viên lỡ rơi vào tình huống đó → **không biết xử lý**, vì dữ liệu chưa từng có.

**② Bắt chước cả cái không cần thiết.** Diễn viên chép **mọi** hành vi, kể cả thói quen vô ích. Nếu chép được hết thì không sao, nhưng mạng có **dung lượng hạn chế** → phải biết **cái gì nên học**.

💡 Học tiếng Trung từ giáo viên: học được **giọng nói** là đúng, chỉ học được **cử chỉ tay** là hỏng. BC không biết cái nào quan trọng.

**③ Lệch phân phối huấn luyện và kiểm thử (mismatch).**

- Trong học tăng cường, **hành động quyết định trạng thái tiếp theo** → ảnh hưởng **phân phối trạng thái**.
- Học được $\theta^*$ **giống hệt** chuyên gia $\hat\theta$ thì trạng thái gặp khi kiểm thử giống khi huấn luyện. Nhưng rất khó giống hệt.
- Học có giám sát thông thường: mẫu **độc lập**, sai một chút không sao. Học tăng cường: **sai một li, đi một dặm**, lệch một chút có thể làm kết quả kém đi rất nhiều.

⚠️ **Ghi chú của người dịch:** phân tích kinh điển (Ross và cộng sự, 2011): nếu mỗi bước sai với xác suất $\varepsilon$ thì sau $T$ bước, BC có thể tích lũy sai đến cỡ $O(\varepsilon T^2)$, còn DAgger giảm xuống cỡ $O(\varepsilon T)$.

## 3. Tổng hợp tập dữ liệu (DAgger)

**Mục tiêu:** thu hành động chuyên gia ở **cả những tình huống cực đoan**, đúng những trạng thái mà diễn viên sẽ gặp.

**Cách làm (hình 11.3):**

1. Diễn viên $\theta_1$ **tự lái** xe, chuyên gia ngồi trên xe.
2. Chuyên gia **chỉ nói** "ở đây mình sẽ rẽ phải…" nhưng **không điều khiển**; $\theta_1$ cứ lái theo ý mình (kể cả đâm tường).
3. Ghi lại: ở các quan sát **$\theta_1$ nhìn thấy**, chuyên gia sẽ làm gì.
4. Dùng dữ liệu này huấn luyện $\theta_2$, lặp lại.

⭐ Điểm mấu chốt: trạng thái do **diễn viên** sinh ra, nhãn hành động do **chuyên gia** đưa ra.

⚠️ Giá phải trả: mỗi lần chạy lại "hy sinh một chuyên gia" (sách nói đùa), tức cần chuyên gia **gán nhãn trực tuyến**, tốn kém.

💡 **Ghi chú của người dịch:** chữ "tổng hợp" (aggregation) là vì dữ liệu mới được **gộp** vào dữ liệu cũ, $\mathcal D\leftarrow\mathcal D\cup\mathcal D_i$, rồi huấn luyện lại trên toàn bộ $\mathcal D$. DAgger giảm vấn đề ③ nhưng không giải quyết vấn đề ②.

## 4. Học tăng cường ngược (IRL)

| | Đầu vào | Đầu ra |
|---|---|---|
| Học tăng cường | môi trường + **hàm phần thưởng** | diễn viên tối ưu |
| **IRL** | môi trường + **minh họa chuyên gia** $\hat\tau$ | **hàm phần thưởng**, rồi diễn viên tối ưu |

**Vì sao học phần thưởng?** Hành vi chuyên gia **phức tạp**, nhưng phần thưởng có thể rất **đơn giản**. Ví dụ: phần thưởng của con người có thể chỉ là "sống thêm một giây được một điểm", mà sinh ra mọi hành vi phức tạp.

**Nguyên tắc: chuyên gia luôn giỏi nhất**, "**bắn tên trước, vẽ bia sau**".

**Vòng lặp (hình 11.7):**

1. Chuyên gia $\hat\theta$ chơi $N$ ván: $\{\hat\tau_1,\ldots,\hat\tau_N\}$.
2. Diễn viên $\theta$ cũng chơi $N$ ván: $\{\tau_1,\ldots,\tau_N\}$.
3. **Học hàm phần thưởng** $R$ sao cho **chuyên gia được điểm cao hơn diễn viên**:

$$
\begin{aligned}
R(\hat\tau_n)&\ \text{càng lớn càng tốt}\\
R(\tau_n)&\ \text{càng nhỏ càng tốt}
\end{aligned}
$$

4. Dùng học tăng cường thông thường, học diễn viên mới **tối đa hóa** $R$ này.
5. **Đổi hàm phần thưởng** sao cho chuyên gia vẫn hơn diễn viên mới, lặp lại.

**Dạng của $R$:** mạng nơ-ron. Đưa cả $\tau$ vào thì khó, nên thường đưa từng cặp $(s,a)$ ra một số thực rồi **cộng lại**:

$$
R(\tau)=\sum_{t}r(s_t,a_t)
$$

⭐ **Hàm phần thưởng tốt nhất:** trên nó, chuyên gia và diễn viên được **điểm cao như nhau**, tức không còn phân biệt được ai giỏi hơn.

**Hội tụ:**

- IRL sớm nhất giả định $R$ **tuyến tính** → chứng minh được **hội tụ**.
- $R$ là mạng thông thường → **không chứng minh được**, thực tế chưa chắc hội tụ.

⚠️ **Ghi chú của người dịch:**

- Với $R$ tuyến tính, $R(\tau)=\boldsymbol w^{\mathrm T}\boldsymbol f(\tau)$, trong đó $\boldsymbol f(\tau)$ là vectơ đặc trưng cộng dồn trên quỹ đạo. Đây là hướng của **học việc** (Abbeel và Ng, 2004). Trang mô phỏng dùng cập nhật đơn giản $\boldsymbol w\leftarrow\boldsymbol w+\alpha(\hat{\boldsymbol f}-\boldsymbol f)$.
- Bài toán IRL **không có nghiệm duy nhất**: nhiều hàm phần thưởng (kể cả $R\equiv 0$) đều "giải thích" được hành vi chuyên gia. Vì vậy các thuật toán thực tế luôn thêm ràng buộc, chuẩn hóa hoặc nguyên lý chọn nghiệm (ví dụ entropy cực đại).

## 5. IRL và GAN

| GAN | IRL |
|---|---|
| ảnh đẹp có sẵn | **minh họa chuyên gia** |
| bộ sinh (generator) | **diễn viên** |
| ảnh do bộ sinh vẽ | **quỹ đạo** diễn viên tạo ra |
| bộ phân biệt (discriminator) | **hàm phần thưởng** |
| bộ phân biệt: ảnh thật điểm cao, ảnh giả điểm thấp | $R$: chuyên gia điểm cao, diễn viên điểm thấp |
| bộ sinh tìm cách lừa bộ phân biệt | diễn viên tìm cách đạt điểm cao trên $R$ |

→ IRL có hội tụ hay không **tương đương** GAN có hội tụ hay không.

💡 **Ghi chú của người dịch:** thuật toán làm đúng ý tưởng này một cách trực tiếp là **GAIL** (generative adversarial imitation learning, Ho và Ermon, 2016).

## 6. Ứng dụng và đặc điểm của IRL

- **Cần rất ít minh họa:** diễn viên được tương tác với môi trường nhiều lần, minh họa chỉ để "chỉ hướng".
- **Đỗ xe (hình 11.9):** mỗi hàng chỉ có **4 minh họa**. Minh họa khác nhau → **phong cách lái** khác nhau: đi đúng đường; không tuân thủ luật (đi ra ngoài đường, xuyên qua xe khác); lùi xe để đỗ.
- **Robot:** thay vì lập trình từng động tác, con người **kéo cánh tay robot** làm mẫu (xếp đĩa), hoặc dạy rót nước chỉ **20 lần** với vị trí cốc hơi khác nhau.

## 7. Học bắt chước góc nhìn ngôi thứ ba

**Vấn đề:** robot **nhìn người khác** đánh golf (ngôi thứ ba) nhưng phải **tự đánh** (ngôi thứ nhất). Hai góc nhìn khác nhau.

**Cách giải:** học bắt chước + **huấn luyện đối kháng miền** (domain-adversarial training, một kỹ thuật của GAN). Học **bộ trích xuất đặc trưng** sao cho ảnh hai miền (ngôi thứ nhất, ngôi thứ ba) sau khi qua nó thì **không phân biệt được** đến từ miền nào → chỉ giữ thứ quan trọng nhất.

## 8. Sinh chuỗi và chatbot

Viết câu cũng là học bắt chước:

- **Hành động** = mỗi chữ; **tập** = cả câu.
- **Minh họa chuyên gia** = văn bản người viết (ví dụ *Đường thi tam bách thủ*), hội thoại người thật.

| Sinh chuỗi | Học bắt chước |
|---|---|
| **hợp lý cực đại** (maximum likelihood): cho phần câu đã có, đoán chữ tiếp theo | **nhân bản hành vi** |
| **GAN chuỗi** (sequence GAN) và các biến thể | **IRL** |

💡 Chỉ hợp lý cực đại thì chưa đủ, vì nó mang theo các vấn đề của BC.

## 9. Tự kiểm tra nhanh

1. Học bắt chước khác học tăng cường ở đâu? Khi nào nên dùng?
2. Vì sao nhân bản hành vi là học có giám sát?
3. Nêu ba vấn đề của nhân bản hành vi, mỗi vấn đề một ví dụ.
4. Vì sao "sai một li, đi một dặm" xảy ra trong học tăng cường mà ít gặp trong học có giám sát thường?
5. DAgger chạy thế nào? Trạng thái do ai sinh, nhãn do ai đưa?
6. IRL nhận gì, đưa ra gì? Vì sao học phần thưởng lại có lợi?
7. Mô tả vòng lặp "bắn tên trước, vẽ bia sau". Hàm phần thưởng tốt nhất trông thế nào?
8. Khi nào chứng minh được IRL hội tụ?
9. Ghép cặp các thành phần của GAN với IRL.
10. Học bắt chước góc nhìn ngôi thứ ba cần thêm kỹ thuật gì? Hợp lý cực đại và GAN chuỗi ứng với gì trong học bắt chước?

👉 Xem trực quan: [DAgger: chuyên gia ngồi trên xe](viz/dagger.html ':ignore :target=_blank') · [IRL: bắn tên trước, vẽ bia sau](viz/irl.html ':ignore :target=_blank').

👉 Kiểm tra trí nhớ bằng [flashcard và quiz của chương 11](review/index.html?ch=11 ':ignore :target=_self'), xem đáp án tham khảo ở [Chương 11 Bài tập](chapter11/chapter11_questions&keywords_vi).
