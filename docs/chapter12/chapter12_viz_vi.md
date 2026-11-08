# Chương 12 · Mô phỏng

Các thuật toán của chương được chạy từng bước ngay trên trang, kèm phép tính bằng số thật. Mỗi mô phỏng cũng nằm dưới hình tương ứng trong bài đọc.

## DDPG trên con lắc

<small class="viz-ref">Mục 12.2 · hình 12.5–12.8</small>

Bốn mạng nơ-ron thật; bản đồ giám khảo $Q_w(\vartheta, a)$ và diễn viên $\mu_\theta$; phép tính từng lần cập nhật.

<iframe class="viz-frame" src="viz/ddpg.html?embed" title="Mô phỏng: DDPG trên con lắc" loading="lazy"></iframe>

## DDPG và TD3: bật/tắt từng mẹo

<small class="viz-ref">Mục 12.3 · hình 12.9–12.10</small>

Q kép có cắt, cập nhật trễ, làm trơn; ước lượng $Q$ so với giá trị thật; bỏ từng mẹo.

<iframe class="viz-frame" src="viz/td3.html?embed" title="Mô phỏng: DDPG và TD3: bật/tắt từng mẹo" loading="lazy"></iframe>
