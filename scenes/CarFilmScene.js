import { resolveMemoryReturnScene } from '../scripts/PresentProgress.js';
import { MateScene as FilmScene } from './MateRouteScene.js';
import {mediaPath,mediaPreload} from '../scripts/MediaAssets.js';

const ROOT = 'assets/car-cinematic/';
export const CAR_ACTIONS = [
  { id: 'fetch', file: '01-fetch.mp4', follow: [[0, 50], [1, 50]], cues: [[3.2, 'playSoftStep'], [3.7, 'playSoftStep'], [5.2, 'playSoftStep'], [5.7, 'playSoftStep']] },
  { id: 'repair', file: '02-repair.mp4', follow: [[0, 50], [1, 50]], cues: [[4.5, 'playWrenchTurn'], [6.1, 'playWrenchTurn']] },
  { id: 'close', file: '03-close.mp4', follow: [[0, 50], [1, 50]], cues: [[5.2, 'playHoodThud']] }
];

/** Reuses the proven cancellable playback/dialogue lifecycle of the Mate scene. */
export class CarFilmScene extends FilmScene {
  async enter(container) {
    this.controller = new AbortController();
    this.pending = new Set();
    this.alive = true;
    this.inspecting = false;
    this.advanceDialogue = null;
    this.state = 'opening';
    this.step = 0;
    this.camera = 50;
    this.heads = { father: [43, 12], valentino: [59, 7] };
    document.body.classList.add('mate-cinematic', 'memory-cinematic-mode');
    this.layer = document.createElement('section');
    this.layer.className = 'mate-film car-film';
    this.layer.setAttribute('aria-label', 'Pasame la diez. Valentino y su padre en el taller');
    this.layer.innerHTML = `<div class="mate-frame">
      <img class="mate-shot" src="${mediaPath(ROOT+'00-workshop.png')}" alt="Valentino de 18 años junto a su padre, auto con capó abierto y herramientas a la derecha" draggable="false">
      <div class="mate-clips"></div><div class="mate-hotspots"></div>
      <div class="mate-title"><span>RECUERDO II</span><h1>Pasame la diez</h1></div>
      <div class="mate-caption" role="status" aria-live="polite"><button type="button" class="mate-speech"><span></span><p></p><small>Clic para seguir</small></button></div>
      <p class="mate-guidance">Explorá los objetos · H para encontrar la próxima acción</p>
      <section class="car-tool-choice" aria-label="Elegir herramienta" hidden><h2>La caja de herramientas</h2><p>¿Cuál le alcanzás?</p><div><button data-tool="8">Llave de 8</button><button data-tool="10">Llave de 10</button><button data-tool="12">Llave de 12</button></div><button data-back>Volver al taller</button></section>
      <div class="mate-media-error" role="alert" hidden><p>No se pudo reproducir este movimiento.</p><button type="button">Volver a intentar</button></div>
    </div>`;
    container.appendChild(this.layer);
    for (const [key, selector] of Object.entries({ frame: '.mate-frame', still: '.mate-shot', caption: '.mate-caption', hotspots: '.mate-hotspots', guidance: '.mate-guidance', mediaError: '.mate-media-error', choices: '.car-tool-choice' })) this[key] = this.layer.querySelector(selector);
    this.world = this.frame;
    this.videos = {};
    for (const action of CAR_ACTIONS) {
      const video = document.createElement('video');
      video.className = 'mate-clip'; video.src = mediaPath(ROOT + action.file);
      video.preload = mediaPreload('metadata'); video.muted = true; video.playsInline = true;
      video.setAttribute('aria-hidden', 'true');
      this.layer.querySelector('.mate-clips').appendChild(video);
      this.videos[action.id] = video;
    }
    this.frame.dataset.state = this.state;
    const fit = () => {
      const w = Math.min(container.clientWidth, Math.max(160, container.clientHeight - 150) * 16 / 9);
      this.frame.style.width = `${w}px`; this.frame.style.height = `${w * 9 / 16}px`;
      if (this.advanceDialogue) this.placeDialogue();
    };
    this.observer = new ResizeObserver(fit); this.observer.observe(container); fit();
    const signal = this.controller.signal;
    this.frame.addEventListener('click', e => { if (!e.target.closest('.mate-object,.car-tool-choice,.mate-media-error')) this.advanceDialogue?.(); }, { signal });
    window.addEventListener('keydown', e => {
      if (e.repeat) return;
      if (this.advanceDialogue && [' ', 'Enter'].includes(e.key) && !e.target.closest('button,a,input')) { e.preventDefault(); this.advanceDialogue(); }
      else if (this.canExplore() && e.key.toLowerCase() === 'h') this.frame.classList.toggle('show-hints');
      else if (e.key === 'Escape' && this.state === 'choosing') this.closeChoices();
    }, { signal });
    this.choices.addEventListener('click', e => {
      if (e.target.closest('[data-back]')) this.closeChoices();
      const tool = e.target.closest('[data-tool]');
      if (tool) this.selectTool(tool.dataset.tool);
    }, { signal });
    this.mediaError.querySelector('button').addEventListener('click', () => {
      if (this.state !== 'media-error') return;
      this.mediaError.hidden = true; this.state = 'ready'; this.perform(CAR_ACTIONS[this.step].id);
    }, { signal });
    try { await this.still.decode(); } catch { /* Keep descriptive alternative text. */ }
  }

