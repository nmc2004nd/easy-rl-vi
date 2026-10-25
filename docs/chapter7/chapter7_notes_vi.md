# Chương 7 Ghi chú trọng tâm

> Ghi chú của người dịch: đây là bản ghi chú tổng hợp kiến thức trọng tâm của [chương 7](chapter7/chapter7_vi), do người dịch biên soạn để đọc lại nhanh. Chương lý thuyết dẫn dắt từ ví dụ đến khái niệm; trang này chỉ giữ khái niệm, công thức, so sánh và chỗ dễ nhầm. Các ý không có trong sách được ghi rõ.

## 1. Bức tranh chung

Chương 7 là **6 cải tiến của DQN**, mỗi cái sửa một điểm yếu; gộp tất cả lại thành **Rainbow**.

| Kỹ thuật | Sửa vấn đề gì | Thay đổi ở đâu |
|---|---|---|
| **DQN kép** (double DQN, DDQN) | $Q$ bị **ước lượng quá cao** | cách tính **mục tiêu** |
| **DQN đối đầu** (dueling DQN) | dùng dữ liệu kém hiệu quả | **kiến trúc mạng**: $Q=V+A$ |
| **Phát lại ưu tiên** (PER) | mẫu khó học bị lấy ít | **cách lấy mẫu** từ bộ đệm |
| **Nhiều bước** (multi-step) | TD dựa quá nhiều vào ước lượng | mục tiêu dùng **$N$ phần thưởng thật** |
| **Mạng nhiễu** (noisy net) | $\varepsilon$-tham lam khám phá lộn xộn | nhiễu vào **tham số** thay vì hành động |
| **Hàm Q phân phối** | kỳ vọng làm mất thông tin | mạng ra **phân phối** phần thưởng |

## 2. DQN kép (DDQN)

**Vấn đề (hình 7.1):** $Q$ do DQN ước lượng **cao hơn nhiều** so với phần thưởng thật, ở mọi trò chơi.

**Vì sao:** mục tiêu lấy $\max$ trên các ước lượng **có sai số**:

$$
Q(s_t,a_t)\longleftrightarrow r_t+\max_a Q(s_{t+1},a) \tag{7.1}
$$

Bốn hành động thật ra ngang nhau, nhưng mạng có sai số; hành động nào lỡ bị ước lượng cao nhất thì đúng nó được $\max$ chọn → mục tiêu **luôn bị kéo lên**.

**Cách giải:** **tách** mạng **chọn** hành động và mạng **tính giá trị**:

$$
\begin{aligned}
Q(s_t,a_t)\longleftrightarrow\ & r_t+Q'\big(s_{t+1},a^*\big)\\
\text{với }\ & a^*=\arg\max_a Q(s_{t+1},a)
\end{aligned} \tag{7.2}
$$

| | Chọn hành động $\arg\max_a$ | Tính giá trị |
|---|---|---|
| DQN | mạng mục tiêu $Q'$ | mạng mục tiêu $Q'$ |
| **DDQN** | mạng **đang cập nhật** $Q$ | mạng **mục tiêu** $Q'$ |

💡 $Q$ chọn nhầm hành động bị ước lượng cao? $Q'$ không cao theo thì giá trị vẫn bình thường. $Q'$ ước lượng cao một hành động? Miễn $Q$ không chọn nó là được.

⭐ **Thay đổi nhỏ nhất:** không thêm mạng (DQN vốn đã có hai mạng), gần như không thêm tính toán. Chỉ chọn được một kỹ thuật thì thường chọn DDQN.

## 3. DQN đối đầu (dueling DQN)

Chỉ đổi **kiến trúc**: mạng tách hai nhánh rồi cộng lại.

$$
Q(\boldsymbol s,\boldsymbol a)=V(\boldsymbol s)+A(\boldsymbol s,\boldsymbol a)
$$

- $V(\boldsymbol s)$: **một số** cho mỗi trạng thái.
- $A(\boldsymbol s,\boldsymbol a)$: **một vectơ**, một giá trị cho mỗi hành động.

