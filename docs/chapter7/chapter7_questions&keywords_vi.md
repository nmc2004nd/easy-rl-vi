# Chương 7 DQN (Các kỹ thuật nâng cao)

## Từ khóa

- **Mạng Q sâu kép (double DQN)**: trong mạng Q sâu kép có hai mạng Q, mạng Q thứ nhất quyết định hành động nào có giá trị Q lớn nhất, từ đó quyết định hành động tương ứng. Mặt khác, giá trị Q được tính bằng $Q'$, như vậy có thể tránh vấn đề ước lượng quá cao (overestimation). Cụ thể, giả sử ta có hai hàm Q và hàm Q thứ nhất ước lượng quá cao giá trị của hành động $a$ mà nó đang thực hiện, điều này không sao, chỉ cần hàm Q thứ hai $Q'$ không ước lượng quá cao giá trị của hành động $a$, thì giá trị tính được vẫn là giá trị bình thường.

- **Mạng Q sâu đối đầu (dueling DQN)**: chia quá trình tính toán của mạng Q sâu ban đầu thành hai bước. Bước thứ nhất tính một số vô hướng $\mathrm{V(s)}$ liên quan đến đầu vào; bước thứ hai tính một vectơ $\mathrm{A(s,a)}$ ứng với mỗi hành động. Mạng cuối cùng cộng kết quả của hai bước lại, được giá trị Q cuối cùng mà ta cần. Biểu diễn bằng một công thức là $\mathrm{Q(s,a)=V(s)+A(s,a)}$. Ngoài ra, mạng Q sâu đối đầu dùng hàm giá trị trạng thái và hàm giá trị hành động để đánh giá giá trị Q.

- **Phát lại kinh nghiệm ưu tiên (prioritized experience replay, PER)**: phương pháp này được đề xuất để khắc phục nhược điểm của phương pháp phát lại kinh nghiệm mà ta đưa ra ở chương 6. Khi dùng phát lại kinh nghiệm, ta lấy dữ liệu mẫu từ bộ đệm phát lại (replay buffer) một cách đồng đều, ở đây không xét đến độ lớn trọng số giữa các dữ liệu. Nhưng ta nên tăng trọng số tương ứng với các dữ liệu có hiệu quả huấn luyện không tốt, tức là chúng nên có xác suất được lấy mẫu lớn hơn. Tóm lại, phát lại kinh nghiệm ưu tiên không chỉ thay đổi phân phối của dữ liệu được lấy mẫu, mà còn thay đổi quá trình huấn luyện.

- **Mạng nhiễu (noisy net)**: khi bắt đầu mỗi tập, tức là khi tác tử sắp tương tác với môi trường, ta thêm một nhiễu Gauss (Gaussian noise) vào mỗi tham số của hàm Q ban đầu, biến hàm Q ban đầu thành $\tilde{Q}$, tức hàm Q nhiễu. Tương tự, ta thêm một nhiễu Gauss vào các tham số như trọng số của mỗi mạng, sẽ có một mạng mới $\tilde{Q}$. Ta sẽ dùng mạng mới này tương tác với môi trường cho đến khi kết thúc.

- **Hàm Q phân phối (distributional Q-function)**: mô hình hóa phân phối cho mạng Q sâu, thực hiện thêm phép toán phân phối trên đầu ra của mỗi loại hành động của mạng cuối cùng.

- **Rainbow (cầu vồng)**: phương pháp kết hợp 7 kỹ thuật/thuật toán, 7 kỹ thuật lần lượt là — mạng Q sâu, mạng Q sâu kép, mạng Q sâu kép có phát lại kinh nghiệm ưu tiên, mạng Q sâu đối đầu, thuật toán diễn viên-nhà phê bình lợi thế bất đồng bộ (A3C), hàm Q phân phối, mạng nhiễu, từ đó khảo sát mức đóng góp của mỗi kỹ thuật hoặc việc tương tác với môi trường có phải là phản hồi dương hay không.


## Bài tập

**7-1** Tại sao hiệu quả của mạng Q sâu truyền thống không tốt? Có thể tham khảo công thức $Q(s_t ,a_t)=r_t+\max_{a}Q(s_{t+1},a)$ để mô tả.

Vì khi ứng dụng thực tế, cần làm cho $Q(s_t ,a_t)$ và $r_t+\max_{a}Q(s_{t+1},a)$ bằng nhau nhiều nhất có thể, tức là càng gần mục tiêu càng tốt. Có thể thấy, giá trị mục tiêu rất dễ vô tình bị đặt quá cao, vì khi tính giá trị mục tiêu, việc ta thực sự làm là xem hành động $a$ nào có thể cho giá trị Q lớn nhất, rồi cộng nó vào để làm mục tiêu.

