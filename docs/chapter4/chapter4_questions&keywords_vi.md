# Chương 4 Gradient chính sách

## Từ khóa

- **Chính sách (policy)**: mỗi diễn viên (actor) có một chính sách tương ứng, chính sách này quyết định các hành động tiếp theo của diễn viên. Cụ thể, chính sách là với đầu vào từ bên ngoài, đưa ra hành động mà diễn viên nên thực hiện lúc này. Thông thường, ta ký hiệu chính sách là $\pi$.

- **Lợi tức (return)**: tổng tất cả phần thưởng nhận được trong một tập (episode) hoặc một lượt thử (trial), còn được gọi là tổng phần thưởng (total reward). Thông thường, ta dùng $R$ để biểu thị.

- **Quỹ đạo (trajectory)**: trong một lượt thử, tập hợp được tạo thành bằng cách kết hợp toàn bộ các trạng thái $s$ do môi trường đưa ra và các hành động $a$ do diễn viên đưa ra được gọi là quỹ đạo, tức $\tau=\left\{s_{1}, a_{1}, s_{2}, a_{2}, \cdots, s_{t}, a_{t}\right\}$.

- **Hàm phần thưởng (reward function)**: dùng để phản ánh điểm phần thưởng nhận được khi thực hiện một hành động nào đó ở một trạng thái nào đó, đây là một hàm. Tức là cho một cặp trạng thái-hành động ($s_1$,$a_1$), hàm phần thưởng có thể đưa ra $r_1$. Cho ($s_2$,$a_2$), nó có thể đưa ra $r_2$. Cộng tất cả các $r$ lại, ta có $R(\tau)$, nó đại diện cho phần thưởng của một quỹ đạo $\tau$ nào đó.

- **Phần thưởng kỳ vọng (expected reward)**: $\bar{R}_{\theta}=\sum_{\tau} R(\tau) p_{\theta}(\tau)=E_{\tau \sim p_{\theta}(\tau)}[R(\tau)]$.

- **REINFORCE**: thuật toán kinh điển của học tăng cường dựa trên gradient chính sách (policy gradient), dùng chế độ cập nhật theo tập.


## Bài tập

**4-1** Nếu ta muốn robot tự chơi trò chơi điện tử, thì 3 thành phần trong học tăng cường (diễn viên, môi trường, hàm phần thưởng) lần lượt đại diện cho cái gì?

Việc diễn viên làm là điều khiển cần điều khiển của trò chơi, ví dụ các thao tác sang trái, sang phải, bắn,...; môi trường chính là máy chơi game, chịu trách nhiệm điều khiển hình ảnh trò chơi, điều khiển quái vật di chuyển thế nào,...; hàm phần thưởng chính là khi thực hiện hành động gì, xảy ra tình huống gì thì ta nhận được bao nhiêu điểm, ví dụ tiêu diệt một con quái vật được 20 điểm, bị đối thủ đánh chí mạng bị trừ 10 điểm, hoàn thành nhiệm vụ được 10 điểm,...

**4-2** Trong một quá trình, xác suất xuất hiện của một quỹ đạo cụ thể {$s_1 , a_1 , s_2 , a_2$} phụ thuộc vào gì?

(1) Một phần là hành vi của môi trường, tức là tham số bên trong hàm hoặc luật bên trong của môi trường có dạng như thế nào. Số hạng $p(s_{t+1}|s_t,a_t)$ đại diện cho môi trường, số hạng môi trường này thường không thể kiểm soát, vì nó đã tồn tại khách quan, hoặc dạng của nó đã được định sẵn từ trước.

(2) Phần còn lại là hành vi của tác tử, thứ ta có thể kiểm soát là $p_\theta(a_t|s_t)$, tức là cho một trạng thái $s_t$, diễn viên thực hiện hành động $a_t$ nào phụ thuộc vào tham số $\theta$ của diễn viên, vì vậy phần này là thứ ta có thể kiểm soát. Khi hành động của diễn viên khác nhau, mỗi quỹ đạo giống nhau sẽ vì xác suất khác nhau mà thể hiện ra hành vi khác nhau.

**4-3** Khi tối đa hóa phần thưởng kỳ vọng, nên dùng phương pháp gì?

Nên dùng phương pháp đi lên theo gradient (gradient ascent), vì muốn phần thưởng kỳ vọng càng lớn càng tốt, nên là gradient ascent. Gradient ascent khi cập nhật tham số cần thêm thông tin gradient. Để thực hiện gradient ascent, trước tiên ta cần tính gradient của phần thưởng kỳ vọng $\bar{R}$. Ta lấy gradient của $\bar{R}$, ở đây chỉ có $p_{\theta}(\tau)$ liên quan đến $\theta$, vì vậy $p_{\theta}(\tau)$ là phần lấy gradient.

