/**
 * LO QUE QUEDÓ EN LA TIERRA
 * Misión 3 — La Radio ("Quedate, que falta poco")
 * Función emocional: DISTORSIÓN
 */

export class RadioScene {
  constructor() {
    this.sceneManager = null;
    this.audio = null;
    this.subtitles = null;
    this.storage = null;
    this.isRadioOn = false;
    this.currentDial = 0.2;
    this.distortionStage = 0;
    this.distortionInterval = null;
  }

  async enter(container) {
    this.isRadioOn = false;
    this.currentDial = 0.2;
    this.distortionStage = 0;

    const layer = document.createElement('div');
    layer.className = 'scene-layer grade-memory-warm';
    layer.style.backgroundImage = "url('assets/backgrounds/memory_radio.jpg')";

    layer.innerHTML = `
      <!-- Silueta espectral de Valentino adulto (oculta inicialmente) -->
      <div id="adult-valentino-shadow" style="position:absolute; bottom:12%; left:8%; width:160px; height:450px; opacity:0; pointer-events:none; transition:opacity 2.5s ease; filter:brightness(0.2) blur(1.5px); z-index:580;">
        <img src="assets/characters/valentino/valentino_profile.jpg" style="width:100%; height:100%; object-fit:contain; transform:scaleX(-1);">
      </div>

      <!-- Interfaz de la radio analógica -->
      <div class="radio-interface">
        <div class="radio-top-row">
          <div class="radio-brand">AURORA — AM TRANSISTOR</div>
          <div class="signal-indicator">
            <div id="signal-led" class="signal-led"></div>
            <span id="signal-text">SIN SEÑAL</span>
          </div>
          <button id="radio-power" class="radio-power-btn" data-cursor="USAR">ENCENDER</button>
        </div>

        <div class="radio-dial-track">
          <div class="radio-frequencies">
            <span>540</span>
            <span>670</span>
            <span>810</span>
            <span>950 (FÚTBOL)</span>
            <span>1190</span>
            <span>1420</span>
          </div>
          <div id="radio-needle" class="radio-dial-needle" style="left: 20%;"></div>
        </div>

        <input type="range" id="radio-slider" class="radio-slider" min="0" max="100" value="20" disabled>
      </div>
    `;

    container.appendChild(layer);

    this.audio.playAtmosphere('car_garage');

    // Título de misión
    await this.sceneManager.showMissionIntro({
      number: 'RECUERDO III',
      title: 'QUEDATE, QUE FALTA POCO',
      subtitle: 'Distorsión'
    });

    this.setupRadio(layer);
  }

  setupRadio(layer) {
    const powerBtn = layer.querySelector('#radio-power');
    const slider = layer.querySelector('#radio-slider');
    const needle = layer.querySelector('#radio-needle');
    const led = layer.querySelector('#signal-led');
    const signalText = layer.querySelector('#signal-text');
    const shadowValentino = layer.querySelector('#adult-valentino-shadow');

    // Encendido
    powerBtn.addEventListener('click', async () => {
      this.audio.playToolClink();
      if (!this.isRadioOn) {
        this.isRadioOn = true;
        powerBtn.classList.add('on');
        powerBtn.textContent = 'APAGAR';
        slider.disabled = false;

        this.audio.startRadioStatic();
        this.updateTuning(20, layer);

        await this.subtitles.playSequence([
          { speaker: 'VALENTINO', text: 'Hay mucha estática hoy...', delay: 300, duration: 2500 }
        ]);
      } else {
        this.isRadioOn = false;
        powerBtn.classList.remove('on');
        powerBtn.textContent = 'ENCENDER';
        slider.disabled = true;
        this.audio.stopRadioStatic();
      }
    });

    // Desplazamiento del dial
    slider.addEventListener('input', (e) => {
      if (!this.isRadioOn) return;
      const val = parseInt(e.target.value, 10);
      needle.style.left = `${val}%`;
      this.updateTuning(val, layer);
    });
  }

