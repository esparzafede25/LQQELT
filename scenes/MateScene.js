/** Integrated shots and performances, with one shared image/hotspot coordinate system. */
const ROOT = 'assets/mate-cinematic/';
const SHOTS = {
  master: '01-master.png',
  reach: '01b-reach.png',
  lift: '01c-lift.png',
  pour: '02-pour.png',
  pass: '03-pass.png',
  drink: '04-drink.png',
  return: '05-return.png',
  close: '06-close.png'
};
const HEADS = {
  master: { valentino: [31, 13], father: [69, 13] },
  reach: { valentino: [31, 13], father: [69, 13] },
  lift: { valentino: [31, 13], father: [69, 13] },
  pour: { valentino: [36, 12], father: [77, 13] },
  pass: { valentino: [33, 14], father: [70, 14] },
  drink: { valentino: [11, 17], father: [67, 5] },
  return: { valentino: [11, 17], father: [65, 5] },
  close: { valentino: [32, 21], father: [69, 13] }
};

/** Authors may provide an array of deliberate beats; longer strings are paged safely. */
export function dialoguePages(text) {
  const pages = [];
  for (const beat of Array.isArray(text) ? text : [text]) {
    for (const sentence of String(beat).trim().split(/(?<=[.!?…])\s+|\n+/)) {
      let line = '';
      for (const word of sentence.split(/\s+/).filter(Boolean)) {
        if (line && `${line} ${word}`.length > 64) { pages.push(line); line = word; }
        else line += `${line ? ' ' : ''}${word}`;
      }
      if (line) pages.push(line);
    }
  }
  return pages;
}

