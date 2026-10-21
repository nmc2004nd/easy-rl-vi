# Bảng đính chính bản in giấy

**Cách dùng bảng đính chính? Trước tiên tìm lần in của cuốn sách của bạn, tiếp theo đối chiếu lần in với bảng dưới đây, tất cả các mục đính chính từ lần in đó trở về sau đều là những chỗ cần lưu ý trong sách của bạn; tất cả các mục đính chính trước lần in đó đều đã được sửa trong lần in đó và các lần in sau. Để thuận tiện cho bạn đọc, tất cả nội dung sửa đổi đều được liệt kê ở đây. Trong đó một số sửa đổi là để bạn đọc dễ hiểu hơn, không phải nguyên văn bị sai.**

> Ghi chú của người dịch:
> - Số trang, số dòng, số hình, số công thức trong bảng này là của **sách in tiếng Trung** (蘑菇书 EasyRL, NXB Nhân dân Bưu điện), không trùng với bản web trong thư mục `docs/` cũng như bản dịch tiếng Việt.
> - Mỗi mục có dạng "nội dung cũ → nội dung mới". Phần lớn được dịch theo nghĩa; với những mục chỉ sửa câu chữ tiếng Trung (lỗi chữ, cách dùng từ), bản dịch giữ nguyên chữ Hán và ghi kèm nghĩa tiếng Việt, vì nếu chỉ dịch nghĩa thì không còn thấy được chỗ thay đổi.
> - Nhiều mục đính chính dưới đây đã được phản ánh trong bản web (và do đó trong bản dịch tiếng Việt). Một số lỗi vẫn còn trong bản web và đã được sửa kèm ghi chú trong bản dịch, ví dụ vectơ chuẩn hóa về trung bình 0 $[3,-1,-2]^{\mathrm{T}}$ ở chương 7.

## Lần in thứ 16 của tái bản lần 1

* Trang 4, đoạn 1 dòng 4: "bộ học không cho ta biết hành động đúng ở mỗi bước nên là gì" → "bộ học không biết hành động đúng ở mỗi bước"
* Trang 49, đoạn 1 dòng 1: lỗi chữ 了不去 → 不下去 (nghĩa: "không … tiếp được")

## Lần in thứ 15 của tái bản lần 1 (2025.03)

* Trang 62, đoạn 1 dòng 2: đặt $k=1$ → đặt $k=0$

## Lần in thứ 14 của tái bản lần 1 (2025.02)

* Trang 17, đoạn 1 dòng thứ 4 từ dưới lên: "có Q-learning, Sarsa,…" → "có Q-learning, Sarsa, mạng Q sâu,…"
* Trang 17, đoạn 1 dòng thứ 3 từ dưới lên: "đánh giá giá trị" (价值评估) → "hàm giá trị" (价值函数)
* Trang 25, đoạn 1 dòng thứ 2 từ dưới lên: "trò chơi kết thúc, ta thua." → "trò chơi kết thúc."
* Trang 67, bảng 2.1 hàng 2 cột 2: "phương trình Bellman" → "phương trình kỳ vọng Bellman"
* Trang 135, đoạn 1 dòng 1~2: "Hãy xem thuật toán **PPO1**, tức thuật toán PPO phạt. Trước tiên nó khởi tạo tham số chính sách $\theta^{0}$. Trong mỗi vòng lặp" → "Trước tiên hãy xem thuật toán PPO phạt, nó khởi tạo tham số chính sách $\theta^{0}$ trước. Trong mỗi vòng lặp"
* Trang 135, đoạn 2 dòng 2: "Ở đây sẽ gặp một vấn đề, đó là $\beta$ nên đặt bằng bao nhiêu?" → "Ở đây có một vấn đề: $\beta$ nên đặt bằng bao nhiêu." (chỉ sửa câu chữ tiếng Trung)
* Trang 135, đoạn cuối: "Nếu ta thấy tính độ phân kỳ KL quá phức tạp, thì còn có thuật toán PPO2, PPO2 tức thuật toán PPO cắt." → "Nếu ta thấy tính độ phân kỳ KL quá phức tạp, thì có thể dùng thuật toán PPO cắt."

* Trang 136, biểu thức (5.19) đổi thành:

$$
\begin{aligned}
J_{\mathrm{PPO}}^{\theta^k}(\theta) \approx \sum_{\left(s_t, a_t\right)} \min & \left(\frac{p_\theta\left(a_t \mid s_t\right)}{p_{\theta^k}\left(a_t \mid s_t\right)} A^{\theta^k}\left(s_t, a_t\right),\right. \\
& \left.\operatorname{clip}\left(\frac{p_\theta\left(a_t \mid s_t\right)}{p_{\theta^k}\left(a_t \mid s_t\right)}, 1-\varepsilon, 1+\varepsilon\right) A^{\theta^k}\left(s_t, a_t\right)\right) 
\end{aligned}
\tag{5.19}
$$

* Trang 136, đoạn thứ 2 từ dưới lên: "nếu nằm trong khoảng $1+\varepsilon \sim 1-\varepsilon$" → "nếu nằm trong khoảng $1-\varepsilon \sim 1+\varepsilon$"
* Trang 140, thêm vào đầu đoạn 1: "Chương này giới thiệu thuật toán học tăng cường dựa trên giá trị điển hình — **mạng Q sâu (deep Q-network, DQN)**."
* Trang 140, đoạn 3 dòng 1: "mạng Q sâu (deep Q-network, DQN)" → "mạng Q sâu." (bỏ phần chú thích tiếng Anh vì đã có ở đầu chương)
* Trang 165, đoạn 1 dòng 2: "chuẩn hóa (归一化, normalization). Quá trình chuẩn hóa" → "chuẩn hóa về trung bình 0 (零均值化). Quá trình chuẩn hóa về trung bình 0"
* Trang 165, đoạn 1 dòng 4: chuẩn hóa (归一化) → chuẩn hóa về trung bình 0 (零均值化)
* Trang 165, đoạn 2 dòng 2: chuẩn hóa (归一化) → chuẩn hóa về trung bình 0 (零均值化)
* Trang 165, đoạn 2 dòng 3: chuẩn hóa (归一化) → chuẩn hóa về trung bình 0 (零均值化)

