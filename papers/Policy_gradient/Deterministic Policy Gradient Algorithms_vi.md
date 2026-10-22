# Deterministic Policy Gradient Algorithms (DPG)
Tác giả: David Silver, Guy Lever, Nicolas Heess, Thomas Degris, Daan Wierstra, Martin Riedmiller <br>
Đơn vị: DeepMind Technologies, London, UK; University College London, UK <br>
Hội nghị công bố: Proceedings of the 31st International Conference on Machine Learning <br>
Thời gian công bố: 2014 <br>
Địa chỉ bài báo: https://www.deepmind.com/publications/deterministic-policy-gradient-algorithms <br>

Đóng góp của bài báo: bài báo đề xuất thuật toán gradient chính sách tất định, là sự phát triển của các thuật toán gradient chính sách ngẫu nhiên trước đó.

# 1. Động cơ nghiên cứu
Trong thuật toán gradient chính sách ngẫu nhiên, tính kỳ vọng của gradient hàm mục tiêu cần lấy tích phân trên không gian trạng thái và không gian hành động, tức là khi lấy mẫu cần bao phủ toàn bộ không gian trạng thái và không gian hành động nhiều nhất có thể, vì vậy cần lấy mẫu càng nhiều càng tốt. Nhưng nếu chính sách là một chính sách tất định, thì tích phân chỉ cần thực hiện trên không gian trạng thái, như vậy giảm đáng kể số lượng mẫu cần lấy.

# 2. Thuật toán gradient chính sách ngẫu nhiên
### Một thiết lập (setting) cơ bản: <br>
Toàn bộ quá trình được định nghĩa là một quá trình quyết định Markov (Markov decision process), một quỹ đạo (trạng thái, hành động, phần thưởng) cụ thể như sau:
```math
s_{1}, a_{1}, r_{1}..., s_{T}, a_{T}, r_{T}
```
<br>

### Một số định nghĩa ký hiệu cơ bản:

Chính sách ngẫu nhiên: $`\pi_{\theta}(s)`$  
Hàm giá trị trạng thái: $`V^{\pi}(s)`$  
Hàm giá trị hành động: $`Q^{\pi}(s,a)`$

### Định lý gradient chính sách ngẫu nhiên (Stochastic Policy Gradient Theorem)

Hàm mục tiêu hiệu năng của chính sách (performance objective):  
```math
J(\pi_{\theta})=\int_{S}^{}\rho^{\pi}(s)\int_{A}^{}\pi_{\theta}(s,a)r(s,a) dads
```
Gradient của hàm mục tiêu này:
```math
\nabla_{\theta}J(\pi_{\theta})=\int_{S}^{}\rho^{\pi}(s)\int_{S}^{}\nabla_{\theta}\pi_{\theta}(a|s)Q^{\pi}(s,a)dads
```
```math
=E_{s\sim\rho^{\pi},a\sim\pi_{\theta}}[\nabla_{\theta}\pi_{\theta}(a|s)Q^{\pi}(s,a)]
```
Nội dung lý thuyết: điều chỉnh tham số chính sách $`\theta`$ theo hướng của gradient chính sách, để tối đa hóa hàm mục tiêu. Nhưng trong quá trình cài đặt thực tế, kỳ vọng ở đây được thực hiện bằng cách lấy mẫu quỹ đạo. Đồng thời còn một vấn đề cần chú ý là hàm giá trị hành động $`Q^{\pi}(s,a)`$ ở đây có được bằng cách nào. Một hướng là dùng trực tiếp phần thưởng tích lũy thực tế trong mẫu $`r^{\gamma}_{t}`$ để ước lượng $`Q^{\pi}(s_{t},a_{t})`$, đây chính là thuật toán REINFORCE.

### Thuật toán diễn viên-nhà phê bình ngẫu nhiên (Stochastic Actor-Critic Algorithms)

Nội dung thuật toán: ta gọi bộ khớp hàm giá trị hành động $`Q^{w}(s,a)`$ là nhà phê bình (Critic), chính sách $`\pi_{\theta}`$ là diễn viên (Actor), thông qua cập nhật xen kẽ nhà phê bình và diễn viên để tối đa hóa hàm mục tiêu. Quá trình cập nhật có thể hiểu là $`Q^{w}(s,a)`$ dần khớp hàm giá trị hành động thực $`Q^{\pi}(s,a)`$, chính sách $`\pi_{\theta}`$ dựa vào $`Q^{w}(s,a)`$ liên tục tối ưu tham số $`\theta`$.

