const puppeteer = require('puppeteer-core');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: 'new',
    userDataDir: 'D:/shen/test/zcode/shen-website/.shots/edge-lb-' + Date.now(),
    args: ['--window-size=1600,900', '--hide-scrollbars', '--use-angle=swiftshader'],
    defaultViewport: { width: 1600, height: 900 },
  });
  const page = await browser.newPage();
  page.on('pageerror', (e) => console.log('PAGE ERROR:', e.message));
  await page.goto('http://localhost:4173/?static=1', { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(1500);

  // 1. 新链接检查
  const links = await page.evaluate(() => {
    const find = (id) => {
      const card = document.querySelector(`.p-card[data-id="${id}"]`);
      return card ? [...card.querySelectorAll('.p-link')].map((a) => a.textContent.trim()) : null;
    };
    return {
      luxiaoji: find('luxiaoji'),
      subway: find('subway-sitp'),
      stm32: find('stm32-text'),
      gemini: find('gemini-history'),
    };
  });
  console.log('LINKS:', JSON.stringify(links, null, 1));

  // 2. 研究图 lightbox：点击 DRIFT 框架图
  await page.evaluate(() => {
    const el = document.querySelector('#research');
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 50);
  });
  await sleep(700);
  await page.evaluate(() => document.querySelector('.research-media img[data-lightbox]').click());
  await sleep(700);
  const lb = await page.evaluate(() => ({
    open: !!document.querySelector('.lightbox'),
    imgVisible: (() => { const i = document.querySelector('.lightbox img'); return i && i.getBoundingClientRect().width > 400; })(),
    caption: document.querySelector('.lightbox figcaption')?.textContent.slice(0, 20),
  }));
  console.log('RESEARCH LIGHTBOX:', JSON.stringify(lb));
  await page.screenshot({ path: 'D:/shen/test/zcode/shen-website/.shots/v9-lightbox.png' });
  await page.keyboard.press('Escape');
  await sleep(400);
  const closed = await page.evaluate(() => !document.querySelector('.lightbox'));
  console.log('LIGHTBOX ESC close:', closed ? 'PASS' : 'FAIL');

  await browser.close();
  console.log('DONE');
})();
