/**
 * LO QUE QUEDÓ EN LA TIERRA
 * AudioManager — Diseño sonoro analógico, síntesis procedimental con Web Audio API
 * Viento patagónico, silencio, motor, herramientas, mate, agua, radio y estática
 */

export class AudioManager {
  constructor(storageManager) {
    this.storage = storageManager;
    this.ctx = null;
    this.masterGain = null;
    this.ambientGain = null;
    this.radioGain = null;
    this.engineGain = null;
    this.musicGain = null;
    
    this.isMuted = !this.storage.get('soundEnabled');
    this.volume = this.storage.get('volume') || 0.8;
    this.activeNodes = [];
    this.currentAtmosphere = null;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      this.radioGain = this.ctx.createGain();
      this.radioGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.radioGain.connect(this.masterGain);

      this.engineGain = this.ctx.createGain();
      this.engineGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.engineGain.connect(this.masterGain);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      console.log('Web Audio Context initialized');
    } catch (e) {
      console.warn('Web Audio Context failed to initialize:', e);
    }
  }

  ensureContext() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.ensureContext();
    this.isMuted = !this.isMuted;
    this.storage.set('soundEnabled', !this.isMuted);
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    return !this.isMuted;
  }

  setVolume(vol) {
    this.ensureContext();
    this.volume = Math.max(0, Math.min(1, vol));
    this.storage.set('volume', this.volume);
    if (!this.isMuted && this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  // --------------------------------------------------------------------------
  // GENERADORES DE RUIDO PROCEDURAL (Viento patagónico, estática, agua)
  // --------------------------------------------------------------------------

  createNoiseBuffer(type = 'pink') {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === 'pink') {
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      } else if (type === 'brown') {
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      } else {
        // white
        data[i] = white * 0.2;
      }
    }
    return buffer;
  }

  // --------------------------------------------------------------------------
  // AMBIENTES SONOROS
  // --------------------------------------------------------------------------

  playAtmosphere(type) {
    this.ensureContext();
    this.stopAtmosphere();
    if (!this.ctx) return;

    this.currentAtmosphere = type;
    const now = this.ctx.currentTime;

    if (type === 'workshop') {
      // Viento exterior suave filtrado por paredes de chapa y madera
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.createNoiseBuffer('brown');
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, now);

      // LFO para vaivén del viento
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.08, now);
      lfoGain.gain.setValueAtTime(90, now);
      lfo.connect(filter.frequency);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 2);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain);

      noise.start();
      lfo.start();

      this.currentAmbientNodes = [noise, lfo, gain, filter];
      this.playGentleDrone(110, 165, 'cold');
    } else if (type === 'mate_morning') {
      // Mañana soleada, atmósfera cálida y pacífica
      this.playGentleDrone(130.81, 196.00, 'warm'); // C3 y G3
    } else if (type === 'car_garage') {
      // Taller, garaje, eco contenido
      this.playGentleDrone(98.00, 146.83, 'neutral'); // G2 y D3
    } else if (type === 'desert_sunset') {
      // Viento patagónico abierto y solitario
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.createNoiseBuffer('pink');
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(340, now);
      filter.Q.setValueAtTime(1.8, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 1.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain);

      noise.start();
      this.currentAmbientNodes = [noise, gain, filter];
      this.playGentleDrone(65.41, 98.00, 'poetic'); // C2 y G2 profundo
    }
  }

  stopAtmosphere() {
    if (this.currentAmbientNodes) {
      this.currentAmbientNodes.forEach(n => {
        try {
          if (n.stop) n.stop();
          if (n.disconnect) n.disconnect();
        } catch (e) {}
      });
      this.currentAmbientNodes = null;
    }
    this.stopDrone();
  }

  playGentleDrone(freq1, freq2, mood = 'warm') {
    if (!this.ctx) return;
    this.stopDrone();

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();

    osc1.type = mood === 'warm' ? 'sine' : 'triangle';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(freq1, now);
    osc2.frequency.setValueAtTime(freq2, now);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(mood === 'warm' ? 380 : 250, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 3);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc1.start();
    osc2.start();

    this.droneNodes = [osc1, osc2, filter, gain];
  }

  stopDrone() {
    if (this.droneNodes) {
      const now = this.ctx ? this.ctx.currentTime : 0;
      this.droneNodes.forEach(n => {
        try {
          if (n.gain && this.ctx) {
            n.gain.linearRampToValueAtTime(0.0001, now + 1);
          }
          setTimeout(() => {
            if (n.stop) n.stop();
            if (n.disconnect) n.disconnect();
          }, 1100);
        } catch (e) {}
      });
      this.droneNodes = null;
    }
  }

  // --------------------------------------------------------------------------
  // EFECTOS SONOROS DE ACCIÓN PUNTUAL (Foley)
  // --------------------------------------------------------------------------

  // Sonido de verter agua caliente / vapor
  playPourWater() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer('white');

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + 1.8);
    filter.Q.setValueAtTime(4, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
    noise.stop(now + 1.85);
  }

  // Sorbo de mate (cebada íntima)
  playMateSip() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer('pink');

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1600, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + 0.6);
    filter.Q.setValueAtTime(6, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
    noise.stop(now + 0.65);
  }

  // Sonido metálico de llave fija (herramienta)
  playToolClink() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(1450, now);
    osc2.frequency.setValueAtTime(2890, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.38);
    osc2.stop(now + 0.38);
  }

  // Ajuste firme de tuerca/abrazadera metálica
  playWrenchTurn() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(90, now + 0.15);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  // Cierre pesado de capó de auto
  playHoodThud() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.4);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  // Arranque del motor (burro de arranque -> ronroneo parejo)
  playCarStart() {
    this.ensureContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Sonido de arranque: varios giros mecánicos
    for (let i = 0; i < 4; i++) {
      const t = now + i * 0.22;
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(45, t);
      osc.frequency.linearRampToValueAtTime(85, t + 0.15);

      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.18, t);
      g.gain.exponentialRampToValueAtTime(0.01, t + 0.18);

      osc.connect(g);
      g.connect(this.engineGain);
      osc.start(t);
      osc.stop(t + 0.2);
    }

    // Arranque definitivo y ralentí constante
    setTimeout(() => {
      this.startEngineIdle();
    }, 950);
  }

  startEngineIdle() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(32, now); // 600-800 RPM base
    osc2.frequency.setValueAtTime(64, now);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.32, now + 1.2);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.engineGain);

    osc1.start();
    osc2.start();

    this.engineNodes = [osc1, osc2, filter, gain];
  }

  stopEngine() {
    if (this.engineNodes) {
      const now = this.ctx ? this.ctx.currentTime : 0;
      this.engineNodes.forEach(n => {
        try {
          if (n.gain && this.ctx) n.gain.linearRampToValueAtTime(0.001, now + 0.8);
          setTimeout(() => {
            if (n.stop) n.stop();
            if (n.disconnect) n.disconnect();
          }, 900);
        } catch (e) {}
      });
      this.engineNodes = null;
    }
  }

  // --------------------------------------------------------------------------
  // RADIO ANALÓGICA: Sintonizador, estática y fragmentos de voz
  // --------------------------------------------------------------------------

  startRadioStatic() {
    this.ensureContext();
    if (!this.ctx || this.radioStaticNodes) return;
    const now = this.ctx.currentTime;

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer('white');
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200, now);
    filter.Q.setValueAtTime(3, now);

    const heterodyne = this.ctx.createOscillator();
    heterodyne.type = 'sine';
    heterodyne.frequency.setValueAtTime(1800, now);

    const hetGain = this.ctx.createGain();
    hetGain.gain.setValueAtTime(0.03, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, now);

    noise.connect(filter);
    filter.connect(gain);
    heterodyne.connect(hetGain);
    hetGain.connect(gain);
    gain.connect(this.radioGain);

    noise.start();
    heterodyne.start();

    this.radioStaticNodes = { noise, filter, heterodyne, hetGain, gain };
  }

  tuneRadioDial(freqFactor, signalQuality) {
    // freqFactor: 0 a 1 (posición del dial)
    // signalQuality: 0 (pura estática) a 1 (señal perfecta)
    if (!this.radioStaticNodes || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Modulación del silbido heterodino de sintonización
    const dialHz = 400 + freqFactor * 3200;
    this.radioStaticNodes.filter.frequency.setValueAtTime(dialHz, now);
    this.radioStaticNodes.heterodyne.frequency.setValueAtTime(dialHz * 0.75, now);

    // Si la señal es buena, la estática baja de volumen
    const staticVol = Math.max(0.04, (1 - signalQuality) * 0.28);
    this.radioStaticNodes.gain.gain.setValueAtTime(staticVol, now);
    this.radioStaticNodes.hetGain.gain.setValueAtTime((1 - signalQuality) * 0.05, now);
  }

  stopRadioStatic() {
    if (this.radioStaticNodes) {
      try {
        this.radioStaticNodes.noise.stop();
        this.radioStaticNodes.heterodyne.stop();
        this.radioStaticNodes.noise.disconnect();
        this.radioStaticNodes.gain.disconnect();
      } catch (e) {}
      this.radioStaticNodes = null;
    }
  }

  // Emulación de voz de radio / locutor deportivo o fragmento misterioso
  speakRadioFragment(text, voiceType = 'announcer') {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-AR';
    utterance.rate = voiceType === 'announcer' ? 1.15 : 0.85;
    utterance.pitch = voiceType === 'announcer' ? 1.05 : 0.8;
    utterance.volume = this.isMuted ? 0 : 0.9;

    // Intentar buscar voz en español
    const voices = window.speechSynthesis.getVoices();
    const esVoice = voices.find(v => v.lang.startsWith('es'));
    if (esVoice) utterance.voice = esVoice;

    window.speechSynthesis.speak(utterance);
  }

  // Voz evocada del padre (Voz en off)
  speakFatherVoice(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-AR';
    utterance.rate = 0.82; // Pausado, calmo, cercano
    utterance.pitch = 0.78; // Tono grave y maduro
    utterance.volume = this.isMuted ? 0 : 0.95;

    const voices = window.speechSynthesis.getVoices();
    const esVoice = voices.find(v => v.lang.startsWith('es-AR')) || voices.find(v => v.lang.startsWith('es'));
    if (esVoice) utterance.voice = esVoice;

    window.speechSynthesis.speak(utterance);
  }
}
