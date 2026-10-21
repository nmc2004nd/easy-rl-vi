# Chương 1 Cơ bản về Học tăng cường

> 🧠 **Ôn tập để nhớ lâu:** sau khi đọc xong, hãy [ôn chương 1 bằng flashcard và quiz](review/index.html?ch=1 ':ignore :target=_self'). Flashcard tự lên lịch ôn cách quãng; quiz có giải thích cho từng đáp án.

## Từ khóa

- **Học tăng cường (reinforcement learning, RL)**: thuật toán trong đó tác tử (agent), khi tương tác với một môi trường phức tạp và bất định, cố gắng tối đa hóa phần thưởng nhận được.

- **Hành động (action)**: đầu ra của tác tử dựa trên trạng thái hiện tại, được môi trường tiếp nhận.

- **Trạng thái (state)**: trạng thái mà tác tử nhận được từ môi trường.

- **Phần thưởng (reward)**: tín hiệu phản hồi tác tử nhận được từ môi trường, tín hiệu này cho biết sau khi tác tử thực hiện một chính sách nào đó ở một bước nào đó thì có nhận được phần thưởng hay không, và phần thưởng lớn bao nhiêu.

- **Khám phá (exploration)**: trong tình huống hiện tại, tiếp tục thử các hành động mới. Có thể nhận được phần thưởng cao hơn, cũng có thể trắng tay.

- **Khai thác (exploitation)**: trong tình huống hiện tại, tiếp tục thực hiện điều đã biết là đem lại phần thưởng lớn nhất, tức là chọn lặp lại hành động hiện tại.

- **Học tăng cường sâu (deep reinforcement learning)**: phương pháp học tăng cường đầu-cuối (end-to-end), không cần thiết kế đặc trưng thủ công, chỉ cần đưa trạng thái vào là hệ thống có thể trực tiếp cho ra hành động. Thường dùng mạng nơ-ron để xấp xỉ hàm giá trị (value function) hoặc mạng chính sách (policy network).

- **Quan sát được toàn bộ (full observability), quan sát được hoàn toàn (fully observed) và quan sát được một phần (partially observed)**: khi trạng thái của tác tử tương đương với trạng thái của môi trường, ta nói môi trường là quan sát được toàn bộ; khi tác tử quan sát được tất cả trạng thái của môi trường, ta nói môi trường là quan sát được hoàn toàn; thông thường khi tác tử không quan sát được tất cả trạng thái của môi trường, ta nói môi trường là quan sát được một phần.

- **Quá trình quyết định Markov quan sát được một phần (partially observable Markov decision process, POMDP)**: dạng tổng quát hóa của quá trình quyết định Markov. POMDP vẫn có tính chất Markov, nhưng giả định rằng tác tử không thể cảm nhận trạng thái của môi trường, chỉ biết được một phần giá trị quan sát.

- **Không gian hành động (action space), không gian hành động rời rạc (discrete action space) và không gian hành động liên tục (continuous action space)**: trong một môi trường cho trước, tập các hành động hợp lệ được gọi là không gian hành động; không gian hành động mà số hành động của tác tử là hữu hạn gọi là không gian hành động rời rạc, ngược lại gọi là không gian hành động liên tục.

- **Dựa trên chính sách (policy-based)**: tác tử xây dựng một chính sách hành động, tức là xác định cần thực hiện hành động gì ở một trạng thái cho trước, và hành động theo chính sách này. Thuật toán học tăng cường tối ưu trực tiếp chính sách, giúp chính sách đạt được phần thưởng lớn nhất.

- **Dựa trên giá trị (value-based)**: tác tử không cần xây dựng chính sách tường minh, nó duy trì một bảng giá trị hoặc hàm giá trị, và thông qua bảng giá trị hoặc hàm giá trị này để thực hiện hành động làm giá trị lớn nhất.

- **Cấu trúc có mô hình (model-based)**: tác tử ra quyết định thông qua việc học sự chuyển trạng thái.

- **Cấu trúc không mô hình (model-free)**: tác tử không ước lượng trực tiếp sự chuyển trạng thái, cũng không có được các biến chuyển cụ thể của môi trường; nó ra quyết định thông qua việc học hàm giá trị hoặc mạng chính sách.


