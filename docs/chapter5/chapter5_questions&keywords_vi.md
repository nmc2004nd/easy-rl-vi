# Chương 5 Thuật toán tối ưu chính sách cận kề (PPO)

## Từ khóa

- **On-policy (cùng chính sách)**: chính sách tương ứng với trường hợp tác tử cần học và tác tử tương tác với môi trường là một.

- **Off-policy (khác chính sách)**: chính sách tương ứng với trường hợp tác tử cần học và tác tử tương tác với môi trường không phải là một.

- **Lấy mẫu theo trọng số quan trọng (importance sampling)**: một phương pháp dùng một phân phối khác để xấp xỉ phân phối cần tìm, trong học tăng cường thường được dùng kết hợp với phương pháp Monte Carlo, công thức như sau:
$$
    \int f(x) p(x) \mathrm{d} x=\int f(x) \frac{p(x)}{q(x)} q(x) \mathrm{d} x=E_{x \sim q}[f(x){\frac{p(x)}{q(x)}}]=E_{x \sim p}[f(x)]
$$
Khi đã biết phân phối $q$, ta có thể dùng công thức trên để tính giá trị kỳ vọng khi lấy mẫu $x$ từ phân phối $p$ rồi đưa vào $f$.

- **Tối ưu chính sách cận kề (proximal policy optimization, PPO)**: thuật toán được dùng để tránh việc khi dùng importance sampling, $p_{\theta}\left(a_{t} | s_{t}\right)$ dưới $\theta$ và $p_{\theta'}\left(a_{t} | s_{t}\right)$ dưới $\theta '$ chênh lệch quá nhiều, dẫn đến kết quả importance sampling bị lệch lớn. Cụ thể là trong quá trình huấn luyện thêm một ràng buộc, ràng buộc này ứng với độ phân kỳ KL (KL divergence) giữa các hành động do $\theta$ và $\theta'$ đưa ra, để đo mức độ tương đồng giữa $\theta$ và $\theta'$.


## Bài tập

**5-1** Gradient chính sách dựa trên on-policy có điểm nào có thể cải thiện? Hay nói cách khác, nguyên nhân khiến nó kém hiệu quả là gì?

Phần lớn thời gian của gradient chính sách kinh điển dành cho việc lấy mẫu dữ liệu, tức là sau khi tác tử tương tác với môi trường, ta phải cập nhật mô hình chính sách. Nhưng với một tập ta chỉ có thể cập nhật mô hình chính sách một lần, cập nhật xong lại phải tốn thời gian lấy mẫu lại dữ liệu, rồi mới có thể cập nhật tiếp như trên.

Vì vậy ta có thể dùng phương pháp off-policy, tức là dùng một chính sách và diễn viên khác để tương tác với môi trường, và dùng dữ liệu lấy mẫu được để cập nhật chính sách ban đầu. Như vậy tương đương với việc dùng cùng một bộ dữ liệu, trong cùng một tập, ta cập nhật toàn bộ mô hình chính sách nhiều lần, như vậy sẽ hiệu quả hơn.

**5-2** Khi dùng importance sampling cần chú ý những vấn đề gì?

Trong importance sampling ta có thể thay $p$ bằng bất kỳ $q$ nào, nhưng về bản chất yêu cầu phân phối của hai bên không được chênh lệch quá nhiều, dù ta đã bù trọng số $\frac{p(x)}{q(x)}$ cho các phân phối dữ liệu khác nhau. $E_{x \sim p}[f(x)]=E_{x \sim q}\left[f(x) \frac{p(x)}{q(x)}\right]$, khi số lần lấy mẫu trên cả hai phân phối đều khá nhiều, kết quả cuối cùng sẽ khá gần nhau. Nhưng thông thường ta không lấy được số lượng dữ liệu mẫu lý tưởng, vì vậy nếu phân phối của hai bên chênh lệch lớn, phương sai của kết quả cuối cùng sẽ rất lớn.

**5-3** Trong importance sampling dựa trên off-policy, dữ liệu được lấy mẫu từ $\theta'$, chuyển từ $\theta$ sang $\theta'$ có ưu thế gì?

Sau khi dùng importance sampling dựa trên off-policy, ta không dùng $\theta$ tương tác với môi trường, mà để một chính sách khác $\theta'$ làm mẫu. Nhiệm vụ của $\theta'$ là làm mẫu cho $\theta$ xem, nó tương tác với môi trường, cho $\theta$ biết khi nó tương tác với môi trường thì điều gì sẽ xảy ra, từ đó huấn luyện $\theta$. Thứ ta cần huấn luyện là $\theta$, $\theta'$ chỉ chịu trách nhiệm làm mẫu, chịu trách nhiệm tương tác với môi trường, vì vậy dữ liệu lấy mẫu được không liên quan gì đến bản thân $\theta$. Do đó có thể cho $\theta'$ tương tác với môi trường để lấy mẫu lượng lớn dữ liệu, $\theta$ có thể cập nhật tham số nhiều lần. Cho đến khi $\theta$ được huấn luyện đến một mức nhất định, tham số được cập nhật nhiều lần, $\theta'$ mới lấy mẫu lại, đây chính là cái hay của việc chuyển từ on-policy sang off-policy.

**5-4** Độ phân kỳ KL trong tối ưu chính sách cận kề ở phần này là gì?

Về bản chất, độ phân kỳ KL là một hàm, nó đo khoảng cách hành vi giữa hai hành động (với tham số tương ứng là $\theta$ và $\theta'$), chứ không phải khoảng cách tham số. Khoảng cách hành vi ở đây có thể hiểu là khoảng cách giữa các hành động đầu ra ở cùng một trạng thái (khoảng cách trên phân phối xác suất), khoảng cách giữa các phân phối xác suất chính là độ phân kỳ KL.


## Câu hỏi phỏng vấn

**5-1** Người phỏng vấn thân thiện: Importance sampling là gì?

Là một phương pháp dùng một phân phối khác để xấp xỉ phân phối cần tìm, có thể coi là một phương pháp hiệu chỉnh kỳ vọng, công thức như sau:

$$
\int f(x) p(x) \mathrm{d} x=\int f(x) \frac{p(x)}{q(x)} q(x) \mathrm{d} x=E_{x \sim q}[f(x){\frac{p(x)}{q(x)}}]=E_{x \sim p}[f(x)]
$$

Khi đã biết phân phối $q$, ta có thể dùng công thức trên để tính giá trị kỳ vọng theo phân phối $p$. Tức là có thể dùng $q$ để lấy mẫu thay cho $p$, đó chính là importance sampling.

**5-2** Người phỏng vấn thân thiện: On-policy và off-policy khác nhau thế nào?

Tôi có thể tóm tắt khác biệt giữa hai loại bằng một câu: chính sách (hàm giá trị) sinh mẫu và chính sách (hàm giá trị) dùng khi cập nhật tham số mạng có giống nhau hay không. Cụ thể, với on-policy, chính sách (hàm giá trị) sinh mẫu giống với chính sách (hàm giá trị) dùng khi cập nhật tham số mạng. Thuật toán Sarsa là on-policy, nó dựa trên chính sách hiện tại để trực tiếp thực hiện một hành động, rồi dùng giá trị của hàm giá trị để cập nhật chính sách hiện tại, vì vậy chính sách sinh mẫu và chính sách khi học là giống nhau, thuật toán là on-policy. Thuật toán này sẽ gặp thế lưỡng nan khám phá-khai thác (exploration-exploitation dilemma): chỉ khai thác lựa chọn tốt nhất đã biết hiện tại thì có thể không học được lời giải tối ưu, dễ mắc kẹt ở tối ưu cục bộ, còn thêm khám phá vào thì lại làm giảm hiệu quả học. Thuật toán $\varepsilon$-tham lam ($\varepsilon$-greedy) là sự dung hòa trong mâu thuẫn này, ưu điểm của nó là đơn giản trực tiếp, tốc độ nhanh, nhược điểm là không nhất thiết tìm được chính sách tối ưu. Với off-policy, chính sách (hàm giá trị) sinh mẫu khác với chính sách (hàm giá trị) dùng khi cập nhật tham số mạng. Ví dụ, thuật toán Q-learning khi tính phần thưởng kỳ vọng của trạng thái tiếp theo dùng phép tối đa hóa, chọn trực tiếp hành động tối ưu, trong khi chính sách hiện tại không nhất thiết chọn được hành động tối ưu, vì vậy chính sách sinh mẫu và chính sách khi học ở đây khác nhau, tức thuật toán off-policy.

**5-3** Người phỏng vấn thân thiện: Hãy tóm tắt thuật toán tối ưu chính sách cận kề. Nó có quan hệ gì với thuật toán tối ưu chính sách vùng tin cậy (TRPO)?

Thuật toán tối ưu chính sách cận kề học hỏi từ thuật toán tối ưu chính sách vùng tin cậy (trust region policy optimization, TRPO), thông qua việc dùng tối ưu bậc một (first-order optimization), nó đạt được sự cân bằng mới giữa hiệu quả lấy mẫu, hiệu năng thuật toán và độ phức tạp khi cài đặt, gỡ lỗi. Đó là vì thuật toán tối ưu chính sách cận kề ở mỗi vòng lặp sẽ cố gắng tính chính sách mới để tối thiểu hóa hàm mất mát, đồng thời đảm bảo mỗi chính sách mới tính ra không chênh lệch nhiều với chính sách ban đầu. Nói cách khác, nó là thuật toán được dùng để tránh việc khi dùng importance sampling, $p_{\theta}\left(a_{t} | s_{t}\right)$ dưới $\theta$ và $p_{\theta'}\left(a_{t} | s_{t}\right)$ dưới $\theta'$ chênh lệch quá nhiều, dẫn đến kết quả importance sampling bị lệch lớn.
