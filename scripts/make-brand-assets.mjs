/**
 * make-brand-assets.mjs — generates the shared social card.
 *
 * M7 requires a brand social image on every page. We do not have field photos
 * yet (verified-facts ledger: "Field photos — PENDING, biggest single content
 * asset gap"), and inventing a photograph of a dive we cannot prove happened is
 * exactly the fabrication doctrine #6 forbids.
 *
 * So this generates an honest BRANDED TYPE CARD — wordmark, service line, service
 * area. Its alt text describes what it actually is, per M6 ("judged by sight,
 * never by filename"). The moment real field photography arrives it replaces this
 * file and updates `business.socialImage.alt` to describe the photo.
 *
 * Run: node scripts/make-brand-assets.mjs
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

// fileURLToPath, not `.pathname` — the checkout path contains a space, which a
// URL percent-encodes to %20 and libvips then cannot open.
const OUT_DIR = fileURLToPath(new URL('../public/brand/', import.meta.url));

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#061a2b"/>
      <stop offset="100%" stop-color="#0f3554"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="602" width="1200" height="28" fill="#e8791a"/>

  <rect x="88" y="96" width="92" height="92" rx="14" fill="#e8791a"/>
  <text x="134" y="156" font-family="Segoe UI Semibold, system-ui, Arial, sans-serif"
        font-size="40" font-weight="700" fill="#061a2b" text-anchor="middle">3C</text>

  <text x="204" y="140" font-family="Segoe UI Semibold, system-ui, Arial, sans-serif"
        font-size="42" font-weight="700" fill="#ffffff">3rd Coast</text>
  <text x="204" y="176" font-family="system-ui, Arial, sans-serif"
        font-size="21" fill="#7fb6d4">Commercial Diving &amp; Salvage</text>

  <text x="88" y="304" font-family="Segoe UI Semibold, system-ui, Arial, sans-serif"
        font-size="62" font-weight="700" fill="#ffffff">Commercial diving on the</text>
  <text x="88" y="378" font-family="Segoe UI Semibold, system-ui, Arial, sans-serif"
        font-size="62" font-weight="700" fill="#ffffff">South Texas Gulf Coast</text>

  <text x="88" y="452" font-family="system-ui, Arial, sans-serif"
        font-size="26" fill="#dbeaf3">Underwater inspection · Hull &amp; propeller · Welding support · Salvage</text>

  <text x="88" y="530" font-family="Segoe UI Semibold, system-ui, Arial, sans-serif"
        font-size="24" font-weight="700" fill="#f59b48">
    PORT OF BROWNSVILLE · PORT ISABEL · SOUTH PADRE ISLAND
  </text>
</svg>`;

await mkdir(OUT_DIR, { recursive: true });

await sharp(Buffer.from(svg))
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(join(OUT_DIR, '3rd-coast-social.jpg'));

console.log('✓ public/brand/3rd-coast-social.jpg (1200×630)');
