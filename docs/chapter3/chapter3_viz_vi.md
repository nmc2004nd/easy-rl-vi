# Chương 3 · Mô phỏng

Các thuật toán của chương được chạy từng bước ngay trên trang, kèm phép tính bằng số thật. Mỗi mô phỏng cũng nằm dưới hình tương ứng trong bài đọc.

## Sarsa và Q-learning từng bước

<small class="viz-ref">Mục 3.2–3.4 · hình 3.9, 3.10, 3.16, 3.29–3.34</small>

Bảng $Q$ 4 tam giác mỗi ô, phép cập nhật bằng số thật; vách đá và kho báu; hệ số chiết khấu $\gamma$ trên đường đi.

<iframe class="viz-frame" src="viz/td-control.html?embed" title="Mô phỏng: Sarsa và Q-learning từng bước" loading="lazy"></iframe>

## TD n bước

<small class="viz-ref">Mục 3.3.2 · hình 3.18, (3.2)</small>

Ô nào được cập nhật sau một tập với $n = 1, 2, 4, 8, \infty$; chọn $n$ nào cho sai số nhỏ nhất.

<iframe class="viz-frame" src="viz/nstep-td.html?embed" title="Mô phỏng: TD n bước" loading="lazy"></iframe>

## Monte Carlo điều khiển

<small class="viz-ref">Mục 3.4 · hình 3.25, 3.26</small>

Sinh tập rồi quét ngược $G \leftarrow \gamma G + r$; khởi đầu khám phá (lần thăm đầu tiên) và $\varepsilon$-tham lam.

<iframe class="viz-frame" src="viz/mc-control.html?embed" title="Mô phỏng: Monte Carlo điều khiển" loading="lazy"></iframe>
