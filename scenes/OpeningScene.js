import {DreamSoundtrack} from '../scripts/DreamSoundtrack.js';

export const DREAM_SHOTS = [
  ['assets/nightmare/01-empty-chair-v1.png', 'Una silla vacía y un mate, rodeados de oscuridad.', 'Siempre sueño que todavía estás en casa. Que te levantaste un momento y vas a volver.', 'left', 14000],
  ['assets/nightmare/04-radio-v1.png', 'Una radio enorme; Valentino intenta escuchar en la oscuridad.', 'A veces creo escuchar tu voz desde la otra pieza. Me quedo quieto, para no perderla.', 'left', 12000],
  ['assets/nightmare/05-tools-v1.png', 'Los guantes y las herramientas esperan sobre una mesa vacía.', 'Dejaste todo en su lugar. Yo también lo dejo así. No sé dónde pondría tu ausencia.', 'right', 12500],
  ['assets/nightmare/02-unreachable-door-v1.png', 'Valentino frente a una puerta lejana que parece inalcanzable.', 'Quiero llegar hasta vos. Pero el pasillo se alarga cada vez que doy un paso.', 'right', 11500],
  ['assets/nightmare/07-house-v1.png', 'La casa se desarma lentamente en el vacío.', 'Después la casa empieza a desarmarse. Intento acordarme de algo pequeño. Cómo te reías. Cómo decías mi nombre.', 'left', 14000],
  ['assets/nightmare/06-mirror-v1.png', 'En el espejo de Valentino solo queda una silla vacía.', 'Te busco tanto que a veces dejo de verme. Los días pasan. Yo sigo en el mismo lugar.', 'right', 12500],
  ['assets/nightmare/03-anguish-v1.png', 'La angustia en el rostro de Valentino; la silla queda atrás.', 'Me da miedo olvidar tu voz, papá. Y me da miedo que recordarla siempre duela así.', 'left', 12000],
  ['assets/nightmare/08-bed-v1.png', 'Valentino se encoge bajo una manta; su cama flota en la oscuridad.', 'Quiero despertarme. Pero sé que, cuando abra los ojos, tu silla va a seguir vacía.', 'right', 13000]
];

