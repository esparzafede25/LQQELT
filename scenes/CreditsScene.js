/**
 * LO QUE QUEDÓ EN LA TIERRA
 * CreditsScene — Pantalla de Créditos Cinematográficos
 */

export class CreditsScene {
  constructor() {
    this.sceneManager = null;
    this.audio = null;
    this.subtitles = null;
    this.storage = null;
  }

  async enter(container) {
    const layer = document.createElement('div');
    layer.className = 'scene-layer';

    layer.innerHTML = `
      <div class="credits-container">
        <div class="credits-scroll">
          <div>
            <div class="credit-role">HISTORIA ORIGINAL & CORTOMETRAJE</div>
            <div class="credit-name">LO QUE QUEDÓ EN LA TIERRA</div>
            <div class="credit-note">Una exploración visual y poética sobre el duelo, la memoria y la partida.</div>
          </div>

          <div>
            <div class="credit-role">EXPERIENCIA INTERACTIVA & PRECUELA EMOCIONAL</div>
            <div class="credit-name">PIEZA TRANSMEDIA COMPLEMENTARIA</div>
            <div class="credit-note">Diseñada para navegador web en estética stop-motion de madera tallada.</div>
          </div>

          <div>
            <div class="credit-role">ARTE Y CONCEPCIÓN VISUAL</div>
            <div class="credit-name">MINIATURAS ARTESANALES & STOP-MOTION</div>
            <div class="credit-note">Inspirado en el modelado cuadro a cuadro, materiales físicos, tela gastada y madera.</div>
          </div>

          <div>
            <div class="credit-role">DISEÑO SONORO PROCEDURAL</div>
            <div class="credit-name">WEB AUDIO API & SÍNTESIS ANALÓGICA</div>
            <div class="credit-note">Paisajes de viento patagónico, estática de radio transistor y motores clásicos.</div>
          </div>

          <div style="margin-top: 20px;">
            <button id="btn-credits-back" class="btn-cinema">VOLVER AL MENÚ</button>
          </div>
        </div>
      </div>
    `;

    container.appendChild(layer);

    this.audio.playAtmosphere('workshop');

    layer.querySelector('#btn-credits-back').addEventListener('click', () => {
      this.audio.playToolClink();
      this.sceneManager.changeScene('MENU', 'black');
    });
  }

  exit() {
    // Cleanup
  }
}
