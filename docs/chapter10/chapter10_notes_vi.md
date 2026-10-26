# Chương 10 Ghi chú trọng tâm

> Ghi chú của người dịch: đây là bản ghi chú tổng hợp kiến thức trọng tâm của [chương 10](chapter10/chapter10_vi), do người dịch biên soạn để đọc lại nhanh. Chương lý thuyết dẫn dắt từ ví dụ đến khái niệm; trang này chỉ giữ khái niệm, công thức, so sánh và chỗ dễ nhầm. Các ý không có trong sách được ghi rõ.

## 1. Bức tranh chung

**Phần thưởng thưa (sparse reward):** phần lớn thời gian tác tử nhận phần thưởng $0$. Mọi hành động đều "tệ như nhau" → không có tín hiệu để học.

💡 Ví dụ: robot dùng tua vít vặn ốc. Khám phá ngẫu nhiên gần như không bao giờ tình cờ làm đúng cả chuỗi để nhận phần thưởng $1$.

**Ba hướng giải quyết:**

| Hướng | Ý chính | Cần gì |
|---|---|---|
| **Thiết kế phần thưởng** | thêm phần thưởng phụ để dẫn dắt | tri thức chuyên ngành |
| ↳ **Tò mò (ICM)** | thưởng cho trạng thái **khó dự đoán** | khá tổng quát |
| **Học theo giáo trình** | cho học từ **dễ đến khó** | người thiết kế giáo trình |
| ↳ **Giáo trình ngược** | suy ngược từ **trạng thái đích** | khá tổng quát |
| **HRL** | chia nhiệm vụ lớn thành **mục tiêu con** | nhiều tầng tác tử |

## 2. Thiết kế phần thưởng (reward shaping)

Môi trường có **phần thưởng thực**; ta **cố ý thêm** phần thưởng khác (không phải của môi trường) để dẫn tác tử tới hành vi mong muốn.

**Ví dụ đứa trẻ (hình 10.1):**

- Chơi: $+1$ ngay; sau 100 giờ thi kém, $-100$
- Học: $-1$ ngay; sau 100 giờ được $+100$
- Đứa trẻ chiết khấu nặng ($\gamma$ **nhỏ**) và ước lượng $Q$ kém → chọn chơi. Người lớn hứa "học thì được kẹo mút" → phần thưởng **ngay sau** khi học thành dương.

**Ví dụ ViZDoom (Meta):** mất máu, tốn đạn, đứng yên → trừ điểm; nhặt tiếp tế, di chuyển → cộng điểm. **Còn sống bị trừ một điểm rất nhỏ**, để tác tử không chỉ lo né địch mà hiếu chiến hơn.

⚠️ **Điểm yếu: cần tri thức chuyên ngành.** Ví dụ luồn tấm ván qua cột (hình 10.2): thưởng "ván càng gần cột càng tốt" → robot **đập ván vào cột**, trong khi phải đưa ván lên trên cột mới luồn được. Phần thưởng thiết kế sai làm tác tử học sai.

💡 **Ghi chú của người dịch:** có một dạng thiết kế "an toàn" là phần thưởng **dựa trên thế năng** (potential-based shaping, Ng và cộng sự, 1999). Chọn hàm thế năng $\Phi(s)$ bất kỳ, cộng thêm

$$
F(s,s')=\gamma\,\Phi(s')-\Phi(s)
$$

thì chính sách tối ưu **không đổi**. Thiết kế tùy ý như ví dụ tấm ván thì không có bảo đảm này.

## 3. Tò mò: mô-đun tò mò nội tại (ICM)

**Phần thưởng hướng tò mò (curiosity driven reward):** thêm một hàm phần thưởng mới, **ICM**, nhận $(s_t,a_t,s_{t+1})$ và đưa ra **phần thưởng nội tại** $r_t^i$. Tác tử tối đa hóa **tổng cả hai loại**:

$$
\sum_t\big(r_t+r_t^i\big)
$$