export class OpeningScene {
  async enter(container) {
    this.visit = (this.visit || 0) + 1;
    this.alive = true; this.busy = false; this.phase = 'dream';
    this.dreamTimers = new Set();
    this.controller = new AbortController();
    document.body.classList.add('present-walking');
    this.layer = document.createElement('section');
    this.layer.className = 'opening-scene';
    this.layer.setAttribute('aria-label','Introducción: la pesadilla y el despertar de Valentino');
    this.layer.innerHTML = `<img src="assets/present-third-person/bedroom-sleep-v1.png" alt="Valentino duerme en su pieza, bajo la luz fría de la mañana.">
      <video muted playsinline preload="auto" src="qa/present/bedroom-wake-adult-v2.mp4"></video>
      <div class="opening-dream" aria-label="La pesadilla">
        ${DREAM_SHOTS.map(([src,alt])=>`<img src="${src}" alt="${alt}">`).join('')}
        <div class="dream-shadow" aria-hidden="true"></div>
      </div>
      <div class="opening-title"><h1>Lo que queda en la Tierra</h1></div>
      <aside class="dream-narration" aria-label="Pensamientos de Valentino" aria-live="polite" aria-atomic="true"><span>Valentino</span><p></p></aside>
      <p role="status"></p><button class="opening-retry" type="button" hidden>Volver a intentar</button>
      <button class="opening-sound-retry" type="button" hidden>Activar audio</button>
      <button class="opening-skip" type="button">Omitir introducción</button>`;
    container.appendChild(this.layer);
    this.video = this.layer.querySelector('video');
    this.status = this.layer.querySelector('[role="status"]');
    this.retry = this.layer.querySelector('.opening-retry');
    this.shots = [...this.layer.querySelectorAll('.opening-dream img')];
    this.narration = this.layer.querySelector('.dream-narration');
    this.narrationText = this.narration.querySelector('p');
    this.soundButton = this.layer.querySelector('.opening-sound-retry');
    this.soundtrack = new DreamSoundtrack(this.audio, state => {
      this.layer.dataset.dreamAudio = state;
      this.soundButton.hidden = !['blocked','error'].includes(state) || (state === 'blocked' && this.audio.isMuted);
      this.soundButton.textContent = state === 'blocked' ? 'Activar audio' : 'Reintentar audio';
    });
    const options = {signal:this.controller.signal};
    this.layer.querySelector('.opening-skip').addEventListener('click',()=>this.finish(),options);
    this.retry.addEventListener('click',()=>this.phase === 'dream' ? this.startDream() : this.play(),options);
    this.soundButton.addEventListener('click',()=>this.soundtrack.retry(),options);
    this.video.addEventListener('ended',()=>{if(this.busy)this.finish();},options);
    this.video.addEventListener('playing',()=>{if(this.alive)this.video.classList.add('visible');},options);
    this.video.addEventListener('error',()=>{if(this.busy)this.fail();},options);
  }
  onVisible() {
    this.audio.stopAtmosphere();
    this.layer.classList.add('visible');
    this.startDream();
  }
  later(callback, delay) {
    const visit = this.visit;
    const id = setTimeout(()=>{
      this.dreamTimers.delete(id);
      if(this.alive && this.visit === visit) callback();
    },delay);
    this.dreamTimers.add(id);
  }
  clearDream() {
    this.dreamRun = (this.dreamRun || 0) + 1;
    for(const id of this.dreamTimers || []) clearTimeout(id);
    this.dreamTimers?.clear();
    this.narration?.classList.remove('visible');
    this.soundtrack?.stop();
  }
  async startDream() {
    if(!this.alive || this.busy)return;
    const visit = this.visit;
    this.busy = true; this.phase = 'dream';
    this.retry.hidden = true; this.status.textContent = '';
    this.clearDream();
    const run = this.dreamRun;
    this.layer.classList.remove('dream-ended','dream-started','dream-title-away');
    this.shots.forEach(shot=>shot.classList.remove('active','shown'));
    this.watchdog = setTimeout(()=>{if(this.alive && this.visit === visit)this.fail();},15000);
    try {
      await Promise.all([...this.shots.map(shot=>shot.decode()), this.soundtrack?.prepare()]);
      if(!this.alive || this.visit !== visit || this.dreamRun !== run || !this.busy)return;
      clearTimeout(this.watchdog);
      this.layer.classList.add('dream-started');
      this.soundtrack?.start();
      this.showShot(0);
      this.later(()=>this.layer.classList.add('dream-title-away'),2800);
    } catch {if(this.alive && this.visit === visit && this.dreamRun === run && this.busy)this.fail();}
  }
  showShot(index) {
    const [, , text, side, duration] = DREAM_SHOTS[index];
    this.narration.classList.remove('visible');
    this.later(()=>{
      this.narration.dataset.side = side;
      this.narrationText.textContent = text;
      this.narration.classList.add('visible');
    },index === 0 ? 3800 : 1600);
    this.later(()=>this.narration.classList.remove('visible'),duration - 1200);
    this.shots[index].classList.add('shown');
    this.shots.forEach((shot,i)=>shot.classList.toggle('active',i === index));
    this.layer.dataset.dreamShot = String(index + 1);
    this.later(()=>{
      if(index + 1 < this.shots.length)this.showShot(index + 1);
      else {
        this.layer.classList.add('dream-ended');
        this.later(()=>{
          this.phase = 'wake'; this.busy = false;
          this.play();
        },2800);
      }
    },duration);
  }
  async play() {
    if (!this.alive || this.busy) return;
    const visit = this.visit;
    this.phase = 'wake';
    this.soundtrack?.stop();
    this.busy = true; this.retry.hidden = true; this.status.textContent = '';
    this.audio?.setStoryScene?.('INTRO', true);
    this.layer.classList.add('waking');
    if(this.video.error)this.video.load();
    this.video.currentTime = 0;
    this.watchdog = setTimeout(()=>{if(this.alive&&this.busy)this.fail();},45000);
    try {await this.video.play();} catch {if(this.alive && this.visit === visit)this.fail();}
  }
  fail() {
    this.audio?.setStoryScene?.('OPENING', false);
    clearTimeout(this.watchdog); this.clearDream(); this.busy = false; this.video.pause();
    this.status.textContent = this.phase === 'dream' ? 'No se pudieron cargar las imágenes del sueño.' : 'No se pudo reproducir el despertar.';
    this.retry.hidden = false;
  }
  finish() {
    if(!this.alive)return;
    this.alive = false; this.clearDream(); clearTimeout(this.watchdog); this.video.pause();
    this.storage.set('OPENING_COMPLETED',true);
    this.storage.set('PRESENT_THIRD_STEP',0);
    this.sceneManager.changeScene('INTRO','black');
  }
  exit() {
    this.visit++;
    this.alive = false; this.clearDream(); clearTimeout(this.watchdog);
    this.controller.abort(); this.video.pause(); this.video.removeAttribute('src'); this.video.load();
    document.body.classList.remove('present-walking');
  }
}
