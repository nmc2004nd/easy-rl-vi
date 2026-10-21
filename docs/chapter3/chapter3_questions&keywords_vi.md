# Chương 3 Phương pháp dạng bảng

## Từ khóa

- **Hàm xác suất và hàm phần thưởng**: hàm xác suất (probability function) biểu thị định lượng xác suất chuyển trạng thái, nó thể hiện tính ngẫu nhiên của môi trường. Nhưng trên thực tế, ta thường ở trong một môi trường chưa biết, tức là hàm xác suất và hàm phần thưởng (reward function) là chưa biết.

- **Bảng Q (Q-table)**: có dạng một bảng, trong đó trục ngang là hành động (hành động của tác tử), trục dọc là trạng thái của môi trường, mỗi điểm tọa độ ứng với trạng thái của tác tử và môi trường ở một thời điểm, và hành động được chọn thực hiện thông qua phản hồi phần thưởng tương ứng. Thông thường, bảng Q là một bảng đã được huấn luyện xong, nhưng ta cũng có thể cập nhật bảng Q sau mỗi bước thực hiện, rồi dùng giá trị Q của trạng thái tiếp theo để cập nhật giá trị Q của trạng thái hiện tại (tức phương pháp sai phân thời gian).

- **Phương pháp sai phân thời gian (temporal difference, TD)**: một cách cập nhật hàm Q (giá trị Q), quy trình là dùng giá trị Q của bước tiếp theo $Q(s_{t+1},a_{t+1})$ để cập nhật giá trị Q của bước hiện tại $Q(s_t,a_t)$. Công thức tính đầy đủ như sau: $Q(s_t,a_t) \leftarrow Q(s_t,a_t) + \alpha [r_{t+1}+\gamma Q(s_{t+1},a_{t+1})-Q(s_t,a_t)]$.

- **Thuật toán Sarsa**: một thuật toán học tăng cường cập nhật một bước, cập nhật trạng thái ở thời điểm trước, đồng thời là một thuật toán học on-policy (cùng chính sách). Vì mỗi lần cập nhật hàm Q, thuật toán này cần biết trạng thái, hành động, phần thưởng của bước trước cùng với trạng thái ở thời điểm hiện tại và hành động sắp thực hiện, tức các giá trị $s_{t}$, $a_{t}$, $r_{t+1}$, $s_{t+1}$, $a_{t+1}$, nên nó được gọi là thuật toán Sarsa. Mỗi vòng lặp, tác tử đều dùng $s_{t}$, $a_{t}$, $r_{t+1}$, $s_{t+1}$, $a_{t+1}$ để cập nhật giá trị Q (hàm Q) của bước trước một lần.


## Bài tập

**3-1** Bộ bốn của quá trình quyết định Markov trong học tăng cường gồm những biến nào?

Trạng thái, hành động, xác suất chuyển trạng thái và phần thưởng, lần lượt ứng với $(S,A,P,R)$, về sau có thể thêm hệ số chiết khấu để tạo thành bộ năm.

**3-2** Hãy mô tả một cách dễ hiểu quy trình "học" của học tăng cường.

Có thể so sánh quy trình "học" của học tăng cường với quy trình học của con người. Con người học bằng cách thử từng con đường và ghi nhớ kết quả cuối cùng sau khi thử mỗi con đường. Trong quá trình thử, con người dần dần hiểu được con đường nào (ứng với khái niệm trạng thái trong học tăng cường) tốt hơn. Ta dùng hàm giá trị $V(s)$ để biểu thị định lượng trạng thái đó tốt hay xấu, rồi dùng hàm Q để đánh giá ở trạng thái nào làm hành động nào thì nhận được phần thưởng lớn nhất; trong học tăng cường ta dùng hàm Q để biểu thị giá trị trạng thái-hành động.

**3-3** Hãy mô tả quá trình học của tác tử dựa trên thuật toán Sarsa.

Xét môi trường và tác tử. Sau mỗi lần hai bên tương tác, tác tử xuất hành động cho môi trường, tiếp đó môi trường phản hồi cho tác tử trạng thái và phần thưởng ở thời điểm hiện tại. Khi đó tác tử thực hiện hai bước:

(1) Dùng bảng Q đã huấn luyện, chọn hành động tương ứng với trạng thái và phần thưởng mà môi trường phản hồi để xuất ra.

(2) Lúc này ta đã có các giá trị $(s_{t}, a_{t}, r_{t+1}, s_{t+1}, a_{t+1})$, và dùng trực tiếp $a_{t+1}$ để cập nhật bảng Q.

**3-4** Thuật toán Q-learning và thuật toán Sarsa khác nhau thế nào?

Thuật toán Sarsa là bản cải tiến của thuật toán Q-learning (câu này có thể tham khảo phần tóm tắt của bài báo "On-Line Q-Learning Using Connectionist Systems"), mô tả chi tiết như sau.

(1) Trước hết, Q-learning là phương pháp học sai phân thời gian off-policy (khác chính sách), còn thuật toán Sarsa là phương pháp học sai phân thời gian on-policy.

(2) Thứ hai, $a'$ mà thuật toán Sarsa dùng khi cập nhật bảng Q là hành động chắc chắn sẽ được thực hiện khi lấy giá trị Q tiếp theo. Hành động này có thể được lấy mẫu bằng phương pháp $\varepsilon$-tham lam ($\varepsilon$-greedy), cũng có thể là hành động ứng với $\mathrm{max}_Q$, thậm chí là hành động ngẫu nhiên.

(3) Nhưng hành động ứng với giá trị Q $Q(S',a')$ mà Q-learning dùng khi cập nhật bảng Q không nhất thiết là hành động sẽ được thực hiện ở bước tiếp theo, vì hành động thực tế được thực hiện ở bước tiếp theo có thể có được do khám phá thêm. Hành động mặc định của Q-learning không được chọn bởi chính sách hành vi, nó mặc định $a'$ là hành động ứng với chính sách tốt nhất, vì vậy khi cập nhật, thuật toán Q-learning không cần truyền vào $a'$, tức $a_{t+1}$.

(4) So sánh công thức cập nhật (khác biệt chỉ ở phần tính mục tiêu).

Công thức của thuật toán Sarsa: $r_{t+1}+\gamma Q(s_{t+1}, a_{t+1})$.

Công thức của thuật toán Q-learning: $r_{t+1}+\gamma \underset{a}{\max} Q\left(s_{t+1}, a\right)$.

Tóm lại, thực chất thuật toán Sarsa dùng chính sách vốn có để sinh ra quỹ đạo {$S,A,R,S',A'$}, rồi dùng $Q(s_{t+1},a_{t+1})$ để cập nhật giá trị Q ban đầu $Q(s_t,a_t)$. Nhưng thuật toán Q-learning không cần biết hành động thực tế được chọn, nó mặc định hành động tiếp theo chính là hành động có giá trị Q lớn nhất. Vì vậy hành động của thuật toán Sarsa thường "bảo thủ, nhát gan" hơn, còn hành động của thuật toán Q-learning thì "liều lĩnh, mạnh bạo" hơn.

**3-5** On-policy và off-policy khác nhau thế nào?

Thuật toán Sarsa là một thuật toán on-policy điển hình, nó chỉ dùng một $\pi$, để cân bằng khám phá và khai thác, khi huấn luyện nó tỏ ra hơi "nhát gan, sợ sệt". Khi giải bài toán tìm đường bên vách đá, nó sẽ cố gắng tránh xa mép vách đá, đảm bảo rằng dù mình vô tình khám phá một chút vào vùng chưa biết, vẫn ở trong vùng an toàn, không đến mức rơi xuống vách đá.

Thuật toán Q-learning là một thuật toán off-policy khá điển hình, nó có chính sách mục tiêu (target policy), ký hiệu là $\pi$. Ngoài ra còn có chính sách hành vi (behavior policy), ký hiệu là $\mu$. Nó tách biệt chính sách mục tiêu và chính sách hành vi, nhờ đó có thể mạnh dạn dùng các quỹ đạo kinh nghiệm do chính sách hành vi khám phá được để tối ưu chính sách mục tiêu. Như vậy tác tử có khả năng khám phá ra chính sách tối ưu cao hơn.

