import {PRESENT_WALK_STAGES as stages, PRESENT_WALK_EMPTY, PRESENT_WALK_TO_KITCHEN, resolveWalkStep} from '../scripts/PresentWalkProgress.js';
import {TapSound} from '../scripts/TapSound.js';

export class PresentWalkScene {
  async enter(container) {
    this.visit = (this.visit || 0) + 1;
    this.alive = true;
    this.destination = null;
    document.body.classList.add('present-walking');
    this.controller = new AbortController();
    this.layer = document.createElement('section');
    this.layer.className = 'present-walk';
    this.layer.setAttribute('aria-label', 'El presente: recorrer la casa');
    this.layer.innerHTML = `<small>Presente</small>
      <div class="present-walk-frame"><img alt=""><video muted playsinline preload="auto"></video>
      <button class="present-walk-spot" type="button"></button>
      <button class="present-walk-kitchen-spot" aria-label="Ir a la cocina" type="button" hidden></button></div>
      <footer><p role="status"></p><button class="present-walk-kitchen" type="button" hidden>Ir a la cocina</button><button class="present-walk-action" type="button"></button></footer>`;
    container.appendChild(this.layer);
    this.still = this.layer.querySelector('img');
    this.video = this.layer.querySelector('video');
    this.tap=new TapSound(this.audio,state=>{if(this.alive)this.layer.dataset.tapSound=state;});
    this.tap.prepare();
    this.spot = this.layer.querySelector('.present-walk-spot');
    this.action = this.layer.querySelector('.present-walk-action');
    this.status = this.layer.querySelector('[role="status"]');
    this.kitchen = this.layer.querySelector('.present-walk-kitchen');
    this.kitchenSpot = this.layer.querySelector('.present-walk-kitchen-spot');
    const frame = this.layer.querySelector('.present-walk-frame');
    const fit = () => {
      const width = Math.min(Math.max(160, container.clientWidth - 32), Math.max(100, container.clientHeight - 160) * 832 / 480);
      frame.style.width = `${width}px`;
      frame.style.height = `${width * 480 / 832}px`;
    };
    this.observer = new ResizeObserver(fit); this.observer.observe(container); fit();
    const options = {signal:this.controller.signal};
    this.spot.addEventListener('click', () => this.play(), options);
    this.action.addEventListener('click', () => this.play(), options);
    this.kitchen.addEventListener('click', () => this.goKitchen(), options);
    this.kitchenSpot.addEventListener('click', () => this.goKitchen(), options);
    this.video.addEventListener('playing', () => {
      if (this.alive && this.phase === 'playing') {this.video.classList.add('visible');this.tap?.sync(this.index,this.video.currentTime,true);}
    }, options);
    this.video.addEventListener('timeupdate',()=>{if(this.alive&&this.phase==='playing'&&!this.video.paused&&!this.video.seeking&&this.video.readyState>=3)this.tap?.sync(this.index,this.video.currentTime,true);},options);
    for(const event of ['waiting','pause'])this.video.addEventListener(event,()=>{if(this.phase==='playing')this.tap?.stop();},options);
    this.video.addEventListener('ended', () => this.finishAction(), options);
    this.video.addEventListener('error', () => {
      if (this.phase === 'playing') this.fail();
    }, options);
    this.index = resolveWalkStep(this.storage.get('PRESENT_THIRD_STEP'));
    await this.show(this.index);
  }

  lock(value) {
    this.spot.disabled = this.action.disabled = value;
    if (this.kitchen) this.kitchen.disabled = value;
    if (this.kitchenSpot) this.kitchenSpot.disabled = value;
  }

  onVisible() { if(this.alive){this.audio?.playAtmosphere?.('house_present');this.tap?.sync(this.index);} }

  async goKitchen() {
    if (!this.alive || !['ready','video-error'].includes(this.phase) || this.index !== 1) return;
    const visit = this.visit;
    this.destination = 'kitchen'; this.phase = 'playing'; this.lock(true);
    this.video.src = PRESENT_WALK_TO_KITCHEN; this.video.load();
    this.status.textContent = 'Ir a la cocina…';
    this.timer = setTimeout(()=>{if(this.alive && this.visit === visit && this.phase === 'playing')this.fail();},45000);
    try { await this.video.play(); }
    catch { if(this.alive && this.visit === visit && this.phase === 'playing')this.fail(); }
  }

