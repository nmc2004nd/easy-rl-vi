# Chương 2 Quá trình quyết định Markov (MDP)

## Từ khóa

**Tính chất Markov (Markov property, MP)**: nếu trạng thái tương lai của một quá trình không phụ thuộc vào các trạng thái quá khứ mà chỉ do trạng thái hiện tại quyết định, thì quá trình đó có tính chất Markov. Nói cách khác, trạng thái tiếp theo của một trạng thái chỉ phụ thuộc vào trạng thái hiện tại của nó, và không liên quan gì đến các trạng thái trước trạng thái hiện tại.

**Chuỗi Markov (Markov chain)**: quá trình ngẫu nhiên (stochastic process) trong lý thuyết xác suất và thống kê toán học, có tính chất Markov và tồn tại trên tập chỉ số (index set) và không gian trạng thái (state space) rời rạc.

**Ma trận chuyển trạng thái (state transition matrix)**: ma trận chuyển trạng thái tương tự xác suất có điều kiện (conditional probability), nó biểu thị xác suất đi đến tất cả các trạng thái khác khi tác tử đã đến một trạng thái nào đó. Mỗi hàng của ma trận mô tả xác suất đi từ một nút đến tất cả các nút khác.

**Quá trình phần thưởng Markov (Markov reward process, MRP)**: bản chất là chuỗi Markov cộng thêm một hàm phần thưởng. Trong quá trình phần thưởng Markov, ma trận chuyển trạng thái và các trạng thái đều giống chuỗi Markov, chỉ có thêm một hàm phần thưởng. Hàm phần thưởng là một kỳ vọng, tức là ở một trạng thái nào đó có thể nhận được bao nhiêu phần thưởng.

**Tầm (horizon)**: định nghĩa độ dài của một tập (episode) hoặc một quỹ đạo hoàn chỉnh, nó được xác định bởi một số hữu hạn bước.

**Lợi tức (return)**: phần thưởng tương ứng thu được sau khi chiết khấu (discounted) các phần thưởng.