Chú ý: trong quá trình này có một vấn đề: ta đưa vào $`Q^{w}(s,a)`$ để ước lượng $`Q^{\pi}(s,a)`$ thực, trong quá trình này có thể tồn tại độ chệch. Vì vậy, bài báo đưa ra hai điều kiện, chỉ cần $`Q^{w}(s,a)`$ thỏa mãn hai điều kiện này, thì sẽ không đưa vào độ chệch. Hai điều kiện này là (phần này không quan trọng lắm, có thể bỏ qua):
1)
```math
\quad Q^{w}(s,a)=\nabla_{\theta}\log\pi_{\theta}(a|s)^{T}w
```

2) $`\quad`$ Tham số w của $`Q^{w}(s,a)`$ cần tối thiểu hóa sai số bình phương trung bình (MSE) sau:
```math
\quad \epsilon^{2}(w)=E_{s\sim\rho^{\pi},a\sim\pi_{\theta}}[(Q^{w}(s,a)-Q^{\pi}(s,a))^{2}]
```

### Thuật toán diễn viên-nhà phê bình off-policy (Off-Policy Actor-Critic)
Khác biệt giữa thuật toán này và thuật toán diễn viên-nhà phê bình ban đầu là chính sách dùng để lấy mẫu quỹ đạo (behaviour policy: $`\beta(a|s)`$) và chính sách được cập nhật thực tế (target policy: $`\pi_{\theta}(a|s)`$) không giống nhau, tức là
```math
\beta(a|s)\neq\pi_{\theta}(a|s)
```
Trong thuật toán diễn viên-nhà phê bình ban đầu, mỗi lần lấy mẫu để tính hàm mục tiêu, vì chính sách đã được cập nhật, đều cần lấy mẫu lại, như vậy hiệu suất sử dụng quỹ đạo lấy mẫu được rất thấp. Vì vậy cân nhắc dùng các chính sách khác nhau cho việc lấy mẫu và việc cập nhật thực tế, như vậy có thể nâng cao hiệu suất sử dụng mẫu. Suy luận cụ thể như sau:  
Hàm mục tiêu của thuật toán này:  
```math
J_{\beta}(\pi_{\theta})=\int_{S}^{}\rho^{\beta}(s)V^{\pi}(s)ds
```
```math
\quad\quad =\int_{S}\int_{A}\rho^{\beta}(s)\pi_{\theta}(a|s)Q^{\pi}(s,a)dads
```
Gradient của hàm mục tiêu của thuật toán này:
```math
\nabla_{\theta}J_{\beta}(\pi_{\theta})\approx\int_{S}\int_{A}\rho^{\beta}(s)\nabla_{\theta}\pi_{\theta}(a|s)Q^{\pi}(s,a)dads
```
```math
=\int_{S}\int_{A}\rho^{\beta}(s)\pi_{\theta}(a|s)\nabla_{\theta}\log\pi_{\theta}(a|s)Q^{\pi}(s,a)dads
```
```math
=\int_{S}\int_{A}\rho^{\beta}(s)\beta(a|s)\frac{\pi_{\theta}(a|s)}{\beta(a|s)}\nabla_{\theta}\log\pi_{\theta}(a|s)Q^{\pi}(a|s)dads
```
```math
=E_{s\sim\rho^{\beta},a\sim\beta}[\frac{\pi_{\theta}(a|s)}{\beta(a|s)}\nabla_{\theta}\log\pi_{\theta}(a|s)Q^{\pi}(a|s)]
```
Khi cập nhật tham số chính sách, ta dùng trung bình gradient hàm mục tiêu của các quỹ đạo lấy mẫu được (ước lượng của kỳ vọng) để cập nhật tham số chính sách. Quá trình lấy mẫu này còn được gọi là lấy mẫu theo trọng số quan trọng (importance sampling).

# 3. Thuật toán gradient chính sách tất định (Deterministic Policy Gradient Algorithms)
Khác biệt lớn nhất giữa thuật toán gradient chính sách tất định và thuật toán gradient chính sách ngẫu nhiên là dạng của chính sách (một cái có tính ngẫu nhiên, một cái là tất định), ngoài ra hướng phát triển của hai cái gần như nhau.
### Một số định nghĩa ký hiệu cơ bản:
Chính sách tất định: $`\mu_{\theta}(s)`$   
Hàm giá trị trạng thái: $`V^{\mu}(s)`$  
Hàm giá trị hành động: $`Q^{\mu}(s,a)=Q^{\mu}(s,\mu_{\theta}(s))`$

