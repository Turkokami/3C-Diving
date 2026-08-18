#!/usr/bin/env python3
"""
make-social-card.py - builds the shared og:image.

Replaces an earlier generated type card. This one is built from a REAL PHOTOGRAPH
of a 3rd Coast job - a surface-supplied diver entering the water beside a barge -
darkened under the brand charcoal wash, with the real pewter emblem set on it.

That matters beyond looks. The og:image is the single most-shared representation
of the business, and a photograph of actual work is proof in a way a wordmark
never is. It also means `business.socialImage.alt` can finally describe something
that exists, which is what M6 asks for.

Regenerate:  python scripts/make-social-card.py
"""
import os
from PIL import Image, ImageDraw, ImageFont

Image.MAX_IMAGE_PIXELS = None

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PHOTO = os.path.join(ROOT, 'public', 'photos', 'diver-entry-port-isabel-1600.webp')
LOGO = os.path.join(ROOT, 'public', 'brand', 'logo-512.png')
OUT = os.path.join(ROOT, 'public', 'brand', '3rd-coast-social.jpg')

W, H = 1200, 630


def load_font(size, bold=False):
    """Georgia where available - it is the brand face - else a serif fallback."""
    candidates = (
        ['georgiab.ttf', 'timesbd.ttf', 'DejaVuSerif-Bold.ttf']
        if bold else
        ['georgia.ttf', 'times.ttf', 'DejaVuSerif.ttf']
    )
    roots = [r'C:\Windows\Fonts', '/usr/share/fonts/truetype/dejavu', '/Library/Fonts']
    for name in candidates:
        for r in roots:
            p = os.path.join(r, name)
            if os.path.exists(p):
                try:
                    return ImageFont.truetype(p, size)
                except OSError:
                    pass
    return ImageFont.load_default()


# ── Background: the real photo, cover-cropped to 1200x630 ────────────────────
photo = Image.open(PHOTO).convert('RGB')
scale = max(W / photo.width, H / photo.height)
photo = photo.resize((int(photo.width * scale) + 1, int(photo.height * scale) + 1),
                     Image.LANCZOS)
left = (photo.width - W) // 2
top = int((photo.height - H) * 0.42)   # bias up: keeps the diver and barge in frame
card = photo.crop((left, top, left + W, top + H))

# ── Charcoal wash, heavier at the left where the type sits ───────────────────
wash = Image.new('RGB', (W, H), (8, 9, 11))
mask = Image.new('L', (W, H))
md = ImageDraw.Draw(mask)
for x in range(W):
    t = x / W
    md.line([(x, 0), (x, H)], fill=int(238 - 118 * t))   # 0.93 -> 0.47 opacity
card = Image.composite(wash, card, mask)

# Extra floor so the bottom rule and any text stay legible
floor = Image.new('RGB', (W, H), (8, 9, 11))
fmask = Image.new('L', (W, H))
fd = ImageDraw.Draw(fmask)
for y in range(H):
    fd.line([(0, y), (W, y)], fill=int(max(0, (y - H * 0.55) / (H * 0.45) * 120)))
card = Image.composite(floor, card, fmask)

d = ImageDraw.Draw(card)

# ── Emblem ───────────────────────────────────────────────────────────────────
logo = Image.open(LOGO).convert('RGB').resize((132, 132), Image.LANCZOS)
circle = Image.new('L', (132, 132), 0)
ImageDraw.Draw(circle).ellipse((0, 0, 131, 131), fill=255)
card.paste(logo, (76, 74), circle)

# ── Type ─────────────────────────────────────────────────────────────────────
d.text((228, 92), '3RD COAST', font=load_font(38, True), fill=(255, 255, 255))
d.text((230, 142), 'COMMERCIAL DIVING & SALVAGE',
       font=load_font(19), fill=(169, 179, 189))

d.text((76, 286), 'Commercial diving on the', font=load_font(58, True), fill=(255, 255, 255))
d.text((76, 356), 'South Texas Gulf Coast', font=load_font(58, True), fill=(255, 255, 255))

d.text((76, 452), 'Underwater inspection  ·  Hull & propeller  ·  Welding support  ·  Salvage',
       font=load_font(23), fill=(199, 203, 209))

d.text((76, 522), 'PORT OF BROWNSVILLE  ·  PORT ISABEL  ·  SOUTH PADRE ISLAND',
       font=load_font(21, True), fill=(201, 140, 77))

# Copper rule along the foot, echoing the site's action colour
d.rectangle([(0, H - 12), (W, H)], fill=(181, 118, 58))

card.save(OUT, 'JPEG', quality=88, optimize=True, progressive=True)
print('Wrote %s (%dx%d, %d KB)' % (OUT, W, H, os.path.getsize(OUT) // 1024))
