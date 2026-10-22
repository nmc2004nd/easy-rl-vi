# JoyRL đọc bài báo《Prioritized Experience Replay》+ code Python
Tác giả: Tom Schaul, John Quan, Ioannis Antonoglou and David Silver 

Phòng thí nghiệm: Google DeepMind  

Email: {schaul,johnquan,ioannisa,davidsilver}@google.com

Địa chỉ bài báo: [https://arxiv.org/abs/1511.05952](https://arxiv.org/abs/1511.05952)  Published as a conference paper at ICLR 2016

- **<u>*Tiêu đề có vấn đề*</u>**


## 1. Bối cảnh đề xuất
**Thuật toán học tăng cường sâu** kết hợp khả năng cảm nhận môi trường mạnh mẽ của học sâu và khả năng ra quyết định của học tăng cường, những năm gần đây được ứng dụng rộng rãi trong các lĩnh vực mới của trí tuệ nhân tạo như trò chơi, điều hướng tự hành không người lái, hợp tác đa tác tử và hệ gợi ý. Học tăng cường là một nhánh quan trọng của học máy, bản chất của nó là tác tử học chính sách trong môi trường theo cách "**thử-và-sai**", khác với học có giám sát và học không giám sát thông thường, học tăng cường nhấn mạnh sự tương tác giữa tác tử và môi trường, trong quá trình tương tác liên tục học để thay đổi chính sách nhằm có được lợi tức lớn nhất, từ đó có được chính sách tối ưu.

Do đặc tính thuật toán, học tăng cường không có tập dữ liệu sẵn có, còn chỉ dựa vào dữ liệu thu được ở từng bước đơn để cảm nhận và ra quyết định đối với thông tin môi trường phức tạp chưa biết thì không hiệu quả, không đáng tin cậy. Thuật toán DQN vừa kết hợp mạng nơ-ron, vừa kết hợp **cơ chế phát lại kinh nghiệm**, nhắm vào hạn chế của Q-learning, loại bỏ tính tương quan của dữ liệu lấy mẫu, giúp phân phối dữ liệu ổn định hơn.

Nhưng cùng với việc ứng dụng thuật toán DQN, các nhà nghiên cứu phát hiện, thuật toán DQN dựa trên cơ chế phát lại kinh nghiệm chỉ dùng **lấy mẫu đồng đều** và **cập nhật theo lô**, dẫn đến một số kinh nghiệm số lượng ít nhưng giá trị cao không được tận dụng hiệu quả. Nhắm vào tình huống trên, nhóm DeepMind đề xuất **cơ chế Prioritized Experience Replay (phát lại kinh nghiệm ưu tiên)**, bài viết này sẽ giới thiệu chi tiết bài báo đó.

## 2. Tóm tắt và kết luận
### 1 Tóm tắt
Phát lại kinh nghiệm (Experience replay) giúp tác tử học tăng cường trực tuyến (Online reinforcement learning) có thể ghi nhớ và tái sử dụng kinh nghiệm trong quá khứ. Phát lại kinh nghiệm trước đây lấy mẫu đồng đều từ bộ nhớ, chỉ lấy mẫu lại với cùng tần suất như kinh nghiệm ban đầu, bất kể tầm quan trọng của nó. Bài báo phát triển một khung ưu tiên kinh nghiệm, để phát lại dữ liệu quan trọng thường xuyên hơn, từ đó học hiệu quả hơn. Bài báo kết hợp cơ chế phát lại kinh nghiệm ưu tiên với mạng DQN, trong 49 trò chơi có 41 trò thể hiện tốt hơn DQN dùng phát lại đồng đều.

### 2 Kết luận
Bài báo thiết kế cho cơ chế phát lại kinh nghiệm và một số biến thể của nó các cách cài đặt có thể mở rộng sang bộ nhớ phát lại lớn, phát hiện phát lại ưu tiên có thể tăng tốc độ học gấp 2 lần, và đạt hiệu năng mới nhất (state-of-the-art) trên Atari Baseline.

## 3. Lý thuyết cơ bản
### 1 Phát lại kinh nghiệm (Experience Replay):
- Tạo một bể kinh nghiệm (Experience Replay Buffer), mỗi lần Agent chọn một hành động tương tác với môi trường thì lưu một bộ dữ liệu $`e_t = (s_t, a_t, r_t, s_{t+1})`$ vào bể kinh nghiệm.

- Duy trì bể kinh nghiệm này (hàng đợi), khi số bộ dữ liệu được lưu đạt đến một ngưỡng nhất định, dữ liệu sẽ được trích xuất khỏi hàng đợi.

- Dùng cách lấy mẫu đồng đều để trích xuất dữ liệu.

Phương pháp trên giải quyết vấn đề tương quan của dữ liệu kinh nghiệm (Correlated data) và phân phối không dừng (Non-stationary distribution). Cách làm của nó là **lấy mẫu đồng đều** từ các chuyển trạng thái (kinh nghiệm) trước đây để huấn luyện. Ưu điểm là hiệu suất sử dụng dữ liệu cao, một mẫu được dùng nhiều lần; đồng thời, tính tương quan của các mẫu liên tiếp khiến phương sai (Variance) của việc cập nhật tham số khá lớn, cách này giúp giảm tính tương quan đó.

Tuy nhiên, về vấn đề tồn tại khi dùng cách lấy mẫu đồng đều, tác giả đưa ra ví dụ như hình: ![](https://img-blog.csdnimg.cn/4fbf3f06c70b4db9ba49e3f0fa7417a2.jpeg#pic_center)
Hình trái biểu thị một môi trường (phần thưởng thưa) có trạng thái ban đầu là 1, có n trạng thái, hai hành động có thể chọn, chỉ khi chọn hành động đường màu xanh lá mới nhận được phần thưởng reward=1; hình phải là kết quả thực nghiệm, đường cong màu đen là kết quả lấy mẫu đồng đều, đường cong màu xanh lam là một thứ tự tối ưu tên là "oracle" do các nhà nghiên cứu đề xuất, tức là mỗi lần lấy mẫu transition đều dùng kết quả "tốt nhất", từ kết quả thực nghiệm có thể thấy phương pháp mỗi lần dùng thứ tự tối ưu trong môi trường phần thưởng thưa (Reward sparse) tốt hơn rõ rệt so với lấy mẫu đồng đều.

Vậy làm sao tìm được thứ tự "tối ưu" này trong ứng dụng thực tế, tức là làm sao thiết kế trước một thứ tự trước khi lấy mẫu, để dữ liệu mỗi lần lấy mẫu đều giúp agent học hiệu quả nhất có thể?
### 2 Phát lại kinh nghiệm ưu tiên (Prioritized Experience Replay, PER)
Nhắm vào vấn đề tồn tại của cơ chế phát lại kinh nghiệm, nhóm DeepMind đưa ra hai hướng suy nghĩ: cần lưu những kinh nghiệm nào (**which experiences to store**), và cần phát lại những kinh nghiệm nào (**which experiences to replay, and how to do so**). Bài báo chỉ nhắm vào hướng sau, tức là chọn dữ liệu cần lấy mẫu như thế nào và phương pháp thực nghiệm, để giải thích và nghiên cứu chi tiết.

Cơ chế PER dùng TD-error (sai số sai phân thời gian) làm tiêu chuẩn đo lường để đánh giá độ ưu tiên của dữ liệu được lấy mẫu. TD-error là hiệu giữa **giá trị Q hiện tại** và **giá trị Q mục tiêu** của nó trong sai phân thời gian, sai số càng lớn nghĩa là dữ liệu đó càng có ích cho việc cập nhật tham số mạng. Lấy mẫu một cách tham lam (chọn giá trị lớn nhất) các dữ liệu có TD-error lớn để huấn luyện, về lý thuyết sẽ tăng tốc hội tụ, nhưng kèm theo đó cũng sẽ gặp các vấn đề sau:

- TD-error có thể xem là lượng thông tin thu được (information gain) cho việc cập nhật tham số; thông tin thu được lớn chỉ cho biết lượng thu được lớn đối với tham số mạng giá trị hiện tại, nhưng không thể đại diện cho việc với mạng giá trị về sau lượng thu được có lớn hay không. Nếu chỉ xét lượng thông tin thu được một cách tham lam để lấy mẫu, độ ưu tiên của dữ liệu có TD-error hiện tại nhỏ sẽ ngày càng thấp, về sau ngày càng khó lấy mẫu được bộ dữ liệu đó.

- Lựa chọn tham lam khiến mạng nơ-ron luôn cập nhật một phần mẫu nào đó, tức "một tập con của kinh nghiệm", rất có thể dẫn đến rơi vào tối ưu cục bộ, hoặc xảy ra ước lượng quá cao.

Nhắm vào các vấn đề tồn tại trên của PER, tác giả đề xuất trong bài một phương pháp lấy mẫu ngẫu nhiên, phương pháp này nằm giữa thuần tham lam và ngẫu nhiên đồng đều, đảm bảo xác suất được lấy mẫu dựa trên độ ưu tiên của transition là đơn điệu, đồng thời đảm bảo xác suất khác không ngay cả với transition có độ ưu tiên thấp nhất, phương pháp lấy mẫu ngẫu nhiên sẽ được ***<u>trình bày ở mục 4.1</u>***.

## 4. Các công trình cải tiến liên quan
### 1 Ưu tiên ngẫu nhiên (Stochastic Prioritization)
Bài báo định nghĩa xác suất lấy mẫu transition $`i`$ là:
```math
P(i)=\frac{p_i^\alpha}{\sum_k p_k^\alpha}
```
Trong đó $`p_i>0`$ biểu thị độ ưu tiên của transition $`i`$. Số mũ $`α`$ quyết định dùng bao nhiêu độ ưu tiên, có thể xem là một hệ số đánh đổi (trade-off), dùng để cân bằng mức độ giữa uniform (đồng đều) và greedy (tham lam), khi $`α=0`$ là lấy mẫu đồng đều, $`α=1`$ là lấy mẫu tham lam (chọn giá trị lớn nhất).

Trong DQN: $`\delta=y -Q(s, a)`$, $`\delta`$ biểu thị TD-error, tức hiệu giữa giá trị Q hiện tại ở mỗi bước và giá trị mục tiêu $`y`$, trong quá trình cập nhật cũng là để kỳ vọng của $`\delta^2`$ càng nhỏ càng tốt.

Bài báo chia phát lại kinh nghiệm ưu tiên ngẫu nhiên thành hai loại sau:

a) Trực tiếp, dựa trên tỉ lệ: **Proportional Prioritization**

b) Gián tiếp, dựa trên thứ hạng: **Rank-based Prioritization**

