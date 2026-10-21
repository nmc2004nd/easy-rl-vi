# Chương 6 DQN (Khái niệm cơ bản)

## Từ khóa

- **Mạng Q sâu (deep Q-network, DQN)**: thuật toán Q-learning dựa trên học sâu, kết hợp xấp xỉ hàm giá trị (value function approximation) với kỹ thuật mạng nơ-ron, và dùng các phương pháp như mạng mục tiêu và phát lại kinh nghiệm để huấn luyện mạng.

- **Hàm giá trị trạng thái (state-value function)**: đầu vào là trạng thái của diễn viên ở một thời điểm nào đó, đầu ra là một số vô hướng, tức là khi diễn viên ở trạng thái tương ứng, giá trị dự kiến có thể nhận được trong khoảng thời gian cho đến khi quá trình kết thúc.

- **Phương trình Bellman của hàm giá trị trạng thái (state-value function Bellman equation)**: phương trình Bellman dựa trên hàm giá trị trạng thái, nó biểu thị kỳ vọng của phần thưởng tích lũy $G_t$ ở trạng thái $s_t$.

- **Hàm Q (Q-function)**: còn được gọi là hàm giá trị hành động (action-value function). Đầu vào là một cặp trạng thái-hành động, tức là ở một trạng thái cụ thể thực hiện hành động tương ứng, giả sử về sau ta đều dùng một chính sách $\pi$ nào đó, giá trị kỳ vọng của phần thưởng tích lũy nhận được là bao nhiêu.

- **Mạng mục tiêu (target network)**: giải quyết vấn đề trong mạng dựa trên sai phân thời gian, hai vế trái phải của mục tiêu tối ưu $Q_{\pi}\left(s_{t}, a_{t}\right) = r_{t}+Q_{\pi}\left(s_{t+1}, \pi\left(s_{t+1}\right)\right)$ đồng thời thay đổi khiến quá trình huấn luyện bất ổn định, từ đó làm tăng độ khó của hồi quy. Mạng mục tiêu chọn cố định vế phải, tức $r_{t}+Q_{\pi}\left(s_{t+1}, \pi\left(s_{t+1}\right)\right)$, thông qua việc thay đổi tham số ở vế trái, tức $Q_{\pi}\left(s_{t}, a_{t}\right)$, để hồi quy, đây cũng là một mẹo khá quan trọng trong ứng dụng mạng Q sâu.

- **Khám phá (exploration)**: khi ta dùng hàm Q, chính sách hoàn toàn phụ thuộc vào hàm Q, điều này có thể dẫn đến trường hợp các hành động tương ứng chỉ cố định ở vài giá trị, không giống như trong gradient chính sách, đầu ra là ngẫu nhiên, ta lấy mẫu từ phân phối ngẫu nhiên để chọn hành động. Điều này khiến giá trị đầu vào để ta tiếp tục huấn luyện giống nhau, từ đó "làm nặng thêm" tính cố định của đầu ra, khiến khả năng biểu diễn của toàn bộ mô hình giảm mạnh, đây chính là vấn đề thế lưỡng nan khám phá-khai thác (exploration-exploitation dilemma). Ta có thể dùng các phương pháp khám phá như $\varepsilon$-tham lam ($\varepsilon$-greedy) và khám phá Boltzmann (Boltzmann exploration) để tối ưu.

- **Phát lại kinh nghiệm (experience replay)**: sẽ xây dựng một bộ đệm phát lại (replay buffer) để lưu nhiều kinh nghiệm, mỗi kinh nghiệm có dạng như sau: ở một trạng thái $s_t$ nào đó, thực hiện một hành động $a_t$ nào đó, nhận phần thưởng $r_t$, rồi đi vào trạng thái $s_{t+1}$. Ta dùng $\pi$ tương tác với môi trường nhiều lần, lưu tất cả kinh nghiệm thu thập được vào bộ đệm phát lại. Khi bộ đệm "đầy", nó sẽ tự động xóa các kinh nghiệm vào bộ đệm sớm nhất. Khi huấn luyện, mỗi vòng lặp đều có một lô (batch) tương ứng (giống như khi ta huấn luyện mạng thông thường, đều có được qua lấy mẫu), rồi dùng các kinh nghiệm trong lô này để cập nhật hàm Q. Tóm lại, khi lấy mẫu và huấn luyện, hàm Q sẽ dùng đến các kinh nghiệm trong quá khứ, vì vậy ở đây gọi phương pháp này là phát lại kinh nghiệm, nó cũng là một mẹo khá quan trọng trong ứng dụng mạng Q sâu.


