// v7 回归验证：审查修复项全部复查
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
  userDataDir: 'D:/shen/test/zcode/shen-website/.shots/edge-v7',
  args: ['--window-size=1600,900', '--hide-scrollbars', '--use-angle=swiftshader'],
  defaultViewport: { width: 1600, height: 900 },
});
const page = await browser.newPage();
await page.setCacheEnabled(false);
await page.setRequestInterception(true);
page.on('request', (req) => {
  const h = { ...req.headers(), 'cache-control': 'no-cache' };
  req.continue({ headers: h });
});
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

await page.goto(`${BASE}/`, { waitUntil: 'networkidle2', timeout: 60000 });
await sleep(5500);

// ---- P1-2/P3-9: EN 模式 i18n 完整性 ----
await page.evaluate(() => document.getElementById('lang-toggle').click());
await sleep(900);
const en = await page.evaluate(() => {
  const tagSample = [...document.querySelectorAll('.p-card .p-tag')].slice(0, 8).map((e) => e.textContent);
  const zhInTags = tagSample.filter((t) => /[\u4e00-\u9fff]/.test(t));
  const nav = document.querySelector('.nav-link').textContent;
  const filter = document.querySelector('.filter').textContent;
  const cr = document.querySelector('.g-card-tag.cr')?.textContent;
  return { tagSample, zhInTags, nav, filter, cr };
});
console.log('EN tags sample:', en.tagSample.join(' | '));
console.log(`EN zh-residue in tags: ${en.zhInTags.length} -> ${en.zhInTags.length === 0 ? 'PASS' : 'FAIL ' + en.zhInTags}`);
console.log(`EN nav="${en.nav}" filter="${en.filter}" cr="${en.cr}"`);
await page.evaluate(() => document.getElementById('lang-toggle').click());
await sleep(700);

// ---- P2-3: 监听器不再叠加 ----
const listenersBefore = await page.evaluate(() => {
  // 通过触发一次点击计数（筛选点击副作用一致，无法直接测）——改用 getEventListeners 不可用，用行为法：
  return null;
});
await page.evaluate(() => document.getElementById('lang-toggle').click());
await sleep(700);
await page.evaluate(() => document.getElementById('lang-toggle').click());
await sleep(700);
// 切换两次后点击筛选，检查功能仍正常（幂等即可）
await page.evaluate(() => {
  const el = document.querySelector('.projects-block');
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 60);
});
await sleep(500);
await page.evaluate(() => document.querySelector('.filter[data-group="web"]').click());
await sleep(600);
const filterOk = await page.evaluate(() => {
  const visible = [...document.querySelectorAll('.p-card')].filter((c) => c.style.display !== 'none');
  return { visible: visible.length, allWeb: visible.every((c) => c.dataset.group === 'web') };
});
console.log(`FILTER AFTER 2 LANG SWITCHES: visible=${filterOk.visible} allWeb=${filterOk.allWeb} -> ${filterOk.allWeb ? 'PASS' : 'FAIL'}`);

// ---- P2-4: 弹窗关闭→快速重开 ----
await page.evaluate(() => document.querySelector('.filter[data-group="all"]').click());
await sleep(500);
await page.evaluate(() => document.querySelector('.p-card .p-open').click());
await sleep(150);
await page.keyboard.press('Escape');
await sleep(60); // 竞态窗口内
await page.evaluate(() => document.querySelectorAll('.p-card .p-open')[1].click());
await sleep(700);
const race = await page.evaluate(() => ({
  modalAlive: !!document.querySelector('.modal'),
  title: document.querySelector('.pm-title')?.firstChild?.textContent,
}));
console.log(`RACE close→reopen: modal=${race.modalAlive} title=${race.title} -> ${race.modalAlive ? 'PASS' : 'FAIL'}`);
await page.keyboard.press('Escape');
await sleep(500);