- Trong **a) Proportional Prioritization**, quyết định xác suất lấy mẫu dựa vào $`|\delta|`$:

```math
p_i=\left|\delta_i\right|+\epsilon
```
Trong đó $`\delta`$ biểu thị TD-error, $`\epsilon`$ là một hằng số lớn hơn 0, để đảm bảo dù TD-error nhận giá trị nào, xác suất lấy mẫu $`p_i`$ vẫn lớn hơn 0, tức vẫn có xác suất được lấy mẫu.
- Trong **b) Rank-based Prioritization**, quyết định xác suất lấy mẫu dựa vào **thứ hạng (Rank)** của $`|\delta|`$:

```math
p_i=\frac{1}{\mathrm{rank}(i)}
```

Tác giả so sánh hai phương pháp trong bài:

**a) Phân tích ở mức lý thuyết:**
Ưu thế của **proportional prioritization** là có thể lấy trực tiếp thông tin của $`|\delta|`$, tức là thông tin thu được nhiều hơn một chút; còn **rank-based prioritization** thì không có thông tin của $`|\delta|`$, nhưng nó không nhạy với điểm ngoại lai, vì TD-error của điểm ngoại lai quá lớn hay quá nhỏ cũng không ảnh hưởng nhiều đến giá trị rank, cũng chính vì vậy, **rank-based prioritization** có tính bền vững tốt hơn.

