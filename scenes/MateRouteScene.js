import { resolveMemoryReturnScene } from '../scripts/PresentProgress.js';
import { MateScene as DialogueScene } from './MateScene.js';
import {mediaPath,mediaPreload} from '../scripts/MediaAssets.js';

const ROOT = 'assets/mate-route/';
// Positions refer to the full kitchen image, before the camera crop.
export const ACTIONS = [
  { id: 'mate', label: 'Buscar el mate', area: [8, 36, 7, 13], zone: 0, hint: 'El mate está junto a la ventana.', file: '01-mate.mp4', start: '00-kitchen.png', heads: [38, 67], follow: [[0, 0], [.55, 0], [1, 50]] },
  { id: 'yerba', label: 'Buscar la yerba', area: [84, 35, 7, 12], zone: 100, startCamera: 50, hint: 'La yerba está en la mesada.', file: '02-yerba.mp4', start: '01-mate-end.png', heads: [38, 67], follow: [[0, 50], [1, 50]] },
  { id: 'pava', label: 'Buscar la pava', area: [90, 32, 9, 15], zone: 100, startCamera: 50, hint: 'Falta traer la pava.', file: '03-pava.mp4', start: '02-yerba-end.png', heads: [38, 67], follow: [[0, 50], [1, 50]] },
  { id: 'prepare', label: 'Poner la yerba', area: [47, 41, 8, 15], zone: 50, hint: 'Prepará el mate con la yerba.', file: '03b-prepare.mp4', start: '03-pava-end.png', heads: [38, 67], follow: [[0, 50], [1, 50]] },
  { id: 'pour', label: 'Cebar el mate', area: [47, 37, 10, 12], zone: 50, hint: 'Ya está todo en la mesa.', file: '04-pour.mp4', start: '03b-prepare-end.png', heads: [38, 68], follow: [[0, 50], [1, 50]], cues: [[4.3, 'playPourWater']] },
  { id: 'pass', label: 'Alcanzar a papá', area: [44, 40, 7, 16], zone: 50, hint: 'Alcanzale el mate a papá.', file: '05-pass.mp4', start: '04-pour-end.png', heads: [40, 68], follow: [[0, 50], [1, 50]], cues: [[6.5, 'playMateSip']] },
  { id: 'return', label: 'Recibir el mate', area: [61, 40, 12, 18], zone: 50, hint: 'Papá te devuelve el mate.', file: '06-return.mp4', start: '05-pass-end.png', heads: [36, 66], follow: [[0, 50], [1, 50]] }
];

ACTIONS[0].cues = [1.4, 1.9, 2.5, 3, 6.2, 6.7, 7.2, 7.7].map(t => [t, 'playSoftStep']);
ACTIONS[1].cues = [.5, 1, 1.5, 2, 2.5, 3, 3.5, 6.6, 7.1, 7.6, 8.1, 8.6].map(t => [t, 'playSoftStep']);
ACTIONS[2].cues = [.5, 1, 1.5, 2, 2.5, 3, 3.5, 6.3, 6.8, 7.3, 7.8, 8.3].map(t => [t, 'playSoftStep']);