// ---- P2-5: ESC 层级（modal+palette 叠加） ----
await page.evaluate(() => document.querySelector('.p-card .p-open').click());
await sleep(600);
await page.keyboard.down('Control');
await page.keyboard.press('KeyK');
await page.keyboard.up('Control');
await sleep(500);
await page.keyboard.press('Escape');
await sleep(400);
const layers1 = await page.evaluate(() => ({ palette: !!document.querySelector('.palette'), modal: !!document.querySelector('.modal') }));
console.log(`ESC LAYER 1: palette=${layers1.palette} modal=${layers1.modal} -> ${!layers1.palette && layers1.modal ? 'PASS (palette closed only)' : 'FAIL'}`);
await page.keyboard.press('Escape');
await sleep(500);
const layers2 = await page.evaluate(() => ({ palette: !!document.querySelector('.palette'), modal: !!document.querySelector('.modal') }));
console.log(`ESC LAYER 2: modal=${layers2.modal} -> ${!layers2.modal ? 'PASS' : 'FAIL'}`);

// ---- P3-10: 回到顶部导航高亮 ----
await page.evaluate(() => window.scrollTo(0, 0));
await sleep(800);
const navTop = await page.evaluate(() => document.querySelector('.nav-link.active')?.textContent ?? null);
console.log(`NAV AT TOP: active=${navTop} -> ${navTop === null || navTop === undefined ? 'PASS' : 'FAIL'}`);

// ---- P3-11: 面板空结果 ----
await page.keyboard.down('Control');
await page.keyboard.press('KeyK');
await page.keyboard.up('Control');
await sleep(400);
await page.type('#palette-input', 'zzzzz');
await sleep(300);
const empty = await page.evaluate(() => document.querySelector('.pl-empty')?.textContent ?? null);
console.log(`PALETTE EMPTY: "${empty}" -> ${empty ? 'PASS' : 'FAIL'}`);
await page.keyboard.press('Escape');
await sleep(300);

// ---- P2-7: 版本号 ----
const ver = await page.evaluate(() => ({
  footer: [...document.querySelectorAll('.footer p')].map((p) => p.textContent).find((t) => t.includes('SHEN-OS')),
}));
console.log(`VERSION footer: "${ver.footer}" -> ${ver.footer?.includes('2.7.0') ? 'PASS' : 'FAIL'}`);

// ---- 移动端菜单（P1-1） ----
const mp = await browser.newPage();
await mp.setViewport({ width: 375, height: 812 });
mp.on('pageerror', (e) => errors.push('MOBILE: ' + e.message));
await mp.setCacheEnabled(false);
await mp.setRequestInterception(true);
mp.on('request', (req) => req.continue({ headers: { ...req.headers(), 'cache-control': 'no-cache' } }));
await mp.goto(`${BASE}/`, { waitUntil: 'networkidle2', timeout: 60000 });
await sleep(5000);
// 打开菜单
await mp.evaluate(() => document.querySelector('.burger').click());
await sleep(500);
const mOpen = await mp.evaluate(() => document.querySelector('.mnav').classList.contains('open'));
// 点汉堡关闭（z-index 修复后应可点中）
await mp.evaluate(() => {
  const b = document.querySelector('.burger').getBoundingClientRect();
  window.__hit = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2)?.closest('.burger') !== null;
});
await mp.evaluate(() => document.querySelector('.burger').click());
await sleep(400);
const mClosed = await mp.evaluate(() => !document.querySelector('.mnav').classList.contains('open'));
console.log(`MOBILE MENU: open=${mOpen} closedByBurger=${mClosed} -> ${mOpen && mClosed ? 'PASS' : 'FAIL'}`);
// ESC 关闭
await mp.evaluate(() => document.querySelector('.burger').click());
await sleep(300);
await mp.keyboard.press('Escape');
await sleep(300);
const mEsc = await mp.evaluate(() => !document.querySelector('.mnav').classList.contains('open'));
console.log(`MOBILE MENU ESC: ${mEsc} -> ${mEsc ? 'PASS' : 'FAIL'}`);
// 横向溢出
const overflow = await mp.evaluate(() => document.documentElement.scrollWidth);
console.log(`MOBILE 375px scrollWidth=${overflow} -> ${overflow <= 377 ? 'PASS' : 'FAIL (overflow)'}`);
await mp.close();

console.log('PAGE ERRORS:', errors.length ? errors : 'none');
await browser.close();
console.log('DONE');
