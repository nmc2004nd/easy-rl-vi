# ICLR 2025 Oral | Chơi Minecraft bằng thị giác thuần túy trên một card 3090: LS-Imagine học tăng cường dựa trên tưởng tượng dài-ngắn hạn trong thế giới mở

LS-Imagine chơi Minecraft thông qua quan sát thị giác thuần túy, bắt chước cách làm của người chơi để học chính sách điều khiển RL, không dùng hack, không dùng thông tin đặc quyền (privileged information).

Huấn luyện tác tử học tăng cường thị giác trong thế giới mở nhiều chiều gặp rất nhiều thách thức. Tuy các phương pháp học tăng cường có mô hình (model-based RL, MBRL) nâng cao hiệu quả mẫu (sample efficiency) bằng cách học mô hình thế giới (world model) có tính tương tác, nhưng các tác tử này thường có vấn đề "thiển cận", vì chúng thường chỉ được huấn luyện trên các đoạn kinh nghiệm tưởng tượng ngắn. Chúng tôi cho rằng thách thức chính của việc ra quyết định trong thế giới mở nằm ở **làm sao nâng cao hiệu quả khám phá trong không gian trạng thái khổng lồ, đặc biệt là với các nhiệm vụ cần xét đến lợi tức dài hạn**. Vì vậy, chúng tôi đề xuất một phương pháp học tăng cường mới: **LS-Imagine**, bằng cách xây dựng một **mô hình thế giới dài-ngắn hạn** (Long Short-Term World Model), mô phỏng sự chuyển trạng thái kiểu nhảy cóc trong điều kiện hướng mục tiêu, và bằng cách phóng to một vùng cụ thể trong một ảnh đơn để tính **bản đồ khả năng tương tác** (Affordance Map) tương ứng, từ đó mở rộng phạm vi tưởng tượng của tác tử trong số bước chuyển trạng thái hữu hạn, giúp nó có thể khám phá các hành vi có thể mang lại lợi tức dài hạn có lợi.

> Tiêu đề bài báo: Open-World Reinforcement Learning over Long Short-Term Imagination
> Tác giả: Jiajian Li\*, Qi Wang\*, Yunbo Wang (tác giả liên hệ), Xin Jin, Yang Li, Wenjun Zeng, Xiaokang Yang (\* đồng tác giả thứ nhất)
> Trang dự án: https://qiwang067.github.io/ls-imagine
> Link bài báo: https://openreview.net/pdf?id=vzItLaEoDa
> Link code: https://github.com/qiwang067/LS-Imagine

## 1. Giới thiệu

Trong bối cảnh học tăng cường, việc ra quyết định trong thế giới mở có các đặc điểm sau:

1. **Không gian trạng thái rộng lớn**: tác tử hoạt động trong một môi trường tương tác có không gian trạng thái khổng lồ;
2. **Chính sách có độ linh hoạt cao**: chính sách học được có độ linh hoạt cao, giúp tác tử có thể tương tác với đủ loại đối tượng trong môi trường;
3. **Tính bất định trong cảm nhận môi trường**: tác tử không thể quan sát đầy đủ trạng thái bên trong và động lực học vật lý của thế giới bên ngoài, tức là cảm nhận của nó về môi trường (ví dụ ảnh thô) thường có tính bất định khá lớn.

Ví dụ, **Minecraft** là một trò chơi thế giới mở điển hình, phù hợp với các đặc tính trên.

Dựa trên những tiến bộ gần đây trong lĩnh vực điều khiển thị giác (visual control), mục tiêu của việc ra quyết định trong thế giới mở là huấn luyện tác tử chỉ dựa trên quan sát thị giác nhiều chiều để tiến gần đến trí tuệ cấp độ con người. Tuy nhiên, điều này cũng mang lại nhiều thách thức. Ví dụ trong nhiệm vụ Minecraft:
- Các phương pháp dựa trên API cấp cao (như Voyager) điều khiển cấp cao bằng API riêng của môi trường, không phù hợp với thiết lập điều khiển thị giác tiêu chuẩn, hạn chế khả năng tổng quát hóa và phạm vi áp dụng.
- Các phương pháp học tăng cường không mô hình (như DECKARD) thiếu hiểu biết về cơ chế nền tảng của môi trường, chủ yếu dựa vào khám phá thử-và-sai tốn kém, dẫn đến hiệu suất sử dụng mẫu thấp, hiệu quả khám phá kém.
- Các phương pháp học tăng cường có mô hình (như DreamerV3) tuy nâng cao hiệu quả mẫu, nhưng vì chỉ dựa vào kinh nghiệm ngắn hạn để tối ưu chính sách, tác tử thể hiện vấn đề "thiển cận", khó khám phá dài hạn một cách hiệu quả.