**4-4** Ta nên hiểu công thức gradient chính sách như thế nào?

Công thức gradient chính sách như sau:

$$
\begin{aligned}
E_{\tau \sim p_{\theta}(\tau)}\left[R(\tau) \nabla \log p_{\theta}(\tau)\right] &\approx \frac{1}{N} \sum_{n=1}^{N} R\left(\tau^{n}\right) \nabla \log p_{\theta}\left(\tau^{n}\right) \\
&=\frac{1}{N} \sum_{n=1}^{N} \sum_{t=1}^{T_{n}} R\left(\tau^{n}\right) \nabla \log p_{\theta}\left(a_{t}^{n} \mid s_{t}^{n}\right)
\end{aligned}
$$

$p_{\theta}(\tau)$ gồm hai số hạng, $p(s_{t+1}|s_t,a_t)$ đến từ môi trường, $p_\theta(a_t|s_t)$ đến từ tác tử. $p(s_{t+1}|s_t,a_t)$ do môi trường quyết định, nên không liên quan đến $\theta$, vì vậy $\nabla \log p(s_{t+1}|s_t,a_t) =0$, $\nabla p_{\theta}(\tau)=\nabla \log p_{\theta}\left(a_{t}^{n} | s_{t}^{n}\right)$.

Cụ thể:

(1) Giả sử ở trạng thái $s_t$ thực hiện hành động $a_t$, cuối cùng phát hiện phần thưởng của quỹ đạo $\tau$ là dương, thì ta cần tăng xác suất của số hạng này, tức là tăng xác suất thực hiện hành động $a_t$ ở trạng thái $s_t$;

(2) Ngược lại, nếu thực hiện hành động $a_t$ ở trạng thái $s_t$ dẫn đến phần thưởng của quỹ đạo $\tau$ trở thành âm, ta cần giảm xác suất của số hạng này.

**4-5** Ta có thể dùng những phương pháp nào để tính gradient ascent?

Dùng gradient ascent để cập nhật tham số, với tham số ban đầu $\theta$, có thể lấy $\theta$ ban đầu cộng với gradient cập nhật nhân với một tốc độ học (learning rate). Thông thường tốc độ học cũng cần được điều chỉnh, giống như mạng nơ-ron, ta có thể dùng các bộ tối ưu (optimizer) như Adam, RMSProp, SGD để điều chỉnh nó.

**4-6** Các mẹo khi tối ưu dựa trên gradient chính sách là gì?

(1) Thêm đường cơ sở (baseline): để tránh việc mọi phần thưởng đều dương, dẫn đến mọi biến đổi trạng thái và hành động đều làm xác suất của mỗi biến đổi tăng lên, ta trừ phần thưởng đi một số hạng $b$, gọi là đường cơ sở. Sau khi trừ $b$, ta có thể làm phần thưởng $R(\tau^n)-b$ có cả dương lẫn âm. Vì vậy nếu tổng phần thưởng nhận được $R(\tau^n)$ lớn hơn $b$, ta tăng xác suất của nó. Nếu tổng phần thưởng nhỏ hơn $b$, dù nó dương nhưng giá trị nhỏ cũng không tốt, cần giảm xác suất của số hạng này. Nếu phần thưởng $R(\tau^n)$ nhỏ hơn $b$, phải làm giảm phần thưởng của việc thực hiện hành động này, điều này cũng hợp lý. Nhưng dùng đường cơ sở sẽ làm phần thưởng của các "hành động" vốn có phần thưởng lớn trở nên nhỏ hơn, từ đó giảm tốc độ cập nhật.

(2) Gán điểm phù hợp (credit assignment): trước hết, trọng số ban đầu là tổng phần thưởng của cả tập. Giờ đổi thành bắt đầu từ một thời điểm $t$ nào đó, giả sử hành động được thực hiện ở thời điểm $t$, thì tổng tất cả phần thưởng từ thời điểm $t$ đến khi trò chơi kết thúc mới thực sự đại diện cho việc hành động này tốt hay không tốt; tiến thêm một bước, ta chiết khấu phần thưởng tương lai, ta gọi tổng phần thưởng thu được như vậy là lợi tức chiết khấu (discounted return).

(3) Kết hợp cả hai mẹo trên, ta gọi chung là hàm lợi thế (advantage function), dùng $A$ để biểu thị hàm lợi thế. Hàm lợi thế phụ thuộc vào trạng thái và hành động, tức là ta cần tính xem khi thực hiện một hành động $a$ nào đó ở một trạng thái $s$ nào đó, hàm lợi thế lớn bao nhiêu.

