const puppeteer = require('puppeteer-core');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: 'new',
    userDataDir: 'D:/shen/test/zcode/shen-website/.shots/edge-dbgm3-' + Date.now(),
    args: ['--window-size=1600,900', '--use-angle=swiftshader'],
    defaultViewport: { width: 1600, height: 900 },
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(5500);
  await page.evaluate(() => {
    const el = document.querySelector('.projects-block');
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 60);
  });
  await sleep(600);
  await page.evaluate(() => document.querySelector('.p-card .p-open').click());
  await sleep(1000);
  const r = await page.evaluate(() => {
    const m = document.querySelector('.modal');
    const b = m.getBoundingClientRect();
    return { top: Math.round(b.top), bottom: Math.round(b.bottom), vh: innerHeight, t: getComputedStyle(m).transform.slice(0, 60) };
  });
  console.log('DYNAMIC:', JSON.stringify(r));
  await page.screenshot({ path: '.shots/dbg-modal-dyn.png' });
  await browser.close();
})();