## Lần in thứ 8 của tái bản lần 1 (2023.11)

* Lời giới thiệu ở bìa (sau): chức danh của thầy Lý Hoành Nghị (李宏毅, Hung-yi Lee) đổi thành: Giáo sư Đại học Đài Loan (National Taiwan University)
* Lời giới thiệu: chức danh của thầy Lý Hoành Nghị đổi thành: Giáo sư Đại học Đài Loan
* Bảng ký hiệu chính, thêm 4 dòng sau $r$:
  * $\mathcal{S}$          tập tất cả các trạng thái không kết thúc
  * $\mathcal{S}^{+}$       tập tất cả các trạng thái
  * $\mathcal{A}(s)$    tập các hành động có thể thực hiện ở trạng thái $s$
  * $\mathcal{R}$         tập tất cả các phần thưởng có thể có
* Giới thiệu tác giả ở tai bìa trước:
  * Vương Kỳ (王琦, Qi Wang):
    * Hướng nghiên cứu chính là học sâu, khai phá dữ liệu → Hướng nghiên cứu chính là học tăng cường, thị giác máy tính


* Trang 36, biểu thức (2.4) đổi thành:

$$
G_t=r_{t+1}+r_{t+2}+ r_{t+3}+ r_{t+4}+\cdots+ r_T \tag{2.4}
$$

* Trang 36, phần bên dưới biểu thức (2.4) đổi thành: Trong đó, $T$ là thời điểm cuối cùng. Với nhiệm vụ liên tục (ví dụ robot chạy lâu dài), $T=\infty$. Nếu dùng định nghĩa của biểu thức (2.4), khi mỗi thời điểm đều nhận phần thưởng dương, lợi tức sẽ tiến tới vô cùng. Vì vậy, ta cần đưa vào **lợi tức chiết khấu (discounted return)**:

$$
G_t=r_{t+1}+\gamma r_{t+2}+\gamma^2 r_{t+3}+\gamma^3 r_{t+4}+\cdots \tag{2.5}
$$
Trong đó, $\gamma$ là hệ số chiết khấu, phần thưởng nhận được càng về sau thì bị chiết khấu càng nhiều. Điều này cho thấy ta muốn nhận phần thưởng hiện tại hơn, còn phần thưởng tương lai thì phải chiết khấu. Khi đã có lợi tức, ta có thể định nghĩa giá trị của trạng thái, đó là **hàm giá trị trạng thái (state-value function)**. Với quá trình phần thưởng Markov, hàm giá trị trạng thái được định nghĩa là kỳ vọng của lợi tức, tức là
$$
\begin{aligned}
V^t(s) & =\mathbb{E}\left[G_t \mid s_t=s\right] \\
& =\mathbb{E}\left[r_{t+1}+\gamma r_{t+2}+\gamma^2 r_{t+3}+\cdots \mid s_t=s\right] 
\end{aligned}
\tag{2.6}
$$

Trong đó, $G_t$ là lợi tức chiết khấu đã định nghĩa ở trên. Ta lấy kỳ vọng của $G_t$, kỳ vọng cho biết bắt đầu từ trạng thái hiện tại thì có thể nhận được bao nhiêu giá trị. Vì vậy kỳ vọng cũng có thể xem là biểu hiện giá trị hiện tại của các phần thưởng có thể nhận được trong tương lai, tức là khi ta đi vào một trạng thái nào đó thì hiện tại có bao nhiêu giá trị.

* Trang 96,

  * Hàng 2 của hình 3.33(a), hình 3.33(b):
    * $s \in S^{+}, a \in A(s)$ → $s \in \mathcal{S}^{+}, a \in \mathcal{A}(s)$  
    * điểm cuối (终点) → trạng thái kết thúc (终止状态)
  * Hàng 7 của hình 3.33(a), hình 3.33(b): quan sát (观测) → nhận được (得到)

  

## Lần in thứ 7 của tái bản lần 1 (2023.10)

* Trang 36, đoạn 3 đổi thành: Trong đó, $T$ là thời điểm cuối cùng, $\gamma$ là hệ số chiết khấu, phần thưởng nhận được càng về sau thì bị chiết khấu càng nhiều. Điều này cho thấy ta muốn nhận phần thưởng hiện tại hơn, còn phần thưởng tương lai thì phải chiết khấu. Nhưng định nghĩa của biểu thức (2.4) có vấn đề, khi nhiệm vụ là nhiệm vụ liên tục, $T=\infty$, nếu tác tử ở mỗi thời điểm đều nhận phần thưởng dương, lợi tức sẽ tiến tới vô cùng. Khi đã có lợi tức, ta có thể định nghĩa giá trị của trạng thái, đó là hàm giá trị trạng thái (state-value function). Với quá trình phần thưởng Markov, hàm giá trị trạng thái được định nghĩa là kỳ vọng của lợi tức, tức là

* Trang 147, góc dưới bên trái hình 6.7: 动作值 → 动作价值 (cùng nghĩa "giá trị hành động", thống nhất cách dùng từ), thay hình 6.7 bằng hình dưới đây:

![](res/6-7.png ':size=650')

* Trang 217, đoạn cuối:
  * trạng thái vàng (gold state) → trạng thái đích (goal state)
  * trạng thái vàng → trạng thái đích
* Trang 218, đoạn 1: trạng thái vàng → trạng thái đích
* Trang 218, đoạn cuối: trạng thái vàng → trạng thái đích
* Trang 221, đoạn cuối: ta gọi là trạng thái vàng (gold state) → trạng thái đích (goal state)
* Trang 222, đoạn 1: trạng thái vàng → trạng thái đích

## Lần in thứ 6 của tái bản lần 1 (2023.06)

* Giới thiệu tác giả ở tai bìa trước:
  * Vương Kỳ:
    * Nghiên cứu sinh tiến sĩ tại Phòng thí nghiệm trọng điểm về Trí tuệ nhân tạo của Bộ Giáo dục, Khoa Khoa học Máy tính, Đại học Giao thông Thượng Hải → Nghiên cứu sinh tiến sĩ tại Phòng thí nghiệm trọng điểm về Trí tuệ nhân tạo của Bộ Giáo dục, Đại học Giao thông Thượng Hải