So sánh công thức cập nhật của thuật toán Q-learning và thuật toán Sarsa có thể thấy, thuật toán Sarsa không có phép chọn giá trị lớn nhất. Do đó, thuật toán Q-learning rất liều lĩnh, nó muốn mỗi bước đều nhận được phần thưởng lớn nhất; còn thuật toán Sarsa thì tương đối bảo thủ hơn, sẽ chọn một lộ trình lặp tương đối an toàn.


## Câu hỏi phỏng vấn

**3-1** Người phỏng vấn thân thiện: Bạn có thể tóm tắt khác biệt giữa on-policy và off-policy không?

Khác biệt căn bản giữa on-policy và off-policy nằm ở việc chính sách sinh mẫu và chính sách dùng khi cập nhật tham số có giống nhau hay không. Với on-policy, chính sách hành vi và chính sách cần tối ưu là cùng một chính sách, sau khi cập nhật chính sách thì dùng phiên bản mới nhất của chính sách đó để lấy mẫu dữ liệu; với off-policy, nó dùng một chính sách hành vi bất kỳ để lấy mẫu dữ liệu, rồi dùng dữ liệu đó để cập nhật chính sách mục tiêu. Ví dụ, khi tính phần thưởng kỳ vọng của trạng thái tiếp theo, Q-learning dùng phép tối đa hóa, chọn trực tiếp hành động tối ưu, trong khi chính sách hiện tại không nhất thiết chọn được hành động tối ưu, vì vậy chính sách sinh mẫu và chính sách khi học ở đây khác nhau, nên Q-learning là thuật toán off-policy; ngược lại, thuật toán Sarsa dựa trên chính sách hiện tại để trực tiếp thực hiện một lần chọn hành động, rồi dùng hành động đó và trạng thái tương ứng để cập nhật chính sách hiện tại, vì vậy chính sách sinh mẫu và chính sách khi học là giống nhau, nên Sarsa là thuật toán on-policy.

**3-2** Người phỏng vấn thân thiện: Bạn có thể giảng chi tiết về thuật toán Q-learning không, tốt nhất là viết ra công thức cập nhật $Q(s,a)$ của nó. Ngoài ra, nó là on-policy hay off-policy, vì sao?

Q-learning là một phương pháp học sai phân thời gian tìm chính sách bằng cách tính hàm giá trị hành động tối ưu, công thức cập nhật của nó là

