# Chương 9 Thuật toán diễn viên-nhà phê bình
Trong thuật toán REINFORCE, mỗi lần cần thu thập một quỹ đạo hoàn chỉnh theo một chính sách, và tính lợi tức trên quỹ đạo này. Cách lấy mẫu này có phương sai khá lớn, hiệu quả học cũng khá thấp. Ta có thể học hỏi ý tưởng của học sai phân thời gian, dùng phương pháp quy hoạch động để nâng cao hiệu quả lấy mẫu, tức là tổng lợi tức bắt đầu từ trạng thái $s$ có thể được ước lượng xấp xỉ bằng phần thưởng tức thời của hành động hiện tại $r(s,a,s')$ và hàm giá trị của trạng thái tiếp theo $s'$.

**Thuật toán diễn viên-nhà phê bình (actor-critic)** là một phương pháp học tăng cường kết hợp **gradient chính sách (policy gradient)** và **học sai phân thời gian (temporal-difference learning)**, trong đó diễn viên (actor) là hàm chính sách $\pi_{\theta}(a|s)$, tức là học một chính sách để có lợi tức cao nhất có thể. Nhà phê bình (critic) là hàm giá trị $V_{\pi}(s)$, ước lượng hàm giá trị của chính sách hiện tại, tức là đánh giá diễn viên tốt hay xấu. Nhờ hàm giá trị, thuật toán diễn viên-nhà phê bình có thể cập nhật tham số từng bước, không cần đợi đến khi tập kết thúc mới cập nhật. Trong các thuật toán diễn viên-nhà phê bình, thuật toán nổi tiếng nhất là thuật toán diễn viên-nhà phê bình lợi thế bất đồng bộ (A3C). Nếu bỏ phần bất đồng bộ, ta có **thuật toán diễn viên-nhà phê bình lợi thế (advantage actor-critic, A2C)**. Nếu thêm bất đồng bộ, nó trở thành thuật toán diễn viên-nhà phê bình lợi thế bất đồng bộ.

## 9.1 Ôn lại gradient chính sách
Ta ôn lại gradient chính sách, khi cập nhật tham số chính sách $\theta$, ta có thể dùng
$$
  \nabla \bar{R}_{\theta} \approx \frac{1}{N} \sum_{n=1}^{N} \sum_{t=1}^{T_{n}}\left(\sum_{t^{\prime}=t}^{T_{n}} \gamma^{t^{\prime}-t} r_{t^{\prime}}^{n}-b\right) \nabla \log p_{\theta}\left(a_{t}^{n} \mid s_{t}^{n}\right) \tag{9.1}
$$
để tính gradient. Biểu thức (9.1) cho thấy: trước tiên qua tương tác giữa tác tử và môi trường, ta có thể tính xác suất $p_{\theta}(a_t|s_t)$ thực hiện một hành động $a$ nào đó ở một trạng thái $s$ nào đó. Tiếp theo, ta tính phần thưởng tích lũy từ sau khi thực hiện hành động $a$ ở trạng thái $s$ cho đến khi trò chơi kết thúc. $\sum_{t^{\prime}=t}^{T_{n}} \gamma^{t^{\prime}-t} r_{t^{\prime}}^{n}$ nghĩa là ta cộng các phần thưởng từ thời điểm $t$ đến thời điểm $T$, và nhân phía trước một hệ số chiết khấu, thường đặt hệ số chiết khấu là 0.9 hoặc 0.99, đồng thời trừ đi một giá trị đường cơ sở (baseline) $b$, mục đích của việc trừ $b$ là mong số hạng trong ngoặc có cả dương lẫn âm. Nếu số hạng trong ngoặc dương, ta tăng xác suất thực hiện hành động này ở trạng thái này; nếu số hạng trong ngoặc âm, ta giảm xác suất thực hiện hành động này ở trạng thái này.

Ta dùng $G$ để biểu thị phần thưởng tích lũy, $G$ rất bất ổn định. Vì bản thân quá trình tương tác có tính ngẫu nhiên, nên phần thưởng tích lũy tính được khi thực hiện một hành động $a$ nào đó ở một trạng thái $s$ nào đó, mỗi lần kết quả đều khác nhau, do đó $G$ là một biến ngẫu nhiên. Với cùng trạng thái $s$ và cùng hành động $a$, $G$ có thể có một phân phối cố định. Nhưng vì ta dùng cách lấy mẫu, nên ta thực hiện một hành động $a$ nào đó ở một trạng thái $s$ nào đó cho đến khi trò chơi kết thúc, thống kê tổng cộng nhận được bao nhiêu phần thưởng, và xem đó là $G$.

Như hình 9.1, nếu ta xem $G$ là một biến ngẫu nhiên, thực chất là đang lấy mẫu $G$, dùng các kết quả lấy mẫu này để cập nhật tham số. Nhưng thực tế khi thực hiện một hành động $a$ nào đó ở một trạng thái $s$ nào đó, những gì xảy ra tiếp theo bản thân có tính ngẫu nhiên. Tuy có một phân phối cố định, nhưng phương sai của nó có thể rất lớn. Tác tử ở cùng một trạng thái thực hiện cùng một hành động, kết quả cuối cùng có thể rất khác nhau. Tất nhiên, giả sử trước mỗi lần cập nhật tham số, ta đều có thể lấy mẫu đủ nhiều lần, thì đương nhiên không có vấn đề trên. Nhưng mỗi lần làm gradient chính sách, trước mỗi lần cập nhật tham số đều phải lấy mẫu, số lần lấy mẫu không thể quá nhiều, ta chỉ có thể lấy mẫu rất ít. Nếu ta vừa hay lấy mẫu được kết quả xấu, ví dụ lấy mẫu được $G = 100$, lấy mẫu được $G = -10$, rõ ràng kết quả sẽ rất tệ.



 <div align=center>
<img width="550" src="https://ai-studio-static-online.cdn.bcebos.com/5706e9cbb7554d04a70614ea0e79372727abad72c9ae40dba1190b958fb8900e"/>
</div>
 <div align=center>Hình 9.1 Ôn lại gradient chính sách</div>

## 9.2 Ôn lại mạng Q sâu

Q: Ta có thể làm toàn bộ quá trình huấn luyện trở nên ổn định không, có thể ước lượng trực tiếp giá trị kỳ vọng của biến ngẫu nhiên $G$ không?

A: Ta dùng trực tiếp một mạng để ước lượng giá trị kỳ vọng của $G$ khi thực hiện hành động $a$ ở trạng thái $s$. Nếu cách này khả thi, thì trong quá trình huấn luyện tiếp theo ta dùng giá trị kỳ vọng thay cho giá trị lấy mẫu, như vậy sẽ làm việc huấn luyện ổn định hơn.

Q: Dùng giá trị kỳ vọng thay cho giá trị lấy mẫu như thế nào?

A: Ở đây cần đưa vào phương pháp dựa trên giá trị (value-based). Phương pháp dựa trên giá trị chính là mạng Q sâu. Mạng Q sâu có hai loại hàm, có hai loại nhà phê bình. Như hình 9.2, loại nhà phê bình thứ nhất là $V_{\pi}(s)$. Tức là giả sử chính sách của diễn viên là $\pi$, dùng $\pi$ tương tác với môi trường, khi tác tử nhìn thấy trạng thái $s$, giá trị kỳ vọng của phần thưởng tích lũy tiếp theo là bao nhiêu. Loại nhà phê bình thứ hai là $Q_{\pi}(s,a)$. $Q_{\pi}(s,a)$ nhận $s$ và $a$ làm đầu vào, nó biểu thị khi thực hiện hành động $a$ ở trạng thái $s$, tiếp theo dùng chính sách $\pi$ tương tác với môi trường, giá trị kỳ vọng của phần thưởng tích lũy là bao nhiêu. $V_{\pi}$ nhận đầu vào $s$, đưa ra một số vô hướng. $Q_{\pi}$ nhận đầu vào $s$, nó sẽ gán một giá trị Q cho mỗi $a$.


 <div align=center>
<img width="550" src="https://ai-studio-static-online.cdn.bcebos.com/393de13e995546ab9d00c0247eff6e78e9dcd58bb97d4430a8baed2d9081fecf"/>
</div>
 <div align=center>Hình 9.2 Mạng Q sâu</div>


## 9.3 Thuật toán diễn viên-nhà phê bình lợi thế
Như hình 9.3, giá trị kỳ vọng của biến ngẫu nhiên $G$ chính là giá trị Q, tức là
$$
  \mathbb{E}\left[G_{t}^{n}\right]=Q_{\pi_{\theta}} \left(s_{t}^{n}, a_{t}^{n}\right)
$$
Đây cũng là định nghĩa của hàm Q. Định nghĩa của hàm Q là: ở một trạng thái $s$ nào đó, thực hiện một hành động $a$ nào đó, giả sử chính sách là $\pi$, giá trị kỳ vọng của phần thưởng tích lũy có thể nhận được, tức giá trị kỳ vọng của $G$. Giá trị kỳ vọng của phần thưởng tích lũy chính là giá trị kỳ vọng của $G$. Vì vậy giả sử dùng $\mathbb{E}\left[G_{t}^{n}\right]$ để đại diện cho số hạng $\sum_{t^{\prime}=t}^{T_{n}} \gamma^{t^{\prime}-t} r_{t^{\prime}}^{n}$, đưa hàm Q vào đây là xong, ta có thể kết hợp hai phương pháp diễn viên và nhà phê bình.

Có nhiều cách khác nhau để biểu diễn đường cơ sở, một cách phổ biến là dùng hàm giá trị $V_{\pi_{\theta}}\left(s_{t}^{n}\right)$ để biểu diễn đường cơ sở. Định nghĩa của hàm giá trị là: giả sử chính sách là $\pi$, nó ở một trạng thái $s$ nào đó liên tục tương tác với môi trường cho đến khi trò chơi kết thúc, phần thưởng kỳ vọng là bao nhiêu. $V_{\pi_{\theta}}\left(s_{t}^{n}\right)$ không liên quan đến hành động, $Q_{\pi_{\theta}}\left(s_{t}^{n}, a_{t}^{n}\right)$ có liên quan đến hành động.
$V_{\pi_{\theta}}\left(s_{t}^{n}\right)$ là giá trị kỳ vọng của $Q_{\pi_{\theta}}\left(s_{t}^{n}, a_{t}^{n}\right)$, $Q_{\pi_{\theta}}\left(s_{t}^{n}, a_{t}^{n}\right)-V_{\pi_{\theta}}\left(s_{t}^{n}\right)$ sẽ có cả dương lẫn âm, nên số hạng $\sum_{t^{\prime}=t}^{T_{n}} \gamma^{t^{\prime}-t} r_{t^{\prime}}^{n}-b$ sẽ có cả dương lẫn âm. Vì vậy ta thay số hạng $\sum_{t^{\prime}=t}^{T_{n}} \gamma^{t^{\prime}-t} r_{t^{\prime}}^{n}-b$ trong gradient chính sách bằng hàm lợi thế (advantage function) $A^{\theta}\left(s^{n}_{t}, a^{n}_{t}\right)$, tức $Q_{\pi_{\theta}}\left(s_{t}^{n}, a_{t}^{n}\right)-V_{\pi_{\theta}}\left(s_{t}^{n}\right)$. Do đó thuật toán này được gọi là thuật toán diễn viên-nhà phê bình lợi thế.


 <div align=center>
<img width="550" src="https://ai-studio-static-online.cdn.bcebos.com/d02364e1abb64a3db51e2e6cbef2322f4497a4eda56d47a3911a0ba517461800"/>
</div>
 <div align=center>Hình 9.3 Thuật toán diễn viên-nhà phê bình lợi thế</div>


Nếu ta cài đặt như vậy, có một nhược điểm là ta cần ước lượng hai mạng — mạng Q và mạng V, rủi ro ước lượng không chính xác trở thành gấp đôi. Vậy sao ta không chỉ ước lượng một mạng? Thực tế, trong thuật toán diễn viên-nhà phê bình, ta có thể chỉ ước lượng mạng V, và dùng giá trị của $V$ để biểu diễn giá trị của $Q$, $Q_{\pi}\left(s_{t}^{n}, a_{t}^{n}\right)$ có thể viết thành giá trị kỳ vọng của $ r_{t}^{n}+V_{\pi}\left(s_{t+1}^{n}\right)$, tức là
$$
  Q_{\pi}\left(s_{t}^{n}, a_{t}^{n}\right)=\mathbb{E}\left[r_{t}^{n}+V_{\pi}\left(s_{t+1}^{n}\right)\right]
$$

Ở trạng thái $s$ thực hiện hành động $a$, ta sẽ nhận phần thưởng $r$, đi vào trạng thái $s_{t+1}$. Nhưng ta sẽ nhận phần thưởng $r$ như thế nào, đi vào trạng thái $s_{t+1}$ nào, bản thân việc này có tính ngẫu nhiên. Vì vậy phải lấy kỳ vọng của $r_{t}^{n}+V_{\pi}\left(s_{t+1}^{n}\right)$ thì mới bằng giá trị hàm Q. Nhưng bây giờ ta bỏ phép lấy kỳ vọng đi, tức là
$$
  Q_{\pi}\left(s_{t}^{n}, a_{t}^{n}\right)=r_{t}^{n}+V_{\pi}\left(s_{t+1}^{n}\right)
$$

Ta có thể thay giá trị hàm Q bằng $r_t^n + V_{\pi}\left(s_{t+1}^{n}\right)$, được
$$
  r_{t}^{n}+V_{\pi}\left(s_{t+1}^{n}\right)-V_{\pi}\left(s_{t}^{n}\right)
$$

Lợi ích của việc bỏ phép lấy kỳ vọng là ta không cần ước lượng $Q$ nữa, chỉ cần ước lượng $V$. Nhưng đồng thời ta sẽ đưa vào một tham số ngẫu nhiên $r$. $r$ có tính ngẫu nhiên, nó là một biến ngẫu nhiên, nhưng $r$ so với phần thưởng tích lũy $G$ là một giá trị nhỏ hơn, vì nó là phần thưởng nhận được ở một bước nào đó, còn $G$ là tổng tất cả phần thưởng sẽ nhận được trong tương lai, phương sai của $G$ khá lớn. $r$ tuy cũng có một ít phương sai, nhưng phương sai của nó nhỏ hơn của $G$. Vì vậy thay $G$ có phương sai lớn ban đầu bằng $r$ có phương sai nhỏ hơn cũng là hợp lý.

Q: Tại sao ta có thể bỏ trực tiếp phép lấy kỳ vọng?

A: Bài báo gốc của thuật toán A3C đã thử nhiều phương pháp khác nhau, cuối cùng phát hiện phương pháp này tốt nhất. Tất nhiên có người có thể thắc mắc, biết đâu ước lượng cả $Q$ và $V$ cũng có thể ước lượng rất tốt, nhưng khi làm thực nghiệm thực tế, kết quả cuối cùng là phương pháp này tốt nhất, nên về sau mọi người đều dùng phương pháp này.

Quy trình của thuật toán diễn viên-nhà phê bình lợi thế như hình 9.4, ta có một $\pi$, có một diễn viên ban đầu tương tác với môi trường, thu thập dữ liệu trước. Trong phương pháp gradient chính sách, sau khi thu thập dữ liệu thì cập nhật chính sách. Nhưng trong thuật toán diễn viên-nhà phê bình, ta không dùng trực tiếp các dữ liệu đó để cập nhật chính sách. Ta dùng các dữ liệu này để ước lượng hàm giá trị trước, có thể dùng phương pháp sai phân thời gian hoặc phương pháp Monte Carlo để ước lượng hàm giá trị. Tiếp theo, ta dựa trên hàm giá trị, dùng biểu thức (9.2) để cập nhật $\pi$.
$$
  \nabla \bar{R}_{\theta} \approx \frac{1}{N} \sum_{n=1}^{N} \sum_{t=1}^{T_{n}}\left(r_{t}^{n}+V_{\pi}\left(s_{t+1}^{n}\right)-V_{\pi}\left(s_{t}^{n}\right)\right) \nabla \log p_{\theta}\left(a_{t}^{n} \mid s_{t}^{n}\right) \tag{9.2}
$$
Có $\pi$ mới rồi, lại tương tác với môi trường, thu thập dữ liệu mới, ước lượng hàm giá trị. Rồi dùng hàm giá trị mới để cập nhật chính sách, cập nhật diễn viên. Toàn bộ thuật toán diễn viên-nhà phê bình lợi thế vận hành như vậy.


 <div align=center>
<img width="550" src="https://ai-studio-static-online.cdn.bcebos.com/a6096d7cce50414ebc574bccf88630900f7afcf0212e4f96bf675b817e7ec252"/>
</div>
 <div align=center>Hình 9.4 Quy trình thuật toán diễn viên-nhà phê bình lợi thế</div>


Khi cài đặt thuật toán diễn viên-nhà phê bình lợi thế, có hai mẹo chắc chắn sẽ dùng đến. Mẹo thứ nhất là, ta cần ước lượng hai mạng: mạng $V$ và mạng chính sách (tức diễn viên). Mạng nhà phê bình $V_\pi(s)$ nhận một trạng thái, đưa ra một số vô hướng. Chính sách của diễn viên $\pi(s)$ nhận một trạng thái, nếu hành động là rời rạc, đầu ra là một phân phối hành động. Nếu hành động là liên tục, đầu ra là một vectơ liên tục.

Hình 9.5 là ví dụ về hành động rời rạc, trường hợp hành động liên tục cũng tương tự. Đưa vào một trạng thái, mạng quyết định bây giờ cần thực hiện hành động nào. Đầu vào của mạng diễn viên và mạng nhà phê bình đều là $s$, nên vài tầng (layer) đầu của chúng có thể dùng chung.

 <div align=center>
<img width="550" src="https://ai-studio-static-online.cdn.bcebos.com/d39a829f7e844f03aceb4243c50cb5822811cd85180c4662a77b715fde2f620f"/>
</div>
 <div align=center>Hình 9.5 Ví dụ về hành động rời rạc</div>


Đặc biệt khi ta chơi game Atari, đầu vào đều là hình ảnh. Hình ảnh đầu vào rất phức tạp, thường ở giai đoạn đầu ta đều dùng một số mạng nơ-ron tích chập (convolutional neural network) để xử lý chúng, trừu tượng hóa hình ảnh thành thông tin cấp cao (high level). Bộ trích xuất đặc trưng trừu tượng hóa thông tin cấp điểm ảnh thành thông tin cấp cao có thể dùng chung cho diễn viên và nhà phê bình. Vì vậy thường ta cho diễn viên và nhà phê bình dùng chung vài tầng đầu, và dùng chung một bộ tham số, bộ tham số này phần lớn là tham số của mạng nơ-ron tích chập. Trước tiên biến điểm ảnh đầu vào thành thông tin cấp cao hơn, rồi để diễn viên quyết định cần thực hiện hành động gì, để nhà phê bình tức hàm giá trị tính phần thưởng kỳ vọng.

Mẹo thứ hai là ta cần cơ chế khám phá. Trong thuật toán diễn viên-nhà phê bình, một phương pháp khám phá phổ biến là đặt một ràng buộc lên phân phối do $\pi$ đưa ra. Ràng buộc này dùng để làm entropy của phân phối không quá nhỏ, tức là mong xác suất các hành động khác nhau được chọn đều hơn một chút. Như vậy khi kiểm thử, tác tử mới thử nhiều hành động khác nhau hơn, mới khám phá môi trường khá tốt, từ đó có được kết quả khá tốt.

## 9.4 Thuật toán diễn viên-nhà phê bình lợi thế bất đồng bộ
Học tăng cường có một vấn đề, đó là nó rất chậm, làm sao tăng tốc độ huấn luyện? Ví dụ, như hình 9.6, trong anime *Naruto*, có lần Naruto muốn đánh bại Akatsuki trong vòng một tuần, nên phải tăng tốc độ tu luyện, thầy của Naruto dạy cậu một cách: dùng Ảnh phân thân (Shadow Clone) để cùng tu luyện. Hai người cùng tu luyện, tốc độ tích lũy kinh nghiệm sẽ thành gấp đôi, vì vậy Naruto dùng 1000 Ảnh phân thân để tu luyện. Đây chính là sự thể hiện của thuật toán diễn viên-nhà phê bình lợi thế bất đồng bộ.


   <div align=center>
<img width="550" src="https://ai-studio-static-online.cdn.bcebos.com/496461ab4b19443197b24664ce9382aebc0f59a7f14442d4b4e841aaa4cf9531"/>
</div>
   <div align=center>Hình 9.6 Ví dụ Ảnh phân thân</div>


Thuật toán diễn viên-nhà phê bình lợi thế bất đồng bộ dùng đồng thời rất nhiều tiến trình (worker), mỗi tiến trình giống như một Ảnh phân thân, cuối cùng các Ảnh phân thân này sẽ gom tất cả kinh nghiệm lại với nhau. Nếu ta không có nhiều CPU, khó cài đặt thuật toán diễn viên-nhà phê bình lợi thế bất đồng bộ, nhưng có thể cài đặt thuật toán diễn viên-nhà phê bình lợi thế.

Quy trình vận hành của thuật toán diễn viên-nhà phê bình lợi thế bất đồng bộ như hình 9.7, ban đầu thuật toán có một mạng toàn cục (global network). Mạng toàn cục gồm mạng chính sách và mạng giá trị, hai mạng này được gắn (tie) với nhau, vài tầng đầu của chúng được gắn chung.
Giả sử tham số của mạng toàn cục là $\theta_1$, ta dùng nhiều tiến trình, mỗi tiến trình chạy trên một CPU. Ví dụ ta có 8 tiến trình, thì cần ít nhất 8 CPU. Mỗi tiến trình trước khi làm việc đều sao chép tham số của mạng toàn cục về. Tiếp theo diễn viên tương tác với môi trường, khi mỗi diễn viên tương tác với môi trường, đều phải thu thập được dữ liệu khá đa dạng. Ví dụ, nếu là đi mê cung, có thể vị trí xuất phát của mỗi diễn viên đều khác nhau, như vậy chúng mới thu thập được dữ liệu khá đa dạng. Sau khi mỗi diễn viên tương tác với môi trường xong, ta sẽ tính gradient. Tính được gradient rồi, phải dùng gradient để cập nhật tham số. Ta tính gradient, dùng gradient để cập nhật tham số của mạng toàn cục. Tức là sau khi tiến trình này tính được gradient, nó gửi gradient về trung tâm điều khiển, trung tâm điều khiển sẽ dùng gradient này để cập nhật tham số ban đầu.

Chú ý, A3C dùng phương pháp khám phá song song, tất cả các diễn viên đều chạy song song, mỗi diễn viên tự làm phần của mình, không quan tâm đến nhau. Vì vậy mỗi diễn viên đều lấy một bộ tham số, làm xong thì gửi về. Khi tiến trình thứ nhất làm xong muốn gửi về, tham số ban đầu nó lấy là $\theta_1$, đến lúc nó muốn gửi gradient về, có thể tham số ban đầu đã bị người khác ghi đè, thành $\theta_2$ rồi. Nhưng không sao, nó vẫn sẽ áp gradient này lên như thường.


<div align=center>
<img width="550" src="https://ai-studio-static-online.cdn.bcebos.com/c36501bcb3ad49c1be3c0486665f6d096e67c00b6d4142a9a00231ae8f299c56"/>
</div>
<div align=center>Hình 9.7 Quy trình vận hành của thuật toán diễn viên-nhà phê bình lợi thế bất đồng bộ</div>


## 9.5 Gradient chính sách đạo hàm theo đường đi

Tiếp theo ta tìm hiểu phương pháp **gradient chính sách đạo hàm theo đường đi (pathwise derivative policy gradient)**. Phương pháp này có thể xem là một cách đặc biệt để mạng Q sâu giải hành động liên tục, cũng có thể xem là một phương pháp diễn viên-nhà phê bình đặc biệt. Lấy anime *Hikaru no Go (Kỳ thủ cờ vây)* làm ví dụ, Hikaru là một diễn viên, Sai là một nhà phê bình. Sau khi Hikaru đặt một quân cờ, nếu Sai là nhà phê bình trong thuật toán diễn viên-nhà phê bình thông thường, ông ấy sẽ nói với Hikaru rằng lúc này không nên đi nước phi ngựa nhỏ (keima). Sai sẽ cho ta biết, nước đi ta vừa thực hiện tính ra giá trị rốt cuộc là tốt hay không tốt, nhưng chỉ đến đó là hết, ông ấy chỉ cho ta biết tốt hay không tốt. Vì nhà phê bình trong thuật toán diễn viên-nhà phê bình thông thường nhận đầu vào là trạng thái hoặc cặp trạng thái-hành động, cho diễn viên một giá trị, nên với diễn viên, nó chỉ biết hành động mình làm rốt cuộc là tốt hay không tốt.

Nhưng trong gradient chính sách đạo hàm theo đường đi, nhà phê bình sẽ trực tiếp cho diễn viên biết thực hiện hành động gì mới là tốt. Vì vậy Sai không chỉ nói với Hikaru rằng lúc này đừng đi nước phi ngựa nhỏ, mà còn nói với Hikaru rằng lúc này nên đi nước phi ngựa lớn (ogeima), đây chính là việc nhà phê bình trong gradient chính sách đạo hàm theo đường đi làm. Nhà phê bình sẽ trực tiếp cho diễn viên biết làm hành động gì mới có thể nhận được giá trị lớn hơn.

Xét từ quan điểm của mạng Q sâu, một vấn đề của mạng Q sâu là khi dùng mạng Q sâu, xét vectơ liên tục sẽ khá phiền phức, không có cách giải tổng quát (general solution), vậy ta nên giải bài toán tối ưu này như thế nào? Ta dùng một diễn viên để giải bài toán tối ưu này. Vốn trong mạng Q sâu, nếu là hành động liên tục, ta phải giải bài toán tối ưu này. Nhưng bây giờ bài toán tối ưu này do diễn viên giải, giả sử diễn viên chính là một bộ giải (solver), công việc của bộ giải này là với trạng thái $s$ cho trước, giải ra hành động nào có thể cho giá trị Q lớn nhất, đây là nhìn gradient chính sách đạo hàm theo đường đi từ một quan điểm khác. Trong mạng đối sinh (GAN) cũng có cách nói tương tự. Khi ta học một bộ phân biệt (discriminator) và dùng nó để đánh giá thì rất khó khăn, vì bài toán arg max ta cần giải rất khó, nên dùng bộ sinh (generator) để sinh. Vì vậy khái niệm là như nhau, Q chính là bộ phân biệt đó. Dựa vào bộ phân biệt này để quyết định hành động rất khó, làm sao? Học thêm một mạng khác để giải bài toán tối ưu này, mạng này chính là diễn viên. Vì vậy hai quan điểm khác nhau là cùng một việc. Nhìn từ hai quan điểm khác nhau, một quan điểm là: ta có thể cải tiến mạng Q sâu ban đầu, học một diễn viên để quyết định hành động nhằm giải quyết vấn đề arg max khó giải. Quan điểm còn lại là: vấn đề của thuật toán diễn viên-nhà phê bình ban đầu là nhà phê bình không cho diễn viên đủ thông tin, nhà phê bình chỉ cho diễn viên biết tốt hay không tốt, không cho diễn viên biết thế nào là tốt, bây giờ có phương pháp mới có thể trực tiếp cho diễn viên biết thế nào là tốt. Thuật toán gradient chính sách đạo hàm theo đường đi như hình 9.8, giả sử ta đã học được một hàm Q, đầu vào của hàm Q là $s$ và $a$, đầu ra là $Q_{\pi}(s,a)$. Tiếp theo, ta cần học một diễn viên, công việc của diễn viên này là giải bài toán arg max, tức là đưa vào một trạng thái $s$, mong có thể đưa ra một hành động $a$. Sau khi $a$ được đưa vào hàm Q, nó có thể làm $Q_{\pi}(s,a)$ lớn nhất có thể, tức là
$$
  \pi^{\prime}(s)=\underset{a}{\arg \max} Q_{\pi}(s, a)
$$

Thực tế khi huấn luyện, ta nối Q với diễn viên thành một mạng lớn hơn. Q là một mạng, nhận đầu vào $s$ và $a$, đưa ra một giá trị. Diễn viên khi huấn luyện, việc nó cần làm là nhận đầu vào $s$, đưa ra $a$. Đưa $a$ vào Q, mong giá trị đầu ra càng lớn càng tốt. Ta cố định tham số của Q, chỉ điều chỉnh tham số của diễn viên, dùng phương pháp gradient ascent để tối đa hóa đầu ra của Q, đây chính là một mạng đối sinh, tức mạng đối sinh có điều kiện (conditional GAN). Q chính là bộ phân biệt, nhưng trong học tăng cường thì là nhà phê bình, diễn viên trong mạng đối sinh chính là bộ sinh.



 <div align=center>
<img width="550" src="https://ai-studio-static-online.cdn.bcebos.com/a782c1f5f1204beaa8f1083d25e8fc097d79a15a179d486994827d9b994fa546"/>
</div>
 <div align=center>Hình 9.8 Gradient chính sách đạo hàm theo đường đi</div>



Hãy xem thuật toán gradient chính sách đạo hàm theo đường đi. Như hình 9.9, lúc đầu có một chính sách $\pi$, nó tương tác với môi trường và ước lượng giá trị Q. Ước lượng xong giá trị Q, ta cố định giá trị Q, chỉ học một diễn viên. Giả sử giá trị Q này được ước lượng rất chính xác, nó biết ở một trạng thái nào đó thực hiện hành động gì sẽ được giá trị Q rất lớn. Tiếp theo học diễn viên này, diễn viên khi cho $s$, thực hiện $a$, có thể làm giá trị hàm Q tính ra cuối cùng càng lớn càng tốt. Ta dùng tiêu chí (criteria) để cập nhật chính sách $\pi$, dùng $\pi$ mới tương tác với môi trường, rồi ước lượng giá trị Q, được $\pi$ mới để tối đa hóa đầu ra giá trị Q. Các mẹo trong mạng Q sâu ở đây cũng gần như đều dùng được, ví dụ các mẹo như phát lại kinh nghiệm, khám phá.

 <div align=center>
<img width="550" src="https://ai-studio-static-online.cdn.bcebos.com/529577a994a6499698a0e51c2ee470836b5d4d2ffccf4e40b4d760babe331944"/>
</div>
 <div align=center>Hình 9.9 Thuật toán gradient chính sách đạo hàm theo đường đi</div>


Hình 9.10 là thuật toán mạng Q sâu ban đầu. Ta có một hàm Q $Q$ và một hàm Q mục tiêu khác $\hat{Q}$. Mỗi lần huấn luyện, ở mỗi thời điểm của mỗi tập, ta sẽ nhìn thấy một trạng thái $s_t$, sẽ thực hiện một hành động $a_{t}$ nào đó. Còn thực hiện hành động nào là do hàm Q quyết định. Nếu là hành động rời rạc, ta xem hành động $a$ nào làm giá trị Q lớn nhất thì thực hiện hành động đó. Tất nhiên, ta cần thêm một ít khám phá, như vậy hiệu quả mới tốt. Ta sẽ nhận phần thưởng $r_t$, đi vào trạng thái mới $s_{t+1}$, rồi đặt $(s_t$,$a_{t}$,$r_t$,$s_{t+1})$ vào bộ đệm phát lại. Tiếp theo, ta lấy mẫu một lô dữ liệu từ bộ đệm phát lại, trong lô dữ liệu này, có thể có một mẫu dữ liệu là $(s_i, a_i, r_i, s_{i+1})$. Tiếp theo ta tính một mục tiêu $y$, $y=r_{i}+\max _{a} \hat{Q}\left(s_{i+1}, a\right)$. Học Q như thế nào? Ta mong $Q(s_i,a_i)$ và $y$ càng gần càng tốt, đây là một bài toán hồi quy, cuối cùng cứ mỗi $C$ bước, phải dùng $Q$ thay thế $\hat{Q}$.

 <div align=center>
<img width="550" src="https://ai-studio-static-online.cdn.bcebos.com/37f81d6827aa4996884c822f236643255da2f11fa724491bb1cd272a80e7c318"/>
</div>
 <div align=center>Hình 9.10 Thuật toán mạng Q sâu</div>

Bản dịch thuật toán ở hình 9.10:

$$
\begin{array}{l}
\hline
\bullet\ \text{Khởi tạo hàm Q } Q \text{, hàm Q mục tiêu } \hat{Q} = Q \\
\bullet\ \text{Với mỗi tập:} \\
\quad \bullet\ \text{Với mỗi bước thời gian } t: \\
\qquad \bullet\ \text{Với trạng thái } s_t \text{ đã cho, thực hiện hành động } a_t \text{ dựa trên } Q \text{ (}\varepsilon\text{-tham lam)} \\
\qquad \bullet\ \text{Nhận phần thưởng } r_t \text{ và trạng thái mới } s_{t+1} \\
\qquad \bullet\ \text{Lưu } (s_t, a_t, r_t, s_{t+1}) \text{ vào bộ đệm phát lại} \\
\qquad \bullet\ \text{Lấy mẫu } (s_i, a_i, r_i, s_{i+1}) \text{ từ bộ đệm (thường theo lô)} \\
\qquad \bullet\ \text{Giá trị mục tiêu là } y = r_i + \max_{a} \hat{Q}(s_{i+1}, a) \\
\qquad \bullet\ \text{Cập nhật tham số của } Q \text{ sao cho } Q(s_i, a_i) \text{ càng gần } y \text{ càng tốt (hồi quy)} \\
\qquad \bullet\ \text{Cứ sau } C \text{ bước, đặt lại } \hat{Q} = Q
\\ \hline
\end{array}
$$


Tiếp theo ta đổi mạng Q sâu thành gradient chính sách đạo hàm theo đường đi, cần làm 4 thay đổi, như hình 9.11.

(1) Thay đổi thứ nhất là, ta cần thay $Q$ bằng $\theta$, vốn dùng $Q$ để quyết định thực hiện một hành động $a_{t}$ ở trạng thái $s_t$, nay dùng trực tiếp $\theta$ để thực hiện hành động.
Ta trực tiếp học một diễn viên. Đầu vào $s_t$ của diễn viên này sẽ cho ta biết nên thực hiện $a_{t}$ nào. Vì vậy vốn dĩ đưa vào $s_t$, thực hiện $a_t$ nào là do Q quyết định, còn trong gradient chính sách đạo hàm theo đường đi, ta dùng trực tiếp $\theta$ để quyết định.

(2) Thay đổi thứ hai là, vốn dĩ ta cần tính giá trị Q nhận được khi ở $s_{i+1}$ thực hiện một hành động $a$ nào đó theo chính sách, ta sẽ thực hiện hành động $a$ làm $\hat{Q}$ lớn nhất. Bây giờ vì ta đưa trực tiếp $s_{i+1}$ vào $\theta$, sẽ biết khi cho $s_{i+1}$, hành động nào sẽ cho ta giá trị Q lớn nhất, thì thực hiện hành động đó. Trong hàm Q có hai mạng Q: mạng Q thực và mạng Q mục tiêu. Thực tế khi cài đặt thuật toán gradient chính sách đạo hàm theo đường đi, cũng có hai diễn viên: diễn viên thực sự cần học $\theta$ và diễn viên mục tiêu $\hat{\theta}$. Nguyên lý này giống với lý do tại sao cần có mạng Q mục tiêu, khi tính giá trị mục tiêu, ta không muốn nó liên tục thay đổi, nên ta có một diễn viên mục tiêu và một hàm Q mục tiêu, tham số của chúng bình thường được cố định, như vậy có thể làm giá trị mục tiêu không liên tục thay đổi.


Tóm lại, thay đổi thứ hai là ta dùng chính sách thay cho chỗ vốn phải giải arg max.

(3) Thay đổi thứ ba là, trước đây chỉ cần học hàm Q, bây giờ ta học thêm một $\theta$, mục đích của việc học $\theta$ là tối đa hóa hàm Q, mong diễn viên có được có thể làm đầu ra của hàm Q lớn nhất có thể, điều này tương tự khái niệm học bộ sinh trong mạng đối sinh.

(4) Thay đổi thứ tư là, ta không chỉ thay thế mạng Q mục tiêu, mà còn phải thay thế chính sách mục tiêu.



 <div align=center>
<img width="550" src="https://ai-studio-static-online.cdn.bcebos.com/f3bbec118f5f4e0bb2774cff3111a6c44aae3e670f51406296e6884d92913bcf"/>
</div>
 <div align=center>Hình 9.11 Từ mạng Q sâu đến gradient chính sách đạo hàm theo đường đi</div>

Bản dịch thuật toán ở hình 9.11:

$$
\begin{array}{rl}
\hline
& \bullet\ \text{Khởi tạo hàm Q } Q \text{, hàm Q mục tiêu } \hat{Q} = Q \text{, diễn viên } \pi \text{, diễn viên mục tiêu } \hat{\pi} = \pi \\
& \bullet\ \text{Với mỗi tập:} \\
& \quad \circ\ \text{Với mỗi bước thời gian } t: \\
\textbf{(1)} & \qquad \blacksquare\ \text{Nhận trạng thái } s_t \text{, thực hiện hành động } a_t \text{ theo } \cancel{Q}\ \pi \text{ (có khám phá)} \\
& \qquad \blacksquare\ \text{Nhận phần thưởng } r_t \text{, đến trạng thái mới } s_{t+1} \\
& \qquad \blacksquare\ \text{Lưu } (s_t, a_t, r_t, s_{t+1}) \text{ vào bộ đệm} \\
& \qquad \blacksquare\ \text{Lấy mẫu } (s_i, a_i, r_i, s_{i+1}) \text{ từ bộ đệm (thường là một lô)} \\
\textbf{(2)} & \qquad \blacksquare\ \text{Mục tiêu } y = r_i + \cancel{\max_a \hat{Q}(s_{i+1}, a)}\ \hat{Q}\big(s_{i+1}, \hat{\pi}(s_{i+1})\big) \\
& \qquad \blacksquare\ \text{Cập nhật tham số của } Q \text{ sao cho } Q(s_i, a_i) \text{ gần } y \text{ (hồi quy)} \\
\textbf{(3)} & \qquad \blacksquare\ \text{Cập nhật tham số của } \pi \text{ để } Q\big(s_i, \pi(s_i)\big) \text{ lớn nhất} \\
& \qquad \blacksquare\ \text{Cứ sau } C \text{ bước, đặt lại } \hat{Q} = Q \\
\textbf{(4)} & \qquad \blacksquare\ \text{Cứ sau } C \text{ bước, đặt lại } \hat{\pi} = \pi
\\ \hline
\end{array}
$$

Các số (1)–(4) đánh dấu 4 thay đổi so với mạng Q sâu đã nêu ở trên; phần bị gạch là chỗ của mạng Q sâu bị thay thế. Hình gốc ghi mẫu lấy ra là $(s_t, a_t, r_t, s_{t+1})$, bản dịch viết thống nhất là $(s_i, a_i, r_i, s_{i+1})$ cho khớp với các dòng sau.


## 9.6 Liên hệ với mạng đối sinh

Như bảng 9.1, GAN và phương pháp diễn viên-nhà phê bình rất giống nhau. Nếu bạn quan tâm, có thể tham khảo một bài báo: "Connecting Generative Adversarial Network and Actor-Critic Methods".

Mạng đối sinh và diễn viên-nhà phê bình đều khá khó huấn luyện, vì vậy trong các tài liệu có đủ loại phương pháp, cho ta biết làm thế nào để huấn luyện mạng đối sinh. Sau khi biết mạng đối sinh và diễn viên-nhà phê bình rất giống nhau, ta có thể biết cách huấn luyện diễn viên-nhà phê bình. Nhưng vì người làm mạng đối sinh và người làm diễn viên-nhà phê bình là hai nhóm người khác nhau, nên bài báo này liệt kê trên mạng đối sinh có những kỹ thuật nào đã có người làm, trên diễn viên-nhà phê bình có những kỹ thuật nào đã có người làm. Có thể các kỹ thuật huấn luyện mạng đối sinh, ta có thể thử áp dụng cho diễn viên-nhà phê bình, các kỹ thuật đã dùng trên diễn viên-nhà phê bình cũng có thể thử áp dụng cho mạng đối sinh.

<div align=center>Bảng 9.1 Liên hệ với mạng đối sinh</div>

 <div align=center>
<img width="550" src="https://ai-studio-static-online.cdn.bcebos.com/818c1c2e603341f881dd57fb59e109c81702722156be4e6481b276b894c51290"/>
</div>

> Ghi chú bảng 9.1 (ảnh gốc bằng tiếng Trung):
>
> | Phương pháp | Mạng đối sinh (GAN) | Diễn viên-nhà phê bình |
> |---|---|---|
> | Đóng băng khi học (freezing learning) | Có | Có |
> | Làm mượt nhãn (label smoothing) | Có | Không |
> | Trung bình lịch sử (historical averaging) | Có | Không |
> | Phân biệt theo lô nhỏ (minibatch discrimination) | Có | Không |
> | Chuẩn hóa theo lô (batch normalization) | Có | Có |
> | Mạng mục tiêu (target network) | Không áp dụng | Có |
> | Phát lại kinh nghiệm (experience replay) | Không | Có |
> | Chính quy hóa entropy (entropy regularization) | Không | Có |
> | Tính tương thích (compatibility) | Không | Có |
