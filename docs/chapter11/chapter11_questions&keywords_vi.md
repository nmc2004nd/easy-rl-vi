# Chương 11 Học bắt chước

## Từ khóa

- **Học bắt chước (imitation learning, IL)**: bàn về việc khi ta không có phần thưởng hoặc không thể định nghĩa phần thưởng nhưng có tương tác với môi trường thì tác tử học như thế nào. Điều này hơi giống các bài toán ta thường xử lý, vì thường ta không thể nhận được phần thưởng rõ ràng từ môi trường. Học bắt chước còn được gọi là học từ minh họa (learning from demonstration), học việc (apprenticeship learning) và học bằng quan sát (learning by watching),...

- **Nhân bản hành vi (behavior cloning)**: tương tự học có giám sát trong học máy, thu thập các thông tin tương ứng như trạng thái và hành động của chuyên gia để huấn luyện mạng. Khi sử dụng, đưa vào trạng thái là có thể đưa ra hành động tương ứng.

- **Tổng hợp tập dữ liệu (dataset aggregation)**: dùng để đối phó với trường hợp trong nhân bản hành vi chuyên gia không cung cấp được dữ liệu, nó mong thu thập được hành động của chuyên gia trong đủ loại trạng thái cực đoan.

- **Học tăng cường ngược (inverse reinforcement learning, IRL)**: học tăng cường ngược tìm ra hàm phần thưởng trước, rồi dùng học tăng cường để tìm ra diễn viên tối ưu. Làm vậy vì ta không có phần thưởng trong môi trường, nhưng có minh họa của chuyên gia, dùng học tăng cường ngược, ta có thể suy ra chuyên gia vì hàm phần thưởng nào mà thực hiện các hành động này. Có hàm phần thưởng rồi thì có thể dùng phương pháp học tăng cường thông thường để tìm ra diễn viên tối ưu.

- **Học bắt chước góc nhìn ngôi thứ ba (third person imitation learning)**: một kỹ thuật tổng quát hóa kinh nghiệm quan sát được ở góc nhìn ngôi thứ ba thành kinh nghiệm ở góc nhìn ngôi thứ nhất.


## Bài tập

**11-1** Có những phương pháp học bắt chước cụ thể nào?

Nhân bản hành vi, học tăng cường ngược hay còn gọi là điều khiển tối ưu ngược (inverse optimal control).

**11-2** Nhân bản hành vi có những vấn đề gì? Có những cách giải quyết tương ứng nào?

(1) Trước hết, nếu chỉ thu thập minh họa của chuyên gia (hành động đưa ra khi nhìn thấy một trạng thái nào đó), thì tất cả các kết quả sẽ rất hạn chế. Vì vậy ta cần thu thập hành động của chuyên gia trong đủ loại trạng thái cực đoan, hay nói cách khác là cần thu thập dữ liệu nhiều hơn, phức tạp hơn, có thể dùng phương pháp tổng hợp tập dữ liệu.

(2) Ngoài ra, khi dùng nhân bản hành vi theo nghĩa truyền thống, tác tử sẽ sao chép hoàn toàn hành vi của chuyên gia, bất kể hành vi của chuyên gia có hợp lý hay không, tác tử đều cố nhớ nó. Tác tử là một mạng, dung lượng của mạng là có hạn. Dù cho mạng đủ dữ liệu huấn luyện, độ chính xác nó đạt được trên tập huấn luyện thường cũng không phải 100%. Vì vậy lúc này, cái gì nên học, cái gì không nên học trở nên rất quan trọng. Thực tế, một số rất ít hành vi của chuyên gia là vô nghĩa, nhưng dùng minh họa của họ ít nhất sẽ không gây ảnh hưởng xấu.

(3) Còn nữa, khi làm nhân bản hành vi, dữ liệu huấn luyện và dữ liệu kiểm thử thường không khớp nhau. Ta có thể dùng tổng hợp tập dữ liệu để giảm bớt vấn đề này. Cụ thể, khi huấn luyện và khi kiểm thử, phân phối dữ liệu là khác nhau. Vì trong học tăng cường, hành động sẽ ảnh hưởng đến trạng thái tiếp theo. Ta có trạng thái $s_1$ trước, rồi thực hiện hành động $a_1$, hành động $a_1$ sẽ quyết định trạng thái tiếp theo $s_2$. Nếu $\pi^*$ giống hệt $\hat{\pi}$, thì trạng thái ta nhìn thấy khi huấn luyện và khi kiểm thử sẽ giống nhau, như vậy hiệu năng tổng quát hóa của mô hình sẽ trở nên khá kém. Hơn nữa, $\pi^*$ và $\hat{\pi}$ có thể có một chút sai số, tuy sai số này trong học có giám sát, vì mỗi mẫu đều độc lập nên ảnh hưởng không lớn, nhưng với học tăng cường, có thể ở một chỗ nào đó, tác tử không thể sao chép hoàn toàn hành vi của chuyên gia, kết quả cuối cùng sẽ kém đi rất nhiều. Vì vậy nhân bản hành vi không thể giải quyết hoàn toàn bài toán học bắt chước, ta có thể dùng một phương pháp khác khá tốt, tức học tăng cường ngược.