$$
Q(s, a) \leftarrow Q(s, a) + \alpha [r(s,a) + \gamma \max_{a'} Q(s', a') - Q(s, a)]
$$

Nó là off-policy, vì phép cập nhật Q dùng giá trị lớn nhất ở thời điểm tiếp theo, nên nó chỉ quan tâm hành động nào làm $Q(s_{t+1}, a)$ đạt giá trị lớn nhất, còn thực tế đã thực hiện hành động nào (chính sách hành vi) thì Q-learning không quan tâm. Điều này cho thấy chính sách được tối ưu không dùng dữ liệu của chính sách hành vi, vì vậy nói nó là off-policy.

**3-3** Người phỏng vấn thân thiện: Tốt, có vẻ bạn rất hiểu thuật toán Q-learning, vậy bạn có thể giảng về thuật toán Sarsa tương tự Q-learning không, tốt nhất cũng viết ra công thức cập nhật $Q(s,a)$ tương ứng. Ngoài ra, nó là on-policy hay off-policy, vì sao?

Thuật toán Sarsa có thể coi là bản cải tiến của thuật toán Q-learning, công thức cập nhật của nó là

$$
Q(s, a) \leftarrow Q(s, a) + \alpha [r(s,a) + \gamma  Q(s', a') - Q(s, a)]
$$

Nó là on-policy, thuật toán Sarsa phải thực hiện hai lần hành động để có $(s,a,r,s',a')$ mới cập nhật được một lần; hơn nữa $a'$ là hành động được thực hiện dưới sự chỉ dẫn của chính sách cụ thể $\pi$, vì vậy $Q(s,a)$ ước lượng được là giá trị Q dưới chính sách $\pi$ đó, $\pi$ dùng để sinh mẫu và $\pi$ được ước lượng là cùng một chính sách, vì vậy là on-policy.

**3-4** Người phỏng vấn thân thiện: Phương pháp dựa trên giá trị (value-based) và phương pháp dựa trên chính sách (policy-based) khác nhau thế nào?

(1) Khác biệt trong chính sách sinh ra: cái trước là tất định, cái sau là ngẫu nhiên. Trong phương pháp dựa trên giá trị, giá trị ước lượng của các cặp hành động-giá trị cuối cùng sẽ hội tụ (thường là các số khác nhau, có thể chuyển thành xác suất từ 0 đến 1), vì vậy thường thu được một chính sách tất định; phương pháp dựa trên chính sách sẽ không hội tụ về một giá trị xác định, ngoài ra chúng có xu hướng sinh ra chính sách ngẫu nhiên tốt nhất. Nếu chính sách tốt nhất là tất định, thì giá trị hàm giá trị ứng với hành động tối ưu sẽ lớn hơn nhiều so với giá trị hàm giá trị ứng với hành động gần tối ưu, độ lớn của hàm giá trị đại diện cho độ lớn của xác suất.

(2) Không gian hành động có liên tục hay không: cái trước rời rạc, cái sau liên tục. Với phương pháp dựa trên giá trị, đối với bài toán không gian hành động liên tục, tuy có thể rời rạc hóa không gian hành động, nhưng khó xác định khoảng cách rời rạc. Khoảng cách rời rạc quá lớn sẽ khiến thuật toán không lấy được hành động tối ưu mà quanh quẩn gần hành động tối ưu; khoảng cách rời rạc quá nhỏ sẽ làm tăng số chiều của hành động, giống như không gian hành động nhiều chiều dẫn đến lời nguyền số chiều (curse of dimensionality), ảnh hưởng đến tốc độ thuật toán. Còn phương pháp dựa trên chính sách phù hợp với không gian hành động liên tục, trong không gian hành động liên tục, có thể không cần tính xác suất của từng hành động mà chọn hành động thông qua phân phối chuẩn (normal distribution).

(3) Phương pháp dựa trên giá trị, ví dụ thuật toán Q-learning, tìm chính sách tối ưu một cách gián tiếp bằng cách giải hàm giá trị tối ưu; phương pháp dựa trên chính sách, ví dụ các thuật toán như REINFORCE, tham số hóa trực tiếp chính sách, dùng tìm kiếm chính sách (policy search), gradient chính sách (policy gradient) hoặc phương pháp tiến hóa (evolutionary method) để cập nhật tham số nhằm tối đa hóa lợi tức. Phương pháp dựa trên giá trị khó mở rộng sang không gian hành động liên tục, và khi đồng thời dùng xấp xỉ phi tuyến, bootstrapping,... sẽ gặp vấn đề hội tụ. Gradient chính sách có tính hội tụ tốt.

(4) Ngoài ra, với lặp giá trị và lặp chính sách: lặp chính sách có hai vòng lặp, một là khi ước lượng chính sách, để tính hàm giá trị của chính sách hiện tại cần lặp nhiều lần; vòng còn lại là vòng lặp lớn bên ngoài, tức đánh giá chính sách, cải thiện chính sách. Còn thuật toán lặp giá trị thì làm một bước đến đích, trực tiếp ước lượng hàm giá trị tối ưu, vì vậy không có khâu cải thiện chính sách.

**3-5** Người phỏng vấn thân thiện: Hãy tóm tắt phương pháp sai phân thời gian.

Thuật toán sai phân thời gian là phương pháp dùng lặp chính sách tổng quát (generalized policy iteration) để cập nhật hàm Q, cốt lõi là dùng bootstrapping, tức là khi cập nhật hàm giá trị thì dùng hàm giá trị của trạng thái tiếp theo để ước lượng giá trị của trạng thái hiện tại. Tức là dùng giá trị Q của bước tiếp theo $Q(s_{t+1},a_{t+1})$ để cập nhật giá trị Q của bước hiện tại $Q(s_t,a_t) $. Công thức tính đầy đủ như sau:

$$
Q(s_t,a_t) \leftarrow	 Q(s_t,a_t) + \alpha [r_{t+1}+\gamma Q(s_{t+1},a_{t+1}) - Q(s_t,a_t)]
$$

> Ghi chú của người dịch: công thức trong bản gốc thiếu số hạng $-Q(s_t,a_t)$ trong ngoặc vuông; ở đây đã bổ sung cho khớp với công thức ở phần từ khóa và chương chính.

**3-6** Người phỏng vấn thân thiện: Phương pháp Monte Carlo và phương pháp sai phân thời gian có phải ước lượng không chệch (unbiased estimate) không? Ngoài ra phương pháp nào có phương sai lớn hơn? Vì sao?

Phương pháp Monte Carlo là ước lượng không chệch, phương pháp sai phân thời gian là ước lượng có chệch (biased estimate); phương pháp Monte Carlo có phương sai lớn hơn, phương pháp sai phân thời gian có phương sai nhỏ hơn, nguyên nhân là phương pháp sai phân thời gian dùng bootstrapping, tạo ra hiệu ứng làm trơn (smoothing), khiến phương sai của hàm giá trị ước lượng nhỏ hơn.

**3-7** Người phỏng vấn thân thiện: Bạn có thể nói đơn giản về điểm giống và khác nhau giữa phương pháp quy hoạch động, phương pháp Monte Carlo và phương pháp sai phân thời gian không?

Điểm giống: đều dùng để mô tả và cập nhật hàm giá trị, và tất cả các phương pháp đều dựa trên việc nhìn trước các sự kiện tương lai để tính một giá trị truy ngược (backup value).

Điểm khác: phương pháp Monte Carlo và phương pháp sai phân thời gian thuộc nhóm phương pháp không mô hình (model-free), còn quy hoạch động thuộc nhóm phương pháp có mô hình (model-based); phương pháp sai phân thời gian và phương pháp Monte Carlo, vì đều là phương pháp không mô hình, nên việc biết được các trạng thái kế tiếp đều dựa trên thử nghiệm; phần đánh giá chính sách của phương pháp sai phân thời gian và phương pháp quy hoạch động đều có thể dựa trên dự đoán bước tiếp theo của trạng thái hiện tại để cập nhật hàm giá trị của trạng thái hiện tại.

Ngoài ra, phương pháp sai phân thời gian không cần đợi thử nghiệm kết thúc mới tính và cập nhật được hàm giá trị của trạng thái hiện tại, còn phương pháp Monte Carlo cần tương tác với môi trường, sinh ra cả một chuỗi Markov và đến trạng thái cuối cùng mới cập nhật được. Điểm khác giữa phần đánh giá chính sách của phương pháp sai phân thời gian và phương pháp quy hoạch động là không mô hình và có mô hình: phương pháp quy hoạch động có thể dựa vào xác suất chuyển đã biết để suy ra tình hình các trạng thái kế tiếp, còn phương pháp sai phân thời gian phải nhờ thử nghiệm mới biết được.

Khác biệt giữa phương pháp Monte Carlo và phương pháp sai phân thời gian là: phương pháp Monte Carlo thực hiện lấy mẫu đầy đủ để có giá trị lợi tức dài hạn, vì vậy trong ước lượng giá trị sẽ có độ chệch nhỏ hơn, nhưng cũng chính vì thu thập thông tin đầy đủ nên phương sai của giá trị sẽ lớn hơn, nguyên nhân là nó có được nhờ lấy mẫu dựa trên thử nghiệm, có khoảng cách với phân phối thực, tương tác không đủ dẫn đến phương sai lớn. Còn phương pháp sai phân thời gian thì ngược lại, vì nó chỉ xét giá trị lợi tức của một bước trước, phần còn lại đều dựa trên giá trị ước lượng trước đó, vì vậy ước lượng giá trị của nó tương đối có đặc điểm độ chệch lớn, phương sai nhỏ.

Mối liên hệ giữa ba phương pháp: với phương pháp TD($\lambda$), nếu $\lambda = 0$ thì tương đương với phương pháp sai phân thời gian, tức chỉ xét trạng thái tiếp theo; nếu $\lambda = 1$ thì tương đương với phương pháp Monte Carlo, tức xét $T-1$ trạng thái kế tiếp cho đến khi toàn bộ thử nghiệm kết thúc.