**b) Phân tích ở mức thực nghiệm:**
Kết quả như hình dưới, có thể thấy hai phương pháp thể hiện gần như nhau. ![Mô tả hình ảnh](https://img-blog.csdnimg.cn/76f2099443674c2b9861ee94bcb75476.jpeg#pic_center)
### 2 SumTree 
Cài đặt Proportional Prioritization khá phức tạp, có thể nhờ cấu trúc dữ liệu SumTree để hoàn thành. SumTree là một cấu trúc cây, mỗi lá lưu độ ưu tiên P của mỗi mẫu, mỗi nút nhánh chỉ có hai nhánh con, giá trị của nút là tổng của hai nhánh con, nên đỉnh của SumTree chính là tổng của tất cả p. Cấu trúc như hình dưới ([trích từ jaromiru.com](https://jaromiru.com/2016/11/07/lets-make-a-dqn-double-learning-and-prioritized-experience-replay/)), nút ở tầng trên cùng là tổng của toàn bộ p. ![Mô tả hình ảnh](https://img-blog.csdnimg.cn/029d51b629cb4dceae5a69f7d5157dbe.png#pic_center)
Khi lấy mẫu, ta chia tổng của p cho batch size, chia thành batch size khoảng, tức $`n={ sum(p) }/{batchsize}`$. Nếu cộng độ ưu tiên của tất cả các nút được 42, nếu ta lấy 6 mẫu, thì priority của các khoảng lúc này có thể như sau: [0-7], [7-14], [14-21], [21-28], [28-35], [35-42]

Sau đó chọn ngẫu nhiên một số trong mỗi khoảng. Ví dụ trong khoảng [21-28] chọn được 24, thì theo số 24 này tìm kiếm từ trên cùng là 42 xuống dưới. Trước tiên thấy bên dưới 42 trên cùng có hai child nodes (nút con), cầm số 24 trong tay so với child bên trái là 29, nếu child bên trái lớn hơn giá trị trong tay, thì ta đi đường bên trái, tiếp theo so với điểm bên trái phía dưới 29 là 13, lúc này, số 24 trong tay lớn hơn 13, thì ta đi đường bên phải, và sửa giá trị trong tay theo 13, thành 24-13 = 11. Tiếp theo cầm 11 so với 12 ở góc dưới bên trái của 13, kết quả 12 lớn hơn 11, thì ta chọn 12 làm priority được chọn lần này, và cũng chọn dữ liệu tương ứng với 12.

Lấy cấu trúc cây trên làm ví dụ, nút gốc là 42, nếu muốn lấy mẫu một mẫu, ta có thể lấy mẫu đồng đều trong [0,42], lấy mẫu rơi vào khoảng nào thì là mẫu đó. Ví dụ ta lấy mẫu được 26, nằm trong khoảng (25-29), thì nút lá thứ tư được lấy mẫu. Còn chú ý rằng nút lá thứ ba có độ ưu tiên cao nhất là 12, khoảng 13-25 của nó cũng dài nhất, nên nó sẽ dễ được lấy mẫu hơn các nút khác.

Nếu muốn lấy mẫu hai mẫu, ta có thể lấy mẫu đồng đều trong hai khoảng [0,21], [21,42], cách làm tương tự lấy mẫu một mẫu ở trên.
### 3 Khử độ chệch (Annealing the Bias) 
Dùng phát lại kinh nghiệm ưu tiên còn một vấn đề là làm thay đổi phân phối của trạng thái, DQN đưa vào bể kinh nghiệm là để giải quyết tính tương quan của dữ liệu, giúp dữ liệu (cố gắng) độc lập và phân phối đồng nhất. Nhưng dùng phát lại kinh nghiệm ưu tiên lại làm thay đổi phân phối của trạng thái, như vậy tất yếu sẽ đưa vào độ chệch (bias), vì vậy, bài báo dùng lấy mẫu theo trọng số quan trọng (importance sampling) kết hợp với hệ số ủ (annealing) để khử độ chệch được đưa vào.

Trong DQN, gradient được tính như sau:
```math
\nabla_{\theta_i} L\left(\theta_i\right)=\mathbb{E}_{s, a, r, s^{\prime}}\left[\left(r+\gamma \max _{a^{\prime}} Q\left(s^{\prime}, a^{\prime} ; \theta_i\right)-Q\left(s, a ; \theta_i\right)\right) \nabla_{\theta_i} Q\left(s, a ; \theta_i\right)\right] \quad (1)
```
Trong giảm gradient ngẫu nhiên (SGD) có thể biểu diễn là:
```math
\nabla_\theta L(\theta)=\delta \nabla_\theta Q(s, a)
```
Còn importance sampling là thêm một trọng số $`w`$ vào gradient này
```math
\nabla_\theta L(\theta)=w \delta \nabla_\theta Q(s, a)
```
Trọng số importance sampling $`w_i`$ được định nghĩa trong bài là:
```math
w_i=\left(\frac{1}{N} \cdot \frac{1}{P(i)}\right)^\beta
```
$`N`$ là số mẫu trong Buffer, còn $`\beta`$ là một siêu tham số, dùng để quyết định muốn triệt tiêu ảnh hưởng của Prioritized Experience Replay lên kết quả hội tụ ở mức độ nào. Nếu $`\beta=0`$, nghĩa là hoàn toàn không dùng importance sampling; $`\beta=1`$ nghĩa là triệt tiêu hoàn toàn ảnh hưởng, vì $`(s, a)`$ không còn được chọn ngẫu nhiên theo phân phối đồng đều nữa, mà được chọn với xác suất $`P(i)`$, do đó, nếu $`\beta=1`$, thì $`w`$ và $`P(i)`$ vừa đúng triệt tiêu nhau, vì vậy tác dụng của Prioritized Experience Replay cũng bị triệt tiêu, tức $`\beta=1`$ tương đương với Experience Replay trong DQN.

Để ổn định, ta cần chuẩn hóa trọng số $`w`$, nhưng không cần chuẩn hóa theo đúng nghĩa, chỉ cần chia cho $`\max _i w_i`$ là được, tức là:

```math
w_j=(N * P(j))^{-\beta} / \max _i\left(w_i\right)
```

$`w_i`$ sau khi chuẩn hóa khi viết code có thể suy ra và chuyển thành:

```math
w_j=\frac{(N * P(j))^{-\beta}}{\max _i\left(w_i\right)}=\frac{(N * P(j))^{-\beta}}{\max _i\left((N * P(i))^{-\beta}\right)}=\frac{(P(j))^{-\beta}}{\max _i\left((P(i))^{-\beta}\right)}=\left(\frac{P_j}{\min _i P(i)}\right)^{-\beta}
```

## 5. Code PER
### 1 Quy trình thuật toán Prioritized Replay DQN
**Đầu vào thuật toán**: số vòng lặp $`T`$, số chiều đặc trưng trạng thái $`n`$, tập hành động $`A`$, bước nhảy $`\alpha`$, hệ số trọng số lấy mẫu $`\beta`$, hệ số suy giảm $`\gamma`$, tỉ lệ khám phá $`\epsilon`$, mạng $`Q`$ hiện tại $`Q`$, mạng $`\mathrm{Q}`$ mục tiêu $`Q^{\prime}`$, số mẫu của giảm gradient theo lô $`m`$, tần suất cập nhật tham số mạng $`\mathrm{Q}`$ mục tiêu $`C`$, số nút lá của SumTree $`S`$.

**Đầu ra**: tham số mạng Q.

1. Khởi tạo ngẫu nhiên giá trị $`Q`$ ứng với tất cả các trạng thái và hành động. Khởi tạo ngẫu nhiên toàn bộ tham số $`w`$ của mạng $`\mathrm{Q}`$ hiện tại, khởi tạo tham số của mạng Q mục tiêu $`Q^{\prime}`$ là $`w^{\prime}=w`$. Khởi tạo cấu trúc dữ liệu mặc định của SumTree phát lại kinh nghiệm, độ ưu tiên $`p_j`$ của tất cả $`S`$ nút lá của SumTree là 1.

2. for i from 1 to $`T`$, thực hiện lặp.
        
    a) Khởi tạo S là trạng thái đầu tiên của chuỗi trạng thái hiện tại, có được vectơ đặc trưng $`\phi(S)`$ của nó

    b) Trong mạng $`\mathrm{Q}`$ dùng $`\phi(S)`$ làm đầu vào, có được giá trị $`\mathrm{Q}`$ đầu ra ứng với tất cả các hành động của mạng $`\mathrm{Q}`$. Dùng phương pháp $`\epsilon`$-tham lam để chọn hành động tương ứng $`A`$ trong giá trị $`\mathrm{Q}`$ đầu ra hiện tại

    c) Thực hiện hành động hiện tại $`A`$ ở trạng thái $`S`$, có được vectơ đặc trưng $`\phi\left(S^{\prime}\right)`$ ứng với trạng thái mới $`S^{\prime}`$ và phần thưởng $`R`$, có phải trạng thái kết thúc is_end hay không

    d) Lưu bộ năm $`\left\{\phi(S), A, R, \phi\left(S^{\prime}\right), i s_{-} e n d\right\}`$ này vào SumTree

    e) $`S=S^{\prime}`$

    f) Lấy mẫu $`m`$ mẫu từ SumTree $`\left\{\phi\left(S_j\right), A_j, R_j, \phi\left(S_j^{\prime}\right), i s_{-} e n d_j\right\}, j=1,2 .,,, m`$, xác suất mỗi mẫu được lấy mẫu dựa trên $`P(j)=\frac{p_j}{\sum_i\left(p_i\right)}`$, trọng số hàm mất mát $`w_j=(N * P(j))^{-\beta} / \max _i\left(w_i\right)`$, tính giá trị Q mục tiêu hiện tại $`y_j`$:

```math
y_j= \begin{cases}R_j & \text { is end }_j \text { is true } \\ R_j+\gamma Q^{\prime}\left(\phi\left(S_j^{\prime}\right), \arg \max _{a^{\prime}} Q\left(\phi\left(S_j^{\prime}\right), a, w\right), w^{\prime}\right) & \text { is end }_j \text { is false }\end{cases}
```

   g) Dùng hàm mất mát sai số bình phương trung bình $`\frac{1}{m} \sum_{j=1}^m w_j\left(y_j-Q\left(\phi\left(S_j\right), A_j, w\right)\right)^2`$, thông qua lan truyền ngược gradient của mạng nơ-ron để cập nhật toàn bộ tham số $`w`$ của mạng Q

   h) Tính lại TD error của tất cả các mẫu $`\delta_j=y_j-Q\left(\phi\left(S_j\right), A_j, w\right)`$, cập nhật độ ưu tiên của tất cả các nút trong SumTree $`p_j=\left|\delta_j\right|`$

   i) Nếu $`\mathrm{i} \% \mathrm{C}=1`$, thì cập nhật tham số mạng $`\mathrm{Q}`$ mục tiêu $`w^{\prime}=w`$

   j) Nếu $`S^{\prime}`$ là trạng thái kết thúc, vòng lặp hiện tại hoàn tất, nếu không thì chuyển đến bước b)


