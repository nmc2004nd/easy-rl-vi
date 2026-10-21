# Chương 12 Thuật toán gradient chính sách tất định sâu (DDPG)

## Từ khóa

- **Gradient chính sách tất định sâu (deep deterministic policy gradient, DDPG)**: thuật toán học tăng cường kinh điển trong lĩnh vực điều khiển liên tục, là một phương pháp mở rộng của mạng Q sâu để xử lý không gian hành động liên tục. Cụ thể, từ tên gọi có thể thấy, "sâu" cho biết dùng mạng nơ-ron sâu; "tất định" cho biết nó đưa ra một hành động xác định, có thể dùng cho môi trường hành động liên tục; "gradient chính sách" cho biết nó dùng mạng chính sách, và cập nhật một lần sau mỗi bước, nó là một mạng chính sách cập nhật từng bước. Nó và mạng Q sâu đều có các mẹo mạng mục tiêu và phát lại kinh nghiệm, ở phần phát lại kinh nghiệm là giống nhau, còn ở việc cập nhật mạng mục tiêu thì hơi khác.


## Bài tập

**12-1** Hãy giải thích chính sách ngẫu nhiên và chính sách tất định, hai loại khác nhau thế nào?

(1) Với chính sách ngẫu nhiên (stochastic policy) $\pi_\theta(a_t|s_t)$, ta đưa vào một trạng thái $s$ nào đó, khả năng thực hiện một hành động $a$ nào đó không phải là 100%, mà có một xác suất, giống như bốc thăm, rút ngẫu nhiên một hành động theo xác suất.

(2) Với chính sách tất định (deterministic policy) $\mu_{\theta}(s_t)$, nó không chịu ảnh hưởng của xác suất. Khi tham số của mạng nơ-ron được cố định, đưa vào cùng một trạng thái, nhất định đưa ra cùng một hành động, đây chính là chính sách tất định.

**12-2** Với không gian điều khiển hành động liên tục và không gian điều khiển hành động rời rạc, nếu ta đều dùng mạng chính sách, thì nên làm thế nào cho từng trường hợp?

Trước hết cần nói rõ, với không gian điều khiển hành động liên tục, các thuật toán như Q-learning, mạng Q sâu không thể xử lý được, vì vậy ta cần dùng mạng nơ-ron để xử lý, vì nó có thể vừa đưa ra giá trị xác suất, vừa có thể đưa ra chính sách xác định $\mu_{\theta}(s_t)$.

(1) Để đưa ra hành động rời rạc, hàm kích hoạt (activation function) ở đầu ra cuối cùng dùng Softmax là được. Nó có thể đảm bảo đầu ra là xác suất hành động, và tổng xác suất của tất cả các hành động bằng 1.

(2) Để đưa ra hành động liên tục, có thể thêm một tầng hàm kích hoạt tanh ở tầng đầu ra, nó có thể giới hạn đầu ra trong $[-1,1]$. Có đầu ra này rồi, ta có thể co giãn theo phạm vi của hành động thực tế, rồi đưa cho môi trường. Ví dụ mạng nơ-ron đưa ra một số thực 2.8, sau khi qua hàm kích hoạt tanh, nó được giới hạn trong $[-1,1]$, đưa ra 0.99. Giả sử phạm vi hành động tốc độ của xe là $[-2,2]$, thì ta phóng to theo tỉ lệ từ $[-1,1]$ lên $[-2,2]$, 0.99 nhân 2, cuối cùng đầu ra là 1.98, dùng nó làm tốc độ của xe hoặc lực đẩy xe đưa cho môi trường.


## Câu hỏi phỏng vấn

**12-1** Người phỏng vấn thân thiện: Hãy tóm tắt thuật toán gradient chính sách tất định sâu.

Thuật toán gradient chính sách tất định sâu dùng cấu trúc diễn viên-nhà phê bình (actor-critic), nhưng đầu ra không phải xác suất của hành động, mà là hành động cụ thể, nó có thể dùng để dự đoán hành động liên tục. Mục đích tối ưu là mở rộng mạng Q sâu sang không gian hành động liên tục. Ngoài ra, ý nghĩa của nó đúng như tên gọi:

(1) Sâu là vì dùng mạng nơ-ron sâu;

(2) Tất định cho biết nó đưa ra một hành động xác định, có thể dùng cho môi trường hành động liên tục;

(3) Gradient chính sách cho biết nó dùng mạng chính sách. Thuật toán REINFORCE mỗi tập cập nhật mạng một lần, nhưng thuật toán gradient chính sách tất định sâu cập nhật mạng chính sách một lần sau mỗi bước, nó là một mạng chính sách cập nhật từng bước.

**12-2** Người phỏng vấn thân thiện: Thuật toán gradient chính sách tất định sâu là on-policy hay off-policy? Hãy giải thích nguyên nhân cụ thể và phân tích.

Thuật toán off-policy (khác chính sách). (1) Thuật toán gradient chính sách tất định sâu là mạng Q sâu đã được tối ưu, nó dùng phát lại kinh nghiệm (experience replay), nên là thuật toán off-policy. (2) Vì thuật toán gradient chính sách tất định sâu, để đảm bảo một mức khám phá nhất định, đã thêm một ít nhiễu vào hành động đầu ra, nên chính sách hành vi không còn là chính sách được tối ưu nữa.

**12-3** Người phỏng vấn thân thiện: Bạn có tìm hiểu về thuật toán gradient chính sách tất định sâu phân tán theo phân phối (distributed distributional deep deterministic policy gradient, D4PG) không? Hãy mô tả.

Thuật toán gradient chính sách tất định sâu phân tán theo phân phối (distributed distributional deep deterministic policy gradient, D4PG), so với thuật toán gradient chính sách tất định sâu, có các phần được tối ưu như sau.

(1) Nhà phê bình theo phân phối (distributional critic): không chỉ ước lượng giá trị kỳ vọng của giá trị Q nữa, mà ước lượng phân phối của giá trị Q kỳ vọng, tức là ước lượng giá trị Q kỳ vọng như một biến ngẫu nhiên.

(2) Lợi tức tích lũy $N$ bước: khi tính sai số sai phân thời gian, D4PG tính giá trị mục tiêu sai phân thời gian $N$ bước chứ không chỉ một bước, như vậy có thể xét đến lợi tức của nhiều bước hơn trong tương lai.

(3) Nhiều diễn viên song song phân tán: D4PG dùng $K$ diễn viên độc lập song song để thu thập dữ liệu huấn luyện và lưu vào cùng một bộ đệm phát lại.

(4) Phát lại kinh nghiệm ưu tiên (prioritized experience replay, PER): dùng một xác suất không đồng đều để lấy mẫu dữ liệu từ bộ đệm phát lại.
