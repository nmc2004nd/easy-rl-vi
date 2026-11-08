# Phụ lục Kiến thức nền toán học

> Ghi chú của người biên soạn: đây là bản tổng hợp tiếng Việt phần phụ lục (A–D) của sách *Mathematical Foundations of Reinforcement Learning* (Shiyu Zhao, 2025). Xem [giới thiệu phần này](mathrl/README_vi) để biết nguồn, và [Quy ước ký hiệu](notation_vi) cho chuẩn ký hiệu dùng chung. Ý không có trong sách được ghi rõ.

Phụ lục gom các kiến thức toán được dùng rải rác trong sách. Không cần đọc trước; nên tra khi gặp ở chương tương ứng.

| Phụ lục | Nội dung | Dùng ở |
|---|---|---|
| [A](mathrl/appendix_vi?id=phụ-lục-a-kiến-thức-xác-suất-cơ-bản) | xác suất cơ bản: có điều kiện, toàn phần, kỳ vọng, phương sai | chương 1, 2 (phương trình Bellman), mọi chương |
| [B](mathrl/appendix_vi?id=phụ-lục-b-lý-thuyết-xác-suất-theo-độ-đo) | xác suất theo lý thuyết độ đo: không gian xác suất, kỳ vọng có điều kiện là biến ngẫu nhiên, các kiểu hội tụ | chương 6, 7 ("hội tụ hầu chắc chắn") |
| [C](mathrl/appendix_vi?id=phụ-lục-c-sự-hội-tụ-của-dãy) | hội tụ của dãy tất định và dãy ngẫu nhiên: dãy đơn điệu, martingale, tựa martingale | chương 4 (lặp chính sách), chương 6 (định lý Dvoretzky) |
| [D](mathrl/appendix_vi?id=phụ-lục-d-kiến-thức-nền-về-giảm-gradient) | tính lồi và sự hội tụ của giảm gradient | chương 6 (SGD), chương 8 |

## Phụ lục A Kiến thức xác suất cơ bản

Học tăng cường dựa nặng vào lý thuyết xác suất. Dưới đây là các khái niệm và kết quả dùng thường xuyên trong sách.

### Biến ngẫu nhiên và dãy ngẫu nhiên

**Biến ngẫu nhiên (random variable).** "Biến" vì nó nhận giá trị trong một tập số; "ngẫu nhiên" vì việc nhận giá trị nào phải theo một phân phối xác suất. Biến ngẫu nhiên thường ký hiệu bằng chữ hoa, giá trị của nó bằng chữ thường: $X$ là biến ngẫu nhiên, $x$ là một giá trị $X$ có thể nhận. Sách chủ yếu xét biến ngẫu nhiên nhận **hữu hạn** giá trị; biến ngẫu nhiên có thể là vô hướng hoặc vectơ. Như biến thường, biến ngẫu nhiên có các phép toán thường: với $X$, $Y$ là biến ngẫu nhiên, tính được $X + Y$, $X + 1$, $XY$.

**Dãy ngẫu nhiên (stochastic sequence)** là một dãy các biến ngẫu nhiên. Tình huống hay gặp: thu một dãy mẫu ngẫu nhiên $\{x_i\}_{i=1}^n$ của biến $X$. Ví dụ tung xúc xắc $n$ lần, gọi $x_i$ là giá trị ở lần thứ $i$; khi đó $\{x_1, \dots, x_n\}$ là một quá trình ngẫu nhiên.

⚠️ **Dễ nhầm:** vì sao $x_i$ là biến ngẫu nhiên chứ không phải một giá trị cụ thể? Nếu dãy đã lấy được là $\{1, 6, 3, 5, \dots\}$ thì nó **không** ngẫu nhiên, vì mọi phần tử đã xác định. Nhưng nếu dùng $x_i$ để chỉ **các giá trị có thể** được lấy ra thì nó là biến ngẫu nhiên, vì nó có thể nhận bất kỳ giá trị nào trong $\{1, \dots, 6\}$. Dù viết bằng chữ thường, $x_i$ vẫn là biến ngẫu nhiên. *(ghi chú của người biên soạn)* Đây là một ngoại lệ có chủ ý so với quy tắc "chữ hoa là biến ngẫu nhiên" ở [chuẩn ký hiệu](notation_vi): sách dùng $x_k$, $s_t$, $r_{t+1}$ viết thường cho mẫu trong các thuật toán, kể cả khi phân tích chúng như biến ngẫu nhiên.

### Xác suất, xác suất đồng thời, xác suất có điều kiện

| Khái niệm | Ký hiệu | Ý nghĩa |
|---|---|---|
| Xác suất | $p(X = x)$, $p_X(x)$, viết gọn $p(x)$ | xác suất $X$ nhận giá trị $x$ |
| Xác suất đồng thời | $p(X = x, Y = y)$, viết gọn $p(x, y)$ | xác suất $X = x$ **và** $Y = y$ |
| Xác suất có điều kiện | $p(X = x \mid A = a)$, viết gọn $p(x \mid a)$ | xác suất $X = x$ **khi biết** $A = a$ |

Hai đẳng thức cơ bản:

$$
\sum_y p(x, y) = p(x), \qquad p(x, a) = p(x \mid a)\,p(a), \qquad p(x \mid a) = \frac{p(x, a)}{p(a)}.
$$

**Công thức xác suất toàn phần (law of total probability):**

$$
p(x) = \sum_a p(x, a) = \sum_a p(x \mid a)\,p(a), \qquad p(x \mid a) = \sum_y p(x, y \mid a).
$$

**Độc lập.** Hai biến ngẫu nhiên độc lập nếu giá trị của biến này không ảnh hưởng tới biến kia:

$$
p(x, y) = p(x)\,p(y), \quad\text{suy ra}\quad p(x \mid y) = p(x).
$$

**Độc lập có điều kiện.** $X$ độc lập có điều kiện với $A$ khi biết $B$ nếu

$$
p(X = x \mid A = a, B = b) = p(X = x \mid B = b).
$$

Trong học tăng cường: xét ba trạng thái liên tiếp $s_t, s_{t+1}, s_{t+2}$. $s_{t+2}$ phụ thuộc $s_{t+1}$ và cả $s_t$; nhưng **khi đã biết** $s_{t+1}$ thì $s_{t+2}$ độc lập có điều kiện với $s_t$:

$$
p(s_{t+2} \mid s_{t+1}, s_t) = p(s_{t+2} \mid s_{t+1}).
$$

Đây chính là **tính không nhớ (tính Markov)** của quá trình Markov.

**Quy tắc nhân (chain rule).** Theo định nghĩa xác suất có điều kiện:

$$
p(a, b) = p(a \mid b)\,p(b), \qquad p(a, b, c) = p(a \mid b, c)\,p(b, c) = p(a \mid b, c)\,p(b \mid c)\,p(c),
$$

nên $p(a, b \mid c) = p(a, b, c)/p(c) = p(a \mid b, c)\,p(b \mid c)$. Từ đó suy ra tính chất hay dùng:

$$
p(x \mid a) = \sum_b p(x, b \mid a) = \sum_b p(x \mid b, a)\,p(b \mid a).
$$

*(ghi chú của người biên soạn)* Đẳng thức cuối chính là bước "lấy điều kiện thêm theo hành động" khi suy ra phương trình Bellman ở mục 2.4: $p(s' \mid s) = \sum_a p(s' \mid s, a)\,\pi(a \mid s)$.

### Kỳ vọng

**Kỳ vọng (expectation, expected value, mean)** của $X$ với xác suất $p(x)$:

$$
\mathbb E[X] = \sum_x p(x)\,x.
$$

**Tính tuyến tính:**

$$
\mathbb E[X + Y] = \mathbb E[X] + \mathbb E[Y], \qquad \mathbb E[aX] = a\,\mathbb E[X].
$$

Đẳng thức thứ hai hiển nhiên theo định nghĩa. Chứng minh đẳng thức thứ nhất:

$$
\begin{aligned}
\mathbb E[X + Y] &= \sum_x\sum_y (x + y)\,p(X = x, Y = y) = \sum_x x\sum_y p(x, y) + \sum_y y\sum_x p(x, y)\\
&= \sum_x x\,p(x) + \sum_y y\,p(y) = \mathbb E[X] + \mathbb E[Y].
\end{aligned}
$$

Hệ quả: $\mathbb E\big[\sum_i a_i X_i\big] = \sum_i a_i\,\mathbb E[X_i]$. Tương tự, $\mathbb E[AX] = A\,\mathbb E[X]$ với $A \in \mathbb R^{n\times n}$ là ma trận tất định và $X \in \mathbb R^n$ là vectơ ngẫu nhiên.

*(ghi chú của người biên soạn)* Tính tuyến tính **không cần** $X$, $Y$ độc lập. Đây là lý do có thể tách $\mathbb E[R_{t+1} + \gamma G_{t+1} \mid S_t = s]$ thành hai kỳ vọng ở (2.4) dù $R_{t+1}$ và $G_{t+1}$ phụ thuộc nhau.

**Kỳ vọng có điều kiện:**

$$
\mathbb E[X \mid A = a] = \sum_x x\,p(x \mid a).
$$

**Luật kỳ vọng toàn phần (law of total expectation)**, tương tự công thức xác suất toàn phần:

$$
\mathbb E[X] = \sum_a \mathbb E[X \mid A = a]\,p(a).
$$

Chứng minh:

$$
\sum_a \mathbb E[X \mid A = a]\,p(a) = \sum_a\left[\sum_x p(x \mid a)\,x\right]p(a) = \sum_x\left[\sum_a p(x \mid a)\,p(a)\right]x = \sum_x p(x)\,x = \mathbb E[X].
$$

Luật kỳ vọng toàn phần **dùng rất thường xuyên** trong học tăng cường. Tương tự, kỳ vọng có điều kiện thỏa

$$
\mathbb E[X \mid A = a] = \sum_b \mathbb E[X \mid A = a, B = b]\,p(b \mid a).
$$

Đẳng thức này hữu ích khi suy ra phương trình Bellman; gợi ý chứng minh là quy tắc nhân $p(x \mid a, b)\,p(b \mid a) = p(x, b \mid a)$.

⚠️ **Phân biệt:** $\mathbb E[X \mid A = a]$ là **một giá trị**, còn $\mathbb E[X \mid A]$ là **một biến ngẫu nhiên** (một hàm của biến ngẫu nhiên $A$). Định nghĩa chặt chẽ $\mathbb E[X \mid A]$ cần lý thuyết xác suất chặt chẽ (phụ lục B).

### Gradient của kỳ vọng

Cho $f(X, \beta)$ là hàm vô hướng của biến ngẫu nhiên $X$ và vectơ tham số tất định $\beta$:

$$
\nabla_\beta\,\mathbb E[f(X, \beta)] = \mathbb E[\nabla_\beta f(X, \beta)].
$$

**Chứng minh.** $\mathbb E[f(X, \beta)] = \sum_x f(x, \beta)\,p(x)$, nên $\nabla_\beta\mathbb E[f(X, \beta)] = \nabla_\beta\sum_x f(x, \beta)\,p(x) = \sum_x\nabla_\beta f(x, \beta)\,p(x) = \mathbb E[\nabla_\beta f(X, \beta)]$.

*(ghi chú của người biên soạn)* Điều kiện quan trọng: **phân phối $p(x)$ không phụ thuộc $\beta$**. Khi phân phối phụ thuộc tham số (như $A \sim \pi(\cdot \mid s, \theta)$ ở gradient chính sách), không đổi chỗ được trực tiếp; đó là lý do chương 9 phải dùng mẹo log-đạo hàm.

### Phương sai, hiệp phương sai, ma trận hiệp phương sai

| Khái niệm | Định nghĩa |
|---|---|
| Phương sai | $\operatorname{var}(X) = \mathbb E[(X - \bar x)^2]$, với $\bar x = \mathbb E[X]$ |
| Hiệp phương sai | $\operatorname{cov}(X, Y) = \mathbb E[(X - \bar x)(Y - \bar y)]$ |
| Ma trận hiệp phương sai | với $X = [X_1, \dots, X_n]^T$: $\operatorname{var}(X) = \Sigma \doteq \mathbb E[(X - \bar x)(X - \bar x)^T] \in \mathbb R^{n\times n}$ |

Phần tử $(i, j)$ của $\Sigma$: $[\Sigma]_{ij} = \mathbb E[(X_i - \bar x_i)(X_j - \bar x_j)] = \operatorname{cov}(X_i, X_j)$. Tính chất: $\operatorname{var}(a) = 0$ nếu $a$ tất định; và $\operatorname{var}(AX + a) = \operatorname{var}(AX) = A\operatorname{var}(X)A^T = A\Sigma A^T$.

**Ba sự kiện hữu ích:**

- $\mathbb E[(X - \bar x)(Y - \bar y)] = \mathbb E[XY] - \mathbb E[X]\,\mathbb E[Y]$.
  *Chứng minh:* $\mathbb E[XY - X\bar y - \bar xY + \bar x\bar y] = \mathbb E[XY] - \mathbb E[X]\bar y - \bar x\,\mathbb E[Y] + \bar x\bar y = \mathbb E[XY] - \mathbb E[X]\,\mathbb E[Y]$.
- $\mathbb E[XY] = \mathbb E[X]\,\mathbb E[Y]$ nếu $X$, $Y$ độc lập.
  *Chứng minh:* $\mathbb E[XY] = \sum_x\sum_y p(x, y)\,xy = \sum_x\sum_y p(x)\,p(y)\,xy = \sum_x p(x)\,x\sum_y p(y)\,y = \mathbb E[X]\,\mathbb E[Y]$.
- $\operatorname{cov}(X, Y) = 0$ nếu $X$, $Y$ độc lập (suy ra từ hai sự kiện trên). *(ghi chú của người biên soạn: chiều ngược lại sai, hiệp phương sai bằng 0 không kéo theo độc lập.)*

## Phụ lục B Lý thuyết xác suất theo độ đo

Phần này giới thiệu ngắn gọn **lý thuyết xác suất theo độ đo (measure-theoretic probability)**, còn gọi là lý thuyết xác suất chặt chẽ; chỉ nêu các khái niệm và kết quả cơ bản. Lý thuyết này cần kiến thức lý thuyết độ đo, không trình bày ở đây.

**Có cần học phần này trước khi học học tăng cường không?** Cần, **nếu** muốn phân tích chặt chẽ sự hội tụ của các dãy ngẫu nhiên. Ví dụ, khái niệm **hội tụ hầu chắc chắn** ở chương 6 và 7 lấy từ lý thuyết này. Nếu không quan tâm tới sự hội tụ của dãy ngẫu nhiên thì có thể bỏ qua.

### Bộ ba xác suất

**Bộ ba xác suất (probability triple)**, hay **không gian xác suất**, là nền tảng của lý thuyết. Nó gồm ba thành phần $(\Omega, \mathcal F, \mathbb P)$:

| Thành phần | Tên | Ý nghĩa | Ví dụ tung xúc xắc |
|---|---|---|---|
| $\Omega$ | **không gian mẫu** | tập mọi **kết quả (outcome)** $\omega$ có thể của quá trình lấy mẫu | $\Omega = \{1, 2, 3, 4, 5, 6\}$ |
| $\mathcal F$ | **không gian biến cố** | một **σ-đại số** trên $\Omega$; mỗi phần tử $A \in \mathcal F$ là một **biến cố** | "số tung được lớn hơn 3": $A = \{\omega \in \Omega : \omega > 3\} = \{4, 5, 6\}$ |
| $\mathbb P$ | **độ đo xác suất** | ánh xạ từ $\mathcal F$ vào $[0, 1]$; $\mathbb P(A)$ là độ đo của tập $A$ | $\mathbb P(\Omega) = 1$, $\mathbb P(\emptyset) = 0$, $\mathbb P(\{4, 5, 6\}) = 1/2$ |

