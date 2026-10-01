/**
 * LO QUE QUEDÓ EN LA TIERRA
 * Preparación del Viaje — Conexión directa con la Escena 4 del Cortometraje
 * Guardar mate, herramienta, mapa y sobre (que asoma de la mochila)
 * Inspiración Grim Fandango: Puesta en escena teatral, expresividad corporal y solemnidad
 */

import { CharacterAnimator } from '../scripts/CharacterAnimator.js';

export class DepartureScene {
  constructor() {
    this.sceneManager = null;
    this.audio = null;
    this.subtitles = null;
    this.storage = null;
    this.packedCount = 0;
  }

  async enter(container) {
    this.packedCount = 0;

    const layer = document.createElement('div');
    layer.className = 'scene-layer grade-present';
    layer.style.backgroundImage = "url('assets/backgrounds/workshop_present.jpg')";

    layer.innerHTML = `
      <!-- ============================================================== -->
      <!-- CAPA DE PERSONAJE: VALENTINO ADULTO PREPARANDO EL VIAJE        -->
      <!-- ============================================================== -->
      <div id="character-valentino-departure" class="character-layer character-valentino-present stop-motion-idle" style="left: 18%; bottom: 10%;">
        <img src="assets/characters/valentino/valentino_present_placeholder.svg" alt="Valentino Adulto">
      </div>

      <!-- Bandeja de objetos para guardar en la mochila -->
      <div id="packing-tray" class="packing-tray">
        <div class="packing-item" data-item="mate" data-cursor="GUARDAR">
          <img src="assets/props/mate_placeholder.svg" alt="Mate">
          <span>Mate viejo</span>
        </div>
        <div class="packing-item" data-item="wrench" data-cursor="GUARDAR">
          <img src="assets/props/wrench_placeholder.svg" alt="Llave 10">
          <span>Llave fija 10mm</span>
        </div>
        <div class="packing-item" data-item="map" data-cursor="GUARDAR">
          <img src="assets/props/map_placeholder.svg" alt="Mapa">
          <span>Mapa de ruta</span>
        </div>
        <div class="packing-item" data-item="envelope" data-cursor="GUARDAR">
          <img src="assets/props/envelope_placeholder.svg" alt="Sobre">
          <span>Sobre de papá</span>
        </div>
      </div>

      <!-- Mochila armada en la mesa -->
      <div id="backpack-table" class="hotspot" style="top:55%; left:45%; width:180px; height:180px; display:none;" data-cursor="TOMAR" data-label="Tomar mochila">
        <img src="assets/props/backpack_placeholder.svg" style="width:120px; height:auto; filter:drop-shadow(0 6px 12px rgba(0,0,0,0.6));">
      </div>
    `;

    container.appendChild(layer);

    this.audio.playAtmosphere('workshop');

    const valentinoEl = layer.querySelector('#character-valentino-departure');
    CharacterAnimator.performAction(valentinoEl, 'pose-thoughtful', 2800);

    await this.subtitles.playSequence([
      { speaker: 'VALENTINO', text: 'Tengo que juntar lo necesario antes de que caiga la tarde.', thought: true, delay: 400, duration: 3200 }
    ]);

    this.setupPacking(layer);
  }

  setupPacking(layer) {
    const items = layer.querySelectorAll('.packing-item');
    const backpackTable = layer.querySelector('#backpack-table');
    const tray = layer.querySelector('#packing-tray');
    const valentinoEl = layer.querySelector('#character-valentino-departure');

    items.forEach(el => {
      el.addEventListener('click', async () => {
        el.classList.add('packed');
        this.audio.playToolClink();
        this.packedCount++;

        // Actuación: Valentino se aproxima y guarda el objeto con movimiento físico stop-motion
        CharacterAnimator.performAction(valentinoEl, 'pose-pack-item', 1600);

        const itemName = el.getAttribute('data-item');
        if (itemName === 'envelope') {
          await this.subtitles.playSequence([
            { speaker: 'VALENTINO', text: 'El sobre en el bolsillo de arriba... para tenerlo a mano.', thought: true, duration: 2500 }
          ]);
        }

        if (this.packedCount === 4) {
          tray.style.display = 'none';
          backpackTable.style.display = 'flex';

          CharacterAnimator.playPose(valentinoEl, 'pose-reach-desk', 2500);

          await this.subtitles.playSequence([
            { speaker: 'VALENTINO', text: 'La mochila está lista. Es hora de cargar el auto.', thought: true, delay: 300, duration: 3200 }
          ]);
        }
      });
    });

    backpackTable.addEventListener('click', async () => {
      backpackTable.style.display = 'none';
      this.audio.playToolClink();

      CharacterAnimator.performAction(valentinoEl, 'pose-reach-mate', 1500);

      // Salir al auto: Mostrar Insert Shot en el asiento del acompañante
      await this.showCarPassengerSeat(layer);
    });
  }

  async showCarPassengerSeat(layer) {
    const valentinoEl = layer.querySelector('#character-valentino-departure');
    if (valentinoEl) valentinoEl.style.display = 'none';

    // Transición visual al plano detalle del cortometraje
    layer.style.backgroundImage = "url('assets/backgrounds/departure_backpack_seat.jpg')";

    await this.subtitles.playSequence([
      { 
        speaker: 'CORTOMETRAJE — ESCENA 4', 
        text: 'INSERT. Asiento del acompañante. La mochila descansa sobre el tapizado gastado. Asoma desde dentro el sobre con la carta.', 
        thought: true,
        delay: 500, 
        duration: 4800 
      }
    ]);

    // Botón de encendido del motor
    const startCarBtn = document.createElement('button');
    startCarBtn.className = 'btn-cinema';
    startCarBtn.style.position = 'absolute';
    startCarBtn.style.bottom = '95px';
    startCarBtn.style.left = '50%';
    startCarBtn.style.transform = 'translateX(-50%)';
    startCarBtn.textContent = 'ARRANCAR EL MOTOR';
    layer.appendChild(startCarBtn);

    startCarBtn.addEventListener('click', async () => {
      startCarBtn.style.display = 'none';
      this.audio.playCarStart();

      await this.subtitles.playSequence([
        { speaker: 'VALENTINO', text: 'El motor responde parejo.', thought: true, delay: 1800, duration: 2600 },
        { speaker: 'VALENTINO', text: 'Primera marcha. Salir a la ruta.', thought: true, delay: 400, duration: 2600 }
      ]);

      // Pasar a la escena final de la ruta al atardecer
      setTimeout(() => {
        this.sceneManager.changeScene('EPILOGUE', 'black');
      }, 1500);
    });
  }

  exit() {
    this.audio.stopAtmosphere();
  }
}