## Bài tập

**1-1** Cấu trúc cơ bản của học tăng cường là gì?

Về bản chất là sự tương tác giữa tác tử và môi trường. Cụ thể, khi tác tử nhận được trạng thái tại thời điểm hiện tại trong môi trường, nó sẽ dựa trên trạng thái này để đưa ra một hành động; hành động này được thực thi trong môi trường, và môi trường trả về trạng thái tiếp theo cùng phần thưởng của hành động hiện tại. Mục tiêu tồn tại của tác tử trong môi trường là tối đa hóa phần thưởng tích lũy kỳ vọng (expected cumulative reward).

**1-2** Vì sao quá trình huấn luyện của học tăng cường khó hơn so với học có giám sát?

(1) Học tăng cường chủ yếu xử lý dữ liệu tuần tự, rất khó thỏa mãn điều kiện độc lập và phân phối đồng nhất (i.i.d.) như các mẫu trong học có giám sát.

(2) Học tăng cường có phần thưởng trễ (delayed reward), tức là khi hành động của tác tử tác động lên môi trường, phần thưởng của môi trường cho trạng thái của tác tử bị trễ, khiến phản hồi không tức thời.

(3) Học có giám sát có nhãn đúng, mô hình có thể dựa vào nhãn để sửa dự đoán và cập nhật mô hình; còn học tăng cường tương đương với một quá trình "thử-và-sai", hoàn toàn dựa vào "phản hồi" của môi trường để cập nhật hành động có lợi nhất cho mình.

**1-3** Học tăng cường có những đặc trưng cơ bản nào?

(1) Có quá trình khám phá thử-và-sai (trial-and-error exploration), tức là cần khám phá môi trường để hiểu môi trường hiện tại.

(2) Tác tử trong học tăng cường nhận phần thưởng trễ từ môi trường.

(3) Trong quá trình huấn luyện học tăng cường, thời gian rất quan trọng, vì dữ liệu đều có tương quan theo thời gian, chứ không như dữ liệu trong học có giám sát phần lớn thỏa mãn i.i.d.

(4) Hành động của tác tử trong học tăng cường ảnh hưởng đến phản hồi mà nó nhận được từ môi trường.

**1-4** Những năm gần đây học tăng cường phát triển nhanh vì những lý do gì?

(1) Năng lực tính toán (computation power) tăng lên giúp ta có thể nhanh hơn trong việc dùng thử-và-sai để tác tử thu được nhiều thông tin hơn trong môi trường, từ đó đạt phần thưởng lớn hơn.

(2) Chúng ta có phương pháp huấn luyện đầu-cuối như học tăng cường sâu, có thể tối ưu đồng thời các phần trích xuất đặc trưng, ước lượng giá trị và ra quyết định, nhờ đó thu được một mạng ra quyết định mạnh hơn.

**1-5** Trạng thái và quan sát có quan hệ gì?

Trạng thái (state) là mô tả đầy đủ về môi trường, không che giấu thông tin của môi trường. Quan sát (observation) là mô tả một phần của trạng thái, có thể bỏ sót một số thông tin. Trong học tăng cường sâu, chúng ta gần như luôn dùng vectơ, ma trận hoặc tenxơ bậc cao giá trị thực để biểu diễn trạng thái và quan sát.

**1-6** Một tác tử học tăng cường gồm những thành phần nào?

(1) Hàm chính sách (policy function), tác tử dùng hàm chính sách để chọn hành động tiếp theo; chính sách gồm chính sách ngẫu nhiên (stochastic policy) và chính sách tất định (deterministic policy).

(2) Hàm giá trị (value function), ta dùng hàm giá trị để đánh giá trạng thái hiện tại, tức là việc đi vào trạng thái hiện tại ảnh hưởng bao nhiêu đến phần thưởng về sau. Giá trị hàm giá trị càng lớn, chứng tỏ đi vào trạng thái đó càng có lợi.

(3) Mô hình (model), thể hiện sự hiểu biết của tác tử về trạng thái môi trường hiện tại, nó quyết định hệ thống vận hành thế nào.

**1-7** Dựa trên sự khác nhau của tác tử học tăng cường, ta có thể chia chúng thành những loại nào?

