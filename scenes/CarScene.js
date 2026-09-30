/**
 * LO QUE QUEDÓ EN LA TIERRA
 * Misión 2 — El Auto ("Pasame la diez")
 * Función emocional: HERENCIA
 */

export class CarScene {
  constructor() {
    this.sceneManager = null;
    this.audio = null;
    this.subtitles = null;
    this.storage = null;
    this.hasKey10 = false;
  }

  async enter(container) {
    this.hasKey10 = false;

    const layer = document.createElement('div');
    layer.className = 'scene-layer grade-memory-warm';
    layer.style.backgroundImage = "url('assets/backgrounds/memory_car.jpg')";

    layer.innerHTML = `
      <!-- Zona del motor interactiva -->
      <div id="hotspot-engine" class="hotspot" style="top: 45%; left: 35%; width: 260px; height: 180px;" data-cursor="MIRAR" data-label="Motor del auto"></div>

      <!-- Zona de caja de herramientas -->
      <div id="hotspot-toolbox" class="hotspot" style="top: 55%; right: 12%; width: 180px; height: 140px;" data-cursor="ABRIR" data-label="Caja de herramientas"></div>

      <!-- Modal de selección de herramientas (oculto inicialmente) -->
      <div id="toolbox-modal" class="toolbox-modal" style="display: none;">
        <div class="toolbox-title">Seleccionar Herramienta</div>
        <div class="tools-row">
          <div class="tool-slot" data-tool="8" data-cursor="TOMAR">
            <svg viewBox="0 0 30 30"><rect x="12" y="4" width="6" height="22" rx="1" fill="#888"/></svg>
            <span>Llave 8 mm</span>
          </div>
          <div class="tool-slot" data-tool="10" data-cursor="TOMAR">
            <svg viewBox="0 0 30 30"><rect x="11" y="3" width="8" height="24" rx="1" fill="#bbb"/></svg>
            <span style="color:var(--accent-gold); font-weight:600;">Llave 10 mm</span>
          </div>
          <div class="tool-slot" data-tool="12" data-cursor="TOMAR">
            <svg viewBox="0 0 30 30"><rect x="10" y="2" width="10" height="26" rx="1" fill="#888"/></svg>
            <span>Llave 12 mm</span>
          </div>
          <div class="tool-slot" data-tool="destornillador" data-cursor="TOMAR">
            <svg viewBox="0 0 30 30"><rect x="13" y="12" width="4" height="15" fill="#aaa"/><rect x="11" y="2" width="8" height="10" rx="2" fill="#c85"/></svg>
            <span>Destornillador</span>
          </div>
        </div>
      </div>

      <!-- Indicador de ajuste final -->
      <div id="ratchet-action" class="action-object-card" style="position:absolute; top:65%; left:42%; display:none;" data-cursor="AJUSTAR">
        <svg class="action-object-icon" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="14" fill="none" stroke="#e2a853" stroke-width="2"/>
          <line x1="20" y1="12" x2="20" y2="28" stroke="#fff" stroke-width="3"/>
          <line x1="12" y1="20" x2="28" y2="20" stroke="#fff" stroke-width="3"/>
        </svg>
        <span class="action-object-label">Ajustar Abrazadera</span>
      </div>
    `;

    container.appendChild(layer);

    this.audio.playAtmosphere('car_garage');

    // Título de misión
    await this.sceneManager.showMissionIntro({
      number: 'RECUERDO II',
      title: 'PASAME LA DIEZ',
      subtitle: 'Herencia'
    });

    // Inicio del diálogo
    await this.subtitles.playSequence([
      { speaker: 'PADRE', text: 'Pasame la diez.', delay: 400, duration: 2500 }
    ]);

    this.setupInteractions(layer);
  }

  setupInteractions(layer) {
    const spotEngine = layer.querySelector('#hotspot-engine');
    const spotToolbox = layer.querySelector('#hotspot-toolbox');
    const modalToolbox = layer.querySelector('#toolbox-modal');
    const ratchetAction = layer.querySelector('#ratchet-action');
    const toolSlots = layer.querySelectorAll('.tool-slot');

    // Abrir caja de herramientas
    spotToolbox.addEventListener('click', () => {
      this.audio.playToolClink();
      modalToolbox.style.display = 'flex';
    });

    // Seleccionar herramienta
    toolSlots.forEach(slot => {
      slot.addEventListener('click', async () => {
        const tool = slot.getAttribute('data-tool');
        this.audio.playToolClink();

        if (tool === '10') {
          this.hasKey10 = true;
          slot.classList.add('selected');
          modalToolbox.style.display = 'none';

          await this.subtitles.playSequence([
            { speaker: 'VALENTINO', text: 'Tomá, acá tenés la diez.', delay: 300, duration: 2200 },
            { speaker: 'PADRE', text: 'No fuerces. Sentí cómo agarra la rosca.', delay: 400, duration: 3200 },
            { speaker: 'PADRE', text: 'Esperá...', delay: 600, duration: 2000 },
            { speaker: 'PADRE', text: 'Escuchalo.', delay: 400, duration: 2000 },
            { speaker: 'VALENTINO', text: '¿Qué?', delay: 300, duration: 1600 },
            { speaker: 'PADRE', text: 'El motor. Antes de tocar cualquier cosa, escuchalo.', delay: 400, duration: 4000 }
          ]);

          ratchetAction.style.display = 'flex';
        } else {
          await this.subtitles.playSequence([
            { speaker: 'PADRE', text: 'Esa no entra. Buscá la diez, fijate bien.', delay: 200, duration: 2800 }
          ]);
        }
      });
    });

    // Ajustar abrazadera del motor
    ratchetAction.addEventListener('click', async () => {
      ratchetAction.style.display = 'none';
      this.audio.playWrenchTurn();

      await new Promise(r => setTimeout(r, 600));
      this.audio.playWrenchTurn();

      await this.subtitles.playSequence([
        { speaker: 'VALENTINO', text: 'Ajustó perfecto.', delay: 400, duration: 2200 }
      ]);

      // Arrancar motor
      await new Promise(r => setTimeout(r, 400));
      this.audio.playCarStart();

      await this.subtitles.playSequence([
        { speaker: 'PADRE', text: 'Ahí está. ¿Sentís cómo ronronea ahora parejito?', delay: 1800, duration: 3800 }
      ]);

      // Cerrar capó con golpe sólido
      await new Promise(r => setTimeout(r, 1200));
      this.audio.playHoodThud();

      await this.subtitles.playSequence([
        { speaker: 'VALENTINO', text: 'Si la aguja de temperatura vuelve a subir en la ruta, sé exactamente qué hacer.', thought: true, delay: 800, duration: 4500 }
      ]);

      this.audio.stopEngine();

      // Guardar progreso y retornar al taller
      this.storage.set('CAR_COMPLETED', true);

      setTimeout(() => {
        this.sceneManager.changeScene('INTRO', 'warm-fade');
      }, 1500);
    });
  }

  exit() {
    this.audio.stopEngine();
    this.audio.stopAtmosphere();
  }
}
