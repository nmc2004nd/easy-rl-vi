
# Emergence of Locomotion Behaviours in Rich Environments (Sự xuất hiện của hành vi vận động trong môi trường phong phú)
Tác giả: Nicolas Heess, Dhruva TB et al. 
Đơn vị: DeepMind 
Tạp chí công bố: Artificial Intelligence Computer and information sciences
Thời gian công bố: 10 Jul 2017 
Địa chỉ xem bài báo: https://arxiv.org/abs/1707.02286

**Đóng góp của bài báo**: thông qua việc thiết lập môi trường huấn luyện, theo kiểu chương trình học (curriculum), để tác tử học tăng cường học dần từ nhiệm vụ đơn giản trong môi trường phong phú, và tăng độ khó nhiệm vụ cùng với sự tăng cường hiệu năng của tác tử để học liên tục. Chứng minh rằng trong trường hợp tín hiệu phần thưởng hạn chế, có thể thông qua thiết kế môi trường để tác tử có được hành vi phong phú và hiệu quả, mà không cần đi quá sâu vào thiết kế hàm phần thưởng.

##  1. Động cơ viết bài
<font size="4">**Why:**</font> 
Trong lĩnh vực học tăng cường sâu, cùng với sự trỗi dậy của các thuật toán gradient chính sách (Policy gradient), đã đạt được tiến bộ đáng kể trong các nhiệm vụ có không gian trạng thái liên tục và không gian hành động liên tục. Nhưng đều cần định nghĩa hàm phần thưởng (Reward function) rõ ràng theo đặc tính nhiệm vụ và dùng tín hiệu phần thưởng (Reward) để tối ưu chính sách $`\pi _{\theta}`$ của tác tử, dẫn dắt hành vi của tác tử hoạt động như mong đợi. Nhưng trong môi trường nhiệm vụ có hành vi phức tạp, thường thì hàm phần thưởng khi đối mặt với các hành động phức tạp này, dẫn dắt tác tử không rõ rệt, tức là tác tử rất khó học được hành vi phức tạp.

<font size="4">**What:**</font> 
Thiết kế hàm phần thưởng rất quan trọng với nhiệm vụ học tăng cường, chỉ một thay đổi nhỏ của hàm phần thưởng cũng ảnh hưởng đến hành vi của tác tử. Phần thưởng tức thời do hàm phần thưởng sinh ra có thể biểu diễn là $`r=R(s,a)`$. Vì vậy với môi trường nhiệm vụ có hành vi phức tạp, để điểm số của tác tử trong môi trường có thể hội tụ, người ta sẽ thiết kế hàm phần thưởng theo hướng thận trọng. Nhưng đồng thời hàm phần thưởng thận trọng sẽ **né tránh** thách thức chính của học tăng cường: tác tử học trực tiếp từ tín hiệu phần thưởng hạn chế và dẫn dắt chính sách, với kỳ vọng tác tử có được hành vi phong phú và hiệu quả.

<font size="4">**How:**</font> 
Tác giả bài báo đề xuất, trong trường hợp bản thân môi trường đủ phong phú và đa dạng, dùng phương pháp **thiết lập môi trường (chướng ngại vật) với các mức độ khó khác nhau để dẫn dắt tác tử tìm ra phương án giải quyết vấn đề từ môi trường hạn chế**, thì có thể dùng hàm phần thưởng đơn giản để sinh ra hành vi phong phú và bền vững. Thiết lập như vậy vừa có thể tránh quá khớp do hàm phần thưởng và môi trường nhiệm vụ gây ra, vừa giúp tác tử tìm được phương án giải quyết đặc thù áp dụng được cho mọi thách thức của môi trường.

##  2. Giới thiệu bối cảnh
### 1. Policy Gradient (Gradient chính sách)
Thuật toán gradient chính sách học trực tiếp chính sách $`\pi`$, trong học tăng cường sâu dùng mạng nơ-ron sâu để khớp hàm chính sách (Policy function), vì vậy mục tiêu với chính sách ngẫu nhiên $`\pi{_\theta}(a|s)`$ là mong muốn tối ưu tham số mạng nơ-ron $`\theta`$ để chính sách $`\pi{_\theta}`$ tối đa hóa lợi tức kỳ vọng của hành vi
```math
J(\theta)= \mathbb{E}_{\rho_{\theta}(\tau ) }\left [  {\textstyle \sum_{t}^{}\gamma^{t-1} r (s_t,a_t)}  \right ]
```
Trong đó $`\tau`$ là quỹ đạo có được khi tác tử tương tác với môi trường động: $`\tau=(s_0,a_0,s_1,a_1\dots )`$  

