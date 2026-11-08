# Chương 2 · Mô phỏng

Các thuật toán của chương được chạy từng bước ngay trên trang, kèm phép tính bằng số thật. Mỗi mô phỏng cũng nằm dưới hình tương ứng trong bài đọc.

## Lợi tức và giá trị trong MRP

<small class="viz-ref">Mục 2.2 · hình 2.3–2.7</small>

Lấy mẫu quỹ đạo, tính $G$ từng số hạng, rồi so sánh Monte Carlo, quy hoạch động và nghiệm giải tích $V=(I-\gamma P)^{-1}R$.

<iframe class="viz-frame" src="viz/mrp-return.html?embed" title="Mô phỏng: Lợi tức và giá trị trong MRP" loading="lazy"></iframe>

## Đánh giá chính sách

<small class="viz-ref">Mục 2.3.9 · hình 2.18–2.20</small>

Lặp (2.18) trên lưới 4×4 từng ô một; so sánh cập nhật đồng bộ và tại chỗ.

<iframe class="viz-frame" src="viz/policy-eval.html?embed" title="Mô phỏng: Đánh giá chính sách" loading="lazy"></iframe>

## Lặp chính sách

<small class="viz-ref">Mục 2.3.11 · hình 2.21</small>

Đánh giá ⇄ cải thiện luân phiên; xem bảng $Q(s,a)$ và ô nào đổi hướng ở mỗi lần cải thiện.

<iframe class="viz-frame" src="viz/policy-iter.html?embed" title="Mô phỏng: Lặp chính sách" loading="lazy"></iframe>

## Lặp giá trị

<small class="viz-ref">Mục 2.3.12 · hình 2.23</small>

Giá trị lan từ đích như làn sóng $V_1\to V_7$; vì sao chính sách giữa chừng vô nghĩa; rút trích chính sách.

<iframe class="viz-frame" src="viz/value-iter.html?embed" title="Mô phỏng: Lặp giá trị" loading="lazy"></iframe>

## Sân chơi thế giới lưới

<small class="viz-ref">Mục 2.3.13 · hình 2.24–2.28</small>

Tự vẽ bản đồ, chỉnh $\gamma$, xác suất trượt, thưởng mỗi bước; giải bằng lặp chính sách hoặc lặp giá trị.

<iframe class="viz-frame" src="viz/gridworld.html?embed" title="Mô phỏng: Sân chơi thế giới lưới" loading="lazy"></iframe>
