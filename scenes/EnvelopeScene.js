import {mediaPath,mediaHTML} from '../scripts/MediaAssets.js';
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
    const visit = this.visit = (this.visit || 0) + 1;
    this.hasInspectedMap = false;

    const layer = document.createElement('div');
    layer.className = 'scene-layer grade-present envelope-present';
    layer.style.backgroundImage = `url('${mediaPath('assets/present-third-person/kitchen-base-v1.png')}')`;

    layer.innerHTML = mediaHTML(`
      <!-- Presencia de Valentino junto al cajón -->
      <div class="drawer-modal">
        <div class="drawer-content">
          <!-- Tarjeta 1: El Mapa viejo -->
          <div id="card-map" class="drawer-item-card" data-cursor="MIRAR">
            <img src="assets/archive-v1/mapa.png" alt="Mapa plegado de la Ruta 40, con el kilómetro 142 marcado">
            <div class="drawer-item-title">MAPA DE RUTA PLEGADO</div>
            <div class="drawer-item-desc">Anotaciones a mano de papá. Una cruz marcada en el kilómetro 142.</div>
          </div>

          <!-- Tarjeta 2: El Sobre -->
          <div id="card-envelope" class="drawer-item-card" data-cursor="ABRIR">
            <img src="assets/archive-v1/sobre.png" alt="Sobre cerrado con el nombre de Valentino escrito a mano">
            <div class="drawer-item-title">SOBRE SELLADO</div>
            <div class="drawer-item-desc">Con su caligrafía firme en tinta negra: "Valentino".</div>
          </div>
        </div>
      </div>
    `);

    container.appendChild(layer);

    this.layer = layer;
  }

  async onVisible() {
    const visit = this.visit;
    const layer = this.layer;
    this.audio.playAtmosphere('workshop');

    // Título de secuencia
    await this.sceneManager.showMissionIntro({
      number: 'SECUENCIA FINAL',
      title: 'EL SOBRE Y EL MAPA',
      subtitle: 'Negación'
    });

    if (this.visit === visit) this.setupCards(layer);
  }

  setupCards(layer) {
    const visit = this.visit;
    let inspecting = false;
    const cardMap = layer.querySelector('#card-map');
    const cardEnvelope = layer.querySelector('#card-envelope');
    const valentinoEl = layer.querySelector('#character-valentino-desk');

    // 1. Mirar el Mapa
    cardMap.addEventListener('click', async () => {
      if (this.visit !== visit || inspecting) return;
      inspecting = true;
      this.hasInspectedMap = true;
      this.audio.playToolClink();
      CharacterAnimator.performAction(valentinoEl, 'pose-reach-desk', 2500);

      const modal = document.createElement('div');
      modal.className = 'inspect-modal';
      modal.innerHTML = mediaHTML(`
        <div class="inspect-media-wrapper">
          <img src="assets/archive-v1/mapa.png" alt="Mapa de la Ruta 40 con una cruz junto al árbol del kilómetro 142">
          <div class="inspect-caption">"Ruta 40... El árbol solitario del kilómetro 142. Allí donde él estuvo cuando tenía 23 años."</div>
          <button class="btn-cinema" style="margin-top: 24px;">VOLVER AL CAJÓN</button>
        </div>
      `);
      layer.appendChild(modal);

      const closeBtn = modal.querySelector('button');
      closeBtn.addEventListener('click', () => {
        if (this.visit !== visit) return;
        this.audio.playToolClink();
        layer.removeChild(modal);
        inspecting = false;
      });
    });

    // 2. Abrir el Sobre (Regla estricta: NO mostrar que está vacía)
    cardEnvelope.addEventListener('click', async () => {
      if (this.visit !== visit || inspecting) return;
      inspecting = true;
      this.audio.playToolClink();
      CharacterAnimator.performAction(valentinoEl, 'pose-thoughtful', 3500);

      const modal = document.createElement('div');
      modal.className = 'inspect-modal';
      modal.innerHTML = mediaHTML(`
        <div class="inspect-media-wrapper">
          <!-- Enfocamos el sobre y las manos, NUNCA el papel interior desplegado -->
          <img src="assets/archive-v1/sobre.png" alt="Sobre de papel envejecido dirigido a Valentino, sin mostrar su contenido">
          <div class="inspect-caption" style="font-size: 22px; color: var(--accent-gold);">
            Valentino desliza los dedos y abre el sobre...
          </div>
        </div>
      `);
      layer.appendChild(modal);

      // Leyendas en pantalla: estos fragmentos no llevan voz ni etiqueta V.O.
      await this.subtitles.playSequence([
        { 
          speaker: '', 
          text: 'Valentino...', 
          delay: 800, 
          duration: 3000 
        },
        { 
          speaker: '', 
          text: '17 de octubre...', 
          delay: 500, 
          duration: 2800 
        },
        { 
          speaker: '', 
          text: '06:42...', 
          delay: 600, 
          duration: 3200 
        }
      ]);

      // Construcción del autoengaño en la mente de Valentino
      if (this.visit !== visit) return;
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
      if (this.visit !== visit) return;
      this.transitionTimer = setTimeout(() => {
        if (this.visit !== visit) return;
        this.sceneManager.changeScene('DEPARTURE', 'black');
      }, 1500);
    });
  }

  exit() {
    this.visit = (this.visit || 0) + 1;
    clearTimeout(this.transitionTimer);
    this.audio.stopAtmosphere();
  }
}
