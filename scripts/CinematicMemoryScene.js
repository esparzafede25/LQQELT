/**
 * LO QUE QUEDÓ EN LA TIERRA
 * CinematicMemoryScene — Arquitectura base modular y extensible para memorias cinematográficas
 * 
 * Principios:
 * - Composición rigurosa por capas: BACKGROUND -> CHARACTERS -> FOREGROUND -> PROPS/STEAM -> UI
 * - Cortes de cámara y de pose instantáneos con estética stop-motion artesanal
 * - Controlador de personajes desacoplado con soporte para poses estáticas y secuencias de animación (frames)
 * - Hooks preparados para futuras expansiones (walk, turn, sit/stand, onAnimationEnd)
 * - Integración nativa con SubtitleManager, AudioManager, SceneManager y StorageManager
 */

export class CinematicCharacter {
  constructor(key, config = {}) {
    this.key = key;
    this.id = config.id || `character-${key}`;
    this.name = config.name || key;
    this.title = config.title || this.name;
    this.poses = config.poses || {};
    this.animations = config.animations || {};
    this.defaultPose = config.defaultPose || Object.keys(this.poses)[0] || 'idle';
    this.classes = [...(config.classes || ['character-layer'])];
    this.facing = config.facing || 'right';

    this.element = null;
    this.imgElement = null;
    this.currentPose = this.defaultPose;
    this.currentAnimation = null;
    this.animInterval = null;
    this.animTimeout = null;
  }

  /**
   * Genera y retorna el elemento DOM del personaje.
   */
  render() {
    const el = document.createElement('div');
    el.id = this.id;
    el.className = this.classes.join(' ');
    el.title = this.title;
    if (this.facing === 'left') el.classList.add('facing-left');

    const initialSrc = this.poses[this.defaultPose] || '';
    el.innerHTML = `<img src="${initialSrc}" alt="${this.title}">`;

    this.element = el;
    this.imgElement = el.querySelector('img');
    return el;
  }

  /**
   * Cambia la pose estática mediante corte directo (sin disoluciones ni fantasmas).
   * @param {string} poseKey - Nombre de la pose definida en config.poses
   * @param {Object} [options]
   * @param {string[]} [options.addClasses] - Clases a agregar (ej. 'sitting', 'mate-pouring-motion')
   * @param {string[]} [options.removeClasses] - Clases a remover
   */
  setPose(poseKey, options = {}) {
    this.stopAnimation();
    if (!this.imgElement || !this.poses[poseKey]) return;

    this.currentPose = poseKey;
    this.imgElement.src = this.poses[poseKey];

    if (options.addClasses) {
      options.addClasses.forEach(c => this.element.classList.add(c));
    }
    if (options.removeClasses) {
      options.removeClasses.forEach(c => this.element.classList.remove(c));
    }
  }

  /**
   * Reproduce una secuencia de frames stop-motion (animación cuadro a cuadro).
   * Preparado para futuras tandas de animación.
   * @param {string} animKey - Clave de animación definida en config.animations
   * @param {Object} [options]
   * @param {number} [options.fps] - Cuadros por segundo (ej. 8, 12)
   * @param {boolean} [options.loop] - Si debe ciclar indefinidamente
   * @param {Function} [options.onComplete] - Callback al completar la animación
   */
  playAnimation(animKey, options = {}) {
    this.stopAnimation();
    const anim = this.animations[animKey];
    if (!anim || !anim.frames || anim.frames.length === 0 || !this.imgElement) return;

    this.currentAnimation = animKey;
    const fps = options.fps || anim.fps || 12;
    const loop = options.loop !== undefined ? options.loop : (anim.loop || false);
    const intervalMs = Math.round(1000 / fps);
    let frameIndex = 0;

    this.imgElement.src = anim.frames[0];

    this.animInterval = setInterval(() => {
      frameIndex++;
      if (frameIndex >= anim.frames.length) {
        if (loop) {
          frameIndex = 0;
          this.imgElement.src = anim.frames[0];
        } else {
          this.stopAnimation();
          if (options.onComplete) options.onComplete();
          return;
        }
      } else {
        this.imgElement.src = anim.frames[frameIndex];
      }
    }, intervalMs);
  }