Các yếu tố chính dẫn dắt chuyển trạng thái gồm chính sách của tác tử $`\pi{_\theta}`$ và xác suất chuyển trạng thái được thiết lập sẵn của bản thân môi trường, là:  
```math
p(s_{t+1}|s_t,a_t)\text{, trong đó } a_t=\pi{_\theta}(s_t)
```
Xác suất xảy ra quỹ đạo $`\tau`$ là:  
```math
\begin{gathered}
\rho _{\theta }(\tau) = p(s_0)\pi (a_0|s_0)p(s_1|s_0,a_0)\dots \\=p(s_0)\prod_{t=1}^{T}p_{\theta}(a_t|s_t)p(s_{t+1}|s_t,a_t)
\end{gathered}
```
Ước lượng giá trị của trạng thái $`s_t`$ dùng phương pháp Monte Carlo (Monte-Carlo), dùng $`R_t`$ với hệ số chiết khấu $`\gamma`$ để biểu diễn phần thưởng tích lũy tương lai của mỗi bước:  
```math
\begin{gathered}
R_t= {\textstyle \sum_{t^{'}=t}^{}\gamma^{t^{'}-t}r(s_{t^{'}},a_{t^{'}})} \\= r(s_{t^{'}},a_{t^{'}})+\gamma R_{t+1}
\end{gathered}
```
Lấy đạo hàm gradient theo tham số mạng nơ-ron sâu $`\theta`$ của chính sách $`\pi{_\theta}`$:
```math
\nabla_{\theta }J=\mathbb{E}_{\theta}\left [  {\textstyle \sum_{t}^{}\nabla_{\theta }\log\pi_{\theta}(a_t|s_t)(R_t-b_t)}  \right ]
```
Ở đây $`b_t`$ làm đường cơ sở (Baseline), đại diện cho phần thưởng kỳ vọng tích lũy trung bình trong tương lai ở trạng thái $`s_t`$, thường được ước lượng bằng hàm giá trị (Value Function).
```math
b_t=V^\theta (s_t)=\mathbb{E}\left [ R_t|s_t \right ]
```

### 2. Proximal Policy Optimization (Tối ưu chính sách cận kề)
Khi dùng thuật toán gradient chính sách, các vấn đề cần đối mặt gồm:  
① Dùng phần thưởng tích lũy từ cùng một quỹ đạo để cập nhật gradient, sẽ gặp rắc rối với phương sai (Variance) cao;  
② Ở một số vị trí then chốt, dễ do chính sách sinh ra hành động kém mà rơi vào phân phối trạng thái, hành động không tốt, muốn quay lại thì phải đi một đoạn đường rất dài 

<div align=center><img src="https://img-blog.csdnimg.cn/b71ac8cbce4f47bc93bb2045d7f490ad.png#pic_center" alt="Sơ đồ nguyên lý TRPO" style="zoom:67%;" /></div>

Đối mặt với các vấn đề trên, ① cần giảm phương sai cao. ② cần chọn một bước phù hợp, để giá trị lợi tức (lợi tức còn gọi là phần thưởng tích lũy) mà chính sách mới có được sau mỗi lần cập nhật không giảm một cách đơn điệu.  

Phương pháp vùng tin cậy (Trust region) đề xuất trong thuật toán **tối ưu chính sách vùng tin cậy** (Trust region policy optimization, TRPO) là phương pháp cập nhật bước cao cấp hơn, nghĩa là cập nhật trong vùng này thì giá trị lợi tức mà chính sách đạt được không giảm một cách đơn điệu.

Nhưng thuật toán TRPO, để tránh tính nghịch đảo ma trận $`\theta ^{'}=\theta+\alpha F^{-1}\nabla _{\theta }J(\theta)`$, dùng tối ưu bậc hai, giải bằng phương pháp gradient liên hợp, tránh tính nghịch đảo của ma trận $`F`$

Mục tiêu tối ưu của TRPO:
```math
maximize_{\theta^{'}}\mathbb{E}_{\tau \sim \rho_{\theta}(\tau)}\left [  {\textstyle \sum_{t=0}^{\infty }\frac{\pi_{\theta^{'}}(a_t|s_t)}{\pi_{\theta}(a_t|s_t)}\gamma^{t}A_{\pi\theta}(s_t,a_t) }  \right ]
```

```math
D_{KL}\left ( \pi_{\theta}\left ( a_t|s_t \right ) | \pi_{\theta^{'}}\left ( a_t|s_t \right ) \right ) \le \epsilon
```

Thuật toán **tối ưu chính sách cận kề** (Proximal policy optimization, PPO) đơn giản hóa về mặt kỹ thuật dựa trên thuật toán TRPO
```math
maximize_{\theta^{'}}\mathbb{E}_{\tau \sim \rho_{\theta}(\tau)}\left [  {\textstyle \sum_{t=0}^{\infty }\frac{\pi_{\theta^{'}}(a_t|s_t)}{\pi_{\theta}(a_t|s_t)}\gamma^{t}A_{\pi\theta}(s_t,a_t) }  \right ]- \beta [D_{KL}\left ( \pi_{\theta}\left ( a_t|s_t \right ) | \pi_{\theta^{'}}\left ( a_t|s_t \right ) \right ) - \epsilon ]
```
Đưa ràng buộc $`D_{KL}`$ vào mục tiêu tối ưu bằng phương pháp nhân tử Lagrange, đưa vào siêu tham số $`\beta`$ để điều chỉnh. Như vậy có thể **tự thích nghi** điều chỉnh hệ số phạt KL, giúp chính sách cập nhật trong **vùng tin cậy (Trust region)**.