### 2 Code liên quan
Code phần này có thể gọi trực tiếp trong chương trình, trong đó lớp ReplayBuffer() là phát lại kinh nghiệm truyền thống; lớp PrioritizedReplayBuffer(ReplayBuffer) là phát lại kinh nghiệm ưu tiên.

```python
import numpy as np
import random

from segment_tree import SumSegmentTree, MinSegmentTree


class ReplayBuffer(object):
    def __init__(self, size):
        """Create Replay buffer.

        Parameters
        ----------
        size: int
            Max number of transitions to store in the buffer. When the buffer
            overflows the old memories are dropped.
        """
        self._storage = []
        self._maxsize = size
        self._next_idx = 0

    def __len__(self):
        return len(self._storage)

    def add(self, obs_t, action, reward, obs_tp1, done):
        data = (obs_t, action, reward, obs_tp1, done)

        if self._next_idx >= len(self._storage):
            self._storage.append(data)
        else:
            self._storage[self._next_idx] = data
        self._next_idx = (self._next_idx + 1) % self._maxsize

    def _encode_sample(self, idxes):
        obses_t, actions, rewards, obses_tp1, dones = [], [], [], [], []
        for i in idxes:
            data = self._storage[i]
            obs_t, action, reward, obs_tp1, done = data
            obses_t.append(np.array(obs_t, copy=False))
            actions.append(np.array(action, copy=False))
            rewards.append(reward)
            obses_tp1.append(np.array(obs_tp1, copy=False))
            dones.append(done)
        return np.array(obses_t), np.array(actions), np.array(rewards), np.array(obses_tp1), np.array(dones)

    def sample(self, batch_size):
        """Sample a batch of experiences.

        Parameters
        ----------
        batch_size: int
            How many transitions to sample.

        Returns
        -------
        obs_batch: np.array
            batch of observations
        act_batch: np.array
            batch of actions executed given obs_batch
        rew_batch: np.array
            rewards received as results of executing act_batch
        next_obs_batch: np.array
            next set of observations seen after executing act_batch
        done_mask: np.array
            done_mask[i] = 1 if executing act_batch[i] resulted in
            the end of an episode and 0 otherwise.
        """
        idxes = [random.randint(0, len(self._storage) - 1) for _ in range(batch_size)]
        return self._encode_sample(idxes)


class PrioritizedReplayBuffer(ReplayBuffer):
    def __init__(self, size, alpha):
        """Create Prioritized Replay buffer.

        Parameters
        ----------
        size: int
            Max number of transitions to store in the buffer. When the buffer
            overflows the old memories are dropped.
        alpha: float
            how much prioritization is used
            (0 - no prioritization, 1 - full prioritization)

        See Also
        --------
        ReplayBuffer.__init__
        """
        super(PrioritizedReplayBuffer, self).__init__(size)
        assert alpha >= 0
        self._alpha = alpha

        it_capacity = 1
        while it_capacity < size:
            it_capacity *= 2

        self._it_sum = SumSegmentTree(it_capacity)
        self._it_min = MinSegmentTree(it_capacity)
        self._max_priority = 1.0

    def add(self, *args, **kwargs):
        """See ReplayBuffer.store_effect"""
        idx = self._next_idx
        super().add(*args, **kwargs)
        self._it_sum[idx] = self._max_priority ** self._alpha
        self._it_min[idx] = self._max_priority ** self._alpha

    def _sample_proportional(self, batch_size):
        res = []
        p_total = self._it_sum.sum(0, len(self._storage) - 1)
        every_range_len = p_total / batch_size
        for i in range(batch_size):
            mass = random.random() * every_range_len + i * every_range_len
            idx = self._it_sum.find_prefixsum_idx(mass)
            res.append(idx)
        return res

    def sample(self, batch_size, beta):
        """Sample a batch of experiences.

        compared to ReplayBuffer.sample
        it also returns importance weights and idxes
        of sampled experiences.


        Parameters
        ----------
        batch_size: int
            How many transitions to sample.
        beta: float
            To what degree to use importance weights
            (0 - no corrections, 1 - full correction)

        Returns
        -------
        obs_batch: np.array
            batch of observations
        act_batch: np.array
            batch of actions executed given obs_batch
        rew_batch: np.array
            rewards received as results of executing act_batch
        next_obs_batch: np.array
            next set of observations seen after executing act_batch
        done_mask: np.array
            done_mask[i] = 1 if executing act_batch[i] resulted in
            the end of an episode and 0 otherwise.
        weights: np.array
            Array of shape (batch_size,) and dtype np.float32
            denoting importance weight of each sampled transition
        idxes: np.array
            Array of shape (batch_size,) and dtype np.int32
            idexes in buffer of sampled experiences
        """
        assert beta > 0

        idxes = self._sample_proportional(batch_size)

        weights = []
        p_min = self._it_min.min() / self._it_sum.sum()
        max_weight = (p_min * len(self._storage)) ** (-beta)

        for idx in idxes:
            p_sample = self._it_sum[idx] / self._it_sum.sum()
            weight = (p_sample * len(self._storage)) ** (-beta)
            weights.append(weight / max_weight)
        weights = np.array(weights)
        encoded_sample = self._encode_sample(idxes)
        return tuple(list(encoded_sample) + [weights, idxes])

    def update_priorities(self, idxes, priorities):
        """Update priorities of sampled transitions.

        sets priority of transition at index idxes[i] in buffer
        to priorities[i].

        Parameters
        ----------
        idxes: [int]
            List of idxes of sampled transitions
        priorities: [float]
            List of updated priorities corresponding to
            transitions at the sampled idxes denoted by
            variable `idxes`.
        """
        assert len(idxes) == len(priorities)
        for idx, priority in zip(idxes, priorities):
            assert priority > 0
            assert 0 <= idx < len(self._storage)
            self._it_sum[idx] = priority ** self._alpha
            self._it_min[idx] = priority ** self._alpha

            self._max_priority = max(self._max_priority, priority)

```
Lớp ở trên gọi đến cấu trúc dữ liệu SumTree, code như sau:

```python
import operator


class SegmentTree(object):
    def __init__(self, capacity, operation, neutral_element):
        """Build a Segment Tree data structure.

        https://en.wikipedia.org/wiki/Segment_tree

        Can be used as regular array, but with two
        important differences:

            a) setting item's value is slightly slower.
               It is O(lg capacity) instead of O(1).
            b) user has access to an efficient ( O(log segment size) )
               `reduce` operation which reduces `operation` over
               a contiguous subsequence of items in the array.

        Paramters
        ---------
        capacity: int
            Total size of the array - must be a power of two.
        operation: lambda obj, obj -> obj
            and operation for combining elements (eg. sum, max)
            must form a mathematical group together with the set of
            possible values for array elements (i.e. be associative)
        neutral_element: obj
            neutral element for the operation above. eg. float('-inf')
            for max and 0 for sum.
        """
        assert capacity > 0 and capacity & (capacity - 1) == 0, "capacity must be positive and a power of 2."
        self._capacity = capacity
        self._value = [neutral_element for _ in range(2 * capacity)]
        self._operation = operation

    def _reduce_helper(self, start, end, node, node_start, node_end):
        if start == node_start and end == node_end:
            return self._value[node]
        mid = (node_start + node_end) // 2
        if end <= mid:
            return self._reduce_helper(start, end, 2 * node, node_start, mid)
        else:
            if mid + 1 <= start:
                return self._reduce_helper(start, end, 2 * node + 1, mid + 1, node_end)
            else:
                return self._operation(
                    self._reduce_helper(start, mid, 2 * node, node_start, mid),
                    self._reduce_helper(mid + 1, end, 2 * node + 1, mid + 1, node_end)
                )

    def reduce(self, start=0, end=None):
        """Returns result of applying `self.operation`
        to a contiguous subsequence of the array.

            self.operation(arr[start], operation(arr[start+1], operation(... arr[end])))

        Parameters
        ----------
        start: int
            beginning of the subsequence
        end: int
            end of the subsequences

        Returns
        -------
        reduced: obj
            result of reducing self.operation over the specified range of array elements.
        """
        if end is None:
            end = self._capacity
        if end < 0:
            end += self._capacity
        end -= 1
        return self._reduce_helper(start, end, 1, 0, self._capacity - 1)

    def __setitem__(self, idx, val):
        # index of the leaf
        idx += self._capacity
        self._value[idx] = val
        idx //= 2
        while idx >= 1:
            self._value[idx] = self._operation(
                self._value[2 * idx],
                self._value[2 * idx + 1]
            )
            idx //= 2

    def __getitem__(self, idx):
        assert 0 <= idx < self._capacity
        return self._value[self._capacity + idx]


class SumSegmentTree(SegmentTree):
    def __init__(self, capacity):
        super(SumSegmentTree, self).__init__(
            capacity=capacity,
            operation=operator.add,
            neutral_element=0.0
        )

    def sum(self, start=0, end=None):
        """Returns arr[start] + ... + arr[end]"""
        return super(SumSegmentTree, self).reduce(start, end)

    def find_prefixsum_idx(self, prefixsum):
        """Find the highest index `i` in the array such that
            sum(arr[0] + arr[1] + ... + arr[i - i]) <= prefixsum

        if array values are probabilities, this function
        allows to sample indexes according to the discrete
        probability efficiently.

        Parameters
        ----------
        perfixsum: float
            upperbound on the sum of array prefix

        Returns
        -------
        idx: int
            highest index satisfying the prefixsum constraint
        """
        assert 0 <= prefixsum <= self.sum() + 1e-5
        idx = 1
        while idx < self._capacity:  # while non-leaf
            if self._value[2 * idx] > prefixsum:
                idx = 2 * idx
            else:
                prefixsum -= self._value[2 * idx]
                idx = 2 * idx + 1
        return idx - self._capacity


class MinSegmentTree(SegmentTree):
    def __init__(self, capacity):
        super(MinSegmentTree, self).__init__(
            capacity=capacity,
            operation=min,
            neutral_element=float('inf')
        )

    def min(self, start=0, end=None):
        """Returns min(arr[start], ...,  arr[end])"""
        
        return super(MinSegmentTree, self).reduce(start, end)

```
## 6. Tổng kết và triển vọng
Tuy PER đạt hiệu năng cao hơn khi dùng **cùng số lần tương tác**, phù hợp hơn với các môi trường phức tạp có **phần thưởng thưa** hoặc **phần thưởng cao khó đạt được**, nhưng nếu tốn cùng thời gian, hiệu năng chưa chắc cao hơn, tức là thời gian tốn gấp ba bốn lần. (Tài liệu tham khảo 6) đưa ra thực nghiệm và kết luận riêng về vấn đề tốn thời gian của PER, chia tổng thời gian lấy mẫu tiêu tốn thành ba phần (**thời gian lấy mẫu, thời gian cập nhật PER, thời gian cập nhật thuật toán**) để thực nghiệm, phát hiện mạng có thêm PER gốc lại tốn thời gian hơn.

