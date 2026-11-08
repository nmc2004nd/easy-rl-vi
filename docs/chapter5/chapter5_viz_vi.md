# Chương 5 · Mô phỏng

Các thuật toán của chương được chạy từng bước ngay trên trang, kèm phép tính bằng số thật. Mỗi mô phỏng cũng nằm dưới hình tương ứng trong bài đọc.

## PPO từng bước

<small class="viz-ref">Mục 5.2 · (5.7), (5.8)</small>

Lấy mẫu một lô, $K$ epoch trên cùng lô với tỉ số $r_t$ và mẫu bị cắt; PPO-clip, PPO-penalty với $\beta$ thích nghi; so sánh hiệu quả dữ liệu với REINFORCE.

<iframe class="viz-frame" src="viz/ppo.html?embed" title="Mô phỏng: PPO từng bước" loading="lazy"></iframe>

## Mục tiêu thay thế và vùng tin cậy

<small class="viz-ref">Mục 5.2 · TRPO</small>

Bản đồ cải thiện thật và mục tiêu thay thế cạnh nhau; đường viền $\mathrm{KL} = \delta$; không cắt, PPO-clip, PPO-penalty, TRPO đi đâu sau $K$ epoch.

<iframe class="viz-frame" src="viz/ppo-trust.html?embed" title="Mô phỏng: Mục tiêu thay thế và vùng tin cậy" loading="lazy"></iframe>