Để nâng cao hiệu quả học hành vi trong quá trình học tăng cường có mô hình, chúng tôi đề xuất một phương pháp mới — LS-Imagine. Cốt lõi của phương pháp này là **giúp mô hình thế giới mô phỏng hiệu quả ảnh hưởng dài hạn của một hành vi cụ thể, mà không cần dự đoán từng bước lặp đi lặp lại**.

<figure style="text-align: center;">
  <img src="https://notes.sjtu.edu.cn/uploads/upload_e6f68aa4966902c40be894bca5146eae.gif" alt="Intro" width="800">
  <figcaption style="font-size: 14px; color: gray;">Hình 1: Khung tổng thể của LS-Imagine</figcaption>
</figure>

Như *hình 1*, cốt lõi của LS-Imagine là huấn luyện một **mô hình thế giới dài-ngắn hạn** (Long Short-Term World Model), kết hợp thông tin hướng dẫn riêng cho nhiệm vụ ở giai đoạn học biểu diễn (representation learning). Sau khi huấn luyện, mô hình thế giới có thể thực hiện **chuyển trạng thái tức thời** và **chuyển trạng thái nhảy cóc**, đồng thời sinh ra phần thưởng nội tại (intrinsic reward) tương ứng, từ đó tối ưu chính sách trong **không gian kết hợp của tưởng tượng ngắn hạn và dài hạn**. Chuyển trạng thái nhảy cóc giúp tác tử bỏ qua các trạng thái trung gian, mô phỏng trực tiếp trạng thái tương lai liên quan đến nhiệm vụ $s_{t+H}$ trong một bước tưởng tượng, thúc đẩy tác tử khám phá các hành vi có thể mang lại lợi tức dài hạn có lợi.

Tuy nhiên, phương pháp này dẫn đến một vấn đề kinh điển "con gà hay quả trứng có trước":
> **Nếu không có dữ liệu thực cho thấy tác tử đã đạt được mục tiêu, làm sao ta huấn luyện hiệu quả mô hình để mô phỏng việc chuyển nhảy cóc từ trạng thái hiện tại đến trạng thái tương lai liên quan cao đến mục tiêu?**

Để giải quyết vấn đề này, chúng tôi liên tục thực hiện thao tác **phóng to** (Zoom in) trên một vùng cụ thể của ảnh quan sát để mô phỏng các khung hình video quan sát liên tiếp khi tác tử tiến gần vùng đó, và **đánh giá mức độ liên quan** giữa đoạn video này với mô tả văn bản của nhiệm vụ, từ đó sinh ra **bản đồ khả năng tương tác** để làm nổi bật các vùng then chốt tiềm năng liên quan đến nhiệm vụ trong quan sát. Trên cơ sở đó, thông qua tương tác với môi trường, chúng tôi thu thập các cặp ảnh quan sát từ các bước thời gian kề nhau cùng các cặp ảnh cách nhau khoảng thời gian dài làm tập dữ liệu, huấn luyện các nhánh cụ thể của mô hình thế giới, giúp nó có thể thực hiện **chuyển trạng thái tức thời** và **chuyển trạng thái nhảy cóc**. Sau khi huấn luyện xong mô hình thế giới, chúng tôi dựa trên mô hình thế giới để sinh ra một loạt **chuỗi trạng thái ẩn tưởng tượng**, tối ưu chính sách của tác tử. Trong quá trình ra quyết định, có thể nhờ chuyển trạng thái nhảy cóc để trực tiếp ước lượng lợi tức dài hạn, từ đó tăng cường khả năng ra quyết định của tác tử.

## 2. Điểm đổi mới và đóng góp chính