* Trang 21, đoạn cuối dòng 2: **máy đánh bạc nhiều tay cần (multi-armed bandit)** → **máy đánh bạc nhiều tay cần (multi-armed bandit, MAB)**
* Trang 23, thêm một đoạn văn phía trên đoạn thứ 2 từ dưới lên:
Ngoài ra, để hiển thị giao diện đồ họa, ta cần cài thêm thư viện pygame.
```bash
pip install pygame
```
* Trang 27, đoạn 2 đổi thành: Các môi trường đã đăng ký trong Gym có thể xem bằng code sau.
* Trang 27, đoạn 3 và đoạn 4 đổi thành: Mỗi môi trường trong Gym đều định nghĩa không gian quan sát và không gian hành động. Không gian quan sát và không gian hành động có thể là rời rạc (nhận một số hữu hạn giá trị rời rạc), cũng có thể là liên tục (nhận giá trị liên tục).
* Trang 28, khung code thứ nhất dòng 1: Không gian quan sát = Box(2,) → Không gian quan sát = Box([-1.2  -0.07], [0.6  0.07], (2,), float32)
* Trang 28, đoạn 2 đổi thành: Trong Gym, không gian quan sát của môi trường được biểu diễn bằng env.observation\_space, không gian hành động bằng env.action\_space. Không gian rời rạc được biểu diễn bằng lớp gym.spaces.Discrete, không gian liên tục bằng lớp gym.spaces.Box. Với không gian rời rạc, Discrete (n) cho biết số giá trị có thể nhận là n; với không gian liên tục, các thành viên low và high của thể hiện lớp Box cho biết phạm vi giá trị của mỗi số thực dấu phẩy động. Quan sát trong MountainCar-v0 là một mảng numpy độ dài 2, kiểu giá trị trong mảng là float. Hành động trong MountainCar-v0 là số nguyên, phạm vi giá trị là {0,1,2}.
* Trang 28, đoạn 3 đổi thành: Tiếp theo cài đặt tác tử để điều khiển xe di chuyển, code tương ứng như sau.
* Trang 28, khung code thứ hai dòng 1 và dòng cuối: BespokeAgent → SimpleAgent
* Trang 28, đoạn cuối đổi thành: Phương thức decide() của lớp SimpleAgent dùng để ra quyết định, phương thức learn() dùng để học, tác tử này không phải tác tử học tăng cường, không thể học, chỉ có thể ra quyết định theo biểu thức toán học cho trước.
* Trang 29, khung code thứ nhất dòng 1: play_montecarlo → play
* Trang 29, khung code thứ nhất dòng 2: "khởi tạo bằng" (初始化) → "giá trị ban đầu" (初始值)
* Trang 29, khung code thứ nhất dòng 6: "Hiển thị giao diện đồ họa, giao diện đồ họa có thể đóng bằng câu lệnh env.close()" → "Hiển thị giao diện đồ họa"
* Trang 29, đoạn 2 đổi thành: Hàm play() trong đoạn code trên cho tác tử tương tác với môi trường trong một tập, hàm có 4 tham số. env là lớp môi trường. agent là lớp tác tử. render là biến kiểu bool, dùng để xác định có cần hiển thị đồ họa hay không. Nếu render là True, trong quá trình tương tác sẽ gọi env.render() để hiển thị giao diện đồ họa, có thể đóng giao diện đồ họa bằng cách gọi env.close(). train là biến kiểu bool, dùng để xác định có huấn luyện tác tử hay không; trong quá trình huấn luyện đặt là True để tác tử học; trong quá trình kiểm thử đặt là False để tác tử giữ nguyên. Giá trị trả về episode\_reward của hàm là số kiểu float, biểu thị tổng phần thưởng của tập khi tác tử tương tác với môi trường trong một tập.
* Trang 29, đoạn 3: "và hiển thị đồ họa trong quá trình tương tác, có thể đóng giao diện đồ họa bằng câu lệnh env.close()" → "và hiển thị giao diện đồ họa"
* Trang 29, khung code cuối cùng dòng 1 đổi thành: env.seed(3) # Đặt hạt giống ngẫu nhiên để kết quả có thể tái lập
* Trang 29, khung code cuối cùng dòng 2: play_montecarlo → play
* Trang 29, khung code cuối cùng dòng cuối đổi thành: "Câu lệnh này có thể đóng giao diện đồ họa" → "Đóng giao diện đồ họa"
* Trang 30, đoạn 1 đổi thành: Để đánh giá hiệu năng của tác tử, cần tính phần thưởng trung bình của tập qua 100 tập tương tác liên tiếp, code như sau.
* Trang 30, khung code thứ hai dòng 1: play_montecarlo → play
* Trang 30, khung code thứ ba: -102.61 → -106.63
* Trang 30, đoạn 3 đổi thành: Phần thưởng trung bình của tập ứng với chính sách của lớp SimpleAgent vào khoảng $-$110, còn với nhiệm vụ xe leo núi, chỉ cần phần thưởng trung bình của 100 tập liên tiếp lớn hơn $-$110 là có thể coi nhiệm vụ đã được giải quyết.
* Trang 30, đoạn 4 đổi thành: Khi kiểm tra hiệu năng của tác tử trên một nhiệm vụ nào đó trong Gym, theo thói quen, giới học thuật thường quan tâm nhất đến phần thưởng trung bình của 100 tập. Với một số nhiệm vụ, còn có quy định một giá trị phần thưởng tham chiếu; khi phần thưởng của 100 tập liên tiếp lớn hơn giá trị quy định thì coi nhiệm vụ đã được giải quyết. Còn với nhiệm vụ không quy định giá trị thì không có khái niệm nhiệm vụ đã được giải quyết hay chưa<sup>[6]</sup>.
* Trang 137, đoạn 1 dòng 1: "Tuy biểu thức (5.19) trông hơi phức tạp, nhưng cài đặt lại khá đơn giản" → "Biểu thức (5.19) trông phức tạp, nhưng thực ra cài đặt khá đơn giản"
* Trang 156, đoạn 2 dòng 1: "Lợi ích thứ nhất là," → "Lợi ích thứ nhất là nâng cao hiệu quả lấy mẫu."
* Trang 156, đoạn 2 dòng 6: "Lợi ích thứ hai là," → "Lợi ích thứ hai là tăng tính đa dạng của mẫu."

