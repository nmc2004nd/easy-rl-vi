<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Giấy phép Creative Commons" style="border-width:0" src="https://img.shields.io/badge/license-CC%20BY--NC--SA%204.0-lightgrey" /></a>

# Sách Nấm EasyRL — Bản dịch tiếng Việt (không chính thức)

Đây là bản dịch tiếng Việt **không chính thức** của [蘑菇书 EasyRL (Sách Nấm EasyRL)](https://github.com/datawhalechina/easy-rl), giáo trình nhập môn học tăng cường (Reinforcement Learning) do cộng đồng [Datawhale](https://github.com/datawhalechina) biên soạn.

Bản dịch được thực hiện **với mục đích học tập cá nhân, phi thương mại**.

📖 **Đọc online:** https://nmc2004nd.github.io/easy-rl-vi/

## Lời xin phép và ghi công

Toàn bộ nội dung gốc (văn bản, hình ảnh, mã nguồn, bài tập) thuộc về các tác giả của Sách Nấm EasyRL và cộng đồng Datawhale. Người dịch không sở hữu và không nhận bất kỳ phần nội dung gốc nào là của mình.

Bản dịch này được làm và chia sẻ theo các điều khoản của giấy phép [CC BY-NC-SA 4.0](http://creativecommons.org/licenses/by-nc-sa/4.0/) mà tác phẩm gốc sử dụng:

- **BY (Ghi công):** ghi rõ nguồn và tác giả gốc, như dưới đây.
- **NC (Phi thương mại):** bản dịch không được dùng cho mục đích thương mại.
- **SA (Chia sẻ tương tự):** bản dịch được phát hành dưới cùng giấy phép CC BY-NC-SA 4.0.

Người dịch trân trọng **xin phép các tác giả** được dịch và chia sẻ giáo trình này để phục vụ việc học. Nếu các tác giả hoặc Datawhale không đồng ý, hoặc muốn bản dịch được điều chỉnh, xin hãy liên hệ qua [Issues của repo này](https://github.com/nmc2004nd/easy-rl-vi/issues). Người dịch sẽ chỉnh sửa hoặc gỡ bản dịch theo yêu cầu.

### Tác giả gốc

| Tác giả | Đóng góp |
|---|---|
| [Qi Wang (王琦)](https://github.com/qiwang067) | Thiết kế giáo trình (chương 1–12) |
| [Yiyuan Yang (杨毅远)](https://github.com/yyysjz1997) | Thiết kế bài tập và chương 13 |
| [John Jim (江季)](https://github.com/JohnJim0816) | Thực hành thuật toán |

Cùng các tác giả của từng bài đọc bài báo trong thư mục `papers/` (tên mỗi người được ghi ở cuối bài).

Nguồn tham khảo của giáo trình gốc:

- Chương 4–11: [Deep Reinforcement Learning — Hung-yi Lee (李宏毅)](http://speech.ee.ntu.edu.tw/~tlkagk/courses_MLDS18.html)
- Chương 1–2: [Intro to RL — Bolei Zhou (周博磊)](https://github.com/zhoubolei/introRL)
- Chương 3 và 12: [世界冠军带你从零实践强化学习 — Li Kejiao (李科浇)](https://aistudio.baidu.com/aistudio/education/group/info/1335)

Repo gốc: https://github.com/datawhalechina/easy-rl · Bản online gốc: https://datawhalechina.github.io/easy-rl/

Nếu thấy giáo trình hữu ích, hãy ủng hộ tác giả bằng cách ⭐ repo gốc hoặc mua [sách giấy](https://item.jd.com/13075567.html).

## Nội dung bản dịch

| Thư mục | Nội dung |
|---|---|
| `docs/` | 16 chương, bài tập và từ khóa, các dự án thực hành, bảng đính chính (đọc trên trang web) |
| `papers/` | 20 bài đọc bài báo về DQN và Policy Gradient |
| `notebooks/` | 16 notebook Jupyter cài đặt thuật toán (đã dịch chú thích, markdown và log đầu ra) |

## Quy ước dịch

- Thuật ngữ chuyên ngành được dịch sang tiếng Việt và giữ tiếng Anh trong ngoặc ở lần đầu xuất hiện, ví dụ: tác tử (agent), chính sách (policy), hàm giá trị (value function), lợi tức (return).
- Công thức, hình ảnh, đường dẫn và mã nguồn được giữ nguyên; chỉ dịch chú thích và chuỗi hiển thị trong code.
- Một số lỗi rõ ràng trong bản gốc (lỗi đánh máy, công thức, đánh số hình) được sửa và đánh dấu bằng **"Ghi chú của người dịch"**.
- Tên người Trung Quốc được ghi bằng phiên âm kèm chữ Hán, ví dụ: Wu Wenhao (吴文昊).
- Chữ trong hình ảnh (ví dụ biểu đồ đã vẽ sẵn) vẫn là tiếng Trung vì không thể chỉnh sửa.

Bản dịch có thể còn sai sót. Rất mong nhận được góp ý qua Issues.

## Đọc trên máy (không cần mạng sau khi tải về)

```bash
git clone https://github.com/nmc2004nd/easy-rl-vi.git
cd easy-rl-vi/docs
python3 -m http.server 3000
# mở http://localhost:3000
```

## Giấy phép

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Giấy phép Creative Commons" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />Bản dịch này, giống như tác phẩm gốc, được cấp phép theo <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Ghi công – Phi thương mại – Chia sẻ tương tự 4.0 Quốc tế (CC BY-NC-SA 4.0)</a>. Xem file [LICENSE](LICENSE).
