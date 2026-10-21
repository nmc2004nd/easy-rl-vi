# Deep Recurrent Q-Learning for Partially Observable MDPs (Q-learning hồi quy sâu cho quá trình quyết định Markov quan sát được một phần)
Tác giả: Matthew Hausknecht, Peter Stone <br>
Đơn vị: Department of Computer Science The University of Texas at Austin <br>
Hội nghị công bố: National conference on artificial intelligence <br>
Thời gian công bố: Submitted on 23 Jul 2015, last revised 11 Jan 2017 <br>
Link xem bài báo: https://arxiv.org/abs/1507.06527

Đóng góp của bài báo: đề xuất một mô hình mạng nơ-ron dựa trên DQN (DRQN), kết hợp mô hình DQN chứa mạng nơ-ron tích chập (CNN) với LSTM, giúp tác tử học tăng cường có đặc tính ghi nhớ.

##  1. Động cơ viết bài
<font size="4">**Why:**</font> <br>
Trong <font color="#660000"> *Playing Atari with Deep Reinforcement Learning (Mnih et al., 2013)* </font>, DQN dùng tổ hợp 4 trạng thái cuối cùng (4 khung hình cuối) bao gồm trạng thái hiện tại mà tác tử (Agent) gặp làm **đầu vào**. **Mục đích** là có được các thông tin như <font color="#0000dd">**hướng**, **tốc độ**</font> của vật thể/nhân vật trong khung hình. Nói cách khác, nếu gặp nhiệm vụ cần ghi nhớ đặc trưng có độ dài thời gian vượt quá bốn khung hình, thì với DQN, quá trình quyết định Markov (MDP) sẽ trở thành quá trình quyết định Markov quan sát được một phần (POMDP).

<font size="4">**What:**</font> <br>
Quá trình quyết định Markov quan sát được một phần (Partially-Observable Markov Decision Process, POMDP) là: quan sát hiện tại (Observation, obs) không đầy đủ và có nhiễu, không chứa toàn bộ trạng thái vận hành của môi trường. Dẫn đến không thể dùng làm thông tin mô tả đầy đủ của môi trường (Environment, env) (quan sát tác tử nhận được không tương đương với trạng thái của môi trường).

<font size="4">**How:**</font> <br>
Tác giả bài báo đề xuất, để tránh việc DQN bị giảm hiệu năng trong quá trình học ở môi trường nhiệm vụ do quá trình quyết định Markov quan sát được một phần (POMDP), đưa vào **Deep Recurrent Q-Network (DRQN)**, là tổ hợp dựa trên LSTM (Long Short-Term Memory, LSTM) và DQN. Đồng thời **chứng minh dùng DRQN có thể xử lý hiệu quả quá trình quyết định Markov quan sát được một phần (POMDP)**: khi đánh giá tác tử, nếu quan sát (obs) đưa vào tác tử thay đổi (bị che, khung hình nhấp nháy), vì hàm giá trị (Value function) tham số hóa có chứa tầng mạng nơ-ron hồi quy (LSTM) nên có thể giúp chính sách học được $\pi_{\theta }$ có tính bền vững, không xảy ra sụp đổ chính sách.

##  2. Giới thiệu bối cảnh
### 1. Deep Q-Learning (Q-learning sâu)
Phương pháp Q-learning sâu dùng mạng nơ-ron sâu có tham số $\theta$ để xấp xỉ hàm giá trị (Value Function) $V(s)$ hoặc hàm giá trị hành động (Action-Value Function) $Q(s,a)$, từ đó học ngầm chính sách tối ưu $\pi ^*$; đầu vào là quan sát (obs) của môi trường, đầu ra là giá trị V hoặc giá trị Q ước lượng cho quan sát (obs) đó.

Kịch bản áp dụng của Q-learning sâu: nhiệm vụ có không gian trạng thái (State space) liên tục, không gian hành động (Action Space) rời rạc.