**Lợi ích (hình 7.4):** muốn tăng hai ô Q của một trạng thái, mạng có thể chỉ tăng $V(s)$ → **cả ô thứ ba** (hành động chưa lấy mẫu được) cũng tăng theo. Không cần lấy mẫu đủ mọi cặp $(s,a)$ → **dùng dữ liệu hiệu quả hơn**.

⚠️ **Vấn đề:** mạng có thể học $V=0$, $A=Q$ → chẳng khác DQN. **Cách giải:** ràng buộc $A$ để mạng phải dùng $V$, ví dụ ép **tổng $A$ trên các hành động bằng 0** (chuẩn hóa về trung bình 0).

Ví dụ hình 7.5: $A=[7,3,2]^{\mathrm T}$, trung bình $4$ → $[3,-1,-2]^{\mathrm T}$; cộng $V=1$ → $Q=[4,0,-1]^{\mathrm T}$.

Viết gộp thành công thức (cách viết của người dịch):

$$
Q(s,a)=V(s)+\Big(A(s,a)-\frac{1}{|\mathcal A|}\sum_{a'}A(s,a')\Big)
$$

💡 Bước trừ trung bình **không có tham số**, nằm ngay trong mạng và lan truyền ngược bình thường.

## 4. Phát lại kinh nghiệm ưu tiên (PER)

- DQN lấy mẫu **đồng đều** từ bộ đệm. PER cho mẫu có **sai số TD lớn** (mạng đoán còn sai nhiều, tức "khó học") **xác suất được lấy cao hơn**.
- PER thay đổi **cả hai**: phân phối lấy mẫu **và** cách cập nhật tham số.

⚠️ **Ghi chú của người dịch:** "đổi cách cập nhật" là vì lấy mẫu không đều làm lệch phân phối dữ liệu; bài báo PER bù lại bằng **trọng số importance sampling** cho từng mẫu (cùng ý tưởng với chương 5).

## 5. Nhiều bước: cân bằng MC và TD

Lưu $N$ bước liền, mục tiêu dùng **phần thưởng thật** của $N$ bước rồi mới bootstrapping bằng $\hat Q$:

$$
Q(s_t,a_t)\longleftrightarrow\sum_{t'=t}^{t+N}r_{t'}+\hat Q\big(s_{t+N+1},a_{t+N+1}\big)
$$

So với TD một bước:

- **Ưu:** nhiều phần thưởng thật hơn → phần **ước lượng** ít ảnh hưởng hơn.
- **Nhược:** cộng nhiều $r$ → **phương sai** lớn hơn (giống MC).

💡 $N$ là **siêu tham số**, chỉnh để cân bằng giữa phương sai và sai số của $Q$ ước lượng.

⚠️ **Ghi chú của người dịch:** công thức trong sách bỏ qua chiết khấu. Dạng có $\gamma$:

$$
\sum_{k=0}^{N}\gamma^{k}r_{t+k}+\gamma^{N+1}\max_a\hat Q(s_{t+N+1},a)
$$

## 6. Mạng nhiễu (noisy net)

Thêm **nhiễu Gauss vào tham số** của mạng Q, được **hàm Q nhiễu** $\tilde Q$, rồi chọn hành động:

$$
a=\arg\max_a\tilde Q(s,a)
$$

⭐ **Nhiễu lấy mẫu một lần đầu mỗi tập, giữ cố định suốt tập.**

| | $\varepsilon$-tham lam | Mạng nhiễu |
|---|---|---|
| Nhiễu thêm vào | **không gian hành động** | **không gian tham số** |
| Cùng trạng thái, trong cùng tập | có thể ra **hành động khác nhau** | luôn ra **cùng hành động** |
| Kiểu khám phá | thử bừa ngẫu nhiên | **phụ thuộc trạng thái**, có hệ thống |

💡 Chính sách thật thì gặp cùng tình huống nên phản ứng giống nhau. Mạng nhiễu khám phá kiểu "tập này gặp $s$ thì thử đi trái, tập sau gặp $s$ thì thử đi phải".

