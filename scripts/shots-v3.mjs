// 视觉验证 v3：画廊拖拽测试 + 排序断言 + 全站截图（贴纸已移除）
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
  args: ['--window-size=1600,900', '--hide-scrollbars', '--use-angle=swiftshader'],
  defaultViewport: { width: 1600, height: 900 },
});
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('PAGE ERROR:', e.message));

// ---------- 全动态 hero（应无贴纸）----------
await page.goto(`${BASE}/`, { waitUntil: 'networkidle2', timeout: 60000 });
await sleep(5200);
const stickerCount = await page.evaluate(() => document.querySelectorAll('.sticker').length);
console.log(`stickers=${stickerCount} -> ${stickerCount === 0 ? 'PASS (removed)' : 'FAIL'}`);
await page.screenshot({ path: `${OUT}v3-hero.png` });

// ---------- 静态模式：画廊拖拽 + 断言 + 截图 ----------
await page.goto(`${BASE}/?static=1`, { waitUntil: 'networkidle2', timeout: 60000 });
await sleep(1200);

const checks = await page.evaluate(() => {
  const titles = [...document.querySelectorAll('.g-card-title')].map((e) => e.firstChild.textContent.trim());
  const dates = [...document.querySelectorAll('#projects-grid .p-date')].map((e) => e.textContent.trim());
  const sortedOk = dates.every((d, i) => {
    if (i === 0) return true;
    const k = (s) => { const [y, m] = s.split('.').map(Number); return y * 100 + (m || 0); };
    return k(dates[i - 1]) >= k(d);
  });
  const pCardBoxed = getComputedStyle(document.querySelector('.p-card')).backgroundColor;
  return { titles, dates: dates.slice(0, 3), sortedOk, pCardBoxed };
});
console.log('GALLERY ORDER:', checks.titles.join(' → '));
console.log('GRID first-3:', checks.dates.join(', '), '| sorted:', checks.sortedOk ? 'PASS' : 'FAIL');
console.log('p-card bg =', checks.pCardBoxed, '(rgba(0, 0, 0, 0) = 融入式 PASS)');

// 画廊滚动到位置
await page.evaluate(() => {
  const el = document.querySelector('#gallery-scroller');
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 60);
});
await sleep(600);
await page.screenshot({ path: `${OUT}v3-gallery-start.png` });

// 鼠标拖拽画廊：向左拖 → scrollLeft 应增加
const sInfo = await page.evaluate(() => {
  const el = document.querySelector('#gallery-scroller');
  const r = el.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2, max: el.scrollWidth - el.clientWidth };
});
await page.mouse.move(sInfo.x + 200, sInfo.y);
await page.mouse.down();
for (let i = 1; i <= 14; i++) {
  await page.mouse.move(sInfo.x + 200 - i * 26, sInfo.y, { steps: 2 });
  await sleep(12);
}
await page.mouse.up();
await sleep(700);
const after = await page.evaluate(() => {
  const el = document.querySelector('#gallery-scroller');
  const cur = document.getElementById('gallery-cur').textContent;
  return { scrollLeft: el.scrollLeft, cur };
});
console.log(
  `GALLERY DRAG: scrollLeft=${after.scrollLeft.toFixed(0)} / max=${sInfo.max.toFixed(0)} counter=${after.cur} -> ${
    after.scrollLeft > 150 ? 'PASS' : 'FAIL'
  }`
);
await page.screenshot({ path: `${OUT}v3-gallery-dragged.png` });

// 纵向滚动不受画廊劫持：在画廊位置继续下滚，页面应正常下移
const y1 = await page.evaluate(() => window.scrollY);
await page.mouse.wheel({ deltaY: 900 });
await sleep(700);
const y2 = await page.evaluate(() => window.scrollY);
console.log(`WHEEL PAST GALLERY: deltaY=900 → page moved ${(y2 - y1).toFixed(0)}px -> ${y2 - y1 > 400 ? 'PASS' : 'FAIL'}`);

async function shotSection(hash, name, extraWait = 900) {
  await page.evaluate((h) => {
    const el = document.querySelector(h);
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 60);
  }, hash);
  await sleep(extraWait);
  await page.screenshot({ path: `${OUT}v3-${name}.png` });
  console.log('shot', name);
}
await shotSection('.projects-block', 'projects-grid');

await browser.close();
console.log('DONE');