(1) Tác tử dựa trên giá trị (value-based agent). Học tường minh hàm giá trị, học ngầm chính sách của tác tử. Vì chính sách này được suy ra từ hàm giá trị đã học.

(2) Tác tử dựa trên chính sách (policy-based agent). Học trực tiếp chính sách, tức là cho tác tử một trạng thái, nó sẽ đưa ra xác suất của hành động tương ứng. Tất nhiên tác tử dựa trên chính sách không học hàm giá trị của tác tử.

(3) Ngoài ra còn một loại tác tử kết hợp cả hai loại trên. Kết hợp tác tử dựa trên giá trị và dựa trên chính sách ta có tác tử diễn viên-nhà phê bình (actor-critic agent). Loại tác tử này học hàm chính sách và hàm giá trị, rồi thông qua tương tác giữa hai thứ để đạt được trạng thái tốt hơn.

**1-8** Phương pháp học tăng cường dựa trên lặp chính sách và dựa trên lặp giá trị khác nhau thế nào?

(1) Với phương pháp học tăng cường dựa trên lặp chính sách (policy iteration), tác tử xây dựng một chính sách hành động, tức là xác định cần thực hiện hành động gì ở một trạng thái cho trước, và hành động theo chính sách đó. Thuật toán học tăng cường tối ưu trực tiếp chính sách, giúp chính sách đạt phần thưởng lớn nhất. Với phương pháp học tăng cường dựa trên lặp giá trị (value iteration), tác tử không cần xây dựng chính sách tường minh, nó duy trì một bảng giá trị hoặc hàm giá trị, và thông qua bảng giá trị hoặc hàm giá trị này để chọn hành động có giá trị lớn nhất.

(2) Phương pháp dựa trên lặp giá trị chỉ áp dụng được trong môi trường rời rạc, ví dụ cờ vây hoặc một số trò chơi; với các tình huống có tập hành động rất lớn hoặc hành động liên tục, ví dụ điều khiển robot, nó khó học được kết quả tốt (khi đó phương pháp dựa trên lặp chính sách có thể chọn hành động liên tục dựa trên chính sách đã thiết lập).

(3) Các thuật toán học tăng cường dựa trên lặp giá trị gồm Q-learning, Sarsa,...; thuật toán dựa trên lặp chính sách gồm thuật toán gradient chính sách (policy gradient),...

(4) Ngoài ra, thuật toán diễn viên-nhà phê bình (actor-critic) dùng đồng thời chính sách và đánh giá giá trị để ra quyết định. Trong đó, tác tử thực hiện hành động theo chính sách, còn hàm giá trị đánh giá giá trị của hành động đã thực hiện; nhờ vậy có thể tăng tốc quá trình học so với thuật toán gradient chính sách ban đầu, từ đó đạt hiệu quả tốt hơn.

**1-9** Học có mô hình và học không mô hình khác nhau thế nào?

Dựa trên việc có cần mô hình hóa môi trường thật hay không, học tăng cường có thể chia thành học có mô hình (model-based) và học không mô hình (model-free). Học có mô hình là dựa vào kinh nghiệm trong môi trường để xây dựng một thế giới ảo, đồng thời học trong cả môi trường thật và thế giới ảo; học không mô hình là không mô hình hóa môi trường, trực tiếp tương tác với môi trường thật để học được chính sách tối ưu. Nói chung, học có mô hình so với học không mô hình chỉ có thêm một bước, đó là mô hình hóa môi trường thật. Học không mô hình thường thuộc nhóm phương pháp hướng dữ liệu (data-driven), cần lượng lớn mẫu để ước lượng trạng thái, hành động và hàm phần thưởng, từ đó tối ưu chính sách hành động. Khả năng tổng quát hóa (generalization) của học không mô hình tốt hơn học có mô hình, lý do là học có mô hình cần mô hình hóa môi trường thật, và giữa thế giới ảo với môi trường thật có thể còn khác biệt, điều này hạn chế khả năng tổng quát hóa của thuật toán học có mô hình.

**1-10** Hiểu học tăng cường một cách dễ hiểu như thế nào?