Ví dụ, hiện có 4 hành động, vốn dĩ giá trị Q của chúng đều gần như nhau, phần thưởng chúng nhận được cũng gần như nhau, nhưng khi ước lượng có sai số. Nếu hành động thứ 1 bị ước lượng quá cao, mục tiêu sẽ thực hiện hành động đó, rồi chọn giá trị Q của hành động bị ước lượng quá cao này cộng $r_t$ làm giá trị mục tiêu. Nếu hành động thứ 4 bị ước lượng quá cao, mục tiêu sẽ chọn giá trị Q của hành động thứ 4 cộng $r_t$ làm giá trị mục tiêu. Vì vậy mục tiêu luôn chọn hành động có giá trị Q bị ước lượng quá cao, ta cũng luôn chọn giá trị Q của hành động có phần thưởng bị ước lượng quá cao làm kết quả giá trị Q lớn nhất rồi cộng $r_t$ làm giá trị mục tiêu mới, do đó giá trị mục tiêu luôn quá lớn.

**7-2** Trong mạng Q sâu truyền thống, ta nên giải quyết vấn đề giá trị mục tiêu quá lớn như thế nào?

Ta có thể dùng mạng Q sâu kép để giải quyết vấn đề này. Trước hết, trong mạng Q sâu kép, hàm Q dùng để chọn hành động khác với hàm Q dùng để tính giá trị. Trong mạng Q sâu, cần vét cạn tất cả các hành động $a$, đưa từng hành động $a$ vào hàm Q và tính xem hành động $a$ nào cho giá trị Q lớn nhất, rồi lấy giá trị Q đó cộng $r_t$. Nhưng với hai mạng Q của mạng Q sâu kép, mạng Q thứ nhất quyết định hành động nào có giá trị Q lớn nhất, từ đó quyết định hành động được chọn. Giá trị Q của ta được tính bằng $Q'$, như vậy có lợi gì? Tại sao như vậy lại tránh được vấn đề ước lượng quá cao? Giả sử ta có hai hàm Q, nếu hàm Q thứ nhất ước lượng quá cao giá trị của hành động $a$ nó vừa chọn, không sao, chỉ cần hàm Q thứ hai $Q'$ không ước lượng quá cao giá trị của hành động $a$ này, giá trị tính được vẫn là giá trị bình thường. Giả sử ngược lại là $Q'$ ước lượng quá cao giá trị của một hành động nào đó, thì cũng không sinh ra vấn đề ước lượng quá cao.

**7-3** Chức năng của hai mạng $Q$ và $Q'$ trong mạng Q sâu kép là gì?

Trong mạng Q sâu kép có hai mạng Q, một là mạng Q mục tiêu, một là mạng Q thực sự cần được cập nhật. Cách cài đặt cụ thể là dùng mạng Q cần cập nhật để chọn hành động, rồi dùng mạng Q mục tiêu để tính giá trị. Mạng Q sâu kép là thay đổi ít nhất so với mạng Q sâu, nó gần như không tăng thêm khối lượng tính toán nào, thậm chí không cần mạng mới. Điều duy nhất cần thay đổi là khi tìm hành động tốt nhất $a$, vốn dùng $Q'$ để tính, tức là dùng mạng Q mục tiêu để tính, nay đổi thành dùng mạng Q cần cập nhật để tính.

**7-4** Hiểu lợi ích từ thay đổi mô hình của mạng Q sâu đối đầu như thế nào?

Với $\mathrm{Q}(s,a)$, trạng thái tương ứng của nó vì ở dạng bảng nên là rời rạc, nhưng trạng thái trong thực tế không rời rạc. Với công thức tính $\mathrm{Q}(s,a)$ — $\mathrm{Q}(s,a)=\mathrm{V}(s)+\mathrm{A}(s,a)$. Trong đó $\mathrm{V}(s)$ có giá trị cho mỗi trạng thái khác nhau, $\mathrm{A}(s,a)$ có giá trị ứng với các hành động khác nhau cho mỗi trạng thái khác nhau. Vì vậy về bản chất, kết quả của ma trận cuối cùng $\mathrm{Q}(s,a)$ có được bằng cách cộng mỗi $\mathrm{V}(s)$ vào ma trận $\mathrm{A}(s,a)$. Xét từ góc độ mô hình, thứ mạng của ta thay đổi trực tiếp không phải là $\mathrm{Q}(s,a)$, mà là $\mathrm{V}$, $\mathrm{A}$. Nhưng đôi khi khi cập nhật, ta không nhất thiết cập nhật cả $\mathrm{V}(s)$ và $\mathrm{Q}(s,a)$. Sau khi chia trạng thái và cặp hành động thành hai phần, ta không cần lấy mẫu toàn bộ các cặp trạng thái-hành động một lượt, ta có thể dùng phương pháp ước lượng giá trị Q hiệu quả hơn để tính ra $\mathrm{Q}(s,a)$ cuối cùng.

