const { chromium } = require('C:/Users/Usuario/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const sharp = require('C:/Users/Usuario/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
  await page.goto('http://localhost:3017/', { waitUntil: 'domcontentloaded' });
  await page.setContent('<style>body{margin:0;background:#000}video{width:960px;height:540px}</style><video muted playsinline></video>');
  const tiles = [];
  for (const [row, key] of ['pour', 'pass', 'return'].entries()) {
    await page.evaluate(async key => {
      const v = document.querySelector('video');
      v.src = `/assets/mate-cinematic/${key}.mp4`;
      await new Promise((resolve, reject) => { v.onloadeddata = resolve; v.onerror = reject; v.load(); });
    }, key);
    for (const [col, time] of [0.1, 2.5, 4.85].entries()) {
      await page.evaluate(async time => {
        const v = document.querySelector('video');
        await new Promise(resolve => { v.onseeked = resolve; v.currentTime = time; });
      }, time);
      await page.waitForTimeout(250);
      console.log(key, time, await page.evaluate(() => ({ time: document.querySelector('video').currentTime, duration: document.querySelector('video').duration })));
      const file = `qa/${key}-${col}.png`;
      await page.screenshot({ path: file });
      tiles.push({ input: await sharp(file).resize(480, 270).toBuffer(), left: col * 480, top: row * 270 });
    }
  }
  await sharp({ create: { width: 1440, height: 810, channels: 3, background: '#000' } }).composite(tiles).png().toFile('qa/video-contact-sheet.png');
  console.log('Video review frames saved. Rows: pour, pass, return. Columns: start, midpoint, end.');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
