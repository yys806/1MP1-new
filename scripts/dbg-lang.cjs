const puppeteer = require('puppeteer-core');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: 'new',
    userDataDir: 'D:/shen/test/zcode/shen-website/.shots/edge-dbg-' + Date.now(),
    args: ['--window-size=1600,900', '--use-angle=swiftshader'],
    defaultViewport: { width: 1600, height: 900 },
  });
  const page = await browser.newPage();
  page.on('console', (m) => console.log('PAGE:', m.text().slice(0, 120)));
  page.on('pageerror', (e) => console.log('ERR:', e.message));
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(5500);
  const out = await page.evaluate(async () => {
    const log = [];
    log.push('bundle has EN tags: ' + (document.documentElement.innerHTML.includes('Multimodal LLM') ? 'yes' : 'no'));
    // 点击语言切换
    document.getElementById('lang-toggle').click();
    await new Promise((r) => setTimeout(r, 900));
    log.push('after click, html lang: ' + document.documentElement.lang);
    log.push('first p-tag: ' + document.querySelector('.p-card .p-tag')?.textContent);
    log.push('nav: ' + document.querySelector('.nav-link')?.textContent);
    log.push('localStorage lang: ' + localStorage.getItem('shen-lang'));
    // 手动调用 setLang 不可能（模块作用域），检查 lang toggle 绑定
    return log;
  });
  console.log(out.join('\n'));
  await browser.close();
})();