Một **biến cố sơ cấp** là một kết quả đơn lẻ; một biến cố có thể là biến cố sơ cấp hoặc tổ hợp nhiều biến cố sơ cấp. Ta quan tâm những biến cố như "lớn hơn 3" vì, ví dụ, xảy ra biến cố đó thì thắng trò chơi.

> **Hộp B.1: Định nghĩa σ-đại số**
>
> Một **đại số** trên $\Omega$ là một tập gồm một số tập con của $\Omega$, thỏa một số điều kiện. **σ-đại số** là một loại đại số đặc biệt và quan trọng. $\mathcal F$ là σ-đại số nếu:
>
> - $\mathcal F$ chứa $\emptyset$ và $\Omega$;
> - $\mathcal F$ đóng với phép lấy phần bù;
> - $\mathcal F$ đóng với phép hợp và giao **đếm được**.
>
> σ-đại số trên một $\Omega$ cho trước **không duy nhất**: $\mathcal F$ có thể chứa mọi tập con của $\Omega$, hoặc chỉ một số tập con, miễn thỏa ba điều kiện trên. Ba điều kiện không độc lập với nhau: nếu $\mathcal F$ chứa $\Omega$ và đóng với phần bù thì tự nhiên chứa $\emptyset$.
>
> **Ví dụ** với $\Omega = \{1, 2, 3, 4, 5, 6\}$: $\mathcal F = \{\Omega, \emptyset, \{1, 2, 3\}, \{4, 5, 6\}\}$ là một σ-đại số. Cũng có σ-đại số khác như $\{\Omega, \emptyset, \{1, 2, 3, 4, 5\}, \{6\}\}$. Với $\Omega$ hữu hạn, tập mọi tập con của $\Omega$ luôn là một σ-đại số.

*(ghi chú của người biên soạn)* Trực giác: σ-đại số là **tập những câu hỏi có–không mà ta được phép đặt** về kết quả. Với $\mathcal F = \{\Omega, \emptyset, \{1,2,3\}, \{4,5,6\}\}$, ta chỉ hỏi được "nhỏ hay lớn", không hỏi được "có phải 6 không".

### Biến ngẫu nhiên

Dựa trên bộ ba xác suất, định nghĩa chặt chẽ biến ngẫu nhiên. Gọi là "biến" nhưng thực ra chúng là **hàm** từ $\Omega$ vào $\mathbb R$: mỗi kết quả trong $\Omega$ được gán một giá trị số, $X(\omega): \Omega \to \mathbb R$.

Không phải mọi ánh xạ từ $\Omega$ vào $\mathbb R$ đều là biến ngẫu nhiên. Định nghĩa: hàm $X: \Omega \to \mathbb R$ là **biến ngẫu nhiên** nếu

$$
A = \{\omega \in \Omega \mid X(\omega) \le x\} \in \mathcal F \qquad \text{với mọi } x \in \mathbb R,
$$

tức $X(\omega) \le x$ phải là một biến cố trong $\mathcal F$ (để có thể gán xác suất cho nó).

### Kỳ vọng của biến ngẫu nhiên

Định nghĩa kỳ vọng tổng quát khá phức tạp; ở đây chỉ xét trường hợp đặc biệt nhưng quan trọng: **biến ngẫu nhiên đơn giản**, tức $X(\omega)$ chỉ nhận hữu hạn giá trị. Gọi $\mathcal X$ là tập các giá trị $X$ có thể nhận. Biến ngẫu nhiên đơn giản viết được dạng đóng:

$$
X(\omega) \doteq \sum_{x\in\mathcal X} x\,\mathbb 1_{A_x}(\omega),
$$

với $A_x = \{\omega \in \Omega \mid X(\omega) = x\} \doteq X^{-1}(x)$ và **hàm chỉ thị**

$$
\mathbb 1_{A_x}(\omega) \doteq \begin{cases} 1, & \omega \in A_x,\\ 0, & \text{ngược lại}. \end{cases} \tag{B.1}
$$

Nhiều $\omega$ có thể cùng ánh xạ vào một giá trị, nhưng một $\omega$ không ánh xạ vào nhiều giá trị. Kỳ vọng của biến ngẫu nhiên đơn giản:

$$
\mathbb E[X] \doteq \sum_{x\in\mathcal X} x\,\mathbb P(A_x), \qquad A_x = \{\omega \in \Omega \mid X(\omega) = x\}, \tag{B.2}
$$

giống nhưng hình thức hơn định nghĩa $\mathbb E[X] = \sum_x x\,p(x)$ ở phụ lục A.

**Ví dụ: kỳ vọng của hàm chỉ thị.** Hàm chỉ thị $\mathbb 1_A$ của một biến cố $A$ cũng là biến ngẫu nhiên (ánh xạ $\Omega$ vào $\{0, 1\}$), và

$$
\mathbb E[\mathbb 1_A] = \sum_{z\in\{0,1\}} z\,\mathbb P(\mathbb 1_A = z) = 0\cdot\mathbb P(\mathbb 1_A = 0) + 1\cdot\mathbb P(\mathbb 1_A = 1) = \mathbb P(A).
$$

### Kỳ vọng có điều kiện là một biến ngẫu nhiên

Kỳ vọng (B.2) ánh xạ biến ngẫu nhiên vào một số. Kỳ vọng có điều kiện thì ánh xạ biến ngẫu nhiên vào **một biến ngẫu nhiên khác**. Với $X, Y, Z$ là biến ngẫu nhiên, có ba trường hợp:

| Biểu thức | Bản chất |
|---|---|
| $\mathbb E[X \mid Y = 2]$, $\mathbb E[X \mid Y = 5]$ | một **số** cụ thể |
| $\mathbb E[X \mid Y = y]$, $y$ là biến | một **hàm của $y$** |
| $\mathbb E[X \mid Y]$, $Y$ là biến ngẫu nhiên | một **hàm của $Y$**, nên là **biến ngẫu nhiên** |

Vì $\mathbb E[X \mid Y]$ là biến ngẫu nhiên, có thể tính kỳ vọng của nó. Trường hợp thứ ba xuất hiện thường xuyên trong phân tích hội tụ dãy ngẫu nhiên (ví dụ $\mathbb E[\eta_k \mid \mathcal H_k]$ ở định lý Robbins-Monro). Định nghĩa chặt chẽ không trình bày; chỉ nêu các tính chất hữu ích.

> **Bổ đề B.1 (Tính chất cơ bản).** Với $X, Y, Z$ là biến ngẫu nhiên:
>
> - (a) $\mathbb E[a \mid Y] = a$, với $a$ là một số cho trước;
> - (b) $\mathbb E[aX + bZ \mid Y] = a\,\mathbb E[X \mid Y] + b\,\mathbb E[Z \mid Y]$;
> - (c) $\mathbb E[X \mid Y] = \mathbb E[X]$ nếu $X$, $Y$ độc lập;
> - (d) $\mathbb E[X f(Y) \mid Y] = f(Y)\,\mathbb E[X \mid Y]$;
> - (e) $\mathbb E[f(Y) \mid Y] = f(Y)$;
> - (f) $\mathbb E[X \mid Y, f(Y)] = \mathbb E[X \mid Y]$;
> - (g) nếu $X \ge 0$ thì $\mathbb E[X \mid Y] \ge 0$;
> - (h) nếu $X \ge Z$ thì $\mathbb E[X \mid Y] \ge \mathbb E[Z \mid Y]$.
>
> **Chứng minh** (một số tính chất; các tính chất khác tương tự). (a): cần chỉ ra $\mathbb E[a \mid Y = y] = a$ với mọi $y$ mà $Y$ có thể nhận; điều này hiển nhiên. (d): cần chỉ ra $\mathbb E[X f(Y) \mid Y = y] = f(y)\,\mathbb E[X \mid Y = y]$ với mọi $y$; đúng vì $\mathbb E[X f(Y) \mid Y = y] = \sum_x x f(y)\,p(x \mid y) = f(y)\sum_x x\,p(x \mid y) = f(y)\,\mathbb E[X \mid Y = y]$. $\blacksquare$

