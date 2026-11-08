# Chương 4 · Mô phỏng

Các thuật toán của chương được chạy từng bước ngay trên trang, kèm phép tính bằng số thật. Mỗi mô phỏng cũng nằm dưới hình tương ứng trong bài đọc.

## REINFORCE từng bước

<small class="viz-ref">Mục 4.3 · hình 4.14, 4.20</small>

sample() → tính $G_t$ ngược → learn() trên lưới 4×4; chính sách softmax mỗi ô; so sánh $R(\tau)$, phần thưởng từ bước $t$, $G_t$ và đường cơ sở.

<iframe class="viz-frame" src="viz/reinforce.html?embed" title="Mô phỏng: REINFORCE từng bước" loading="lazy"></iframe>

## Gradient lấy mẫu

<small class="viz-ref">Mục 4.1–4.2.1 · (4.4)</small>

Bản đồ $\bar R_\theta$, gradient thật và các ước lượng từ $N$ quỹ đạo; vì sao cần nhiều mẫu và đường cơ sở.

<iframe class="viz-frame" src="viz/pg-sample.html?embed" title="Mô phỏng: Gradient lấy mẫu" loading="lazy"></iframe>