## Bài tập

**6-1** Tại sao trong mạng Q sâu dùng cách biểu diễn xấp xỉ hàm giá trị?

Trước hết mạng Q sâu là thuật toán Q-learning dựa trên học sâu, mà trong Q-learning, ta dùng bảng để lưu phần thưởng của hành động ở mỗi trạng thái, tức hàm giá trị hành động $Q(s,a)$ mà ta giới thiệu trong phần chính. Nhưng trong nhiệm vụ thực tế, số trạng thái thường rất lớn, và trong các nhiệm vụ liên tục sẽ gặp các vấn đề như lời nguyền số chiều (curse of dimensionality), dùng hàm giá trị thực thường là không thực tế, vì vậy dùng cách biểu diễn xấp xỉ hàm giá trị.

**6-2** Đầu ra của nhà phê bình thường liên quan trực tiếp đến những giá trị nào?

Liên quan trực tiếp đến trạng thái và diễn viên. Khi ta thảo luận về đầu ra, thường là đo lường một trạng thái tốt hay xấu đối với một diễn viên, tức là trạng thái, giá trị về bản chất phụ thuộc vào diễn viên. Các diễn viên khác nhau ở cùng một trạng thái cũng sẽ có đầu ra khác nhau.

**6-3** Ta thường đo lường hàm giá trị trạng thái $V_{\pi}(s)$ như thế nào? Ưu điểm và nhược điểm của từng cách là gì?

(1) Phương pháp dựa trên Monte Carlo: về bản chất là cho diễn viên tương tác với môi trường. Nhà phê bình dựa vào kết quả thống kê, ghép diễn viên với trạng thái, tức là nếu diễn viên nhìn thấy một trạng thái $s_a$ nào đó, sẽ dự đoán phần thưởng tích lũy tiếp theo là bao nhiêu, nếu nhìn thấy một trạng thái khác $s_b$, sẽ dự đoán phần thưởng tích lũy tiếp theo là bao nhiêu. Nhưng tính phổ quát của nó không tốt, nó cần khớp với tất cả các trạng thái. Nếu ta đối mặt với bài toán đơn giản có số trạng thái hữu hạn như trò chơi rắn săn mồi thì còn đối phó được, nhưng nếu ta đối mặt với nhiệm vụ dạng hình ảnh, ta gần như không thể "ghi lại" tất cả các trạng thái (ứng với hình ảnh của từng khung hình). Tóm lại, nó không thể đưa ra giá trị tương ứng cho các trạng thái đầu vào chưa từng xuất hiện.

(2) Phương pháp mạng dựa trên Monte Carlo: để bù đắp nhược điểm của phương pháp dựa trên Monte Carlo mô tả ở trên, ta định nghĩa hàm giá trị trạng thái $V_{\pi}(s)$ trong đó là một mạng, nó có thể với các trạng thái đầu vào chưa từng xuất hiện, dựa vào khả năng tổng quát hóa và khả năng khớp của mạng, "ước lượng" ra một giá trị đầu ra.