**Bản nguyên thủy (hình 10.4):** mạng 1 dự đoán $\hat s_{t+1}$ từ $(s_t,a_t)$. Dự đoán **càng sai** so với $s_{t+1}$ thật → $r_t^i$ **càng lớn**.

- Ý nghĩa: khuyến khích làm những việc mà **hậu quả khó đoán** → khám phá thế giới chưa biết.
- Mạng 1 được **huấn luyện riêng**; khi tác tử tương tác thì **cố định** ICM.

⚠️ **Vấn đề:** khó đoán **không** có nghĩa là đáng thử.

- Cò quay Nga cũng không đoán được kết quả.
- Lá cây bay, cỏ lay ở hậu cảnh khó đoán → tác tử **đứng nhìn lá bay mãi**.

**Bản cải tiến (hình 10.5): thêm bộ trích xuất đặc trưng $\boldsymbol\phi$.**

- **Mạng 1 (mô hình thuận):** từ $\boldsymbol\phi(s_t)$ và $a_t$ dự đoán $\hat{\boldsymbol\phi}(s_{t+1})$; $r_t^i$ lớn khi dự đoán khác $\boldsymbol\phi(s_{t+1})$ thật.
- **Mạng 2 (mô hình ngược):** từ $\boldsymbol\phi(s_t)$ và $\boldsymbol\phi(s_{t+1})$ dự đoán **hành động** $\hat a_t$, mong gần $a_t$ thật.

⭐ Vì $\boldsymbol\phi$ phải giúp **đoán ra hành động**, những thứ **không liên quan đến hành động** của tác tử (lá bay, mây trôi) bị lọc khỏi đặc trưng → tò mò chỉ hướng vào những gì tác tử **tác động được**.

⚠️ **Ghi chú của người dịch:** trong bài báo ICM (Pathak và cộng sự, 2017):

$$
r_t^i=\frac{\eta}{2}\,\big\|\hat{\boldsymbol\phi}(s_{t+1})-\boldsymbol\phi(s_{t+1})\big\|_2^2
$$

với $\eta>0$ là hệ số tỉ lệ. Mô hình thuận học bằng sai số bình phương đó, mô hình ngược học bằng hàm mất mát phân loại hành động; đặc trưng $\boldsymbol\phi$ được định hình chủ yếu nhờ **mô hình ngược**.

## 4. Học theo giáo trình (curriculum learning)

Sắp xếp dữ liệu huấn luyện **từ dễ đến khó**. Không riêng gì học tăng cường: huấn luyện RNN với chuỗi ngắn trước, chuỗi dài sau cũng tốt hơn.

💡 Dạy trẻ vi tích phân, sai thì phạt → không học được; dạy phép nhân trước.

**Ví dụ:**

- **ViZDoom:** giáo trình 0 → 7, quái vật nhanh hơn, nhiều máu hơn. Vào thẳng giáo trình 7 thì **không học được**.
- **Tấm ván và cột (hình 10.6):** ván đã nằm trên cột, chỉ cần ấn xuống → đặt ván cao hơn một chút → đặt ván xa cột.

⚠️ Nhược điểm: **con người phải thiết kế** giáo trình.

## 5. Sinh giáo trình ngược (reverse curriculum generation)

Cách **tổng quát** để máy tự sinh giáo trình, **suy ngược từ trạng thái đích** $s_\mathrm{g}$ (hình 10.7, 10.8):

1. Từ $s_\mathrm{g}$, lấy mẫu các trạng thái **gần** $s_\mathrm{g}$, gọi là $s_1$ ("gần" thế nào tùy nhiệm vụ).
2. Cho tác tử xuất phát từ các $s_1$, tương tác và nhận phần thưởng.
3. **Bỏ các trường hợp phần thưởng cực đoan:**
   - phần thưởng **rất lớn** → quá dễ, đã biết rồi;
   - phần thưởng **rất nhỏ** → quá khó, chưa học nổi.
4. Từ các trạng thái có phần thưởng **vừa phải**, lấy mẫu tiếp các trạng thái **xa hơn**, lặp lại.