*(ghi chú của người biên soạn)* Tính chất (d)–(e) nói gọn là "**cái gì đã biết khi có $Y$ thì được đưa ra ngoài kỳ vọng như hằng số**". Đây chính là bước đưa $\Delta_k$, $\alpha_k$ ra ngoài kỳ vọng trong chứng minh định lý Dvoretzky (mục 6.3.1).

> **Bổ đề B.2.** Với $X, Y, Z$ là biến ngẫu nhiên:
>
> - (a) $\mathbb E\big[\mathbb E[X \mid Y]\big] = \mathbb E[X]$;
> - (b) $\mathbb E\big[\mathbb E[X \mid Y, Z]\big] = \mathbb E[X]$;
> - (c) $\mathbb E\big[\mathbb E[X \mid Y] \mid Y\big] = \mathbb E[X \mid Y]$.
>
> **Chứng minh.** (a): $\mathbb E[X \mid Y]$ là hàm của $Y$, ký hiệu $f(Y)$. Khi đó
> $$\mathbb E\big[\mathbb E[X \mid Y]\big] = \mathbb E[f(Y)] = \sum_y f(Y = y)\,p(y) = \sum_y\mathbb E[X \mid Y = y]\,p(y) = \sum_y\Big(\sum_x x\,p(x \mid y)\Big)p(y) = \sum_x x\sum_y p(x \mid y)\,p(y) = \sum_x x\sum_y p(x, y) = \sum_x x\,p(x) = \mathbb E[X].$$
> - (b) tương tự: $\mathbb E\big[\mathbb E[X \mid Y, Z]\big] = \sum_{y,z}\mathbb E[X \mid y, z]\,p(y, z) = \sum_{y,z}\sum_x x\,p(x \mid y, z)\,p(y, z) = \sum_x x\,p(x) = \mathbb E[X]$.
> - (c) suy ngay từ tính chất (e) của bổ đề B.1: $\mathbb E[X \mid Y]$ là hàm $f(Y)$, nên $\mathbb E\big[\mathbb E[X \mid Y] \mid Y\big] = \mathbb E[f(Y) \mid Y] = f(Y) = \mathbb E[X \mid Y]$. $\blacksquare$

### Các kiểu hội tụ ngẫu nhiên

Một lý do chính để quan tâm tới lý thuyết xác suất theo độ đo: nó mô tả chặt chẽ **sự hội tụ của dãy ngẫu nhiên**. Xét dãy ngẫu nhiên $\{X_k\} \doteq \{X_1, X_2, \dots\}$, mỗi phần tử là một biến ngẫu nhiên trên $(\Omega, \mathcal F, \mathbb P)$. Nói "$\{X_k\}$ hội tụ tới biến ngẫu nhiên $X$" phải cẩn thận, vì có nhiều kiểu hội tụ:

**Hội tụ chắc chắn (sure convergence)**, hay hội tụ khắp nơi, hội tụ từng điểm:

$$
\lim_{k\to\infty}X_k(\omega) = X(\omega) \qquad \text{với mọi } \omega \in \Omega,
$$

tương đương $A = \Omega$ với $A = \{\omega \in \Omega : \lim_k X_k(\omega) = X(\omega)\}$: giới hạn đúng tại **mọi** điểm của $\Omega$.

**Hội tụ hầu chắc chắn (almost sure convergence)**, hay hội tụ hầu khắp nơi, hội tụ với xác suất 1 (w.p.1):

$$
\mathbb P(A) = 1, \qquad A = \Big\{\omega \in \Omega : \lim_{k\to\infty}X_k(\omega) = X(\omega)\Big\}. \tag{B.3}
$$

Giới hạn đúng tại **hầu hết** các điểm của $\Omega$; tập các điểm không hội tụ có **độ đo bằng 0**. Thường viết gọn $\mathbb P(\lim_k X_k = X) = 1$, hay $X_k \xrightarrow{\text{a.s.}} X$.

**Hội tụ theo xác suất (convergence in probability):** với mọi $\varepsilon > 0$,

$$
\lim_{k\to\infty}\mathbb P(A_k) = 0, \qquad A_k = \{\omega \in \Omega : \lvert X_k(\omega) - X(\omega)\rvert > \varepsilon\}, \tag{B.4}
$$

viết gọn $\lim_k\mathbb P(\lvert X_k - X\rvert > \varepsilon) = 0$.

**Khác biệt giữa hội tụ theo xác suất và hội tụ (hầu) chắc chắn:** hội tụ (hầu) chắc chắn **trước hết xét sự hội tụ tại từng điểm** của $\Omega$, rồi mới đo tập các điểm hội tụ. Ngược lại, hội tụ theo xác suất **trước hết xét các điểm có $\lvert X_k - X\rvert > \varepsilon$** ở mỗi $k$, rồi xét xem độ đo của tập đó có về 0 khi $k \to \infty$ không.

*(ghi chú của người biên soạn)* Ví dụ kinh điển cho thấy hai kiểu khác nhau: cho $X_k$ là các biến độc lập nhận giá trị 1 với xác suất $1/k$, ngược lại bằng 0. Khi đó $\mathbb P(X_k = 1) = 1/k \to 0$ nên $X_k \to 0$ **theo xác suất**; nhưng vì $\sum_k 1/k = \infty$, theo bổ đề Borel–Cantelli thứ hai, hầu chắc chắn $X_k = 1$ xảy ra **vô hạn lần**, nên $X_k$ **không** hội tụ hầu chắc chắn về 0. (Đổi thành xác suất $1/k^2$ thì tổng hữu hạn và có hội tụ hầu chắc chắn; đây cũng là "mùi" của điều kiện $\sum a_k^2 < \infty$ ở chương 6.)

**Hội tụ theo trung bình bậc $r$ (convergence in the $r$-th mean, hay trong chuẩn $L^r$):**

$$
\lim_{k\to\infty}\mathbb E\big[\lvert X_k - X\rvert^r\big] = 0.
$$

Hay dùng nhất là $r = 1$ và $r = 2$. Lưu ý: hội tụ theo trung bình **không** tương đương với $\lim_k\mathbb E[X_k - X] = 0$ hay $\lim_k\mathbb E[X_k] = \mathbb E[X]$; những điều này chỉ nói $\mathbb E[X_k]$ hội tụ, còn phương sai có thể không.

**Hội tụ theo phân phối (convergence in distribution):** hàm phân phối tích lũy của $X_k$ là $\mathbb P(X_k \le a)$, $a \in \mathbb R$. $\{X_k\}$ hội tụ theo phân phối tới $X$ nếu

$$
\lim_{k\to\infty}\mathbb P(X_k \le a) = \mathbb P(X \le a) \qquad \text{với mọi } a \in \mathbb R,
$$

viết gọn $\lim_k\mathbb P(A_k) = \mathbb P(A)$ với $A_k \doteq \{\omega : X_k(\omega) \le a\}$, $A \doteq \{\omega : X(\omega) \le a\}$. *(ghi chú của người biên soạn: định nghĩa chuẩn chỉ đòi điều này tại những $a$ mà hàm phân phối của $X$ liên tục.)*

**Quan hệ giữa các kiểu hội tụ:**

$$
\begin{aligned}
&\text{hầu chắc chắn} \;\Rightarrow\; \text{theo xác suất} \;\Rightarrow\; \text{theo phân phối}\\
&\text{theo trung bình} \;\Rightarrow\; \text{theo xác suất} \;\Rightarrow\; \text{theo phân phối}
\end{aligned}
$$

Hội tụ hầu chắc chắn và hội tụ theo trung bình **không kéo theo nhau**.

## Phụ lục C Sự hội tụ của dãy

Các kết quả về sự hội tụ của dãy tất định và dãy ngẫu nhiên, hữu ích để phân tích sự hội tụ của các thuật toán học tăng cường như ở chương 6 và 7.

### C.1 Sự hội tụ của dãy tất định

#### Dãy đơn điệu

Xét dãy $\{x_k\} \doteq \{x_1, x_2, \dots\}$ với $x_k \in \mathbb R$ **tất định** ($x_k$ không phải biến ngẫu nhiên). Kết quả nổi tiếng nhất: **dãy không tăng và bị chặn dưới thì hội tụ**.

