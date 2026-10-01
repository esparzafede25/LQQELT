/**
 * LO QUE QUEDÓ EN LA TIERRA
 * SceneManager — Coordinador central de escenas, transiciones y ciclos de vida
 */

export class SceneManager {
  constructor({ stage, curtain, audio, subtitles, storage }) {
    this.stage = stage;
    this.curtain = curtain;
    this.audio = audio;
    this.subtitles = subtitles;
    this.storage = storage;

    this.scenes = {};
    this.currentScene = null;
    this.currentSceneName = null;
  }

  register(name, sceneInstance) {
    this.scenes[name] = sceneInstance;
    sceneInstance.sceneManager = this;
    sceneInstance.audio = this.audio;
    sceneInstance.subtitles = this.subtitles;
    sceneInstance.storage = this.storage;
  }

  async changeScene(name, transitionType = 'black', param = null) {
    if (!this.scenes[name]) {
      console.error(`Scene ${name} does not exist`);
      return;
    }

    console.log(`Transitioning from ${this.currentSceneName} to ${name} (${transitionType})`);

    // Iniciar cortina de transición
    await this.fadeTransitionOut(transitionType);

    // Destruir o limpiar escena anterior
    if (this.currentScene && typeof this.currentScene.exit === 'function') {
      this.currentScene.exit();
    }
    this.subtitles.clear();

    // Limpiar contenedor del escenario
    this.stage.innerHTML = '';

    // Inicializar nueva escena
    this.currentSceneName = name;
    this.currentScene = this.scenes[name];

    if (typeof this.currentScene.enter === 'function') {
      await this.currentScene.enter(this.stage, param);
    }

    // Levantar cortina
    await this.fadeTransitionIn();
  }

  fadeTransitionOut(type) {
    return new Promise(resolve => {
      this.curtain.className = '';
      if (type === 'warm-fade') {
        this.curtain.classList.add('active-warm-fade');
      } else if (type === 'white-haze') {
        this.curtain.classList.add('active-white-haze');
      } else {
        this.curtain.classList.add('active-black');
      }

      setTimeout(resolve, 1100);
    });
  }

  fadeTransitionIn() {
    return new Promise(resolve => {
      this.curtain.className = '';
      setTimeout(resolve, 850);
    });
  }

  showMissionIntro({ number, title, subtitle, duration = 3500 }) {
    return new Promise(resolve => {
      const card = document.createElement('div');
      card.className = 'mission-intro-card';
      card.style.cursor = 'pointer';
      card.title = 'Clic para omitir título';
      card.innerHTML = `
        <div class="mission-intro-number">${number}</div>
        <div class="mission-intro-title">${title}</div>
        <div class="mission-intro-subtitle">${subtitle}</div>
      `;
      this.stage.appendChild(card);

      requestAnimationFrame(() => {
        card.classList.add('show');
      });

      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        card.classList.remove('show');
        setTimeout(() => {
          if (card.parentNode) card.parentNode.removeChild(card);
          resolve();
        }, 500);
      };

      card.addEventListener('click', finish);
      setTimeout(finish, duration);
    });
  }
}
