# Bản chất của mô hình thế giới

Gần đây Genie3 rất nổi, nhưng khái niệm mô hình thế giới (world model) với mọi người vẫn còn khá mơ hồ, có người cho rằng mô hình sinh (generative model) chính là mô hình thế giới. Nhưng hãy nhìn lại định nghĩa mô hình thế giới sớm nhất, tức định nghĩa được nhắc đến trong bài báo Genie1 "Genie: Generative Interactive Environments": "Môi trường tương tác sinh (generative interactive environment) có thể được xem là một loại mô hình thế giới, chúng có thể dự đoán khung hình tiếp theo với điều kiện cho trước hành động đầu vào". Từ đó có thể thấy, mô hình sinh ≠ mô hình thế giới. Tiếp theo xin giới thiệu với mọi người mô hình thế giới trong mắt những người làm học tăng cường.

<div align=center> <img width="550" src="../img/ch16/image 1.png"/> </div> <div align=center></div>

## Tại sao lại là mô hình thế giới?

**Dùng mô hình thế giới có thể thay thế môi trường để huấn luyện, ta có thể huấn luyện tác tử hoàn toàn trong môi trường "giấc mơ" được mô phỏng, mà không cần tương tác với môi trường thực**. Cách làm này mang lại rất nhiều lợi ích. Ví dụ, chạy một game engine nặng về tính toán cần dùng lượng lớn tài nguyên tính toán để kết xuất (render) trạng thái trò chơi thành khung hình, hoặc tính các nội dung vật lý không liên quan trực tiếp đến trò chơi. Có thể ta không muốn lãng phí tài nguyên tính toán trong môi trường thực để huấn luyện tác tử, mà có thể huấn luyện tác tử nhiều lần trong môi trường mô phỏng của nó. Chi phí huấn luyện tác tử trong thế giới thực cao hơn, vì vậy mô hình thế giới được huấn luyện dần để mô phỏng thực tế có thể giúp chuyển chính sách sang thế giới thực.

<div align=center> <img width="550" src="../img/ch16/image 2.png"/> </div> <div align=center></div>

## Mô hình thế giới là gì?

Khái niệm mô hình thế giới sớm nhất đến từ bài báo "World Models" của David Ha và cha đẻ của LSTM Jürgen Schmidhuber, được trình bày Oral tại NIPS 2018. Mô hình thế giới mà bài báo này đưa ra gồm 3 phần sau:

- **Mô hình V (Variational Autoencoder, VAE - bộ tự mã hóa biến phân)**: đây là phần cảm nhận thị giác của tác tử (agent), dùng để nén khung hình nhiều chiều (như ảnh 2D từ môi trường trò chơi) thành biểu diễn tiềm ẩn (latent) ít chiều. Mô hình này rất quan trọng để tác tử học được biểu diễn có ý nghĩa, trừu tượng từ dữ liệu đầu vào thô.

<div align=center> <img width="550" src="../img/ch16/image 3.png"/> </div> <div align=center></div>

- **Mô hình M (MDN-RNN)** có tác dụng dự đoán tương lai, cụ thể, mô hình M dựa vào vectơ tiềm ẩn (latent vector) $z_t$, trạng thái ẩn (hidden state) $h_t$ và hành động $a_t$ ở thời điểm hiện tại $t$ để dự đoán vectơ tiềm ẩn ở thời điểm tiếp theo $z_{t+1}$. Nó dùng cách kết hợp **mạng mật độ hỗn hợp (Mixture Density Network, MDN)** với **mạng nơ-ron hồi quy (Recurrent Neural Network, RNN)**, đưa ra phân phối xác suất của vectơ tiềm ẩn $z$ tiếp theo. Tham số nhiệt độ $\tau$ dùng để điều khiển độ bất định của mô hình.

$$
P\left(z_{t+1} \mid a_t, z_t, h_t\right)
$$

<div align=center> <img width="550" src="../img/ch16/image 4.png"/> </div> <div align=center></div>

- **Mô hình C (Controller, bộ điều khiển)** dùng biểu diễn từ mô hình V và mô hình M để chọn hành động phù hợp. Mục đích của bộ điều khiển là tối đa hóa phần thưởng tích lũy kỳ vọng. C là một mô hình tuyến tính một tầng đơn giản, nó ánh xạ trực tiếp $z_t$ và $h_t$ thành hành động $a _t$ ở mỗi bước thời gian, $ \left[z_t h_t\right] $ là ghép nối $z_t$ và $h_t$ lại với nhau

$$
a_t=W_c\left[z_t h_t\right]+b_c
$$

Đặt các mô hình V, M, C lại với nhau, **quy trình vận hành tổng thể** là: ở mỗi bước thời gian $t$, quan sát thô được đưa vào V, đầu ra là $z_t $. Đầu vào của C là sự ghép nối giữa vectơ tiềm ẩn $z_t $ và trạng thái ẩn $h_t $ của M. Tiếp theo, C đưa ra một vectơ hành động $a_t $ dùng để điều khiển chuyển động, và sẽ ảnh hưởng đến môi trường. Tiếp theo, M lấy $z_t $ hiện tại và hành động $a_t $ làm đầu vào, cập nhật trạng thái ẩn của chính nó, sinh ra $h_{t+1} $. Đáng chú ý là, trong bài báo, mô hình thế giới được huấn luyện bằng các lượt chạy thử (rollouts) thu thập được thông qua việc tương tác với môi trường bằng chính sách ngẫu nhiên.

<div align=center> <img width="550" src="../img/ch16/image 5.png"/> </div> <div align=center></div>

Khai triển theo bước thời gian, cấu trúc của mô hình thế giới như hình dưới đây.

<div align=center> <img width="550" src="../img/ch16/image 6.png"/> </div> <div align=center></div>



Bài báo gốc có cung cấp demo mô hình thế giới tương ứng: [https://worldmodels.github.io/](https://worldmodels.github.io/), mọi người có thể chơi thử~



Cũng hoan nghênh mọi người xem các paper liên quan đến mô hình thế giới trên trang cá nhân của tôi ([https://qiwang067.github.io/](https://qiwang067.github.io/)), cuối cùng xin quảng bá Workshop "**Embodied World Models for Decision Making**" mà chúng tôi tổ chức tại NeurIPS ([https://embodied-world-models.github.io/](https://embodied-world-models.github.io/)), Philip Ball — **người đóng góp cốt lõi của Genie 3** — cũng sẽ có bài nói (Talk), hoan nghênh mọi người tham gia, gửi bài~, hy vọng bài viết này có thể giúp mọi người hiểu về mô hình thế giới.

<div align=center> <img width="550" src="../img/ch16/image 7.png"/> </div> <div align=center></div>