(4) Ý nghĩa của hàm lợi thế là đo lường: giả sử ta thực hiện một hành động $a_t$ nào đó ở một trạng thái $s_t$ nào đó, so với các hành động có thể khác thì lợi thế của nó là bao nhiêu. Nó không quan tâm cái tốt tuyệt đối mà quan tâm cái tốt tương đối, tức lợi thế tương đối, vì sẽ trừ đi một đường cơ sở $b$. $A_{\theta}\left(s_{t}, a_{t}\right)$ thường có thể được ước lượng bởi một mạng, mạng này được gọi là nhà phê bình (critic).

**4-7** Với hai cách của gradient chính sách, học tăng cường Monte Carlo và học tăng cường sai phân thời gian có liên hệ và khác biệt gì?

(1) Tần suất cập nhật của hai phương pháp khác nhau. Phương pháp học tăng cường Monte Carlo cập nhật một lần mỗi tập, tức là cần trải qua chuỗi trạng thái hoàn chỉnh rồi mới cập nhật, ví dụ trò chơi rắn săn mồi, khi con rắn "chết" tức trò chơi kết thúc thì mới cập nhật. Còn phương pháp học tăng cường sai phân thời gian thì cập nhật một lần mỗi bước, ví dụ trò chơi rắn săn mồi, con rắn mỗi lần di chuyển (hoặc vài lần) thì cập nhật. Tương đối mà nói, phương pháp học tăng cường sai phân thời gian có tần suất cập nhật cao hơn phương pháp học tăng cường Monte Carlo.

(2) Phương pháp học tăng cường sai phân thời gian có thể học ngay sau khi biết một bước nhỏ, so với phương pháp học tăng cường Monte Carlo, nó nhanh và linh hoạt hơn.

(3) Ví dụ cụ thể: giả sử ta muốn tối ưu thời gian lái xe đi làm đến công ty. Với bài toán này, mỗi lần đi làm, ta sẽ đi qua các ngã tư khác nhau. Với phương pháp học tăng cường sai phân thời gian, nó sẽ tính thời gian cho mỗi ngã tư đi qua, ví dụ ngay tại ngã tư A đã bắt đầu cập nhật thời gian dự kiến đến ngã tư B, ngã tư C $\cdots \cdots$, và thời gian đến công ty; với phương pháp học tăng cường Monte Carlo, nó không cập nhật thời gian mỗi khi qua một ngã tư, mà đợi đến đích cuối cùng rồi mới sửa thời gian đến mỗi ngã tư và đến công ty.

**4-8** Hãy mô tả chi tiết quá trình tính toán của thuật toán REINFORCE.

Trước tiên ta cần dựa vào một mô hình chính sách đã xác định để đưa ra xác suất của mỗi hành động có thể, với xác suất của tất cả các hành động, ta dùng phương pháp lấy mẫu (hoặc phương pháp ngẫu nhiên) để chọn một hành động tương tác với môi trường, đồng thời môi trường sẽ phản hồi cho ta dữ liệu của cả tập. Đưa dữ liệu của tập này vào hàm học, và dựa vào dữ liệu của tập để xây dựng hàm mất mát, thông qua tối ưu bằng các bộ tối ưu như Adam, rồi cập nhật mô hình chính sách.


## Câu hỏi phỏng vấn

**4-1** Người phỏng vấn thân thiện: Nào bạn, hãy suy luận thủ công cho tôi quá trình tính công thức gradient chính sách.

Trước hết mục đích của ta là tối đa hóa hàm phần thưởng, tức là điều chỉnh $\theta$ để lợi tức kỳ vọng lớn nhất, có thể biểu diễn bằng công thức như sau:

$$
J(\theta)=E_{\tau \sim p_{\theta(\tau)}}\left[\sum_tr(s_t,a_t)\right]
$$

Trong đó $\tau$ biểu thị một quỹ đạo hoàn chỉnh từ đầu đến cuối. Thông thường với bài toán tối đa hóa, ta có thể dùng thuật toán gradient ascent để tìm giá trị lớn nhất, tức là

$$
\theta^* = \theta + \alpha\nabla J({\theta})
$$

Vì vậy ta chỉ cần tính và cập nhật $\nabla J({\theta})$, tức là tính gradient của hàm phần thưởng $J({\theta})$ theo $\theta$, cũng chính là gradient chính sách, cách tính như sau:

$$
\nabla_{\theta}J(\theta) = \int {\nabla}_{\theta}p_{\theta}(\tau)r(\tau) \mathrm{d}{\tau}=\int p_{\theta}{\nabla}_{\theta} \mathrm{log}p_{\theta}(\tau)r(\tau)\mathrm{d}{\tau}=E_{\tau \sim p_{\theta}(\tau)}[{\nabla}_{\theta}\mathrm{log}p_{\theta}(\tau)r(\tau)]
$$

Tiếp tục khai triển, với $p_{\theta}(\tau)$, tức $p_{\theta}(\tau|{\theta})$:

$$
p_{\theta}(\tau|{\theta}) = p(s_1)\prod_{t=1}^T \pi_{\theta}(a_t|s_t)p(s_{t+1}|s_t,a_t)
$$

Lấy logarit được:

$$
\mathrm{log}p_{\theta}(\tau|{\theta}) = \mathrm{log}p(s_1)+\sum_{t=1}^T \mathrm{log}\pi_{\theta}(a_t|s_t)p(s_{t+1}|s_t,a_t)
$$

Tiếp tục lấy đạo hàm:

$$
\nabla \mathrm{log}p_{\theta}(\tau|{\theta}) = \sum_{t=1}^T \nabla_{\theta}\mathrm{log} \pi_{\theta}(a_t|s_t)
$$

Thay vào biểu thức thứ 3, có thể rút gọn thành:

$$
\begin{aligned}
    \nabla_{\theta}J(\theta) 
    &= E_{\tau \sim p_{\theta}(\tau)}[{\nabla}_{\theta}\mathrm{log}p_{\theta}(\tau)r(\tau)] \\
    &= E_{\tau \sim p_{\theta}}[(\nabla_{\theta}\mathrm{log}\pi_{\theta}(a_t|s_t))(\sum_{t=1}^Tr(s_t,a_t))] \\
    &= \frac{1}{N}\sum_{i=1}^N[(\sum_{t=1}^T\nabla_{\theta}\mathrm{log} \pi_{\theta}(a_{i,t}|s_{i,t}))(\sum_{t=1}^Tr(s_{i,t},a_{i,t}))]    
\end{aligned}
$$

> Ghi chú của người dịch: ở dòng cuối, bản gốc viết cận trên của tổng phần thưởng là $N$ ($\sum_{t=1}^N$); ở đây đã sửa thành $T$ cho đúng (tổng theo bước thời gian trong một quỹ đạo).

**4-2** Người phỏng vấn thân thiện: Bạn có thể nói về các mẹo tối ưu dựa trên gradient chính sách mà bạn biết không?

(1) Thêm đường cơ sở: để tránh việc mọi phần thưởng đều dương, dẫn đến mọi biến đổi trạng thái và hành động đều làm xác suất của mỗi biến đổi tăng lên, ta trừ phần thưởng đi một số hạng $b$, gọi $b$ là đường cơ sở. Sau khi trừ $b$, ta có thể làm phần thưởng $R(\tau^n)-b$ có cả dương lẫn âm. Nếu tổng phần thưởng nhận được $R(\tau^n)$ lớn hơn $b$, ta tăng xác suất của nó. Nếu tổng phần thưởng nhỏ hơn $b$, dù nó dương nhưng giá trị nhỏ cũng không tốt, cần giảm xác suất của nó. Nếu tổng phần thưởng nhỏ hơn $b$, phải làm giảm phần thưởng của việc thực hiện hành động này, điều này cũng hợp lý. Nhưng dùng đường cơ sở sẽ làm phần thưởng của các "hành động" vốn có phần thưởng lớn trở nên nhỏ hơn, giảm tốc độ cập nhật.

(2) Gán điểm phù hợp: trước hết, trọng số ban đầu là tổng phần thưởng của cả tập. Giờ đổi thành bắt đầu từ một thời điểm $t$ nào đó, giả sử hành động này được thực hiện ở thời điểm $t$, thì tổng tất cả phần thưởng từ thời điểm $t$ đến khi trò chơi kết thúc mới thực sự đại diện cho việc hành động này tốt hay không tốt; tiến thêm một bước, ta chiết khấu phần thưởng tương lai, ở đây ta gọi tổng phần thưởng thu được như vậy là lợi tức chiết khấu.

(3) Kết hợp cả hai mẹo trên, ta gọi chung là hàm lợi thế, dùng $A$ để biểu thị hàm lợi thế. Hàm lợi thế phụ thuộc vào trạng thái và hành động, tức là ta cần tính xem khi thực hiện một hành động $a$ nào đó ở một trạng thái $s$ nào đó, hàm lợi thế lớn bao nhiêu.