### Định lý gradient chính sách tất định (Deterministic Policy Gradient Theorem)
Hàm mục tiêu (performance objective):  
```math
J(\mu_{\theta})=\int_{S}\rho^{\mu}(s)r(s,\mu_{\theta}(s))ds
```
```math
=E_{s\sim\rho^{\mu}}[r(s,\mu_{\theta}(s))]
```
Gradient của hàm mục tiêu:
```math
\nabla_{\theta}J(\mu_{\theta})=\int_{S}\rho^{\mu}(s)\nabla_{\theta}\mu_{\theta}(s)\nabla_{a}Q^{\mu}(s,a)|_{a=\mu_{\theta}(s)}ds
```
```math
=E_{s\sim\rho^{\mu}}[\nabla_{\theta}\mu_{\theta}(s)\nabla_{a}Q^{\mu}(s,a)|_{a=\mu_{\theta}(s)}]
```
Nội dung lý thuyết:  
Điều này về cơ bản giống định lý gradient chính sách ngẫu nhiên, tức là điều chỉnh tham số chính sách theo hướng gradient của hàm mục tiêu, để tối đa hóa hàm mục tiêu. Biểu diễn toán học của việc cập nhật tham số là:
```math
\theta_{k+1}=\theta_{k}+\alpha E_{s\sim\rho^{\mu_{k}}}[\nabla_{\theta}\mu_{\theta}(s)\nabla_{a}Q^{\mu_{k}}(s,a)|_{a=\mu_{\theta}(s)}]
```
Chú ý rằng, hàm mục tiêu ở đây cũng có dạng kỳ vọng, nhưng điểm khác với hàm mục tiêu trong thuật toán gradient chính sách ngẫu nhiên là kỳ vọng ở đây chỉ lấy tích phân trên không gian trạng thái, còn hàm mục tiêu trong thuật toán gradient chính sách ngẫu nhiên lấy tích phân trên cả không gian trạng thái lẫn không gian hành động. Điều này cũng có nghĩa là khi ước lượng hàm mục tiêu bằng lấy mẫu, thuật toán gradient chính sách tất định cần ít mẫu hơn. Trong bài báo tác giả còn chứng minh định lý gradient chính sách tất định là một trường hợp giới hạn của định lý gradient chính sách ngẫu nhiên, điểm này không liệt kê ở đây, ai cần có thể xem bài báo gốc.