> The first one is the sample, which needs to search on the sum-tree. When the capacity of EM goes larger, the sampling time, whose time complexity is O(logN), becomes a bottleneck.
The second one is PER update, which is the same time complexity as sampling.
The last one is the DDQN or DDPG update, which is executed on GPU.
We measure the time cost to correct all priorities of EM(capacity is 106). All data must be predicted by DDQN on GPU, it needs 150+ s. We can see that the update cost is very high.

Đồng thời bản thân người viết và thầy hướng dẫn khi thực nghiệm cũng phát hiện vấn đề tương tự: PER với môi trường phần thưởng thưa hiện nay về lý thuyết lẽ ra phải có hiệu quả, nhưng vì ở giai đoạn hiện tại mọi người muốn khám phá nhanh hơn, hội tụ nhanh hơn, không chỉ làm không ít mẹo (trick) ở mức cảm nhận môi trường, mà hàm phần thưởng cũng được thiết kế ngày càng phong phú, nhược điểm tốn thời gian của PER bị phóng đại vô hạn, vì vậy khi chọn bể phát lại kinh nghiệm mọi người nên cân nhắc tình hình thực tế của mình, đừng cầm thuật toán Rainbow là bắt đầu sửa loạn, hiệu quả có thể phản tác dụng.
## Tài liệu tham khảo
1.[https://arxiv.org/pdf/1511.05952.pdf](https://arxiv.org/pdf/1511.05952.pdf)

2.[https://zhuanlan.zhihu.com/p/310630316](https://zhuanlan.zhihu.com/p/310630316)

3.[https://zhuanlan.zhihu.com/p/160186240](https://zhuanlan.zhihu.com/p/160186240)

4.[https://zhuanlan.zhihu.com/p/137880325](https://zhuanlan.zhihu.com/p/137880325)

5.[https://jaromiru.com/2016/11/07/lets-make-a-dqn-double-learning-and-prioritized-experience-replay/](https://jaromiru.com/2016/11/07/lets-make-a-dqn-double-learning-and-prioritized-experience-replay/)

6.[https://www.mdpi.com/2076-3417/10/19/6925/pdf](https://www.mdpi.com/2076-3417/10/19/6925/pdf)

7.[Sách Nấm EasyRL (蘑菇书EasyRL)](https://gitcode.net/mirrors/datawhalechina/easy-rl?utm_source=csdn_github_accelerator)

## Giới thiệu người viết

Li Chengyang (李成阳)