export class MateScene extends DialogueScene {
  async enter(container) {
    this.controller = new AbortController();
    this.pending = new Set();
    this.alive = true;
    this.inspecting = false;
    this.advanceDialogue = null;
    this.state = 'opening';
    this.step = 0;
    this.camera = 50;
    this.heads = [33, 66];
    this.objects = { mate: 'window', yerba: 'counter', pava: 'counter' };
    document.body.classList.add('mate-cinematic', 'memory-cinematic-mode');
    this.layer = document.createElement('section');
    this.layer.className = 'mate-film mate-route';
    this.layer.setAttribute('aria-label', 'Preparar y compartir el mate con papá');
    this.layer.innerHTML = `<div class="mate-frame">
      <div class="mate-camera-window"><div class="mate-world">
        <img class="mate-shot" src="${mediaPath(ROOT+'00-kitchen.png')}" alt="Cocina: ventana a la izquierda, mesa con papá en el centro y mesada a la derecha" draggable="false">
        <div class="mate-clips"></div><div class="mate-hotspots"></div>
      </div></div>
      <div class="mate-title"><span>RECUERDO I</span><h1>Una mañana cualquiera</h1></div>
      <nav class="mate-camera-nav" aria-label="Explorar la cocina"><button type="button" data-zone="0" aria-label="Mirar hacia la ventana">‹ <span>Ventana</span></button><button type="button" data-zone="50" aria-label="Mirar hacia la mesa"><span>Mesa</span></button><button type="button" data-zone="100" aria-label="Mirar hacia la mesada"><span>Mesada</span> ›</button></nav>
      <div class="mate-caption" role="status" aria-live="polite"><button type="button" class="mate-speech"><span></span><p></p><small>Clic para seguir</small></button></div>
      <p class="mate-guidance">Explorá la cocina · ← → para mirar · H para encontrar objetos</p>
      <div class="mate-media-error" role="alert" hidden><p>No se pudo reproducir este movimiento.</p><button type="button">Volver a intentar</button></div>
    </div>`;
    container.appendChild(this.layer);
    for (const [name, selector] of Object.entries({ frame: '.mate-frame', world: '.mate-world', still: '.mate-shot', caption: '.mate-caption', hotspots: '.mate-hotspots', nav: '.mate-camera-nav', guidance: '.mate-guidance', mediaError: '.mate-media-error' })) this[name] = this.layer.querySelector(selector);
    this.videos = {};
    this.nav.querySelectorAll('button').forEach(b => b.disabled = true);
    this.frame.dataset.state = 'opening';
    for (const action of ACTIONS) {
      const video = document.createElement('video');
      video.className = 'mate-clip';
      video.src = mediaPath(ROOT + action.file);
      video.preload = mediaPreload('metadata');
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('aria-hidden', 'true');
      this.layer.querySelector('.mate-clips').appendChild(video);
      this.videos[action.id] = video;
    }
    const fit = () => {
      const w = Math.min(container.clientWidth, Math.max(160, container.clientHeight - 120) * 16 / 9);
      this.frame.style.width = `${w}px`;
      this.frame.style.height = `${w * 9 / 16}px`;
      if (this.advanceDialogue) this.placeDialogue();
    };
    this.observer = new ResizeObserver(fit);
    this.observer.observe(container);
    fit();
    this.setCamera(50);
    const signal = this.controller.signal;
    this.nav.addEventListener('click', e => {
      const button = e.target.closest('[data-zone]');
      if (button && this.canExplore()) this.panTo(Number(button.dataset.zone));
    }, { signal });
    this.frame.addEventListener('click', e => {
      if (!e.target.closest('.mate-object, .mate-camera-nav, .mate-media-error')) this.advanceDialogue?.();
    }, { signal });
    window.addEventListener('keydown', e => {
      if (e.repeat) return;
      if (this.advanceDialogue && [' ', 'Enter'].includes(e.key) && !e.target.closest('button,a,input')) { e.preventDefault(); this.advanceDialogue(); }
      else if (this.canExplore() && ['ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); this.panTo(Math.max(0, Math.min(100, this.camera + (e.key === 'ArrowLeft' ? -50 : 50)))); }
      else if (this.canExplore() && e.key.toLowerCase() === 'h') { this.frame.classList.toggle('show-hints'); this.guidance.textContent = ACTIONS[this.step].hint; }
    }, { signal });
    this.mediaError.querySelector('button').addEventListener('click', () => {
      if (this.state !== 'media-error') return;
      this.mediaError.hidden = true;
      this.arm();
      this.perform(ACTIONS[this.step].id);
    }, { signal });
    try { await this.still.decode(); } catch { /* The browser retains the descriptive alternative text. */ }
  }

  async onVisible() {
    if (!this.alive) return;
    this.audio.playAtmosphere('mate_morning');
    if (!await this.wait(1800)) return;
    this.layer.querySelector('.mate-title').classList.add('departed');
    if (!await this.wait(1000)) return;
    if (!await this.say('PAPÁ', ['Bueno, Valentino,', 'es hora de que me muestres cómo hacés un buen mate.'])) return;
    this.arm();
  }

  canExplore() { return this.alive && this.state === 'ready' && !this.advanceDialogue && !this.inspecting; }

  setCamera(value) {
    this.camera = Math.max(0, Math.min(100, value));
    this.world.style.left = `${-.32 * this.camera}%`;
    this.frame.dataset.camera = String(Math.round(this.camera));
    if (this.advanceDialogue) this.placeDialogue();
  }

  async panTo(value) {
    this.world.classList.add('panning');
    this.setCamera(value);
    if (!await this.wait(700)) return false;
    this.world.classList.remove('panning');
    return true;
  }

  placeDialogue() {
    const father = this.caption.dataset.speaker === 'father';
    const x = this.heads[father ? 1 : 0] * 1.32 - this.camera * .32;
    const y = (father ? 24 : 22) * 1.32 - 16;
    const width = Math.min(310, this.frame.clientWidth * .48);
    const left = Math.max(8, Math.min(this.frame.clientWidth - width - 8, this.frame.clientWidth * x / 100 - width / 2));
    this.caption.style.width = `${width}px`;
    this.caption.style.left = `${left}px`;
    const stageTop = this.frame.getBoundingClientRect().top - this.layer.getBoundingClientRect().top;
    this.caption.style.top = `${Math.max(8 - stageTop, this.frame.clientHeight * y / 100 - this.caption.offsetHeight - 10)}px`;
    this.caption.style.setProperty('--speech-tail', `${Math.max(12, Math.min(width - 12, this.frame.clientWidth * x / 100 - left))}px`);
  }

  arm() {
    if (!this.alive) return;
    const action = ACTIONS[this.step];
    this.state = 'ready';
    this.videos[action.id].preload = 'auto';
    this.frame.dataset.state = action.id;
    this.frame.dataset.step = String(this.step);
    this.frame.classList.remove('show-hints', 'action-running');
    this.hotspots.replaceChildren();
    this.nav.querySelectorAll('button').forEach(b => b.disabled = false);
    this.hotspot(`mate-${action.id}`, action.label, ...action.area, () => this.perform(action.id));
    // Keyboard focus brings an off-screen object into the viewport before activation.
    this.hotspots.firstElementChild.addEventListener('focus', () => { if (this.canExplore()) this.panTo(action.zone); }, { signal: this.controller.signal });
    this.guidance.textContent = 'Explorá la cocina · ← → para mirar · H para encontrar objetos';
    clearTimeout(this.hintTimer);
    this.hintTimer = setTimeout(() => { if (this.canExplore()) { this.guidance.textContent = action.hint; this.frame.classList.add('show-hints'); } }, 9000);
  }

  async playAction(action) {
    const video = this.videos[action.id];
    const previous = Object.values(this.videos).find(v => v.classList.contains('visible'));
    const originCamera = this.camera;
    this.frame.dataset.playback = action.id;
    const fired = new Set();
    return new Promise(resolve => {
      let settled = false, timer, raf;
      const done = ok => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        cancelAnimationFrame(raf);
        video.removeEventListener('playing', playing);
        video.removeEventListener('ended', ended);
        video.removeEventListener('error', failed);
        this.pending.delete(done);
        if (!ok) video.pause();
        resolve(ok);
      };
      const animate = () => {
        if (settled || !this.alive) return;
        const t = video.currentTime / (video.duration || 10);
        const points = [[0, originCamera], ...action.follow.filter(([time]) => time > 0)];
        let end = points.findIndex(([time]) => time >= t);
        if (end < 0) end = points.length - 1;
        const [ta, a] = points[Math.max(0, end - 1)], [tb, b] = points[end];
        const k = Math.max(0, Math.min(1, (t - ta) / (tb - ta || 1)));
        this.setCamera(a + (b - a) * (k * k * (3 - 2 * k)));
        for (const [at, method] of action.cues || []) if (video.currentTime >= at && !fired.has(at)) { fired.add(at); this.audio[method]?.(); }
        raf = requestAnimationFrame(animate);
      };
      const playing = () => {
        this.world.classList.remove('panning');
        video.classList.add('visible');
        if (previous && previous !== video) previous.classList.remove('visible');
        cancelAnimationFrame(raf);
        animate();
      };
      const ended = () => { this.setCamera(50); this.frame.dataset.playback = 'held'; done(true); };
      const failed = () => done(false);
      this.pending.add(done);
      video.addEventListener('playing', playing);
      video.addEventListener('ended', ended);
      video.addEventListener('error', failed);
      timer = setTimeout(failed, 45000);
      if (video.error) video.load();
      video.currentTime = 0;
      video.play().catch(failed);
    });
  }

  async perform(id) {
    const action = ACTIONS[this.step];
    if (!this.canExplore() || id !== action.id) return;
    this.state = 'busy';
    this.frame.classList.add('action-running');
    this.frame.dataset.state = 'busy';
    this.frame.dataset.playback = 'preparing';
    this.hotspots.replaceChildren();
    clearTimeout(this.hintTimer);
    this.nav.querySelectorAll('button').forEach(b => b.disabled = true);
    this.audio.ensureContext();
    if (!await this.panTo(action.startCamera ?? action.zone)) return;
    if (!await this.playAction(action)) {
      if (this.alive) { this.state = 'media-error'; this.mediaError.hidden = false; this.mediaError.querySelector('button').focus(); }
      return;
    }
    if (!this.alive) return;
    this.heads = action.heads;
    if (['mate', 'yerba', 'pava'].includes(id)) this.objects[id] = 'table';
    if (id === 'pour') {
      if (!await this.say('PAPÁ', ['¡Muy bien!', 'Ojo, no te vayas a quemar.'])) return;
    } else if (id === 'pass') {
      this.objects.mate = 'father';
      if (!await this.say('VALENTINO', 'A ver... Fijate qué te parece.')) return;
      if (!await this.say('PAPÁ', 'Mmm... ¡Está bueno!')) return;
      if (!await this.say('PAPÁ', 'Tomá.')) return;
    } else if (id === 'return') {
      this.objects.mate = 'valentino';
      if (!await this.wait(2400)) return;
      this.state = 'complete';
      this.storage.set('MATE_COMPLETED', true);
      this.sceneManager.changeScene(resolveMemoryReturnScene(this.storage), 'black');
      return;
    }
    this.step++;
    this.arm();
  }

  exit() {
    super.exit();
    // A scene label must not survive on the global custom cursor after leaving.
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
      cursor.classList.remove('active', 'has-label');
      const label = cursor.querySelector('.cursor-label');
      if (label) label.textContent = '';
    }
  }
}
