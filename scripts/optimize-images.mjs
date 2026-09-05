// 全站图片转 WebP：质量 82，宽超过 1600 缩到 1600，然后删除原始 PNG/JPG
// 用法: node scripts/optimize-images.mjs
import sharp from 'sharp';
import { readdirSync, statSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../public/assets/img/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

async function walk(dir) {
  let files = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) files = files.concat(await walk(p));
    else files.push(p);
  }
  return files;
}

const files = await walk(ROOT);
let before = 0;
let after = 0;

for (const f of files) {
  if (!/\.(png|jpe?g)$/i.test(f)) continue;
  const out = f.replace(/\.(png|jpe?g)$/i, '.webp');
  const img = sharp(f);
  const meta = await img.metadata();
  let pipe = img.webp({ quality: 82, effort: 4 });
  if (meta.width > 1600) pipe = sharp(f).resize({ width: 1600 }).webp({ quality: 82, effort: 4 });
  await pipe.toFile(out);
  const b = statSync(f).size;
  const a = statSync(out).size;
  before += b;
  after += a;
  unlinkSync(f);
  console.log(`${f.split('img')[1]}  ${(b / 1024).toFixed(0)}KB → ${(a / 1024).toFixed(0)}KB`);
}

console.log(`\nTOTAL: ${(before / 1024 / 1024).toFixed(2)}MB → ${(after / 1024 / 1024).toFixed(2)}MB (-${((1 - after / before) * 100).toFixed(0)}%)`);