export class MateScene {
  async enter(container) {
    this.controller = new AbortController();
    this.pending = new Set();
    this.state = 'opening';
    this.alive = true;
    this.inspecting = false;
    this.advanceDialogue = null;
    this.images = {};
    document.body.classList.add('mate-cinematic', 'memory-cinematic-mode');
    this.layer = document.createElement('section');
    this.layer.className = 'mate-film';
    this.layer.setAttribute('aria-label', 'Una mañana cualquiera. Recuerdo con papá.');
    this.layer.innerHTML = `<div class="mate-frame">
      <img class="mate-shot" alt="Valentino y su padre comparten una mañana en la cocina" draggable="false">
      <div class="mate-clips"></div>
      <div class="mate-title"><span>RECUERDO I</span><h1>Una mañana cualquiera</h1></div>
      <div class="mate-hotspots"></div>
      <div class="mate-caption" role="status" aria-live="polite"><button type="button" class="mate-speech"><span></span><p></p><small>Clic para seguir</small></button></div>
      <p class="mate-guidance">Explorá los objetos · H para ver las interacciones</p></div>`;
    container.appendChild(this.layer);
    this.frame = this.layer.querySelector('.mate-frame');
    this.still = this.layer.querySelector('.mate-shot');
    this.caption = this.layer.querySelector('.mate-caption');
    this.hotspots = this.layer.querySelector('.mate-hotspots');
    this.videos = {};
    for (const key of ['pour', 'pass', 'return']) {
      const video = document.createElement('video');
      video.className = 'mate-clip';
      video.src = `${ROOT}${key}.mp4`;
      video.preload = 'auto';
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('aria-hidden', 'true');
      this.layer.querySelector('.mate-clips').appendChild(video);
      this.videos[key] = video;
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
    window.addEventListener('keydown', e => {
      if (e.repeat) return;
      if (this.advanceDialogue && (e.key === ' ' || e.key === 'Enter') && !e.target.closest('button,a,input')) {
        e.preventDefault(); this.advanceDialogue();
      } else if (!this.advanceDialogue && e.key.toLowerCase() === 'h') this.frame.classList.toggle('show-hints');
    }, { signal: this.controller.signal });
    this.frame.addEventListener('click', e => {
      if (!e.target.closest('.mate-object')) this.advanceDialogue?.();
    }, { signal: this.controller.signal });
    this.frame.dataset.shot = 'master';
    this.still.src = ROOT + SHOTS.master;
    await Promise.all(Object.entries(SHOTS).map(async ([key, file]) => {
      const img = new Image();
      img.src = ROOT + file;
      try { await img.decode(); this.images[key] = img; }
      catch { console.warn(`No se pudo precargar ${file}`); }
    }));
  }

  async onVisible() {
    if (!this.alive) return;
    this.audio.playAtmosphere('mate_morning');
    if (!await this.wait(1800)) return;
    this.layer.querySelector('.mate-title').classList.add('departed');
    if (!await this.wait(1000)) return;
    if (!await this.say('PAPÁ', 'Serví vos hoy.')) return;
    this.arm('pour');
  }

  wait(ms) {
    return new Promise(resolve => {
      let timer;
      const done = ok => { clearTimeout(timer); this.pending.delete(done); resolve(ok); };
      this.pending.add(done);
      timer = setTimeout(() => done(this.alive), ms);
    });
  }

  placeDialogue() {
    const key = this.caption.dataset.speaker;
    const [x, y] = (HEADS[this.frame.dataset.shot] || HEADS.master)[key];
    const width = Math.min(310, this.frame.clientWidth * .46);
    const left = Math.max(8, Math.min(this.frame.clientWidth - width - 8, this.frame.clientWidth * x / 100 - width / 2));
    this.caption.style.width = `${width}px`;
    this.caption.style.left = `${left}px`;
    const headTop = this.frame.clientHeight * y / 100;
    const stageTop = this.frame.getBoundingClientRect().top - this.layer.getBoundingClientRect().top;
    this.caption.style.top = `${Math.max(8 - stageTop, headTop - this.caption.offsetHeight - 10)}px`;
    this.caption.style.setProperty('--speech-tail', `${this.frame.clientWidth * x / 100 - left}px`);
  }

  async say(speaker, text) {
    if (!this.alive || this.advanceDialogue) return false;
    this.caption.dataset.speaker = speaker === 'PAPÁ' ? 'father' : 'valentino';
    this.caption.querySelector('span').textContent = speaker;
    const speech = this.caption.querySelector('button');
    for (const page of dialoguePages(text)) {
      this.caption.querySelector('p').textContent = page;
      speech.setAttribute('aria-label', `${speaker}: ${page}. Continuar diálogo`);
      this.frame.classList.add('dialogue-open');
      this.caption.classList.add('visible');
      this.placeDialogue();
      const active = await new Promise(resolve => {
        const readyAt = performance.now() + 300;
        const done = ok => {
          this.pending.delete(done);
          this.advanceDialogue = null;
          resolve(ok);
        };
        this.pending.add(done);
        this.advanceDialogue = () => { if (performance.now() >= readyAt) done(this.alive); };
      });
      if (!active || !this.alive) return false;
    }
    this.caption.classList.remove('visible');
    this.frame.classList.remove('dialogue-open');
    return this.alive;
  }

  shot(key) {
    if (!this.alive) return;
    this.still.src = this.images[key]?.src || ROOT + SHOTS[key];
    Object.values(this.videos).forEach(v => { v.pause(); v.classList.remove('visible'); });
    this.frame.dataset.shot = key;
  }

  async clip(key, fallback) {
    const video = this.videos[key];
    // Cut before the generated father's late glance toward the camera.
    const cutAt = key === 'return' ? 2.8 : Infinity;
    this.shot(key);
    this.frame.dataset.playback = key;
    const ok = await new Promise(resolve => {
      let timer;
      let settled = false;
      const done = value => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        video.removeEventListener('ended', ended);
        video.removeEventListener('error', failed);
        video.removeEventListener('playing', playing);
        video.removeEventListener('timeupdate', trim);
        this.pending.delete(done);
        resolve(value);
      };
      const ended = () => done(true);
      const failed = () => done(false);
      const playing = () => video.classList.add('visible');
      const trim = () => { if (video.currentTime >= cutAt) { video.pause(); done(true); } };
      this.pending.add(done);
      video.addEventListener('ended', ended);
      video.addEventListener('error', failed);
      video.addEventListener('playing', playing);
      video.addEventListener('timeupdate', trim);
      timer = setTimeout(failed, 20000);
      video.currentTime = 0;
      video.play().catch(failed);
    });
    if (!this.alive) return false;
    this.frame.dataset.playback = 'held';
    // Keep the actual final frame until the next deliberate camera cut.
    if (!ok) { this.shot(fallback); this.frame.dataset.playback = 'fallback'; return this.wait(800); }
    return true;
  }