(3) Phương pháp mạng dựa trên sai phân thời gian, tức mạng dựa trên sai phân thời gian: giống như khác biệt giữa phương pháp Monte Carlo và phương pháp sai phân thời gian mà ta giới thiệu ở 4 chương đầu, khác biệt giữa phương pháp mạng dựa trên sai phân thời gian và phương pháp mạng dựa trên Monte Carlo cũng tương tự. Trong phương pháp dựa trên Monte Carlo, mỗi lần ta đều phải tính phần thưởng tích lũy, tức tổng tất cả phần thưởng nhận được từ một trạng thái $s_a$ nào đó cho đến khi trò chơi kết thúc. Vì vậy khi muốn áp dụng phương pháp dựa trên Monte Carlo, ta phải chơi ít nhất đến khi trò chơi kết thúc. Nhưng có những trò chơi phải chơi đến khi kết thúc mới cập nhật được mạng thì tốn quá nhiều thời gian, vì vậy ta dùng phương pháp mạng dựa trên sai phân thời gian. Phương pháp mạng dựa trên sai phân thời gian không cần chơi đến khi trò chơi kết thúc, chỉ cần ở một trạng thái $s_t$ nào đó của trò chơi, thực hiện hành động $a_t$ nhận phần thưởng $r_t$, đi vào trạng thái $s_{t+1}$, là có thể áp dụng phương pháp mạng dựa trên sai phân thời gian. Công thức của nó tương tự phương pháp sai phân thời gian đã giới thiệu trước đó, tức $V_{\pi}\left(s_{t}\right)=V_{\pi}\left(s_{t+1}\right)+r_{t}$.

(4) Khác biệt giữa phương pháp dựa trên Monte Carlo và phương pháp dựa trên sai phân thời gian là: bản thân phương pháp Monte Carlo có tính ngẫu nhiên rất lớn, ta có thể xem $G_a$ của nó là một biến ngẫu nhiên, vì vậy phương sai cuối cùng của nó rất lớn. Còn với sai phân thời gian, nó có biến ngẫu nhiên $r$. Vì ở trạng thái $s_t$ thực hiện cùng một hành động, phần thưởng nhận được cũng chưa chắc giống nhau, nên với phương pháp sai phân thời gian, $r$ là một biến ngẫu nhiên. Nhưng so với $G_a$ của phương pháp Monte Carlo, tính ngẫu nhiên của $r$ rất nhỏ, đó là vì bản thân $G_a$ được tạo thành từ rất nhiều $r$. Từ một góc độ khác, trong phương pháp sai phân thời gian, tiền đề của ta là $r_t=V_{\pi}\left(s_{t}\right)-V_{\pi}\left(s_{t+1}\right)$, nhưng thường ta không thể đảm bảo sai số khi tính $V_{\pi}\left(s_{t+1}\right)$, $V_{\pi}\left(s_{t}\right)$ bằng 0. Vì vậy khi $V_{\pi}\left(s_{t+1}\right)$, $V_{\pi}\left(s_{t}\right)$ tính không chính xác, kết quả nhận được cũng sẽ không chính xác. Tóm lại, cả hai đều có ưu nhược điểm.

> Ghi chú của người dịch: ở mục (4), bản gốc viết "độ chệch (偏差) cuối cùng rất lớn" và "$r_t=V_{\pi}(s_{t+1})-V_{\pi}(s_t)$". Theo phần chính của chương, đúng ra phải là **phương sai** lớn và $r_t=V_{\pi}(s_t)-V_{\pi}(s_{t+1})$ (suy từ biểu thức (6.1)); bản dịch đã sửa hai chỗ này.

(5) Hiện nay, phương pháp dựa trên sai phân thời gian được dùng khá phổ biến, phương pháp dựa trên Monte Carlo thực ra ít được dùng hơn.

**6-4** Dựa trên phương pháp mạng dựa trên Monte Carlo được giới thiệu trong phần chính của chương này, ta huấn luyện mô hình như thế nào? Hay ta nên xem nó là loại bài toán gì trong học máy?

Trong trạng thái lý tưởng, ta mong với một trạng thái đầu vào, đưa ra giá trị phần thưởng không có sai số của nó. Với hàm giá trị, nếu trạng thái đầu vào là $s_a$, giá trị đầu ra đúng phải là $G_a$. Nếu trạng thái đầu vào là $s_b$, giá trị đầu ra đúng phải là $G_b$. Vì vậy khi huấn luyện, nó chính là một bài toán hồi quy (regression) điển hình trong học máy. Thực tế ta chỉ cần đưa ra một giá trị không chính xác tuyệt đối, tức là ta mong khi đầu vào là trạng thái $s_a$, giá trị đầu ra càng gần $G_a$ càng tốt; khi đầu vào là $s_b$, giá trị đầu ra càng gần $G_b$ càng tốt. Phương pháp huấn luyện của nó tương tự như khi ta huấn luyện các mạng nơ-ron sâu như mạng nơ-ron tích chập (convolutional neural network).