- **OpenAI:** cộng thẳng nhiễu Gauss vào mỗi trọng số.
- **DeepMind:** nhiễu do một bộ tham số điều khiển, mạng **tự học** nên thêm nhiễu bao nhiêu.
- Hai bài báo cùng ở ICLR 2018, cùng nhấn mạnh: tham số cố định trong một tập.

## 7. Hàm Q phân phối (distributional Q-function)

$Q(s,a)$ chỉ là **kỳ vọng** của phần thưởng tích lũy. Nhiều phân phối khác nhau có **cùng trung bình** → dùng kỳ vọng thì mất thông tin.

**Cách làm (hình 7.9b):** chia khoảng giá trị (ví dụ $[-10,10]$) thành các **cột (bin)**. Với mỗi hành động, mạng ra **xác suất phần thưởng rơi vào từng cột**, tổng bằng 1.

- Khi hành động: chọn hành động có **trung bình** lớn nhất.
- Lợi ích thêm: biết **phương sai** → hai hành động trung bình ngang nhau thì chọn cái **ít rủi ro** hơn.
- Nhược: hợp lý nhưng **khó cài đặt**.

⚠️ **Dễ nhầm:** Q phân phối **không ước lượng quá cao** mà thường **ước lượng quá thấp**: khoảng đầu ra bị chặn (ví dụ tối đa 10), phần thưởng 100 bị **bỏ qua**.

## 8. Rainbow

**Rainbow = DQN + 6 kỹ thuật trên** (tính cả DQN là 7 màu). Các kỹ thuật không xung đột nhau.

- Hình 7.10 dùng **trung vị** điểm trên nhiều trò Atari, vì điểm các trò chênh nhau quá lớn, lấy trung bình thì vài trò chi phối kết quả.
- A3C (chương 9) đã có sẵn nhiều bước, nên đóng vai "nhiều bước" trong hình.

**Bỏ từng thành phần khỏi Rainbow (hình 7.11):**

| Bỏ đi | Ảnh hưởng |
|---|---|
| Nhiều bước | **rơi mạnh** |
| Phát lại ưu tiên | rơi |
| Phân phối | học không chậm hơn lúc đầu, nhưng **hội tụ ở mức kém hơn** |
| Mạng nhiễu, đối đầu | kém đi một chút |
| **DQN kép** | **gần như không đổi** |

💡 Vì sao bỏ DDQN không sao: đã có Q phân phối thì gần như không còn ước lượng quá cao, nên DDQN hết việc để làm.

## 9. Tự kiểm tra nhanh

1. Vì sao DQN ước lượng $Q$ quá cao? Giải thích bằng phép $\max$.
2. Viết mục tiêu của DDQN. Mạng nào chọn hành động, mạng nào tính giá trị?
3. Vì sao DDQN gần như không tốn thêm gì?
4. Dueling DQN tách $Q$ thế nào? Vì sao dùng dữ liệu hiệu quả hơn?
5. Vì sao phải ràng buộc $A$? Chuẩn hóa $[7,3,2]^{\mathrm T}$ về trung bình 0.
6. PER ưu tiên mẫu nào? Ngoài lấy mẫu, nó còn đổi gì?
7. Phương pháp nhiều bước được gì và mất gì so với TD một bước?
8. Mạng nhiễu khác $\varepsilon$-tham lam ở đâu? Vì sao nhiễu phải cố định trong một tập?
9. Hàm Q phân phối có lợi gì? Vì sao nó thường ước lượng quá thấp?
10. Trong Rainbow, bỏ thành phần nào hại nhất, bỏ thành phần nào gần như không sao? Vì sao?

👉 Xem trực quan: [thiên lệch do max và Q-learning kép](viz/maxbias.html ':ignore :target=_blank') · [Rainbow thu nhỏ trên CartPole](viz/rainbow-mini.html ':ignore :target=_blank').

👉 Kiểm tra trí nhớ bằng [flashcard và quiz của chương 7](review/index.html?ch=7 ':ignore :target=_self'), xem đáp án tham khảo ở [Chương 7 Bài tập](chapter7/chapter7_questions&keywords_vi), thực hành ở [Dự án 2](chapter7/project2_vi).