Chúng tôi đề xuất một phương pháp học tăng cường có mô hình mới, có thể đồng thời thực hiện chuyển trạng thái tức thời và chuyển trạng thái nhảy cóc, và áp dụng chúng vào học hành vi, để nâng cao hiệu quả khám phá của tác tử trong thế giới mở.

LS-Imagine mang lại bốn đóng góp cụ thể sau:

> 1. Kiến trúc mô hình thế giới kết hợp dài-ngắn hạn;
> 2. Một phương pháp sinh bản đồ khả năng tương tác bằng cách mô phỏng quá trình khám phá thông qua phóng to ảnh;
> 3. Cơ chế phần thưởng nội tại mới dựa trên bản đồ khả năng tương tác;
> 4. Một phương pháp học hành vi cải tiến, phương pháp này kết hợp ước lượng giá trị dài hạn, và chạy trên chuỗi tưởng tượng hỗn hợp dài-ngắn hạn.

## 3. Phương pháp

LS-Imagine gồm các bước thuật toán then chốt sau:

### 1. Tính bản đồ khả năng tương tác

Như *hình 2*, để sinh bản đồ khả năng tương tác, chúng tôi **mô phỏng và đánh giá quá trình khám phá của tác tử** trong điều kiện **không dựa vào quỹ đạo thành công thực**.

<figure style="text-align: center;">
  <img src="https://notes.sjtu.edu.cn/uploads/upload_a091520394b81365d574618755a4dfd5.gif" alt="Affordance" width="800">
  <figcaption style="font-size: 14px; color: gray;">Hình 2: Quá trình tính bản đồ khả năng tương tác</figcaption>
</figure>

Cụ thể, với một khung ảnh quan sát đơn, chúng tôi dùng một khung giới hạn trượt (sliding bounding box) quét toàn bộ ảnh quan sát từ trái sang phải, từ trên xuống dưới. Với mỗi vị trí của khung giới hạn trượt, chúng tôi cắt ra 16 ảnh bắt đầu từ ảnh gốc, thu hẹp trường nhìn để tập trung vào vùng của khung giới hạn, và co giãn lại về kích thước ảnh gốc, được 16 khung hình liên tiếp dùng để mô phỏng sự thay đổi thị giác khi tác tử di chuyển về phía vùng mà khung giới hạn chỉ ra.

Sau đó, chúng tôi dùng mô hình MineCLIP đã được tiền huấn luyện để đánh giá mức độ liên quan giữa video khám phá mô phỏng và mô tả văn bản của nhiệm vụ, dùng nó làm giá trị khám phá tiềm năng của vùng đó. Khi khung giới hạn trượt quét xong toàn bộ ảnh, chúng tôi hợp nhất giá trị liên quan của tất cả các vị trí khung giới hạn, từ đó sinh ra một bản đồ khả năng tương tác hoàn chỉnh, cung cấp hướng dẫn cho việc khám phá của tác tử.

### 2. Sinh nhanh bản đồ khả năng tương tác

Quá trình tính bản đồ khả năng tương tác ở bước 1 trên liên quan đến việc duyệt cửa sổ trên diện rộng, và tính toán bằng mô hình căn chỉnh video-văn bản đã tiền huấn luyện cho mỗi vị trí cửa sổ. Phương pháp này có khối lượng tính toán lớn, tốn thời gian, khiến nó khó áp dụng cho nhiệm vụ thời gian thực. Vì vậy, chúng tôi thiết kế một kiến trúc U-Net đa phương thức (multimodal) dựa trên Swin-Unet, và dùng phương pháp tính bản đồ khả năng tương tác dựa trên khám phá ảo nói trên để gán nhãn dữ liệu làm tín hiệu giám sát, huấn luyện kiến trúc U-Net đa phương thức này, giúp nó có thể như *hình 3*, ở mỗi bước thời gian dùng quan sát thị giác và chỉ thị ngôn ngữ để sinh bản đồ khả năng tương tác một cách hiệu quả.

<figure style="text-align: center;">
  <img src="https://notes.sjtu.edu.cn/uploads/upload_640edca6ff9490db215e621936cda834.png" alt="UNet" width="600">
  <figcaption style="font-size: 14px; color: gray;">Hình 3: Dùng U-Net đa phương thức để sinh bản đồ khả năng tương tác hiệu quả</figcaption>