**6-5** Dựa trên phương pháp mạng dựa trên sai phân thời gian được giới thiệu trong phần chính của chương này, cụ thể ta nên huấn luyện mô hình như thế nào?

Hàm cốt lõi của mạng dựa trên sai phân thời gian là $V_{\pi}\left(s_{t}\right)=V_{\pi}\left(s_{t+1}\right)+r_{t}$. Ta đưa trạng thái $s_t$ vào mạng, vì đưa $s_t$ vào mạng sẽ được đầu ra $V_{\pi}(s_t)$, tương tự đưa $s_{t+1}$ vào mạng sẽ được $V_{\pi}(s_{t+1})$. Đồng thời hàm cốt lõi $V_{\pi}\left(s_{t}\right)=V_{\pi}\left(s_{t+1}\right)+r_{t}$ cho ta biết, giá trị $V_{\pi}(s_t)$ trừ $V_{\pi}(s_{t+1})$ phải là $r_t$. Ta mong hiệu số của chúng càng gần $r_t$ càng tốt. Đây cũng là mục tiêu tối ưu của mạng, ta gọi nó là hàm mất mát (loss function).

**6-6** Hàm giá trị hành động và hàm giá trị trạng thái có khác biệt và liên hệ gì?

(1) Đầu vào của hàm giá trị trạng thái là một trạng thái, nó dựa vào trạng thái để tính giá trị kỳ vọng của phần thưởng tích lũy sau trạng thái hiện tại là bao nhiêu.

(2) Đầu vào của hàm giá trị hành động là cặp trạng thái-hành động, tức là ở một trạng thái nào đó thực hiện một hành động nào đó, đồng thời giả sử về sau ta đều dùng chính sách $\pi$, giá trị kỳ vọng của phần thưởng tích lũy nhận được là bao nhiêu.

**6-7** Hãy giới thiệu hai cách biểu diễn hàm Q.

(1) Khi biểu diễn bằng cặp trạng thái-hành động, tức là khi đầu vào của hàm Q là cặp trạng thái-hành động, đầu ra là một số vô hướng.

(2) Khi chỉ biểu diễn bằng trạng thái, tức là khi đầu vào của hàm Q chỉ là một trạng thái, đầu ra là nhiều giá trị.

**6-8** Khi đã có hàm Q, ta nên tìm chính sách tốt hơn $\pi'$ như thế nào? Hay nói cách khác, bản chất của $\pi'$ là gì?

Trước hết, $\pi'$ được tính bằng $\pi^{\prime}(s)=\underset{a}{\arg \max} Q_{\pi}(s, a)$, nó biểu thị: giả sử ta đã học được hàm Q của $\pi$, với một trạng thái $s$ nào đó, đưa lần lượt tất cả các hành động $a$ có thể có vào hàm Q này, xem hành động $a$ nào làm giá trị hàm Q lớn nhất, thì hành động đó chính là hành động mà $\pi'$ sẽ thực hiện. Vì vậy chính sách $\pi'$ quyết định hành động theo phương pháp trên chắc chắn tốt hơn chính sách ban đầu $\pi$, tức $V_{\pi^{\prime}}(s) \geqslant V_{\pi}(s)$.

**6-9** Có những phương pháp khám phá nào để giải quyết vấn đề thế lưỡng nan khám phá-khai thác?

(1) $\varepsilon$-tham lam: ta có xác suất $1-\varepsilon$ (thường $\varepsilon$ rất nhỏ) hoàn toàn quyết định hành động theo hàm Q, nhưng có xác suất $\varepsilon$ làm hành động ngẫu nhiên. Thông thường khi cài đặt, giá trị $\varepsilon$ sẽ giảm dần theo thời gian. Tức là lúc đầu, vì chưa biết hành động nào tốt hơn, nên ta sẽ dành khá nhiều công sức để khám phá. Tiếp theo khi số lần huấn luyện ngày càng nhiều, ta đã khá chắc chắn chính sách nào tốt hơn, sẽ giảm khám phá, từ đó giảm giá trị $\varepsilon$, chủ yếu dựa vào hàm Q để quyết định các hành động trong tương lai, tính ngẫu nhiên sẽ giảm.

