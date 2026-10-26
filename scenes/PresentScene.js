import { resolvePresentRoom } from '../scripts/PresentProgress.js';
import {mediaPath,mediaPreload} from '../scripts/MediaAssets.js';
const ROOT = 'assets/present-cinematic/';
const ROOMS = {
  bedroom: ['bedroom.png', 'Dormitorio vacío, cama deshecha y una puerta hacia el pasillo.'],
  hall: ['hall.png', 'Pasillo: baño a la izquierda, cocina al fondo y dormitorio a la derecha.'],
  bathroom: ['bathroom.png', 'Valentino frente al espejo del baño, con las manos apoyadas en la pileta.'],
  kitchen: ['kitchen.png', 'La cocina de los recuerdos, ahora fría y vacía. La silla de papá está desocupada.']
};

/** Present-day fixed POV. Progress changes only after complete gestures, never on click. */
export class PresentScene {
  constructor(startRoom = null) { this.startRoom = startRoom; }

  async enter(container) {
    this.alive = true;
    this.busy = true;
    this.pending = new Set();
    this.controller = new AbortController();
    this.water = null;
    this.roomTone = null;
    this.reflectionSeen = false;
    this.bathState = this.storage.get('PRESENT_WASHED') ? 'closed' : 'dry';
    this.room = resolvePresentRoom(this.storage, this.startRoom);
    document.body.classList.add('present-mode');
    this.audio.stopAtmosphere();
    this.audio.stopRadioStatic?.();
    this.layer = document.createElement('section');
    this.layer.className = 'present-scene';
    this.layer.innerHTML = `<div class="present-frame">
      <img class="present-shot" draggable="false" alt="">
      <video class="present-video" muted playsinline preload="none" aria-hidden="true"></video>
      <div class="present-hotspots"></div>
      <p class="present-thought" role="status" aria-live="polite"></p>
      <div class="present-error" role="alert" hidden><p>No se pudo cargar este momento.</p><button type="button">Volver a intentar</button></div>
    </div><footer class="present-footer"><span class="present-place"></span><button class="present-help" type="button">Ver objetos · H</button></footer>`;
    container.appendChild(this.layer);
    for (const [key, selector] of Object.entries({frame: '.present-frame', still: '.present-shot', video: '.present-video', hotspots: '.present-hotspots', thought: '.present-thought', error: '.present-error', place: '.present-place', help: '.present-help'})) this[key] = this.layer.querySelector(selector);
    const fit = () => {
      const width = Math.min(container.clientWidth, Math.max(120, container.clientHeight - 86) * 16 / 9);
      this.frame.style.width = `${width}px`;
      this.frame.style.height = `${width * 9 / 16}px`;
    };
    this.observer = new ResizeObserver(fit);
    this.observer.observe(container);
    fit();
    const signal = this.controller.signal;
    this.help.addEventListener('click', () => { if (!this.busy) this.frame.classList.toggle('show-hints'); }, {signal});
    window.addEventListener('keydown', e => {
      if (e.key.toLowerCase() === 'h' && !e.repeat && !this.busy) this.frame.classList.toggle('show-hints');
    }, {signal});
    this.error.querySelector('button').addEventListener('click', () => {
      if (!this.retry) return;
      const retry = this.retry;
      this.retry = null;
      this.error.hidden = true;
      retry();
    }, {signal});
    this.video.addEventListener('timeupdate', () => {
      if (this.video.paused || !this.video.classList.contains('visible')) return;
      if (this.action === 'open' && this.video.currentTime >= 1.9) this.setWater(true);
      if (this.action === 'close' && this.video.currentTime >= 4.8) this.setWater(false);
    }, {signal});
    await this.showRoom(this.room, false);
  }

  onVisible() { if (this.alive) this.startSound(); }

  wait(ms) {
    return new Promise(resolve => {
      let timer;
      const done = ok => { clearTimeout(timer); this.pending.delete(done); resolve(ok); };
      this.pending.add(done);
      timer = setTimeout(() => done(this.alive), ms);
    });
  }

  startSound() {
    this.audio.ensureContext();
    if (this.roomTone || !this.audio.ctx) return;
    this.roomTone = this.noise('brown', 'lowpass', 180, .055);
  }

  noise(type, filterType, frequency, volume) {
    const ctx = this.audio.ctx;
    if (!ctx) return null;
    const source = ctx.createBufferSource();
    source.buffer = this.audio.createNoiseBuffer(type);
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = frequency;
    const gain = ctx.createGain();
    gain.gain.value = volume;
    source.connect(filter); filter.connect(gain); gain.connect(this.audio.masterGain);
    source.start();
    return {source, filter, gain};
  }

  stopNoise(nodes) {
    if (!nodes) return;
    try { nodes.source.stop(); } catch { /* Already stopped on scene exit. */ }
    Object.values(nodes).forEach(n => n.disconnect());
  }

