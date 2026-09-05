// v5 验证：统一风格图替换 + 噜小记项目
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:4173';
const OUT = new URL('../.shots/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
mkdirSync(OUT, { recursive: true });
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: 'new',
  userDataDir: 'D:/shen/test/zcode/shen-website/.shots/edge-v5',
  args: ['--window-size=1600,900', '--hide-scrollbars', '--use-angle=swiftshader'],
  defaultViewport: { width: 1600, height: 900 },
});
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('PAGE ERROR:', e.message));

await page.goto(`${BASE}/`, { waitUntil: 'networkidle2', timeout: 60000 });
await sleep(5500);

const checks = await page.evaluate(() => {
  const imgs = [...document.querySelectorAll('.p-media img, .g-card-media img, .research-media img')];
  const broken = imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute('src'));
  const unified = imgs.filter((i) => i.src.includes('projects-unified')).length;
  const lux = {
    inGrid: !!document.querySelector('.p-card[data-id="luxiaoji"]'),
    inGallery: !!document.querySelector('.g-card[data-id="luxiaoji"]'),
    galleryPos: [...document.querySelectorAll('.g-card')].findIndex((c) => c.dataset.id === 'luxiaoji'),
    title: [...document.querySelectorAll('.g-card[data-id="luxiaoji"] .g-card-title')].map((e) => e.firstChild.textContent)[0],
    count: document.getElementById('proj-total')?.textContent,
    galleryTotal: document.getElementById('gallery-total')?.textContent,
  };
  return { total: imgs.length, broken, unified, lux };
});
console.log(`IMAGES: total=${checks.total} unified=${checks.unified} broken=${checks.broken.length}`);
if (checks.broken.length) console.log('BROKEN:', checks.broken);
console.log(`噜小记: grid=${checks.lux.inGrid} gallery=${checks.lux.inGallery} pos=${checks.lux.galleryPos} count=${checks.lux.count} galleryTotal=${checks.lux.galleryTotal}`);

// 画廊滚到噜小记截图（拖动到第 2 张）
await page.evaluate(() => {
  const el = document.querySelector('#gallery-scroller');
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 40);
});
await sleep(800);
await page.screenshot({ path: `${OUT}v5-gallery-1.png` });
await page.evaluate(() => {
  const cards = document.querySelectorAll('.g-card');
  cards[1].scrollIntoView({ behavior: 'instant', inline: 'center', block: 'nearest' });
});
await sleep(800);
await page.screenshot({ path: `${OUT}v5-gallery-luxiaoji.png` });

// 项目网格顶部（应有噜小记 + 统一风格图）
await page.evaluate(() => {
  const el = document.querySelector('.projects-block');
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 60);
});
await sleep(900);
await page.screenshot({ path: `${OUT}v5-grid.png` });

await browser.close();
console.log('DONE');
