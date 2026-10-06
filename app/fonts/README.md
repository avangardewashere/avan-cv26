# Fonts

Self-hosted latin cuts of three Google Fonts families, instanced with fontTools to the weights the
site actually sets. Glyphs, kerning and line metrics are unchanged; only the unused weight range
is gone (129 KB to 76 KB preloaded).

| File | Family | Kept |
| --- | --- | --- |
| `bricolage-grotesque-latin-wght-700.woff2` | Bricolage Grotesque 1.001 | wght 700, opsz 12–96 |
| `geist-latin-wght-400-600.woff2` | Geist 1.800 | wght 400–600 |
| `geist-mono-latin-wght-400-500.woff2` | Geist Mono 1.701 | wght 400–500 |

A weight outside a cut renders at the nearest kept weight. Widen the cut and rebuild before using
one (for example `font-bold` on Geist): see `scripts/instance-fonts.py`.

## Licence

All three are licensed under the SIL Open Font License 1.1 (https://openfontlicense.org), with no
Reserved Font Name, which permits modified versions. Each file keeps its copyright notice (name ID 0)
and licence URL (name ID 14):

- Copyright 2022 The Bricolage Grotesque Project Authors (https://github.com/ateliertriay/bricolage)
- Copyright 2024 The Geist Project Authors (https://github.com/vercel/geist-font)
