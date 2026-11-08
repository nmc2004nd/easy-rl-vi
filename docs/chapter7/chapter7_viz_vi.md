# Chương 7 · Mô phỏng

Các thuật toán của chương được chạy từng bước ngay trên trang, kèm phép tính bằng số thật. Mỗi mô phỏng cũng nằm dưới hình tương ứng trong bài đọc.

## Thiên lệch do max

<small class="viz-ref">Mục 7.1 · hình 7.1–7.2</small>

Q-learning và Q-learning kép từng bước trên ví dụ 6.7 của Sutton & Barto; vì sao $\max$ trên ước lượng nhiễu làm hành động tồi trông tốt.

<iframe class="viz-frame" src="viz/maxbias.html?embed" title="Mô phỏng: Thiên lệch do max" loading="lazy"></iframe>

## Rainbow thu nhỏ trên CartPole

<small class="viz-ref">Mục 7.1–7.4, 7.7 · hình 7.11</small>

Bật/tắt DQN kép, đối đầu, phát lại ưu tiên, nhiều bước; ước lượng $Q$ và giá trị thật; bỏ từng thành phần.

<iframe class="viz-frame" src="viz/rainbow-mini.html?embed" title="Mô phỏng: Rainbow thu nhỏ trên CartPole" loading="lazy"></iframe>
