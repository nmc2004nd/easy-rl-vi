## JOYRL đọc bài báo <Rainbow: Combining Improvements in Deep Reinforcement Learning>

Tác giả: Hessel, M., Modayil, J., Van Hasselt, H., Schaul, T., Ostrovski, G., Dabney, W., ... & Silver, D. 

Phòng thí nghiệm: Google DeepMind

Địa chỉ bài báo: https://arxiv.org/pdf/1710.02298

Công bố: In *Thirty-second AAAI conference on artificial intelligence*.

## 1 Tóm tắt

### 1.1 Tóm tắt -- Bối cảnh và vấn đề

Từ quá trình suy luận DQN<sup><a href="#ref1">1</a></sup> phát hiện vẫn còn tồn tại nhiều vấn đề, các biện pháp cải tiến thường gặp như Double DQN<sup><a href="#ref1">2</a></sup>, Dueling DQN<sup><a href="#ref1">3</a></sup>, Prioritized replay<sup><a href="#ref1">4</a></sup>, Multi-step<sup><a href="#ref1">5</a></sup>, Distributional RL<sup><a href="#ref1">6</a></sup>, Noisy Net<sup><a href="#ref1">7</a></sup>,... các phương pháp này không hoàn toàn độc lập, ví dụ trong Dueling thực ra đã kết hợp Double DQN và Prioritized replay.

### 1.2 Tóm tắt -- Phương pháp

Bài báo này mong muốn kết hợp kinh nghiệm của sáu phương pháp DQN trên lại với nhau, để có được một mạng tốt hơn.

### 1.3 Tóm tắt -- Đóng góp

1. Trở thành SOTA (State-of-the-art) trên Atari 2600
2. Chúng tôi còn cung cấp kết quả chi tiết của nghiên cứu cắt bỏ (ablation study), kết quả nghiên cứu cho thấy đóng góp của từng thành phần đối với hiệu năng tổng thể.

## 2 Bối cảnh vấn đề

### 2.1 RL problem & ký hiệu

Học tăng cường mong muốn một tác tử (Agent) có hành động (Action) có thể tối đa hóa phần thưởng (Reward) trong quá trình tương tác với môi trường (Environment), trong quá trình này không có học có giám sát trực tiếp. Ở đây chia sẻ thêm một định nghĩa khác:

> 1. Mathematical formalism for learning- based decision making
>
> 2. Approach for learning decision-making and control from experience

**MDP (Markov Decision Process) $\{S,A,T,r,\gamma\}$**

Ở các bước thời gian khác nhau $t=0,1,2,..$, trạng thái môi trường $S_t$ cung cấp cho tác tử một thông tin quan sát $O_t$, thường ta coi là quan sát hoàn toàn (tức $S_t=O_t$), đồng thời tác tử dựa vào thông tin quan sát để đưa ra hành động $A_t$, sau đó môi trường đưa ra phần thưởng tiếp theo $R_{t+1}$, hệ số chiết khấu của phần thưởng $\gamma_{t+1}$ và cập nhật trạng thái thành $S_{t+1}$

![MDP](http://chenxia31blog.oss-cn-hangzhou.aliyuncs.com/blog/2022-11-06-033033.jpg)

Trong quá trình này thường $S,A$ là hữu hạn, với môi trường, chuyển trạng thái (Stochastic transition function) và phương trình phần thưởng gồm

$$T(s,a,s')=P[S_{t+1=s'}|S_t=s,A_t=a]$$

$$r(s,a)=E[R_{t+1}|S_t=s,A_t=a]$$

Với tác tử, việc dựa vào trạng thái $S_t$ (hoặc quan sát $O_t$ trong trường hợp quan sát hoàn toàn) để có được hành động $A_t$ đến từ chính sách $\pi$ (Policy), trong ra quyết định tuần tự mục tiêu của ta là tối đa hóa tổng phần thưởng chiết khấu khi thực hiện một hành động nào đó ở một trạng thái nào đó

$$P(A_t=a)=\pi_{\theta}[A_t=a|S_t=s]$$

$$max G_t=\Sigma_{k=0}^{\infty}r_t^{k}R_{t+k+1}$$

Khi ta dùng thuật toán để cải thiện bằng gradient thường trải qua ba bước:

1. Sinh mẫu
2. Đánh giá mô hình hoặc tính lợi tức
3. Cải thiện chính sách

### 2.2 Policy Gradient: cải thiện trực tiếp chính sách