**7-5** Ưu và nhược điểm của phương pháp cân bằng giữa Monte Carlo và sai phân thời gian là gì?

Ưu điểm: phương pháp sai phân thời gian chỉ lấy mẫu một bước, nên dữ liệu thu được ở bước đó là giá trị thật, phần tiếp theo đều do giá trị Q ước lượng. Dùng phương pháp cân bằng giữa Monte Carlo và sai phân thời gian thì lấy mẫu nhiều bước hơn, ví dụ lấy mẫu $N$ bước rồi mới ước lượng giá trị, nên ảnh hưởng do phần ước lượng gây ra sẽ nhỏ hơn.

Nhược điểm: vì phần thưởng của tác tử khá nhiều, nên khi ta cộng phần thưởng của $N$ bước lại, phương sai tương ứng sẽ khá lớn. Để giảm bớt vấn đề phương sai lớn, ta có thể điều chỉnh giá trị $N$, để cân bằng giữa phương sai và giá trị Q không chính xác. Tham số $N$ giới thiệu ở đây là siêu tham số, cần tinh chỉnh tham số $N$, ví dụ lấy mẫu thêm 3 bước hay lấy mẫu thêm 5 bước.


## Câu hỏi phỏng vấn

**7-1** Người phỏng vấn thân thiện: Mạng Q sâu có những biến thể nào? Biến thể nào đưa vào phần thưởng trạng thái?

Mạng Q sâu có 3 biến thể kinh điển: mạng Q sâu kép, mạng Q sâu đối đầu, mạng Q sâu kép ưu tiên.

(1) Mạng Q sâu kép: tách việc chọn hành động và ước lượng giá trị, tránh giá trị Q bị ước lượng quá cao.

(2) Mạng Q sâu đối đầu: phân tách giá trị Q thành giá trị trạng thái và hàm lợi thế (advantage function), thu được nhiều thông tin hữu ích hơn.

(3) Mạng Q sâu kép ưu tiên: lấy mẫu các kinh nghiệm trong bể kinh nghiệm (experience pool) theo độ ưu tiên.

**7-2** Người phỏng vấn thân thiện: Hãy tóm tắt nguyên lý của mạng Q sâu kép.

Vì mạng Q sâu luôn chọn hàm giá trị hành động tốt nhất hiện tại để cập nhật hàm giá trị hành động hiện tại, nên tồn tại vấn đề ước lượng quá cao (giá trị hàm giá trị ước lượng lớn hơn giá trị hàm giá trị thực). Để tách rời (decouple) hai quá trình này, mạng Q sâu kép dùng hai mạng giá trị, một mạng dùng để thực hiện việc chọn hành động, rồi dùng giá trị hành động tương ứng với hàm giá trị của mạng còn lại để cập nhật mạng hiện tại.

**7-3** Người phỏng vấn thân thiện: Mô hình mạng Q sâu đối đầu có ưu thế gì?

Với $\boldsymbol{Q}(s,a)$, trạng thái tương ứng của nó vì ở dạng bảng nên là rời rạc, nhưng trạng thái thực tế đa số không rời rạc. Với giá trị Q $\boldsymbol{Q}(s,a)=V(s)+\boldsymbol{A}(s,a)$. Trong đó $V(s)$ có giá trị cho mỗi trạng thái khác nhau, $\boldsymbol{A}(s,a)$ có giá trị ứng với các hành động khác nhau cho mỗi trạng thái khác nhau. Vì vậy về bản chất, ma trận cuối cùng $\boldsymbol{Q}(s,a)$ có được bằng cách cộng mỗi $V(s)$ vào ma trận $\boldsymbol{A}(s,a)$. Nhưng đôi khi khi cập nhật, ta không nhất thiết cập nhật cả $V(s)$ và $\boldsymbol{Q}(s,a)$. Sau khi chia thành hai phần, ta không cần lấy mẫu toàn bộ các cặp trạng thái-hành động một lượt, ta có thể dùng phương pháp ước lượng giá trị Q hiệu quả hơn để tính ra $\boldsymbol{Q}(s,a)$ cuối cùng.