</figure>

### 3. Tính phần thưởng nội tại theo bản đồ khả năng tương tác và đánh giá sự cần thiết của chuyển trạng thái nhảy cóc

Như *hình 4*, để tận dụng tri thức tiên nghiệm liên quan đến nhiệm vụ mà bản đồ khả năng tương tác cung cấp, chúng tôi tính trung bình của tích từng phần tử giữa bản đồ khả năng tương tác với ma trận Gauss hai chiều cùng kích thước, và dùng nó làm phần thưởng nội tại hướng khả năng tương tác (affordance-driven intrinsic reward). Phần thưởng này có thể khuyến khích tác tử liên tục tiến gần mục tiêu và căn chỉnh mục tiêu vào trung tâm góc nhìn.

<figure style="text-align: center;">
  <img src="https://notes.sjtu.edu.cn/uploads/upload_683addb53cad561141585afd7c259701.png" alt="Intrinsic" width="360">
  <figcaption style="font-size: 14px; color: gray;">Hình 4: Cách tính phần thưởng nội tại hướng khả năng tương tác</figcaption>
</figure>

Ngoài ra, để đánh giá sự cần thiết của chuyển nhảy cóc trong quá trình tưởng tượng, chúng tôi đưa vào một cờ nhảy (jumping flag). Như *hình 5*, khi trong quan sát của tác tử xuất hiện mục tiêu liên quan đến nhiệm vụ ở khoảng cách xa, trên bản đồ khả năng tương tác sẽ thể hiện là vùng giá trị cao tập trung cao độ, điều này cũng làm độ nhọn (kurtosis) của bản đồ khả năng tương tác tăng đáng kể. Trong trường hợp này, tác tử nên dùng chuyển trạng thái nhảy cóc (còn gọi là chuyển dài hạn), để đến vùng mục tiêu một cách hiệu quả.

<figure style="text-align: center;">
  <img src="https://notes.sjtu.edu.cn/uploads/upload_8c0cb4bbb7171d1315b62f4c8f7f1e3a.png" alt="jp_flag" width="480">
  <figcaption style="font-size: 14px; color: gray;">Hình 5: Đánh giá sự cần thiết của chuyển trạng thái nhảy cóc</figcaption>
</figure>

### 4. Mô hình thế giới dài-ngắn hạn

Trong LS-Imagine, mô hình thế giới cần có thể đồng thời hỗ trợ chuyển trạng thái tức thời (chuyển trạng thái ngắn hạn) và chuyển trạng thái nhảy cóc (chuyển trạng thái dài hạn). Vì vậy, như *hình 6 (a)*, chúng tôi thiết kế hai nhánh ngắn hạn và dài hạn trong mô hình chuyển trạng thái, mô hình chuyển trạng thái ngắn hạn kết hợp trạng thái và hành động ở thời điểm hiện tại để thực hiện chuyển trạng thái tức thời một bước nhằm dự đoán trạng thái ở bước thời gian kề tiếp theo; mô hình chuyển dài hạn thì mô phỏng chuyển trạng thái nhảy cóc hướng mục tiêu, dẫn dắt tác tử nhanh chóng tưởng tượng việc khám phá hướng đến mục tiêu. Tác tử có thể dựa vào trạng thái hiện tại để quyết định dùng loại chuyển nào, và dự đoán trạng thái tiếp theo bằng nhánh chuyển đã chọn.

<figure style="text-align: center;">
  <img src="https://notes.sjtu.edu.cn/uploads/upload_7aba677832aaeecff96e1a91a0f9932b.png" alt="jp_flag" width="800">
  <figcaption style="font-size: 14px; color: gray;">Hình 6: Kiến trúc mô hình thế giới dài-ngắn hạn và học hành vi dựa trên tưởng tượng dài-ngắn hạn</figcaption>
</figure>