> **Định lý C.1 (Hội tụ của dãy đơn điệu).** Nếu dãy $\{x_k\}$
>
> - **không tăng:** $x_{k+1} \le x_k$ với mọi $k$;
> - **bị chặn dưới:** $x_k \ge \alpha$ với mọi $k$;
>
> thì $x_k$ hội tụ tới một giới hạn, là **cận dưới đúng (infimum)** của $\{x_k\}$, khi $k \to \infty$.

Tương tự, dãy không giảm và bị chặn trên thì hội tụ. Định lý này đã dùng ở chương 4 (chứng minh lặp chính sách hội tụ: $v_{\pi_k}$ không giảm và bị chặn trên bởi $v^{\ast}$) và ở phụ lục D.

#### Dãy không đơn điệu

Để phân tích dãy không đơn điệu, dùng toán tử sau. Với mọi $z \in \mathbb R$:

$$
z^+ \doteq \begin{cases} z, & z \ge 0,\\ 0, & z < 0, \end{cases} \qquad z^- \doteq \begin{cases} z, & z \le 0,\\ 0, & z > 0. \end{cases}
$$

Rõ ràng $z^+ \ge 0$, $z^- \le 0$, và $z = z^+ + z^-$ với mọi $z$.

Viết lại $x_k$ thành tổng các bước nhảy:

$$
x_k = x_k - x_{k-1} + x_{k-1} - x_{k-2} + \cdots - x_2 + x_2 - x_1 + x_1 = \sum_{i=1}^{k-1}(x_{i+1} - x_i) + x_1 \doteq S_k + x_1, \tag{C.1}
$$

với $S_k \doteq \sum_{i=1}^{k-1}(x_{i+1} - x_i)$. Tách $S_k = S_k^+ + S_k^-$, trong đó

$$
S_k^+ = \sum_{i=1}^{k-1}(x_{i+1} - x_i)^+ \ge 0, \qquad S_k^- = \sum_{i=1}^{k-1}(x_{i+1} - x_i)^- \le 0
$$

lần lượt là tổng các bước **đi lên** và tổng các bước **đi xuống**. Một số tính chất:

- $\{S_k^+ \ge 0\}$ **không giảm**, vì $S_{k+1}^+ \ge S_k^+$.
- $\{S_k^- \le 0\}$ **không tăng**, vì $S_{k+1}^- \le S_k^-$.
- Nếu $S_k^+$ bị chặn trên thì $S_k^-$ bị chặn dưới (với dãy không âm $x_k \ge 0$), vì $S_k^- + S_k^+ + x_1 = x_k \ge 0$ nên $S_k^- \ge -S_k^+ - x_1$.

> **Định lý C.2 (Hội tụ của dãy không đơn điệu).** Với mọi dãy **không âm** $\{x_k \ge 0\}$, nếu
> $$\sum_{k=1}^\infty(x_{k+1} - x_k)^+ < \infty, \tag{C.2}$$
> thì $\{x_k\}$ hội tụ khi $k \to \infty$.
>
> **Chứng minh.** Thứ nhất, (C.2) nghĩa là $S_k^+ = \sum_{i=1}^{k-1}(x_{i+1} - x_i)^+$ bị chặn trên với mọi $k$. Vì $\{S_k^+\}$ không giảm, theo định lý C.1 nó hội tụ; gọi giới hạn là $S_{\ast}^+$. Thứ hai, $S_k^+$ bị chặn kéo theo $S_k^-$ bị chặn dưới (vì $S_k^- \ge -S_k^+ - x_1$); $\{S_k^-\}$ không tăng nên theo định lý C.1 nó hội tụ, gọi giới hạn là $S_{\ast}^-$. Cuối cùng, theo (C.1) $x_k = S_k^+ + S_k^- + x_1$, nên $\{x_k\}$ hội tụ tới $S_{\ast}^+ + S_{\ast}^- + x_1$. $\blacksquare$

Định lý C.2 **tổng quát hơn** định lý C.1 vì cho phép $x_k$ tăng, miễn là **tổng các bước tăng hữu hạn** như (C.2). Trường hợp đơn điệu vẫn áp dụng được: nếu $x_{k+1} \le x_k$ thì $\sum_k(x_{k+1} - x_k)^+ = 0$, (C.2) vẫn thỏa.

**Trường hợp đặc biệt quan trọng.** Dãy không âm $\{x_k \ge 0\}$ thỏa

$$
x_{k+1} \le x_k + \eta_k.
$$

Khi $\eta_k = 0$ thì $x_{k+1} \le x_k$, dãy đơn điệu. Khi $\eta_k \ge 0$ thì dãy không đơn điệu vì $x_{k+1}$ có thể lớn hơn $x_k$, nhưng vẫn bảo đảm hội tụ dưới điều kiện nhẹ:

> **Hệ quả C.1.** Với mọi dãy không âm $\{x_k \ge 0\}$, nếu $x_{k+1} \le x_k + \eta_k$ với $\{\eta_k \ge 0\}$ thỏa $\sum_{k=1}^\infty\eta_k < \infty$, thì $\{x_k\}$ hội tụ.
>
> **Chứng minh.** Từ $x_{k+1} \le x_k + \eta_k$ có $(x_{k+1} - x_k)^+ \le \eta_k$ với mọi $k$, nên $\sum_k(x_{k+1} - x_k)^+ \le \sum_k\eta_k < \infty$. (C.2) thỏa, và sự hội tụ suy ra từ định lý C.2. $\blacksquare$

*(ghi chú của người biên soạn)* Hệ quả C.1 chính là phiên bản tất định của lập luận trong chứng minh định lý Dvoretzky: ở đó $h_k = \Delta_k^2$ có thể tăng mỗi bước nhưng "lượng tăng kỳ vọng" bị chặn bởi $\beta_k^2 C$, với $\sum\beta_k^2 < \infty$.

### C.2 Sự hội tụ của dãy ngẫu nhiên

Phụ lục B đã định nghĩa các kiểu hội tụ của dãy ngẫu nhiên, nhưng chưa nói **cách xác định** một dãy cụ thể có hội tụ hay không. Dưới đây là một lớp dãy ngẫu nhiên quan trọng: **martingale**. Nếu một dãy là martingale (hoặc một biến thể), thì sự hội tụ của nó suy ra ngay.

#### Martingale

> **Định nghĩa.** Dãy ngẫu nhiên $\{X_k\}_{k=1}^\infty$ là một **martingale** nếu $\mathbb E[\lvert X_k\rvert] < \infty$ và
> $$\mathbb E[X_{k+1} \mid X_1, \dots, X_k] = X_k \tag{C.3}$$
> hầu chắc chắn với mọi $k$.

$\mathbb E[X_{k+1} \mid X_1, \dots, X_k]$ là một biến ngẫu nhiên chứ không phải giá trị tất định; "hầu chắc chắn" là do định nghĩa của kỳ vọng loại này. Thường viết gọn $\mathbb E[X_{k+1} \mid \mathcal H_k]$, với $\mathcal H_k = \{X_1, \dots, X_k\}$ là "lịch sử" của dãy, có tên riêng là **filtration**.

**Ví dụ: bước ngẫu nhiên (random walk)**, quá trình mô tả vị trí của một điểm di chuyển ngẫu nhiên. Gọi $X_k$ là vị trí ở bước $k$. Nếu độ dịch chuyển mỗi bước có trung bình bằng 0 thì kỳ vọng vị trí kế tiếp bằng vị trí hiện tại: $\mathbb E[X_{k+1} \mid X_1, \dots, X_k] = X_k$, nên $\{X_k\}$ là martingale.

**Tính chất cơ bản:** lấy kỳ vọng hai vế (C.3), theo tính chất (b) của bổ đề B.2:

$$
\mathbb E[X_{k+1}] = \mathbb E[X_k], \quad\text{nên}\quad \mathbb E[X_k] = \mathbb E[X_{k-1}] = \cdots = \mathbb E[X_1].
$$

