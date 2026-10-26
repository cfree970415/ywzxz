# -*- coding: utf-8 -*-
"""运维资讯站图标生成：从 1024 高分辨率原稿缩放出 icon.png(512) / icon-192.png(192) / apple-icon.png(180) / favicon.ico(16,32,48)"""
from PIL import Image, ImageDraw

BG = (16, 24, 31, 255)        # #10181f 深色底
ACCENT = (48, 224, 137, 255)  # #30e089 终端绿

S = 1024  # 原稿尺寸，所有坐标按 512 设计稿 x2


def build():
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    # 圆角方块底
    d.rounded_rectangle([0, 0, S - 1, S - 1], radius=232, fill=BG)
    # 终端提示符 ">"：两段线 + 圆头
    w = 92  # 线宽（46*2）
    p1, p2, p3 = (296, 336), (504, 512), (296, 688)
    d.line([p1, p2, p3], fill=ACCENT, width=w, joint="curve")
    r = w / 2
    for (x, y) in (p1, p3):
        d.ellipse([x - r, y - r, x + r, y + r], fill=ACCENT)
    # 光标下划线 "_"
    d.rounded_rectangle([592, 608, 808, 700], radius=24, fill=ACCENT)
    # 运行状态绿点
    d.ellipse([742, 278, 842, 378], fill=ACCENT)
    return im


def main():
    src = build()
    out = r"C:\Users\Administrator\Desktop\hot\industry\brand"
    src.resize((512, 512), Image.LANCZOS).save(out + r"\icon.png")
    src.resize((192, 192), Image.LANCZOS).save(out + r"\icon-192.png")
    # apple-icon 原版是 RGB 无透明通道（iOS 会自己加圆角）
    apple = src.resize((180, 180), Image.LANCZOS).convert("RGB")
    apple.save(out + r"\apple-icon.png")
    # favicon.ico：16/32/48 三档
    ico_sizes = [(s, src.resize((s, s), Image.LANCZOS)) for s in (48, 32, 16)]
    ico_sizes[0][1].save(out + r"\favicon.ico", format="ICO",
                         append_images=[im for _, im in ico_sizes[1:]])
    print("done:", out)


if __name__ == "__main__":
    main()