💡 Cánh tay robot: đặt ngay cạnh vật mà gắp được → đặt xa hơn một chút → xa hơn nữa.

## 6. Học tăng cường phân cấp (HRL)

**Ý tưởng:** nhiều tác tử chia tầng. Tác tử **tầng trên** đặt **mục tiêu**, gọi là **tầm nhìn (vision)**, cho tác tử **tầng dưới** thực hiện. Hành động của tầng trên chính là đưa ra tầm nhìn.

💡 Viết sách: chia thành chương, mục, đoạn, câu. Viết bài báo: nghĩ ý tưởng, làm thí nghiệm, viết bài, nộp bài; làm thí nghiệm lại gồm thu dữ liệu, gán nhãn, thiết kế mạng…

**Ví dụ hình 10.9:** hiệu trưởng → giáo sư → nghiên cứu sinh. Trường vào top 100 thì mọi người được thưởng.

- Mỗi tác tử nhận tầm nhìn của tầng trên làm **đầu vào**, quyết định đầu ra của mình.
- ⭐ Tầng trên đưa ra tầm nhìn mà tầng dưới **không làm được** → tầng trên nhận **phần thưởng âm**. Vì vậy nó học cách đặt mục tiêu **vừa sức**.

**Đổi tầm nhìn (hình 10.10):** giáo sư định đăng bài nhưng thực tế lại thành YouTuber. Ta **coi như tầm nhìn ban đầu chính là "thành YouTuber"** → các hành động đã làm **không bị lãng phí**, vẫn là ví dụ để học cách đạt mục tiêu đó.

⚠️ **Ghi chú của người dịch:** ý "đổi mục tiêu thành cái thực sự đạt được" cũng là tư tưởng của **phát lại kinh nghiệm nhìn lại** (hindsight experience replay, HER, Andrychowicz và cộng sự, 2017).

**Ví dụ hình 10.11 (hai tầng):**

- **Mê cung:** tầng trên đặt các **điểm hồng** (tầm nhìn) lần lượt; tác tử xanh lam (tầng dưới) đi tới từng điểm, cuối cùng tới đích vàng.
- **Con lắc:** các điểm hồng dẫn con lắc lắc dần lên chạm quả bóng vàng.

**Tổng kết:** HRL phân rã bài toán phức tạp thành nhiều **bài toán con**, mỗi bài toán con là một **MDP** riêng. Chính sách chia thành **chính sách cấp cao** (dựa vào trạng thái hiện tại quyết định mục tiêu) và **chính sách cấp thấp** (thực hiện mục tiêu).

## 7. Tự kiểm tra nhanh

1. Vì sao phần thưởng thưa làm tác tử không học được gì?
2. Thiết kế phần thưởng là gì? Vì sao ViZDoom trừ điểm cả khi tác tử còn sống?
3. Ví dụ tấm ván và cột cho thấy điểm yếu gì của thiết kế phần thưởng?
4. ICM nhận gì, đưa ra gì? Phần thưởng nội tại lớn khi nào?
5. Vì sao "khó đoán" chưa đủ? Bộ trích xuất đặc trưng giải quyết thế nào, nhờ mạng nào?
6. Học theo giáo trình là gì? Cho một ví dụ.
7. Các bước của sinh giáo trình ngược? Vì sao bỏ các trường hợp phần thưởng quá lớn và quá nhỏ?
8. Trong HRL, hành động của tác tử tầng trên là gì? Khi nào nó bị phạt?
9. Ví dụ "giáo sư thành YouTuber" nói lên ý gì?
10. HRL chia chính sách của tác tử thế nào?

👉 Xem trực quan: [ICM: tò mò và lá cây bay](viz/icm.html ':ignore :target=_blank') · [HRL: tầm nhìn trong mê cung bốn phòng](viz/hrl.html ':ignore :target=_blank').

👉 Kiểm tra trí nhớ bằng [flashcard và quiz của chương 10](review/index.html?ch=10 ':ignore :target=_self'), xem đáp án tham khảo ở [Chương 10 Bài tập](chapter10/chapter10_questions&keywords_vi).