Khác với kiến trúc mô hình thế giới truyền thống, chúng tôi đặc biệt thiết kế bộ dự đoán nhảy (Jump predictor) để dựa vào trạng thái hiện tại đánh giá nên thực hiện loại chuyển nào; đồng thời, với chuyển trạng thái nhảy cóc, chúng tôi thiết kế bộ dự đoán khoảng (Interval predictor) để ước lượng số bước thời gian môi trường cách nhau giữa trạng thái trước và sau khi nhảy $\hat {\Delta}_t^\prime$ cùng phần thưởng chiết khấu tích lũy trong khoảng đó $\hat G_t^\prime$, chúng sẽ được dùng để ước lượng lợi tức dài hạn trong việc học hành vi tiếp theo. Ngoài ra, chúng tôi còn đưa bản đồ khả năng tương tác $\mathcal{M}_t$ làm đầu vào của bộ mã hóa (encoder), nó có thể cung cấp cho tác tử hướng dẫn tiên nghiệm dựa trên mục tiêu, để nâng cao hiệu quả của quá trình ra quyết định.

Trên cơ sở kiến trúc này, tác tử tương tác với môi trường và thu thập dữ liệu mới, có được các cặp mẫu ở các bước thời gian kề nhau ứng với chuyển trạng thái ngắn hạn, và dựa vào bản đồ khả năng tương tác để mô hình hóa các cặp mẫu cách nhau khoảng thời gian dài ứng với chuyển trạng thái dài hạn. Chúng tôi dùng các dữ liệu này để cập nhật bộ đệm phát lại (replay buffer) và lấy mẫu dữ liệu từ đó để huấn luyện mô hình thế giới dài-ngắn hạn.

### 5. Học hành vi trên chuỗi tưởng tượng dài-ngắn hạn

Như *hình 6 (b)*, LS-Imagine dùng **thuật toán diễn viên-nhà phê bình (actor-critic)**, học hành vi thông qua chuỗi trạng thái tiềm ẩn do mô hình thế giới dự đoán. Trong đó, mục tiêu của diễn viên (actor) là tối ưu chính sách để tối đa hóa phần thưởng tích lũy chiết khấu $R_t$, còn vai trò của nhà phê bình (critic) là ước lượng phần thưởng tích lũy chiết khấu của mỗi trạng thái dựa trên chính sách hiện tại.

<figure style="text-align: center;">
  <img src="https://notes.sjtu.edu.cn/uploads/upload_f97361fef42f533d4d71c44ce522febb.png" alt="jp_flag" width="800">
  <figcaption style="font-size: 14px; color: gray;">Hình 7: Chọn động việc dùng mô hình chuyển dài hạn hoặc mô hình chuyển ngắn hạn để dự đoán chuỗi tưởng tượng dài-ngắn hạn</figcaption>
</figure>

Như *hình 7*, xuất phát từ trạng thái ban đầu được mã hóa từ quan sát được lấy mẫu và bản đồ khả năng tương tác, chúng tôi dựa vào cờ nhảy $\hat{j}_t$ do bộ dự đoán nhảy dự đoán để chọn động việc dùng mô hình chuyển trạng thái dài hạn hoặc ngắn hạn, để dự đoán các trạng thái tiếp theo. Trong chuỗi tưởng tượng dài-ngắn hạn có **phạm vi tưởng tượng $L$**, chúng tôi dùng các bộ dự đoán trong mô hình thế giới để dự đoán các thông tin như phần thưởng tương ứng với trạng thái $\hat{r}_t$, cờ tiếp tục (continue flag) $\hat{c}_t$, số bước thời gian môi trường cách nhau giữa các trạng thái kề nhau $\hat {\Delta}_t$ cùng phần thưởng chiết khấu tích lũy trong khoảng đó $\hat G_t$, và dùng bootstrap $\lambda$-returns cải tiến kết hợp tưởng tượng dài hạn và ngắn hạn để tính phần thưởng tích lũy chiết khấu của mỗi trạng thái:

$$
R_{t}^{\lambda} \doteq \begin{cases} 
\hat{c}_{t} \{\hat{G}_{t+1} + \gamma^{\hat{\Delta}_{t+1}} \left[ (1-\lambda) v_{\psi} (\hat{s}_{t+1}) + \lambda R_{t+1}^{\lambda} \right] \} & \text{if } t < L \\
v_{\psi} (\hat{s}_{L}) & \text{if } t = L
\end{cases},
$$