## Lần in thứ 5 của tái bản lần 1 (2023.01)

* Giới thiệu tác giả ở tai bìa trước:
  * Vương Kỳ:
    * Thạc sĩ Viện Đại học Viện Hàn lâm Khoa học Trung Quốc → Nghiên cứu sinh tiến sĩ tại Phòng thí nghiệm trọng điểm về Trí tuệ nhân tạo của Bộ Giáo dục, Khoa Khoa học Máy tính, Đại học Giao thông Thượng Hải; Thạc sĩ Viện Đại học Viện Hàn lâm Khoa học Trung Quốc
    * Từng đoạt giải nhì Cuộc thi Thiết kế Máy tính dành cho Sinh viên Trung Quốc → Từng đoạt giải nhì Cuộc thi Mô hình hóa Toán học dành cho Nghiên cứu sinh Trung Quốc lần thứ 19 "Cúp Quang Cốc Trung Quốc·Huawei", giải nhì Cuộc thi Thiết kế Máy tính dành cho Sinh viên Trung Quốc
  * Dương Nghị Viễn (杨毅远):
    * Thay toàn bộ thành: Nghiên cứu sinh tiến sĩ Khoa Khoa học Máy tính, Đại học Oxford, Thạc sĩ Đại học Thanh Hoa, thành viên Datawhale. Hướng nghiên cứu chính là khai phá dữ liệu không-thời gian, hệ thống cảm biến thông minh, học sâu. Từng đạt các danh hiệu như quán quân toàn quốc Cuộc thi Xe thông minh dành cho Sinh viên Toàn quốc, Học bổng Quốc gia Trung Quốc, Sinh viên tốt nghiệp xuất sắc thành phố Bắc Kinh, Học giả Clarendon (Clarendon Scholar), đã công bố nhiều bài báo SCI/EI.

* Trang 10, đoạn phía trên hình 1.11 dòng 2: tác tử ở bên trái hình 1.12 → tác tử ở bên trái hình 1.11
* Trang 23, đoạn bên dưới hình 1.23: "Ta có thể cài thư viện Gym bằng pip." → "Ta có thể cài thư viện Gym bằng pip. Vì Gym từ phiên bản 0.26.0 trở đi không tương thích với code trước đó, nên ta cài Gym phiên bản trước 0.26.0, ví dụ 0.25.2."

```bash
pip install gym==0.25.2
```

> **Ghi chú của người dịch:** mục đính chính này dành cho sách in. Gym đã ngừng phát triển và bản 0.25.2 không còn chạy được với Python và NumPy bản mới, nên bản dịch đã chuyển toàn bộ code sang Gymnasium (`pip install "gymnasium[classic-control]"`); xem ghi chú ở mục 1.7.1 chương 1. Các đoạn code trong bảng đính chính này được giữ nguyên như sách in.

* Trang 31, đoạn 3: "khai phát" (开发, exploitation) → "khai thác" (利用, exploitation) (thống nhất thuật ngữ tiếng Trung)
* Hình 2.2 ở trang 35 và hình 2.5(a) ở trang 41 thêm mũi tên từ $s_1$ đến $s_4$, thay bằng hình dưới đây:

![](res/Markov_chain.png ':size=350')

* Trang 38, đoạn bên dưới biểu thức (2.7) dòng 1: "$s^{\prime}$ có thể xem là tất cả các trạng thái tương lai" → "$s^{\prime}$ có thể xem là một trạng thái tương lai nào đó"
* Trang 38, đoạn bên dưới biểu thức (2.7) dòng 2: "giá trị của một trạng thái tương lai nào đó" (未来某一个状态) → (未来某个状态) (chỉ rút gọn câu chữ tiếng Trung, nghĩa không đổi)
* Trang 52, đoạn 2 sửa thành:

&ensp;&ensp;&ensp;&ensp;Lấy một ví dụ minh họa khác biệt giữa dự đoán và điều khiển. Trước tiên là bài toán dự đoán. Trong lưới ô vuông ở hình 2.16(a), tác tử có thể thực hiện 4 hành động lên, xuống, trái, phải. Nếu hành động được thực hiện làm tác tử đi ra ngoài lưới, nó sẽ đứng yên tại vị trí cũ và nhận phần thưởng -1. Trừ các hành động đưa tác tử rời khỏi $\mathrm{A}$ và $\mathrm{B}$, phần thưởng của các hành động khác đều bằng 0. Tác tử ở $\mathrm{A}$ thực hiện bất kỳ hành động nào cũng sẽ di chuyển đến $\mathrm{A}^{\prime}$, và nhận phần thưởng +10. Tác tử ở $\mathrm{B}$ thực hiện bất kỳ hành động nào cũng sẽ di chuyển đến $\mathrm{B}^{\prime}$, và nhận phần thưởng +5. Như hình 2.16(b), bây giờ ta cho trước một chính sách: ở mọi trạng thái, hành động của tác tử đều ngẫu nhiên, tức là xác suất lên, xuống, trái, phải đều bằng 0.25. Việc của bài toán dự đoán là tìm hàm giá trị dưới kiểu quyết định này. Hình 2.16(c) là hàm giá trị tương ứng khi hệ số chiết khấu là $\gamma=0.9$.

* Trang 55, đoạn 2 dòng 1: $p(2 \mid 6, \mathrm{u})=2$ → $p(2 \mid 6, \mathrm{u})=1$ 

* Trang 96, xóa đoạn văn phía trên hình 3.33: "Thực ra, thuật toán Q-learning được đề xuất sớm hơn, thuật toán Sarsa là bản cải tiến của thuật toán Q-learning."

* Trang 96, xóa tài liệu tham khảo của đoạn văn phía trên hình 3.33: 邱锡鹏. 神经网络与深度学习 [M]. 北京：机械工业出版社, 2020. (Khâu Tích Bằng. Mạng nơ-ron và học sâu. Bắc Kinh: NXB Công nghiệp Cơ khí, 2020.)

* Trang 105, xóa tài liệu tham khảo: [5] 邱锡鹏. 神经网络与深度学习 [M]. 北京：机械工业出版社, 2020.