**PPO with Adaptive KL Penalty**
![Mô tả hình ảnh](https://img-blog.csdnimg.cn/8bc5dc728b5a4339963827c04ce8b1b9.png#pic_center)

**Học tăng cường có khả năng mở rộng dựa trên PPO phân tán**
Bài báo xét thấy môi trường sử dụng đủ phong phú và đa dạng, vì vậy trên cơ sở thuật toán PPO, đề xuất phiên bản phân tán **DPPO (Distributed PPO)**, và lần lượt thực nghiệm với phương pháp **cập nhật đồng bộ (Synchronize, Sync)** và **cập nhật bất đồng bộ (Asynchronous, Async)**, phát hiện trong thực tế dùng phương pháp **cập nhật đồng bộ** có được kết quả tốt hơn.

![Mô tả hình ảnh](https://img-blog.csdnimg.cn/e4608f46ac4649528332dbf955fd55c1.png#pic_center)
Phương pháp cập nhật đồng bộ dùng một bộ điều phối (Coordinator) theo thời gian, đợi các luồng hoàn thành nhiệm vụ của mình trước, rồi tính trung bình gradient của các luồng, sau đó cập nhật tham số thống nhất.

Trong <font color="#660000"> *Asynchronous Methods for Deep Reinforcement Learning(Volodymyr Mnih  et al., 2016)*  </font>, với phương pháp cập nhật bất đồng bộ đã thiết lập cửa sổ thời gian $`K`$ bước để tính giá trị lợi tức. Bài báo này cũng kết hợp phần thưởng tích lũy từ $`K`$ bước với hàm lợi thế (Advantage function), và tự cập nhật (Bootstrap) từ hàm giá trị sau $`K`$ bước.  

Hàm lợi thế $`K`$ bước (K-steps) là:
```math
\hat{A}_t= {\textstyle \sum_{i=1}^{K}\gamma ^{i-1}r_{t+i}+\gamma ^{K-1}V_\phi (s_{t+K})-V_\phi (s_{t})}
```

### 3. Đánh giá PPO phân tán
Để xác định thuật toán DPPO có thể tối ưu chính sách bền vững với việc chỉnh tham số hạn chế, và mở rộng đa luồng hiệu quả. Bằng cách chọn số luồng để so sánh với hai phương án thuật toán thay thế khác (TRPO và Continuous A3C), có 3 môi trường nhiệm vụ chuẩn để so sánh. Trong đó hai cái là **nhiệm vụ vận động trong môi trường không chướng ngại vật**, cái thứ ba là **nhiệm vụ đạt mục tiêu trên mặt phẳng cần trí nhớ**. Môi trường nhiệm vụ đều được xây dựng dựa trên engine vật lý [Mujoco](https://mujoco.org/).

<div align=center><img src="https://img-blog.csdnimg.cn/8065f3ac399845618ec6c0e9e5ce38c9.jpeg#pic_center" alt="Robot hai chân" style="zoom:67%;" /></div>

**Robot hai chân (Planar walker)**: có 9 bậc tự do và 6 khớp dẫn động bằng mô-men. Phần thưởng chính tỉ lệ thuận với tốc độ tiến về phía trước, các điều khoản bổ sung là phạt điều khiển và vi phạm giới hạn về chiều cao và góc thân. Khi robot hai chân ngã, lượt (Episode) kết thúc sớm.

<div align=center><img src="https://img-blog.csdnimg.cn/3c254a07aa154cd6b59edcd728c27afd.jpeg#pic_center" alt="Robot hình người" style="zoom:67%;" /></div>

**Robot hình người (Humanoid)**: có 28 bậc tự do và 21 khớp dẫn động. Phần thưởng chính chủ yếu tỉ lệ thuận với tốc độ dọc trục x, cộng với một phần thưởng không đổi mỗi bước, cùng với việc kết thúc lượt khi ngã, khuyến khích nó không ngã.

> Ghi chú của người dịch: bản gốc viết "21 个切割关节" (21 khớp cắt), theo bài báo là 21 khớp dẫn động (actuated joints).

<div align=center><img src="https://img-blog.csdnimg.cn/519fe08b4ef44d868854b425bd1991ec.jpeg#pic_center" alt="Memory Reacher" style="zoom:67%;" /></div>

**Cánh tay máy có trí nhớ (Memory reacher)**: một cánh tay máy 2 DoF đơn giản bị giới hạn trên mặt phẳng. Vị trí mục tiêu được cung cấp trong 10 bước đầu của lượt, trong thời gian này không được di chuyển cánh tay. Khi cho phép cánh tay di chuyển, mục tiêu đã biến mất, phải dựa vào trí nhớ của mạng nơ-ron hồi quy RNN (Recurrent neural networks, RNN) mới giúp cánh tay đến đúng vị trí mục tiêu. Phần thưởng của nhiệm vụ này là khoảng cách giữa bộ phận chấp hành cuối và vị trí mục tiêu, chọn nhiệm vụ này để kiểm tra khả năng tối ưu chính sách mạng nơ-ron hồi quy của thuật toán DPPO.

![Mô tả hình ảnh](https://img-blog.csdnimg.cn/80f70d734e3d4bdcb710f429c9f71b1d.jpeg#pic_center)
Phân tích **kết quả** kiểm tra trong ba môi trường nhiệm vụ:
Từ hình trên có thể thấy, thuật toán DPPO có hiệu năng tương tự thuật toán TRPO, và khi mở rộng số luồng, có thể giảm rõ rệt thời gian hội tụ của huấn luyện và có được giá trị lợi tức cao hơn. Và vì thuật toán PPO dựa trên thuật toán gradient chính sách, có thể trực tiếp dùng mạng nơ-ron hồi quy (RNN) để khớp hàm chính sách, cũng áp dụng được trong môi trường nhiệm vụ cánh tay máy có trí nhớ.

##  3. Phương pháp: môi trường và mô hình
Mục tiêu nghiên cứu của bài báo là xem dùng hàm phần thưởng cơ bản, đơn giản có thể giúp tác tử nắm vững các kỹ năng vận động phức tạp từ việc học các thách thức khác nhau và một loạt mức độ khó hay không. Sau khi đã kiểm chứng tính áp dụng của thuật toán DPPO có khả năng mở rộng trong 3 môi trường nhiệm vụ benchmark trình bày ở phần 2. Thông qua một số thiết lập về môi trường để minh họa sự xuất hiện của hành vi phức tạp hơn.
### 1. Môi trường huấn luyện
Để tác tử đối mặt với nhiều loại thách thức vận động, dùng môi trường mô phỏng vật lý tương tự trò chơi platform và hiện thực bằng engine vật lý Mujoco. Sẽ sinh theo chương trình một lượng lớn địa hình khác nhau với nhiều loại chướng ngại vật; và địa hình cũng như chướng ngại vật sinh ra ở mỗi lượt đều khác nhau.

**Cơ thể**
Tác tử được xét có ba loại cơ thể điều khiển bằng mô-men khác nhau, lần lượt là robot hai chân (Planar walker), robot hình người (Humanoid), robot bốn chân (Quadruped); trong đó robot hai chân và robot hình người đã được giải thích ở phần 2, ở đây chủ yếu giới thiệu robot bốn chân.
<div align=center><img src="https://img-blog.csdnimg.cn/2d36049a78784c398c2ec228cba6f38d.jpeg#pic_center" alt="Robot bốn chân" style="zoom:67%;" /></div>
Robot bốn chân (Quadruped): một cơ thể động vật bốn chân ba chiều đơn giản, có 12 bậc tự do và 8 khớp dẫn động.

**Phần thưởng**
Nghiên cứu này giữ hàm phần thưởng của mọi môi trường nhiệm vụ đơn giản và nhất quán giữa các địa hình. Phần thưởng gồm một phần chính tỉ lệ thuận với tốc độ trên trục $`X`$, để khuyến khích tác tử tiến về phía trước dọc theo đường đua, hàm phần thưởng còn thêm một số hạng nhỏ phạt mô-men.

 Với robot hai chân (Planar walker), hàm phần thưởng còn bao gồm ràng buộc khung tư thế giống phần 2. Với robot bốn chân (Quadruped) và robot hình người (Humanoid), hàm phần thưởng thêm phạt hành vi lệch khỏi tâm đường đua, và robot hình người mỗi bước thời gian nếu không ngã còn nhận được phần thưởng thêm. 

So sánh ba cấu trúc cơ thể khác nhau, có thể thấy trực quan cấu tạo vật lý của chúng khác nhau, có sự khác biệt. Sự khác biệt về hàm phần thưởng giữa các cơ thể được đề xuất trước khi điều chỉnh thực nghiệm, không được điều chỉnh đặc biệt kỹ lưỡng. Vì vậy hàm phần thưởng sẽ khác nhau một chút trên các tác tử có cấu trúc cơ thể khác nhau, nhưng không có thay đổi khác biệt lớn nào với hàm phần thưởng để gây ra các hành vi khác nhau của từng cơ thể.

**Địa hình và chướng ngại vật**
Để tác tử học từ các thách thức khác nhau và một loạt mức độ khó, trong mỗi lượt mới, địa hình và chướng ngại vật của môi trường nhiệm vụ đều được sinh lại theo dữ liệu thống kê hiệu năng của tác tử. Các loại địa hình và chướng ngại vật được xét gồm:
![Mô tả hình ảnh](https://img-blog.csdnimg.cn/331cb68918e04bd4a72af79ef9c25328.png#pic_center)
Rào chắn: chướng ngại vật kiểu rào có chiều cao và chiều rộng thay đổi cần nhảy qua hoặc trèo qua.  
Khe hở: khe hở trên mặt đất phải nhảy qua.
Địa hình biến đổi: địa hình có các đặc trưng khác nhau, ví dụ dốc, khe hở, đồi,...  
Tường chắn: các bức tường tạo thành chướng ngại vật cần đi vòng.  
Bệ: bệ lơ lửng phía trên mặt đất, có thể nhảy lên hoặc cúi xuống bên dưới.  

Bài báo dựa trên các loại địa hình và chướng ngại vật trên để thiết lập môi trường huấn luyện tác tử học các kỹ năng vận động phức tạp. Có hai cách thiết lập môi trường có thể chọn. Lần lượt là:
① Môi trường chướng ngại vật một loại (chướng ngại vật trong mỗi lượt đều giống nhau).
② Môi trường chướng ngại vật hỗn hợp (chướng ngại vật trong mỗi lượt có nhiều hơn một loại).
Đồng thời xét hai cách thiết lập môi trường: số chướng ngại vật mỗi lượt như nhau để độ dài lượt (số bước) như nhau, và độ khó địa hình tăng dần số chướng ngại vật theo hiệu năng của tác tử để độ dài lượt dài ra.

**Quan sát (Observations)**
Tác tử nhận được hai nhóm kết quả quan sát trong môi trường:
① Đặc trưng từ bản thân cơ thể (proprioceptive): chủ yếu gồm góc khớp và vận tốc góc, và với robot bốn chân, robot hình người còn gồm số đọc của đồng hồ đo vận tốc, gia tốc kế và con quay hồi chuyển ở thân, cung cấp thông tin vận tốc và gia tốc lấy bản thân làm trung tâm, cùng các cảm biến tiếp xúc nối với bàn chân và chân. Các khớp chi dưới của robot hình người cũng có cảm biến mô-men để lấy đặc trưng.  
② Đặc trưng bên ngoài từ môi trường: chủ yếu gồm vị trí so với tâm đường đua và đường viền địa hình phía trước. Thông tin địa hình được cung cấp dưới dạng mảng giá trị đo chiều cao lấy tại các điểm mẫu tịnh tiến cùng cơ thể dọc theo trục $`X`$ và trục $`Y`$. Robot hai chân (Planar walker) vì bị giới hạn trong trục $`X`$, trục $`Y`$, nên không thể di chuyển sang trái phải, do đó đơn giản hóa đặc trưng bên ngoài cảm nhận được.

### 2. Tham số hóa hàm chính sách  
Khi xây dựng hàm chính sách tham số hóa, **mục tiêu** là để mạng nơ-ron sâu tách biệt mối quan tâm giữa đặc trưng từ bản thân cơ thể (kỹ năng vận động cơ bản) và đặc trưng bên ngoài từ môi trường (nhận thức địa hình và định hướng). Xây dựng chính sách thành hai mạng con, trong đó một mạng chỉ nhận đặc trưng từ bản thân cơ thể, mạng kia chỉ nhận đặc trưng bên ngoài từ môi trường.

Kiến trúc mạng nơ-ron tách biệt này được so sánh với mạng nơ-ron kết nối đầy đủ đơn giản, phát hiện có thể nâng cao tốc độ học chính sách của tác tử.

**Kiến trúc mạng nơ-ron của hàm chính sách** là:
<div align=center><img src="https://img-blog.csdnimg.cn/e0781b42c72246deab1eec976ba6862f.png#pic_center" alt="Mô tả hình ảnh" style="zoom:80%;" /></div>

Ở đây bổ sung giải thích về $`\mu`$ (trung bình) và $`\sigma`$ (phương sai):  
Thuật toán tối ưu chính sách cận kề (Proximal policy optimization, PPO) dùng chính sách ngẫu nhiên (Stochastic policy) trong học tăng cường, giả định trước rằng phân phối xác suất hành động tuân theo phân phối chuẩn (Normal distribution), đầu vào là quan sát môi trường, đầu ra là phân phối xác suất của tất cả hành động.  
<div align=center><img src="https://img-blog.csdnimg.cn/9abf074c803146d4b1f4dbd12c52deb3.png#pic_center" alt="Mô tả hình ảnh" style="zoom: 50%;" /></div>

Với $`\mu`$ (trung bình) và $`\sigma`$ (phương sai) do hàm chính sách đưa ra, xây dựng phân phối xác suất hành động thông qua hàm mật độ xác suất (Probability distribution function, PDF), và lấy mẫu ngẫu nhiên hành động từ đó.

> Ghi chú của người dịch: theo quy ước thông thường, $`\sigma`$ là độ lệch chuẩn, còn phương sai là $`\sigma^2`$.


##  4. Kết quả
Bài báo áp dụng thuật toán PPO phân tán (Distributed PPO) cho nhiều loại tác tử, địa hình và chướng ngại vật. **Mục tiêu** là xác định khi tác tử được huấn luyện trong môi trường phong phú, hàm phần thưởng đơn giản có dẫn đến sự xuất hiện của kỹ năng vận động phức tạp hay không. Đồng thời cũng quan tâm đến việc cấu trúc địa hình có ảnh hưởng đến thành công của việc học và tính bền vững của hành vi kết quả hay không.  

### 1. Kết quả thực nghiệm với robot hai chân (Planar walker):  
Dùng robot hai chân huấn luyện lần lượt trên rào chắn, khe hở, bệ và địa hình biến đổi, trong môi trường chướng ngại vật hỗn hợp, tác tử có được dáng đi vững chắc, học được cách nhảy qua chướng ngại vật và khe hở, học được cách đi qua bệ hoặc cúi người dưới bệ. Tất cả các hành vi này đều xuất hiện tự phát, không có phần thưởng đặc biệt nào để khơi gợi từng hành vi riêng lẻ.

![Mô tả hình ảnh](https://img-blog.csdnimg.cn/1c1e95fa423a41ea98d6df0d43582394.jpeg#pic_center)
Hình trên cho thấy chuỗi hành động của robot hai chân nhảy qua chướng ngại vật, nhảy qua khe hở, cúi người dưới bệ, vượt qua bãi đá vụn. Và khi kết thúc học, robot hai chân có thể nhảy qua chướng ngại vật cao gần bằng chính cơ thể mình.

### 2. Kết quả thực nghiệm với robot bốn chân (Quadruped):  
Robot bốn chân so với robot hai chân thì cấu trúc cơ thể kém linh hoạt hơn. Nhưng robot bốn chân cũng thêm chiều thứ ba cho bài toán điều khiển. Huấn luyện lần lượt trên các biến thể của địa hình biến đổi, tường chắn, khe hở và rào chắn, trong đó gồm chướng ngại vật có thể tránh, và các chướng ngại vật khác cần trèo hoặc nhảy. Robot bốn chân cũng học được cách vượt qua đa số chướng ngại vật khá đáng tin cậy.

![Mô tả hình ảnh](https://img-blog.csdnimg.cn/606887a0e17442c5bf5b8b0b93d9622a.jpeg#pic_center)
Hình trên cho thấy robot bốn chân có thể phát hiện ra nhảy lên hoặc nhảy về phía trước là chính sách phù hợp để vượt chướng ngại vật và khoảng trống, và học được cách đi xuyên qua giữa các bức tường, rẽ trái và phải phù hợp, và điều này được học khi chỉ nhận phần thưởng tiến về phía trước! Robot bốn chân có thể dựa vào sự thay đổi của địa hình chướng ngại vật để học cách phân biệt chướng ngại vật có thể và/hoặc phải vượt qua, với chướng ngại vật phải đi vòng. (Trên địa hình đa dạng như vậy, việc học với robot bốn chân rất khó, vì chân của robot bốn chân khá ngắn so với sự thay đổi của địa hình)

### 3. Phân tích ảnh hưởng của tính chất địa hình đến hiệu quả học của tác tử:
#### 3.1 Địa hình theo chương trình học có thể tăng tốc học chính sách
Về thiết lập địa hình của môi trường nhiệm vụ huấn luyện, nếu ngay từ đầu chỉ cho tác tử huấn luyện trên rào rất cao thì sẽ không hiệu quả. Và để huấn luyện thành công trong thiết lập này, trên địa hình thỉnh thoảng sẽ xuất hiện chướng ngại vật khá cao, để robot hai chân giải quyết.

Để chứng minh việc thiết lập độ khó chướng ngại vật trên địa hình tăng dần từ dễ đến khó, thực nghiệm so sánh qua hai loại địa hình chướng ngại vật khác nhau:
- Loại thứ nhất là địa hình có chướng ngại vật cao thấp xen kẽ ngẫu nhiên.
- Loại thứ hai là địa hình có độ khó chướng ngại vật quyết định bởi chiều cao nhỏ nhất và lớn nhất, tăng độ khó chướng ngại vật theo kiểu chương trình học khi tác tử học.

Học trên hai địa hình kiểm tra, trong thời gian đó đánh giá chính sách để đo tiến độ học, một cái đơn giản có chướng ngại vật thấp, một cái khó có chướng ngại vật cao.
![Mô tả hình ảnh](https://img-blog.csdnimg.cn/b519c93bd6d542829c9837179c5dc999.jpeg#pic_center)
Môi trường thông thường (Regular, đường xanh lam) gồm chướng ngại vật cao và thấp xen kẽ tùy ý.  
Môi trường chương trình học (Curriculum, đường xanh lá) là chướng ngại vật có độ khó tăng dần.  
Hình trên cho thấy, chính sách của robot hai chân (Planar walker) huấn luyện trên địa hình có độ khó tăng dần cải thiện nhanh hơn chính sách huấn luyện trên địa hình cố định.  

#### 3.2 Chính sách huấn luyện trên địa hình chướng ngại vật có ưu thế rõ rệt
Đánh giá ưu thế của việc huấn luyện trên địa hình bằng phẳng (Flat) và địa hình chướng ngại vật (Hurdles) đối với việc nâng cao tính ổn định của chính sách tác tử.
![Mô tả hình ảnh](https://img-blog.csdnimg.cn/cd468689255a441ebacd388340c18f09.jpeg#pic_center)
Dùng hai loại tác tử, robot hai chân (Planar walker) và robot bốn chân (Quadruped), lần lượt trên địa hình bằng phẳng và địa hình chướng ngại vật để đánh giá tính ổn định và tính bền vững của chính sách huấn luyện được.
Friction: thay đổi ma sát bề mặt không quan sát được
Rubble: vùng lộn xộn không quan sát được  
Model: thay đổi mô hình cơ thể không quan sát được
Incline: mặt đất nghiêng/dốc xuống không quan sát được
Hình trên cho thấy, trong một số trường hợp, **chính sách tác tử huấn luyện trên địa hình chướng ngại vật có ưu thế rõ rệt**, đồng thời địa hình chướng ngại vật cũng có thể tăng tính bền vững của chính sách tác tử trong trường hợp không quan sát được một phần thông tin địa hình.

### 4. Kết quả thực nghiệm với robot hình người (Humanoid):  
Robot hình người so với robot hai chân, robot bốn chân thì phức tạp hơn nhiều về cấu tạo cơ thể. Về môi trường, cũng dùng cùng địa hình hỗn hợp để huấn luyện.

Về thiết kế **hàm phần thưởng** của robot hình người, chọn tỉ lệ thuận với tốc độ dọc trục $`X`$.  
Về thiết kế **điều kiện kết thúc** của robot hình người, bài báo thử nghiệm hai điều kiện kết thúc thay thế:
- Cách thứ nhất là kết thúc lượt khi khoảng cách nhỏ nhất giữa đầu và chân của robot hình người thấp hơn 0.9m.
- Cách thứ hai là kết thúc lượt khi khoảng cách nhỏ nhất giữa đầu robot hình người và mặt đất thấp hơn 1.1m.

Trong môi trường về robot hình người, vì robot có nhiều khớp, có số bậc tự do tương đối lớn, trong quá trình huấn luyện tác tử dễ lợi dụng phần dư thừa trong đặc tả nhiệm vụ và/hoặc rơi vào tối ưu cục bộ, kết quả khiến robot xuất hiện dáng đi thú vị nhưng về mặt thị giác không làm người ta hài lòng.
![Mô tả hình ảnh](https://img-blog.csdnimg.cn/4c7b413f9673407faeac083bdfa6c3d2.jpeg#pic_center)
Hình trên cho thấy dưới thiết lập của bài báo, robot hình người đều có thể thể hiện tốt trên mỗi địa hình của môi trường, cả về mặt hiệu năng lẫn về mặt thị giác của dáng đi.

##  5. Các công trình liên quan
Trong lĩnh vực học tăng cường, tác tử dựa trên môi trường nhiệm vụ mô phỏng vật lý là một lĩnh vực hoạt động lâu dài, cũng đã sinh ra nhiều công trình liên quan và kết quả ấn tượng. Nhưng về cơ bản tất cả các phương pháp đều dựa vào tri thức tiên nghiệm quan trọng về lĩnh vực chuyên môn của vấn đề và việc thu thập dữ liệu chuyển động.  

Khái niệm **chương trình học (curriculum)** đã tồn tại từ lâu trong tài liệu của lĩnh vực học máy. Nhưng trong thiết kế của bài báo, có thể dùng hàm phần thưởng đơn giản và huấn luyện kiểu chương trình học để sinh ra hành động thích nghi trong môi trường có tính thách thức, đồng thời chỉ gây ảnh hưởng hạn chế lên chính sách và hành vi, là một hướng nghiên cứu mới mẻ.  

##  6. Thảo luận và kết luận
Bài báo khảo sát việc huấn luyện tác tử trong môi trường phong phú có thể dẫn đến sự xuất hiện của hành vi phức tạp không được khuyến khích trực tiếp qua hàm phần thưởng đến mức độ nào. Trong bài toán điều khiển, thiết lập thường gặp là đạt được giải pháp cụ thể bằng cách thiết kế hàm phần thưởng cẩn thận.  

Bài báo thì ngược lại, cố ý dùng hàm phần thưởng đơn giản, tổng quát, huấn luyện tác tử trong môi trường phong phú. Một loạt thực nghiệm cho thấy, huấn luyện trên các địa hình khác nhau có thể thúc đẩy hành vi của tác tử phát triển đa dạng, ví dụ học được các hành động như nhảy, cúi người và rẽ, trong khi tương đối mà nói, thiết kế hàm phần thưởng hợp lý cho từng hành động cụ thể để dẫn dắt tác tử là không dễ.  

Vì vậy thông qua thiết lập môi trường để hiện thực **phương pháp chương trình học** cho tác tử học, có thể giúp chính sách hành động mà tác tử học được ổn định và bền vững hơn. Chọn một môi trường có vẻ phức tạp hơn thực tế có thể khiến việc học của tác tử trở nên dễ dàng hơn.  

##  7. Đóng góp  
Trong các nhiệm vụ học tăng cường trước đây, để tác tử học được chính sách chất lượng tốt hơn trong quá trình tương tác với môi trường động, cách làm thông thường là thiết kế hàm phần thưởng có thể đánh giá đúng hành động của tác tử để dẫn dắt hành vi của tác tử. Cũng vì vậy, thiết kế hàm phần thưởng cần nhiều tri thức tiên nghiệm về môi trường. 

Nhưng bài báo này đề xuất thiết kế **phương pháp chương trình học** cho môi trường động, để tác tử dưới hàm phần thưởng đơn giản, dần dần học được hành vi phong phú hơn theo sự nâng cao hiệu năng chính sách, như vậy có thể chuyển sự chú ý từ thiết kế hàm phần thưởng sang thiết kế phương pháp chương trình học cho môi trường động, khi đối mặt với một số nhiệm vụ mà hàm phần thưởng khó thiết kế, có thể tham khảo bài báo này, thử xem có thể giải quyết vấn đề học chính sách hành động phức tạp của tác tử từ thiết kế phương pháp chương trình học cho môi trường động hay không.  

##  8. Công việc tiếp theo  
Với môi trường nhiệm vụ phức tạp, tôi cho rằng ngoài việc dùng **phương pháp chương trình học** cho môi trường để dẫn dắt việc học của tác tử như bài báo đề xuất, còn có thể thử dùng khái niệm **học tăng cường phân cấp** để giải quyết.  
<div align=center><img src="https://img-blog.csdnimg.cn/69a499429e914783aa9cddcb03a0f873.jpeg#pic_center#" alt="Mô tả hình ảnh" style="zoom:70%;" /></div>
**Học tăng cường phân cấp** là: "phân rã một bài toán học tăng cường phức tạp thành nhiều bài toán con nhỏ, đơn giản, mỗi bài toán con đều có thể mô hình hóa riêng bằng quá trình quyết định Markov. Như vậy, có thể chia chính sách của tác tử thành chính sách cấp cao và chính sách cấp thấp, chính sách cấp cao dựa vào trạng thái hiện tại quyết định cách thực hiện chính sách cấp thấp. Như vậy, tác tử có thể giải quyết một số nhiệm vụ rất phức tạp". ------[*Sách Nấm EasyRL* (蘑菇书 EasyRL)](https://github.com/datawhalechina/easy-rl)

Đối mặt với thiết kế địa hình hỗn hợp của bài báo, liệu có thể phân rã bài toán theo các địa hình khác nhau, để khai thác điểm chung của các địa hình khác nhau, để thông qua chính sách cấp thấp cùng chính sách cấp cao cùng chia nhỏ bài toán địa hình hỗn hợp, giúp tác tử cũng học được chính sách ổn định, bền vững hay không.

##  Tài liệu tham khảo
1.	Volodymyr Mnih, J. et al. 2016. Asynchronous Methods for Deep Reinforcement Learning.
2.	[Mô hình hóa tuần tự trong gợi ý: Session-based neural recommendation (推荐中的序列化建模)](https://zhuanlan.zhihu.com/p/30720579)
3.	[Mười câu hỏi về bài báo - khung để nhanh chóng hiểu ý chính bài báo (论文十问)](https://www.cnblogs.com/xuyaowen/p/raad-paper.html)
4.	[Khóa học hè học tăng cường RLChina 2022](http://rlchina.org/topic/491)
5.	[Sách Nấm EasyRL (蘑菇书EasyRL)](https://github.com/datawhalechina/easy-rl)
6.	[Phân tích thống kê GitModel](https://link.csdn.net/?target=https%3A%2F%2Fgithub.com%2FGit-Model%2FModeling-Universe%2Ftree%2Fmain%2FData-Story)
7.	[Học tăng cường thực hành (动手学强化学习)](https://hrl.boyuai.com/chapter/intro/)


Tác giả: Lin Junjie (林俊杰)<br>
Đơn vị nghiên cứu: Viện Nghiên cứu Thông tin và Hệ thống Sản xuất, Đại học Thành Công (Đài Loan)<br>
Hướng nghiên cứu: học tăng cường, học sâu<br>
Email liên hệ: 554317150@qq.com
