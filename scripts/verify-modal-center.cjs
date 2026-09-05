const puppeteer = require('puppeteer-core');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: 'new',
    userDataDir: 'D:/shen/test/zcode/shen-website/.shots/edge-vc-' + Date.now(),
    args: ['--window-size=1600,900', '--hide-scrollbars', '--use-angle=swiftshader'],
    defaultViewport: { width: 1600, height: 900 },
  });
  const results = [];
  for (const vp of [{ w: 1600, h: 900 }, { w: 1280, h: 720 }, { w: 375, h: 812 }]) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.w, height: vp.h });
    await page.goto('http://localhost:4173/?static=1', { waitUntil: 'networkidle2', timeout: 60000 });
    await sleep(1200);
    await page.evaluate(() => {
      const el = document.querySelector('.projects-block');
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 60);
    });
    await sleep(500);
    await page.evaluate(() => document.querySelector('.p-card .p-open').click());
    await sleep(700);
    const r = await page.evaluate(() => {
      const m = document.querySelector('.modal');
      const b = m.getBoundingClientRect();
      const topGap = b.top;
      const bottomGap = innerHeight - b.bottom;
      return {
        topGap: Math.round(topGap),
        bottomGap: Math.round(bottomGap),
        delta: Math.abs(Math.round(topGap - bottomGap)),
        fullyVisible: b.top >= 0 && b.bottom <= innerHeight,
        h: Math.round(b.height),
      };
    });
    results.push({ vp: `${vp.w}x${vp.h}`, ...r });
    if (vp.w === 1600) {
      await page.screenshot({ path: 'D:/shen/test/zcode/shen-website/.shots/v8-modal-centered.png' });
    }
    await page.close();
  }
  console.table(results);
  const allOk = results.every((r) => r.delta <= 6 && r.fullyVisible);
  console.log('CENTERING:', allOk ? 'ALL PASS' : 'FAIL');
  await browser.close();
})();
