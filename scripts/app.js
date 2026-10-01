/**
 * LO QUE QUEDÓ EN LA TIERRA
 * App — Punto de entrada de la aplicación, inicialización y efectos globales
 */

import { StorageManager } from './StorageManager.js';
import { AudioManager } from './AudioManager.js';
import { SubtitleManager } from './SubtitleManager.js';
import { SceneManager } from '../scenes/SceneManager.js';

import { MenuScene } from '../scenes/MenuScene.js';
import { IntroScene } from '../scenes/IntroScene.js';
import { MateScene } from '../scenes/MateScene.js';
import { CarScene } from '../scenes/CarScene.js';
import { RadioScene } from '../scenes/RadioScene.js';
import { EnvelopeScene } from '../scenes/EnvelopeScene.js';
import { DepartureScene } from '../scenes/DepartureScene.js';
import { EpilogueScene } from '../scenes/EpilogueScene.js';
import { ArchiveScene } from '../scenes/ArchiveScene.js';
import { CreditsScene } from '../scenes/CreditsScene.js';

class App {
  constructor() {
    this.storage = new StorageManager();
    this.audio = new AudioManager(this.storage);
    
    this.stage = document.getElementById('screen-stage');
    this.curtain = document.getElementById('transition-curtain');
    this.subtitlesContainer = document.getElementById('subtitles-container');
    
    this.subtitles = new SubtitleManager(this.subtitlesContainer, this.audio);
    
    this.sceneManager = new SceneManager({
      stage: this.stage,
      curtain: this.curtain,
      audio: this.audio,
      subtitles: this.subtitles,
      storage: this.storage
    });

    this.cursor = document.getElementById('custom-cursor');
    this.cursorLabel = this.cursor.querySelector('.cursor-label');
    this.dustCanvas = document.getElementById('dust-canvas');
  }

  init() {
    console.log('Iniciando Lo que quedó en la Tierra...');

    // Registrar todas las escenas
    this.sceneManager.register('MENU', new MenuScene());
    this.sceneManager.register('INTRO', new IntroScene());
    this.sceneManager.register('MISSION_MATE', new MateScene());
    this.sceneManager.register('MISSION_CAR', new CarScene());
    this.sceneManager.register('MISSION_RADIO', new RadioScene());
    this.sceneManager.register('ENVELOPE', new EnvelopeScene());
    this.sceneManager.register('DEPARTURE', new DepartureScene());
    this.sceneManager.register('EPILOGUE', new EpilogueScene());
    this.sceneManager.register('ARCHIVE', new ArchiveScene());
    this.sceneManager.register('CREDITS', new CreditsScene());

    // Configurar componentes globales
    this.setupCursor();
    this.setupDustParticles();
    this.setupTopBar();
    this.setupParallax();

    // Comenzar en la escena solicitada o en el Menú Principal
    const urlParams = new URLSearchParams(window.location.search);
    const initialScene = urlParams.get('scene') || 'MENU';
    this.sceneManager.changeScene(initialScene, 'black');
  }

  // --------------------------------------------------------------------------
  // CURSOR PERSONALIZADO Y CONTEXTUAL
  // --------------------------------------------------------------------------
  setupCursor() {
    document.addEventListener('mousemove', (e) => {
      this.cursor.style.opacity = '1';
      this.cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;

      // Detectar elementos con etiqueta de interacción
      const target = document.elementFromPoint(e.clientX, e.clientY);
      const interactiveEl = target ? target.closest('[data-cursor], button, .hotspot, .action-object-card, .mate-diegetic-hotspot, .packing-item') : null;

      if (interactiveEl) {
        this.cursor.classList.add('active');
        const customText = interactiveEl.getAttribute('data-cursor');
        if (customText) {
          this.cursor.classList.add('has-label');
          this.cursorLabel.textContent = customText;
        } else {
          this.cursor.classList.remove('has-label');
        }
      } else {
        this.cursor.classList.remove('active');
        this.cursor.classList.remove('has-label');
      }
    });

    document.addEventListener('mouseleave', () => {
      this.cursor.style.opacity = '0';
    });
  }

  // --------------------------------------------------------------------------
  // PARTÍCULAS DE POLVO FLOTANTES (Atmósfera artesanal en contraluz)
  // --------------------------------------------------------------------------
  setupDustParticles() {
    if (!this.dustCanvas) return;
    const ctx = this.dustCanvas.getContext('2d');
    let width = this.dustCanvas.width = window.innerWidth;
    let height = this.dustCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = this.dustCanvas.width = window.innerWidth;
      height = this.dustCanvas.height = window.innerHeight;
    });

    const particles = [];
    const count = 35;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.6 + 0.6,
        alpha: Math.random() * 0.45 + 0.15,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.2 - 0.15 // Tendencia suave ascendente
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 220, 185, ${p.alpha})`;
        ctx.fill();
      }

      requestAnimationFrame(animate);
    };

    animate();
  }

  // --------------------------------------------------------------------------
  // PARALLAX SUTIL EN BASE AL RATÓN
  // --------------------------------------------------------------------------
  setupParallax() {
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    window.addEventListener('mousemove', (e) => {
      const normX = (e.clientX / window.innerWidth) - 0.5;
      const normY = (e.clientY / window.innerHeight) - 0.5;
      targetX = normX * 12; // Desplazamiento sutil en px
      targetY = normY * 8;
    });

    const loop = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      const layer = this.stage.querySelector('.scene-layer');
      if (layer) {
        layer.style.transform = `scale(1.025) translate(${currentX}px, ${currentY}px)`;
      }

      requestAnimationFrame(loop);
    };

    loop();
  }

  // --------------------------------------------------------------------------
  // BARRA SUPERIOR DISCRETA
  // --------------------------------------------------------------------------
  setupTopBar() {
    const btnAudio = document.getElementById('btn-top-audio');
    const btnMenu = document.getElementById('btn-top-menu');
    const btnArchive = document.getElementById('btn-top-archive');

    const updateAudioIcon = () => {
      const isMuted = this.audio.isMuted;
      btnAudio.innerHTML = isMuted 
        ? `<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`
        : `<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
    };

    updateAudioIcon();

    btnAudio.addEventListener('click', () => {
      this.audio.toggleMute();
      updateAudioIcon();
    });

    btnMenu.addEventListener('click', () => {
      this.audio.playToolClink();
      this.sceneManager.changeScene('MENU', 'black');
    });

    btnArchive.addEventListener('click', () => {
      this.audio.playToolClink();
      this.sceneManager.changeScene('ARCHIVE', 'black');
    });

    // Tecla Escape para invocar o alternar el menú superior en modo inmersivo
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const topBar = document.getElementById('top-bar');
        if (topBar) topBar.classList.toggle('force-reveal');
      }
    });

    // Activar audio context al primer clic del usuario en la pantalla
    document.addEventListener('click', () => {
      this.audio.ensureContext();
    }, { once: true });
  }
}

// Inicializar la aplicación cuando el DOM esté listo
window.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
  window.__APP__ = app;
});
