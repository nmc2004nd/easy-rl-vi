# Chương 9 Thuật toán diễn viên-nhà phê bình

## Từ khóa

- **Thuật toán diễn viên-nhà phê bình lợi thế (advantage actor-critic, A2C)**: một thuật toán diễn viên-nhà phê bình (actor-critic) cải tiến.

- **Thuật toán diễn viên-nhà phê bình lợi thế bất đồng bộ (asynchronous advantage actor-critic, A3C)**: một thuật toán diễn viên-nhà phê bình cải tiến, thông qua các thao tác bất đồng bộ (asynchronous), tăng tốc quá trình huấn luyện mô hình học tăng cường.

- **Gradient chính sách đạo hàm theo đường đi (pathwise derivative policy gradient)**: một thuật toán dùng Q-learning để giải hành động liên tục, đồng thời cũng là một thuật toán diễn viên-nhà phê bình. Nó cung cấp cho diễn viên hành động có giá trị lớn nhất, chứ không chỉ cung cấp mức độ tốt xấu của một hành động nào đó.


## Bài tập

**9-1** Quy trình làm việc của thuật toán diễn viên-nhà phê bình lợi thế hoàn chỉnh như thế nào?

Trong phương pháp truyền thống, ta có một chính sách $\pi$ và một diễn viên ban đầu tương tác với môi trường, thu thập dữ liệu và phản hồi. Thông qua phản hồi nhận được ở mỗi bước, ta cập nhật thêm chính sách $\pi$, thường cách cập nhật ta dùng là gradient chính sách. Nhưng với thuật toán diễn viên-nhà phê bình, ta không dùng trực tiếp dữ liệu và phản hồi nhận được ở mỗi bước để cập nhật chính sách $\pi$, mà dùng các dữ liệu và phản hồi này để ước lượng hàm giá trị, ở đây các thuật toán ta thường dùng gồm sai phân thời gian, Monte Carlo,... và các thuật toán tối ưu dựa trên chúng. Tiếp theo ta dựa trên hàm giá trị để cập nhật chính sách, công thức như sau:

$$
\nabla \bar{R}_{\theta} \approx \frac{1}{N} \sum_{n=1}^{N} \sum_{t=1}^{T_{n}}\left(r_{t}^{n}+V_{\pi}\left(s_{t+1}^{n}\right)-V_{\pi}\left(s_{t}^{n}\right)\right) \nabla \log p_{\theta}\left(a_{t}^{n} \mid s_{t}^{n}\right)
$$

Trong đó $r_{t}^{n}+V_{\pi}\left(s_{t+1}^{n}\right)-V_{\pi}\left(s_{t}^{n}\right)$ là hàm lợi thế (advantage function). Sau khi có chính sách mới bằng phương pháp trên, ta lại tương tác với môi trường, rồi lặp lại thao tác ước lượng hàm giá trị, dùng hàm giá trị để cập nhật chính sách. Toàn bộ phương pháp trên ta gọi là thuật toán diễn viên-nhà phê bình lợi thế.

**9-2** Khi cài đặt thuật toán diễn viên-nhà phê bình có những mẹo nào?

(1) Ước lượng hai mạng: một là mạng giá trị; mạng còn lại là mạng chính sách. Đầu vào của mạng giá trị là một trạng thái, đầu ra là một số vô hướng; đầu vào của mạng chính sách là một trạng thái, đầu ra là một phân phối hành động. Trong hai mạng này, đầu vào của diễn viên và nhà phê bình đều là trạng thái, nên vài tầng đầu của chúng có thể dùng chung. Ví dụ, khi chơi game Atari, đầu vào đều là hình ảnh. Hình ảnh đầu vào đều rất phức tạp, và khá lớn, thường ở giai đoạn đầu ta đều dùng một số mạng nơ-ron tích chập để xử lý các hình ảnh này, trừu tượng hóa hình ảnh thành đặc trưng ở mức sâu, các mạng này có thể dùng chung cho mạng diễn viên và mạng nhà phê bình. Ta có thể cho vài tầng đầu của diễn viên và nhà phê bình dùng chung một bộ tham số, bộ tham số này có thể là tham số trong mạng nơ-ron tích chập. Trước tiên biến điểm ảnh đầu vào thành thông tin đặc trưng có số chiều cao hơn, rồi đưa vào mạng diễn viên để quyết định cần thực hiện hành động gì, mạng nhà phê bình dùng hàm giá trị để tính phần thưởng kỳ vọng.

> Ghi chú của người dịch: bản gốc viết đầu ra của mạng giá trị là "标签" (nhãn), có lẽ là lỗi gõ của "标量" (số vô hướng); bản dịch đã sửa theo phần chính của chương.

(2) Cơ chế khám phá: mục đích của nó là hạn chế phân phối đầu ra của chính sách $\pi$, từ đó làm entropy của phân phối không quá nhỏ, tức là mong xác suất các hành động khác nhau được chọn đều hơn một chút. Như vậy khi kiểm thử, tác tử mới thử nhiều hành động khác nhau hơn, mới khám phá môi trường đầy đủ, từ đó có được kết quả khá tốt.