  /**
   * Detiene cualquier animación de cuadros en curso.
   */
  stopAnimation() {
    if (this.animInterval) {
      clearInterval(this.animInterval);
      this.animInterval = null;
    }
    if (this.animTimeout) {
      clearTimeout(this.animTimeout);
      this.animTimeout = null;
    }
    this.currentAnimation = null;
  }

  /**
   * Hook para animación de caminar (walk cycle).
   * Puede cambiar posición física y reproducir animación si está disponible.
   */
  walk({ duration = 1000, targetX = null, onComplete = null } = {}) {
    if (this.animations['walk']) {
      this.playAnimation('walk', { loop: true });
    }
    if (targetX !== null && this.element) {
      this.element.style.transition = `left ${duration}ms steps(8, end)`;
      this.element.style.left = targetX;
    }
    this.animTimeout = setTimeout(() => {
      this.stopAnimation();
      if (this.poses['idle']) this.setPose('idle');
      if (onComplete) onComplete();
    }, duration);
  }

  /**
   * Hook para animación de girar / orientación.
   */
  turn(direction, { onComplete = null } = {}) {
    this.facing = direction;
    if (this.animations['turn']) {
      this.playAnimation('turn', {
        loop: false,
        onComplete: () => {
          if (direction === 'left') this.element.classList.add('facing-left');
          else this.element.classList.remove('facing-left');
          if (onComplete) onComplete();
        }
      });
    } else {
      if (direction === 'left') this.element.classList.add('facing-left');
      else this.element.classList.remove('facing-left');
      if (onComplete) onComplete();
    }
  }

  /**
   * Hook para animación de sentarse.
   */
  sit({ sittingClass = 'sitting', onComplete = null } = {}) {
    if (this.animations['sit']) {
      this.playAnimation('sit', {
        loop: false,
        onComplete: () => {
          this.element.classList.add(sittingClass);
          if (onComplete) onComplete();
        }
      });
    } else {
      this.element.classList.add(sittingClass);
      if (this.poses['sitting'] || this.poses['esperando']) {
        this.setPose(this.poses['sitting'] ? 'sitting' : 'esperando');
      }
      if (onComplete) onComplete();
    }
  }

  /**
   * Hook para animación de levantarse.
   */
  stand({ sittingClass = 'sitting', onComplete = null } = {}) {
    if (this.animations['stand']) {
      this.playAnimation('stand', {
        loop: false,
        onComplete: () => {
          this.element.classList.remove(sittingClass);
          if (onComplete) onComplete();
        }
      });
    } else {
      this.element.classList.remove(sittingClass);
      if (this.poses['idle']) this.setPose('idle');
      if (onComplete) onComplete();
    }
  }

  addClass(className) {
    if (this.element) this.element.classList.add(className);
  }

  removeClass(className) {
    if (this.element) this.element.classList.remove(className);
  }
}

/**
 * Escena de Memoria Base Cinematográfica
 */
export class CinematicMemoryScene {
  constructor(config = {}) {
    this.config = config;
    this.id = config.id || 'CINEMATIC_MEMORY';

    // Gestores del motor (inyectados por SceneManager)
    this.sceneManager = null;
    this.audio = null;
    this.subtitles = null;
    this.storage = null;

    // Estado de ejecución
    this.step = 0;
    this.currentAngle = 1;
    this.isTransitioning = false;

    // Configuración visual y narrativa
    this.backgrounds = config.backgrounds || {};
    this.foregrounds = config.foregrounds || {};
    this.angleClassPrefix = config.angleClassPrefix || 'mate-angle';
    this.missionIntro = config.missionIntro || null;
    this.atmosphere = config.atmosphere || null;
    this.storageKey = config.storageKey || null;
    this.nextScene = config.nextScene || 'INTRO';
    this.nextSceneTransition = config.nextSceneTransition || 'warm-fade';

    // Personajes
    this.characters = new Map();
    if (config.characters) {
      Object.entries(config.characters).forEach(([key, charConfig]) => {
        this.characters.set(key, new CinematicCharacter(key, charConfig));
      });
    }

    // Elementos DOM de escena
    this.layer = null;
    this.tableFg = null;
    this.actionButtons = new Map();

    this.preloadAssets();
  }