(2) Khám phá Boltzmann: phương pháp này khá giống gradient chính sách. Trong gradient chính sách, đầu ra của mạng là một phân phối xác suất trên không gian hành động kỳ vọng, ta lấy mẫu theo phân phối xác suất. Vì vậy cũng có thể dựa vào giá trị Q để xác định một phân phối xác suất, giả sử giá trị Q của một hành động nào đó càng lớn, chứng tỏ nó càng tốt, xác suất ta thực hiện hành động này càng cao.

**6-10** Dùng phát lại kinh nghiệm có lợi ích gì?

(1) Trước hết, trong toàn bộ quá trình học tăng cường, quá trình tốn thời gian nhất là tương tác với môi trường, dùng GPU thậm chí TPU để huấn luyện mạng tương đối khá nhanh. Còn dùng bộ đệm phát lại có thể giảm số lần tương tác với môi trường. Vì khi huấn luyện, kinh nghiệm của ta không cần toàn bộ đến từ một chính sách nào đó (hoặc chính sách ở thời điểm hiện tại). Một số kinh nghiệm có được từ các chính sách trong quá khứ có thể được đặt trong bộ đệm phát lại và được dùng nhiều lần, được tái sử dụng nhiều lần, như vậy kinh nghiệm lấy mẫu được mới được tận dụng hiệu quả.

(2) Ngoài ra, khi huấn luyện mạng, thực ra ta mong dữ liệu trong một lô càng đa dạng càng tốt. Nếu dữ liệu trong một lô đều cùng tính chất, khả năng khớp của mô hình ta huấn luyện ra có thể không khả quan lắm. Nếu trong một lô toàn là dữ liệu giống nhau, khi huấn luyện, hiệu quả khớp sẽ khá kém. Nếu kinh nghiệm trong bộ đệm phát lại đều đến từ các chính sách khác nhau, thì dữ liệu trong một lô lấy mẫu được sẽ khá đa dạng. Như vậy có thể đảm bảo hiệu năng của mô hình ít nhất sẽ không quá kém.

**6-11** Trong phát lại kinh nghiệm, ta quan sát giá trị của $\pi$, phát hiện trong đó lẫn một số kinh nghiệm không phải của $\pi$, điều này có ảnh hưởng không?

Không ảnh hưởng. Điều này không phải vì $\pi$ trong quá khứ rất giống $\pi'$ hiện tại, dù $\pi$ trong quá khứ không giống lắm thì thực ra cũng không sao. Nguyên nhân chính là ta không lấy mẫu một quỹ đạo, ta chỉ lấy mẫu một mẫu kinh nghiệm, nên không liên quan gì đến việc có phải off-policy hay không. Dù là off-policy, dù các kinh nghiệm này không đến từ $\pi$, ta vẫn có thể dùng các kinh nghiệm này để ước lượng $Q_{\pi}(s,a)$.


## Câu hỏi phỏng vấn

**6-1** Người phỏng vấn thân thiện: Mạng Q sâu là gì? Hai mẹo then chốt của nó là gì?

Mạng Q sâu là thuật toán Q-learning dựa trên học sâu, nó kết hợp xấp xỉ hàm giá trị với kỹ thuật mạng nơ-ron, và dùng hai mẹo mạng mục tiêu và phát lại kinh nghiệm để huấn luyện mạng.

**6-2** Người phỏng vấn thân thiện: Vậy ta phân tích tiếp! Hai mẹo trong mạng Q sâu mà bạn vừa nhắc đến — mạng mục tiêu và phát lại kinh nghiệm, tác dụng cụ thể của chúng là gì?

