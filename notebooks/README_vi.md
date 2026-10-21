# Code đi kèm Sách Nấm

## Hướng dẫn cài đặt

Hiện tại hỗ trợ Python 3.7 và Gym phiên bản 0.25.2.

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