### Thuật toán diễn viên-nhà phê bình tất định (Deterministic Actor-Critic Algorithms)
(Cốt lõi nhất ở đây là chú ý $`\theta`$ được cập nhật như thế nào)
#### Thuật toán diễn viên-nhà phê bình on-policy (On-Policy Deterministic Actor-Critic)
Nói chung, chính sách tất định khi lấy mẫu rất khó có tính đa dạng, trừ khi nhiễu môi trường rất lớn. Ở đây giới thiệu thuật toán diễn viên-nhà phê bình on-policy chỉ để hiểu rõ hơn thuật toán diễn viên-nhà phê bình tất định.  
Thuật toán chia thành hai bước: cập nhật tham số của bộ khớp hàm giá trị hành động $`Q^{w}(s,a)`$, để nó khớp tốt hơn hàm giá trị hành động thực $`Q^{\mu}(s,a)`$; cập nhật tham số $`\theta`$ của chính sách tất định $`\mu_{\theta}(s)`$, thực hiện tăng gradient.  
Dạng toán học như sau:
```math
\delta_{t}=r_{t}+\gamma Q^{w}(s_{t+1},a_{t+1})-Q^{w}(s_{t},a_{t})
```
```math
w_{t+1}=w_{t}+\alpha_{\theta}\delta_{t}\nabla_{w}Q^{w}(s_{t},a_{t})
```
```math
\theta_{t+1}=\theta_{t}+\alpha_{\theta}\nabla_{\theta}\mu_{\theta}(s_{t})\nabla_{a}Q^{\mu_{k}}(s_{t},a_{t})|_{a=\mu_{\theta}(s)}
```
#### Thuật toán diễn viên-nhà phê bình off-policy (Off-Policy Deterministic Actor-Critic)
Lý do áp dụng thuật toán diễn viên-nhà phê bình off-policy trong thuật toán gradient chính sách tất định khác với thuật toán gradient chính sách ngẫu nhiên, ở đây là để quỹ đạo lấy mẫu được có tính đa dạng hơn. Ở đây đưa ra trực tiếp dạng của hàm mục tiêu và gradient hàm mục tiêu trong thuật toán diễn viên-nhà phê bình off-policy:
```math
J_{\beta}(\mu_{\theta})=\int_{S}\rho^{\beta}(s)V^{\mu}(s)ds
```
```math
\nabla_{\theta}J_{\beta}(\mu_{\theta})\approx\int_{S}\rho^{\beta}(s)\nabla_{\theta}\mu_{\theta}(a|s)Q^{\mu}(s,a)ds
```
```math
=E_{s\sim\rho^{\beta}}[\nabla_{\theta}\mu_{\theta}(s)\nabla_{a}Q^{\mu_{k}}(s,a)|_{a=\mu_{\theta}(s)}]
```
Dạng toán học của việc cập nhật thuật toán là:
```math
\delta_{t}=r_{t}+\gamma Q^{w}(s_{t+1},a_{t+1})-Q^{w}(s_{t},a_{t})
```
```math
w_{t+1}=w_{t}+\alpha_{\theta}\delta_{t}\nabla_{w}Q^{w}(s_{t},a_{t})
```
```math
\theta_{t+1}=\theta_{t}+\alpha_{\theta}\nabla_{\theta}\mu_{\theta}(s_{t})\nabla_{a}Q^{\mu_{k}}(s_{t},a_{t})|_{a=\mu_{\theta}(s)}
```
Chú ý rằng, dạng cập nhật của thuật toán ở đây giống hệt thuật toán diễn viên-nhà phê bình on-policy, đó là vì khi cập nhật tham số ta không dùng kỳ vọng của gradient chính sách, mà dùng gradient hàm mục tiêu của một quỹ đạo lấy mẫu đơn để cập nhật, vì vậy thuật toán on-policy và off-policy giống hệt nhau về hình thức biểu diễn, điểm khác nằm ở quỹ đạo lấy mẫu dùng để cập nhật, quỹ đạo lấy mẫu trong thuật toán off-policy có tính đa dạng hơn. Nhưng khi ứng dụng thực tế, tôi cho rằng vẫn nên dùng kỳ vọng để cập nhật tham số chính sách, chứ không phải gradient của một mẫu đơn.

# 4. Tổng kết thuật toán
Thuật toán cốt lõi mà bài báo giới thiệu chính là thuật toán diễn viên-nhà phê bình off-policy với chính sách tất định, quy trình đại khái của thuật toán là:   
1. Dựa trên chính sách khám phá ($`\beta(s)`$), lấy mẫu quỹ đạo
2. Dùng thuật toán Sarsa hoặc Q-learning để cập nhật tham số w của $`Q^{w}(s,\mu_{\theta}(s))`$, để nó khớp tốt hơn $`Q^{\mu}(s,\mu_{\theta}(s))`$
3. Dùng tăng gradient để cập nhật tham số $`\theta`$ của chính sách tất định $`\mu_{\theta}(s)`$
4. Lặp lại quá trình này   
   

