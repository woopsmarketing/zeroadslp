/**
 * 광고 자산용 로고 PNG 생성기.
 * 사용: cd web && node scripts/generate-logo-assets.mjs
 * 산출물: web/public/logo-square.png (1200x1200), web/public/logo-horizontal.{svg,png} (1200x300)
 */
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");

const INK = "#0B1120";
const ACCENT = "#10B981";

const markPaths = (strokeWidth = 2) => `
  <circle cx="12" cy="12" r="7.5" stroke="${INK}" stroke-width="${strokeWidth}" fill="none"/>
  <g stroke="${INK}" stroke-width="${strokeWidth}" stroke-linecap="round">
    <line x1="12" y1="2" x2="12" y2="5"/>
    <line x1="12" y1="19" x2="12" y2="22"/>
    <line x1="2" y1="12" x2="5" y2="12"/>
    <line x1="19" y1="12" x2="22" y2="12"/>
  </g>
  <circle cx="12" cy="12" r="2.25" fill="${ACCENT}"/>
`;

// 정사각 1200x1200 — mark only, 12.5% padding 각 변
const squareSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="1200" height="1200">
  <g transform="translate(150 150) scale(37.5)">
    ${markPaths(2)}
  </g>
</svg>`;

// 가로 4:1 1200x300 — mark + "제로애드" 워드마크
const horizontalSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300" width="1200" height="300">
  <g transform="translate(30 30) scale(10)">
    ${markPaths(2)}
  </g>
  <text x="295" y="208" font-family="Pretendard, 'Malgun Gothic', 'Noto Sans CJK KR', sans-serif" font-size="170" font-weight="800" letter-spacing="-6" fill="${INK}">제로애드</text>
</svg>`;

writeFileSync(join(PUBLIC, "logo-horizontal.svg"), horizontalSVG);
writeFileSync(join(PUBLIC, "logo-square.svg"), squareSVG);

await sharp(Buffer.from(squareSVG))
  .png({ compressionLevel: 9 })
  .toFile(join(PUBLIC, "logo-square.png"));

await sharp(Buffer.from(horizontalSVG))
  .png({ compressionLevel: 9 })
  .toFile(join(PUBLIC, "logo-horizontal.png"));

console.log("✓ logo-square.png (1200x1200)");
console.log("✓ logo-horizontal.png (1200x300)");
console.log("✓ logo-square.svg, logo-horizontal.svg (벡터 원본)");