  /**
   * Precarga todos los fondos, foregrounds y poses/animaciones de personajes
   * para garantizar transiciones de cámara y poses instantáneas sin parpadeo.
   */
  preloadAssets() {
    const urls = new Set([
      ...Object.values(this.backgrounds),
      ...Object.values(this.foregrounds)
    ]);

    this.characters.forEach(char => {
      Object.values(char.poses).forEach(url => urls.add(url));
      Object.values(char.animations).forEach(anim => {
        if (anim.frames) anim.frames.forEach(url => urls.add(url));
      });
    });

    urls.forEach(url => {
      if (url) {
        const img = new Image();
        img.src = url;
      }
    });
  }

  /**
   * Monta la escena en el contenedor principal, respetando la jerarquía de 4 capas:
   * 1. BACKGROUND
   * 2. CHARACTERS
   * 3. FOREGROUND (Mesa / Oclusores de profundidad)
   * 4. PROPS / STEAM / UI
   */
  async enter(container) {
    this.step = 0;
    this.currentAngle = 1;

    const layer = document.createElement('div');
    const stageClasses = this.config.stageClasses || 'scene-layer mate-scene-stage grade-memory-warm';
    layer.className = `${stageClasses} ${this.angleClassPrefix}-1`;
    layer.style.backgroundImage = `url('${this.backgrounds.angle1 || Object.values(this.backgrounds)[0] || ''}')`;

    // 1. Contenedor de personajes
    const charactersFragment = document.createDocumentFragment();
    this.characters.forEach(char => {
      charactersFragment.appendChild(char.render());
    });

    // 2. Capa frontal (Foreground / Mesa)
    const fgDiv = document.createElement('div');
    fgDiv.id = 'mate-foreground-table';
    fgDiv.className = this.config.foregroundClass || 'mate-foreground-table';
    const initialFg = this.foregrounds.angle1 || Object.values(this.foregrounds)[0] || '';
    if (initialFg) {
      fgDiv.style.backgroundImage = `url('${initialFg}')`;
    }

    // 3. Props adicionales (ej. vapor, partículas)
    const propsWrapper = document.createElement('div');
    if (this.config.propsHtml) {
      propsWrapper.innerHTML = this.config.propsHtml;
    }

    // 4. Área de interacción / Hotspots diegéticos / Tarjetas de acción
    const actionsWrapper = document.createElement('div');
    actionsWrapper.className = this.config.actionsContainerClass || 'mate-interaction-area';

    if (this.config.actions) {
      this.config.actions.forEach(act => {
        const card = document.createElement('div');
        card.id = act.id;
        card.setAttribute('data-cursor', act.cursor || 'INTERACTUAR');
        card.style.display = 'none';

        if (act.hotspot) {
          card.className = act.className || 'mate-diegetic-hotspot';
          card.innerHTML = `
            <div class="mate-hotspot-pulse"></div>
            ${act.hint || act.label ? `<span class="mate-hotspot-hint">${act.hint || act.label}</span>` : ''}
          `;
          if (act.position) {
            Object.assign(card.style, act.position);
          }
        } else {
          card.className = act.className || 'action-object-card';
          let iconHtml = act.iconSvg || '';
          if (!iconHtml && act.icon) {
            iconHtml = `<img class="action-object-icon" src="${act.icon}" alt="${act.label}">`;
          }
          card.innerHTML = `
            ${iconHtml}
            <span class="action-object-label">${act.label}</span>
          `;
        }

        actionsWrapper.appendChild(card);
        this.actionButtons.set(act.id, card);
      });
    }

    // Ensamblaje ordenado por profundidad
    layer.appendChild(charactersFragment);
    layer.appendChild(fgDiv);
    while (propsWrapper.firstChild) {
      layer.appendChild(propsWrapper.firstChild);
    }
    layer.appendChild(actionsWrapper);
    container.appendChild(layer);

    this.layer = layer;
    this.tableFg = fgDiv;

    // Activar inmersión cinematográfica (ocultar barra superior web)
    document.body.classList.add('memory-cinematic-mode');

    // Atmósfera de audio
    if (this.atmosphere && this.audio) {
      this.audio.playAtmosphere(this.atmosphere);
    }

    // Título introductorio de misión si está configurado
    if (this.missionIntro && this.sceneManager) {
      await this.sceneManager.showMissionIntro(this.missionIntro);
    }

    // Ejecutar lógica inicial específica de la escena derivada
    await this.onSceneStart();
  }