và dùng thuật toán diễn viên-nhà phê bình để học hành vi.

## 4. Kết quả thực nghiệm

Chúng tôi thực nghiệm trong môi trường trò chơi Minecraft để kiểm tra tác tử LS-Imagine. Chúng tôi thiết lập 5 nhiệm vụ mở như *bảng 1* để thực nghiệm:

<center><figcaption style="font-size: 14px; color: gray;">Bảng 1: Mô tả các nhiệm vụ Minecraft</figcaption></center>



<div style="display: flex; justify-content: center;">
    <table style="width: 60%; table-layout: fixed; border-collapse: collapse; text-align: center;">
      <colgroup>
        <col style="width: 40%;">
        <col style="width: 40%;">
        <col style="width: 20%;">
      </colgroup>
      <thead>
        <tr>
          <th style="border-bottom: 2px solid black; text-align: center;">Nhiệm vụ</th>
          <th style="border-bottom: 2px solid black; text-align: center;">Mô tả ngôn ngữ</th>
          <th style="border-bottom: 2px solid black; text-align: center;">Số bước tối đa</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Thu thập gỗ ở đồng bằng</td>
          <td>"Cut a tree."</td>
          <td>1000</td>
        </tr>
        <tr>
          <td>Dùng xô lấy nước</td>
          <td>"Obtain water."</td>
          <td>1000</td>
        </tr>
        <tr>
          <td>Thu thập cát</td>
          <td>"Obtain sand."</td>
          <td>1000</td>
        </tr>
        <tr>
          <td>Xén lông cừu</td>
          <td>"Obtain wool."</td>
          <td>1000</td>
        </tr>
        <tr>
          <td>Khai thác quặng sắt</td>
          <td>"Mine iron ore."</td>
          <td>2000</td>
        </tr>
      </tbody>
    </table>
</div>

Chúng tôi so sánh LS-Imagine với nhiều phương pháp như VPT, STEVE-1, PTGM, Director, DreamerV3, các chỉ số đánh giá gồm **tỉ lệ thành công hoàn thành nhiệm vụ trong số bước quy định** và **số bước tương tác trung bình cần để hoàn thành nhiệm vụ**. Kết quả thực nghiệm như *hình 8*, *hình 9* và *bảng 2*.


<figure style="text-align: center;">
  <img src="https://notes.sjtu.edu.cn/uploads/upload_1cabaf4f93530a8d62d654621c2b7aef.png" alt="jp_flag" width="800">
  <figcaption style="font-size: 14px; color: gray;">Hình 8: So sánh tỉ lệ thành công trên các nhiệm vụ</figcaption>
</figure>

<figure style="text-align: center;">
  <img src="https://notes.sjtu.edu.cn/uploads/upload_720f53ae4b1740b1da34c270de4694bc.png" alt="jp_flag" width="800">
  <figcaption style="font-size: 14px; color: gray;">Hình 9: So sánh số bước tương tác cần để hoàn thành các nhiệm vụ</figcaption>
</figure>

