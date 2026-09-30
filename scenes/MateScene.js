/**
 * LO QUE QUEDÓ EN LA TIERRA
 * Misión 1 — El Mate ("Una mañana cualquiera")
 * Función emocional: PRESENCIA
 */

export class MateScene {
  constructor() {
    this.sceneManager = null;
    this.audio = null;
    this.subtitles = null;
    this.storage = null;
    this.step = 0;
  }

  async enter(container) {
    this.step = 0;

    const layer = document.createElement('div');
    layer.className = 'scene-layer grade-memory-warm';
    layer.style.backgroundImage = "url('assets/backgrounds/memory_mate.jpg')";

    layer.innerHTML = `
      <!-- Vapor que sale de la pava -->
      <div class="steam-emitter" style="top: 48%; right: 41%;">
        <div class="steam-cloud" style="animation-delay: 0s;"></div>
        <div class="steam-cloud" style="animation-delay: 1.1s;"></div>
        <div class="steam-cloud" style="animation-delay: 2.2s;"></div>
      </div>

      <!-- Tarjetas de interacción sobre la mesa -->
      <div class="mate-interaction-area">
        <div id="action-yerba" class="action-object-card" data-cursor="TOMAR">
          <svg class="action-object-icon" viewBox="0 0 40 40">
            <rect x="8" y="10" width="24" height="26" rx="2" fill="#2d3b20" stroke="#779955" stroke-width="1.5"/>
            <text x="20" y="24" font-family="'Courier New', monospace" font-size="6" fill="#ccdcb5" text-anchor="middle">YERBA</text>
          </svg>
          <span class="action-object-label">Colocar Yerba</span>
        </div>

        <div id="action-bombilla" class="action-object-card" style="display:none;" data-cursor="USAR">
          <svg class="action-object-icon" viewBox="0 0 40 40">
            <line x1="12" y1="32" x2="28" y2="8" stroke="#ccc" stroke-width="3" stroke-linecap="round"/>
            <circle cx="28" cy="8" r="3" fill="#d4af37"/>
          </svg>
          <span class="action-object-label">Acomodar Bombilla</span>
        </div>

        <div id="action-pava" class="action-object-card" style="display:none;" data-cursor="CEBAR">
          <svg class="action-object-icon" viewBox="0 0 40 40">
            <ellipse cx="20" cy="24" rx="14" ry="10" fill="#888" stroke="#444" stroke-width="1.5"/>
            <path d="M 12 16 Q 20 6 28 16" fill="none" stroke="#333" stroke-width="2"/>
            <path d="M 6 22 Q 2 18 5 14" fill="none" stroke="#888" stroke-width="2"/>
          </svg>
          <span class="action-object-label">Cebar Agua</span>
        </div>

        <div id="action-entregar" class="action-object-card" style="display:none;" data-cursor="ENTREGAR">
          <svg class="action-object-icon" viewBox="0 0 40 40">
            <path d="M 8 25 Q 20 32 32 25 L 30 18 Q 20 22 10 18 Z" fill="#b08a65"/>
          </svg>
          <span class="action-object-label">Alcanzar a Papá</span>
        </div>
      </div>
    `;

    container.appendChild(layer);

    this.audio.playAtmosphere('mate_morning');

    // Título de misión
    await this.sceneManager.showMissionIntro({
      number: 'RECUERDO I',
      title: 'UNA MAÑANA CUALQUIERA',
      subtitle: 'Presencia'
    });

    this.setupSequence(layer);
  }

  setupSequence(layer) {
    const btnYerba = layer.querySelector('#action-yerba');
    const btnBombilla = layer.querySelector('#action-bombilla');
    const btnPava = layer.querySelector('#action-pava');
    const btnEntregar = layer.querySelector('#action-entregar');

    // Paso 1: Poner yerba
    btnYerba.addEventListener('click', async () => {
      if (this.step !== 0) return;
      this.step = 1;
      this.audio.playToolClink();
      btnYerba.classList.add('completed');

      await this.subtitles.playSequence([
        { speaker: 'PADRE', text: 'No lo llenes tanto.', delay: 400, duration: 2500 }
      ]);

      btnBombilla.style.display = 'flex';
    });

    // Paso 2: Bombilla
    btnBombilla.addEventListener('click', async () => {
      if (this.step !== 1) return;
      this.step = 2;
      this.audio.playToolClink();
      btnBombilla.classList.add('completed');

      await this.subtitles.playSequence([
        { speaker: 'VALENTINO', text: '¿Así?', delay: 300, duration: 2000 },
        { speaker: 'PADRE', text: 'Ahí está bien. Tapale la boca antes de sacudirlo.', delay: 300, duration: 3200 }
      ]);

      btnPava.style.display = 'flex';
    });

    // Paso 3: Cebar agua
    btnPava.addEventListener('click', async () => {
      if (this.step !== 2) return;
      this.step = 3;
      this.audio.playPourWater();
      btnPava.classList.add('completed');

      await this.subtitles.playSequence([
        { speaker: 'PADRE', text: 'No te apures. Dejá que hinche primero al costado.', delay: 800, duration: 3500 },
        { speaker: 'VALENTINO', text: 'El agua está en su punto.', delay: 500, duration: 2400 }
      ]);

      btnEntregar.style.display = 'flex';
    });

    // Paso 4: Entregar el mate al padre
    btnEntregar.addEventListener('click', async () => {
      if (this.step !== 3) return;
      this.step = 4;
      btnEntregar.classList.add('completed');

      // Padre toma el mate con calma
      await this.subtitles.playSequence([
        { speaker: 'VALENTINO', text: 'Tomá, pa.', delay: 400, duration: 2200 }
      ]);

      // Sonido íntimo de sorbo
      setTimeout(() => {
        this.audio.playMateSip();
      }, 1200);

      await new Promise(r => setTimeout(r, 2600));

      await this.subtitles.playSequence([
        { speaker: 'PADRE', text: 'Está bueno. Tomá vos ahora.', delay: 600, duration: 3000 }
      ]);

      // Valentino toma de vuelta
      this.audio.playMateSip();
      await new Promise(r => setTimeout(r, 2200));

      // Silencio contemplativo
      await this.subtitles.playSequence([
        { speaker: 'VALENTINO', text: 'Ese mate era de él. Toda la mañana se pasaba con el termo bajo el brazo.', thought: true, delay: 1000, duration: 4500 }
      ]);

      // Guardar progreso y retornar al presente
      this.storage.set('MATE_COMPLETED', true);

      // Transición suave: la imagen pierde definición hacia el presente
      setTimeout(() => {
        this.sceneManager.changeScene('INTRO', 'warm-fade');
      }, 1500);
    });
  }

  exit() {
    this.audio.stopAtmosphere();
  }
}
