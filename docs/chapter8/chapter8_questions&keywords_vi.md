# Chương 8 DQN (Hành động liên tục)

## Bài tập

**8-1** Tại sao so với các phương pháp dựa trên gradient chính sách, mạng Q sâu có hiệu quả huấn luyện tốt hơn, ổn định hơn?

Trong mạng Q sâu, chỉ cần ước lượng được hàm Q, là có thể tìm được một chính sách khá tốt. Tương tự, chỉ cần ước lượng được hàm Q, là có thể cải thiện chính sách tương ứng. Vì ước lượng hàm Q là một bài toán hồi quy (regression) khá dễ, trong bài toán hồi quy này, ta có thể luôn quan sát xem hiệu quả huấn luyện mô hình có ngày càng tốt hay không (thông thường ta chỉ cần chú ý hàm mất mát của hồi quy có giảm hay không, là có thể đánh giá mô hình học tốt hay không), vì vậy ước lượng hàm Q dễ hơn so với học một chính sách. Chỉ cần ước lượng hàm Q, là có thể đảm bảo bây giờ chắc chắn sẽ có được một chính sách khá tốt, đồng thời nó cũng khá dễ vận hành. Ngược lại, mục tiêu tối ưu trong phương pháp gradient chính sách là tối đa hóa tổng lợi tức, nhưng ta rất khó tìm được một hàm mất mát rõ ràng để tối ưu, về bản chất nó là một bài toán tìm kiếm chính sách (policy search), tức là một bài toán tối ưu không ràng buộc.

**8-2** Mạng Q sâu gặp vấn đề gì khi xử lý hành động liên tục? Có những cách giải quyết tương ứng nào?

Các bài toán thường gặp trong cuộc sống hằng ngày phần lớn đều chứa hành động liên tục, ví dụ tác tử cần lái xe tự động, nó cần quyết định vô lăng quay trái bao nhiêu độ hay quay phải bao nhiêu độ, đây là hành động liên tục; giả sử tác tử là một robot, trên thân nó có 50 khớp, mỗi hành động của nó ứng với góc của 50 khớp này, các góc này cũng là liên tục.

Tuy nhiên khi dùng mạng Q sâu, một bước rất quan trọng là yêu cầu giải được bài toán tối ưu tương ứng. Sau khi ta ước lượng được hàm Q $Q(s,a)$, phải tìm được một hành động làm cho $Q(s,a)$ lớn nhất. Giả sử hành động là rời rạc, thì số khả năng của hành động $a$ là hữu hạn. Nhưng nếu hành động là liên tục, ta không thể giống như với hành động rời rạc mà vét cạn tất cả các hành động có thể có.

Để giải quyết vấn đề này, có các phương án sau.

(1) Phương án thứ nhất: ta có thể dùng phương pháp lấy mẫu, tức là lấy mẫu ngẫu nhiên ra $N$ hành động có thể có, rồi đưa lần lượt từng hành động vào hàm Q, tính $N$ giá trị Q tương ứng, và so sánh xem cái nào lớn nhất. Nhưng phương án này vì dùng phương pháp lấy mẫu nên sẽ không thật chính xác.

(2) Phương án thứ hai: ta mô hình hóa bài toán hành động liên tục này thành một bài toán tối ưu, từ đó có thể dùng gradient ascent để tối đa hóa hàm mục tiêu. Cụ thể, ta xem hành động là biến, dùng gradient ascent để cập nhật giá trị Q tương ứng với hành động. Nhưng phương án này thường tốn khá nhiều thời gian, vì nó cần tính lặp.

(3) Phương án thứ ba: thiết kế một kiến trúc mạng đặc biệt, tức là thiết kế một hàm Q đặc biệt, làm việc tìm hành động $a$ tối đa hóa hàm Q trở nên rất dễ. Tức là hàm Q ở đây không phải là một hàm Q tổng quát, ta có thể dùng cách đặc biệt để thiết kế hàm Q, làm việc tìm hành động $a$ làm hàm Q này lớn nhất trở nên rất dễ. Nhưng hàm Q của phương án này không thể thiết kế tùy ý, nó phải có một số hạn chế bổ sung.

(4) Phương án thứ tư: không dùng mạng Q sâu, dù sao dùng nó để xử lý hành động liên tục cũng khá phiền phức.