> Ghi chú của người dịch: câu "nếu $\pi^*$ giống hệt $\hat{\pi}$ ... hiệu năng tổng quát hóa sẽ khá kém" được dịch sát bản gốc nhưng chưa chặt chẽ về logic. Theo chương chính (mục 11.1), nếu $\pi^*$ giống hệt $\hat{\pi}$ thì phân phối trạng thái khi huấn luyện và kiểm thử sẽ khớp nhau — đó là trường hợp lý tưởng; vấn đề thực sự là ta rất khó làm cho chúng giống hệt nhau.

**11-3** Học tăng cường ngược vận hành như thế nào?

Trước hết, ta có một chuyên gia, chính sách của chuyên gia là $\hat{\pi}$, chuyên gia này phụ trách tương tác với môi trường, cho ta $\hat{\tau_1}$ ~ $\hat{\tau_n}$, ta cần ghi lại toàn bộ chuỗi trạng thái-hành động trong đó. Sau đó với diễn viên, chính sách của nó là $\pi$, cũng cần thực hiện tương tác và ghi lại chuỗi như vậy. Tiếp theo ta cần chỉ định một hàm phần thưởng, và đảm bảo điểm tương ứng với chuyên gia nhất định phải cao hơn của diễn viên, dùng hàm phần thưởng này để tiếp tục học và cập nhật việc huấn luyện, đồng thời áp dụng phương pháp học tăng cường trong điều kiện thông thường để cập nhật mạng diễn viên. Trong quá trình này, ta cũng phải đồng thời cập nhật hàm phần thưởng đã chỉ định từ đầu, làm điểm của diễn viên ngày càng cao, nhưng không vượt quá điểm của chuyên gia. Hàm phần thưởng cuối cùng phải làm cho phần thưởng tương ứng của cả chuyên gia và diễn viên đều đạt điểm khá cao, và từ hàm phần thưởng cuối cùng không thể phân biệt được hai bên.

**11-4** Phương pháp học tăng cường ngược và mạng đối sinh (GAN) trong sinh ảnh có điểm gì tương đồng?

Trong mạng đối sinh, ta có một số tập dữ liệu ảnh khá tốt, cũng có một bộ sinh (generator), lúc đầu nó không biết phải sinh ra ảnh như thế nào, chỉ có thể sinh ngẫu nhiên. Ngoài ra, ta có một bộ phân biệt (discriminator), nó dùng để chấm điểm cho ảnh được sinh ra, ảnh do chuyên gia sinh ra được điểm cao, ảnh do bộ sinh sinh ra được điểm thấp. Có bộ phân biệt rồi, bộ sinh sẽ tìm cách "lừa" bộ phân biệt. Bộ sinh mong bộ phân biệt cũng chấm điểm cao cho ảnh nó sinh ra. Toàn bộ quá trình tương tự quá trình học tăng cường ngược. Ta đối chiếu từng phần.

(1) Ảnh được sinh ra chính là kết quả phân biệt của chuyên gia, bộ sinh chính là diễn viên, bộ sinh sẽ sinh ra rất nhiều ảnh và để diễn viên tương tác với môi trường, từ đó sinh ra rất nhiều quỹ đạo. Bản ghi tương tác với môi trường của các quỹ đạo này tương đương với ảnh được sinh ra trong mạng đối sinh.

> Ghi chú của người dịch: câu đầu của mục (1) được dịch sát bản gốc nhưng diễn đạt chưa rõ. Theo chương chính (hình 11.8), cách đối chiếu đúng là: **ảnh thật (đẹp) trong GAN ↔ minh họa của chuyên gia**, **bộ sinh ↔ diễn viên**, **ảnh do bộ sinh vẽ ↔ quỹ đạo do diễn viên tạo ra**, **bộ phân biệt ↔ hàm phần thưởng**.

(2) Hàm phần thưởng trong học tăng cường ngược chính là bộ phân biệt. Hàm phần thưởng chấm điểm cao cho các ví dụ của chuyên gia, chấm điểm thấp cho kết quả tương tác của diễn viên.

(3) Xét quá trình của cả hai, trong học tăng cường ngược, diễn viên sẽ tìm cách đạt điểm cao từ hàm phần thưởng đã học được, rồi lặp lại theo vòng. Quá trình này thực ra nhất quán với quá trình huấn luyện của mạng đối sinh.
