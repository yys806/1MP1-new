// 视觉验证脚本：puppeteer-core 驱动 Edge，对全站各区块截图
// 用法: node scripts/shots.mjs [baseURL]
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:4173';
const OUT = new URL('../.shots/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
mkdirSync(OUT, { recursive: true });

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: 'new' in puppeteer.launch ? 'new' : true,
  args: ['--window-size=1600,900', '--hide-scrollbars', '--use-angle=swiftshader'],
  defaultViewport: { width: 1600, height: 900 },
});

const page = await browser.newPage();
page.on('pageerror', (e) => console.log('PAGE ERROR:', e.message));
page.on('console', (m) => {
  if (m.type() === 'error') console.log('CONSOLE ERROR:', m.text());
});

// ---------- 全动态模式：验证启动屏 + hero 入场 ----------
await page.goto(`${BASE}/`, { waitUntil: 'networkidle2', timeout: 60000 });
await sleep(800);
await page.screenshot({ path: `${OUT}m-0-boot.png` });
await sleep(4500);
await page.screenshot({ path: `${OUT}m-1-hero.png` });

// ---------- 静态模式：逐区块截图 ----------
await page.goto(`${BASE}/?static=1`, { waitUntil: 'networkidle2', timeout: 60000 });
await sleep(1200);

async function shotSection(hash, name, extraWait = 900) {
  await page.evaluate((h) => {
    const el = document.querySelector(h);
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 60);
  }, hash);
  await sleep(extraWait);
  await page.screenshot({ path: `${OUT}s-${name}.png` });
  console.log('shot', name);
}

await shotSection('#about', 'about');
await shotSection('#research', 'research');
await shotSection('#research .research-item:nth-child(2)', 'research-2');
await shotSection('#projects', 'gallery-start');
// 画廊中段：往下滚半个 pin 距离
await page.evaluate(() => {
  const pin = document.querySelector('.gallery-pin');
  const st = window.ScrollTrigger ? null : null;
  window.scrollBy(0, Math.round(window.innerHeight * 1.6));
});
await sleep(900);
await page.screenshot({ path: `${OUT}s-gallery-mid.png` });
console.log('shot gallery-mid');
await shotSection('.projects-block', 'projects-grid');
await page.evaluate(() => window.scrollBy(0, window.innerHeight * 1.2));
await sleep(900);
await page.screenshot({ path: `${OUT}s-projects-grid-2.png` });
await shotSection('#journey', 'journey');
await page.evaluate(() => window.scrollBy(0, window.innerHeight * 1.4));
await sleep(900);
await page.screenshot({ path: `${OUT}s-journey-2.png` });
await shotSection('#contact', 'contact');
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await sleep(900);
await page.screenshot({ path: `${OUT}s-footer.png` });

// ---------- 移动端首屏 ----------
await page.setViewport({ width: 390, height: 844 });
await page.goto(`${BASE}/?static=1`, { waitUntil: 'networkidle2', timeout: 60000 });
await sleep(1500);
await page.screenshot({ path: `${OUT}mobile-hero.png` });
await shotSection('#about', 'mobile-about');

await browser.close();
console.log('DONE →', OUT);