  updateTuning(val, layer) {
    const targetFreq = 58; // Sintonía óptima del partido (alrededor de 950 kHz)
    const distance = Math.abs(val - targetFreq);
    const signalQuality = Math.max(0, 1 - (distance / 14));

    const led = layer.querySelector('#signal-led');
    const signalText = layer.querySelector('#signal-text');

    this.audio.tuneRadioDial(val / 100, signalQuality);

    if (signalQuality > 0.75) {
      led.classList.add('active');
      signalText.textContent = 'EN SINTONÍA (AM 950)';

      if (this.distortionStage === 0) {
        this.triggerMatchBroadcast(layer);
      }
    } else {
      led.classList.remove('active');
      signalText.textContent = 'ESTÁTICA';
    }
  }

  async triggerMatchBroadcast(layer) {
    this.distortionStage = 1;

    // Relato deportivo y aprobación del padre
    await this.subtitles.playSequence([
      { speaker: 'PADRE', text: 'Ahí. Dejala ahí.', delay: 400, duration: 2400 },
      { speaker: 'PADRE', text: 'Quedate, que falta poco para que termine el partido.', delay: 300, duration: 3200 },
      { 
        speaker: 'RELATOR', 
        text: '...pelota que cruza el círculo central, la pide por la banda, avanza con espacio...', 
        voice: 'announcer',
        delay: 600, 
        duration: 4000 
      }
    ]);

    // Comienza la distorsión progresiva (interferencia ambigua)
    await this.startDistortionProcess(layer);
  }

  async startDistortionProcess(layer) {
    this.distortionStage = 2;

    // Transición visual sutil: la luz se enfría, desvanecimiento del fondo
    layer.classList.remove('grade-memory-warm');
    layer.classList.add('grade-memory-radio-drift');

    // Descenso de sonido ambiente normal
    this.audio.stopAtmosphere();

    const ambiguousSequence = [
      { speaker: 'RELATOR', text: '...se va...', voice: 'announcer', duration: 1800 },
      { speaker: 'TRANSMISIÓN LEJANA', text: '...últimos preparativos...', thought: true, duration: 2400 },
      { speaker: 'RELATOR', text: '...se va solo por la línea...', voice: 'announcer', duration: 2200 },
      { speaker: 'TRANSMISIÓN LEJANA', text: '...los cuatro seleccionados para la misión...', thought: true, duration: 3200 },
      { speaker: 'RELATOR', text: '...¡todavía puede verlo! ¡Tiene tiempo todavía!...', voice: 'announcer', duration: 3200 },
      { speaker: 'TRANSMISIÓN LEJANA', text: '...el despegue está previsto para las 06:42...', thought: true, duration: 3500 },
      { speaker: 'RELATOR', text: '...últimos minutos en el reloj...', voice: 'announcer', duration: 2500 },
      { speaker: 'TRANSMISIÓN LEJANA', text: '...podrá verse la estela desde el sector sur...', thought: true, duration: 3200 },
      { speaker: 'TRANSMISIÓN LEJANA', text: '...06:42... esta misma noche...', thought: true, duration: 3500 }
    ];

    await this.subtitles.playSequence(ambiguousSequence);

    // Aparición de Valentino adulto en sombras observando el recuerdo
    const shadow = layer.querySelector('#adult-valentino-shadow');
    if (shadow) shadow.style.opacity = '0.75';

    await new Promise(r => setTimeout(r, 2000));

    await this.subtitles.playSequence([
      { 
        speaker: 'VALENTINO', 
        text: 'Se está yendo... Si salgo ahora por la ruta, todavía puedo llegar a verlo partir.', 
        thought: true, 
        delay: 500, 
        duration: 4800 
      }
    ]);

    // Silencio repentino, la radio se apaga
    this.audio.stopRadioStatic();

    // Guardar progreso
    this.storage.set('RADIO_COMPLETED', true);
    this.storage.set('LETTER_SEQUENCE_UNLOCKED', true);

    setTimeout(() => {
      this.sceneManager.changeScene('INTRO', 'black');
    }, 1800);
  }

  exit() {
    this.audio.stopRadioStatic();
    if (this.distortionInterval) clearInterval(this.distortionInterval);
  }
}
