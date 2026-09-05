const puppeteer = require('puppeteer-core');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: 'new',
    userDataDir: 'D:/shen/test/zcode/shen-website/.shots/edge-dbgm2-' + Date.now(),
    args: ['--window-size=1600,900', '--use-angle=swiftshader'],
    defaultViewport: { width: 1600, height: 900 },
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:4173/?static=1', { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(1200);
  await page.evaluate(() => {
    const el = document.querySelector('.projects-block');
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 60);
  });
  await sleep(400);
  await page.evaluate(() => document.querySelector('.p-card .p-open').click());
  await sleep(500);
  const r = await page.evaluate(() => {
    const m = document.querySelector('.modal');
    const b = m.getBoundingClientRect();
    return { top: Math.round(b.top), bottom: Math.round(b.bottom), h: innerHeight, transform: getComputedStyle(m).transform.slice(0, 40), scrollH: m.scrollHeight, clientH: m.clientHeight };
  });
  console.log('STATIC:', JSON.stringify(r));
  await browser.close();
})();
