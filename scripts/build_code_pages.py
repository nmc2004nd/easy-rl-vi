"""Chạy code trên các trang Code rồi ghi sẵn kết quả (chữ, hình PNG, ảnh GIF) vào trang.

Trong Markdown, khối code cần chạy được đặt ngay sau dòng <!-- run --> (dòng này không hiện ra
trên trang). Các khối của một trang chạy lần lượt trong cùng một không gian biến, như notebook.
Ngay sau mỗi khối, script chèn (hoặc thay) một vùng giữa <!-- output --> và <!-- /output -->:
khối ```output chứa những gì in ra, rồi tới các hình matplotlib và GIF (viz.save_gif).
Hình lưu ở docs/img/code/<tên trang>/.

Dùng:  python3 scripts/build_code_pages.py docs/chapter3/chapter3_code_vi.md [...]
"""

import contextlib
import io
import os
import re
import shutil
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
sys.path.insert(0, str(DOCS / "code" / "py"))

import matplotlib  # noqa: E402

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402

plt.rcParams.update({"figure.dpi": 100, "font.size": 9, "savefig.bbox": "tight"})

import viz  # noqa: E402

BLOCK = re.compile(r"<!-- run -->\n```python\n(.*?)\n```\n(?:\n<!-- output -->\n.*?<!-- /output -->\n)?", re.S)


def build(md_path):
    md_path = Path(md_path).resolve()
    text = md_path.read_text()
    name = md_path.stem.removesuffix("_vi")
    fig_dir = DOCS / "img" / "code" / name
    shutil.rmtree(fig_dir, ignore_errors=True)
    fig_dir.mkdir(parents=True)
    os.environ["CODE_FIG_DIR"] = str(fig_dir)
    rel = os.path.relpath(fig_dir, md_path.parent)

    # Chạy từ docs/code/py, giống hướng dẫn "Chạy trên máy" trên trang.
    os.chdir(DOCS / "code" / "py")
    scope = {"__name__": "__main__"}
    out_parts, pos, n = [], 0, 0
    for m in BLOCK.finditer(text):
        n += 1
        code = m.group(1)
        buf = io.StringIO()
        viz.SAVED.clear()
        plt.close("all")
        t0 = time.perf_counter()
        with contextlib.redirect_stdout(buf):
            exec(compile(code, f"{md_path.name}:khối {n}", "exec"), scope)
        dt = time.perf_counter() - t0
        pieces = []
        printed = buf.getvalue().rstrip("\n")
        if printed:
            pieces.append("```output\n" + printed + "\n```")
        for k, num in enumerate(plt.get_fignums(), 1):
            fn = f"{n:02d}_{k}.png"
            plt.figure(num).savefig(fig_dir / fn)
            pieces.append(f'<div align=center><img src="{rel}/{fn}" alt="Hình do khối code vẽ"/></div>')
        plt.close("all")
        for fn in viz.SAVED:
            pieces.append(f'<div align=center><img src="{rel}/{fn}" alt="Ảnh động do khối code tạo"/></div>')
        block = "<!-- run -->\n```python\n" + code + "\n```\n"
        if pieces:
            block += "\n<!-- output -->\n" + "\n\n".join(pieces) + "\n<!-- /output -->\n"
        out_parts.append(text[pos:m.start()] + block)
        pos = m.end()
        print(f"  khối {n}: {dt:.1f} s, {len(printed.splitlines())} dòng, "
              f"{len(pieces) - bool(printed)} hình")
    out_parts.append(text[pos:])
    md_path.write_text("".join(out_parts))
    size = sum(f.stat().st_size for f in fig_dir.iterdir()) / 1024
    print(f"{md_path.relative_to(ROOT)}: {n} khối, hình {size:.0f} KB")


if __name__ == "__main__":
    for p in sys.argv[1:]:
        build(p)