<center><figcaption style="font-size: 14px; color: gray;">Bảng 2: Kết quả số của tỉ lệ thành công và số bước tương tác cần để hoàn thành nhiệm vụ</figcaption></center>
<div align="center">
<table>
  <thead>
    <tr>
      <th rowspan="2">Model</th>
      <th colspan="2">Thu thập gỗ ở đồng bằng</th>
      <th colspan="2">Dùng xô lấy nước</th>
      <th colspan="2">Thu thập cát</th>
      <th colspan="2">Xén lông cừu</th>
      <th colspan="2">Khai thác quặng sắt</th>
    </tr>
    <tr>
      <th>succ. (%)</th>
      <th>succ. step</th>
      <th>succ. (%)</th>
      <th>succ. step</th>
      <th>succ. (%)</th>
      <th>succ. step</th>
      <th>succ. (%)</th>
      <th>succ. step</th>
      <th>succ. (%)</th>
      <th>succ. step</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>VPT</td>
      <td>6.97</td>
      <td>963.32</td>
      <td>0.61</td>
      <td>987.65</td>
      <td>12.99</td>
      <td>880.54</td>
      <td>1.94</td>
      <td>987.49</td>
      <td>0.00</td>
      <td>—</td>
    </tr>
    <tr>
      <td>STEVE-1</td>
      <td>57.00</td>
      <td>752.47</td>
      <td>6.00</td>
      <td>989.07</td>
      <td>37.00</td>
      <td>770.40</td>
      <td>3.00</td>
      <td>992.36</td>
      <td>0.00</td>
      <td>—</td>
    </tr>
    <tr>
      <td>PTGM</td>
      <td>41.86</td>
      <td>811.19</td>
      <td>2.78</td>
      <td>977.78</td>
      <td>17.71</td>
      <td>833.64</td>
      <td>21.54</td>
      <td>887.03</td>
      <td>15.14</td>
      <td><b>1586.03</b></td>
    </tr>
    <tr>
      <td>Director</td>
      <td>8.67</td>
      <td>968.09</td>
      <td>20.90</td>
      <td>931.74</td>
      <td>36.36</td>
      <td>825.35</td>
      <td>1.27</td>
      <td>995.99</td>
      <td>7.82</td>
      <td>1906.31</td>
    </tr>
    <tr>
      <td>DreamerV3</td>
      <td>53.33</td>
      <td>711.22</td>
      <td>55.72</td>
      <td>628.79</td>
      <td>59.88</td>
      <td><b>548.76</b></td>
      <td>25.13</td>
      <td>841.14</td>
      <td>16.79</td>
      <td>1789.06</td>
    </tr>
    <tr>
      <td><b>LS-Imagine</b></td>
      <td><b>80.63</b></td>
      <td><b>503.35</b></td>
      <td><b>77.31</b></td>
      <td><b>502.61</b></td>
      <td><b>62.68</b></td>
      <td>601.18</td>
      <td><b>54.28</b></td>
      <td><b>633.78</b></td>
      <td><b>20.28</b></td>
      <td>1748.55</td>
    </tr>
  </tbody>
</table>
</div>

Chúng tôi phát hiện, **LS-Imagine** vượt trội rõ rệt so với các mô hình so sánh, đặc biệt trong **các kịch bản nhiệm vụ có mục tiêu phân bố thưa**, ưu thế của nó càng rõ ràng hơn.

Đồng thời, trong *hình 10* chúng tôi trình bày kết quả trực quan hóa ảnh quan sát và bản đồ khả năng tương tác được tái tạo dựa trên chuỗi trạng thái tưởng tượng dài-ngắn hạn. Trong đó hàng thứ nhất hiển thị **trạng thái tiềm ẩn trước và sau khi chuyển trạng thái nhảy cóc, và giải mã chúng về không gian điểm ảnh**, để thể hiện trực quan sự thay đổi trạng thái; hàng thứ hai trực quan hóa **bản đồ khả năng tương tác được tái tạo từ trạng thái tiềm ẩn**, để hiểu rõ hơn bản đồ khả năng tương tác thúc đẩy chuyển trạng thái nhảy cóc như thế nào, và liệu chúng có cung cấp hướng dẫn hướng mục tiêu hiệu quả hay không; hàng cuối cùng **phủ bản đồ khả năng tương tác lên ảnh quan sát được tái tạo theo cách chồng trong suốt**, từ đó làm nổi bật trực quan hơn vùng mà tác tử chú ý.

<figure style="text-align: center;">
  <img src="https://notes.sjtu.edu.cn/uploads/upload_1fbb8ad05b0fc85b35061e41fb057206.gif" alt="jp_flag" width="800">
  <figcaption style="font-size: 14px; color: gray;">Hình 10: Trực quan hóa chuỗi tưởng tượng dài-ngắn hạn</figcaption>
</figure>

Các kết quả trực quan hóa này cho thấy, mô hình thế giới dài-ngắn hạn của LS-Imagine có thể **tự thích nghi quyết định khi nào thực hiện tưởng tượng dài hạn dựa trên quan sát thị giác hiện tại**. Ngoài ra, bản đồ khả năng tương tác được sinh ra có thể **căn chỉnh hiệu quả với các vùng liên quan cao đến mục tiêu cuối cùng**, từ đó thúc đẩy tác tử thực hiện khám phá chính sách hiệu quả hơn.

