const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
let count = 0;
for (const folder of ['scripts', 'scenes']) {
  for (const file of fs.readdirSync(path.join(root, folder)).filter(f => /\.(js|cjs)$/.test(f))) {
    const full = path.join(root, folder, file);
    const parsed = spawnSync(process.execPath, ['--check', full], { encoding: 'utf8' });
    assert.equal(parsed.status, 0, parsed.stderr);
    const source = fs.readFileSync(full, 'utf8');
    for (const match of source.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
      assert.ok(fs.existsSync(path.resolve(path.dirname(full), match[1])), `${file}: missing import ${match[1]}`);
    }
    count++;
  }
}
for (const file of ['01-master.png', '01b-reach.png', '01c-lift.png', '02-pour.png', '03-pass.png', '04-drink.png', '05-return.png', '06-close.png', 'pour.mp4', 'pass.mp4', 'return.mp4']) {
  const full = path.join(root, 'assets/mate-cinematic', file);
  assert.ok(fs.statSync(full).size > 1000, `Empty asset: ${file}`);
  const bytes = fs.readFileSync(full);
  if (file.endsWith('.mp4')) assert.equal(bytes.subarray(4, 8).toString(), 'ftyp', `Invalid video: ${file}`);
  else assert.equal(bytes.subarray(1, 4).toString(), 'PNG', `Invalid image: ${file}`);
}
const routeFiles = ['00-kitchen.png'];
for (const name of ['01-mate', '02-yerba', '03-pava', '03b-prepare', '04-pour', '05-pass', '06-return']) routeFiles.push(`${name}.mp4`, `${name}-end.png`);
for (const file of routeFiles) {
  const full = path.join(root, 'assets/mate-route', file);
  assert.ok(fs.existsSync(full), `Missing route asset: ${file}`);
  const bytes = fs.readFileSync(full);
  assert.ok(bytes.length > 1000, `Empty route asset: ${file}`);
  assert.equal(bytes.subarray(file.endsWith('.mp4') ? 4 : 1, file.endsWith('.mp4') ? 8 : 4).toString(), file.endsWith('.mp4') ? 'ftyp' : 'PNG', `Invalid route asset: ${file}`);
}
const carFiles = ['00-workshop.png', ...['01-fetch', '02-repair', '03-close'].flatMap(name => [`${name}.mp4`, `${name}-end.png`])];
for (const file of carFiles) {
  const bytes = fs.readFileSync(path.join(root, 'assets/car-cinematic', file));
  assert.ok(bytes.length > 1000, `Empty workshop asset: ${file}`);
  const video = file.endsWith('.mp4');
  assert.equal(bytes.subarray(video ? 4 : 1, video ? 8 : 4).toString(), video ? 'ftyp' : 'PNG', `Invalid workshop asset: ${file}`);
}
for (const file of ['00-radio.png', '01-power.mp4', '01-power-end.png']) {
  const bytes = fs.readFileSync(path.join(root, 'assets/radio-cinematic', file));
  const video = file.endsWith('.mp4');
  assert.ok(bytes.length > 1000, `Empty radio asset: ${file}`);
  assert.equal(bytes.subarray(video ? 4 : 1, video ? 8 : 4).toString(), video ? 'ftyp' : 'PNG', `Invalid radio asset: ${file}`);
}
const appSource = fs.readFileSync(path.join(root, 'scripts/app.js'), 'utf8');
const presentIsMain = /register\(['"]INTRO['"],\s*new PresentWalkScene\(/.test(appSource);
const legacyPresentIsMain = /register\(['"]INTRO['"],\s*new PresentScene\(/.test(appSource);
const presentFiles = legacyPresentIsMain ? ['bedroom.png', 'hall.png', 'bathroom.png', 'kitchen.png', 'bathroom-open-approved.mp4', 'bathroom-open-end.png', 'bathroom-wash-approved.mp4', 'bathroom-wash-end.png', 'bathroom-close.mp4', 'bathroom-closed.png'] : [];
for (const file of presentFiles) {
  const full = path.join(root, 'assets/present-cinematic', file);
  assert.ok(fs.existsSync(full), `Missing present asset: ${file}`);
  const bytes = fs.readFileSync(full);
  const video = file.endsWith('.mp4');
  assert.ok(bytes.length > 1000, `Empty present asset: ${file}`);
  assert.equal(bytes.subarray(video ? 4 : 1, video ? 8 : 4).toString(), video ? 'ftyp' : 'PNG', `Invalid present asset: ${file}`);
}
const presentSource = fs.readFileSync(path.join(root, 'scenes/PresentScene.js'), 'utf8');
const openingSource = fs.readFileSync(path.join(root, 'scenes/OpeningScene.js'), 'utf8');
const packingSource=['scripts/PackingFilmProgress.js','scripts/CarDepartureProgress.js'].map(file=>fs.readFileSync(path.join(root,file),'utf8')).join('\n');
for(const match of packingSource.matchAll(/'([^']+\.(?:png|mp4))'/g)){
  const file=match[1],video=file.endsWith('.mp4');
  const full=path.join(root,file);
  const bytes=fs.readFileSync(full);
  assert.ok(bytes.length>1000,`Empty packing asset: ${file}`);
  assert.equal(bytes.subarray(video?4:1,video?8:4).toString(),video?'ftyp':'PNG',`Invalid packing asset: ${file}`);
}
assert.ok(/register\('DEPARTURE', new PackingFilmScene\(\)\)/.test(appSource),'Departure must use filmed kitchen packing');
const dreamFiles = [...openingSource.matchAll(/'assets\/nightmare\/([^']+\.png)'/g)].map(match=>match[1]);
assert.equal(dreamFiles.length,8,'Eight nightmare shots required');
for(const file of dreamFiles){
  const bytes = fs.readFileSync(path.join(root,'assets/nightmare',file));
  assert.ok(bytes.length > 1000,`Empty dream shot: ${file}`);
  assert.equal(bytes.subarray(1,4).toString(),'PNG',`Invalid dream shot: ${file}`);
}
const thirdPersonFiles = ['bedroom-base-v1.png', 'hall-base-v1.png', 'kitchen-base-v1.png', 'bathroom-base-v1.png'];
thirdPersonFiles.push('bedroom-sleep-v1.png');
for (const file of thirdPersonFiles) {
  const bytes = fs.readFileSync(path.join(root, 'assets/present-third-person', file));
  assert.ok(bytes.length > 1000, `Empty third-person asset: ${file}`);
  assert.equal(bytes.subarray(1, 4).toString(), 'PNG', `Invalid third-person image: ${file}`);
}
assert.ok(!/play\(['"]bathroom-wash\.mp4['"]/.test(presentSource), 'Rejected bathroom footage referenced by scene');
const walkSource = fs.readFileSync(path.join(root, 'scripts/PresentWalkProgress.js'), 'utf8');
const walkFiles = new Set([...walkSource.matchAll(/'([^']+\.(?:png|mp4))'/g)].map(match => match[1]));
for (const file of ['01-bow.mp4','01-bow-end.png','02-return.mp4','02-return-end.png']) walkFiles.add(`assets/present-chair-v1/${file}`);
for (const match of openingSource.matchAll(/src="([^"]+\.(?:png|mp4))"/g)) walkFiles.add(match[1]);
for (const file of walkFiles) {
  const bytes = fs.readFileSync(path.join(root, file));
  const video = file.endsWith('.mp4');
  assert.ok(bytes.length > 1000, `Empty walk candidate: ${file}`);
  assert.equal(bytes.subarray(video ? 4 : 1, video ? 8 : 4).toString(), video ? 'ftyp' : 'PNG', `Invalid walk candidate: ${file}`);
}
console.log(`Validated ${walkFiles.size} present walk candidate assets (visual approval pending).`);
console.log(`Validated ${count} scripts, relative imports and ${11 + routeFiles.length + carFiles.length + 3 + presentFiles.length + thirdPersonFiles.length + dreamFiles.length} cinematic assets. Present: ${presentIsMain ? 'main route' : 'development preview'}.`);
