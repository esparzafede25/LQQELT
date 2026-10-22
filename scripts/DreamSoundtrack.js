export const DREAM_AUDIO = 'assets/intro-music-only-v1/sueno-musica.mp3';

/** One rendered mix, routed through the existing volume/mute bus. */
export class DreamSoundtrack {
  constructor(audio, onState = () => {}, now = () => performance.now()) {
    this.audio = audio; this.onState = onState; this.now = now;
    this.generation = 0; this.active = false;
    this.contextChanged = () => this.sync();
  }
  async prepare() {
    const generation = ++this.generation;
    this.abort?.abort();
    clearTimeout(this.timeout);
    this.abort = new AbortController();
    const signal = this.abort.signal;
    this.timeout = setTimeout(() => this.abort?.abort(), 12000);
    try {
      this.audio.ensureContext();
      if (this.ctx !== this.audio.ctx) {
        this.ctx?.removeEventListener('statechange', this.contextChanged);
        this.ctx = this.audio.ctx;
        if (this.active) this.ctx?.addEventListener('statechange', this.contextChanged);
      }
      if (!this.ctx || !this.audio.masterGain) throw Error('Audio unavailable');
      const response = await fetch(DREAM_AUDIO, {signal});
      if (!response.ok) throw Error('Soundtrack unavailable');
      const buffer = await this.ctx.decodeAudioData(await response.arrayBuffer());
      if (generation !== this.generation || signal.aborted) return false;
      this.buffer = buffer;
      return true;
    } catch {
      if (generation === this.generation) this.onState('error');
      return false;
    } finally {
      if (generation === this.generation) clearTimeout(this.timeout);
    }
  }
  start() {
    this.active = true; this.startedAt = this.now();
    this.ctx?.addEventListener('statechange', this.contextChanged);
    this.sync();
  }
  sync() {
    if (!this.active) return;
    this.stopSource();
    if (!this.buffer || !this.ctx) { this.onState('error'); return; }
    if (this.ctx.state !== 'running') { this.onState('blocked'); return; }
    const offset = Math.max(0, (this.now() - this.startedAt) / 1000);
    if (offset >= this.buffer.duration) { this.onState('ended'); return; }
    try {
      const source = this.ctx.createBufferSource();
      this.source = source;
      source.buffer = this.buffer;
      source.connect(this.audio.masterGain);
      source.start(0, offset);
      this.onState('playing');
    } catch { this.stopSource(); this.onState('error'); }
  }
  async retry() {
    const active = this.active;
    const generation = this.generation;
    if (this.buffer) {
      try { await this.ctx.resume(); } catch { /* Button remains available. */ }
      if (active && this.active && generation === this.generation && !this.source) this.sync();
    } else {
      const ready = await this.prepare();
      if (ready && active && this.active) this.sync();
    }
  }
  stopSource() {
    if (!this.source) return;
    try { this.source.stop(); } catch { /* Already ended. */ }
    try { this.source.disconnect(); } catch { /* Already disconnected. */ }
    this.source = null;
  }
  stop() {
    this.active = false; this.generation++;
    this.abort?.abort(); clearTimeout(this.timeout);
    this.ctx?.removeEventListener('statechange', this.contextChanged);
    this.stopSource(); this.buffer = null;
    this.onState('idle');
  }
}