**9-3** Thuật toán diễn viên-nhà phê bình lợi thế bất đồng bộ khi huấn luyện có rất nhiều tiến trình làm việc bất đồng bộ, cuối cùng gom các "kết quả" chúng có được lại với nhau. Vậy cụ thể nó vận hành như thế nào?

Thuật toán diễn viên-nhà phê bình lợi thế bất đồng bộ, tức là ban đầu thuật toán có một mạng toàn cục (global network), gồm phần chính sách và phần giá trị. Giả sử tham số của nó là $\theta_1$, giả sử mỗi diễn viên được huấn luyện trên một CPU, mỗi diễn viên trước khi làm việc đều sao chép tham số của mạng toàn cục về. Sau đó diễn viên tương tác với môi trường, sau khi mỗi diễn viên tương tác với môi trường, đều tính gradient và cập nhật tham số của mạng toàn cục. Cần chú ý ở đây là tất cả các diễn viên đều chạy song song. Vì vậy mỗi diễn viên đều sao chép tham số từ mạng toàn cục, chạy xong rồi gửi tham số về. Vì vậy khi diễn viên thứ nhất chạy xong muốn gửi tham số về, tham số ban đầu nó lấy là $\theta_1$, đến lúc nó gửi gradient về, có thể tham số ban đầu đã bị ghi đè, thành $\theta_2$ rồi.

**9-4** So với thuật toán Q-learning kinh điển, gradient chính sách đạo hàm theo đường đi có những cải tiến gì?

(1) Thay $Q(s,a)$ bằng $\pi$. Thuật toán Q-learning kinh điển dùng $Q(s,a)$ để quyết định sinh ra hành động $a_{t}$ nào ở trạng thái $s_t$, gradient chính sách đạo hàm theo đường đi dùng trực tiếp $\pi$ để quyết định. Với cách trước, ta cần giải bài toán giá trị lớn nhất, còn gradient chính sách đạo hàm theo đường đi bây giờ trực tiếp huấn luyện một mạng diễn viên. Đầu vào trạng thái $s_t$ của nó sẽ cho ta biết nên thực hiện hành động $a_{t}$ nào. Tóm lại, thuật toán Q-learning kinh điển đưa vào trạng thái $s_t$, thực hiện hành động $a_t$ nào là do $Q(s,a)$ quyết định, còn trong gradient chính sách đạo hàm theo đường đi, ta dùng trực tiếp $\pi$ để quyết định.

(2) Thuật toán Q-learning kinh điển tính giá trị Q nhận được khi thực hiện hành động $a$ theo chính sách tương ứng ở $s_{i+1}$, ta sẽ thực hiện hành động $a$ làm $\hat{Q}$ lớn nhất. Gradient chính sách đạo hàm theo đường đi bây giờ vì ta không cần giải bài toán tối đa hóa nữa, nên ta đưa trực tiếp trạng thái $s_{i+1}$ vào chính sách $\pi$, sẽ biết ở trạng thái $s_{i+1}$, hành động nào sẽ mang lại giá trị Q lớn nhất cho ta, thì thực hiện hành động đó. Trong hàm Q có hai mạng Q, một là mạng Q thực, một là mạng Q mục tiêu. Thực tế khi thực thi, cũng có hai mạng diễn viên, một là mạng diễn viên thực sự cần học $\pi$ và một là mạng diễn viên mục tiêu $\hat{\pi}$.

(3) Thuật toán Q-learning kinh điển chỉ cần học hàm Q, gradient chính sách đạo hàm theo đường đi cần học thêm một chính sách $\pi$, mục đích là tối đa hóa hàm Q, mong diễn viên có được có thể làm đầu ra của hàm Q lớn nhất có thể, điều này tương tự khái niệm bộ sinh (generator) trong mạng đối sinh (GAN).

(4) Giống như hàm Q ban đầu, ta cần thay thế mạng Q mục tiêu, trong gradient chính sách đạo hàm theo đường đi cũng cần thay thế chính sách mục tiêu.


## Câu hỏi phỏng vấn

**9-1** Người phỏng vấn thân thiện: Hãy tóm tắt thuật toán diễn viên-nhà phê bình lợi thế bất đồng bộ (A3C), ngoài ra A3C là mô hình on-policy hay off-policy?

A3C là thuật toán diễn viên-nhà phê bình lợi thế bất đồng bộ, trong đó, nhà phê bình học hàm giá trị, đồng thời có nhiều diễn viên huấn luyện song song và thỉnh thoảng đồng bộ với tham số toàn cục. A3C hướng đến huấn luyện song song, là thuật toán on-policy (cùng chính sách).

**9-2** Người phỏng vấn thân thiện: Thuật toán diễn viên-nhà phê bình có ưu điểm gì?

(1) So với các thuật toán lấy hàm giá trị làm trung tâm, thuật toán diễn viên-nhà phê bình áp dụng kỹ thuật gradient chính sách, giúp nó chọn được hành động phù hợp trong không gian hành động liên tục hoặc không gian hành động nhiều chiều, còn Q-learning làm việc này sẽ rất khó.

