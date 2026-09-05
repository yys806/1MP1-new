// v6 验证：弹窗光标 + 滚动修复 + 研究图替换
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
  userDataDir: 'D:/shen/test/zcode/shen-website/.shots/edge-v6',
  args: ['--window-size=1600,900', '--hide-scrollbars', '--use-angle=swiftshader'],
  defaultViewport: { width: 1600, height: 900 },
});
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('PAGE ERROR:', e.message));

await page.goto(`${BASE}/`, { waitUntil: 'networkidle2', timeout: 60000 });
await sleep(5500);

// 1. 研究图替换检查
const researchImgs = await page.evaluate(
  () => [...document.querySelectorAll('.research-media img')].map((i) => i.src.split('/').pop())
);
console.log('RESEARCH IMGS:', researchImgs.join(', '));

// 2. 打开弹窗 → 光标环可见性 + z-index
await page.evaluate(() => {
  const el = document.querySelector('.projects-block');
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 60);
});
await sleep(700);
await page.evaluate(() => document.querySelector('.p-card .p-open').click());
await sleep(800);
// 鼠标移进弹窗
await page.mouse.move(800, 500);
await sleep(300);
const cursorState = await page.evaluate(() => {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  return {
    dotZ: +getComputedStyle(dot).zIndex,
    ringZ: +getComputedStyle(ring).zIndex,
    modalZ: +getComputedStyle(document.querySelector('.modal')).zIndex,
    ringVisible: getComputedStyle(ring).opacity,
    bodyFlag: document.body.classList.contains('overlay-open'),
    modalScrollable: (() => {
      const m = document.querySelector('.modal');
      return m.scrollHeight > m.clientHeight;
    })(),
  };
});
console.log('CURSOR OVER MODAL:', JSON.stringify(cursorState));
await page.screenshot({ path: `${OUT}v6-modal-cursor.png` });

// 3. 弹窗内滚轮：应该滚动弹窗而非页面
const before = await page.evaluate(() => ({ page: window.scrollY, modal: document.querySelector('.modal').scrollTop }));
await page.mouse.move(800, 500);
await page.mouse.wheel({ deltaY: 600 });
await sleep(500);
const after = await page.evaluate(() => ({ page: window.scrollY, modal: document.querySelector('.modal').scrollTop }));
console.log(`WHEEL IN MODAL: page ${before.page}→${after.page} (should stay), modal ${before.modal}→${after.modal} (should grow)`);

// 4. 关闭弹窗 → 光标状态恢复 + 页面滚动恢复
await page.keyboard.press('Escape');
await sleep(600);
const restored = await page.evaluate(() => ({
  modalGone: !document.querySelector('.modal'),
  bodyFlag: document.body.classList.contains('overlay-open'),
  ringModalClass: document.getElementById('cursor-ring').classList.contains('modal-open'),
}));
console.log('AFTER CLOSE:', JSON.stringify(restored));
await page.mouse.wheel({ deltaY: -400 });
await sleep(500);
const pageScroll = await page.evaluate(() => window.scrollY);
console.log(`PAGE SCROLL AFTER CLOSE: ${pageScroll} (should move) -> ${pageScroll >= 0 ? 'OK' : 'FAIL'}`);

// 5. 命令面板同样检查
await page.keyboard.down('Control');
await page.keyboard.press('KeyK');
await page.keyboard.up('Control');
await sleep(500);
const pal = await page.evaluate(() => ({
  open: !!document.querySelector('.palette'),
  bodyFlag: document.body.classList.contains('overlay-open'),
}));
console.log('PALETTE:', JSON.stringify(pal));
await page.keyboard.press('Escape');
await sleep(400);

// 6. 全站截图（研究区新图）
await page.evaluate(() => {
  const el = document.querySelector('#research');
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 50);
});
await sleep(900);
await page.screenshot({ path: `${OUT}v6-research-new.png` });

await browser.close();
console.log('DONE');