  hotspot(id, label, x, y, w, h, action) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'mate-object';
    button.id = id;
    button.setAttribute('aria-label', label);
    button.dataset.cursor = label;
    Object.assign(button.style, { left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` });
    const tip = document.createElement('span');
    tip.textContent = label;
    button.appendChild(tip);
    button.addEventListener('click', action, { signal: this.controller.signal });
    this.hotspots.appendChild(button);
  }

  arm(action) {
    if (!this.alive) return;
    this.state = action;
    this.frame.dataset.state = action;
    this.hotspots.replaceChildren();
    this.frame.classList.remove('show-hints');
    const areas = {
      pour: ['Cebar mate', 33, 49, 11, 19],
      pass: ['Alcanzar a papá', 35, 61, 14, 23],
      return: ['Recibir el mate', 32, 41, 13, 23]
    };
    const [label, x, y, w, h] = areas[action];
    this.hotspot(`mate-${action}`, label, x, y, w, h, () => this.perform(action));
    if (action === 'pour') {
      this.hotspot('mate-window', 'Mirar la mañana', 10, 12, 14, 30, async () => {
        if (this.inspecting || this.state !== 'pour') return;
        this.inspecting = true;
        await this.say('VALENTINO', 'Todavía está fresco afuera.');
        this.inspecting = false;
      });
    }
    clearTimeout(this.hintTimer);
    this.hintTimer = setTimeout(() => {
      if (this.alive && this.state === action) this.frame.classList.add('show-hints');
    }, 9000);
  }

  async perform(action) {
    if (!this.alive || this.state !== action || this.inspecting || this.advanceDialogue) return;
    this.state = 'busy';
    this.frame.dataset.state = 'busy';
    clearTimeout(this.hintTimer);
    this.hotspots.replaceChildren();
    this.caption.classList.remove('visible');
    this.layer.querySelector('.mate-guidance').classList.add('departed');
    this.audio.ensureContext();
    if (action === 'pour') {
      this.shot('reach');
      if (!await this.wait(400)) return;
      this.shot('lift');
      if (!await this.wait(500)) return;
      this.audio.playPourWater();
      if (!await this.clip('pour', 'pass')) return;
      if (!await this.say('PAPÁ', 'Eso. Despacito.')) return;
      const fallback = this.frame.dataset.playback === 'fallback';
      this.arm('pass');
      if (fallback) Object.assign(this.hotspots.firstElementChild.style, { left: '41%', top: '43%', width: '12%', height: '21%' });
    } else if (action === 'pass') {
      if (!await this.clip('pass', 'drink')) return;
      if (!await this.wait(350)) return;
      this.shot('drink');
      this.audio.playMateSip();
      if (!await this.wait(2300)) return;
      if (!await this.say('VALENTINO', '¿Está bien?')) return;
      if (!await this.say('PAPÁ', 'Está bueno.')) return;
      this.shot('return');
      if (!await this.say('PAPÁ', 'Tomá.')) return;
      this.arm('return');
    } else {
      if (!await this.clip('return', 'close')) return;
      if (!await this.wait(900)) return;
      this.shot('close');
      if (!await this.wait(3400)) return;
      this.state = 'complete';
      this.storage.set('MATE_COMPLETED', true);
      this.sceneManager.changeScene('INTRO', 'black');
    }
  }

  exit() {
    this.alive = false;
    this.controller?.abort();
    clearTimeout(this.hintTimer);
    this.observer?.disconnect();
    for (const done of [...(this.pending || [])]) done(false);
    Object.values(this.videos || {}).forEach(v => { v.pause(); v.removeAttribute('src'); v.load(); });
    this.audio.stopAtmosphere();
    document.body.classList.remove('mate-cinematic', 'memory-cinematic-mode');
  }
}