* Trang 116, thay hình 4.10 bằng hình dưới đây:

  ![](res/4-10.png ':size=550')

* Trang 116, tiêu đề hình 4.10 thay bằng: Sự thay đổi xác suất hành động trong trường hợp lý tưởng

* Trang 116, đoạn bên dưới hình 4.10 dòng 5: "có thể ta chỉ lấy mẫu được hành động b hoặc chỉ lấy mẫu được hành động c" → "có thể ta chỉ lấy mẫu được hành động b và hành động c"

* Trang 116, thay hình 4.11 bằng hình dưới đây:

![](res/4-11.png ':size=550')

* Trang 116, tiêu đề hình 4.11 thay bằng: Sự thay đổi xác suất hành động trong trường hợp thực tế
* Trang 121, đoạn phía trên hình 4.14 dòng 4: tính gradient $\nabla \ln \pi\left(a_{t} \mid s_{t}, \theta\right)$ cho mỗi hành động → tính gradient $\nabla \log \pi\left(a_{t} \mid s_{t}, \theta\right)$ cho mỗi hành động
* Trang 121, đoạn phía trên hình 4.14 dòng cuối: $\nabla \ln \pi\left(a_{t} \mid s_{t}, \theta\right)$ → $\nabla \log \pi\left(a_{t} \mid s_{t}, \theta\right)$ 
* Trang 121, thay hình 4.14 bằng hình dưới đây:

![](res/4-14.png ':size=550')

* Trang 123, đoạn thứ 2 từ dưới lên dòng 2: $\ln \pi\left(a_{t} \mid s_{t}, \theta\right)$ → $\log \pi\left(a_{t} \mid s_{t}, \theta\right)$   
* Trang 124, thay hình 4.19 bằng hình dưới đây:

![](res/4-19.png ':size=550')

* Trang 127, tiêu đề mục 5.1: "Từ on-policy đến off-policy" → "Lấy mẫu theo trọng số quan trọng"
* Trang 131, biểu thức (5.8): $\nabla \log p_\theta\left(a_t^n \mid s_t^n\right)$ → $\nabla \log p_\theta\left(a_t \mid s_t\right)$
* Trang 131, đoạn bên dưới biểu thức (5.8) dòng thứ 2 từ dưới lên: $\nabla \log p_\theta\left(a_t^n \mid s_t^n\right)$ → $\nabla \log p_\theta\left(a_t \mid s_t\right)$
* Trang 131, biểu thức (5.9): $\nabla \log p_\theta\left(a_t^n \mid s_t^n\right)$ → $\nabla \log p_\theta\left(a_t \mid s_t\right)$
* Trang 132, biểu thức (5.11) và biểu thức (5.12): $\nabla \log p_\theta\left(a_t^n \mid s_t^n\right)$ → $\nabla \log p_\theta\left(a_t \mid s_t\right)$
* Trang 133, đoạn 2 của mục 5.2 dòng 1 đến dòng 3: "Chú ý, vì trong PPO $\theta'$ là $\theta_{\text{old}}$, tức chính sách hành vi cũng là $\pi_{\theta}$, nên PPO là thuật toán on-policy. Như biểu thức (5.15), việc PPO thực sự làm chính là như vậy, tối ưu hàm mục tiêu $J^{\theta^{\prime}}(\theta)$ trong phương pháp off-policy." → "Như biểu thức (5.15), PPO cần tối ưu hàm mục tiêu $J^{\theta^{\prime}}(\theta)$."
* Trang 133, thêm nội dung sau vào dòng cuối của đoạn 2 mục 5.2: **Chú ý, tuy mục tiêu tối ưu của PPO có liên quan đến importance sampling, nhưng nó chỉ dùng dữ liệu của chính sách vòng trước $\theta^{\prime}$. Hàm mục tiêu của PPO có thêm ràng buộc độ phân kỳ KL, chính sách hành vi $\theta^{\prime}$ và chính sách mục tiêu $\theta$ rất gần nhau, chính sách hành vi và chính sách mục tiêu của PPO có thể coi là cùng một chính sách, vì vậy PPO là thuật toán on-policy.**
* Trang 134, đoạn bên dưới biểu thức (5.16) dòng 2: tối đa hóa biểu thức (5.16) → tối đa hóa biểu thức (5.15)
* Trang 165, đoạn 1 dòng 4 đến dòng 5: vectơ sau khi chuẩn hóa là $[3,-1,2]^{\mathrm{T}}$ → vectơ sau khi chuẩn hóa là $[3,-1,-2]^{\mathrm{T}}$ 
* Trang 165, đoạn 2 dòng 1: mỗi phần tử trong vectơ $[3,-1,2]^{\mathrm{T}}$ → mỗi phần tử trong vectơ $[3,-1,-2]^{\mathrm{T}}$ 
* Trang 189, thay hình 9.4 bằng hình dưới đây:

![](res/9-4.png ':size=550')

* Trang 203, đoạn thứ 2 từ dưới lên dòng 1: clipped dobule Q-learning → clipped double Q-learning

## Lần in thứ 4 của tái bản lần 1 (2022.11)

## Lần in thứ 3 của tái bản lần 1 (2022.07)

Giới thiệu tác giả ở tai bìa trước:

* Vương Kỳ:
  * Đang học thạc sĩ tại Viện Đại học Viện Hàn lâm Khoa học Trung Quốc → Thạc sĩ Viện Đại học Viện Hàn lâm Khoa học Trung Quốc
* Dương Nghị Viễn: Đang học thạc sĩ tại Đại học Thanh Hoa → Thạc sĩ Đại học Thanh Hoa
* Giang Quý (江季): Đang học thạc sĩ tại Đại học Bắc Kinh → Thạc sĩ Đại học Bắc Kinh

## Lần in thứ 2 của tái bản lần 1 (2022.06)

* Trang 1, hình 1.1 xóa tài liệu tham khảo: SUTTON R S, BARTO A G. Reinforcement learning: An introduction (second edition)[M]. London: The MIT Press, 2018
* Hình 1.9 ở trang 7 và hình 1.10 ở trang 8 thêm tài liệu tham khảo: khóa học "Deep Reinforcement Learning" của Sergey Levine
* Trang 19, hình 1.19 xóa tài liệu tham khảo: khóa học "UCL Course on RL" của David Silver
* Trang 24, thêm chú giải bên dưới đoạn code phía dưới đoạn 1:

> Đoạn code trên chỉ là ví dụ, mục đích giúp người đọc hiểu khung cài đặt code của thuật toán học tăng cường, không phải code hoàn chỉnh; hàm load_agent chưa được định nghĩa nên chạy đoạn code này sẽ báo lỗi.

* Trang 33, hình 2.1 xóa tài liệu tham khảo: SUTTON R S, BARTO A G. Reinforcement learning: An introduction(second edition)[M]. London:The MIT Press, 2018

* Trang 36, đoạn phía trên biểu thức (2.4) dòng 2 và dòng 3: "**Lợi tức (return)** là phần thưởng nhận được sau khi chiết khấu các phần thưởng. Lợi tức có thể định nghĩa là tổng cộng dồn từng bước của phần thưởng, tức là" → "**Lợi tức (return)** có thể định nghĩa là tổng cộng dồn từng bước của phần thưởng, giả sử chuỗi phần thưởng sau thời điểm $t$ là $r_{t+1},r_{t+2},r_{t+3},\cdots$, thì lợi tức là"

* Trang 36, đoạn bên dưới biểu thức (2.4) dòng 1: "Ở đây có một hệ số chiết khấu," → "Trong đó, $T$ là thời điểm cuối cùng, $\gamma$ là hệ số chiết khấu,"

* Trang 100, đoạn 2 dòng 2: "4 số 0, 1, 2, 3 ứng với lên, xuống, trái, phải" → "4 số 0, 1, 2, 3 ứng với lên, phải, xuống, trái"

* Trang 108, thay hình 4.4 bằng hình dưới đây:

![](res/4-4.png ':size=550')

* Trang 151, đoạn 2 dòng cuối: sai số bình phương trung bình (mean square error) → sai số bình phương trung bình (mean square error, MSE)
* Trang 201, đoạn 3 dòng thứ 2 từ dưới lên: sai số bình phương trung bình (mean squared error, MSE) → sai số bình phương trung bình
* Trang 223, đoạn 1 dòng 4 xóa tài liệu tham khảo: 周志华. 机器学习 [M]. 北京：清华大学出版社, 2016 (Chu Chí Hoa. Học máy. Bắc Kinh: NXB Đại học Thanh Hoa, 2016)
* Trang 241, đoạn 1 dòng 3 và dòng 4: sai số bình phương trung bình (mean square error, MSE) → sai số bình phương trung bình

## Lần in thứ 1 của tái bản lần 1 (2022.03)

* Trang 2, tiêu đề mục 2.1.2: "Quá trình Markov/Chuỗi Markov" → "Chuỗi Markov"
* Trang 17, đoạn 1 dòng thứ 4 từ dưới lên: gradient chính sách → gradient chính sách (policy gradient, PG)
* Trang 34, tiêu đề mục 2.1.2: "Quá trình Markov/Chuỗi Markov" → "Chuỗi Markov"
* Trang 34, đoạn 2 của mục 2.1.2 dòng 1: "còn được gọi là **chuỗi Markov (Markov chain)**." → "còn được gọi là **chuỗi Markov (Markov chain)**. Chuỗi Markov là quá trình Markov đơn giản nhất, số trạng thái của nó là hữu hạn."
* Hình 2.2 ở trang 35 và hình 2.5(a) ở trang 41 thay bằng hình dưới đây:

![](res/Markov_chain.png ':size=350') 

* Trang 47, mục 2.3.5 dòng 3: "gọi là sơ đồ backup (backup diagram)" → "gọi là sơ đồ backup (backup diagram) hay sơ đồ truy ngược"
* Trang 61, mục 2.3.12 tiểu mục 1 đoạn 2 dòng 1: $\pi(s|a)$ → $\pi(a|s)$   
* Trang 62, dòng thứ 2 trước biểu thức (2.55): "$H$ là số lần lặp" → "$H$ là số lần lặp cần để $V(s)$ hội tụ"
* Trang 62, biểu thức (2.57) đổi thành
$$
\pi(s)=\underset{a}{\arg \max } \left[R(s, a)+\gamma \sum_{s^{\prime} \in S} p\left(s^{\prime} \mid s, a\right) V_{H+1}\left(s^{\prime}\right)\right]
$$

* Trang 70, đoạn 1 sửa thành:

&ensp;&ensp;&ensp;&ensp;Cách biểu diễn chính sách đơn giản nhất là bảng tra cứu (look-up table), tức chính sách dạng bảng (tabular policy). Các phương pháp học tăng cường dùng bảng tra cứu được gọi là **phương pháp dạng bảng (tabular method)**, như Monte Carlo, Q-learning và Sarsa. Chương này dùng các phương pháp dạng bảng đơn giản nhất để giảng giải cách dùng phương pháp dựa trên giá trị giải bài toán học tăng cường.

* Trang 76, các con số phía sau $G$ và $r$ trong biểu thức (3.1) đổi thành chỉ số dưới, tức là

$$
\begin{array}{l}
G_{13}=0 \\
G_{12}=r_{13}+\gamma G_{13}=-1+0.6 \times 0=-1 \\
G_{11}=r_{12}+\gamma G_{12}=-1+0.6 \times(-1)=-1.6 \\
G_{10}=r_{11}+\gamma G_{11}=-1+0.6 \times(-1.6)=-1.96 \\
G_9=r_{10}+\gamma G_{10}=-1+0.6 \times(-1.96)=-2.176 \approx-2.18 \\
G_8=r_9+\gamma G_9=-1+0.6 \times(-2.176)=-2.3056 \approx-2.3
\end{array}
$$

* Trang 89, dòng thứ 4 từ dưới lên của hình 3.25: "nếu $(s_t,a_t)$ không xuất hiện" → "nếu $(s_t,a_t)$ xuất hiện"
* Đoạn code bên dưới đoạn giữa trang 101 và đoạn code ở đầu trang 102 bị sai thụt lề, sửa thành

