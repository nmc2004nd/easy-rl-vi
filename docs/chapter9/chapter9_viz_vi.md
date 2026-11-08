# Chương 9 · Mô phỏng

Các thuật toán của chương được chạy từng bước ngay trên trang, kèm phép tính bằng số thật. Mỗi mô phỏng cũng nằm dưới hình tương ứng trong bài đọc.

## A2C từng bước

<small class="viz-ref">Mục 9.3 · hình 9.4, (9.2)</small>

Nhà phê bình $V(s)$ và diễn viên $\pi(a \mid s)$ cập nhật sau mỗi bước bằng $\delta$; so sánh với REINFORCE trên cùng lưới.

<iframe class="viz-frame" src="viz/a2c.html?embed" title="Mô phỏng: A2C từng bước" loading="lazy"></iframe>

## A3C: các Ảnh phân thân

<small class="viz-ref">Mục 9.4 · hình 9.7</small>

Nhiều tiến trình bất đồng bộ cùng học một mạng toàn cục; gradient cũ bao nhiêu phiên bản; 1, 2, 4, 8 tiến trình.

<iframe class="viz-frame" src="viz/a3c.html?embed" title="Mô phỏng: A3C: các Ảnh phân thân" loading="lazy"></iframe>
