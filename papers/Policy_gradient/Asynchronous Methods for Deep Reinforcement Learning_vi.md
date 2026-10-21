## Asynchronous Methods for Deep Reinforcement Learning (Các phương pháp bất đồng bộ cho học tăng cường sâu)

Tác giả: Volodymyr Mnih, Adrià Puigdomènech Badia, Mehdi Mirza, Alex Graves, Tim Harley, Timothy P. Lillicrap, David Silver, Koray Kavukcuoglu

Đơn vị: Google DeepMind, Montreal Institute for Learning Algorithms (MILA), University of Montreal

Hội nghị: International Conference on Machine Learning (ICML 2016)

Địa chỉ bài báo: https://arxiv.org/abs/1602.01783

Đóng góp của bài báo: đề xuất một khung tối ưu gradient bất đồng bộ, có hiệu quả khá tốt trên nhiều loại thuật toán học tăng cường, trong đó hiệu quả tốt nhất là diễn viên-nhà phê bình lợi thế bất đồng bộ (Asynchronous advantage actor-critic, A3C).

- **Motivation (Why - Động cơ)**: kết hợp mạng nơ-ron với thuật toán học tăng cường có thể giúp thuật toán hiệu quả hơn, nhưng tính ổn định khá kém. Cách làm thông thường là dùng phát lại kinh nghiệm để loại bỏ tương quan của dữ liệu, giúp huấn luyện ổn định hơn. Nhưng phương pháp này có hai nhược điểm: một là cần khá nhiều bộ nhớ và sức tính toán, hai là chỉ áp dụng được cho thuật toán học tăng cường off-policy (khác chính sách).
- **Main Idea (What - Ý tưởng chính)**: bài báo đề xuất dùng phương pháp song song bất đồng bộ thay cho kỹ thuật phát lại kinh nghiệm, phương pháp này không chỉ loại bỏ được tương quan dữ liệu, cần ít tài nguyên hơn, mà còn có thể áp dụng cho nhiều loại phương pháp học tăng cường.



### Asynchronous RL Framework (Kiến trúc học tăng cường bất đồng bộ)

Bài báo áp dụng kiến trúc bất đồng bộ cho bốn thuật toán học tăng cường: Sarsa một bước, Q-learning một bước, Q-learning $n$ bước và diễn viên-nhà phê bình lợi thế (advantage actor-critic, A2C). Ở đây có thể thấy kiến trúc này áp dụng được cho cả thuật toán học tăng cường on-policy/off-policy, dựa trên giá trị/dựa trên chính sách.

Khung bất đồng bộ có hai đặc điểm lớn:

1. Chỉ dùng một máy có CPU nhiều nhân, không cần GPU. Cách này có thể giảm chi phí truyền thông giữa các máy, và có thể huấn luyện theo cách Hogwild!.
2. Nhiều tác nhân hành động (actor/worker) song song có thể dùng các chính sách khác nhau để tương tác với môi trường, giảm tính tương quan của dữ liệu nên không cần kỹ thuật phát lại kinh nghiệm, điều này giúp khung có thể dùng cho phương pháp on-policy, và thời gian huấn luyện có quan hệ gần tuyến tính với số tác nhân hành động.