Tác dụng của hàm giá trị là: đánh giá kỳ vọng của lợi tức (Return) tương lai dưới trạng thái-hành động hiện tại.

Ưu điểm của việc dùng mạng nơ-ron sâu làm bộ xấp xỉ hàm giá trị tham số hóa trong học tăng cường: <br>
(1) Có khả năng tự động trích xuất đặc trưng của học sâu. <br>
(2) Mô hình tham số hóa tổng quát hóa từ các quan sát (obs) đã thấy sang các quan sát (obs) chưa thấy: $|\theta|\ll|S\times A|$ <br>
(3) Mô hình tham số hóa có thể cập nhật tham số mô hình mạng nơ-ron bằng cách lấy đạo hàm.

Hàm giá trị tham số hóa là:

$$V_\theta (s)\cong V^\pi (s) \\ Q_\theta (s,a)\cong Q^\pi (s,a)$$

Các mẹo (Trick) giữ ổn định việc học của Q-learning sâu: <br>
(1) Phát lại kinh nghiệm (Experience Replay): cải thiện tính tương quan ở mức dữ liệu và sự thay đổi phân phối dữ liệu, giúp dữ liệu thỏa mãn tính chất độc lập và phân phối đồng nhất (i.i.d.) nhiều nhất có thể. <br>
(2) Mạng mục tiêu (Target Network): giải quyết vấn đề khi học sai phân thời gian (Temporal Difference, TD), TD target và mạng Q hiện tại có tương quan cao.

Hàm mất mát (Loss Function) của Q-learning sâu là:

$$\mathcal{L}_{i}\left(\theta_{i}\right)=\mathbb{E}_{\left(s, a, r, s^{\prime}\right) \sim \mathcal{D}}\left[\left(y_{i}-Q\left(s, a ; \theta_{i}\right)\right)^{2}\right] \\
y_{i}=r+\gamma \max _{a^{\prime}} \hat{Q}\left(s^{\prime}, a^{\prime} ; \theta^{-}\right)
$$
Hành động tối ưu $a^*$ của Q-learning sâu là hành động ứng với giá trị Q lớn nhất do hàm giá trị đưa ra ở trạng thái (state) hiện tại:
$$
a=arg\;\underset{a}{max} Q(s,a)
$$
### 2. Partial Observability (Quan sát được một phần)
Bộ năm của quá trình quyết định Markov (MDP) (S, A, P, $\gamma$, R): <br>
(1) S là tập trạng thái <br>
(2) A là tập hành động <br>
(3) $P(s'|s,a)$ là xác suất chuyển trạng thái của môi trường <br>
(4) $\gamma \in [0,1]$ là hệ số chiết khấu cho phần thưởng tích lũy tương lai (lợi tức Return) <br>
(5) R là hàm phần thưởng, R: S × A

Bộ bảy của quá trình quyết định Markov quan sát được một phần (POMDP) (S, A, P, $\gamma$, R, Ω, O): <br>
(1) Ω là tập quan sát $(obs,o)$, $o\in \Omega$ <br>
(2) O là hàm quan sát, $O(s',a,o)= P(o | s',a)$

Vì quan sát (obs) là mô tả một phần của trạng thái, nên có thể bỏ sót một số thông tin.
$$Q(o, a \mid \theta) \neq Q(s, a \mid \theta)$$

Tác giả bài báo chứng minh qua thực nghiệm, dùng DRQN có thể thu hẹp khoảng cách giữa giá trị Q của hàm giá trị đối với quan sát (obs) và giá trị Q đối với trạng thái (State). Tức là chính sách tác tử học được có thể có tính bền vững trong môi trường nhiệm vụ mang tính chất POMDP.

##  3. Kiến trúc mô hình
![Mô tả hình ảnh](https://img-blog.csdnimg.cn/9a1d882184d449f08b77bfff90b14dc3.png#pic_center) <br>
**Đầu vào của mô hình**: ảnh đơn kênh 84*84 điểm ảnh của trò chơi Atari <br>
**Đầu ra của mô hình**: giá trị Q ứng với 18 hành động rời rạc của trò chơi

Giải thích kiến trúc mô hình: <br>
① Trước tiên dùng mạng nơ-ron tích chập 3 tầng (Convolutional Neural Networks, CNN) để trích xuất đặc trưng ảnh. <br>
② Tiếp theo đưa vào LSTM, để có đặc trưng chuỗi giữa các khung hình trò chơi. <br>
③ Cuối cùng dùng tầng kết nối đầy đủ (Fully Connected Layers, FC) để biến thành giá trị Q.

##  4. Phương pháp cập nhật tác tử
**Bootstrapped Random Updates (cập nhật ngẫu nhiên có bootstrap)**: chọn ngẫu nhiên quỹ đạo $\tau$ của một tập từ bể kinh nghiệm (Replay Memory), và chọn ngẫu nhiên điểm bắt đầu trong đoạn kinh nghiệm của tập đó để cập nhật mô hình theo thứ tự bước thời gian. (Cập nhật theo cách sai phân thời gian - Temporal Difference)

$$\tau =\left \{ s_0, a_0, s_1, r_1, a_1, \cdots ,s_{t-1}, r_{t-1}, a_{t-1}, s_t, r_t\right \} $$

Ví dụ: chọn bắt đầu cập nhật theo thứ tự từ $s_2$ của quỹ đạo $\tau$, cho đến trạng thái kết thúc $s_t$ của quỹ đạo $\tau$ thì dừng.

Khiếm khuyết thiết kế: dùng cách cập nhật ngẫu nhiên phù hợp với chiến lược cập nhật lấy mẫu kinh nghiệm ngẫu nhiên trong DQN. Nhưng thiết kế hàm giá trị trong bài báo này có chứa tầng LSTM. Dẫn đến khi bắt đầu mỗi lần huấn luyện cập nhật, **LSTM** có đầu vào **trạng thái ẩn $h_{t-1}$** bằng 0, khiến LSTM khó học được phạm vi thời gian dài hơn số bước thời gian mà lan truyền ngược theo thời gian có thể đạt tới.

Sơ đồ cấu trúc **LSTM**:

![Mô tả hình ảnh](https://img-blog.csdnimg.cn/5e9de76a65704bb4993703d460473164.png#pic_center)

Cổng quên (Forget Gate): điều khiển dữ liệu nào được giữ lại, dữ liệu nào bị quên. <br>
Cổng vào (Input Gate): điều khiển lượng dữ liệu đầu vào của mạng chảy vào ô nhớ. <br>
Cổng ra (Output Gate): điều khiển ảnh hưởng của bộ nhớ lên dữ liệu đầu ra hiện tại, tức phần nào trong ô nhớ sẽ được đưa ra ở bước thời gian t. <br>
Trạng thái ô (Cell State): cập nhật trạng thái ô cũ thành trạng thái ô hiện tại, do cổng quên và cổng vào cùng điều khiển.

Cách cập nhật tác tử dùng trong bài báo này đều là **chiến lược cập nhật ngẫu nhiên**.

##  5. Môi trường nhiệm vụ
Bài báo chọn 9 môi trường nhiệm vụ trò chơi Atari 2600 để đánh giá hiệu năng của tác tử (Agent) dựa trên mô hình mạng nơ-ron DRQN.

Sơ đồ các môi trường trò chơi:

![Mô tả hình ảnh](https://img-blog.csdnimg.cn/4dfbf7b304ae436e9a43bd2270ea6178.jpeg#pic_center)
![Mô tả hình ảnh](https://img-blog.csdnimg.cn/bff7220618d740edb09e92cdb5bf2e84.jpeg#pic_center)
|Môi trường trò chơi  | Giới thiệu  |
|--|--|
|Asteroids  |Có NPC nhấp nháy tự nhiên, khiến nó trở thành ứng viên tiềm năng cho học hồi quy  |
| Ms Pacman | Trò chơi vượt màn, có bóng ma nhấp nháy và viên thuốc sức mạnh |
|Frostbite|Trò chơi đi cảnh (platform)|
| Beam Rider | Trò chơi bắn súng |
| Centipede | Trò chơi bắn súng |
| Chopper Command | Trò chơi bắn súng |
|Ice Hockey|Trò chơi thể thao|
|Double Dunk|Trò chơi thể thao|
|Bowling|Trò chơi thể thao|
 

 - [Trang chơi game Atari 2600 trực tuyến](https://www.free80sarcade.com/all2600games.php)

##  6. Hàm mất mát và hàm phần thưởng
**Hàm mất mát** (Loss Function): tác giả bài báo chủ yếu đề xuất mô hình mạng nơ-ron dựa trên DRQN, không thay đổi thuật toán học tăng cường của DQN, vẫn dùng hàm mất mát của DQN để khớp mô hình mạng nơ-ron (hàm giá trị hành động, Action-Value Function).
$$\mathcal{L}_{i}\left(\theta_{i}\right)=\mathbb{E}_{\left(s, a, r, s^{\prime}\right) \sim \mathcal{D}}\left[\left(y_{i}-Q\left(s, a ; \theta_{i}\right)\right)^{2}\right] \\
y_{i}=r+\gamma \max _{a^{\prime}} \hat{Q}\left(s^{\prime}, a^{\prime} ; \theta^{-}\right)
$$

**Hàm phần thưởng** (Reward Function): môi trường nhiệm vụ bài báo dùng là môi trường trò chơi Atari 2600, tùy theo nhiệm vụ trò chơi khác nhau, môi trường đều có sẵn hàm phần thưởng, không cần định nghĩa thêm.

##  7. Chứng minh thực nghiệm
### 1. Flickering Pong POMDP (Pong nhấp nháy, quá trình quyết định Markov quan sát được một phần)
DQN chuyển quá trình quyết định Markov quan sát được một phần (POMDP) thành quá trình quyết định Markov (MDP) bằng cách đưa vào bốn khung hình cuối cùng chứa quan sát (obs) hiện tại.

**Mục đích thực nghiệm**: để kiểm chứng DRQN có tính bền vững với đầu vào mờ liên tiếp trong môi trường trò chơi mang tính chất POMDP, đưa vào <font color="##00dd00"> **Flickering Pong POMDP** </font>, một bản sửa đổi của trò chơi Pong.

![Mô tả hình ảnh](https://img-blog.csdnimg.cn/bc8e3f4cd3dd4d94800a7513878e24ed.jpeg#pic_center)

**Thiết kế thực nghiệm**: ở mỗi bước thời gian, xác suất khung hình trò chơi hiển thị đầy đủ hoặc bị làm mờ hoàn toàn là **$p=0.5$**. Bằng cách này, môi trường trò chơi Flickering Pong có một nửa xác suất khung hình bị làm mờ, khiến quan sát (obs) tác tử nhận được mang tính chất POMDP.
	Để kiểm chứng:
	① Tầng tích chập (CNN) trong mô hình mạng nơ-ron DQN có khả năng phát hiện **tốc độ, hướng** di chuyển của vật thể trong khung hình quan sát bị mờ: trong môi trường Flickering Pong, đưa 10 khung hình cuối cùng chứa khung hình quan sát hiện tại vào mô hình, và xác nhận bằng trực quan hóa.
	② Tầng LSTM trong mô hình mạng nơ-ron DRQN có khả năng phát hiện đặc trưng lịch sử của vật thể trong khung hình quan sát bị mờ: trong môi trường Flickering Pong, chỉ đưa khung hình quan sát hiện tại vào mô hình, và xác nhận bằng trực quan hóa.

**Baseline của thực nghiệm**: mô hình mạng nơ-ron DQN (đầu vào gồm **10 khung hình cuối cùng** chứa khung hình quan sát hiện tại).
![Mô tả hình ảnh](https://img-blog.csdnimg.cn/546d50dc3b304bd180d9249ef68fac6c.jpeg#pic_center)

Hiện tượng: ở tầng tích chập thứ nhất, các bộ lọc chủ yếu phát hiện **vợt** trong môi trường Flickering Pong.

![Mô tả hình ảnh](https://img-blog.csdnimg.cn/3b3496b9e9174983a6de6bccf43f65b5.jpeg#pic_center)

Hiện tượng: ở tầng tích chập thứ hai, các bộ lọc bắt đầu phát hiện **vợt** và hướng di chuyển của **bóng** trong môi trường Flickering Pong, ở một số trạng thái bộ lọc cũng có thể đồng thời phát hiện **vợt, bóng**.

![Mô tả hình ảnh](https://img-blog.csdnimg.cn/51a7ccd1c2ac4979a85451039d3c6581.jpeg#pic_center)

Hiện tượng: ở tầng tích chập thứ ba, các bộ lọc đều có thể phát hiện tương tác giữa **vợt** và **bóng**, gồm sự lệch hướng, tốc độ và hướng di chuyển của bóng.

**Thực nghiệm**: để kiểm chứng tầng LSTM trong mô hình mạng nơ-ron DRQN có thể phát hiện đặc trưng chuỗi giữa các khung hình, ở mỗi bước thời gian chỉ đưa **1 khung hình** quan sát (obs) hiện tại vào mô hình DRQN.
![Mô tả hình ảnh](https://img-blog.csdnimg.cn/ccce1ab20f8f48cb813e8cd55e11e661.jpeg#pic_center)

Hiện tượng: các đơn vị của tầng LSTM có thể thông qua từng khung hình quan sát đơn có nhấp nháy, phát hiện các sự kiện cấp cao trong môi trường Flickering Pong, ví dụ **bóng bật lại từ tường**,...

**Kết luận thực nghiệm**: so sánh giữa **đưa 10 khung hình quan sát liên tiếp vào DQN có tầng tích chập** và **đưa 1 khung hình quan sát vào DRQN có tầng LSTM**, kết quả cho thấy cả hai đều có thể phát hiện đặc trưng lịch sử của khung hình trò chơi. Dựa trên điều này, khi môi trường nhiệm vụ có tính chất POMDP, cả hai phương pháp trên đều có thể lựa chọn. Chứng minh **dùng tầng mạng nơ-ron LSTM có thể tích hợp đặc trưng chuỗi trong khung hình quan sát đơn có đặc trưng chuỗi thời gian**.

### 2. Evaluation on Standard Atari Games (Đánh giá trên các trò chơi Atari tiêu chuẩn)
**Mục đích thực nghiệm**: để so sánh hiệu năng của mô hình mạng nơ-ron DRQN do tác giả đề xuất và mô hình mạng nơ-ron DQN dựa trên mạng nơ-ron tích chập (CNN) trong các môi trường nhiệm vụ trò chơi Atari 2600 tiêu chuẩn, dùng 9 môi trường trò chơi Atari 2600 khác nhau để đánh giá tổng hợp.

**Thiết kế thực nghiệm**: để nhiệm vụ thỏa mãn tính chất MDP, đặt đầu vào là 4 khung hình cuối cùng chứa khung hình quan sát hiện tại. Và dùng **kiểm định t độc lập** để tính ý nghĩa thống kê của điểm số, mức ý nghĩa $P=0.05$

**Baseline của thực nghiệm**: hiệu năng của mô hình mạng nơ-ron DQN dựa trên mạng nơ-ron tích chập (CNN) trong 9 môi trường nhiệm vụ trò chơi Atari 2600 tiêu chuẩn.

![Mô tả hình ảnh](https://img-blog.csdnimg.cn/f170708f803747e3aee9a8cdf309f1b2.jpeg#pic_center)

**Kết luận thực nghiệm 1**: trong 9 môi trường nhiệm vụ trò chơi khác nhau, điểm của tác tử dựa trên mô hình mạng nơ-ron DRQN tốt hơn tác tử dựa trên mô hình mạng nơ-ron DQN ở 5 môi trường.

![Mô tả hình ảnh](https://img-blog.csdnimg.cn/58c104a1cbf04577821b81daf750d6f2.jpeg#pic_center)

**Kết luận thực nghiệm 2**: DRQN thể hiện kém rõ rệt so với DQN trong trò chơi Beam Rider.

<font color="#dd00dd">*Phân tích cá nhân*</font>: có thể **căn cứ ra quyết định** trong trò chơi Beam Rider không cần đặc trưng của các khung hình quan sát quá xa về thời gian, chủ yếu dựa vào đặc trưng của khung hình quan sát tức thời hiện tại. Tầng LSTM được thêm vào lại đưa vào quá nhiều đặc trưng không cần thiết, gây nhiễu cho việc ra quyết định của tác tử.

![Mô tả hình ảnh](https://img-blog.csdnimg.cn/35f6f6bcd64044eeb9b6c835c49cfbdf.jpeg#pic_center)

**Kết luận thực nghiệm 3**: DRQN thể hiện tốt nhất trong trò chơi Frostbite. Nhiệm vụ của trò chơi là yêu cầu người chơi nhảy qua cả bốn hàng tảng băng đang di chuyển và quay lại đỉnh màn hình. Sau nhiều lần vượt qua các tảng băng, đã thu thập đủ khối băng, có thể xây một ngôi nhà băng (igloo) ở góc trên bên phải màn hình. Sau đó người chơi có thể vào nhà băng để sang màn tiếp theo.

<font color="#dd00dd">*Phân tích cá nhân*</font>: nhiệm vụ trò chơi Frostbite có tính chất ra quyết định dài hạn, vì vậy tầng LSTM của DRQN có thể học được đặc trưng dài hạn, căn cứ ra quyết định của tác tử có thể vượt ra ngoài đặc trưng của 4 khung hình quan sát đưa vào mô hình.

### 3. MDP to POMDP Generalization (Khả năng tổng quát hóa từ MDP sang POMDP)
**Mục đích thực nghiệm**: để đánh giá chính sách $\pi$ mà tác tử dựa trên mô hình DRQN học được trên MDP tiêu chuẩn (đầu vào là 4 khung hình cuối cùng chứa khung hình quan sát hiện tại), khi mở rộng sang cùng môi trường nhiệm vụ trò chơi nhưng mang tính chất POMDP, chính sách $\pi$ của tác tử có còn giữ được hiệu quả hay không?

**Thiết kế thực nghiệm**: chọn 9 môi trường nhiệm vụ trò chơi Atari 2600 của thực nghiệm 2 để đặt chế độ nhấp nháy (Flickering), ở mỗi bước thời gian, xác suất khung hình trò chơi hiển thị đầy đủ $p$ lần lượt từ 0.1~0.9, dùng tác tử đã huấn luyện để thực nghiệm.

**Baseline của thực nghiệm**: tỉ lệ phần trăm điểm gốc (Percentage Original Score) của mô hình mạng nơ-ron DQN dựa trên mạng nơ-ron tích chập (CNN) trong môi trường nhiệm vụ trò chơi Atari 2600 mang tính chất POMDP.

![Mô tả hình ảnh](https://img-blog.csdnimg.cn/101d6ad616054961ac513535ee0efb8e.jpeg#pic_center)

**Kết luận thực nghiệm**: tác tử dựa trên mô hình DRQN và tác tử dựa trên mô hình DQN được huấn luyện trên MDP tiêu chuẩn, lần lượt được đánh giá trong môi trường trò chơi có chế độ nhấp nháy (Flickering), quan sát qua biểu đồ đường thấy, mức giảm hiệu năng của tác tử dựa trên mô hình DRQN nhỏ hơn so với tác tử dựa trên mô hình DQN.
$$Percentage\,Original\,Score=\frac{ {\textstyle \sum_{i=1}^{9}}POMDP\,Score }{ {\textstyle \sum_{i=1}^{9}}MDP\,Score }  \\
 i\  is\  the\  number\  of\  game\  environments$$

##  8. Công trình liên quan
### 1. Ưu thế của LSTM so với RNN trong việc giải quyết nhiệm vụ mang tính chất POMDP
Trong bài báo <font color="#660000"> *Reinforcement learning with long shortterm memory (Bakker et al., 2001)* </font>, trên các môi trường Corridor và Cartpole mang tính chất POMDP, dùng mạng nơ-ron LSTM làm bộ xấp xỉ hàm lợi thế (Advantage Function) trong học tăng cường, có thể hoàn thành nhiệm vụ tốt hơn so với dùng mạng nơ-ron RNN. Dù số lượng đặc trưng của không gian trạng thái và không gian hành động của các môi trường Corridor và Cartpole đều rất ít so với môi trường trò chơi Atari 2600!

### 2. Khung giải quyết nhiệm vụ mang tính chất POMDP bằng LSTM
Bài báo <font color="#660000"> *Solving deep memory POMDPs with recurrent policy gradients (Wierstra et al., 2007)* </font> lần đầu dùng gradient chính sách (Policy Gradient) kết hợp mạng nơ-ron LSTM để giải quyết bài toán mang tính chất POMDP. Nhưng về trích xuất đặc trưng, mô hình dùng đặc trưng thiết kế thủ công, chưa kết hợp mô hình mạng nơ-ron sâu để tự động trích xuất đặc trưng.

##  9. Kết luận
1.	Tác tử dựa trên mô hình DRQN khi xử lý quan sát (obs) trong môi trường trò chơi Atari 2600 mang tính chất POMDP, chỉ cần đầu vào là một khung hình quan sát đơn, đã đạt được đặc trưng lịch sử tương đương với tác tử dựa trên mô hình DQN có đầu vào 10 khung hình quan sát liên tiếp. Tức là dùng mô hình DRQN có thể giảm độ phức tạp tính toán.
2.	Tùy theo thuộc tính nhiệm vụ khác nhau của môi trường trò chơi Atari 2600 tiêu chuẩn, trong các nhiệm vụ cần tiếp nhận đặc trưng dài hạn (ví dụ trò chơi Frostbite), hiệu năng của tác tử dựa trên mô hình DRQN sẽ vượt xa tác tử dựa trên mô hình DQN.
3.	Khi tác tử dựa trên mô hình DRQN gặp tình huống POMDP trong cùng môi trường trò chơi Atari 2600, khả năng tổng quát hóa của nó sẽ tốt hơn tác tử dựa trên mô hình DQN.

> Ghi chú của người dịch: ở kết luận 3, bản gốc viết "tốt hơn tác tử dựa trên mô hình **DRQN**" (tự so sánh với chính nó); theo thực nghiệm 3 ở trên, đối tượng so sánh đúng là **DQN**, bản dịch đã sửa.

##  10. Đóng góp
Bài báo chứng minh qua thực nghiệm rằng, tác tử dựa trên mô hình DRQN có thêm **mạng nơ-ron LSTM**, khi đối mặt với các bài toán mang tính chất POMDP, có hiệu năng tốt hơn DQN. Nhưng trong thực tế, vẫn cần tùy vào tình hình thực tế của nhiệm vụ. Tính tổng quát không cao, không mang lại cải thiện mang tính hệ thống.

##  11. Công việc tiếp theo
### 1. Ở mức thuật toán học tăng cường
Trong nhiệm vụ có không gian trạng thái liên tục, không gian hành động rời rạc, có **thuật toán D3QN** kết hợp **Double DQN** và **Dueling DQN**. Có thể dùng thuật toán học tăng cường D3QN để thực nghiệm trên kiến trúc mô hình mạng nơ-ron DRQN mà bài báo này đề xuất, quan sát xem ở các môi trường nhiệm vụ mà tác tử thể hiện không tốt trong thực nghiệm của bài báo này (ví dụ trò chơi Beam Rider) có thể được nâng cao hiệu năng hay không, và đạt được cải thiện mang tính hệ thống.

### 2. Ở mức môi trường nhiệm vụ
Trong các tình huống nhiệm vụ thuộc lĩnh vực điều khiển máy bằng học tăng cường, tác tử không chỉ cần học đặc trưng chuỗi thời gian từ quan sát (obs) do môi trường đưa ra, mà còn cần đưa hành động (Action) do chính tác tử đưa ra vào làm một phần của quan sát để học. Kỳ vọng sau này **chính sách $\pi$** mà tác tử đã huấn luyện có thể vừa cân nhắc quan sát do môi trường đưa ra, vừa đưa các hành động lịch sử vào phạm vi cân nhắc, để đưa ra các hành động quyết định liền mạch và hợp lý.

![Mô tả hình ảnh](https://img-blog.csdnimg.cn/459978a6449543cdb35468c7c65fc6dc.gif#pic_center)
### 3. Ở mức mô hình mạng nơ-ron sâu
Với sự xuất hiện của mô hình mạng nơ-ron Transformer lấy cơ chế tự chú ý (self-attention) làm cốt lõi, Transformer từ bỏ CNN và RNN truyền thống, chỉ dùng cơ chế chú ý (Attention). Đồng thời sự xuất hiện của Vision Transformer phá vỡ ranh giới giữa lĩnh vực NLP và lĩnh vực CV, các mô hình ra quyết định đại diện bởi Transformer trở thành mô hình (paradigm) mới của lĩnh vực RL hiện nay.
Vậy liệu trên môi trường nhiệm vụ trò chơi Atari 2600 cũng lấy hình ảnh làm quan sát, có thể lấy thuật toán DQN làm nền tảng, dùng **mô hình dựa trên Vision Transformer** để khớp hàm giá trị, từ đó học ngầm chính sách $\pi$, với kỳ vọng tác tử có thể đạt hiệu năng tốt hơn!


##  Tài liệu tham khảo
1.	Volodymyr Mnih, J. et al. 2013. Playing Atari with Deep Reinforcement Learning.
2.	Wierstra, D.; Foerster, A.; Peters, J.; and Schmidthuber, J. 2007. Solving deep memory POMDPs with recurrent policy gradients.
3.	Bakker, B. 2001. Reinforcement learning with long shortterm memory. In NIPS, 1475–1482. MIT Press.
4.	[Mô hình hóa chuỗi trong hệ gợi ý: Session-based neural recommendation (推荐中的序列化建模)](https://zhuanlan.zhihu.com/p/30720579)
5.	[Mười câu hỏi về bài báo - khung để nhanh chóng hiểu ý chính bài báo (论文十问)](https://www.cnblogs.com/xuyaowen/p/raad-paper.html)
6.	[Khóa học hè học tăng cường RLChina 2022](http://rlchina.org/topic/491)
7.	[Sách Nấm EasyRL (蘑菇书EasyRL)](https://github.com/datawhalechina/easy-rl)

====================================<br>
Tác giả: Lin Junjie (林俊杰)<br>
Đơn vị nghiên cứu: Viện Nghiên cứu Thông tin và Hệ thống Sản xuất, Đại học Thành Công (Đài Loan)<br>
Hướng nghiên cứu: học tăng cường, học sâu<br>
Email liên hệ: 554317150@qq.com
