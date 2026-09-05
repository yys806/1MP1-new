// 视觉验证 v4：双语/命令面板/弹窗/BibTeX/changelog/PWA/404 全量测试
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

// ---------- 1. 启动 + hero + three 懒加载 ----------
await page.goto(`${BASE}/`, { waitUntil: 'networkidle2', timeout: 60000 });
await sleep(6500);
const heroOk = await page.evaluate(() => ({
  threeLoaded: !!window.__shen?.heroScene,
  canvasW: document.getElementById('hero-canvas').width,
  changelog: document.querySelectorAll('.g-item').length,
  webp: !![...document.querySelectorAll('img')].find((i) => i.src.includes('.webp')),
}));
console.log(`HERO: three=${heroOk.threeLoaded} canvas=${heroOk.canvasW[0]}px changelog=${heroOk.changelog} items webp=${heroOk.webp}`);
await page.screenshot({ path: `${OUT}v4-hero.png` });

// ---------- 2. Ctrl+K 命令面板 ----------
await page.keyboard.down('Control');
await page.keyboard.press('KeyK');
await page.keyboard.up('Control');
await sleep(600);
const pal1 = await page.evaluate(() => ({
  open: !!document.querySelector('.palette'),
  items: document.querySelectorAll('.pl-item').length,
  groups: document.querySelectorAll('.pl-group').length,
}));
console.log(`PALETTE: open=${pal1.open} items=${pal1.items} groups=${pal1.groups}`);
await page.screenshot({ path: `${OUT}v4-palette.png` });
// 搜索 "mirror" 然后回车（应打开弹窗）
await page.type('#palette-input', 'mirror');
await sleep(300);
await page.keyboard.press('Enter');
await sleep(800);
const modal1 = await page.evaluate(() => ({
  modal: !!document.querySelector('.modal'),
  title: document.querySelector('.pm-title')?.firstChild?.textContent?.trim(),
}));
console.log(`PALETTE→MODAL: ${modal1.modal} title=${modal1.title}`);
await page.screenshot({ path: `${OUT}v4-modal.png` });
await page.keyboard.press('Escape');
await sleep(500);

// ---------- 3. BibTeX 复制 ----------
await page.evaluate(() => {
  const el = document.querySelector('#research');
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 40);
});
await sleep(800);
await page.evaluate(() => document.querySelector('.cite-btn').click());
await sleep(700);
const bib = await page.evaluate(async () => {
  try {
    const txt = await navigator.clipboard.readText();
    return { head: txt.slice(0, 30), hasToast: !!document.querySelector('.toast') };
  } catch {
    return { head: '<no-perm>', hasToast: !!document.querySelector('.toast') };
  }
});
console.log(`BIBTEX: clipboard="${bib.head}" toast=${bib.hasToast}`);
await page.screenshot({ path: `${OUT}v4-bibtex-toast.png` });

// ---------- 4. 语言切换 EN ----------
await page.evaluate(() => document.getElementById('lang-toggle').click());
await sleep(900);
const en = await page.evaluate(() => ({
  title: document.title,
  navFirst: document.querySelector('.nav-link')?.textContent,
  researchSub: document.querySelector('.research-sub')?.textContent,
  heroCta: document.querySelector('.hero-cta .btn span')?.textContent,
  honorsFirst: document.querySelector('.honor .h-name')?.textContent,
  clFirst: document.querySelector('.g-item li')?.textContent,
}));
console.log(`EN: title="${en.title}" nav="${en.navFirst}" sub="${en.researchSub}" cta="${en.heroCta}" honor="${en.honorsFirst}" cl="${en.clFirst?.slice(0, 40)}"`);
await page.evaluate(() => {
  const el = document.querySelector('#about');
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 60);
});
await sleep(700);
await page.screenshot({ path: `${OUT}v4-en-about.png` });
await page.evaluate(() => {
  const el = document.querySelector('#research');
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 60);
});
await sleep(700);
await page.screenshot({ path: `${OUT}v4-en-research.png` });
// 切回中文
await page.evaluate(() => document.getElementById('lang-toggle').click());
await sleep(800);
const backZh = await page.evaluate(() => document.querySelector('.research-sub')?.textContent);
console.log(`BACK ZH: sub="${backZh}"`);

// ---------- 5. 项目弹窗（网格卡片点击） ----------
await page.evaluate(() => {
  const el = document.querySelector('.projects-block');
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 60);
});
await sleep(700);
await page.evaluate(() => document.querySelector('.p-card .p-open').click());
await sleep(800);
const modal2 = await page.evaluate(() => ({
  modal: !!document.querySelector('.modal'),
  details: document.querySelector('.pm-details')?.textContent?.slice(0, 30),
}));
console.log(`GRID MODAL: ${modal2.modal} details="${modal2.details}"`);
await page.keyboard.press('Escape');
await sleep(500);

// ---------- 6. PWA 文件可达性 ----------
for (const f of ['manifest.webmanifest', 'sw.js', 'robots.txt', 'sitemap.xml', '404.html']) {
  const res = await page.evaluate(async (f) => {
    const r = await fetch(`${location.origin}/${f}`);
    return r.status;
  }, f);
  console.log(`FILE ${f}: ${res === 200 ? 'OK' : 'FAIL ' + res}`);
}

// ---------- 7. 404 页面 ----------
const page404 = await browser.newPage();
await page404.goto(`${BASE}/404.html`, { waitUntil: 'networkidle2' });
await sleep(500);
await page404.screenshot({ path: `${OUT}v4-404.png` });
console.log('shot 404');
await page404.close();

await browser.close();
console.log('DONE');