**Phương trình Bellman (Bellman equation)**: định nghĩa quan hệ lặp giữa trạng thái hiện tại và trạng thái tương lai, cho biết hàm giá trị của trạng thái hiện tại có thể được tính thông qua hàm giá trị của trạng thái tiếp theo. Phương trình Bellman được đặt theo tên người đề xuất nó, nhà sáng lập quy hoạch động Richard Bellman, và còn được gọi là "phương trình quy hoạch động". Phương trình Bellman là $V(s)=R(s)+ \gamma \sum_{s' \in S}P(s'|s)V(s')$, đặc biệt, dạng ma trận của nó là $\mathrm{V}=\mathrm{R}+\gamma \mathrm{PV}$.

**Thuật toán Monte Carlo (Monte Carlo algorithm, MC algorithm)**: có thể dùng để tính giá trị của hàm giá trị. Dùng ví dụ chiếc thuyền trong phần này, khi có một quá trình phần thưởng Markov, ta có thể bắt đầu từ một trạng thái nào đó, thả chiếc thuyền xuống nước, để nó trôi theo dòng, như vậy sẽ sinh ra một quỹ đạo, từ đó có được một phần thưởng đã chiết khấu $g$. Khi tích lũy phần thưởng này đến một số lượng nhất định, chia trực tiếp cho số quỹ đạo sẽ được giá trị của hàm giá trị.

**Thuật toán quy hoạch động (dynamic programming, DP)**: có thể dùng để tính giá trị của hàm giá trị. Lặp liên tục phương trình Bellman tương ứng, cuối cùng làm nó hội tụ. Khi trạng thái vừa cập nhật lần cuối không khác biệt nhiều so với trạng thái trước đó, việc cập nhật của thuật toán quy hoạch động có thể dừng lại.

**Hàm Q (Q-function)**: định nghĩa kỳ vọng của lợi tức có thể nhận được ứng với một trạng thái nào đó và một hành động nào đó.

**Bài toán dự đoán trong quá trình quyết định Markov**: tức bài toán đánh giá chính sách (policy evaluation), cho trước một quá trình quyết định Markov và một chính sách $\pi$, tính hàm chính sách của nó, tức là giá trị hàm giá trị của mỗi trạng thái là bao nhiêu. Có thể giải bằng thuật toán quy hoạch động.

**Bài toán điều khiển trong quá trình quyết định Markov**: tức là tìm một chính sách tối ưu, đầu vào là quá trình quyết định Markov, đầu ra là hàm giá trị tối ưu (optimal value function) và chính sách tối ưu (optimal policy). Có thể giải bằng thuật toán quy hoạch động.

**Hàm giá trị tối ưu**: tìm kiếm một chính sách $\pi$ làm giá trị của mỗi trạng thái lớn nhất, $V^*$ chính là giá trị cực đại khi đến mỗi trạng thái. Trong trường hợp cực đại, chính sách ta có được là chính sách tối ưu. Chính sách tối ưu làm hàm giá trị của mỗi trạng thái đều đạt giá trị lớn nhất. Vì vậy khi ta nói môi trường của một quá trình quyết định Markov là giải được, thực ra là ta có thể có được một hàm giá trị tối ưu.


## Bài tập

**2-1** Tại sao trong quá trình phần thưởng Markov cần có hệ số chiết khấu?

(1) Trước hết, một số quá trình Markov có dạng vòng, nó không có điểm kết thúc, vì vậy ta muốn tránh phần thưởng vô hạn.

(2) Ngoài ra, ta muốn biểu diễn cả sự bất định, mong muốn nhận phần thưởng càng sớm càng tốt, chứ không phải nhận phần thưởng ở một thời điểm nào đó trong tương lai.

(3) Tiếp nối ý trên, nếu phần thưởng này có giá trị thực tế, có thể ta muốn nhận phần thưởng ngay lập tức hơn là phải đợi sau này mới nhận được.

(4) Còn nữa, trong một số trường hợp, hệ số chiết khấu cũng có thể đặt bằng 0. Khi đặt bằng 0, ta chỉ quan tâm đến phần thưởng hiện tại. Ta cũng có thể đặt nó bằng 1, đặt bằng 1 nghĩa là phần thưởng nhận được trong tương lai và phần thưởng nhận được hiện tại là như nhau.

Vì vậy, hệ số chiết khấu có thể được điều chỉnh như một siêu tham số (hyperparameter) của tác tử học tăng cường, và khi đó sẽ có các tác tử có hành vi khác nhau.

**2-2** Tại sao nghiệm giải tích của phương trình Bellman dạng ma trận khá khó tìm?

Thông qua phép nghịch đảo ma trận, ta có thể tìm ra nghiệm giải tích của $V$. Nhưng độ phức tạp của phép nghịch đảo ma trận là $O(N^3)$, vì vậy khi số trạng thái rất lớn, ví dụ từ 10 trạng thái lên 1000 trạng thái, lên 1 triệu trạng thái, thì khi có 1 triệu trạng thái, ma trận chuyển sẽ là một ma trận 1 triệu × 1 triệu. Nghịch đảo một ma trận lớn như vậy là rất khó, vì vậy phương pháp giải bằng nghiệm giải tích này chỉ có thể áp dụng cho quá trình phần thưởng Markov rất nhỏ.

**2-3** Có những phương pháp phổ biến nào để tính phương trình Bellman, chúng khác nhau thế nào?

(1) Phương pháp Monte Carlo: có thể dùng để tính giá trị của hàm giá trị. Lấy ví dụ chiếc thuyền trong sách, khi có một quá trình phần thưởng Markov, ta có thể bắt đầu từ một trạng thái nào đó, thả chiếc thuyền xuống nước, để nó "trôi theo dòng nước", như vậy sẽ sinh ra một quỹ đạo, từ đó có được một phần thưởng đã chiết khấu $g$. Khi tích lũy phần thưởng này đến một số lượng nhất định, chia trực tiếp cho số quỹ đạo sẽ được giá trị của hàm giá trị.

(2) Phương pháp quy hoạch động: có thể dùng để tính giá trị của hàm giá trị. Lặp liên tục phương trình Bellman tương ứng, cuối cùng làm nó hội tụ. Khi trạng thái vừa cập nhật lần cuối không khác biệt nhiều so với trạng thái trước đó, thường là nhỏ hơn một ngưỡng $\gamma$, việc cập nhật có thể dừng lại.

(3) Phương pháp kết hợp cả hai: ta cũng có thể dùng phương pháp học sai phân thời gian (temporal-difference learning), nó là sự kết hợp giữa phương pháp quy hoạch động và phương pháp Monte Carlo.

**2-4** Quá trình phần thưởng Markov và quá trình quyết định Markov khác nhau thế nào?

So với quá trình phần thưởng Markov, quá trình quyết định Markov có thêm một quá trình ra quyết định, các định nghĩa khác tương tự quá trình phần thưởng Markov. Vì có thêm một quyết định, thêm một hành động, nên việc chuyển trạng thái cũng có thêm một điều kiện, tức là thực hiện một hành động dẫn đến thay đổi trạng thái tương lai; nó không chỉ phụ thuộc vào trạng thái hiện tại mà còn phụ thuộc vào sự thay đổi trạng thái do hành động tác tử thực hiện ở trạng thái hiện tại quyết định. Với hàm giá trị, nó cũng có thêm một điều kiện, thêm hành động hiện tại, tức là trạng thái hiện tại và hành động được thực hiện sẽ quyết định phần thưởng có thể nhận được hiện tại là bao nhiêu.

Ngoài ra, giữa hai quá trình có quan hệ chuyển đổi. Cụ thể, khi đã biết một quá trình quyết định Markov và một chính sách $\pi$, ta có thể chuyển quá trình quyết định Markov thành quá trình phần thưởng Markov. Trong quá trình quyết định Markov, hàm chuyển trạng thái $P(s'|s,a)$ dựa trên trạng thái hiện tại và hành động hiện tại; vì hiện ta đã biết hàm chính sách, tức là ở mỗi trạng thái, ta biết xác suất thực hiện mỗi hành động, nên ta có thể trực tiếp lấy tổng theo hành động, sẽ được xác suất chuyển của quá trình phần thưởng Markov. Tương tự, với phần thưởng, ta có thể loại bỏ hành động, như vậy sẽ được một phần thưởng tương tự quá trình phần thưởng Markov.

**2-5** Việc chuyển trạng thái trong quá trình quyết định Markov và trong quá trình phần thưởng Markov khác nhau những gì về cấu trúc hoặc cách tính?

Với chuỗi Markov, xác suất chuyển của nó được quyết định trực tiếp, tức là từ trạng thái ở thời điểm hiện tại thông qua xác suất chuyển để có giá trị trạng thái ở thời điểm tiếp theo. Nhưng với quá trình quyết định Markov, ở giữa có thêm một tầng xuất hành động, tức là ở trạng thái hiện tại, trước tiên phải quyết định thực hiện một hành động nào đó, rồi thông qua hàm chuyển trạng thái để chuyển sang một trạng thái khác. Vì vậy trong quá trình chuyển từ trạng thái hiện tại sang trạng thái tương lai có thêm một tầng quyết định, đây là điểm khác biệt giữa quá trình quyết định Markov với quá trình Markov trước đó. Trong quá trình quyết định Markov, hành động do tác tử quyết định, vì vậy có thêm một thành phần, tác tử sẽ thực hiện hành động để quyết định việc chuyển trạng thái trong tương lai.

**2-6** Ta tìm chính sách tối ưu như thế nào, có những phương pháp nào để tìm chính sách tối ưu?

Về bản chất, khi đã có hàm giá trị tối ưu, ta có thể tối đa hóa hàm Q để có giá trị tối ưu. Sau đó, ta trực tiếp lấy trên hàm Q giá trị làm hành động lớn nhất, là có thể có ngay chính sách tối ưu. Các phương pháp cụ thể như sau,

(1) Phương pháp vét cạn (thường không dùng): giả sử ta có số trạng thái hữu hạn, số hành động hữu hạn, thì ở mỗi trạng thái ta có thể chọn $A$ loại hành động, tổng cộng là $|A|^{|S|}$ chính sách có thể. Ta có thể vét cạn tất cả, tính hàm giá trị của từng chính sách, so sánh là có được chính sách tối ưu. Nhưng phương pháp này hiệu quả cực thấp.

(2) Lặp chính sách (policy iteration): một phương pháp lặp gồm hai phần, hai bước sau được lặp liên tục và cuối cùng hội tụ, quá trình này phần nào tương tự thuật toán EM (thuật toán kỳ vọng - cực đại hóa, expectation-maximization) trong học máy. Bước thứ nhất là đánh giá chính sách, tức là hiện tại ta đang tối ưu chính sách $\pi$, trong quá trình tối ưu thông qua đánh giá để có một chính sách được cập nhật; bước thứ hai là cải thiện chính sách (policy improvement), tức là sau khi có hàm giá trị, suy ra thêm hàm Q của nó và lấy giá trị lớn nhất.

(3) Lặp giá trị (value iteration): ta liên tục lặp phương trình tối ưu Bellman (Bellman optimality equation), thông qua việc lặp, nó dần tiến tới chính sách tối ưu, đây là cốt lõi của phương pháp lặp giá trị. Để có $V^*$ tối ưu, với giá trị $V^*$ của mỗi trạng thái, ta trực tiếp dùng phương trình tối ưu Bellman để lặp, sau nhiều lần lặp nó sẽ hội tụ về chính sách tối ưu và các trạng thái tương ứng, ở đây không có hàm chính sách.


## Câu hỏi phỏng vấn

**2-1** Người phỏng vấn thân thiện: Quá trình Markov là gì? Quá trình quyết định Markov là gì? Tính chất quan trọng nhất của Markov là gì?

Quá trình Markov là một bộ hai $<S,P>$, $S$ là tập trạng thái, $P$ là hàm chuyển trạng thái;

Quá trình quyết định Markov là một bộ năm $<S,P,A,R,\gamma>$, trong đó $R$ là kỳ vọng phần thưởng nhận được khi đi từ $S$ đến $S'$, $\gamma$ là hệ số chiết khấu, $A$ là tập hành động;

Tính chất quan trọng nhất của Markov là trạng thái tiếp theo chỉ liên quan đến trạng thái hiện tại, không liên quan đến các trạng thái trước đó, tức là $p(s_{t+1} | s_t)= p(s_{t+1}|s_1,s_2,...,s_t)$.

**2-2** Người phỏng vấn thân thiện: Thông thường ta giải quá trình quyết định Markov như thế nào?

Khi giải quá trình quyết định Markov, ta có thể trực tiếp giải phương trình Bellman hoặc phương trình quy hoạch động:

$$V(s)=R(S)+ \gamma \sum_{s' \in S}p(s'|s)V(s')$$

Đặc biệt, dạng ma trận của nó là $\mathrm{V}=\mathrm{R}+\gamma \mathrm{PV}$. Nhưng phương trình Bellman rất khó giải và độ phức tạp tính toán cao, vì vậy có thể dùng các phương pháp quy hoạch động, Monte Carlo và sai phân thời gian để giải.

**2-3** Người phỏng vấn thân thiện: Nếu luồng dữ liệu không có tính chất Markov thì sao? Nên xử lý thế nào?

Nếu không có tính chất Markov, tức là trạng thái tiếp theo còn liên quan đến các trạng thái trước đó, mà chỉ dùng trạng thái hiện tại để giải quá trình quyết định, thì tất yếu sẽ làm khả năng tổng quát hóa của quyết định kém đi. Để giải quyết vấn đề này, có thể dùng mạng nơ-ron hồi quy (recurrent neural network, RNN) để mô hình hóa thông tin lịch sử, thu được biểu diễn trạng thái (state representation) chứa thông tin lịch sử; quá trình biểu diễn cũng có thể dùng các kỹ thuật như cơ chế chú ý (attention mechanism); cuối cùng giải bài toán quá trình quyết định Markov trên không gian trạng thái đã biểu diễn.

**2-4** Người phỏng vấn thân thiện: Hãy viết lần lượt phương trình Bellman dựa trên hàm giá trị trạng thái và phương trình Bellman dựa trên hàm giá trị hành động.

(1) Phương trình Bellman dựa trên hàm giá trị trạng thái (state-value function): $V_{\pi}(s) = \sum_{a}{\pi(a|s)}\sum_{s',r}{p(s',r|s,a)[r(s,a)+\gamma V_{\pi}(s')]}$;

(2) Phương trình Bellman dựa trên hàm giá trị hành động (action-value function): $Q_{\pi}(s,a)=\sum_{s',r}p(s',r|s,a)[r(s',a)+\gamma V_{\pi}(s')]$.

**2-5** Người phỏng vấn thân thiện: Tại sao hàm giá trị tối ưu $V^*$ và chính sách tối ưu $\pi^*$ là tương đương?

Hàm giá trị tối ưu được định nghĩa là $V^* (s)=\max_{\pi} V_{\pi}(s)$, tức là ta tìm một chính sách $\pi$ làm giá trị của mỗi trạng thái lớn nhất. $V^*$ chính là giá trị lớn nhất khi đến mỗi trạng thái, đồng thời chính sách ta có được có thể gọi là chính sách tối ưu, tức $ \pi^{*}(s)=\underset{\pi}{\arg \max }~ V_{\pi}(s)$. Chính sách tối ưu làm hàm giá trị của mỗi trạng thái đều đạt giá trị lớn nhất. Vì vậy nếu ta có được một hàm giá trị tối ưu, có thể nói môi trường của quá trình quyết định Markov đó đã được giải. Trong trường hợp này, hàm giá trị tối ưu là duy nhất, tức là giá trị cận trên mà nó đạt được là duy nhất, nhưng ở đây có thể có nhiều chính sách tối ưu ứng với cùng một giá trị tối ưu.

**2-6** Người phỏng vấn thân thiện: Bạn có thể viết tay công thức cập nhật hàm giá trị $n$ bước không? Ngoài ra, khi $n$ ngày càng lớn, độ chệch (bias) của kỳ vọng và phương sai (variance) của hàm giá trị lần lượt tăng hay giảm?

$n$ càng lớn thì phương sai càng lớn, độ chệch của kỳ vọng càng nhỏ. Công thức cập nhật hàm giá trị như sau:

$$
Q\left(S, A\right) \leftarrow Q\left(S, A\right)+\alpha\left[\sum_{i=1}^{n} \gamma^{i-1} r_{t+i}+\gamma^{n} \max _{a}   Q\left(S',a\right)-Q\left(S, A\right)\right]
$$