(2) So với gradient chính sách thuần túy, thuật toán diễn viên-nhà phê bình áp dụng Q-learning hoặc các cách đánh giá chính sách khác, giúp thuật toán diễn viên-nhà phê bình có thể cập nhật từng bước thay vì cập nhật theo tập, hiệu quả cao hơn gradient chính sách thuần túy.

**9-3** Người phỏng vấn thân thiện: Cụ thể thuật toán diễn viên-nhà phê bình lợi thế bất đồng bộ cập nhật bất đồng bộ như thế nào?

Dưới đây là dàn ý của thuật toán diễn viên-nhà phê bình lợi thế bất đồng bộ, vì nó là thuật toán đa luồng bất đồng bộ, ta chỉ phân tích một luồng đơn trong đó.

(1) Định nghĩa tham số toàn cục $\theta$ và $w$ cùng tham số riêng của luồng $\theta'$ và $w'$.

(2) Khởi tạo bước thời gian $t=1$.

(3) Khi $T \leqslant T_{\mathrm{max}}$:

- Đặt lại gradient: $\mathrm{d} \theta = 0$ và $\mathrm{d}w = 0$.

-  Đồng bộ tham số riêng của luồng với tham số toàn cục: $\theta' = \theta$ và $w'=w$.
-  Đặt $t_{\mathrm{start}} =t$ và lấy mẫu ngẫu nhiên một trạng thái ban đầu $s_t$.
-  Khi ($s_t!=$ trạng thái kết thúc) và $t−t_{\mathrm{start}} \leqslant t_{\mathrm{max}}$.
    - Chọn hành động thực hiện hiện tại theo chính sách của luồng hiện tại $a_t\sim\pi_{\theta'}(a_t|s_t)$, sau khi thực hiện hành động nhận phần thưởng $r_t$ rồi chuyển sang trạng thái tiếp theo $s_{t+1}$.
    - Cập nhật $t$ và $T$: $t=t+1$ và $T=T+1$.
-  Khởi tạo biến lưu giá trị ước lượng của phần thưởng tích lũy.
-  Với $i=t-1, \dots ,t_{\mathrm{start}}$:
    -  $r \gets \gamma r+r_i$; ở đây $r$ là ước lượng Monte Carlo của $G_i$.
    -  Tích lũy gradient theo tham số $\theta'$: $\mathrm{d} \theta \gets \mathrm{d}\theta + \nabla_{\theta'} \mathrm{log} \pi_{\theta'}(a_i|s_i)(r−V_{w'}(s_i))$.
    -  Tích lũy gradient theo tham số $w'$: $\mathrm{d}w \gets \mathrm{d}w+ \mathrm{\partial} (r-V_{w'}(s_i))^2 / \mathrm{\partial} w'$.
-  Dùng lần lượt $\mathrm{d}\theta$ và $\mathrm{d}w$ để cập nhật bất đồng bộ $\theta$ và $w$.

> Ghi chú của người dịch: bản gốc viết cận dưới của vòng lặp là $i=t_1$; theo thuật toán A3C gốc, vòng lặp chạy ngược từ $t-1$ về $t_{\mathrm{start}}$, nên bản dịch đã sửa thành $i=t-1$.

**9-4** Người phỏng vấn thân thiện: Trong thuật toán diễn viên-nhà phê bình, diễn viên và nhà phê bình khác nhau thế nào?

Diễn viên là mô-đun chính sách, đưa ra hành động; nhà phê bình là bộ phân biệt (discriminator), dùng để tính hàm giá trị.

**9-5** Người phỏng vấn thân thiện: Nhà phê bình trong khung thuật toán diễn viên-nhà phê bình đóng vai trò gì?

Nhà phê bình đo lường quyết định hiện tại tốt hay xấu. Kết hợp với mô-đun chính sách, khi nhà phê bình đánh giá việc chọn một hành động nào đó là có lợi, chính sách sẽ cập nhật tham số để tăng xác suất xuất hiện của hành động đó, ngược lại thì giảm xác suất xuất hiện của hành động đó.

**9-6** Người phỏng vấn thân thiện: Hãy tóm tắt hàm lợi thế của thuật toán diễn viên-nhà phê bình lợi thế bất đồng bộ.

Công thức tính hàm lợi thế là $A(s,a)=Q(s,a)-V(s)=r+\gamma V(s')-V(s)$, nó có thể biểu thị định lượng lợi thế của việc chọn hành động $a$. Tức là khi hành động $a$ thấp hơn giá trị trung bình của hàm giá trị, hàm lợi thế là giá trị âm; ngược lại là giá trị dương. Nó là một số vô hướng, cụ thể:

(1) Nếu $A(s,a)>0$, gradient bị đẩy theo hướng dương;

(2) Nếu $A(s,a)<0$, tức hành động của ta còn tệ hơn giá trị trung bình ở trạng thái đó, thì gradient bị đẩy theo hướng ngược lại.

Như vậy cần hai hàm giá trị, nên có thể dùng phương pháp sai phân thời gian để ước lượng sai số: $A(s,a)=r+\gamma V(s')-V(s)$.