Trước tiên nói về Hogwild!, đây là cốt lõi của khung, bạn nào chưa rõ có thể tham khảo [bài giảng trên Zhihu](https://zhuanlan.zhihu.com/p/30826161), hình dưới lấy từ bài đó:

![image-20221109221145358](https://gitee.com/xyfcw/CloudPictures/raw/master/img/image-20221109221145358.png)

Lấy một ví dụ: giả sử mạng có 100 tham số, gradient do worker $i$ gửi đến cập nhật được 40 tham số thì gradient do worker $j$ gửi đến đã bắt đầu cập nhật, khi $i$ cập nhật xong thì một số tham số phía trước đã bị $j$ ghi đè, nhưng không sao, $i$ cập nhật xong vẫn đồng bộ tham số sau cập nhật hiện tại cho $i$ như thường, đây chính là ý nghĩa của bất đồng bộ.

Tiếp theo giới thiệu bốn thuật toán bất đồng bộ:

#### Asynchronous one-step Q-learning (Q-learning một bước bất đồng bộ)

![image-20230113230006360](https://gitee.com/xyfcw/CloudPictures/raw/master/img/image-20230113230006360.png)

- $\theta$ và $\theta^-$ được dùng chung, bất kỳ luồng nào cũng có thể sửa
- Tích lũy gradient là một mẹo để tăng batch size, và có thể giảm cơ hội ghi đè lên cập nhật của các luồng khác (tần suất cập nhật giảm)
- $I_{target}$ là khoảng cách giữa các lần đồng bộ tham số của hai mạng
- $I_{AsyncUpdate}$ là khoảng cách giữa các lần luồng cập nhật tham số dùng chung $\theta$

#### Asynchronous one-step Sarsa (Sarsa một bước bất đồng bộ)

So với Q-learning một bước bất đồng bộ ở trên, chỉ có giá trị mục tiêu (target value) đổi thành $r+\gamma Q(s^\prime,a^\prime;\theta^\prime)$, các phần còn lại giống nhau.

#### Asynchronous n-step Q-learning (Q-learning n bước bất đồng bộ)

![image-20230113231647918](https://gitee.com/xyfcw/CloudPictures/raw/master/img/image-20230113231647918.png)

- Nhược điểm của phương pháp một bước là $r$ chỉ ảnh hưởng trực tiếp đến giá trị $Q(s,a)$ dẫn đến việc sinh ra $r$, các giá trị $Q$ khác bị ảnh hưởng gián tiếp. $r$ có được từ phương pháp $n$ bước có thể ảnh hưởng đến giá trị $Q$ của $n$ bước phía trước, điều này giúp việc cập nhật giá trị $Q$ thông qua $r$ hiệu quả hơn. Phần thực nghiệm phía sau có so sánh hai cách.
- So với phương pháp một bước thì có thêm tham số riêng của luồng $\theta^{\prime}$, tham số này được dùng khi chọn hành động và tính gradient, không bị ảnh hưởng bởi các luồng khác, có thể giúp huấn luyện ổn định hơn.

#### Asynchronous advantage actor-critic (A3C)

![image-20221109234156910](https://gitee.com/xyfcw/CloudPictures/raw/master/img/202211092341970.png)

- Dùng chung tham số của hai mạng diễn viên, nhà phê bình, mỗi luồng cũng có tham số riêng của mình, phần còn lại về cơ bản giống Q-learning $n$ bước



### Thực nghiệm

#### Trò chơi Atari

So sánh tốc độ huấn luyện của thuật toán trên 5 trò chơi Atari:

![image-20221110000219965](https://gitee.com/xyfcw/CloudPictures/raw/master/img/202211100002021.png)

- DQN dùng GPU K40, phương pháp bất đồng bộ dùng CPU 16 nhân, có thể thấy bất đồng bộ tốt hơn DQN, và phương pháp $n$ bước tốt hơn phương pháp một bước, A3C tốt hơn rõ rệt các thuật toán khác.

So sánh hiệu năng thuật toán trên 57 trò chơi Atari:

![image-20230114134153685](https://gitee.com/xyfcw/CloudPictures/raw/master/img/image-20230114134153685.png)

- So sánh A3C với một số thuật toán tốt nhất trên trò chơi Atari lúc đó, có thể thấy hiệu năng của A3C huấn luyện 4 ngày mạnh hơn mức của các thuật toán khác huấn luyện 8 ngày.

#### TORCS Car Racing Simulator (Bộ mô phỏng đua xe TORCS)

Kiểm tra hiệu năng thuật toán bất đồng bộ trong môi trường đua xe khó hơn trò chơi Atari:

![image-20230114134919316](https://gitee.com/xyfcw/CloudPictures/raw/master/img/image-20230114134919316.png)

- Có thể thấy A3C cũng tốt hơn rõ rệt các thuật toán khác.

#### Continuous Action Control Using the MuJoCo Physics Simulator (Điều khiển hành động liên tục bằng bộ mô phỏng vật lý MuJoCo)

Kiểm tra hiệu năng của A3C với các nhiệm vụ có hành động-trạng thái liên tục trong môi trường Mujoco:

![image-20230114145118141](https://gitee.com/xyfcw/CloudPictures/raw/master/img/image-20230114145118141.png)

- Trên tuyệt đại đa số nhiệm vụ, A3C đều thể hiện rất tốt khi tốc độ học (learning rate) thay đổi trong phạm vi rộng.

#### Labyrinth (Mê cung)

Đây là một môi trường mê cung 3D, mỗi lượt (episode) đều sinh ngẫu nhiên một mê cung, trong mê cung có táo và cửa, tác tử tìm được một quả táo được 1 điểm, tìm được cửa được 10 điểm. Sau khi tìm được cửa, tác tử sẽ bị đặt ngẫu nhiên vào một chỗ bất kỳ trong mê cung, và các quả táo đã tìm được trước đó sẽ được sinh lại. Mỗi lượt kéo dài 60 giây, kết thúc thì lượt mới bắt đầu lại.

Môi trường này cần tác tử tìm được một chính sách tổng quát, vì mỗi lượt mê cung đều khác nhau, điều này là thách thức khá lớn với tác tử, nhưng sau khi huấn luyện A3C tác giả phát hiện thuật toán này có thể đạt hiệu quả rất tốt.

#### Scalability and Data Efficiency (Khả năng mở rộng và hiệu quả dữ liệu)

Kiểm tra trên trò chơi Atari xem thời gian huấn luyện và hiệu quả dữ liệu của thuật toán thay đổi thế nào theo số luồng:

![image-20230114151851212](https://gitee.com/xyfcw/CloudPictures/raw/master/img/image-20230114151851212.png)

- Tác giả đề xuất lấy thời gian một luồng đạt một điểm số cố định chia cho thời gian $n$ luồng đạt điểm số đó, để đo mức tăng tốc của thuật toán khi tăng số luồng. Kết quả cho thấy tốc độ huấn luyện tăng theo số luồng, chứng minh khung bất đồng bộ có thể tận dụng tốt tài nguyên huấn luyện.

#### Robustness and Stability (Tính bền vững và tính ổn định)

Kiểm tra tính bền vững và tính ổn định của các thuật toán bất đồng bộ trên 5 trò chơi Atari:

A3C:

![image-20230114164256003](https://gitee.com/xyfcw/CloudPictures/raw/master/img/image-20230114164256003.png)

Ba thuật toán bất đồng bộ còn lại:

![image-20230114164313044](https://gitee.com/xyfcw/CloudPictures/raw/master/img/image-20230114164313044.png)

- Kết quả cho thấy tất cả các thuật toán đều có tính bền vững và tính ổn định khá tốt khi tốc độ học thay đổi trong phạm vi rộng.



### Tổng kết

Khung bất đồng bộ có mấy ưu điểm lớn:

- Hiệu quả tốt đồng thời cần ít tài nguyên
- Có thể áp dụng cho nhiều loại thuật toán học tăng cường như on-policy, off-policy
- Hiệu suất sử dụng dữ liệu cao, tính ổn định khá tốt
- Có thể kết hợp rộng rãi ưu điểm của các thuật toán khác để nâng cao hiệu năng



### Tài liệu tham khảo

- [Hogwild!: A Lock-Free Approach to Parallelizing Stochastic Gradient Descent](https://arxiv.org/abs/1106.5730)

- [Bài giảng trên Zhihu](https://zhuanlan.zhihu.com/p/310608740)
- [Bài giảng trên Zhihu](https://zhuanlan.zhihu.com/p/136823256)



Tác giả: Wang Cong (汪聪)

Đơn vị: Đại học Kỹ thuật Vũ Hán

Hướng nghiên cứu: trò chơi máy (machine game playing), học tăng cường

Liên hệ: xyfcw@qq.com
