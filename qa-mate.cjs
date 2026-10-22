const { chromium } = require('C:/Users/Usuario/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  async function advance(text) {
    await page.waitForFunction(text => document.querySelector('.mate-caption.visible p')?.textContent === text, text, { timeout: 30000 });
    await page.waitForTimeout(350);
    await page.locator('.mate-caption button').click();
  }
  await page.goto('http://localhost:3017/?scene=MISSION_MATE', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('.mate-caption.visible p')?.textContent === 'Serví vos hoy.');
  await page.screenshot({ path: 'qa/dialogue-father.png' });
  await advance('Serví vos hoy.');
  await page.locator('#mate-pour').waitFor({ timeout: 30000 });
  // Dialogue may remain open longer than the old timer; it must block actions.
  await page.evaluate(() => { window.__APP__.sceneManager.currentScene.say('VALENTINO', ['Una mañana tranquila junto a la ventana.', 'Esperamos hasta que termines de leer.', 'Después seguimos con el mate.']); });
  await page.waitForTimeout(3000);
  const waiting = await page.locator('.mate-caption.visible p').textContent();
  if (waiting !== 'Una mañana tranquila junto a la ventana.' || await page.locator('#mate-pour').isVisible()) throw new Error('Dialogue did not wait or failed to block interactions');
  await page.screenshot({ path: 'qa/dialogue-valentino.png' });
  await advance(waiting);
  await page.waitForTimeout(350);
  await page.keyboard.press('Space');
  await advance('Después seguimos con el mate.');
  await page.screenshot({ path: 'qa/master.png' });
  await page.locator('#mate-pour').click();
  await advance('Eso.');
  await advance('Despacito.');
  await page.locator('#mate-pass').waitFor({ timeout: 30000 });
  await page.screenshot({ path: 'qa/pour-end.png' });
  const pour = await page.evaluate(() => ({ playback: document.querySelector('.mate-frame').dataset.playback, ended: window.__APP__.sceneManager.currentScene.videos.pour.ended }));
  if (process.env.QA_PARTIAL === '1') {
    console.log(JSON.stringify({ pour, errors }));
    await browser.close(); return;
  }
  await page.locator('#mate-pass').click();
  await page.waitForFunction(() => document.querySelector('.mate-caption.visible p')?.textContent === '¿Está bien?', { timeout: 30000 });
  await page.screenshot({ path: 'qa/dialogue-close-valentino.png' });
  await advance('¿Está bien?');
  await page.waitForFunction(() => document.querySelector('.mate-caption.visible p')?.textContent === 'Está bueno.');
  await page.screenshot({ path: 'qa/dialogue-close-father.png' });
  await advance('Está bueno.');
  await advance('Tomá.');
  await page.locator('#mate-return').waitFor({ timeout: 40000 });
  const passEnded = await page.evaluate(() => window.__APP__.sceneManager.currentScene.videos.pass.ended);
  if (!passEnded) throw new Error('The pass video did not finish normally');
  await page.screenshot({ path: 'qa/return-ready.png' });
  await page.locator('#mate-return').click();
  await page.waitForFunction(() => document.querySelector('.mate-frame')?.dataset.shot === 'close', { timeout: 30000 });
  const returnTime = await page.evaluate(() => window.__APP__.sceneManager.currentScene.videos.return.currentTime);
  if (returnTime < 2.8 || returnTime > 3.5) throw new Error(`Return cut outside intended interval: ${returnTime}`);
  await page.waitForFunction(() => window.__APP__.sceneManager.currentSceneName === 'INTRO', { timeout: 30000 });
  const saved = await page.evaluate(() => window.__APP__.storage.get('MATE_COMPLETED'));
  if (!saved || !pour.ended || errors.length) throw new Error(JSON.stringify({ saved, pour, errors }));
  // A mid-performance exit must cancel dialogue and never complete the memory.
  await page.goto('http://localhost:3017/?scene=MISSION_MATE');
  await page.evaluate(() => window.__APP__.storage.set('MATE_COMPLETED', false));
  await advance('Serví vos hoy.');
  await page.locator('#mate-pour').waitFor({ timeout: 30000 });
  await page.locator('#mate-pour').click();
  await page.locator('#btn-top-menu').click();
  await page.locator('#btn-start').waitFor();
  await page.waitForTimeout(7500);
  const cancellation = await page.evaluate(() => ({ scene: window.__APP__.sceneManager.currentSceneName, completed: window.__APP__.storage.get('MATE_COMPLETED'), film: !!document.querySelector('.mate-film') }));
  if (cancellation.scene !== 'MENU' || cancellation.completed || cancellation.film) throw new Error(JSON.stringify(cancellation));
  // Re-enter at a mobile size: fit + keyboard access must survive resizing.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3017/?scene=MISSION_MATE');
  await page.waitForFunction(() => document.querySelector('.mate-caption.visible p')?.textContent === 'Serví vos hoy.');
  await page.screenshot({ path: 'qa/dialogue-mobile.png' });
  const speechBox = await page.locator('.mate-caption button').boundingBox();
  if (speechBox.x < 0 || speechBox.x + speechBox.width > 391 || speechBox.y < 0) throw new Error('Mobile speech outside screen');
  await advance('Serví vos hoy.');
  await page.locator('#mate-pour').waitFor({ timeout: 30000 });
  await page.locator('#mate-pour').focus();
  await page.screenshot({ path: 'qa/mobile.png' });
  const geometry = await page.locator('.mate-frame').boundingBox();
  if (Math.abs(geometry.width / geometry.height - 16 / 9) > .01) throw new Error('Aspect ratio mismatch');
  console.log(JSON.stringify({ fullSequence: 'PASS', saved, pour, cancellation, mobile: geometry, errors }, null, 2));
  fs.writeFileSync('qa/results.json', JSON.stringify({ fullSequence: 'PASS', dialogueWait: 'PASS', dialogueKeyboard: 'PASS', mobileSpeech: speechBox, saved, pour, passEnded, returnTime, cancellation, mobile: geometry, errors, videoRange: 'PASS' }, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