```python
rewards = []
ma_rewards = [] # Phần thưởng trung bình trượt
for i_ep in range(cfg.train_eps):
    ep_reward = 0 # Ghi lại phần thưởng của mỗi tập
    state = env.reset() # Đặt lại môi trường, bắt đầu lại (bắt đầu một tập mới)
    while True:
        action = agent.choose_action(state) # Chọn một hành động theo thuật toán
        next_state, reward, done, _ = env.step(action) # Thực hiện một lần tương tác hành động với môi trường
        agent.update(state, action, reward, next_state, done) # Cập nhật theo thuật toán Q-learning
        state = next_state # Lưu giá trị quan sát trước đó
        ep_reward += reward
        if done:
            break
    rewards.append(ep_reward)
    if ma_rewards:
        ma_rewards.append(ma_rewards[-1]*0.9+ep_reward*0.1)
    else:
        ma_rewards.append(ep_reward)
```

* Trang 103, đoạn phía trên hình 3.37: "cụ thể có thể xem mã nguồn trên GitHub" → "cụ thể có thể xem code đi kèm sách"
* Trang 106, thêm đoạn văn sau phía trên mục 4.1:

&ensp;&ensp;&ensp;&ensp;Thuật toán gradient chính sách là phương pháp dựa trên chính sách, nó tham số hóa chính sách. Giả sử chính sách có tham số $\theta$ là $\pi_{\theta}$, chính sách này là chính sách ngẫu nhiên, nó nhận đầu vào là một trạng thái, đầu ra là phân phối xác suất của hành động. Thuật toán gradient chính sách không cần tối đa hóa giá trị trong không gian hành động, vì vậy khá phù hợp để giải các bài toán có không gian hành động nhiều chiều hoặc liên tục.

* Trang 140, đoạn phía trên mục 6.1 dòng 1: mạng Q sâu (Deep Q-network, DQN) → mạng Q sâu (deep Q-network, DQN) (sửa chữ hoa thành chữ thường)
* Trang 140, thêm đoạn văn sau phía trên mục 6.1:

&ensp;&ensp;&ensp;&ensp;Cốt lõi của thuật toán mạng Q sâu là duy trì hàm Q và dùng nó để ra quyết định. $Q_{\pi}(s,a)$ là hàm giá trị hành động dưới chính sách $\pi$, mỗi lần đến một trạng thái $s_t$, duyệt toàn bộ không gian hành động, dùng hành động làm $Q_{\pi}(s,a)$ lớn nhất làm chính sách:
$$
a_{t}=\underset{a}{\arg \max } ~Q_{\pi}\left(s_{t}, a\right) \tag{6.2}
$$
&ensp;&ensp;&ensp;&ensp;Mạng Q sâu dùng phương trình Bellman để cập nhật lặp $Q_{\pi}(s,a)$:
$$
Q_{\pi}\left(s_{t}, a_{t}\right) \leftarrow Q_{\pi}\left(s_{t}, a_{t}\right)+\alpha\left(r_{t}+\gamma \max _{a} Q_{\pi}\left(s_{t+1}, a\right)-Q_{\pi}\left(s_{t}, a_{t}\right)\right) \tag{6.3}
$$
&ensp;&ensp;&ensp;&ensp;Thông thường với các nhiệm vụ đơn giản, ta dùng mạng nơ-ron kết nối đầy đủ (fully connected neural network) để xấp xỉ $Q_{\pi}$, nhưng với các nhiệm vụ phức tạp hơn (như chơi game Atari), ta dùng mạng nơ-ron tích chập để xấp xỉ ánh xạ từ hình ảnh đến hàm giá trị. Vì cách biểu diễn này của mạng Q sâu chỉ xử lý được một số hữu hạn giá trị hành động, nên nó thường được dùng cho các nhiệm vụ có không gian hành động rời rạc.

* Số thứ tự công thức sau trang 140 cần được cập nhật.
* Trang 145, đoạn bên dưới biểu thức (6.6) dòng 1: "nên phần thưởng của trạng thái $s_b$ bằng" → "nên phần thưởng của trạng thái $s_a$ bằng"
* Trang 149, biểu thức (6.15) đổi thành