  setWater(on) {
    if (on && !this.water) this.water = this.noise('pink', 'bandpass', 1800, .16);
    else if (!on && this.water) { this.stopNoise(this.water); this.water = null; }
  }

  lock() {
    this.busy = true;
    this.hotspots.replaceChildren();
    this.thought.textContent = '';
    this.help.disabled = true;
    this.frame.classList.remove('show-hints');
  }

  async showRoom(room, transition = true) {
    if (!this.alive) return;
    this.lock();
    if (transition) {
      this.frame.classList.add('room-changing');
      this.startSound();
      this.audio.playSoftStep?.();
      if (!await this.wait(450)) return;
    }
    this.video.pause();
    this.video.classList.remove('visible');
    this.setWater(false);
    this.room = room;
    this.frame.dataset.room = room;
    const file = room === 'bathroom' && this.bathState === 'closed' ? 'bathroom-closed.png' : ROOMS[room][0];
    this.still.src = mediaPath(ROOT + file);
    this.still.alt = ROOMS[room][1];
    try { await this.still.decode(); }
    catch { if (this.alive) this.fail(() => this.showRoom(room, false)); return; }
    if (!this.alive) return;
    this.storage.set('PRESENT_ROOM', room);
    this.storage.set('PRESENT_MEMORY_RETURN', false);
    this.place.textContent = ({bedroom:'Dormitorio', hall:'Pasillo', bathroom:'Baño', kitchen:'Cocina'})[room];
    this.frame.classList.remove('room-changing');
    this.arm();
  }

  spot(id, label, x, y, w, h, action) {
    const button = document.createElement('button');
    button.type = 'button'; button.id = `present-${id}`;
    button.className = 'present-object';
    button.setAttribute('aria-label', label);
    Object.assign(button.style, {left:`${x}%`, top:`${y}%`, width:`${w}%`, height:`${h}%`});
    const text = document.createElement('span'); text.textContent = label;
    button.appendChild(text);
    button.addEventListener('click', () => { if (this.alive && !this.busy) { this.startSound(); action(); } }, {signal:this.controller.signal});
    this.hotspots.appendChild(button);
  }

  arm() {
    if (!this.alive) return;
    this.busy = false;
    this.help.disabled = false;
    this.hotspots.replaceChildren();
    this.frame.dataset.bathState = this.bathState;
    const go = room => () => this.showRoom(room);
    if (this.room === 'bedroom') {
      this.spot('get-up', 'Levantarse y salir', 66, 15, 25, 73, go('hall'));
      this.spot('window', 'Mirar la ventana', 4, 10, 30, 55, () => this.observe('Todavía no amaneció.'));
    } else if (this.room === 'hall') {
      this.spot('bathroom', 'Entrar al baño', 5, 17, 28, 70, go('bathroom'));
      this.spot('bedroom', 'Volver al dormitorio', 72, 15, 23, 75, go('bedroom'));
      this.spot('kitchen', 'Ir a la cocina', 40, 25, 23, 61, () => {
        if (!this.storage.get('PRESENT_WASHED') && !this.storage.get('MATE_COMPLETED')) this.observe('Necesito lavarme la cara.');
        else this.showRoom('kitchen');
      });
    } else if (this.room === 'bathroom') {
      this.spot('mirror', 'Mirarse', 30, 7, 40, 51, () => this.look());
      if (this.bathState === 'dry') this.spot('open', 'Abrir la canilla', 51, 65, 9, 13, () => this.openTap());
      if (this.bathState === 'opened') this.spot('wash', 'Lavarse la cara', 40, 72, 18, 23, () => this.wash());
      if (this.bathState === 'running') this.spot('close', 'Cerrar la canilla', 45, 61, 12, 18, () => this.closeTap());
      if (['dry', 'closed'].includes(this.bathState)) this.spot('leave', 'Volver al pasillo', 92, 12, 8, 76, go('hall'));
    } else {
      const mate = this.storage.get('MATE_COMPLETED'), car = this.storage.get('CAR_COMPLETED'), radio = this.storage.get('RADIO_COMPLETED');
      this.spot('mate', 'El mate', 48, 44, 7, 12, () => this.remember('MISSION_MATE'));
      this.spot('chair', 'Mirar la silla', 70, 44, 10, 11, () => this.look());
      this.spot('plant', 'Mirar la planta', 2, 26, 15, 21, () => this.observe('Me olvidé de regarla.'));
      this.spot('tools', 'Las herramientas', 90, 34, 10, 13, () => !mate ? this.observe('Primero, un mate.') : this.remember('MISSION_CAR'));
      this.spot('radio', 'Escuchar la radio', 82, 36, 8, 10, () => !car ? this.observe('Ahora no.') : this.remember('MISSION_RADIO'));
      if (radio) this.spot('drawer', 'Abrir el cajón', 90, 48, 9, 7, () => this.remember('ENVELOPE', 'black'));
      this.spot('hall', 'Volver al pasillo', 0, 73, 8, 25, go('hall'));
    }
  }

