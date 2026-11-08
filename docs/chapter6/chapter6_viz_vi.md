# Chương 6 · Mô phỏng

Các thuật toán của chương được chạy từng bước ngay trên trang, kèm phép tính bằng số thật. Mỗi mô phỏng cũng nằm dưới hình tương ứng trong bài đọc.

## DQN từng bước

<small class="viz-ref">Mục 6.6 · hình 6.14</small>

Mạng nơ-ron nhỏ nhận tọa độ ô; bộ đệm phát lại, lô, mục tiêu $y = r + \gamma\max_a\hat Q(s', a)$; mạng mục tiêu chỉ đổi khi sao chép.

<iframe class="viz-frame" src="viz/dqn.html?embed" title="Mô phỏng: DQN từng bước" loading="lazy"></iframe>

## DQN trên CartPole

<small class="viz-ref">Mục 6.3–6.6</small>

Huấn luyện ngay trong trình duyệt; bật/tắt phát lại kinh nghiệm và mạng mục tiêu; so sánh nhiều lần chạy.

<iframe class="viz-frame" src="viz/dqn-cartpole.html?embed" title="Mô phỏng: DQN trên CartPole" loading="lazy"></iframe>