  /**
   * Cambia el ángulo de cámara de forma seca e instantánea (corte cinematográfico),
   * sincronizando el fondo, el foreground y las clases de encuadre.
   * @param {number|string} angleNum - Identificador del ángulo (ej. 1, 2, 3 o '1', 'action', etc.)
   */
  setAngle(angleNum) {
    this.currentAngle = angleNum;

    // Remover clases de ángulos previos
    const prefix = this.angleClassPrefix;
    Array.from(this.layer.classList).forEach(cls => {
      if (cls.startsWith(`${prefix}-`)) {
        this.layer.classList.remove(cls);
      }
    });
    this.layer.classList.add(`${prefix}-${angleNum}`);

    // Aplicar micro-obturador analógico
    this.layer.classList.add('camera-cut');
    if (this.tableFg) this.tableFg.classList.add('camera-cut');

    const bgUrl = this.backgrounds[`angle${angleNum}`] || this.backgrounds[angleNum] || '';
    const fgUrl = this.foregrounds[`angle${angleNum}`] || this.foregrounds[angleNum] || '';

    if (bgUrl) this.layer.style.backgroundImage = `url('${bgUrl}')`;
    if (fgUrl && this.tableFg) this.tableFg.style.backgroundImage = `url('${fgUrl}')`;

    setTimeout(() => {
      if (this.layer) this.layer.classList.remove('camera-cut');
      if (this.tableFg) this.tableFg.classList.remove('camera-cut');
    }, 100);
  }

  /**
   * Obtiene un personaje registrado por su clave.
   * @param {string} charKey
   * @returns {CinematicCharacter|null}
   */
  getCharacter(charKey) {
    return this.characters.get(charKey) || null;
  }

  /**
   * Cambia la pose de un personaje.
   * @param {string} charKey 
   * @param {string} poseKey 
   * @param {Object} [options] 
   */
  setCharacterPose(charKey, poseKey, options = {}) {
    const char = this.getCharacter(charKey);
    if (char) char.setPose(poseKey, options);
  }

  /**
   * Muestra un hotspot o tarjeta de acción.
   */
  showAction(actionId) {
    const card = this.actionButtons.get(actionId);
    if (card) {
      card.style.display = 'flex';
      requestAnimationFrame(() => card.classList.add('active'));
    }
  }

  /**
   * Oculta un hotspot o tarjeta de acción.
   */
  hideAction(actionId) {
    const card = this.actionButtons.get(actionId);
    if (card) {
      card.classList.remove('active');
      card.style.display = 'none';
    }
  }

  /**
   * Oculta todas las interacciones visibles.
   */
  hideAllActions() {
    this.actionButtons.forEach(card => {
      card.classList.remove('active');
      card.style.display = 'none';
    });
  }

  /**
   * Ajusta la posición de un hotspot dinámicamente.
   */
  setHotspotPosition(actionId, position = {}) {
    const el = this.actionButtons.get(actionId);
    if (el) {
      Object.assign(el.style, position);
    }
  }

  /**
   * Establece el portador del mate para continuidad estricta del objeto.
   * @param {'table'|'valentino'|'father'} holder
   */
  setMateHolder(holder) {
    this.mateHolder = holder;
    if (this.layer) {
      this.layer.setAttribute('data-mate-holder', holder);
    }
  }

  /**
   * Marca una acción como completada.
   */
  completeAction(actionId) {
    const card = this.actionButtons.get(actionId);
    if (card) card.classList.add('completed');
  }

  /**
   * Reproduce una secuencia de subtítulos usando SubtitleManager.
   */
  async playDialogue(sequence) {
    if (this.subtitles) {
      await this.subtitles.playSequence(sequence);
    }
  }

  /**
   * Concluye la memoria guardando el progreso y transitando al presente u otra escena.
   */
  async finishMemory({ nextScene = this.nextScene, transition = this.nextSceneTransition } = {}) {
    if (this.storageKey && this.storage) {
      this.storage.set(this.storageKey, true);
    }
    if (this.sceneManager) {
      this.sceneManager.changeScene(nextScene, transition);
    }
  }

  /**
   * Hook de inicialización narrativa para ser implementado por la escena concreta.
   */
  async onSceneStart() {
    // Implementado por subclases
  }

  /**
   * Limpieza de escena al desmontarse.
   */
  exit() {
    document.body.classList.remove('memory-cinematic-mode');
    if (this.audio && this.atmosphere) {
      this.audio.stopAtmosphere();
    }
    this.characters.forEach(char => char.stopAnimation());
  }
}