Chú ý: về cách cập nhật $`Q^{w}(s,\mu_{\theta}(s,a))`$, ở đây không giới thiệu cụ thể. Khi ứng dụng thuật toán thực tế ta cần xét cách mô hình hóa $`Q^{w}(s,a)`$, $`\mu_{\theta}(s)`$, có thể dùng phương pháp kỹ thuật đặc trưng + hồi quy tuyến tính để mô hình hóa, cũng có thể dùng mạng nơ-ron để mô hình hóa, nhưng dù dùng cách nào, cũng cần xét xem khi mô hình hóa có đưa vào độ chệch hay không, bài báo gốc đã thảo luận chi tiết $`Q^{w}(s,a)`$ nên thỏa mãn dạng nào thì không đưa vào độ chệch, tôi không liệt kê trong bài này, ai cần có thể tìm bài báo gốc để xem. Bài báo này viết năm 2014, lúc đó học sâu chưa được ứng dụng rộng rãi trong RL, nên một số nội dung của bài báo gốc không được viết với tiền đề học sâu được ứng dụng rộng rãi, ta cần nhận thức được điểm này. COPDAC (compatible off-policy deterministic actor-critic) nhắc đến ở dưới chỉ cần hiểu là đã mô hình hóa đặc biệt cho $`Q^{w}(s,a)`$, $`\mu_{\theta}(s)`$ là được, còn mô hình hóa thế nào thì thực ra không quá quan trọng, vì hiện nay thường dùng mạng nơ-ron để mô hình hóa.
# 5. Thực nghiệm
Phần này thiết lập ba kịch bản để kiểm chứng hiệu quả của thuật toán gradient chính sách tất định.
### Máy đánh bạc liên tục (Continuous Bandit)
#### Thiết lập thực nghiệm
Lần lượt áp dụng hai thuật toán stochastic actor-critic (SAC-B), deterministic actor-critic (COPDAC-B) trong thiết lập số chiều không gian hành động m=10, 25, 50. Máy đánh bạc có thể xem là một dạng học tăng cường đơn giản hóa, tức một tập chỉ có một bước thời gian. Cost ở đây đo chính sách hiện tại kém chính sách tối ưu bao nhiêu, nên cost càng thấp càng tốt.   

![](img/DPG_1.PNG)
#### Kết quả thực nghiệm
Có thể thấy, hiệu quả của COPDAC-B tốt hơn SAC-B rất nhiều, và số chiều không gian hành động càng lớn, ưu thế của nó càng rõ rệt.
### Học tăng cường liên tục (Continuous Reinforcement Learning)
#### Thiết lập thực nghiệm
Ba môi trường trò chơi lần lượt là: mountain car, pendulum, 2D puddle world, không gian hành động của chúng đều liên tục. Lần lượt áp dụng ba thuật toán stochastic on-policy actor-critic (SAC), stochastic off-policy actor-critic (OffPAC), deterministic off-policy actor-critic (COPDAC) trong ba môi trường trò chơi này.    

![](img/DPG_2.PNG)
#### Kết quả thực nghiệm
Có thể thấy, COPDAC-Q thể hiện tốt nhất trong cả ba môi trường. Hơn nữa COPDAC-Q hội tụ nhanh hơn, đó là vì nó cần ít mẫu hơn.
### Điều khiển tay bạch tuộc (Octopus Arm)
#### Thiết lập thực nghiệm
Octopus Arm là một tay máy có nhiều bậc tự do, mục tiêu của thực nghiệm là tay máy chạm vào mục tiêu. Phần thưởng trong quá trình thực nghiệm tỉ lệ thuận với sự thay đổi khoảng cách giữa tay máy và mục tiêu (tức càng gần mục tiêu, phần thưởng càng nhiều), khi chạm mục tiêu hoặc đã thực hiện 300 bước, một lượt kết thúc. Ở đây dùng hai perceptron để mô hình hóa $`Q^{w}(s,a)`$ và $`\mu_{\theta}(s)`$. Kết quả thực nghiệm như sau:    

![](img/DPG_3.PNG)
#### Kết quả thực nghiệm
Có thể thấy, thuật toán học được chính sách khá tốt, số bước cần để chạm mục tiêu ngày càng ít, lợi tức có được trong một lượt hoàn chỉnh ngày càng nhiều.

## Tài liệu tham khảo
1. Silver, D., Lever, G., Heess, N., Degris, T., Wierstra, D. &amp; Riedmiller, M.. (2014). Deterministic Policy Gradient Algorithms.  Available from https://proceedings.mlr.press/v32/silver14.html. <br>
2. [Mười câu hỏi về bài báo - khung để nhanh chóng hiểu ý chính bài báo (论文十问)](https://www.cnblogs.com/xuyaowen/p/raad-paper.html)<br>
3. [Sách Nấm EasyRL (蘑菇书EasyRL)](https://github.com/datawhalechina/easy-rl)
   

=============================<br>
Tác giả: Zhao Shitian (赵世天) <br>
Trường: Đại học Sư phạm Hoa Đông<br>
Hướng nghiên cứu: thị giác máy tính, học sâu<br>
Email liên hệ: shitian_zhao@163.com

Về tôi: đang học đại học tại Đại học Sư phạm Hoa Đông, hiện đang làm một số nghiên cứu về đa phương thức và tổng quát hóa miền (domain generalization), người dùng Zhihu "nặng đô". Mọi người cùng giao lưu học hỏi nhé.
