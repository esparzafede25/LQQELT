/**
 * LO QUE QUEDÓ EN LA TIERRA
 * Secuencia Final — El Sobre + El Mapa
 * Función emocional: NEGACIÓN (Construcción del viaje)
 * IMPORTANTE: NUNCA REVELAR QUE LA CARTA ESTÁ VACÍA
 * Inspiración Grim Fandango: Puesta en escena teatral, expresividad corporal y misterio sutil
 */

import { CharacterAnimator } from '../scripts/CharacterAnimator.js';

export class EnvelopeScene {
  constructor() {
    this.sceneManager = null;
    this.audio = null;
    this.subtitles = null;
    this.storage = null;
    this.hasInspectedMap = false;
  }

  async enter(container) {
    this.hasInspectedMap = false;

    const layer = document.createElement('div');
    layer.className = 'scene-layer grade-present';
    layer.style.backgroundImage = "url('assets/backgrounds/sequence_envelope_map.jpg')";

    layer.innerHTML = `
      <!-- Presencia de Valentino junto al cajón -->
      <div id="character-valentino-desk" class="character-layer character-valentino-present stop-motion-idle" style="left: 12%; bottom: 6%; opacity: 0.85;">
        <img src="assets/characters/valentino/valentino_present_placeholder.svg" alt="Valentino Adulto">
      </div>

      <div class="drawer-modal">
        <div class="drawer-content">
          <!-- Tarjeta 1: El Mapa viejo -->
          <div id="card-map" class="drawer-item-card" data-cursor="MIRAR">
            <img src="assets/props/map_placeholder.svg" alt="Mapa viejo">
            <div class="drawer-item-title">MAPA DE RUTA PLEGADO</div>
            <div class="drawer-item-desc">Anotaciones a mano de papá. Una cruz marcada en el kilómetro 142.</div>
          </div>

          <!-- Tarjeta 2: El Sobre -->
          <div id="card-envelope" class="drawer-item-card" data-cursor="ABRIR">
            <img src="assets/props/envelope_placeholder.svg" alt="Sobre">
            <div class="drawer-item-title">SOBRE SELLADO</div>
            <div class="drawer-item-desc">Con su caligrafía firme en tinta negra: "Valentino".</div>
          </div>
        </div>
      </div>
    `;

    container.appendChild(layer);

    this.audio.playAtmosphere('workshop');

    // Título de secuencia
    await this.sceneManager.showMissionIntro({
      number: 'SECUENCIA FINAL',
      title: 'EL SOBRE Y EL MAPA',
      subtitle: 'Negación'
    });

    this.setupCards(layer);
  }

  setupCards(layer) {
    const cardMap = layer.querySelector('#card-map');
    const cardEnvelope = layer.querySelector('#card-envelope');
    const valentinoEl = layer.querySelector('#character-valentino-desk');

    // 1. Mirar el Mapa
    cardMap.addEventListener('click', async () => {
      this.hasInspectedMap = true;
      this.audio.playToolClink();
      CharacterAnimator.performAction(valentinoEl, 'pose-reach-desk', 2500);

      const modal = document.createElement('div');
      modal.className = 'inspect-modal';
      modal.innerHTML = `
        <div class="inspect-media-wrapper">
          <img src="assets/props/map_placeholder.svg" style="max-height: 55vh; object-fit: contain;">
          <div class="inspect-caption">"Ruta 40... El árbol solitario del kilómetro 142. Allí donde él estuvo cuando tenía 23 años."</div>
          <button class="btn-cinema" style="margin-top: 24px;">VOLVER AL CAJÓN</button>
        </div>
      `;
      layer.appendChild(modal);

      const closeBtn = modal.querySelector('button');
      closeBtn.addEventListener('click', () => {
        this.audio.playToolClink();
        layer.removeChild(modal);
      });
    });

    // 2. Abrir el Sobre (Regla estricta: NO mostrar que está vacía)
    cardEnvelope.addEventListener('click', async () => {
      this.audio.playToolClink();
      CharacterAnimator.performAction(valentinoEl, 'pose-thoughtful', 3500);

      const modal = document.createElement('div');
      modal.className = 'inspect-modal';
      modal.innerHTML = `
        <div class="inspect-media-wrapper">
          <!-- Enfocamos el sobre y las manos, NUNCA el papel interior desplegado -->
          <img src="assets/props/envelope_placeholder.svg" style="max-width: 420px; object-fit: contain;">
          <div class="inspect-caption" style="font-size: 22px; color: var(--accent-gold);">
            Valentino desliza los dedos y abre el sobre...
          </div>
        </div>
      `;
      layer.appendChild(modal);

      // Reproducción de la voz evocada del padre (V.O.)
      await this.subtitles.playSequence([
        { 
          speaker: 'PADRE (V.O.)', 
          text: 'Valentino...', 
          voice: 'father',
          delay: 800, 
          duration: 3000 
        },
        { 
          speaker: 'PADRE (V.O.)', 
          text: '17 de octubre...', 
          voice: 'father',
          delay: 500, 
          duration: 2800 
        },
        { 
          speaker: 'PADRE (V.O.)', 
          text: '06:42...', 
          voice: 'father',
          delay: 600, 
          duration: 3200 
        }
      ]);

      // Construcción del autoengaño en la mente de Valentino
      await this.subtitles.playSequence([
        { 
          speaker: 'VALENTINO', 
          text: 'El árbol del mapa... La hora en la radio... Se está yendo hacia allá.', 
          thought: true, 
          delay: 600, 
          duration: 4200 
        },
        { 
          speaker: 'VALENTINO', 
          text: 'No es una despedida para siempre. Si arranco ahora, todavía llego a verlo partir.', 
          thought: true, 
          delay: 400, 
          duration: 4800 
        }
      ]);

      // Pasar a la preparación del viaje
      setTimeout(() => {
        this.sceneManager.changeScene('DEPARTURE', 'black');
      }, 1500);
    });
  }

  exit() {
    this.audio.stopAtmosphere();
  }
}
