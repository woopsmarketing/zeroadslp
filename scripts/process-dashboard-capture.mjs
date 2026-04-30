#!/usr/bin/env node
/**
 * OpsBoard 캡처 자르기·리사이즈·WebP 변환 스크립트.
 *
 * 사용:
 *   node scripts/process-dashboard-capture.mjs <input.png> [--width 2400] [--out public/dashboard-hero.webp]
 *   node scripts/process-dashboard-capture.mjs <input.png> --crop x,y,w,h
 *
 * 결과:
 *   - public/dashboard-hero.webp (또는 .png) 생성
 *   - 콘솔에 최종 width/height 출력 (HeroDashboardPreview.tsx 의 DASHBOARD_IMAGE 에 박을 값)
 */
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
const input = args[0];
if (!input) {
  console.error("Usage: process-dashboard-capture.mjs <input> [--crop x,y,w,h] [--width 2400] [--out path]");
  process.exit(1);
}

function getArg(name, def) {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
}

const targetWidth = Number(getArg("--width", "2400"));
const cropArg = getArg("--crop", null);
const outArg = getArg("--out", "public/dashboard-hero.webp");
const out = path.resolve(WEB_ROOT, outArg);

if (!existsSync(input)) {
  console.error(`input not found: ${input}`);
  process.exit(1);
}

let img = sharp(input);
const meta = await img.metadata();
console.log(`input: ${input} (${meta.width}×${meta.height})`);

if (cropArg) {
  const [x, y, w, h] = cropArg.split(",").map((n) => Number(n));
  console.log(`crop: x=${x} y=${y} w=${w} h=${h}`);
  img = img.extract({ left: x, top: y, width: w, height: h });
}

img = img.resize({ width: targetWidth, withoutEnlargement: true });

const isWebp = out.endsWith(".webp");
if (isWebp) {
  img = img.webp({ quality: 88, effort: 5 });
} else if (out.endsWith(".png")) {
  img = img.png({ compressionLevel: 9 });
} else {
  console.error("output must be .webp or .png");
  process.exit(1);
}

const result = await img.toBuffer({ resolveWithObject: true });
const fs = await import("node:fs/promises");
await fs.writeFile(out, result.data);

const kb = (result.data.length / 1024).toFixed(1);
console.log(`\n✅ saved: ${out}`);
console.log(`   final: ${result.info.width}×${result.info.height} · ${kb} KB`);
console.log(`\nHeroDashboardPreview.tsx 에 박을 값:`);
console.log(`const DASHBOARD_IMAGE = {`);
console.log(`  src: "${"/" + path.relative("public", out).replace(/\\/g, "/")}",`);
console.log(`  width: ${result.info.width},`);
console.log(`  height: ${result.info.height},`);
console.log(`  alt: "광고주 전용 대시보드 — 30일 광고비 / 전환 / 전체지표 요약",`);
console.log(`};`);