*(ghi chú của người biên soạn)* Trực giác: martingale là mô hình của một **trò chơi công bằng**. Biết hết lịch sử, kỳ vọng tài sản ở ván sau vẫn bằng tài sản hiện tại.

#### Submartingale và supermartingale

Kỳ vọng của martingale là hằng số; mở rộng sang submartingale và supermartingale, có kỳ vọng biến thiên **đơn điệu**.

> **Định nghĩa.** $\{X_k\}$ là **submartingale** nếu $\mathbb E[\lvert X_k\rvert] < \infty$ và
> $$\mathbb E[X_{k+1} \mid X_1, \dots, X_k] \ge X_k \qquad \text{với mọi } k. \tag{C.4}$$
> Lấy kỳ vọng hai vế (dùng bổ đề B.2b): $\mathbb E[X_{k+1}] \ge \mathbb E[X_k]$; quy nạp, $\mathbb E[X_k] \ge \mathbb E[X_{k-1}] \ge \cdots \ge \mathbb E[X_1]$. **Kỳ vọng của submartingale không giảm.**

Với hai biến ngẫu nhiên, $X \le Y$ nghĩa là $X(\omega) \le Y(\omega)$ với mọi $\omega \in \Omega$; **không** có nghĩa giá trị lớn nhất của $X$ nhỏ hơn giá trị nhỏ nhất của $Y$.

> **Định nghĩa.** $\{X_k\}$ là **supermartingale** nếu $\mathbb E[\lvert X_k\rvert] < \infty$ và
> $$\mathbb E[X_{k+1} \mid X_1, \dots, X_k] \le X_k \qquad \text{với mọi } k. \tag{C.5}$$
> Lấy kỳ vọng hai vế: $\mathbb E[X_{k+1}] \le \mathbb E[X_k]$, nên **kỳ vọng của supermartingale không tăng**.

**Mẹo nhớ** (theo sách): "su**p**ermartingale" có chữ "p" chĩa **xuống** nên kỳ vọng giảm; "su**b**martingale" có chữ "b" chĩa **lên** nên kỳ vọng tăng. *(ghi chú của người biên soạn: một mẹo khác là nhìn theo người chơi cờ bạc; với nhà cái thì trò chơi là submartingale, với người chơi thì là supermartingale.)*

Supermartingale hay submartingale tương tự **dãy tất định đơn điệu**. Định lý C.1 cho dãy đơn điệu có kết quả tương tự cho martingale:

> **Định lý C.3 (Định lý hội tụ martingale).** Nếu $\{X_k\}$ là một submartingale (hoặc supermartingale) thì có một biến ngẫu nhiên hữu hạn $X$ sao cho $X_k \to X$ hầu chắc chắn.

Sách bỏ qua chứng minh.

⚠️ *(ghi chú của người biên soạn)* **Phát biểu này thiếu điều kiện bị chặn**, giống như định lý C.1 cần "bị chặn dưới". Phản ví dụ: dãy tất định $X_k = k$ thỏa $\mathbb E[X_{k+1} \mid \mathcal H_k] = k + 1 \ge k$, nên là một submartingale, nhưng không hội tụ tới giá trị hữu hạn. Phát biểu đúng (**định lý hội tụ martingale của Doob**):

- submartingale với $\sup_k\mathbb E[X_k^+] < \infty$ (hay tương đương $\sup_k\mathbb E[\lvert X_k\rvert] < \infty$) thì hội tụ hầu chắc chắn tới một biến ngẫu nhiên hữu hạn;
- tương tự, supermartingale với $\sup_k\mathbb E[X_k^-] < \infty$;
- trường hợp hay dùng nhất: **supermartingale không âm luôn hội tụ hầu chắc chắn** (điều kiện bị chặn tự động thỏa).

Xem Williams, *Probability with Martingales* (1991), chương 11.

#### Tựa martingale

**Tựa martingale (quasimartingale)** có thể coi là tổng quát hóa của martingale: kỳ vọng của nó **không đơn điệu**. Nó tương tự dãy tất định không đơn điệu. Định nghĩa chặt chẽ và kết quả hội tụ của tựa martingale khá phức tạp; dưới đây chỉ nêu các kết quả hữu ích.

Định nghĩa biến cố $A_k \doteq \{\omega \in \Omega : \mathbb E[X_{k+1} - X_k \mid \mathcal H_k] \ge 0\}$, với $\mathcal H_k = \{X_1, \dots, X_k\}$. Trực giác: $A_k$ là biến cố "$X_{k+1}$ lớn hơn $X_k$ theo kỳ vọng". Hàm chỉ thị tương ứng:

$$
\mathbb 1_{A_k} = \begin{cases} 1, & \mathbb E[X_{k+1} - X_k \mid \mathcal H_k] \ge 0,\\ 0, & \mathbb E[X_{k+1} - X_k \mid \mathcal H_k] < 0. \end{cases}
$$

Hàm chỉ thị có tính chất $1 = \mathbb 1_A + \mathbb 1_{A^c}$ với mọi biến cố $A$ ($A^c$ là biến cố bù), nên với mọi biến ngẫu nhiên $X = \mathbb 1_A X + \mathbb 1_{A^c}X$.

> **Định lý C.4 (Định lý hội tụ tựa martingale).** Với dãy ngẫu nhiên **không âm** $\{X_k \ge 0\}$, nếu
> $$\sum_{k=1}^\infty\mathbb E\big[(X_{k+1} - X_k)\,\mathbb 1_{A_k}\big] < \infty,$$
> thì $\sum_{k=1}^\infty\mathbb E\big[(X_{k+1} - X_k)\,\mathbb 1_{A_k^c}\big] > -\infty$, và có một biến ngẫu nhiên hữu hạn $X$ sao cho $X_k \to X$ hầu chắc chắn khi $k \to \infty$.

Định lý C.4 là bản tương tự của định lý C.2 (dãy tất định không đơn điệu): tổng các **bước tăng kỳ vọng** hữu hạn thì dãy hội tụ. Chứng minh có trong Métivier, *Semimartingales* (1982), mệnh đề 9.5. Lưu ý $X_k$ phải không âm; nhờ vậy, tổng các bước tăng bị chặn kéo theo tổng các bước giảm cũng bị chặn. Đây đúng là công cụ đã dùng để chứng minh định lý Dvoretzky ở mục 6.3.1 (với $h_k = \Delta_k^2$).

#### Tóm tắt và so sánh

**Dãy tất định:**

- **Đơn điệu:** đơn điệu và bị chặn thì hội tụ (định lý C.1).
- **Không đơn điệu:** dãy không âm, dù không đơn điệu, vẫn hội tụ nếu sự biến thiên **tắt dần** theo nghĩa $\sum_k(x_{k+1} - x_k)^+ < \infty$ (định lý C.2).

**Dãy ngẫu nhiên:**

- **Supermartingale / submartingale:** kỳ vọng đơn điệu; với điều kiện bị chặn phù hợp thì dãy hội tụ hầu chắc chắn (định lý C.3, xem ghi chú ở trên).
- **Tựa martingale:** kỳ vọng không đơn điệu nhưng vẫn hội tụ nếu sự biến thiên tắt dần theo nghĩa $\sum_k\mathbb E\big[(X_{k+1} - X_k)\,\mathbb 1_{\{\mathbb E[X_{k+1} - X_k \mid \mathcal H_k] > 0\}}\big] < \infty$ (định lý C.4).

| Loại martingale | Tính đơn điệu của $\mathbb E[X_k]$ | Tương tự dãy tất định |
|---|---|---|
| Martingale | hằng số: $\mathbb E[X_{k+1}] = \mathbb E[X_k]$ | dãy hằng |
| Submartingale | tăng: $\mathbb E[X_{k+1}] \ge \mathbb E[X_k]$ | dãy không giảm |
| Supermartingale | giảm: $\mathbb E[X_{k+1}] \le \mathbb E[X_k]$ | dãy không tăng |
| Tựa martingale | không đơn điệu | dãy không đơn điệu có biến thiên tắt dần |

<div align=center>Bảng C.1 Tính đơn điệu của kỳ vọng ở các biến thể martingale</div>

