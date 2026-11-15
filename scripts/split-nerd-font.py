"""Split the Nerd Font symbols file into unicode-range pieces (woff2) for
styles/code-theme.css. Run again when updating the font:

  pip install fonttools brotli
  python scripts/split-nerd-font.py SymbolsNerdFontMono-Regular.woff2 fonts/nerd > faces.css

Prints the @font-face rules on stdout (paste over the ones in code-theme.css)
and each piece's size, plus a coverage check, on stderr."""
import os, sys
from fontTools import subset
from fontTools.ttLib import TTFont

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)

# Nerd Fonts' own sets (https://github.com/ryanoasis/nerd-fonts/wiki/Glyph-Sets-and-Code-Points)
PIECES = [
    ('powerline', 0xE000, 0xE0FF),       # Pomicons, Powerline, Powerline Extra
    ('fa-ext-weather', 0xE200, 0xE3FF),  # Font Awesome Extension, Weather
    ('seti', 0xE5FA, 0xE6FF),            # Seti-UI + Custom
    ('devicons', 0xE700, 0xE9FF),        # Devicons
    ('codicons', 0xEA60, 0xECFF),        # Codicons
    ('font-awesome', 0xED00, 0xF2FF),    # Font Awesome
    ('logos-octicons', 0xF300, 0xF8FF),  # Font Logos, Octicons
    ('material-1', 0xF0001, 0xF07FF),    # Material Design, in four
    ('material-2', 0xF0800, 0xF0FFF),
    ('material-3', 0xF1000, 0xF17FF),
    ('material-4', 0xF1800, 0xFFFFD),
]

cmap = TTFont(src).getBestCmap()
total = 0
covered = set()
css = []
for name, a, b in PIECES:
    cps = [c for c in cmap if a <= c <= b]
    if not cps:
        continue
    covered.update(cps)
    opts = subset.Options()
    opts.flavor = 'woff2'
    opts.layout_features = ['*']
    opts.notdef_outline = True
    opts.name_IDs = ['*']
    font = TTFont(src)
    s = subset.Subsetter(opts)
    s.populate(unicodes=cps)
    s.subset(font)
    path = os.path.join(out, f'{name}.woff2')
    font.flavor = 'woff2'
    font.save(path)
    size = os.path.getsize(path)
    total += size
    print(f'{name:16} U+{a:04X}-{b:04X} {len(cps):5} glyphs {size / 1024:7.1f} KB', file=sys.stderr)
    css.append(f"@font-face {{\n  font-family: 'Symbols Nerd Font Mono';\n  src: url('../fonts/nerd/{name}.woff2') format('woff2');\n  font-display: block;\n  unicode-range: U+{a:04X}-{b:04X};\n}}")
wanted = {c for c in cmap if 0xE000 <= c <= 0xF8FF or 0xF0000 <= c <= 0xFFFFD}
print(f'total {total / 1024:.1f} KB; in the old unicode-range: {len(wanted)} glyphs, covered: {len(wanted & covered)}', file=sys.stderr)
print('\n'.join(css))
