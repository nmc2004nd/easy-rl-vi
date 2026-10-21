# Chương 10 Phần thưởng thưa

## Từ khóa

- **Thiết kế phần thưởng (reward shaping)**: khi tác tử tương tác với môi trường, con người thiết kế một số phần thưởng, từ đó "chỉ huy" tác tử, cho nó biết thực hiện hành động nào là tối ưu. Cần chú ý rằng phần thưởng này khác với phần thưởng của môi trường. Nó có thể nâng cao độ chính xác khi ta ước lượng hàm Q.

- **Mô-đun tò mò nội tại (intrinsic curiosity module, ICM)**: đại diện cho hàm phần thưởng sau khi thêm hàm phần thưởng mới trong kỹ thuật hướng tò mò (curiosity driven).

- **Học theo giáo trình (curriculum learning)**: một phương pháp tổng quát dùng trong học tăng cường để huấn luyện tác tử, khi đưa dữ liệu huấn luyện vào, nó đưa vào theo thứ tự từ dễ đến khó, cũng có thể do con người thiết kế quá trình học của nó. Phương pháp này được dùng phổ biến trong học máy và học tăng cường.

- **Học theo giáo trình ngược (reverse curriculum learning)**: so với học theo giáo trình, học theo giáo trình ngược là phương pháp tổng quát hơn. Nó bắt đầu từ trạng thái lý tưởng nhất cuối cùng [ta gọi là trạng thái đích (goal state)], lần lượt tìm các trạng thái gần trạng thái đích nhất làm trạng thái "lý tưởng" theo từng giai đoạn mà ta muốn tác tử đạt được. Tất nhiên, trong quá trình này ta sẽ cố ý bỏ đi một số trạng thái cực đoan, tức là các trạng thái quá dễ, quá khó. Tóm lại, học theo giáo trình ngược là phương pháp suy ngược từ trạng thái đích.

- **Học tăng cường phân cấp (hierarchical reinforcement learning)**: phân rã một nhiệm vụ lớn theo chiều ngang hoặc chiều dọc thành các nhiệm vụ con do nhiều tác tử thực hiện. Trong đó, một số tác tử phụ trách các nhiệm vụ cấp cao hơn, như phụ trách đặt mục tiêu, đặt xong mục tiêu thì giao mục tiêu cho các tác tử khác thực hiện.


## Bài tập

**10-1** Có những phương pháp nào để giải quyết phần thưởng thưa?

Thiết kế phần thưởng, phần thưởng hướng tò mò, học theo giáo trình, học theo giáo trình ngược, học tăng cường phân cấp,...

**10-2** Thiết kế phần thưởng có vấn đề chính gì?

Vấn đề chính là phần thưởng do con người thiết kế cần tri thức chuyên ngành (domain knowledge), cần ta tự thiết kế ra các phần thưởng giúp môi trường và tác tử tương tác tốt hơn, điều này cần không ít kinh nghiệm và tri thức, và cần ta điều chỉnh dựa vào hiệu quả thực tế.

**10-3** Mô-đun tò mò nội tại là gì? Ta nên thiết kế mô-đun tò mò nội tại như thế nào?

Mô-đun tò mò nội tại đại diện cho hàm phần thưởng sau khi thêm hàm phần thưởng mới trong kỹ thuật hướng tò mò. Cụ thể, khi cập nhật và tính toán nó sẽ xét 3 phần mới, lần lượt là trạng thái $s_1$, hành động $a_1$ và trạng thái $s_2$. Dựa vào $s_1$, $a_1$, $s_2$, nó đưa ra một phần thưởng mới khác $r_1^i$. Vì vậy trong mô-đun tò mò nội tại, tổng phần thưởng của ta không chỉ có $r$, mà còn có $r^i$. Nó không chỉ cộng tất cả các $r$, mà còn cộng tất cả các $r^i$ để cùng làm tổng phần thưởng. Vì vậy, tác tử dựa trên mô-đun tò mò nội tại khi tương tác với môi trường không chỉ mong $r$ càng lớn càng tốt, mà đồng thời mong $r^i$ càng lớn càng tốt, mong tổng phần thưởng nhận được từ mô-đun tò mò nội tại càng lớn càng tốt.

> Ghi chú của người dịch: bản gốc viết "dựa vào $s_1$, $a_1$, $a_2$"; theo câu trước và chương chính, đầu vào thứ ba là trạng thái $s_2$, nên bản dịch đã sửa.

Về cách thiết kế mô-đun tò mò nội tại, đầu vào của nó như đã nói ở trên, gồm 3 phần, tức trạng thái hiện tại $s_1$, hành động thực hiện ở trạng thái này $a_1$, trạng thái tiếp theo $s_{t+1}$, đầu ra tương ứng là phần thưởng $r_1^i$. Ánh xạ giữa đầu vào và đầu ra được xây dựng bằng một mạng, nó dùng trạng thái $s_1$ và hành động $a_1$ để dự đoán trạng thái tiếp theo $\hat{s}_{t+1}$, rồi tiếp tục đánh giá mức độ tương đồng giữa trạng thái dự đoán $\hat{s}_{t+1}$ và trạng thái thực $s_{t+1}$, càng không giống thì phần thưởng nhận được càng lớn. Nói dễ hiểu, phần thưởng này là: nếu trạng thái tương lai càng khó dự đoán, thì phần thưởng nhận được càng lớn. Đây chính là cơ chế tò mò, nó có xu hướng để tác tử làm một số hành động có rủi ro khá lớn, từ đó nâng cao khả năng khám phá của nó.

Đồng thời, để tăng cường thêm khả năng biểu diễn của mạng, ta thường tối ưu đầu vào của mô-đun tò mò nội tại thành trích xuất đặc trưng, đầu vào của bộ trích xuất đặc trưng (feature extractor) là trạng thái, đầu ra là một vectơ đặc trưng, nó có thể biểu diễn các đặc trưng chủ yếu và quan trọng nhất của trạng thái này, lọc bỏ những thứ vô nghĩa.