## Phụ lục D Kiến thức nền về giảm gradient

Kiến thức cơ bản về **giảm gradient (gradient descent)**, một trong những phương pháp tối ưu dùng nhiều nhất, và là nền của giảm gradient ngẫu nhiên ở chương 6.

### Tính lồi

**Định nghĩa:**

- **Tập lồi:** $\mathcal D \subseteq \mathbb R^n$ là lồi nếu $z \doteq cx + (1-c)y \in \mathcal D$ với mọi $x, y \in \mathcal D$ và mọi $c \in [0, 1]$ (đoạn thẳng nối hai điểm bất kỳ của tập nằm trọn trong tập).
- **Hàm lồi:** cho $f: \mathcal D \to \mathbb R$ với $\mathcal D$ lồi. $f$ lồi nếu
$$f(cx + (1-c)y) \le c f(x) + (1-c) f(y) \qquad \text{với mọi } x, y \in \mathcal D,\ c \in [0, 1].$$

**Điều kiện lồi:**

- **Điều kiện bậc một:** $f$ lồi nếu
$$f(y) - f(x) \ge \nabla f(x)^T(y - x) \qquad \text{với mọi } x, y \in \mathcal D. \tag{D.1}$$
Khi $x$ vô hướng, $\nabla f(x)$ là hệ số góc của tiếp tuyến của $f$ tại $x$. Ý nghĩa hình học: điểm $(y, f(y))$ luôn nằm **trên tiếp tuyến**.
- **Điều kiện bậc hai:** $f$ lồi nếu $\nabla^2 f(x) \succeq 0$ với mọi $x \in \mathcal D$, với $\nabla^2 f(x)$ là **ma trận Hessian**.

**Mức độ lồi.** Với một hàm lồi, thường quan tâm nó lồi **mạnh tới đâu**. Ma trận Hessian là công cụ mô tả mức độ lồi:

- nếu $\nabla^2 f(x)$ gần suy biến tại một điểm thì hàm **phẳng** quanh điểm đó, tức lồi yếu;
- nếu giá trị kỳ dị nhỏ nhất của $\nabla^2 f(x)$ dương và lớn thì hàm **cong** quanh điểm đó, tức lồi mạnh.

Mức độ lồi ảnh hưởng tới việc chọn bước học. Cận dưới và cận trên của $\nabla^2 f(x)$ đóng vai trò quan trọng:

- **Cận dưới:** $f$ gọi là **lồi mạnh (strongly convex)** nếu $\nabla^2 f(x) \succeq \ell I_n$ với $\ell > 0$, với mọi $x$.
- **Cận trên:** nếu $\nabla^2 f(x) \preceq L I_n$ thì đạo hàm bậc nhất $\nabla f(x)$ không thể thay đổi nhanh tùy ý; tương đương, hàm không thể cong tùy ý tại một điểm. Cận trên có thể suy ra từ điều kiện Lipschitz của $\nabla f$:

> **Bổ đề D.1.** Giả sử $f$ lồi. Nếu $\nabla f(x)$ liên tục Lipschitz với hằng số $L$:
> $$\lVert\nabla f(x) - \nabla f(y)\rVert \le L\lVert x - y\rVert \qquad \text{với mọi } x, y,$$
> thì $\nabla^2 f(x) \preceq L I_n$ với mọi $x$. Ở đây $\lVert\cdot\rVert$ là chuẩn Euclid.

*(ghi chú của người biên soạn)* Sách viết "lồi mạnh hoặc lồi chặt (strongly convex or strictly convex)" như hai tên của cùng một khái niệm. Thực ra chúng **khác nhau**: **lồi mạnh** (Hessian $\succeq \ell I$ với $\ell > 0$) kéo theo **lồi chặt** (bất đẳng thức định nghĩa là dấu $<$ khi $x \ne y$, $c \in (0, 1)$), nhưng không ngược lại. Ví dụ $f(x) = x^4$ lồi chặt nhưng không lồi mạnh, vì $f''(0) = 0$. Chứng minh hội tụ dưới đây cần lồi **mạnh**.

### Thuật toán giảm gradient

Xét bài toán tối ưu $\min_x f(x)$ với $x \in \mathcal D \subseteq \mathbb R^n$ và $f: \mathcal D \to \mathbb R$. Thuật toán **giảm gradient**:

$$
x_{k+1} = x_k - \alpha_k\nabla f(x_k), \qquad k = 0, 1, 2, \dots \tag{D.2}
$$

với $\alpha_k > 0$ cố định hoặc thay đổi theo thời gian, gọi là **bước học (step size, learning rate)**.

**Hướng thay đổi.** $\nabla f(x_k)$ là vectơ chỉ hướng mà $f$ **tăng nhanh nhất**. Do đó $-\alpha_k\nabla f(x_k)$ đổi $x_k$ theo hướng $f$ **giảm nhanh nhất**.

**Độ lớn thay đổi**, do cả $\alpha_k$ và $\lVert\nabla f(x_k)\rVert$ quyết định:

- **Độ lớn của $\nabla f(x_k)$:**
  - Khi $x_k$ **gần** điểm tối ưu $x^{\ast}$ (nơi $\nabla f(x^{\ast}) = 0$), $\lVert\nabla f(x_k)\rVert$ nhỏ, nên cập nhật chậm. Hợp lý, vì không muốn cập nhật quá mạnh rồi vượt qua điểm tối ưu.
  - Khi $x_k$ **xa** điểm tối ưu, $\lVert\nabla f(x_k)\rVert$ có thể lớn, nên cập nhật nhanh. Cũng hợp lý, vì muốn tiến tới điểm tối ưu càng nhanh càng tốt.
- **Bước học $\alpha_k$:**
  - $\alpha_k$ nhỏ thì cập nhật nhỏ, hội tụ chậm. $\alpha_k$ quá lớn thì cập nhật quá mạnh, dẫn tới hội tụ nhanh **hoặc phân kỳ**.
  - **Chọn $\alpha_k$ thế nào?** Tùy mức độ lồi của $f$. Hàm **cong** quanh điểm tối ưu (lồi mạnh) thì $\alpha_k$ phải **nhỏ** để bảo đảm hội tụ. Hàm **phẳng** quanh điểm tối ưu (lồi yếu) thì $\alpha_k$ có thể **lớn** để $x_k$ tiến nhanh tới điểm tối ưu. Phân tích hội tụ dưới đây sẽ xác nhận trực giác này.

### Phân tích hội tụ

Chứng minh $x_k$ hội tụ về điểm tối ưu $x^{\ast}$ với $\nabla f(x^{\ast}) = 0$, dưới hai giả thiết:

- **Giả thiết 1:** $f$ lồi mạnh: $\nabla^2 f(x) \succeq \ell I$, với $\ell > 0$.
- **Giả thiết 2:** $\nabla f(x)$ liên tục Lipschitz với hằng số $L$; theo bổ đề D.1, $\nabla^2 f(x) \preceq L I_n$.

