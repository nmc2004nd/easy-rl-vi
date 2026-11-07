// Bản dịch tiếng Việt cho Bản đồ kiến thức RL.
// Dịch và hiệu đính từ dữ liệu song ngữ Trung/Anh của rl_explorer.html (HanFei-hz).
// Thuật ngữ theo bản dịch Sách Nấm EasyRL. Công thức và ID giữ nguyên ở index.html.
window.RL_VI = {
  partitions: {
    foundations: { name: "Nền tảng lý thuyết", desc: "MDP, phương trình Bellman và xấp xỉ ngẫu nhiên: gốc toán học của mọi thuật toán học tăng cường" },
    model_based: { name: "Có mô hình (cổ điển)", desc: "Quy hoạch động khi đã biết mô hình môi trường (VI, PI) và Dyna-Q khi mô hình được học từ kinh nghiệm" },
    model_free: { name: "Không mô hình (cổ điển)", desc: "Chỉ học từ mẫu: Monte Carlo, sai phân thời gian, Sarsa, Q-learning, điểm khởi đầu thực tế của học tăng cường" },
    function_approx: { name: "Cầu nối xấp xỉ hàm", desc: "Chuyển từ dạng bảng sang mạng nơ-ron: cửa vào của học tăng cường sâu" },
    value_based: { name: "Học sâu dựa trên giá trị", desc: "Họ DQN: học hàm Q rồi chọn hành động tham lam. Một trong hai nhánh chính của học tăng cường sâu" },
    policy_based: { name: "Học sâu dựa trên chính sách", desc: "Họ gradient chính sách: tối ưu trực tiếp chính sách π. Nhánh chính còn lại" },
    cont_control: { name: "Điều khiển liên tục", desc: "DDPG, TD3, SAC: chính sách tất định hoặc Gauss cho không gian hành động liên tục" },
    model_based_modern: { name: "Học sâu có mô hình", desc: "Học một mô hình thế giới rồi lập kế hoạch hoặc huấn luyện trong đó, ví dụ Dreamer" },
    offline: { name: "Học tăng cường ngoại tuyến", desc: "Chỉ huấn luyện trên tập dữ liệu cố định, không tương tác trực tuyến: quan trọng khi triển khai thực tế" },
    exploration: { name: "Tăng cường khám phá", desc: "Động lực nội tại cho bài toán phần thưởng thưa, ví dụ ICM" },
    llm_alignment: { name: "Căn chỉnh mô hình ngôn ngữ lớn", desc: "Các phương pháp học tăng cường để căn chỉnh LLM từ năm 2022: RLHF, DPO, GRPO" }
  },

  slots: {
    environment: "Giả định môi trường",
    value_estimation: "Ước lượng giá trị",
    policy_representation: "Biểu diễn chính sách",
    exploration: "Cơ chế khám phá",
    update_rule: "Quy tắc cập nhật",
    value_distribution: "Mục tiêu giá trị",
    data_source: "Nguồn dữ liệu"
  },

  slotValues: {
    "tabular": "dạng bảng",
    "linear": "tuyến tính",
    "NN": "mạng nơ-ron",
    "deterministic": "tất định",
    "Gaussian": "phân phối Gauss",
    "model": "mô hình",
    "avg": "trung bình mẫu",
    "on-policy": "cùng chính sách (on-policy)",
    "off-policy": "khác chính sách (off-policy)",
    "off-policy-prioritized": "khác chính sách, có ưu tiên",
    "offline": "ngoại tuyến",
    "human-preference": "đánh giá của con người",
    "parameter-noise": "nhiễu tham số",
    "Gaussian noise": "nhiễu Gauss",
    "entropy": "entropy",
    "entropy-regularized": "điều chuẩn entropy",
    "intrinsic-reward": "phần thưởng nội tại",
    "none": "không có",
    "vanilla-SGD": "SGD cơ bản",
    "vanilla SGD": "SGD cơ bản",
    "DP-backup": "cập nhật quy hoạch động",
    "SA-RM": "xấp xỉ ngẫu nhiên (RM)",
    "imagined-AC": "actor-critic trong tưởng tượng",
    "scalar-Q": "Q vô hướng",
    "scalar Q": "Q vô hướng",
    "scalar-V": "V vô hướng",
    "scalar V": "V vô hướng",
    "V-plus-A": "V + A",
    "Advantage": "lợi thế"
  },

  chainNames: {
    1: "Bộ năm MDP",
    2: "Giá trị trạng thái",
    3: "Phương trình Bellman",
    4: "Phương trình tối ưu Bellman",
    5: "Lặp giá trị",
    6: "Monte Carlo",
    7: "TD(0)",
    8: "Q-learning",
    9: "DQN",
    10: "Gradient chính sách",
    11: "Actor-Critic",
    12: "PPO (dạng cắt)",
    13: "DPO",
    14: "GRPO"
  },

  chain: {
    1: "Khởi đầu: hình thức hóa thế giới thành quá trình quyết định Markov",
    2: "Định nghĩa thước đo: lợi tức chiết khấu kỳ vọng",
    3: "Khai triển kỳ vọng thành phương trình tự nhất quán",
    4: "Σπ → max: từ đánh giá sang tối ưu",
    5: "Từ phương trình sang phép lặp (co với hệ số γ)",
    6: "Bỏ mô hình, dùng trung bình mẫu",
    7: "Từ cả quỹ đạo sang bootstrap một bước",
    8: "Thêm max vào TD: học q* theo kiểu khác chính sách",
    9: "Từ bảng Q sang mạng sâu, thêm phát lại kinh nghiệm và mạng mục tiêu",
    10: "Đổi góc nhìn: lấy gradient trực tiếp trên chính sách",
    11: "Từ Q sang lợi thế: giảm phương sai",
    12: "Actor-critic thêm ràng buộc cắt: huấn luyện ổn định",
    13: "Đưa mô hình phần thưởng vào hàm mất mát dưới dạng đóng: không cần bước học tăng cường",
    14: "Đường cơ sở theo nhóm: bỏ critic"
  },

  nodes: {
    basic_concepts: {
      name: "Khái niệm cơ bản (MDP)",
      whatChanged: "Điểm khởi đầu: hình thức hóa tương tác giữa tác tử và môi trường thành bộ năm MDP",
      keyInsight: "Tính chất Markov: trạng thái hiện tại chứa toàn bộ thông tin cần để ra quyết định",
      flashcard: "Học tăng cường mô hình hóa thế giới thành MDP = (S, A, P, R, γ). Trạng thái hiện tại chứa mọi thông tin hữu ích. Chính sách π(a|s) là thứ cần tối ưu.",
      textbook: "MDP là ngôn ngữ toán học của học tăng cường. Một tập (episode) là dãy S_0, A_0, R_1, S_1, A_1, … Tính chất Markov là cơ sở của mọi phương trình dạng Bellman. Về toán học, γ bảo đảm chuỗi hội tụ; về ý nghĩa, nó diễn tả phần thưởng hiện tại đáng giá hơn phần thưởng tương lai.",
      meanings: {
        M: "Bản thân MDP: bộ năm mô tả toàn bộ môi trường ra quyết định",
        S: "Không gian trạng thái: tập mọi trạng thái tác tử có thể ở",
        A: "Không gian hành động: tập các hành động tác tử có thể thực hiện",
        P: "Xác suất chuyển P(s'|s,a). Tính Markov: s' chỉ phụ thuộc vào (s,a)",
        R: "Hàm phần thưởng R(s,a): tín hiệu phản hồi tức thời",
        gamma: "Hệ số chiết khấu γ∈[0,1): càng nhỏ càng “cận thị”, càng gần 1 càng “nhìn xa”"
      }
    },
    bellman_equation: {
      name: "Phương trình Bellman",
      whatChanged: "Với π cho trước, viết v_π(s) thành hệ thức đệ quy theo chính nó: phương trình tự nhất quán của giá trị",
      keyInsight: "Giá trị hiện tại = phần thưởng tức thời + giá trị kế tiếp đã chiết khấu. Đây là nền đại số của học tăng cường",
      flashcard: "v_π(s) = phần thưởng tức thời kỳ vọng + γ × giá trị kế tiếp kỳ vọng. Đây là nền đại số của mọi thuật toán học tăng cường.",
      textbook: "Phương trình Bellman gấp “lợi tức kỳ vọng vô hạn bước” thành “kỳ vọng một bước + giá trị kế tiếp”. VI/PI giải bằng phép lặp, Monte Carlo bằng lấy mẫu, TD bằng bootstrap: tất cả đều giải hoặc xấp xỉ phương trình này. Dạng ma trận v_π = r_π + γP_π v_π có nghiệm đóng (I−γP_π)⁻¹ r_π.",
      meanings: {
        v_pi_s: "Hàm giá trị trạng thái: lợi tức chiết khấu kỳ vọng khi xuất phát từ s và đi theo π",
        pi_as: "Chính sách: xác suất chọn hành động a ở trạng thái s",
        sum_a: "Tổng trên mọi hành động: “trung bình có trọng số” theo π",
        p_sr: "Xác suất chuyển đồng thời: khả năng nhận được (s',r) khi biết (s,a)",
        reward_r: "Phần thưởng tức thời: tín hiệu vô hướng nhận ngay sau một hành động",
        gamma: "Hệ số chiết khấu: quyết định trọng số giảm dần của phần thưởng tương lai",
        v_pi_sp: "Giá trị trạng thái kế tiếp: cấu trúc “tự tham chiếu” làm nên vẻ đẹp của phương trình Bellman"
      }
    },
    bellman_optimality: {
      name: "Phương trình tối ưu Bellman",
      whatChanged: "Thay Σ_a π(a|s) bằng max_a: từ đánh giá π chuyển sang tìm chính sách tối ưu π*",
      keyInsight: "Điều kiện điểm bất động của giá trị tối ưu. Định lý Banach bảo đảm v* duy nhất và VI hội tụ",
      flashcard: "Thay Σπ(a|s) trong phương trình Bellman bằng max_a. Nghiệm là v*, chính sách tham lam theo v* là π*.",
      textbook: "Đây là điều kiện điểm bất động mô tả “tối ưu”. Toán tử Bellman T*(v) = max_a Σ p[r+γv(s')] là ánh xạ co với hệ số γ, nên theo định lý Banach có nghiệm duy nhất v* và phép lặp hội tụ từ mọi giá trị đầu: đây là cơ sở lý thuyết của VI. Do max phi tuyến nên không có nghiệm đóng.",
      meanings: {
        v_star_s: "Giá trị trạng thái tối ưu: lớn nhất trên mọi chính sách, v_*(s) = max_π v_π(s)",
        max_a: "Toán tử max: chọn tham lam trên mọi hành động",
        p_sr: "Xác suất chuyển đồng thời: do mô hình môi trường cung cấp",
        reward_r: "Phần thưởng tức thời",
        gamma: "Hệ số chiết khấu",
        v_star_sp: "Giá trị tối ưu của trạng thái kế tiếp"
      }
    },
    robbins_monro: {
      name: "Xấp xỉ ngẫu nhiên (Robbins-Monro)",
      whatChanged: "Công cụ toán học: tìm nghiệm của phương trình khi chỉ có quan sát nhiễu. Tiền thân của các thuật toán gia tăng như TD, SGD",
      keyInsight: "Hai điều kiện RM, Σα=∞ và Σα²<∞, giúp phép lặp với gradient nhiễu hội tụ hầu chắc chắn",
      flashcard: "Bảo đảm toán học rằng phương pháp dùng gradient nhiễu vẫn hội tụ. Là tổ tiên của TD, SGD, Adam.",
      textbook: "Giải bài toán tìm nghiệm x* của E[g(x,ξ)]=0 khi chỉ có mẫu nhiễu. Hai điều kiện Σα=∞ và Σα²<∞ bảo đảm hội tụ hầu chắc chắn. Ý nghĩa: ước lượng q_π tương đương tìm nghiệm của E[G−q]=0, và làm gia tăng theo RM cho q ← q + α(G−q). Thay G bằng mục tiêu TD thì được dạng cập nhật của TD(0).",
      meanings: {
        x_k: "Ước lượng tham số ở bước k: cần hội tụ về nghiệm x*",
        alpha_k: "Bước nhảy: phải thỏa Σα=∞ và Σα²<∞ (thường chọn 1/k)",
        g_tilde: "Ước lượng gradient có nhiễu: chỉ cần E[g̃]=g(x), được phép có phương sai",
        xi_k: "Nhiễu ngẫu nhiên ở bước k: bị “trung bình hóa” nhờ điều kiện RM"
      }
    },

    value_iteration: {
      name: "Lặp giá trị (VI)",
      whatChanged: "Biến phương trình tối ưu Bellman thành phép lặp: thuật toán đầu tiên chạy được",
      keyInsight: "Tính co với hệ số γ bảo đảm hội tụ theo cấp số nhân về v* với tốc độ γ^k, từ mọi giá trị đầu",
      flashcard: "Lặp lại max + kỳ vọng đến khi hội tụ. Cần biết mô hình, chỉ dùng được cho bài toán nhỏ. Là tổ tiên về mặt ý tưởng của Q-learning và DQN.",
      textbook: "Mỗi vòng lặp cập nhật toàn bộ trạng thái. Với điều kiện dừng ‖v_{k+1}−v_k‖_∞ < ε, ta có ‖v_{k+1}−v*‖_∞ ≤ εγ/(1−γ). VI là “nguyên mẫu lý tưởng”: có thể xem các phương pháp dựa trên mẫu như TD là xấp xỉ của quy hoạch động.",
      meanings: {
        v_k1: "Ước lượng giá trị ở vòng lặp k+1: đầu ra của vòng này",
        max_a: "Toán tử max: tham lam trên mọi hành động",
        p_sr: "Xác suất chuyển: VI cần biết mô hình",
        reward_r: "Phần thưởng tức thời",
        gamma: "Hệ số chiết khấu: đồng thời quyết định tốc độ hội tụ",
        v_k_sp: "Giá trị trạng thái kế tiếp ở vòng lặp k: đầu vào của vòng này"
      }
    },
    policy_iteration: {
      name: "Lặp chính sách (PI)",
      whatChanged: "Tách thành hai bước xen kẽ, đánh giá chính sách và cải thiện chính sách, chính sách không kém đi qua mỗi vòng",
      keyInsight: "PI và VI là hai trường hợp riêng của lặp chính sách tổng quát (GPI)",
      flashcard: "“Đánh giá chính xác chính sách hiện tại → cải thiện tham lam → lặp lại”. Cần ít vòng hơn VI, nhưng mỗi vòng tốn hơn.",
      textbook: "Hai bước xen kẽ. Đánh giá chính sách giải hệ phương trình Bellman (nghiệm đóng hoặc lặp) để có v_{π_k}; cải thiện chính sách sinh π_{k+1} theo kiểu tham lam. Định lý cải thiện bảo đảm v_{π_{k+1}} ≥ v_{π_k}. PI cắt ngắn giới hạn bước đánh giá còn j lần lặp; khi j=1 thì đó là VI, nên GPI thống nhất cả hai.",
      meanings: {
        pi_k1: "Chính sách mới sau cải thiện: định lý cải thiện bảo đảm v_{π_{k+1}} ≥ v_{π_k}",
        argmax: "Trả về hành động làm q lớn nhất: cải thiện tham lam",
        p_sr: "Xác suất chuyển",
        reward_r: "Phần thưởng tức thời",
        gamma: "Hệ số chiết khấu",
        v_pi_k: "Giá trị của chính sách hiện tại π_k: đã được tính chính xác ở bước đánh giá"
      }
    },
    dyna_q: {
      name: "Dyna-Q",
      whatChanged: "Kết hợp học từ kinh nghiệm thật với lập kế hoạch trên mô hình đã học: cập nhật Q thêm bằng các bước “tưởng tượng”",
      keyInsight: "Học một mô hình của thế giới rồi luyện tập trong đó, nhờ vậy tiết kiệm tương tác thật",
      flashcard: "Kiến trúc kinh điển kết hợp học không mô hình với lập kế hoạch có mô hình. Tác tử xây mô hình động lực học và sinh kinh nghiệm ảo để cập nhật Q.",
      textbook: "Dyna lặp ba việc: 1) tương tác với môi trường và cập nhật Q; 2) dùng kinh nghiệm cập nhật mô hình P và R; 3) lấy mẫu các cặp (S,A) đã gặp, dùng mô hình sinh (R, S') ảo rồi cập nhật Q thêm (bước lập kế hoạch).",
      meanings: {
        sim_R: "Phần thưởng mô phỏng do mô hình dự đoán",
        sim_S_prime: "Trạng thái kế tiếp mô phỏng do mô hình dự đoán",
        max_Q: "Bootstrap tham lam trên trạng thái mô phỏng"
      }
    },

    monte_carlo: {
      name: "Học Monte Carlo (MC)",
      whatChanged: "Bỏ mô hình: dùng trung bình lợi tức từ quỹ đạo lấy mẫu thay cho kỳ vọng",
      keyInsight: "Luật số lớn: khi N→∞, trung bình lợi tức hội tụ về q_π. Không chệch nhưng phương sai lớn, phải chờ hết tập",
      flashcard: "Không biết xác suất thì lấy mẫu rồi tính trung bình. Không chệch nhưng phương sai lớn, phải chờ hết tập mới cập nhật được.",
      textbook: "Ba biến thể: MC Basic (cần khởi đầu thăm dò), MC ES (khởi đầu thăm dò, dùng mẫu hiệu quả hơn), MC ε-tham lam (dùng chính sách ε-mềm để bỏ yêu cầu khởi đầu thăm dò). Ưu điểm: không chệch, không cần mô hình. Nhược điểm: phải chờ hết tập, phương sai cao, chỉ dùng cho nhiệm vụ có tập. Là tiền thân về ý tưởng của TD.",
      meanings: {
        q_pi_sa: "Giá trị hành động: đại lượng MC ước lượng trực tiếp",
        N_sa: "Số lần thăm (s,a): mẫu số trong luật số lớn",
        G_i: "Lợi tức chiết khấu thực tế sau lần thăm thứ i tới (s,a)",
        G_t: "Lợi tức chiết khấu tính từ thời điểm t: mục tiêu không chệch của MC",
        gamma_k: "Trọng số chiết khấu của phần thưởng sau k bước",
        R_tk: "Phần thưởng tức thời ở thời điểm t+k+1"
      }
    },
    td_zero: {
      name: "Sai phân thời gian TD(0)",
      whatChanged: "Thay lợi tức cả quỹ đạo G_t của MC bằng bootstrap một bước R+γV(S'): cập nhật gia tăng trực tuyến được",
      keyInsight: "Kết hợp MC (không mô hình) với quy hoạch động (bootstrap). Độ chệch tăng, phương sai giảm mạnh",
      flashcard: "Không chờ hết tập: mỗi bước cập nhật bằng r + γV(s') − V(s). Thường nhanh hơn MC nhưng có độ chệch.",
      textbook: "Công trình mở đường của Sutton năm 1988, hợp nhất MC và quy hoạch động: học từ mẫu như MC, bootstrap như quy hoạch động. Trong thực nghiệm, TD thường hội tụ nhanh hơn MC. TD(0) là đánh giá chính sách; muốn điều khiển phải kết hợp với tham lam, dẫn tới Sarsa và Q-learning.",
      meanings: {
        V_St: "Ước lượng giá trị trạng thái hiện tại: đại lượng được cập nhật",
        alpha_lr: "Tốc độ học (bước nhảy): thường khoảng 0,01–0,1",
        R_t1: "Phần thưởng tức thời vừa nhận",
        gamma: "Hệ số chiết khấu",
        V_St1: "Ước lượng giá trị trạng thái kế tiếp: dùng để bootstrap",
        td_target: "Mục tiêu TD: một phần là thực tế, một phần là ước lượng",
        td_error: "Sai số TD δ_t = mục tiêu − V(S_t): dẫn hướng cho cập nhật"
      }
    },
    sarsa: {
      name: "Sarsa",
      whatChanged: "Mở rộng TD(0) từ đánh giá V sang điều khiển bằng Q: cùng chính sách (cả A và A' đều lấy từ π hiện tại)",
      keyInsight: "Cùng chính sách làm Sarsa thận trọng hơn Q-learning: chọn đường an toàn hơn trong bài toán đi bên vách đá",
      flashcard: "Dạng điều khiển của TD(0): học Q thay vì V, cả A và A' đều lấy từ π ε-tham lam hiện tại. Cùng chính sách nên thận trọng.",
      textbook: "Đánh giá và cải thiện đan xen theo tinh thần GPI. Cái giá của cùng chính sách: π phải giữ tính khám phá. Trong bài toán đi bên vách đá, Sarsa học đường an toàn xa vách, còn Q-learning học đường tối ưu sát vách, vì Sarsa đã tính cả rủi ro ε-tham lam thỉnh thoảng trượt xuống vách vào Q.",
      meanings: {
        Q_StAt: "Giá trị Q hiện tại của (S_t,A_t): đại lượng được cập nhật",
        alpha_lr: "Tốc độ học",
        R_t1: "Phần thưởng tức thời",
        gamma: "Hệ số chiết khấu",
        Q_St1At1: "Q của hành động A_{t+1} được lấy mẫu thật: nguồn gốc của tên SARSA",
        A_t1_sample: "Hành động kế tiếp được lấy mẫu từ π hiện tại: cốt lõi của cùng chính sách"
      }
    },
    expected_sarsa: {
      name: "Sarsa kỳ vọng",
      whatChanged: "Thay một mẫu Q(S',A') bằng kỳ vọng E_π[Q] trên mọi hành động: loại bỏ nhiễu lấy mẫu",
      keyInsight: "Dạng trung gian giữa Sarsa và Q-learning: khi π tham lam thì trở thành Q-learning",
      flashcard: "Sarsa giảm phương sai: thay Q(S',A') bằng Σπ(a|S')Q(S',a). Khi π tham lam thì thành Q-learning.",
      textbook: "Nhận xét chính: Sarsa thêm phương sai vì chỉ dùng một mẫu A', trong khi π đã biết, vậy tính thẳng kỳ vọng. Mỗi bước tốn thêm O(|A|) nhưng phương sai giảm đáng kể. Khi π tham lam (ε=0) thì thành Q-learning; khi π đều thì là trung bình các Q.",
      meanings: {
        Q_StAt: "Ước lượng Q hiện tại",
        alpha_lr: "Tốc độ học",
        R_t1: "Phần thưởng tức thời",
        gamma: "Hệ số chiết khấu",
        pi_aps: "Xác suất của từng a' ở trạng thái kế tiếp (π đã biết)",
        sum_ap: "Tổng trên mọi a': kỳ vọng thay cho một mẫu",
        Q_St1ap: "Q ở trạng thái kế tiếp với mọi a': tất cả đều tham gia tính toán"
      }
    },
    n_step_td: {
      name: "TD n bước / Sarsa n bước",
      whatChanged: "Tổng quát từ 1 bước lên n bước: nội suy giữa MC (n=∞) và TD(0) (n=1)",
      keyInsight: "Thực nghiệm cho thấy n trung gian (thường 4–16) hay tốt hơn 1 bước hoặc ∞; TD(λ) là bản nâng cấp có trọng số hình học",
      flashcard: "“Đi n bước với phần thưởng thật + bootstrap ở bước n”. n là núm vặn cân bằng độ chệch và phương sai. TD(λ) là bản nâng cấp có trọng số hình học.",
      textbook: "Thực nghiệm cho thấy cả n=1 lẫn n=∞ đều không tối ưu, n trung gian (thường 4–16) cho kết quả tốt nhất. Phải chờ n bước mới cập nhật được. TD(λ) là dạng thanh nhã hơn: G_t^λ = (1−λ)Σλ^{n−1}G_t^{(n)} tổng hợp mọi n và được cài đặt hiệu quả bằng vết đủ điều kiện (eligibility trace).",
      meanings: {
        G_n: "Lợi tức n bước: cộng phần thưởng thật trong n bước rồi bootstrap bằng V",
        R_t1: "Phần thưởng thật ở bước 1",
        gamma: "Hệ số chiết khấu: γ^k là trọng số của phần thưởng bước k",
        R_tn: "Phần thưởng thật ở bước n",
        gamma_n: "Trọng số của ước lượng V sau n bước",
        V_Stn: "Ước lượng V của trạng thái sau n bước: số hạng bootstrap",
        n_param: "Số bước: điều chỉnh độ chệch và phương sai; n lớn thì độ chệch thấp, phương sai cao"
      }
    },
    q_learning: {
      name: "Q-learning",
      whatChanged: "Thay Q(S',A') của Sarsa bằng max_{a'} Q(S',a'): đổi một dòng, từ cùng chính sách sang khác chính sách",
      keyInsight: "Khác chính sách tách chính sách hành vi (thu dữ liệu) khỏi chính sách mục tiêu (tham lam): nền tảng của học ngoại tuyến",
      flashcard: "Một dòng thay đổi so với Sarsa: Q(S',A') → max_{a'} Q(S',a'). Khác chính sách, học trực tiếp q*. Toán tử max gây độ chệch lạc quan.",
      textbook: "Một trong những thuật toán có ảnh hưởng nhất. Khác chính sách: chính sách hành vi bất kỳ (ngẫu nhiên, chuyên gia, chính sách cũ) đều thu được dữ liệu, mục tiêu luôn là q*; đây là nền tảng của phát lại kinh nghiệm và học ngoại tuyến. Watkins chứng minh: ở dạng bảng, nếu mọi (s,a) được thăm vô hạn lần và α thỏa điều kiện RM thì Q hội tụ hầu chắc chắn về q*. Tuy nhiên max gây độ chệch lạc quan, Double DQN được đề xuất để giảm nó.",
      meanings: {
        Q_StAt: "Ước lượng Q hiện tại",
        alpha_lr: "Tốc độ học",
        R_t1: "Phần thưởng tức thời",
        gamma: "Hệ số chiết khấu",
        max_ap: "Toán tử max: tham lam ở trạng thái kế tiếp, bất kể A' thực tế là gì",
        Q_Stap: "Q của từng a' ở trạng thái kế tiếp: max được lấy trên các giá trị này"
      }
    },

    vfa: {
      name: "Xấp xỉ hàm giá trị (VFA)",
      whatChanged: "Bảng Q → hàm có tham số Q_θ: vượt giới hạn |S|×|A| quá lớn, chuyển từ dạng bảng sang học tăng cường sâu",
      keyInsight: "“Bộ ba chết người”: xấp xỉ hàm + bootstrap + khác chính sách cùng lúc thì TD có thể phân kỳ",
      flashcard: "Bảng Q → Q_θ. Dạng tuyến tính đã được hiểu rõ, nhưng hàm sâu + bootstrap + khác chính sách là “bộ ba chết người”. DQN chế ngự nó bằng phát lại kinh nghiệm và mạng mục tiêu.",
      textbook: "Bước đi tất yếu: ảnh xám 84×84 với 256 mức đã có khoảng 10^17000 khả năng. Kết quả kinh điển với VFA tuyến tính: TD cùng chính sách hội tụ, TD khác chính sách có thể phân kỳ. Sutton & Barto gọi xấp xỉ hàm + bootstrap + khác chính sách là “bộ ba chết người”, khi đó TD không còn bảo đảm hội tụ. VFA mở ra hai nhánh dựa trên giá trị và dựa trên chính sách.",
      meanings: {
        J_theta: "Hàm mục tiêu: trung bình bình phương sai số TD",
        theta: "Tham số của hàm. Tuyến tính: θ∈ℝ^d; sâu: trọng số mạng nơ-ron",
        d_dist: "Phân phối trạng thái-hành động: nguồn mẫu huấn luyện",
        y_t: "Mục tiêu TD (ở đây theo dạng Q-learning)",
        Q_theta: "Hàm Q có tham số: thay cho bảng Q",
        r_immediate: "Phần thưởng tức thời",
        gamma: "Hệ số chiết khấu",
        max_ap: "Lấy max trên hành động kế tiếp"
      }
    },

    dqn: {
      name: "Mạng Q sâu (DQN)",
      whatChanged: "Ba cải tiến kỹ thuật chế ngự bộ ba chết người: CNN Q_θ + bộ đệm phát lại 𝒟 + mạng mục tiêu θ⁻",
      keyInsight: "Một thuật toán, một bộ siêu tham số đạt mức con người ở nhiều game Atari: mở đầu kỷ nguyên học tăng cường sâu",
      flashcard: "Q-learning + CNN + hai kỹ thuật (phát lại kinh nghiệm, mạng mục tiêu). Mở đầu kỷ nguyên học tăng cường sâu.",
      textbook: "Ba cải tiến chống bộ ba chết người: (1) phát lại kinh nghiệm, lấy minibatch đều để phá tương quan; (2) mạng mục tiêu, mục tiêu TD dùng tham số cũ θ⁻; (3) cắt phần thưởng để thống nhất thang đo. Trên 49 game Atari, cùng một kiến trúc và bộ siêu tham số đạt mức con người ở nhiều game. Các vấn đề còn lại dẫn tới Double, Dueling, PER, C51 và Rainbow.",
      meanings: {
        L_theta: "Hàm mất mát: được cực tiểu hóa bằng SGD",
        theta: "Tham số mạng trực tuyến: cập nhật mỗi bước bằng SGD",
        D_replay: "Bộ đệm phát lại kinh nghiệm: phá tương quan thời gian, gần với i.i.d.",
        r_immediate: "Phần thưởng tức thời (thường cắt về ±1)",
        gamma: "Hệ số chiết khấu",
        theta_minus: "Tham số mạng mục tiêu: sao chép từ θ sau mỗi C bước, giữ mục tiêu cố định",
        Q_theta_minus: "Q của mạng mục tiêu tại s': dùng cho mục tiêu TD, phá sự tự tham chiếu",
        max_ap: "Tham lam trên hành động kế tiếp",
        Q_theta_sa: "Ước lượng Q của mạng trực tuyến: cần giảm khoảng cách tới mục tiêu"
      }
    },
    double_dqn: {
      name: "Double DQN (DQN kép)",
      whatChanged: "Tách “chọn hành động” và “đánh giá hành động” trong max bằng hai mạng: giảm độ chệch lạc quan",
      keyInsight: "Tận dụng mạng mục tiêu sẵn có của DQN: θ chọn, θ⁻ đánh giá. Sửa một dòng, lợi ích lớn",
      flashcard: "Mạng trực tuyến chọn hành động, mạng mục tiêu đánh giá, không để một mạng làm cả hai. Một dòng thay đổi giúp giảm đánh giá quá cao của Q-learning.",
      textbook: "Thay đổi rất nhỏ, lợi ích đáng kể. Độ chệch E[max Q] − max E[Q] ≥ 0 đến từ bất đẳng thức Jensen, và tăng theo nhiễu của Q và |A|. Trên Atari, Double DQN cải thiện rõ ở nhiều game. Các phương pháp sau như Dueling, Rainbow đều dùng mặc định.",
      meanings: {
        y_ddqn: "Mục tiêu TD của Double DQN: thay cho dạng max của DQN",
        r_immediate: "Phần thưởng tức thời",
        gamma: "Hệ số chiết khấu",
        theta_minus_eval: "Mạng mục tiêu: lo phần đánh giá (cho giá trị Q)",
        theta_select: "Mạng trực tuyến: lo phần chọn hành động (arg max)",
        argmax_ap: "θ chọn hành động tốt nhất, θ⁻ đánh giá nó: mấu chốt của việc tách"
      }
    },
    dueling_dqn: {
      name: "Dueling DQN (DQN đối đầu)",
      whatChanged: "Đổi kiến trúc: tách Q thành V(s) + A(s,a), học riêng giá trị trạng thái và lợi thế hành động",
      keyInsight: "Ở nhiều trạng thái, chọn hành động nào không quan trọng; Dueling đưa tiên nghiệm này vào kiến trúc mạng",
      flashcard: "Q = V + A: giá trị trạng thái cộng lợi thế của hành động. Học nhanh hơn rõ rệt khi nhiều trạng thái ít phụ thuộc vào hành động.",
      textbook: "CNN dùng chung tách thành hai nhánh kết nối đầy đủ: V vô hướng và A có |𝒜| chiều. Trừ đi trung bình để loại bỏ sự tương đương V+c, A−c, làm V và A xác định duy nhất. Gradient qua V cập nhật Q của mọi hành động cùng lúc, hiệu quả hơn khi |𝒜| lớn. Là một thành phần của Rainbow.",
      meanings: {
        Q_theta_sa: "Giá trị Q cuối cùng: ghép từ hai nhánh V và A",
        V_theta_s: "Nhánh giá trị trạng thái: “s tốt đến đâu”, không phụ thuộc hành động",
        A_theta_sa: "Nhánh lợi thế: “a tốt hơn trung bình bao nhiêu”",
        A_card: "Kích thước không gian hành động: dùng để trừ trung bình",
        sum_ap: "Tổng trên mọi hành động: để tính trung bình của A",
        A_mean: "Trung bình lợi thế: trừ đi để khắc phục việc V và A không xác định duy nhất"
      }
    },
    per: {
      name: "Phát lại kinh nghiệm ưu tiên (PER)",
      whatChanged: "Thay lấy mẫu đều bằng lấy mẫu theo |sai số TD|: phát lại nhiều hơn các mẫu “bất ngờ”",
      keyInsight: "Lấy mẫu không đều làm gradient bị chệch; sửa bằng trọng số quan trọng w_i, tăng dần β từ 0,4 lên 1",
      flashcard: "“Mẫu khó xem nhiều lần”: lấy mẫu tỉ lệ với |sai số TD|, dùng trọng số quan trọng để sửa độ chệch. Độc lập với Double và Dueling.",
      textbook: "Phần lớn mẫu trong 𝒟 đã học xong (|δ| nhỏ), lấy mẫu đều gây lãng phí tính toán. PER dùng cấu trúc SumTree để lấy mẫu trong O(log N), xác suất tỉ lệ với |δ|^α. Lấy mẫu không đều làm gradient bị chệch, trọng số quan trọng sẽ sửa lại. Biến thể theo thứ hạng dùng p=1/rank để bền vững hơn.",
      meanings: {
        P_i: "Xác suất lấy mẫu chuyển tiếp thứ i",
        p_i: "Độ ưu tiên: |sai số TD| + hằng số nhỏ ε để tránh bằng 0",
        delta_i: "Sai số TD của mẫu thứ i: càng lớn càng “bất ngờ”",
        epsilon_pri: "Hằng số nhỏ: bảo đảm p_i > 0",
        alpha_pri: "Mức độ ưu tiên: 0 là đều, 1 là tỉ lệ hoàn toàn (thường 0,6)",
        sum_k: "Hằng số chuẩn hóa: tổng độ ưu tiên trong bộ đệm",
        w_i: "Trọng số quan trọng: sửa độ chệch do lấy mẫu không đều",
        N_buffer: "Tổng số mẫu trong bộ đệm",
        beta_pri: "Mức độ sửa của trọng số quan trọng: tăng tuyến tính từ 0,4 lên 1"
      }
    },
    multistep_dqn: {
      name: "DQN nhiều bước",
      whatChanged: "Mục tiêu TD 1 bước của DQN → n bước: nhanh hơn rõ rệt khi phần thưởng thưa",
      keyInsight: "n nhỏ (Rainbow dùng n=3) giữ độ chệch khác chính sách ở mức chấp nhận được, lợi ích thực nghiệm lớn",
      flashcard: "Mục tiêu của DQN đổi từ 1 bước sang n bước. Nhanh hơn rõ rệt khi phần thưởng thưa; cái giá là độ chệch khác chính sách nhẹ.",
      textbook: "DQN 1 bước chậm khi phần thưởng thưa: phần thưởng phải lan ngược dọc theo quỹ đạo. n bước đưa thẳng n phần thưởng thật vào mục tiêu. DQN là khác chính sách nên n bước đúng nghĩa cần hiệu chỉnh trọng số quan trọng; trong thực tế với n nhỏ thường bỏ qua mà vẫn có lợi, như Rainbow. Retrace và V-trace là các phiên bản hiệu chỉnh có cơ sở hơn.",
      meanings: {
        y_n: "Mục tiêu TD n bước: thay cho mục tiêu 1 bước",
        sum_k: "Tổng n phần thưởng thật",
        gamma_k: "Trọng số chiết khấu của phần thưởng bước k",
        R_tkp1: "Phần thưởng thật ở bước k+1",
        gamma_n: "Chiết khấu của số hạng bootstrap sau n bước",
        max_ap: "Tham lam trên hành động kế tiếp",
        Q_theta_minus_tn: "Q của mạng mục tiêu tại trạng thái sau n bước: số hạng bootstrap"
      }
    },
    noisy_nets: {
      name: "Mạng nhiễu (Noisy Networks)",
      whatChanged: "Thay ε-tham lam không phụ thuộc trạng thái bằng nhiễu tham số học được trong trọng số",
      keyInsight: "Mạng tự học chỗ cần khám phá: σ lớn là chưa chắc nên khám phá, σ→0 là đã học nên khai thác",
      flashcard: "Thay ε-tham lam bằng nhiễu ở trọng số. Mạng tự học chỗ cần khám phá, thông minh hơn ε cố định.",
      textbook: "Nhược điểm của ε-tham lam: cùng một xác suất ngẫu nhiên ở mọi trạng thái, lãng phí ở chỗ đã học, thiếu ở chỗ khó. NoisyNet thay mỗi trọng số bằng phân phối N(μ,σ²), lấy mẫu khi truyền xuôi. σ được học bằng lan truyền ngược, tương đương khám phá thích nghi theo trạng thái. Là một thành phần của Rainbow. Liên quan: Bootstrapped DQN, lấy mẫu hậu nghiệm.",
      meanings: {
        y_out: "Đầu ra của lớp: có chứa nhiễu",
        mu_w: "Tham số trung bình của trọng số: học được",
        sigma_w: "Tham số độ lệch chuẩn của trọng số: quyết định mức khám phá, học được",
        epsilon_w: "Mẫu nhiễu của trọng số: ~N(0,1) ở mỗi lần truyền xuôi",
        odot: "Tích theo từng phần tử: nhiễu áp dụng cho từng vị trí",
        x_in: "Đầu vào của lớp",
        mu_b: "Trung bình của độ dời (bias)",
        sigma_b: "Độ lệch chuẩn của độ dời (bias)",
        epsilon_b: "Mẫu nhiễu của độ dời (bias)"
      }
    },
    rainbow: {
      name: "Rainbow DQN",
      whatChanged: "Kết hợp sáu cải tiến của DQN: Double + Dueling + PER + nhiều bước + NoisyNet + C51",
      keyInsight: "Thí nghiệm loại bỏ từng thành phần cho thấy PER và nhiều bước đóng góp lớn nhất, Double và Dueling ít nhất",
      flashcard: "Bản “gộp tất cả” của DQN: Double + Dueling + PER + nhiều bước + NoisyNet + C51. Hiệu năng hàng đầu trên Atari 200 triệu khung hình khi công bố.",
      textbook: "Bật cả sáu cải tiến cùng lúc. Thí nghiệm loại bỏ: bỏ PER hoặc nhiều bước làm hiệu năng giảm nhiều nhất, tiếp theo là C51 và NoisyNet; bỏ Double hoặc Dueling ảnh hưởng ít nhất. Trên Atari 200 triệu khung hình, điểm trung vị chuẩn hóa theo con người đạt 223%. Sau đó có các hướng khác như IQN (phân phối) và MuZero (có mô hình).",
      meanings: {
        rainbow_combo: "Tổ hợp của sáu thành phần",
        double_c: "Double DQN: tách chọn và đánh giá hành động",
        dueling_c: "Dueling: kiến trúc Q = V + A",
        per_c: "Phát lại ưu tiên: lấy mẫu theo |δ|",
        multistep_c: "Mục tiêu TD n bước",
        noisy_c: "Khám phá bằng nhiễu tham số",
        c51_c: "Học toàn bộ phân phối giá trị, không chỉ kỳ vọng"
      }
    },
    c51: {
      name: "C51 (DQN phân loại)",
      whatChanged: "Học toàn bộ phân phối lợi tức Z(s,a) thay vì kỳ vọng Q(s,a): khởi đầu của học tăng cường phân phối",
      keyInsight: "Cùng một kỳ vọng Q có thể đến từ các phân phối rủi ro rất khác nhau; học phân phối cho nhiều thông tin hơn",
      flashcard: "Không học Q vô hướng nữa, mà học xác suất trên 51 nguyên tử cố định. Cùng kỳ vọng Q có thể che giấu rủi ro rất khác nhau.",
      textbook: "Dùng 51 nguyên tử cách đều phủ [V_min, V_max]; mạng xuất softmax kích thước |𝒜|×51 cho phân phối lợi tức của từng hành động. Khi cập nhật, chiếu phân phối mục tiêu TD về các nguyên tử cố định rồi cực tiểu hóa entropy chéo (tương đương phân kỳ KL). Vượt trội DQN trên Atari, gợi mở QR-DQN, IQN, FQF.",
      meanings: {
        Z_sa: "Phân phối rời rạc của lợi tức trên 51 nguyên tử",
        p_i: "Xác suất của nguyên tử thứ i: đầu ra softmax",
        delta_zi: "Delta Dirac tại z_i: nguyên tử rời rạc",
        z_i: "Vị trí nguyên tử thứ i: cách đều trong [V_min, V_max]",
        V_min: "Lợi tức nhỏ nhất (thường là −10)",
        delta_z: "Khoảng cách giữa các nguyên tử = (V_max−V_min)/50"
      }
    },
    qr_dqn: {
      name: "QR-DQN (hồi quy phân vị)",
      whatChanged: "C51 học xác suất trên nguyên tử cố định; QR-DQN làm ngược lại: học vị trí của N phân vị cố định",
      keyInsight: "Mất mát hồi quy phân vị gắn với khoảng cách Wasserstein, thích hợp về lý thuyết hơn KL của C51",
      flashcard: "C51 học xác suất trên nguyên tử cố định; QR-DQN học vị trí N phân vị. Cơ sở lý thuyết tốt hơn, không cần siêu tham số V_min/V_max.",
      textbook: "Toán tử Bellman phân phối không phải ánh xạ co theo KL nhưng là ánh xạ co theo Wasserstein, và QR-DQN cực tiểu hóa đúng khoảng cách này qua hồi quy phân vị. Không cần V_min/V_max nên thích nghi tốt hơn. Vượt C51 trên Atari. Sau đó IQN tổng quát từ phân vị cố định lên hàm phân vị ngầm.",
      meanings: {
        L_qr: "Mất mát hồi quy phân vị",
        N_quant: "Số phân vị (thường là 200)",
        rho_tau: "Mất mát Huber phân vị: L1 bất đối xứng có trọng số τ",
        y_target: "Mẫu từ phân phối mục tiêu TD",
        theta_i: "Vị trí phân vị thứ i: đầu ra của mạng",
        tau_i: "Mức phân vị thứ i: cách đều, (2i−1)/(2N)"
      }
    },
    iqn: {
      name: "IQN (mạng phân vị ngầm)",
      whatChanged: "QR-DQN cố định N phân vị; IQN nhận mức phân vị τ làm đầu vào: hàm phân vị ngầm",
      keyInsight: "Mạng thành hàm (s,a,τ) ↦ Z: truy vấn được phân vị bất kỳ, hỗ trợ chính sách nhạy với rủi ro",
      flashcard: "QR-DQN cố định N phân vị; IQN nhận τ làm đầu vào. Truy vấn được phân vị bất kỳ, hỗ trợ chính sách nhạy với rủi ro (như CVaR).",
      textbook: "IQN lấy mẫu τ ngẫu nhiên khi huấn luyện để học cả hàm phân vị. Ưu điểm: (1) không cố định một lưới phân vị; (2) nhạy với rủi ro: lấy trung bình τ ∈ [0,α] được CVaR_α cho chính sách ngại rủi ro; (3) trên Atari vượt QR-DQN và tiệm cận Rainbow. FQF về sau học mức phân vị thích nghi theo trạng thái.",
      meanings: {
        Z_tau: "Giá trị phân vị ở mức τ",
        f_theta: "Mạng kết hợp: gộp đặc trưng trạng thái và nhúng τ",
        psi_sa: "Đặc trưng trạng thái-hành động (thường là đầu ra CNN)",
        phi_tau: "Nhúng của mức phân vị (thường dùng cơ sở cosin)",
        tau_uniform: "Mức phân vị: lấy mẫu từ U[0,1] khi huấn luyện"
      }
    },

    reinforce: {
      name: "REINFORCE",
      whatChanged: "Đổi góc nhìn căn bản: không học giá trị rồi chọn tham lam nữa, mà lấy gradient trực tiếp theo tham số θ của chính sách",
      keyInsight: "Dạng gradient chính sách ∇J(θ) = E[∇log π · Q]: đẩy tăng xác suất của “hành động tốt”",
      flashcard: "Thuật toán gradient chính sách kinh điển. Dùng lợi tức MC G_t để đánh giá hành động, “hành động tốt có xác suất cao hơn”. Đơn giản nhưng phương sai rất lớn.",
      textbook: "Williams (1992) đề xuất REINFORCE, biến tối ưu chính sách thành tối ưu khả vi; định lý gradient chính sách tổng quát do Sutton và cộng sự công bố năm 2000. Trực giác: tăng xác suất của hành động có G_t cao. Vấn đề: G_t có phương sai rất cao → thêm đường cơ sở b không phụ thuộc a → dùng V(s) làm đường cơ sở → actor-critic. REINFORCE thuần ít khi được dùng trực tiếp, nhưng là điểm khởi đầu về ý tưởng của họ gradient chính sách.",
      meanings: {
        grad_J: "Gradient của mục tiêu J theo tham số chính sách θ",
        E_pi: "Kỳ vọng trên các quỹ đạo do π_θ sinh ra",
        grad_logpi: "Gradient của log chính sách: “hướng làm tăng xác suất hành động này”",
        pi_theta: "Chính sách có tham số: softmax (rời rạc) hoặc Gauss (liên tục)",
        G_t: "Lợi tức Monte Carlo: phần thưởng chiết khấu trên cả quỹ đạo"
      }
    },
    actor_critic: {
      name: "Actor-Critic (diễn viên-nhà phê bình)",
      whatChanged: "Thay lợi tức MC G_t của REINFORCE bằng lợi thế A do critic ước lượng: giảm mạnh phương sai",
      keyInsight: "Actor học π_θ, critic học V_w làm đường cơ sở cho actor: hai mạng phối hợp",
      flashcard: "Hai mạng: actor học π, critic học V. Dùng A = Q − V thay cho G_t, giảm mạnh phương sai.",
      textbook: "Actor xuất π_θ(a|s), critic xuất V_w(s). Actor cập nhật bằng gradient chính sách, critic cập nhật bằng TD. Thường dùng A^π(s,a) ≈ r + γV(s') − V(s), tức sai số TD một bước làm ước lượng lợi thế. Cập nhật trực tuyến được, phương sai thấp hơn nhiều so với REINFORCE. Các thuật toán hiện đại như A2C, A3C, PPO, SAC đều dựa trên actor-critic.",
      meanings: {
        grad_J: "Gradient của mục tiêu chính sách",
        grad_logpi: "Hướng gradient chính sách của actor",
        pi_theta: "Actor: chính sách có tham số",
        A_pi: "Hàm lợi thế: “hành động này tốt hơn trung bình bao nhiêu”",
        Q_pi: "Giá trị hành động",
        V_pi: "Giá trị trạng thái: đầu ra của critic, làm đường cơ sở"
      }
    },
    trpo: {
      name: "Tối ưu chính sách vùng tin cậy (TRPO)",
      whatChanged: "Thêm ràng buộc phân kỳ KL để giới hạn mỗi lần cập nhật chính sách, nhắm tới cải thiện đơn điệu",
      keyInsight: "Bước quá lớn dễ làm chính sách sụp đổ. TRPO vạch một “vùng tin cậy” và chỉ cập nhật trong đó",
      flashcard: "TRPO tối ưu cận dưới (theo kiểu MM) có đảm bảo cải thiện đơn điệu về lý thuyết, đưa về bài toán có ràng buộc KL.",
      textbook: "Gradient chính sách thông thường khó chọn bước nhảy. TRPO dùng gradient tự nhiên và gradient liên hợp để giải bài toán tối ưu có ràng buộc. Tính toán phức tạp hơn nhưng cập nhật rất ổn định.",
      meanings: {
        ratio: "Tỉ số lấy mẫu quan trọng: mức thay đổi giữa chính sách mới và cũ",
        A_hat: "Ước lượng lợi thế (thường dùng GAE)",
        KL: "Phân kỳ KL: khoảng cách giữa phân phối hành động của chính sách mới và cũ",
        delta: "Ngưỡng vùng tin cậy: KL lớn nhất cho phép khi cập nhật"
      }
    },
    ppo: {
      name: "Tối ưu chính sách cận kề (PPO)",
      whatChanged: "Thay ràng buộc KL và gradient liên hợp phức tạp của TRPO bằng phép cắt đơn giản",
      keyInsight: "Một hàm clip đơn giản đạt tác dụng tương tự TRPO, dễ cài đặt mà hiệu quả tốt",
      flashcard: "PPO giữ tinh thần giới hạn cập nhật của TRPO nhưng đơn giản hơn nhiều. Phép cắt ngăn tỉ số xác suất lệch quá xa 1, và đã trở thành lựa chọn phổ biến trong thực tế.",
      textbook: "PPO đặt trọng tâm vào tính thực dụng. Nó chỉ cắt theo hướng làm mục tiêu xấu đi và đổi đảm bảo lý thuyết của TRPO lấy sự đơn giản: PPO không có đảm bảo cải thiện đơn điệu. Nhờ bền vững và dễ cài đặt, PPO là thuật toán mặc định trong nhiều ứng dụng, kể cả RLHF.",
      meanings: {
        r_t: "Tỉ số xác suất (chính sách mới / chính sách cũ)",
        A_hat: "Ước lượng lợi thế của hành động hiện tại",
        clip: "Hàm cắt: buộc tỉ số nằm trong biên",
        epsilon: "Siêu tham số cắt (thường là 0,2)"
      }
    },

    ddpg: {
      name: "Gradient chính sách tất định sâu (DDPG)",
      whatChanged: "Mở rộng DQN sang không gian hành động liên tục: actor xuất thẳng một vectơ hành động tất định",
      keyInsight: "Critic cung cấp gradient theo hành động để hướng dẫn actor tất định, như DQN cho điều khiển liên tục",
      flashcard: "Khi hành động liên tục nhiều chiều, phép max của DQN không tính được. DDPG cho mạng xuất thẳng hành động.",
      textbook: "DDPG dựa trên định lý gradient chính sách tất định (DPG). Actor xuất hành động cụ thể μ(s), critic đánh giá Q(s, μ(s)). Theo quy tắc chuỗi, gradient của Q theo a được truyền về để cập nhật actor. Đồng thời mượn phát lại kinh nghiệm và mạng mục tiêu của DQN.",
      meanings: {
        mu_s: "Hành động liên tục tất định do mạng actor xuất ra",
        nabla_a_Q: "Đạo hàm của critic theo hành động: chỉ hướng cải thiện hành động",
        nabla_mu: "Ma trận Jacobi của mạng actor"
      }
    },
    td3: {
      name: "DDPG trễ kép (TD3)",
      whatChanged: "Xử lý đánh giá quá cao của DDPG: hai critic lấy giá trị nhỏ hơn, thêm nhiễu vào hành động mục tiêu",
      keyInsight: "DDPG với hai critic khắt khe: luôn nghe điểm thấp hơn để tránh lạc quan quá mức",
      flashcard: "TD3 khắc phục việc DDPG dễ tích lũy độ chệch đánh giá quá cao khiến chính sách sụp đổ, bằng ba kỹ thuật cốt lõi.",
      textbook: "Ba cải tiến: 1) Q-learning kép có cắt (lấy min của hai critic); 2) làm mượt chính sách mục tiêu (thêm nhiễu có cắt vào hành động khi tính mục tiêu TD, tránh quá khớp vào đỉnh hẹp); 3) trễ cập nhật chính sách (critic cập nhật nhiều lần mới cập nhật actor một lần, để Q đủ chính xác trước khi dẫn hướng actor).",
      meanings: {
        min_Q: "Cơ chế hai critic: lấy giá trị nhỏ hơn để tránh đánh giá quá cao",
        target_noise: "Nhiễu làm mượt chính sách mục tiêu: buộc giá trị của các hành động lân cận phải mượt",
        clip_noise: "Nhiễu Gauss có cắt: tránh nhiễu quá lớn làm đổi bản chất hành động"
      }
    },
    sac: {
      name: "Soft Actor-Critic (SAC)",
      whatChanged: "Dùng khung entropy cực đại: vừa tối đa phần thưởng, vừa giữ chính sách càng ngẫu nhiên càng tốt",
      keyInsight: "Tối đa cả phần thưởng lẫn entropy giúp khám phá tốt và bền vững, là thuật toán khác chính sách rất mạnh",
      flashcard: "Thuật toán khác chính sách hàng đầu cho điều khiển liên tục. Khuyến khích khám phá sẵn trong mục tiêu; các phiên bản sau tự điều chỉnh nhiệt độ α.",
      textbook: "SAC dùng hai critic và thủ thuật tái tham số hóa. Actor xuất tham số phân phối Gauss thay vì hành động tất định. Số hạng entropy khuyến khích tìm nhiều đường tốt, giúp bền vững trước nhiễu loạn và có hiệu quả mẫu cao.",
      meanings: {
        entropy: "Entropy Shannon của chính sách: đo độ ngẫu nhiên của phân phối hành động",
        alpha_temp: "Tham số nhiệt độ: cân bằng khám phá và khai thác",
        reward: "Phần thưởng môi trường tức thời thông thường"
      }
    },
    dreamerv3: {
      name: "Dreamer V3",
      whatChanged: "Học mô hình thế giới trong không gian ẩn (RSSM) và huấn luyện actor-critic hoàn toàn trên các “giấc mơ” ẩn",
      keyInsight: "Nén thế giới nhiều chiều thành mã rời rạc rồi tua nhanh tương lai trong “đầu” để học",
      flashcard: "Mốc tham chiếu hiện đại của mô hình thế giới: nén điểm ảnh vào không gian ẩn và huấn luyện trên quỹ đạo tưởng tượng, đủ để học chơi Minecraft.",
      textbook: "Dùng RSSM nén điểm ảnh vào không gian ẩn rời rạc và dự đoán về phía trước. Actor và critic chỉ tính gradient trên các quỹ đạo do mô hình thế giới tưởng tượng trong không gian ẩn, tách khỏi môi trường thật. Nhờ đó giải được các nhiệm vụ thị giác dài hạn khó với lượng tương tác tương đối ít.",
      meanings: {
        s_t: "Vectơ trạng thái trong không gian ẩn, không phải điểm ảnh thật",
        x_t: "Quan sát nhiều chiều của môi trường thật (như ảnh)",
        q_phi: "Quỹ đạo dự đoán nhiều bước trong không gian ẩn"
      }
    },

    bcq: {
      name: "Q-learning ràng buộc theo lô (BCQ)",
      whatChanged: "Giới hạn chính sách vào các hành động gần với dữ liệu ngoại tuyến, tránh sai số ngoại suy của hành động ngoài phân phối (OOD)",
      keyInsight: "Khắc phục sự tự tin mù quáng khi chỉ học từ dữ liệu có sẵn: không thử các hành động chưa thấy, dùng mô hình sinh làm chốt chặn",
      flashcard: "Điểm yếu cốt lõi của học ngoại tuyến là sai số ngoại suy. BCQ dùng VAE để mô hình hóa phân phối dữ liệu.",
      textbook: "Trên tập dữ liệu thuần ngoại tuyến, mạng dễ đánh giá quá cao các cặp trạng thái-hành động ngoài phân phối (OOD). BCQ dùng VAE sinh các hành động có xác suất cao trong dữ liệu, sau đó tinh chỉnh nhỏ bằng mạng nhiễu loạn và chỉ lấy max Q trên tập an toàn này.",
      meanings: {
        G_omega: "Bộ sinh dùng VAE để mô hình hóa phân phối hành vi",
        xi_phi: "Mạng nhiễu loạn phạm vi nhỏ: tinh chỉnh quanh hành động đã biết",
        a_i: "Hành động an toàn lấy mẫu từ VAE"
      }
    },
    cql: {
      name: "Q-learning thận trọng (CQL)",
      whatChanged: "Thêm số hạng điều chuẩn vào hàm mất mát để chủ động đẩy giá trị Q của hành động ngoài phân phối xuống",
      keyInsight: "Bi quan trước điều chưa biết: thứ không có trong dữ liệu thì mặc định là kém",
      flashcard: "Thêm phạt vào sai số Bellman để giá trị học được là một cận dưới của giá trị thực.",
      textbook: "CQL đẩy Q của các hành động do chính sách sinh ra xuống, đồng thời nâng Q của hành động trong dữ liệu lên. Sự bi quan này tránh đánh giá quá cao hành động OOD và cho ước lượng là cận dưới của giá trị chính sách, nên phù hợp với triển khai ngoại tuyến.",
      meanings: {
        logsumexp: "Số hạng phạt: đẩy Q của mọi hành động xuống, đặc biệt là hành động có Q lớn",
        data_Q: "Số hạng bù: nâng Q của hành động thật trong dữ liệu",
        bellman_err: "Sai số Bellman thông thường"
      }
    },
    decision_transformer: {
      name: "Decision Transformer (DT)",
      whatChanged: "Bỏ phương trình Bellman và cập nhật TD, chuyển học tăng cường thành bài toán mô hình hóa chuỗi",
      keyInsight: "Xem học tăng cường như xử lý ngôn ngữ: đưa vào “mục tiêu 1000 điểm, đang ở trạng thái S”, mô hình sinh hành động tương ứng",
      flashcard: "Đổi cách tiếp cận: dùng Transformer dự đoán chuỗi (lợi tức mong muốn, trạng thái, hành động) như dự đoán văn bản.",
      textbook: "Không ước lượng giá trị, không tính sai số TD. Khi huấn luyện, tính lợi tức còn lại (return-to-go) trên quỹ đạo, ghép thành chuỗi và huấn luyện mô hình kiểu GPT bằng entropy chéo (hành động rời rạc) hoặc sai số bình phương (hành động liên tục). Khi chạy, đặt một lợi tức mong muốn cao, cơ chế tự hồi quy sẽ sinh chuỗi hành động hướng tới lợi tức đó.",
      meanings: {
        R_hat: "Lợi tức còn lại (return-to-go): phần lợi tức tương lai mong muốn",
        state_action: "Trạng thái và hành động được xem như token trong chuỗi"
      }
    },

    icm: {
      name: "Mô-đun tò mò nội tại (ICM)",
      whatChanged: "Dùng sai số dự đoán trạng thái tương lai trong không gian đặc trưng làm phần thưởng nội tại để thúc đẩy khám phá",
      keyInsight: "Tò mò là “điều bất ngờ”: tự thưởng khi dự đoán sai, nhưng bỏ qua nhiễu trắng không kiểm soát được",
      flashcard: "Trong môi trường phần thưởng cực thưa (như Mario), tác tử tự phát thưởng: dự đoán sai càng nhiều, thưởng càng lớn.",
      textbook: "ICM huấn luyện mô hình xuôi để dự đoán hậu quả của hành động. Để tránh bị hút vào nhiễu không dự đoán được nhưng vô nghĩa (như lá cây rung, “TV nhiễu”), trước hết nó dùng mô hình ngược để học không gian đặc trưng φ chỉ giữ phần chịu ảnh hưởng của tác tử, rồi tính sai số dự đoán trong đó làm phần thưởng tò mò.",
      meanings: {
        phi_pred: "Đặc trưng ẩn của trạng thái kế tiếp do mô hình xuôi dự đoán",
        phi_true: "Đặc trưng ẩn của trạng thái kế tiếp thực tế",
        intrinsic_r: "Phần thưởng nội tại dựa trên mức độ “bất ngờ”"
      }
    },

    rlhf: {
      name: "Học tăng cường từ phản hồi con người (RLHF)",
      whatChanged: "Dùng dữ liệu sở thích của con người huấn luyện mô hình phần thưởng, thay cho điểm số môi trường tường minh",
      keyInsight: "Huấn luyện một “giám khảo” mô phỏng sở thích con người, rồi dùng PPO để làm giám khảo hài lòng",
      flashcard: "Kỹ thuật cốt lõi của InstructGPT: xem mô hình ngôn ngữ lớn là tác tử, mô hình phần thưởng đóng vai trò môi trường.",
      textbook: "Vì không thể viết code định nghĩa “câu trả lời con người thích”, RLHF gồm ba bước: 1) tinh chỉnh có giám sát (SFT); 2) con người xếp hạng câu trả lời để huấn luyện mô hình phần thưởng; 3) dùng PPO kèm phạt KL để câu trả lời của LLM đạt điểm cao mà không lệch xa mô hình SFT.",
      meanings: {
        reward_model: "Điểm do mô hình phần thưởng đã học (giám khảo) đưa ra",
        kl_penalty: "Số hạng phạt KL: tránh mô hình lệch quá xa năng lực ngôn ngữ ban đầu chỉ để lấy điểm",
        pi_RL: "Chính sách mô hình ngôn ngữ đang được tối ưu bằng học tăng cường"
      }
    },
    dpo: {
      name: "Tối ưu sở thích trực tiếp (DPO)",
      whatChanged: "Dùng tương đương toán học để bỏ hẳn mô hình phần thưởng và PPO, đưa RLHF về một hàm mất mát phân loại có giám sát",
      keyInsight: "RLHF tinh gọn: tăng trực tiếp xác suất câu trả lời tốt, giảm xác suất câu trả lời kém",
      flashcard: "Suy dẫn dạng đóng đưa mục tiêu học tăng cường về hàm mất mát kiểu đối sánh. Không cần huấn luyện riêng mô hình phần thưởng, cũng không cần PPO.",
      textbook: "DPO giải dạng đóng cho mục tiêu học tăng cường có ràng buộc KL, thế vào mô hình sở thích Bradley-Terry, từ đó xem chính LLM là mô hình phần thưởng ẩn. Chỉ cần mô hình đang huấn luyện và mô hình tham chiếu nên tiết kiệm bộ nhớ, đồng thời đơn giản hóa quy trình căn chỉnh.",
      meanings: {
        y_w_y_l: "Câu trả lời thắng (win) và thua (lose) cho cùng một prompt",
        pi_ref: "Xác suất từ mô hình tham chiếu (thường là mô hình SFT)",
        pi_theta: "Xác suất câu trả lời theo mô hình đang huấn luyện"
      }
    },
    grpo: {
      name: "Tối ưu chính sách tương đối theo nhóm (GRPO)",
      whatChanged: "Bỏ mạng critic: chuẩn hóa điểm của nhiều mẫu cho cùng một prompt ngay trong nhóm để tính lợi thế",
      keyInsight: "Sinh nhiều câu trả lời cho một câu hỏi: cao hơn trung bình nhóm thì thưởng, thấp hơn thì phạt, tiết kiệm bộ nhớ của critic",
      flashcard: "Biến thể PPO do DeepSeek đề xuất: dùng trung bình và độ lệch chuẩn của nhóm làm đường cơ sở, bỏ mạng critic.",
      textbook: "PPO thông thường cần critic để ước lượng đường cơ sở, với LLM thì mạng này rất tốn bộ nhớ. GRPO tận dụng khả năng sinh theo lô, tạo một nhóm câu trả lời cho mỗi prompt và dùng trung bình, độ lệch chuẩn điểm của nhóm thay đường cơ sở, nhờ đó bỏ hẳn critic.",
      meanings: {
        A_hat_ij: "Lợi thế trong nhóm của câu trả lời j cho prompt i",
        r_ij: "Điểm của câu trả lời, do quy tắc hoặc mô hình phần thưởng đưa ra",
        mean_r: "Điểm trung bình trong nhóm: thay cho đường cơ sở do critic dự đoán"
      }
    }
  },

  // Vị trí trong sách (chỉ các nội dung có trong giáo trình). Node không có ở đây là phần mở rộng.
  book: {
    basic_concepts: [["chapter1/chapter1_vi", "Chương 1"], ["chapter2/chapter2_vi", "Chương 2, mục 2.3"]],
    bellman_equation: [["chapter2/chapter2_vi", "Chương 2"]],
    bellman_optimality: [["chapter2/chapter2_vi", "Chương 2, mục 2.3"]],
    value_iteration: [["chapter2/chapter2_vi", "Chương 2, mục 2.3"]],
    policy_iteration: [["chapter2/chapter2_vi", "Chương 2, mục 2.3"]],
    monte_carlo: [["chapter3/chapter3_vi", "Chương 3, mục 3.3"]],
    td_zero: [["chapter3/chapter3_vi", "Chương 3, mục 3.3"]],
    n_step_td: [["chapter3/chapter3_vi", "Chương 3, mục 3.3"]],
    sarsa: [["chapter3/chapter3_vi", "Chương 3, mục 3.4"]],
    q_learning: [["chapter3/chapter3_vi", "Chương 3, mục 3.4"]],
    vfa: [["chapter6/chapter6_vi", "Chương 6, mục 6.1–6.2"]],
    dqn: [["chapter6/chapter6_vi", "Chương 6"]],
    double_dqn: [["chapter7/chapter7_vi", "Chương 7, mục 7.1"]],
    dueling_dqn: [["chapter7/chapter7_vi", "Chương 7, mục 7.2"]],
    per: [["chapter7/chapter7_vi", "Chương 7, mục 7.3"]],
    multistep_dqn: [["chapter7/chapter7_vi", "Chương 7, mục 7.4"]],
    noisy_nets: [["chapter7/chapter7_vi", "Chương 7, mục 7.5"]],
    c51: [["chapter7/chapter7_vi", "Chương 7, mục 7.6"]],
    rainbow: [["chapter7/chapter7_vi", "Chương 7, mục 7.7"]],
    reinforce: [["chapter4/chapter4_vi", "Chương 4, mục 4.3"]],
    actor_critic: [["chapter9/chapter9_vi", "Chương 9"]],
    trpo: [["chapter5/chapter5_vi", "Chương 5 (nhắc đến khi so sánh với PPO)"]],
    ppo: [["chapter5/chapter5_vi", "Chương 5, mục 5.2"]],
    ddpg: [["chapter12/chapter12_vi", "Chương 12, mục 12.2"]],
    td3: [["chapter12/chapter12_vi", "Chương 12, mục 12.3"]],
    sac: [["chapter12/chapter12_vi", "Chương 12, mục 12.3 (nhắc đến khi so sánh với TD3)"]],
    dreamerv3: [["chapter14/ls-imagine_vi", "Bài đọc LS-Imagine (phương pháp so sánh)"], ["chapter16/chapter16_vi", "Chương 16 (bản chất mô hình thế giới)"]],
    icm: [["chapter10/chapter10_vi", "Chương 10, mục 10.2"]]
  }
};