  setCamera(value) { this.camera = value; }

  placeDialogue() {
    const [x, y] = this.heads[this.caption.dataset.speaker];
    const width = Math.min(310, this.frame.clientWidth * .48);
    const left = Math.max(8, Math.min(this.frame.clientWidth - width - 8, this.frame.clientWidth * x / 100 - width / 2));
    this.caption.style.width = `${width}px`; this.caption.style.left = `${left}px`;
    const stageTop = this.frame.getBoundingClientRect().top - this.layer.getBoundingClientRect().top;
    this.caption.style.top = `${Math.max(8 - stageTop, this.frame.clientHeight * y / 100 - this.caption.offsetHeight - 10)}px`;
    this.caption.style.setProperty('--speech-tail', `${Math.max(12, Math.min(width - 12, this.frame.clientWidth * x / 100 - left))}px`);
  }

  async onVisible() {
    if (!this.alive) return;
    this.audio.playAtmosphere('car_garage');
    if (!await this.wait(1800)) return;
    this.layer.querySelector('.mate-title').classList.add('departed');
    if (!await this.wait(1000) || !await this.say('PAPÁ', 'A ver, Valen, pasame la llave diez.')) return;
    this.arm();
  }

  arm() {
    if (!this.alive) return;
    this.state = 'ready'; this.frame.dataset.state = CAR_ACTIONS[this.step].id;
    this.frame.dataset.step = String(this.step);
    this.frame.classList.remove('action-running', 'show-hints');
    this.hotspots.replaceChildren(); this.videos[CAR_ACTIONS[this.step].id].preload = 'auto';
    const targets = [
      ['Elegir la llave', 80, 48, 18, 18, () => this.openChoices()],
      ['Ajustar la abrazadera', 34, 48, 17, 18, () => this.perform('repair')],
      ['Cerrar el capó', 8, 8, 27, 35, () => this.perform('close')]
    ];
    const [label, x, y, w, h, action] = targets[this.step];
    this.hotspot(`car-${CAR_ACTIONS[this.step].id}`, label, x, y, w, h, action);
    this.guidance.textContent = ['La caja está sobre el banco de la derecha.', 'Probá el ajuste en la manguera del motor.', 'Ya está. Falta cerrar el capó.'][this.step];
    clearTimeout(this.hintTimer);
    this.hintTimer = setTimeout(() => { if (this.canExplore()) this.frame.classList.add('show-hints'); }, 9000);
  }

  openChoices() {
    if (!this.canExplore()) return;
    this.state = 'choosing'; this.choices.hidden = false;
    this.hotspots.replaceChildren(); this.choices.querySelector('button').focus();
  }

  closeChoices() {
    if (this.state !== 'choosing') return;
    this.choices.hidden = true; this.arm(); this.hotspots.firstElementChild.focus();
  }

  async selectTool(tool) {
    if (this.state !== 'choosing') return;
    this.choices.hidden = true; this.state = 'busy';
    if (tool !== '10') {
      if (!await this.say('PAPÁ', 'Esa no. Buscá la diez, fijate bien.')) return;
      this.arm(); this.openChoices(); return;
    }
    this.state = 'ready'; this.perform('fetch');
  }

  async perform(id) {
    const action = CAR_ACTIONS[this.step];
    if (!this.canExplore() || action.id !== id) return;
    this.state = 'busy'; this.frame.dataset.state = 'busy';
    this.frame.classList.add('action-running'); this.hotspots.replaceChildren();
    clearTimeout(this.hintTimer); this.audio.ensureContext();
    if (!await this.playAction(action)) {
      if (this.alive) { this.state = 'media-error'; this.mediaError.hidden = false; this.mediaError.querySelector('button').focus(); }
      return;
    }
    if (!this.alive) return;
    if (id === 'fetch') {
      this.heads = { father: [43, 12], valentino: [62, 6] };
      if (!await this.say('VALENTINO', 'Acá está la diez.')) return;
      if (!await this.say('PAPÁ', ['Probá vos.', 'No fuerces. Sentí cómo agarra la rosca. Si forzás, se puede falsear y chau.'])) return;
    } else if (id === 'repair') {
      this.heads = { father: [40, 12], valentino: [57, 5] };
      if (!await this.say('VALENTINO', 'Ajustó perfecto.')) return;
      if (!await this.say('PAPÁ', ['Ahí está.', 'Siempre tranquilo.'])) return;
    } else {
      this.heads = { father: [40, 12], valentino: [61, 6] };
      if (!await this.say('VALENTINO', ['Si la aguja de temperatura vuelve a subir en la ruta...', 'sé exactamente qué hacer. Gracias, viejo.'])) return;
      if (!await this.wait(1800)) return;
      this.state = 'complete'; this.storage.set('CAR_COMPLETED', true);
      this.sceneManager.changeScene(resolveMemoryReturnScene(this.storage), 'warm-fade'); return;
    }
    this.step++; this.arm();
  }

  exit() { super.exit(); this.audio.stopEngine(); }
}