  async observe(text) {
    this.lock();
    this.thought.textContent = text;
    if (!await this.wait(2200)) return;
    this.thought.textContent = '';
    this.arm();
  }

  async look() {
    this.lock();
    this.layer.classList.add('contemplating');
    if (!await this.wait(2500)) return;
    this.spot('look-away', 'Apartar la mirada', 36, 86, 28, 12, () => {});
    this.busy = false;
    const button = this.hotspots.firstElementChild;
    button.classList.add('present-look-away');
    button.addEventListener('click', () => { this.layer.classList.remove('contemplating'); this.arm(); }, {once:true, signal:this.controller.signal});
    button.focus({preventScroll:true});
  }

  fail(retry) {
    this.setWater(false);
    this.retry = retry;
    this.frame.classList.remove('room-changing');
    this.error.hidden = false;
    this.error.querySelector('button').focus();
  }

  async play(file, action, assetRoot = ROOT) {
    this.action = action;
    this.video.pause();
    // Keep the previous gesture's still visible while the next clip loads.
    this.video.classList.remove('visible');
    this.video.preload=mediaPreload();
    this.video.src = mediaPath(assetRoot + file);
    this.video.muted = true;
    return new Promise(resolve => {
      let settled = false;
      const done = ok => {
        if (settled) return; settled = true;
        clearTimeout(timer);
        this.pending.delete(done);
        this.video.removeEventListener('playing', playing);
        this.video.removeEventListener('ended', ended);
        this.video.removeEventListener('error', failed);
        if (!ok) this.video.pause();
        resolve(ok);
      };
      const playing = () => this.video.classList.add('visible');
      const ended = () => done(true);
      const failed = () => done(false);
      const timer = setTimeout(failed, 45000);
      this.pending.add(done);
      this.video.addEventListener('playing', playing);
      this.video.addEventListener('ended', ended);
      this.video.addEventListener('error', failed);
      this.video.play().catch(failed);
    });
  }

  async openTap() {
    this.lock();
    if (!await this.play('bathroom-open-approved.mp4', 'open')) {
      if (this.alive) this.fail(() => this.openTap());
      return;
    }
    if (!this.alive) return;
    this.bathState = 'opened';
    this.still.src = ROOT + 'bathroom-open-end.png';
    this.setWater(true);
    this.arm();
  }

  async wash() {
    this.lock();
    this.setWater(true);
    // Rejected footage must never be loaded by the scene, even in a preview.
    if (!await this.play('bathroom-wash-approved.mp4', 'wash')) {
      if (this.alive) this.fail(() => this.wash());
      return;
    }
    if (!this.alive) return;
    this.bathState = 'running';
    // Hold the actual final frame. No dissolve to a different pose.
    this.still.src = ROOT + 'bathroom-wash-end.png';
    this.setWater(true);
    if (!await this.wait(2800)) return;
    this.arm();
  }

  async closeTap() {
    this.lock();
    this.setWater(true);
    if (!await this.play('bathroom-close.mp4', 'close')) {
      if (this.alive) this.fail(() => this.closeTap());
      return;
    }
    if (!this.alive) return;
    this.setWater(false);
    this.bathState = 'closed';
    this.still.src = ROOT + 'bathroom-closed.png';
    this.storage.set('PRESENT_WASHED', true);
    if (!await this.wait(1100)) return;
    this.arm();
  }

  remember(name, transition = 'warm-fade') {
    const completed = {MISSION_MATE:'MATE_COMPLETED', MISSION_CAR:'CAR_COMPLETED', MISSION_RADIO:'RADIO_COMPLETED'}[name];
    // Keep the object clickable, but never replay a completed memory or reset its progress.
    if (completed && this.storage.get(completed)) return this.declineMemory();
    this.lock();
    const origin = this.sceneManager.currentSceneName;
    this.storage.set('PRESENT_RETURN_SCENE', ['INTRO', 'PRESENT_KITCHEN_THIRD'].includes(origin) ? origin : 'PRESENT_PREVIEW');
    this.storage.set('PRESENT_MEMORY_RETURN', true);
    this.sceneManager.changeScene(name, transition);
  }

  async declineMemory() {
    const signal = this.controller.signal;
    this.lock();
    const completed = await this.subtitles.playSequence([{
      speaker:'VALENTINO', text:'Por hoy, prefiero dejarlo ahí.', thought:true, duration:3200
    }]);
    if (completed && this.alive && !signal.aborted) this.arm();
  }

  exit() {
    this.alive = false;
    this.controller.abort();
    this.observer.disconnect();
    for (const done of [...this.pending]) done(false);
    this.video.pause(); this.video.removeAttribute('src'); this.video.load();
    this.setWater(false);
    this.stopNoise(this.roomTone); this.roomTone = null;
    document.body.classList.remove('present-mode');
  }
}