Ngoài ra, vì phương pháp của chúng tôi dựa vào bản đồ khả năng tương tác để nhận diện vùng khám phá có giá trị cao, từ đó thực hiện nhảy trạng thái dài hạn, có người có thể cho rằng, nếu mục tiêu bị che khuất hoặc không nhìn thấy, phương pháp của chúng tôi sẽ thất bại. Để chứng minh **phương pháp sinh bản đồ khả năng tương tác của chúng tôi không chỉ là một thuật toán nhận diện mục tiêu, và không chỉ làm nổi bật vùng liên quan khi mục tiêu nhìn thấy được**, chúng tôi trình bày trong *hình 11* ví dụ về bản đồ khả năng tương tác được sinh ra khi mục tiêu bị che khuất hoặc không nhìn thấy.

<figure style="text-align: center;">
  <img src="https://notes.sjtu.edu.cn/uploads/upload_2781ce68ace8424ad9350dad8c929a65.png" width="800">
  <figcaption style="font-size: 14px; color: gray;">Hình 11: Bản đồ khả năng tương tác khi mục tiêu bị che khuất hoặc không nhìn thấy</figcaption>
</figure>

Nhờ mô hình MineCLIP được tiền huấn luyện trên lượng lớn video minh họa của chuyên gia, **phương pháp sinh bản đồ khả năng tương tác của chúng tôi có thể sinh ra bản đồ khả năng tương tác cung cấp hướng dẫn hiệu quả cho việc khám phá ngay cả khi mục tiêu bị che khuất hoàn toàn hoặc không nhìn thấy**. Ví dụ, như *hình 11(a)*, trong nhiệm vụ **tìm làng**, tuy ngôi làng không nhìn thấy trong quan sát hiện tại, bản đồ khả năng tương tác vẫn có thể cung cấp hướng khám phá rõ ràng, gợi ý tác tử khám phá về phía khu rừng bên phải hoặc vùng trống trải trên sườn đồi bên trái. Tương tự, trong **nhiệm vụ đào quặng** như *hình 11(b)*, tuy quặng thường nằm dưới lòng đất, bị che khuất trong quan sát hiện tại, bản đồ khả năng tương tác vẫn có thể chỉ dẫn tác tử đào vào bên trong khối núi bên phải hoặc đào xuống lòng đất phía trước. Các ví dụ này có thể chứng minh đầy đủ rằng, **ngay cả khi mục tiêu bị che khuất, bản đồ khả năng tương tác vẫn có thể giúp tác tử khám phá hiệu quả**.

## 5. Tổng kết

Công trình của chúng tôi đề xuất một phương pháp mới — LS-Imagine, nhằm khắc phục các thách thức gặp phải khi huấn luyện tác tử học tăng cường thị giác trong thế giới mở nhiều chiều. Thông qua việc mở rộng phạm vi tưởng tượng và tận dụng mô hình thế giới dài-ngắn hạn, LS-Imagine có thể khám phá chính sách hiệu quả trong không gian trạng thái khổng lồ. Ngoài ra, việc đưa vào chuyển trạng thái nhảy cóc dựa trên mục tiêu và bản đồ khả năng tương tác giúp tác tử hiểu tốt hơn giá trị dài hạn, từ đó nâng cao khả năng ra quyết định. Kết quả thực nghiệm cho thấy, trong môi trường Minecraft, LS-Imagine đạt được sự cải thiện hiệu năng đáng kể so với các phương pháp hiện có. Điều này không chỉ làm nổi bật tiềm năng của LS-Imagine trong học tăng cường thế giới mở, mà còn mang lại gợi ý mới cho các nghiên cứu tương lai trong lĩnh vực này.

Code, checkpoint, tài liệu cấu hình môi trường của bài báo đều được cung cấp, rất hoan nghênh mọi người star ⭐ trên GitHub và trích dẫn~

Link GitHub: https://github.com/qiwang067/LS-Imagine

Trích dẫn:

```bib
@inproceedings{li2025open,
    title={Open-World Reinforcement Learning over Long Short-Term Imagination}, 
    author={Jiajian Li and Qi Wang and Yunbo Wang and Xin Jin and Yang Li and Wenjun Zeng and Xiaokang Yang},
    booktitle={ICLR},
    year={2025}
}
```