  async show(index) {
    const visit = this.visit;
    this.phase = 'loading'; this.lock(true);
    this.index = index;
    if (index === 1) this.storage.set('PRESENT_ROOM', 'hall');
    const completed = index === stages.length;
    const [room, image, file, label, area] = stages[Math.min(index, stages.length - 1)];
    this.layer.dataset.room=room.toLowerCase();
    this.layer.dataset.restored = image.startsWith('assets/present-bath-adult-v4/') ? 'true' : 'false';
    const next = new Image();
    next.src = completed ? PRESENT_WALK_EMPTY : image;
    try { await next.decode(); }
    catch { if (this.alive && this.visit === visit) this.fail('image'); return; }
    if (!this.alive || this.visit !== visit) return;
    this.still.src = next.src;
    this.still.alt = completed ? 'El baño vacío, rodeado de oscuridad.' : `Valentino en ${room.toLowerCase()}. ${label}.`;
    this.video.pause(); this.video.classList.remove('visible');
    this.spot.hidden = completed;
    this.kitchen.hidden = this.kitchenSpot.hidden = index !== 1;
    if (!completed) {
      this.video.src = file; this.video.load();
      this.spot.setAttribute('aria-label', label);
      ['left','top','width','height'].forEach((key,n) => this.spot.style[key] = `${area[n]}%`);
    }
    this.action.textContent = completed ? 'Ir a la cocina' : label;
    this.status.textContent = completed ? 'La casa sigue en silencio.' : index === 1 ? 'Pasillo · Baño a la izquierda, cocina al fondo.' : room;
    this.storage.set('PRESENT_THIRD_STEP', index);
    this.phase = 'ready'; this.lock(false);
    this.tap?.sync(index);
  }

  fail(kind = 'video') {
    clearTimeout(this.timer);
    this.video.pause();
    this.tap?.stop();
    this.phase = `${kind}-error`; this.lock(false);
    this.status.textContent = 'No se pudo cargar la acción. Tu avance está guardado.';
    this.action.textContent = 'Volver a intentar';
  }

  async play() {
    if (!this.alive || ['loading','playing','leaving'].includes(this.phase)) return;
    if (this.destination === 'kitchen') { await this.goKitchen(); return; }
    if (this.phase === 'image-error') { await this.show(this.index); return; }
    if (this.index === stages.length) {
      await this.show(1); return;
    }
    const visit = this.visit;
    this.phase = 'playing'; this.lock(true);
    this.audio?.ensureContext?.();
    if (this.video.error) this.video.load();
    this.video.currentTime = 0;
    this.status.textContent = `${stages[this.index][3]}…`;
    this.timer = setTimeout(() => {
      if (this.alive && this.visit === visit && this.phase === 'playing') this.fail();
    }, 45000);
    try { await this.video.play(); }
    catch { if (this.alive && this.visit === visit && this.phase === 'playing') this.fail(); }
  }

  finishAction() {
    if (!this.alive || this.phase !== 'playing') return;
    clearTimeout(this.timer);
    if(this.destination === 'kitchen') {
      this.phase = 'leaving'; this.lock(true);
      this.sceneManager.changeScene('PRESENT_KITCHEN_THIRD','black'); return;
    }
    // Commit only after ended, never on click, pause or failed media.
    const next = this.index === stages.length - 1 ? 1 : this.index + 1;
    this.storage.set('PRESENT_THIRD_STEP', next);
    if (next === 1) this.storage.set('PRESENT_ROOM', 'hall');
    if (next === 4) this.storage.set('PRESENT_WASHED', true);
    this.show(next);
  }

  exit() {
    this.tap?.dispose();
    this.audio?.stopAtmosphere?.();
    document.body.classList.remove('present-walking');
    this.alive = false; this.visit++; this.phase = 'closed';
    clearTimeout(this.timer); this.controller.abort();
    this.observer?.disconnect();
    this.video.pause(); this.video.removeAttribute('src'); this.video.load();
  }
}