$$
\begin{aligned}
V^{\pi}(s) &\le Q^{\pi}(s,\pi'(s)) \\
&=E\left[r_{t}+V^{\pi}\left(s_{t+1}\right) | s_{t}=s, a_{t}=\pi^{\prime}\left(s_{t}\right)\right]\\
&\le E\left[r_{t}+Q^{\pi}\left(s_{t+1}, \pi^{\prime}\left(s_{t+1}\right)\right) | s_{t}=s, a_{t}=\pi^{\prime}\left(s_{t}\right)\right] \\
&=E\left[r_{t}+r_{t+1}+V^{\pi}\left(s_{t+2}\right) |s_{t}=s, a_{t}=\pi^{\prime}\left(s_{t}\right)\right]  \\
& \le E\left[r_{t}+r_{t+1}+Q^{\pi}\left(s_{t+2},\pi'(s_{t+2}\right) | s_{t}=s, a_{t}=\pi^{\prime}\left(s_{t}\right)\right] \\
& = E\left[r_{t}+r_{t+1}+r_{t+2}+V^{\pi}\left(s_{t+3}\right) |s_{t}=s, a_{t}=\pi^{\prime}\left(s_{t}\right)\right] \\
& \le \cdots\\
& \le E\left[r_{t}+r_{t+1}+r_{t+2}+\cdots | s_{t}=s, a_{t}=\pi^{\prime}\left(s_{t}\right)\right]  \\
& = V^{\pi'}(s)
\end{aligned}
$$

* Trang 154, đoạn 1 mục 6.5 dòng 5: "mỗi mẫu dữ liệu ghi lại rằng, trước đây ta" → "mỗi mẫu dữ liệu là một bộ bốn (trạng thái, hành động, phần thưởng, trạng thái tiếp theo), tức là trước đây ta"
* Trang 156, đoạn 1 mục 6.6 dòng 2: "lúc đầu mạng Q mục tiêu" → "lúc đầu mạng mục tiêu $\hat{Q}$"
* Trang 156, đoạn bên dưới biểu thức (6.22) dòng 1: "hành động $a$ ta sẽ thực hiện ở trạng thái $s_{i+1}$ chính là hành động làm Q" → "hành động $a$ ta sẽ thực hiện ở trạng thái $s_{i+1}$ chính là hành động làm $\hat{Q}$"
* Trang 176, dòng 1: mạng kết nối đầy đủ (全连接网络) → mạng nơ-ron kết nối đầy đủ (全连接神经网络)
* Trang 176, khối code bên dưới dòng 1: "Khởi tạo mạng Q, là mạng kết nối đầy đủ" → "Khởi tạo mạng Q là mạng nơ-ron kết nối đầy đủ"
* Trang 187, tiêu đề hình 9.2: "Mạng Q sâu" → "Hai loại nhà phê bình của mạng Q sâu"
* Trang 187, tiêu đề mục 9.3: "Thuật toán diễn viên-nhà phê bình" → "Thuật toán diễn viên-nhà phê bình lợi thế"
* Trang 187, dòng cuối: "$Q_{\pi_{\theta}}\left(s_{t}^{n}, a_{t}^{n}\right)-V_{\pi_{\theta}}\left(s_{t}^{n}\right)$." → "hàm lợi thế $A^{\theta}\left(s^{n}_{t}, a^{n}_{t}\right)$, tức $Q_{\pi_{\theta}}\left(s_{t}^{n}, a_{t}^{n}\right)-V_{\pi_{\theta}}\left(s_{t}^{n}\right)$. Do đó thuật toán này được gọi là thuật toán diễn viên-nhà phê bình lợi thế."
* Trang 188, tiêu đề hình 9.3: "Thuật toán diễn viên-nhà phê bình" → "Thuật toán diễn viên-nhà phê bình lợi thế"
* Trang 188, xóa tiêu đề mục 9.4, phần tương ứng trong mục lục cũng cần sửa
* Trang 188, đoạn 1 mục 9.4 dòng 1: "thuật toán diễn viên-nhà phê bình gốc" → "thuật toán diễn viên-nhà phê bình lợi thế gốc"
* Trang 188, dòng phía trên biểu thức (9.5): "ta được" → "ta được sai số sai phân thời gian"
* Trang 189, xóa đoạn văn ở dòng 4 đến dòng 5: "Vì $r_{t}^{n}+V_{\pi}\left(s_{t+1}^{n}\right)-V_{\pi}\left(s_{t}^{n}\right)$ được gọi là **hàm lợi thế**, nên thuật toán này được gọi là thuật toán diễn viên-nhà phê bình lợi thế."
* Trang 190, đoạn 2 mục 9.5 dòng 3: "cũng khó cài đặt. Ta có thể cài đặt thuật toán diễn viên-nhà phê bình lợi thế là được." → "khó cài đặt thuật toán diễn viên-nhà phê bình lợi thế bất đồng bộ, nhưng có thể cài đặt thuật toán diễn viên-nhà phê bình lợi thế."
* Trang 191, dòng 4 và dòng 5: "phải dùng gradient để cập nhật tham số …… thì gửi gradient" → "phải dùng gradient để cập nhật tham số của mạng toàn cục. Sau khi mỗi tiến trình tính được gradient, phải gửi gradient"
* Trang 191, đoạn phía trên hình 9.6 dòng cuối: "thành $\theta_2$ rồi" → "thành $\theta_2$ rồi (các tiến trình khác cũng sẽ cập nhật mô hình)"
* Trang 191, thêm đoạn văn vào cuối đoạn phía trên hình 9.6: Tuy A3C trông có vẻ thuộc nhóm thuật toán off-policy, nhưng thực ra nó là một thuật toán on-policy. Vì diễn viên và nhà phê bình của A3C chỉ dùng dữ liệu được lấy mẫu bởi chính sách hiện tại để tính gradient. Do đó, A3C không lưu dữ liệu lịch sử, nó chủ yếu duy trì sự ổn định của việc huấn luyện thông qua khám phá song song (parallel exploration).
* Trang 191, thay hình 9.6 bằng hình dưới đây:

![](res/A3C.png ':size=450')

* Trang 191, hình 9.6 thêm tài liệu tham khảo: bài viết "Simple Reinforcement Learning with Tensorflow Part 8: Asynchronous Actor-Critic Agents (A3C)" của Arthur Juliani

* Trang 195, đoạn 1 mục 9.7 dòng 1: lỗi chữ 生产对抗网络 (mạng đối kháng "sản xuất") → 生成对抗网络 (mạng đối sinh)

* Trang 200, dòng 6: "Mục tiêu của nó là giúp mỗi buổi biểu diễn đều nhận được càng nhiều tiếng hoan hô và tràng pháo tay của khán giả càng tốt, tức là tối đa hóa tổng phần thưởng tương lai" → "Mục tiêu cuối cùng của nhà phê bình là giúp màn biểu diễn của diễn viên nhận được càng nhiều tiếng hoan hô và tràng pháo tay của khán giả càng tốt, từ đó tối đa hóa tổng lợi ích trong tương lai"

* Trang 201, đoạn phía trên hình 10.7 dòng cuối: 均方差 → sai số bình phương trung bình (均方误差, mean squared error, MSE)

* Trang 201, đoạn bên dưới hình 10.7 dòng 3: 之间的一个均方差 → 之间的均方误差 (thống nhất thuật ngữ "sai số bình phương trung bình")

* Trang 202, đoạn bên dưới hình 10.8 dòng 4: "nhiễu OU có tương quan theo thời gian" → "nhiễu Ornstein-Uhlenbeck (OU) có tương quan theo thời gian"

* Trang 203, đoạn phía trên biểu thức (10.1) dòng 2: 均方差 → 均方误差 (thống nhất thuật ngữ "sai số bình phương trung bình")

* Trang 207, tiêu đề mục 10.4.3: "Nhiễu Ornstein-Uhlenbeck" → "Nhiễu OU"

* Trang 207, đoạn 1 mục 10.4.3 dòng 1: "nhiễu Ornstein-Uhlenbeck (OU)" → "nhiễu OU"

* Trang 229, dòng 2: lỗi chữ 很强的序列 ("chuỗi rất mạnh") → 很长的序列 ("chuỗi rất dài")

* Trang 242, đoạn phía trên mục 13.4.3 dòng 1: 均方差损失 → 均方误差损失 (thống nhất thuật ngữ "hàm mất mát sai số bình phương trung bình")
