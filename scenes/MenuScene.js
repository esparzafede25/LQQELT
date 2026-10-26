/**
 * LO QUE QUEDA EN LA TIERRA
 * MenuScene — Pantalla inicial sobria y cinematográfica
 */

import {mediaPath} from '../scripts/MediaAssets.js';
export class MenuScene {
  constructor() {
    this.sceneManager = null;
    this.audio = null;
    this.subtitles = null;
    this.storage = null;
  }

  async enter(container) {
    const hasSave = this.storage.hasSavedGame();
    const isSoundOn = !this.storage.get('soundEnabled') ? false : true;

    const layer = document.createElement('div');
    layer.className = 'scene-layer';
    layer.style.backgroundImage = `url('${mediaPath('assets/backgrounds/title_menu_bg.jpg')}')`;

    layer.innerHTML = `
      <div class="menu-container">
        <div class="menu-header">
          <h1 class="menu-title">LO QUE QUEDA EN LA TIERRA</h1>
          <div class="menu-tagline">EXPERIENCIA INTERACTIVA • PRECUELA EMOCIONAL</div>
        </div>

        <div class="menu-options">
          <button id="btn-start" class="menu-btn">INICIAR</button>
          <button id="btn-continue" class="menu-btn ${hasSave ? '' : 'disabled'}">CONTINUAR</button>
          <button id="btn-archive" class="menu-btn">ARCHIVO</button>
          <button id="btn-credits" class="menu-btn">CRÉDITOS</button>
          <button id="btn-sound-toggle" class="menu-btn">SONIDO: ${isSoundOn ? 'ACTIVADO' : 'SILENCIADO'}</button>
        </div>

        <div class="menu-footer">
          UNA PIEZA TRANSMEDIA COMPLEMENTARIA • ESTÉTICA STOP MOTION
        </div>
      </div>
    `;

    container.appendChild(layer);

    // Reproducir atmósfera sonora
    this.audio.playAtmosphere('workshop');

    // Event listeners
    const btnStart = layer.querySelector('#btn-start');
    const btnContinue = layer.querySelector('#btn-continue');
    const btnArchive = layer.querySelector('#btn-archive');
    const btnCredits = layer.querySelector('#btn-credits');
    const btnSound = layer.querySelector('#btn-sound-toggle');

    btnStart.addEventListener('click', () => {
      this.audio.ensureContext();
      this.audio.playToolClink();
      this.storage.resetProgress();
      this.sceneManager.changeScene('OPENING', 'black');
    });

    if (hasSave) {
      btnContinue.addEventListener('click', () => {
        this.audio.ensureContext();
        this.audio.playToolClink();
        const nextScene = this.storage.getLatestUnlockedScene();
        this.sceneManager.changeScene(nextScene, 'black');
      });
    }

    btnArchive.addEventListener('click', () => {
      this.audio.ensureContext();
      this.audio.playToolClink();
      this.sceneManager.changeScene('ARCHIVE', 'black');
    });

    btnCredits.addEventListener('click', () => {
      this.audio.ensureContext();
      this.audio.playToolClink();
      this.sceneManager.changeScene('CREDITS', 'black');
    });

    btnSound.addEventListener('click', () => {
      const active = this.audio.toggleMute();
      btnSound.textContent = `SONIDO: ${active ? 'ACTIVADO' : 'SILENCIADO'}`;
    });
  }

  exit() {
    // Menu cleanup
  }
}