Trong mạng Q sâu, việc cập nhật một hàm giá trị hành động nào đó phụ thuộc vào các hàm giá trị hành động khác. Nếu ta liên tục cập nhật tham số của mạng giá trị, sẽ khiến mục tiêu cập nhật liên tục thay đổi, tức là ta đang đuổi theo một mục tiêu liên tục thay đổi, như vậy tất yếu sẽ kém ổn định. Để giải quyết vấn đề trong mạng dựa trên sai phân thời gian, hai vế trái phải của mục tiêu tối ưu $Q_{\pi}\left(s_{t}, a_{t}\right) =r_{t}+Q_{\pi}\left(s_{t+1}, \pi\left(s_{t+1}\right)\right)$ đồng thời thay đổi khiến quá trình huấn luyện bất ổn định, từ đó làm tăng độ khó của hồi quy, mạng mục tiêu chọn cố định vế phải của mục tiêu tối ưu, tức $r_{t}+Q_{\pi}\left(s_{t+1}, \pi\left(s_{t+1}\right)\right)$, thông qua việc thay đổi tham số mạng ở vế trái của mục tiêu tối ưu để hồi quy. Với phát lại kinh nghiệm, nó sẽ xây dựng một bộ đệm phát lại để lưu nhiều dữ liệu, nội dung của mỗi mẫu dữ liệu gồm: trạng thái $s_t$, hành động thực hiện $a_t$, phần thưởng nhận được $r_t$, trạng thái tiếp theo $s_{t+1}$. Ta dùng $\pi$ tương tác với môi trường nhiều lần, đặt toàn bộ dữ liệu thu thập được vào bộ đệm phát lại. Khi bộ đệm phát lại "đầy", nó sẽ tự động xóa dữ liệu vào bộ đệm sớm nhất. Khi huấn luyện, mỗi vòng lặp đều có một lô tương ứng (giống như khi ta huấn luyện mạng thông thường, có được qua lấy mẫu), rồi dùng dữ liệu trong lô này để cập nhật hàm Q. Tức là khi lấy mẫu và huấn luyện, hàm Q sẽ dùng đến dữ liệu kinh nghiệm trong quá khứ, đồng thời cũng có thể loại bỏ tương quan giữa các mẫu.

**6-3** Người phỏng vấn thân thiện: Mạng Q sâu và Q-learning có điểm giống và khác nhau gì?

Nhìn chung, từ tên gọi đã thấy, giá trị mục tiêu và cách cập nhật giá trị của hai thuật toán về cơ bản giống nhau. Nhưng có các điểm khác như sau:

(1) Trước hết, mạng Q sâu kết hợp Q-learning với học sâu, dùng mạng sâu để xấp xỉ hàm giá trị hành động, còn Q-learning thì dùng bảng để lưu trữ.

(2) Mạng Q sâu dùng mẹo phát lại kinh nghiệm, lấy mẫu ngẫu nhiên từ dữ liệu lịch sử, còn Q-learning dùng trực tiếp dữ liệu của trạng thái tiếp theo để học.

**6-4** Người phỏng vấn thân thiện: Chính sách ngẫu nhiên và chính sách tất định khác nhau thế nào?

Chính sách ngẫu nhiên (stochastic policy) được biểu diễn là phân phối giá trị của hành động ở một trạng thái nào đó, chính sách tất định (deterministic policy) ở mỗi trạng thái chỉ có một hành động xác định để chọn. Xét từ góc độ entropy, entropy của chính sách tất định bằng 0, không có bất kỳ tính ngẫu nhiên nào. Chính sách ngẫu nhiên có lợi cho việc khám phá vừa phải, chính sách tất định không có lợi cho việc khám phá.

**6-5** Người phỏng vấn thân thiện: Tại sao không phá vỡ tương quan dữ liệu thì hiệu quả huấn luyện mạng nơ-ron lại không tốt?

Trong mạng nơ-ron thường dùng phương pháp giảm gradient ngẫu nhiên (stochastic gradient descent). Ngẫu nhiên nghĩa là ta chọn ngẫu nhiên một số mẫu để ước lượng gradient theo cách tăng dần, ví dụ phương pháp huấn luyện theo lô thường dùng. Nếu các mẫu có tương quan, nghĩa là hai lô trước sau rất có thể cũng tương quan, thì gradient ước lượng được cũng sẽ thể hiện một mức tương quan nào đó. Trong điều kiện cực đoan, ước lượng gradient phía sau có thể triệt tiêu ước lượng gradient phía trước, khiến việc huấn luyện khó hội tụ.
