"""Rebuild app/fonts/*.woff2: the latin subsets next/font/google served (Bricolage Grotesque 1.001,
Geist 1.800, Geist Mono 1.701), cut with fontTools to the weights the site uses. OFL 1.1, no Reserved
Font Name; copyright (nameID 0) and licence URL (nameID 14) are preserved by the instancer.

    python -m pip install "fonttools[woff]"      # fontTools + brotli
    python scripts/instance-fonts.py <dir holding the three original *-s.p.*.woff2 files> app/fonts
"""
import glob, os, sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

JOBS = [
    # source (Google latin file)        axis limits                  output
    ("2aa781f449db21e3-s.p.*.woff2", {"wght": 700},          "bricolage-grotesque-latin-wght-700.woff2"),  # opsz 12-96 kept
    ("caa3a2e1cccd8315-s.p.*.woff2", {"wght": (400, 600)},   "geist-latin-wght-400-600.woff2"),
    ("797e433ab948586e-s.p.*.woff2", {"wght": (400, 500)},   "geist-mono-latin-wght-400-500.woff2"),
]
src_dir, out_dir = sys.argv[1], sys.argv[2]
for pattern, limits, out in JOBS:
    (src,) = glob.glob(os.path.join(src_dir, pattern))
    font = instantiateVariableFont(TTFont(src, recalcTimestamp=False), limits, inplace=False, optimize=True, updateFontNames=False)
    font.flavor = "woff2"
    font.save(os.path.join(out_dir, out))
    print(f"{out}: {os.path.getsize(src)} -> {os.path.getsize(os.path.join(out_dir, out))} bytes")