Để tối đa hóa lợi tức của chính sách, ta có thể trực tiếp tối đa hóa $G_t$ (tức thuật toán REINFORCE)

![REINFORCE algorithm ](http://chenxia31blog.oss-cn-hangzhou.aliyuncs.com/blog/2022-11-06-101742.png)

Ta có thể dùng các mẹo như Baseline, N-steps, Discount, Importance sampling để cải tiến thuật toán.

### 2.3 **Phương pháp Actor-Critic**: tách riêng việc ước lượng lợi tức (Estimate return) và cải thiện chính sách

Cũng có thể đưa vào hàm giá trị trạng thái mới $V^{\pi}(s)$ để kết hợp cách khớp nhằm tính $G_t$ rồi tối đa hóa (A3C), cũng có thể trực tiếp dùng $V^{\pi}(s)$ và hàm giá trị hành động-trạng thái $Q^{\pi}(s,a)$ để thực hiện phương pháp học dựa trên hàm giá trị.

$$V^{\pi}(s)=E_{\pi}[G_t|S_t=s]$$

$$Q^{\pi}(s,a)=E_\pi[G_t|S_t=s,A_t=a]$$

![batch actor-crtic algorithm](http://chenxia31blog.oss-cn-hangzhou.aliyuncs.com/blog/2022-11-06-102038.png)

Ta có thể dùng bể phát lại (Replay buffer), mạng nơ-ron để học nhằm giảm phương sai trong gradient chính sách.

### 2.4 Value-based method: từ bỏ chính sách

Policy iteration->Value iteration->Q learning

Trước tiên nói từ lặp chính sách và lặp giá trị, [link tham khảo](https://hrl.boyuai.com/chapter/1/%E5%8A%A8%E6%80%81%E8%A7%84%E5%88%92%E7%AE%97%E6%B3%95), có thể xem là dùng quy hoạch động để phản ánh quá trình học tăng cường, khác biệt giữa hai cái nằm ở việc phản ánh kỳ vọng Bellman hay tối ưu Bellman.

![Phương trình kỳ vọng Bellman](http://chenxia31blog.oss-cn-hangzhou.aliyuncs.com/blog/2022-11-06-102432.png)

![Phương trình tối ưu Bellman](http://chenxia31blog.oss-cn-hangzhou.aliyuncs.com/blog/2022-11-06-102502.png)

Trong quá trình của các thuật toán học dựa trên giá trị, ưu điểm là ta chỉ cần một bể phát lại kinh nghiệm, chỉ cần $(s,a,s',r)$ chứ không cần chuỗi quyết định hoàn chỉnh. Ta thường đưa vào khái niệm khám phá ngẫu nhiên (Exploration), phổ biến gồm phương pháp $\epsilon-Greedy$, với một xác suất nhất định chọn hành động không do chính sách sinh ra.

![epsilon-greedy](http://chenxia31blog.oss-cn-hangzhou.aliyuncs.com/blog/2022-11-06-034903.png)

Trên cơ sở lặp giá trị, ta có thể từ bỏ việc học $V(s)$, mà chỉ ghi lại $Q(s,a)$; quá trình của Q-iteration algorithm (hoặc $Q-learning$) như hình dưới

![image-20221106114721046](http://chenxia31blog.oss-cn-hangzhou.aliyuncs.com/blog/2022-11-06-034721.png)

### 2.5 Suy luận DQN

Ở trên ta đã nhận thức về mục tiêu MDP, từ biểu diễn tường minh chính sách, đến kết hợp giá trị trạng thái rồi đến phương pháp học hoàn toàn dùng hàm giá trị, các vấn đề ta vẫn chưa giải quyết gồm

1. Tính liên tục của không gian trạng thái-hành động
2. Khi số chiều của không gian trạng thái và không gian hành động lớn thì không thể mô tả chính xác giá trị trạng thái-hành động

Cùng với sự phát triển của mạng nơ-ron, ta mong dùng cách khớp bằng mạng để giải quyết các vấn đề trên, đồng thời mỗi bước dùng cách $\epsilon-Greedy$ để khám phá kinh nghiệm trong bể phát lại, và dùng các phương pháp như giảm gradient để tối thiểu hóa lợi tức được biểu diễn bởi hàm giá trị

$$min (R_{t+1}+\gamma_{t+1}max_{a'}(S_{t+1},a')-q_{\theta}(S_t,A_t))^2$$

* 1 Khởi tạo bể phát lại kinh nghiệm kích thước $N$ (PS: chú ý có giới hạn kích thước)
* 2 Khởi tạo $Q_{\theta}(s,a)$ và mạng mục tiêu $Q_{\theta'}(s,a)$ bằng cùng tham số mạng ngẫu nhiên
* 3 FOR tập = 1, N DO:
  * 4 Lấy trạng thái ban đầu của môi trường $s_1$
  * 5 FOR bước thời gian = 1, T DO:
    * 6 Dựa vào mạng hiện tại $a_t=max_a Q_{\theta}(s,a)$ kết hợp phương pháp $\epsilon-Greedy$ để có được $a_t$ (PS: chú ý việc xác định hành động ở bước này ngầm chứa đặc điểm lợi tức DQN bị ước lượng quá cao về sau)
    * 7 Thực hiện hành động $a_t$, nhận $r_t$, trạng thái môi trường chuyển thành $s_{t+1}$
    * 8 Lưu thông tin lấy mẫu trên vào bể phát lại kinh nghiệm
    * 9 if số lượng trong bể phát lại kinh nghiệm đủ:
      * 10 Lấy mẫu batchsize mẫu $\{s_t^i,a_t^i,r_t^i,s_{t+1}^i\}$
      * 11 Tính giá trị mục tiêu $y^i_t=r^i_t+\gamma*max_aQ_{\hat \theta}(s^i_{t+1},a^i_t)$
      * 12 Tối thiểu hóa hàm mất mát $L=\frac{1}{N}(y_t^i-Q_{\theta}(s_t^i,a_t^i))^2$
      * 13 Cập nhật tham số mạng
  * 14 END FOR
  * 15 Cập nhật tham số mạng mục tiêu
* 16 END FOR

![Deep Q- learning with Experience Replay](http://chenxia31blog.oss-cn-hangzhou.aliyuncs.com/blog/2022-11-06-040037.png)

Trong đó các mẹo rất thú vị gồm:

1. Phát lại kinh nghiệm (Experience replay) và khám phá ngẫu nhiên; phần này chủ yếu để nâng cao hiệu quả lấy mẫu, đồng thời giảm tương quan giữa các mẫu trong giảm gradient phía sau.
2. Mạng mục tiêu (Target network); vì sai số TD cũng thay đổi trong quá trình chính sách thay đổi, gây ra sự bất ổn định trong quá trình khớp của mạng nơ-ron, vì vậy xây dựng mạng mục tiêu mới, tạm thời cố định trong mỗi vòng lặp, cập nhật tham số sau khi tập kết thúc, như vậy cần hai mạng Q.

[Code cài đặt liên quan](https://paperswithcode.com/paper/playing-atari-with-deep-reinforcement)

![A more general view of DQN](http://chenxia31blog.oss-cn-hangzhou.aliyuncs.com/blog/2022-11-06-080345.png)

## 3 Cải tiến DQN

Tuy DQN đã giúp học tăng cường vượt con người ở một số mặt, nhưng vẫn còn nhiều hạn chế.

### 3.1 Cải tiến 1: Double Q- Learning

Trong DQN sẽ có trường hợp giá trị ước lượng quá cao, chứng minh như sau:

$$target-value:y^i_t=r^i_t+\gamma max_{a_{t+1}^i}Q_{\hat \theta}(S^i_{t+1},a^i_{t+1})$$

$$max_{a_{t+1}^i}Q_{\hat \theta}(S^i_{t+1},a^i_{t+1})=Q_{\hat \theta}(s_{t+1}^i,argmax_{a_{t+1}^i}Q_{\hat \theta}(s_{t+1}^i,a_{t+1}^i))$$

Theo công thức kỳ vọng

$$E[max(X1,X2)]>max(E(X1),E(X2))$$

![image-20221106161746893](http://chenxia31blog.oss-cn-hangzhou.aliyuncs.com/blog/2022-11-06-081747.png)

Qua chứng minh ta phát hiện nguyên nhân giá trị ước lượng lớn là vì mô hình dùng cùng một mạng để chọn hành vi và tính giá trị Q, nếu giảm tương quan giữa việc chọn hành vi và tính giá trị Q thì có thể giảm ước lượng quá cao, vì vậy theo trực giác ta có thể thiết kế hai mạng

$$Q_{\theta_A}(s,a)=r+\gamma Q_{\theta_b}(s',a')$$

$$Q_{\theta_B}(s,a)=r+\gamma Q_{\theta_a}(s',a')$$

Ta thực sự có thể thêm một mạng mới, nhưng sẽ tăng độ khó khi học, cần thiết kế lại kiến trúc. Vậy tại sao không dùng trực tiếp $Q_{\theta}(s,a)$ để ước lượng hành vi?

$$(target\_value\_double\_Q-learning):y^i_t=r^i_t+\gamma Q_{\hat \theta}(s^i_{t+1},argmax_{r^i_{t+1}Q_{\theta}}(s^i_{t+1},a^i_{t+1}))$$

### 3.2 Cải tiến 2: Prioritized replay

Trong học DQN để tận dụng hiệu quả các mẫu $(s,a,r,s)$, ta dùng cách phát lại kinh nghiệm để lưu các mẫu ở quy mô nhất định, khi giảm gradient thường lấy mẫu đồng đều (Uniformly sampling) từ phát lại kinh nghiệm để học, nhưng ta vẫn gặp hai vấn đề:

1. Vẫn chưa giải quyết hoàn toàn giả định độc lập và phân phối đồng nhất giữa các dữ liệu
2. Dễ quên một số dữ liệu kinh nghiệm hiếm gặp, quan trọng

Trong bài báo đó tác giả trước tiên đặt chỉ số "TD-error" làm thước đo lượng thông tin của $(s_t^i,a_t^i,r_t^i,s^i_{t+1})$, làm độ ưu tiên lấy mẫu, đồng thời dùng các cách như lấy mẫu ưu tiên ngẫu nhiên, độ chệch và importance sampling để tránh vấn đề tham lam. Độ ưu tiên có được bằng hai cách 3.2.1 và 3.2.2

$$(\text{lấy mẫu ngẫu nhiên})P(i)=\frac{p_i^\alpha}{\Sigma_kP_k^\alpha}$$

### 3.2.1 Ưu tiên tỉ lệ (Proportional prioritization)

$$P_i=|\sigma_i|+\epsilon$$

### 3.2.2 Ưu tiên dựa trên thứ hạng (Rank-based prioritization)

$$P_i=\frac{1}{rank(i)}$$; ưu điểm là có thể đảm bảo tính chất tuyến tính, không nhạy với giá trị ngoại lai.

Trên đây là hai cách khác nhau để có được độ quan trọng; khi cài đặt dùng cấu trúc dữ liệu Sum-tree để giảm độ phức tạp của thuật toán. Khi lấy mẫu có xét đến importance sampling, và từ đó thực hiện ủ độ chệch (Annealing the bias) để hiệu chỉnh sai số

$$w_j=(\frac{1}{N}*\frac{1}{P(i)})^\beta$$

![Double DQN with proportional prioritization ](http://chenxia31blog.oss-cn-hangzhou.aliyuncs.com/blog/2022-11-06-083749.png)

### 3.3 Cải tiến 3: Dueling networks

Dueling DQN là một thiết kế cấu trúc mạng cho học tăng cường dựa trên hàm giá trị, nó không đưa ra trực tiếp hàm giá trị trạng thái-hành động, mà đưa ra hàm giá trị trạng thái và hàm lợi thế hành động-trạng thái, vì thường dùng chung tham số tích chập của vài tầng đầu, còn phía sau là tham số riêng của hàm giá trị trạng thái và hàm lợi thế.

![image-20221106165135693](http://chenxia31blog.oss-cn-hangzhou.aliyuncs.com/blog/2022-11-06-085135.png)

![Dueling DQN](http://chenxia31blog.oss-cn-hangzhou.aliyuncs.com/blog/2022-11-06-084642.png)

### 3.4 Cải tiến 4: Multi-step learning

Khi ước lượng lợi thế của hàm trạng thái-hành động, thường ta chia thành phương pháp Monte Carlo và phương pháp Bootstrap (hoặc chữ C trong Actor-critic)

$$(MC-sampling)A_t=\Sigma_{k=0}^{\infty}\gamma_t^{k}(R_{t+k+1}-b)$$

$$(bootstrap-sampling)G_t=r_{t}+\gamma*V(s_{t+1})-V(s_t)$$

Phương pháp trước có độ chệch thấp nhưng phương sai lớn; phương pháp sau phương sai thấp nhưng có chệch. Vì vậy kết hợp hai cách ta thường có phương pháp Multi-step target (mục tiêu nhiều bước).

![Tiến xa hơn từ N-step: ước lượng lợi thế tổng quát (GAE)](http://chenxia31blog.oss-cn-hangzhou.aliyuncs.com/blog/2022-11-06-090001.png)

Tương tự cũng có thể dùng trong DQN để ước lượng hàm giá trị trạng thái-hành động:

$$R_t^{n}=\Sigma_{k=0}^{n-1}\gamma_t^{k}R_{t+k+1}$$

Hàm mất mát sau khi cập nhật là

$$(R_t^{n}+\gamma_t^nmax_{a'}Q_{\hat \theta}(S_{t+n},a')-Q_\theta(S_t,A_t))^2$$

### 3.5 Cải tiến 5: Distributional RL

Trong học dựa trên hàm giá trị ta thường trả về một kỳ vọng hoặc giá trị lớn nhất mà mất đi nhiều thông tin khác, vì vậy Distributional RL cố gắng dùng phân phối của nó thay vì một giá trị đơn để học tăng cường. Trước tiên bài báo chia phạm vi hàm giá trị $[V_{min},V_{max}]$ thành N ô để ước lượng hàm giá trị, dùng phân phối Boltzmann để biểu diễn phân phối của hàm giá trị, đồng thời dùng phép chiếu

![Ước lượng Z(s)](http://chenxia31blog.oss-cn-hangzhou.aliyuncs.com/blog/2022-11-06-091649.png)

![Các option khác nhau](http://chenxia31blog.oss-cn-hangzhou.aliyuncs.com/blog/2022-11-06-091719.png)

Từ đó việc khớp phân phối có thể quy về dạng entropy chéo, quy trình thuật toán

![Distribution RL](http://chenxia31blog.oss-cn-hangzhou.aliyuncs.com/blog/2022-11-06-091812.png)

### 3.6 Cải tiến 6: Noisy Nets

Trong Q-learning hoặc DQN, quỹ đạo của ta không được lấy mẫu hoàn toàn, mà liên quan đến chiến lược khám phá của ta, nguyên thủy nhất là chiến lược $\epsilon-Greedy$, ở đây đề xuất một NoisyNet thêm nhiễu vào tham số để tăng khả năng khám phá của mô hình

$$y=(Wx+b)+(b_{noisy}\odot\epsilon^b+W_{noisy}\odot\epsilon^w)x$$

Việc sinh nhiễu có thể chia thành hai cách: Independent Gaussian noise (nhiễu Gauss độc lập); Factorised Gaussian noise (nhiễu Gauss phân tích nhân tử).

![Hiệu quả của Noisy net](http://chenxia31blog.oss-cn-hangzhou.aliyuncs.com/blog/2022-11-06-093441.png)

### 3.7 Kết hợp các chiến lược trên

Trước tiên thay hàm mất mát trong (Cải tiến 5: Distributional RL) thành (Cải tiến 4: Multi-step learning), và dùng (Cải tiến 1 -- Double Q-Learning) để tính giá trị mục tiêu mới

$$d_t^n=(R_t^n+r_t^nz,p_\hat\theta(S_{t+n},a^*_{t+n}))$$

Hàm mất mát là

$$D_{KL}(\Phi_zd_t^n||d_t)$$

Đồng thời trong quá trình lấy mẫu ta thường giảm TD-error, còn trong bài báo này hàm mất mát của ta là KL loss, vì vậy độ ưu tiên trong (Cải tiến 2: Prioritized replay) được định nghĩa là

$$p_t\propto (D_{KL}(\Phi_zd_t^n||d_t))^w$$

Đồng thời thay đổi (Cải tiến 3: Dueling networks) từ nhận kỳ vọng chuyển sang nhận phân phối hàm giá trị, cuối cùng đổi tất cả các tầng tuyến tính thành (Cải tiến 6: Noisy Nets)

$$p_\theta(s,a)^i=\frac{exp(v^i_\eta(\phi)+a^i_\psi(\phi,a)-\hat a_\psi^i(s))}{\Sigma_j exp(v^j_\eta(\phi)+a^j_\psi(\phi,a)-\hat a_\psi^j(s)) }$$

## 4 Thực nghiệm

![Median human- normalized performance](http://chenxia31blog.oss-cn-hangzhou.aliyuncs.com/blog/2022-11-06-095019.png)

![Kết quả](http://chenxia31blog.oss-cn-hangzhou.aliyuncs.com/blog/2022-11-06-094444.png)

![image-20221106175357633](http://chenxia31blog.oss-cn-hangzhou.aliyuncs.com/blog/2022-11-06-095358.png)

## 5 Tổng kết

### 5.1 Kết luận

1. Rainbow tốt hơn các thuật toán hiện có khác, tốc độ cũng nhanh hơn
2. Trong thực nghiệm cắt bỏ; ta phát hiện (Cải tiến 2: Prioritized replay) và (Cải tiến 4: Multi-step learning) khi bỏ đi sẽ khiến trung vị kết quả giảm mạnh; (Cải tiến 5: Distributional RL) lúc đầu thể hiện tốt, nhưng kết quả cuối cùng thể hiện kém hơn; đồng thời (Cải tiến 6: Noisy Nets) thường có trung vị tốt hơn, đồng thời vì trong tình huống lần này thường là ước lượng quá thấp (underestimate), nên hiệu quả của (Cải tiến 1 -- Double Q-Learning) không rõ rệt, (Cải tiến 3: Dueling networks) mức cải thiện không lớn.

### 5.2 Thảo luận

Cuối cùng tác giả tổng kết công trình của họ, chủ yếu là tìm kiếm trong tập hợp các phương pháp Q-learning dựa trên giá trị (Value-based), mà không xét các thuật toán thuần dựa trên chính sách (Purely policy-based, ví dụ TRPO), bài báo kết hợp từ các mặt như khám phá của mạng, khởi tạo mạng, sử dụng dữ liệu, hàm mất mát,..., tương ứng cũng có nhiều công trình khác, trong tương lai còn có thể dùng nhiều phương pháp khác. Nhưng

> In general, we believe that exposing the real game to the agent is a promising direction for future research.

### 5.3 Cảm nhận cá nhân

Quan điểm của bài báo này rất trực tiếp, trong quá trình cài đặt thực tế tác giả đã làm rất nhiều việc "bẩn" (dirty work), thử rất nhiều lần, và cuối cùng chứng minh cách tích hợp là hiệu quả, cùng với phân tích mẹo nào hiệu quả, mẹo nào kém, khối lượng công việc rất lớn!



【1】<span name = "DQN">[Mnih, V., Kavukcuoglu, K., Silver, D., Graves, A., Antonoglou, I., Wierstra, D., & Riedmiller, M. (2013). Playing atari with deep reinforcement learning. *arXiv preprint arXiv:1312.5602*.](https://arxiv.org/abs/1312.5602)</span>

【2】<span name = "DDQN">[Van Hasselt, H., Guez, A., & Silver, D. (2016, March). Deep reinforcement learning with double q-learning. In *Proceedings of the AAAI conference on artificial intelligence* (Vol. 30, No. 1).](http://arxiv.org/abs/1509.06461)</span>

【3】 <span name = "Prioritized experience replay"> [Schaul, T., Quan, J., Antonoglou, I., & Silver, D. (2015). Prioritized experience replay. *arXiv preprint arXiv:1511.05952*.](https://arxiv.org/abs/1511.05952)</span>

【4】<span name = "Multistep">[Multi Step Learning](https://www.cs.mcgill.ca/~dprecup/courses/RL/Lectures/8-multistep-2019.pdf)</span>

【5】<span name = "Dueling">[Wang, Z., Schaul, T., Hessel, M., Hasselt, H., Lanctot, M., & Freitas, N. (2016, June). Dueling network architectures for deep reinforcement learning. In *International conference on machine learning* (pp. 1995-2003). PMLR.](https://arxiv.org/abs/1511.06581)</span>

【6】<span name = "Distributional">[Bellemare, M. G., Dabney, W., & Munos, R. (2017, July). A distributional perspective on reinforcement learning. In *International Conference on Machine Learning* (pp. 449-458). PMLR.](https://arxiv.org/pdf/1707.06887.pdf)</span>

【7】<span name = "NoisyDQN">[Fortunato, M., Azar, M. G., Piot, B., Menick, J., Osband, I., Graves, A., ... & Legg, S. (2017). Noisy networks for exploration. *arXiv preprint arXiv:1706.10295*.](https://arxiv.org/abs/1706.10295)</span>

### Tự giới thiệu

Một người INFJ không điển hình, nghiên cứu sinh thạc sĩ khóa 2022 ngành thông tin giao thông tại một trường "985" bình thường (nhóm trường trọng điểm của Trung Quốc), hướng nghiên cứu chính là phân tích dữ liệu giao thông, tối ưu tổ hợp,..., trên con đường học tập mong bản thân luôn giữ được tinh thần "Stay hungry, stay foolish" (求知若饥，虚心若愚). Có thể tìm tôi tại blog.tjdata.site.