Môi trường và hàm phần thưởng không phải thứ ta có thể kiểm soát, cả hai đã được xác định từ trước khi bắt đầu học. Việc duy nhất ta có thể làm là điều chỉnh chính sách, giúp tác tử nhận được phần thưởng lớn nhất trong môi trường. Ngoài ra, chính sách quyết định hành vi của tác tử: chính sách nhận một đầu vào từ bên ngoài, rồi đưa ra hành động cần thực hiện lúc này.


## Câu hỏi phỏng vấn

**1-1** Người phỏng vấn thân thiện: Có vẻ bạn đã hiểu biết nhất định về học tăng cường, vậy bạn có thể nói trong một câu nhận thức của bạn về học tăng cường không?

Học tăng cường gồm 3 phần: môi trường, hành động và phần thưởng; bản chất của nó là tác tử thông qua tương tác với môi trường, sao cho tổng phần thưởng thu được từ các quyết định ứng với hành động của nó là lớn nhất, hay nói cách khác là kỳ vọng lớn nhất.

**1-2** Người phỏng vấn thân thiện: Theo bạn, học tăng cường, học có giám sát và học không giám sát khác nhau thế nào?

Thứ nhất, học tăng cường và học không giám sát (unsupervised learning) không cần mẫu có nhãn, còn học có giám sát cần nhiều mẫu có nhãn để xây dựng và huấn luyện mô hình. Thứ hai, giữa học tăng cường và học không giám sát: học không giám sát mô hình hóa trực tiếp dựa trên dữ liệu cho trước, tìm cấu trúc ẩn trong dữ liệu hoặc đặc trưng, thường tương ứng với bài toán phân cụm (clustering); học tăng cường cần học chính sách thông qua phần thưởng trễ để biết khoảng cách giữa mô hình và mục tiêu, khoảng cách này có thể được đánh giá định lượng bằng hàm phần thưởng, ở đây ta có thể coi hàm phần thưởng là một dạng thưa (sparse), trễ của mục tiêu đúng. Ngoài ra, học tăng cường chủ yếu xử lý dữ liệu tuần tự, các mẫu thường có tương quan mạnh với nhau, rất khó thỏa mãn điều kiện i.i.d. như mẫu của học có giám sát.

**1-3** Người phỏng vấn thân thiện: Theo hiểu biết của bạn, học tăng cường có những tình huống sử dụng nào?

Tóm gọn lại là "bài toán ra quyết định tuần tự nhiều bước", hoặc là bài toán mà mô hình tương ứng chưa biết, cần thông qua học để dần tiệm cận mô hình thật. Đồng thời hành động hiện tại ảnh hưởng đến trạng thái của môi trường, tức là bài toán có tính chất Markov. Đồng thời cần thỏa mãn điều kiện mọi trạng thái đều có thể quay lại được nhiều lần, tức là thỏa mãn điều kiện có thể học.

**1-4** Người phỏng vấn thân thiện: Hàm mất mát (loss function) trong học tăng cường và hàm mất mát trong học sâu khác nhau thế nào?

Mục đích của hàm mất mát trong học sâu là làm khoảng cách giữa giá trị dự đoán và giá trị thật càng nhỏ càng tốt, còn mục đích của hàm mất mát trong học tăng cường là làm kỳ vọng của tổng phần thưởng càng lớn càng tốt.

**1-5** Người phỏng vấn thân thiện: Bạn có biết về có mô hình (model-based) và không mô hình (model-free) không? Hai loại này khác nhau cụ thể thế nào?

Tôi cho rằng khác biệt chính giữa hai loại là có cần mô hình hóa môi trường thật hay không. Phương pháp không mô hình không cần mô hình hóa môi trường, chỉ cần tương tác trực tiếp với môi trường thật, vì vậy nó thường cần nhiều dữ liệu hoặc nhiều lần lấy mẫu để tối ưu chính sách, điều này cũng giúp nó có hiệu năng tổng quát hóa tốt hơn với môi trường thật; còn phương pháp có mô hình cần mô hình hóa môi trường, đồng thời học trong cả môi trường thật và môi trường ảo, nếu môi trường được mô hình hóa khác biệt lớn với môi trường thật thì hiệu năng tổng quát hóa sẽ bị hạn chế. Cùng với sự phát triển của công nghệ và sự tích lũy dữ liệu, hiện nay người ta thường dùng phương pháp không mô hình.