> **Chứng minh.** Với mọi $x_{k+1}$, $x_k$, theo khai triển Taylor:
> $$f(x_{k+1}) = f(x_k) + \nabla f(x_k)^T(x_{k+1} - x_k) + \frac12(x_{k+1} - x_k)^T\nabla^2 f(z_k)(x_{k+1} - x_k), \tag{D.3}$$
> với $z_k$ là một tổ hợp lồi của $x_k$ và $x_{k+1}$. Vì $\nabla^2 f(z_k) \preceq L I_n$ nên $\lVert\nabla^2 f(z_k)\rVert \le L$, và (D.3) cho
> $$f(x_{k+1}) \le f(x_k) + \nabla f(x_k)^T(x_{k+1} - x_k) + \frac L2\lVert x_{k+1} - x_k\rVert^2.$$
> Thay $x_{k+1} = x_k - \alpha_k\nabla f(x_k)$:
> $$\begin{aligned}
> f(x_{k+1}) &\le f(x_k) + \nabla f(x_k)^T\big(-\alpha_k\nabla f(x_k)\big) + \frac L2\lVert\alpha_k\nabla f(x_k)\rVert^2\\
> &= f(x_k) - \alpha_k\lVert\nabla f(x_k)\rVert^2 + \frac{\alpha_k^2 L}{2}\lVert\nabla f(x_k)\rVert^2\\
> &= f(x_k) - \underbrace{\alpha_k\Big(1 - \frac{\alpha_k L}{2}\Big)}_{\eta_k}\lVert\nabla f(x_k)\rVert^2.
> \end{aligned} \tag{D.4}$$
> Nếu chọn
> $$0 < \alpha_k < \frac2L, \tag{D.5}$$
> thì $\eta_k > 0$, và (D.4) cho $f(x_{k+1}) \le f(x_k)$: dãy $\{f(x_k)\}$ **không tăng**. Lại có $f(x_k)$ luôn bị chặn dưới bởi $f(x^{\ast})$, nên theo định lý hội tụ đơn điệu (định lý C.1), $\{f(x_k)\}$ hội tụ; gọi giới hạn là $f^{\ast}$. Lấy giới hạn hai vế (D.4):
> $$\lim_{k\to\infty}f(x_{k+1}) \le \lim_{k\to\infty}f(x_k) - \lim_{k\to\infty}\eta_k\lVert\nabla f(x_k)\rVert^2 \;\Longleftrightarrow\; f^{\ast} \le f^{\ast} - \lim_{k\to\infty}\eta_k\lVert\nabla f(x_k)\rVert^2 \;\Longleftrightarrow\; 0 \le -\lim_{k\to\infty}\eta_k\lVert\nabla f(x_k)\rVert^2.$$
> Vì $\eta_k\lVert\nabla f(x_k)\rVert^2 \ge 0$, suy ra $\lim_k\eta_k\lVert\nabla f(x_k)\rVert^2 = 0$. Do đó $x_k$ hội tụ về $x^{\ast}$ với $\nabla f(x^{\ast}) = 0$. $\blacksquare$

*(ghi chú của người biên soạn)* Bước cuối cần thêm hai chi tiết mà sách lướt qua. (1) Để từ $\eta_k\lVert\nabla f(x_k)\rVert^2 \to 0$ suy ra $\nabla f(x_k) \to 0$, cần $\eta_k$ **không tiến về 0**, ví dụ chọn $\alpha_k$ trong một khoảng cố định $[\underline\alpha, \bar\alpha] \subset (0, 2/L)$. (2) Để từ $\nabla f(x_k) \to 0$ suy ra $x_k \to x^{\ast}$, dùng **lồi mạnh** (giả thiết 1): $\lVert\nabla f(x) - \nabla f(x^{\ast})\rVert \ge \ell\lVert x - x^{\ast}\rVert$, nên $\lVert x_k - x^{\ast}\rVert \le \lVert\nabla f(x_k)\rVert/\ell \to 0$. Đây là chỗ giả thiết 1 thực sự được dùng.

**Ý nghĩa của (D.5) cho việc chọn bước học:** hàm **phẳng** ($L$ nhỏ) thì bước học có thể **lớn**; hàm **cong mạnh** ($L$ lớn) thì bước học phải **đủ nhỏ** để hội tụ. Cũng có nhiều cách chứng minh khác, ví dụ dùng định lý ánh xạ co.

### Kiểm tra bằng mã *(ghi chú của người biên soạn)*

Xét $f(x) = \frac12 x^T H x$ với $H = \operatorname{diag}(1, 10)$, tức $\ell = 1$ và $L = 10$, nên ngưỡng ở (D.5) là $2/L = 0.2$.

```python
import numpy as np

H = np.diag([1.0, 10.0]); L = 10.0                 # ℓ = 1, L = 10, nên 2/L = 0.2
for alpha in [0.05, 0.15, 0.199, 0.201, 0.25]:
    x = np.array([1.0, 1.0])
    for k in range(200):
        x = x - alpha * H @ x                       # x_{k+1} = x_k − α ∇f(x_k)
    print(alpha, np.linalg.norm(x))
```

| $\alpha$ | $0.05$ | $0.15$ | $0.199$ | $0.201$ | $0.25$ |
|---|---|---|---|---|---|
| $\lVert x_{200}\rVert$ | $3.5\times10^{-5}$ | $7.7\times10^{-15}$ | $0.134$ | $7.32$ | $1.65\times10^{35}$ |

Ranh giới đúng tại $2/L = 0.2$: $\alpha = 0.199$ vẫn hội tụ (chậm, vì sát biên), $\alpha = 0.201$ đã phân kỳ. Để ý $\alpha = 0.05$ chậm hơn $\alpha = 0.15$: với $\alpha$ nhỏ, hướng "phẳng" (trị riêng $\ell = 1$) bị cập nhật quá chậm. Bước học tốt nhất cho hàm bậc hai là $\alpha = 2/(\ell + L) \approx 0.18$, cân bằng giữa hướng phẳng và hướng cong.

## Bảng ký hiệu toán của sách

Sách dùng chữ hoa cho ma trận hoặc biến ngẫu nhiên; chữ thường cho vectơ, vô hướng hoặc mẫu. Ký hiệu học tăng cường xem [Quy ước ký hiệu](notation_vi).

| Ký hiệu | Ý nghĩa |
|---|---|
| $=$, $\approx$, $\doteq$ | bằng, xấp xỉ, bằng theo định nghĩa |
| $\ge, >, \le, <$ | so sánh **từng phần tử** (với vectơ, ma trận) |
| $\lVert\cdot\rVert_2$ | chuẩn Euclid của vectơ, hoặc chuẩn ma trận cảm sinh tương ứng |
| $\lVert\cdot\rVert_\infty$ | chuẩn cực đại của vectơ, hoặc chuẩn ma trận cảm sinh tương ứng |
| $\ln$ | logarit tự nhiên |
| $\mathbb R$, $\mathbb R^n$, $\mathbb R^{n\times m}$ | tập số thực, vectơ thực $n$ chiều, ma trận thực $n\times m$ |
| $A \succeq 0$ ($A \succ 0$) | ma trận $A$ nửa xác định dương (xác định dương) |
| $A \preceq 0$ ($A \prec 0$) | ma trận $A$ nửa xác định âm (xác định âm) |
| $\lvert x\rvert$ | giá trị tuyệt đối của số thực $x$ |
| $\lvert\mathcal S\rvert$ | số phần tử của tập $\mathcal S$ |
| $\nabla_x f(x)$ | gradient của hàm vô hướng $f$ theo vectơ $x$, viết gọn $\nabla f(x)$ |
| $[A]_{ij}$, $[x]_i$ | phần tử hàng $i$ cột $j$ của ma trận $A$; phần tử thứ $i$ của vectơ $x$ |
| $X \sim p$ | $p$ là phân phối xác suất của biến ngẫu nhiên $X$ |
| $p(X = x)$, $\Pr(X = x)$ | xác suất $X = x$, viết gọn $p(x)$ hoặc $\Pr(x)$ |
| $p(x \mid y)$ | xác suất có điều kiện |
| $\mathbb E_{X\sim p}[X]$ | kỳ vọng của $X$, viết gọn $\mathbb E[X]$ khi phân phối đã rõ |
| $\operatorname{var}(X)$ | phương sai của $X$ |
| $\arg\max_x f(x)$ | điểm cực đại của $f$ |
| $\mathbf 1_n$ | vectơ toàn số 1, viết gọn $\mathbf 1$ khi số chiều đã rõ |
| $I_n$ | ma trận đơn vị $n\times n$, viết gọn $I$ |

## Đọc tiếp

- Quay lại [Giới thiệu phần này](mathrl/README_vi) · [Chương 10 Phương pháp diễn viên–nhà phê bình](mathrl/ch10_vi)
- Phụ lục A dùng nhiều nhất ở [chương 2](mathrl/ch02_vi) (suy ra phương trình Bellman); phụ lục B–C ở [chương 6](mathrl/ch06_vi) (Robbins-Monro, Dvoretzky); phụ lục D ở [chương 6](mathrl/ch06_vi) (SGD) và [chương 8](mathrl/ch08_vi).
