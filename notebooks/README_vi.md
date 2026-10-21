# Code đi kèm Sách Nấm

## Hướng dẫn cài đặt

Hiện tại hỗ trợ Python 3.7 và Gym phiên bản 0.25.2.

> **Ghi chú của người dịch:** Gym đã ngừng phát triển và không còn chạy được với Python và NumPy bản mới. Trong bản dịch, toàn bộ notebook, `common/multiprocessing_env_vi.py` và hai môi trường tự viết trong `envs/` đã được chuyển sang **Gymnasium** (`import gymnasium as gym`), và `requirements.txt` đã được cập nhật. Đã thử với Python 3.13, gymnasium 1.4.0, torch 2.11 (chạy trên CPU). Output lưu sẵn trong các notebook vẫn là kết quả chạy bằng Gym cũ của bản gốc.
>
> ```bash
> python -m venv .venv && source .venv/bin/activate
> pip install -r requirements.txt
> pip install torch --index-url https://download.pytorch.org/whl/cpu  # bản chỉ dùng CPU
> ```
>
> Hướng dẫn gốc bên dưới (Python 3.7, torch 1.10) được giữ lại để tham khảo.

Tạo môi trường Conda (cần cài Anaconda trước)
```bash
conda create -n joyrl python=3.7
conda activate joyrl
pip install -r requirements.txt
```

Cài Torch:

```bash
# CPU
conda install pytorch==1.10.0 torchvision==0.11.0 torchaudio==0.10.0 cpuonly -c pytorch
# GPU
conda install pytorch==1.10.0 torchvision==0.11.0 torchaudio==0.10.0 cudatoolkit=11.3 -c pytorch -c conda-forge
# Cài bản GPU qua mirror
pip install torch==1.10.0+cu113 torchvision==0.11.0+cu113 torchaudio==0.10.0 --extra-index-url https://download.pytorch.org/whl/cu113
```
