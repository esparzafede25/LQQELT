/**
 * LO QUE QUEDÓ EN LA TIERRA
 * Misión 1 — El Mate ("Una mañana cualquiera")
 * Función emocional: PRESENCIA
 * Estética: Stop-motion cinematográfico analógico
 * 
 * Dirección escénica corregida:
 * - Continuidad estricta de un solo mate (table -> valentino -> father -> valentino)
 * - Interfaz diegética integrada en el escenario (sin botoneras web genéricas)
 * - Coherencia espacial y resolución de conflicto de sillas
 * - Cámaras cinematográficas con función dramática definida
 * - Apertura ágil con opción de salto inmediato
 */

import { CinematicMemoryScene } from '../scripts/CinematicMemoryScene.js';

const MATE_SCENE_CONFIG = {
  id: 'MISSION_MATE',
  atmosphere: 'mate_morning',
  storageKey: 'MATE_COMPLETED',
  nextScene: 'INTRO',
  nextSceneTransition: 'warm-fade',
  missionIntro: {
    number: 'RECUERDO I',
    title: 'UNA MAÑANA CUALQUIERA',
    subtitle: 'Presencia',
    duration: 1800
  },
  angleClassPrefix: 'mate-angle',
  stageClasses: 'scene-layer mate-scene-stage grade-memory-warm',
  foregroundClass: 'mate-foreground-table',
  actionsContainerClass: 'mate-diegetic-actions',

  // Fondos por ángulo de cámara
  backgrounds: {
    angle1: 'escena_mate_assets/backgrounds/bg_angle_01_general.png',
    angle2: 'escena_mate_assets/backgrounds/bg_angle_02_valentino_action.png',
    angle3: 'escena_mate_assets/backgrounds/bg_angle_03_father_reaction.png',
    angleAlt: 'escena_mate_assets/backgrounds/bg_angle_alt_close.png'
  },

  // Capas frontales (Foreground / Mesa) para oclusión física de profundidad
  foregrounds: {
    angle1: 'escena_mate_assets/foregrounds/table_foreground_angle_01.png',
    angle2: 'escena_mate_assets/foregrounds/table_foreground_angle_02.png',
    angle3: 'escena_mate_assets/foregrounds/table_foreground_angle_03.png'
  },

  // Definición de personajes
  characters: {
    valentino: {
      id: 'character-valentino-mate',
      name: 'Valentino (11 años)',
      title: 'Valentino (11 años)',
      classes: ['character-layer', 'mate-character', 'mate-stop-motion-idle'],
      defaultPose: 'idle',
      poses: {
        idle: 'escena_mate_assets/characters/valentino_11/valentino11_idle.png',
        cebando: 'escena_mate_assets/characters/valentino_11/valentino11_cebando_mate.png',
        entregando: 'escena_mate_assets/characters/valentino_11/valentino11_entregando_mate.png',
        esperando: 'escena_mate_assets/characters/valentino_11/valentino11_esperando_recibiendo.png'
      }
    },
    father: {
      id: 'character-father-mate',
      name: 'El Padre',
      title: 'El Padre',
      classes: ['character-layer', 'mate-character', 'mate-stop-motion-idle'],
      defaultPose: 'idle',
      poses: {
        idle: 'escena_mate_assets/characters/father/father_idle.png',
        recibiendo: 'escena_mate_assets/characters/father/father_recibiendo_mate.png',
        tomando: 'escena_mate_assets/characters/father/father_tomando_mate.png',
        devolviendo: 'escena_mate_assets/characters/father/father_devolviendo_mate.png'
      }
    }
  },

  // Vapor caliente con anclaje dinámico por cámara
  propsHtml: `
    <div id="mate-steam-emitter" class="steam-emitter">
      <div class="steam-cloud" style="animation-delay: 0s;"></div>
      <div class="steam-cloud" style="animation-delay: 1.1s;"></div>
      <div class="steam-cloud" style="animation-delay: 2.2s;"></div>
    </div>
  `,

  // Interacciones diegéticas en el escenario (reemplazan botones web genéricos)
  actions: [
    {
      id: 'action-cebar',
      hotspot: true,
      className: 'mate-diegetic-hotspot hotspot-cebar',
      cursor: 'CEBAR MATE',
      hint: 'Cebar mate',
      position: { top: '48%', left: '26%', width: '90px', height: '90px' }
    },
    {
      id: 'action-entregar',
      hotspot: true,
      className: 'mate-diegetic-hotspot hotspot-entregar',
      cursor: 'ALCANZAR A PAPÁ',
      hint: 'Alcanzar a Papá',
      position: { top: '44%', left: '33%', width: '100px', height: '100px' }
    },
    {
      id: 'action-recibir',
      hotspot: true,
      className: 'mate-diegetic-hotspot hotspot-recibir',
      cursor: 'RECIBIR MATE',
      hint: 'Tomar mate',
      position: { top: '42%', right: '37%', width: '100px', height: '100px' }
    }
  ]
};

export class MateScene extends CinematicMemoryScene {
  constructor() {
    super(MATE_SCENE_CONFIG);
    this.currentActionId = null;
  }

  async onSceneStart() {
    // ESTADO 1: Cámara 1 — Plano General de situación
    // Establece el espacio, el clima de la cocina y la relación entre ambos personajes.
    this.setAngle(1);
    this.setMateHolder('table');

    // Valentino de pie junto a la ventana matutina; Padre sentado a la mesa
    this.setCharacterPose('valentino', 'idle');
    this.setCharacterPose('father', 'idle');

    this.setupActions();

    // Diálogo de apertura fluido y natural
    await this.playDialogue([
      { speaker: 'PADRE', text: 'El agua ya está en su punto. Serví vos hoy, Valentino.', delay: 200, duration: 2700 },
      { speaker: 'VALENTINO', text: 'Dale, pa. Ya le acomodo la yerba.', delay: 180, duration: 2200 }
    ]);

    // Habilitar interacción 1: clic sobre la pava/mesa
    this.currentActionId = 'action-cebar';
    this.showAction('action-cebar');
  }

  setupActions() {
    const btnCebar = this.actionButtons.get('action-cebar');
    const btnEntregar = this.actionButtons.get('action-entregar');
    const btnRecibir = this.actionButtons.get('action-recibir');

    const valChar = this.getCharacter('valentino');
    const fatChar = this.getCharacter('father');

    // Clic directo sobre personajes para mayor naturalidad
    if (valChar && valChar.element) {
      valChar.element.style.pointerEvents = 'auto';
      valChar.element.addEventListener('click', () => {
        if (this.currentActionId === 'action-cebar') {
          btnCebar?.click();
        } else if (this.currentActionId === 'action-entregar') {
          btnEntregar?.click();
        }
      });
    }

    if (fatChar && fatChar.element) {
      fatChar.element.style.pointerEvents = 'auto';
      fatChar.element.addEventListener('click', () => {
        if (this.currentActionId === 'action-entregar') {
          btnEntregar?.click();
        } else if (this.currentActionId === 'action-recibir') {
          btnRecibir?.click();
        }
      });
    }

    // ACCIÓN 1: Valentino ceba mate
    btnCebar.addEventListener('click', async () => {
      if (this.step !== 0 || this.isTransitioning) return;
      this.isTransitioning = true;
      this.step = 1;
      this.currentActionId = null;

      this.completeAction('action-cebar');
      this.audio.playToolClink();
      this.hideAction('action-cebar');

      // Corte a Cámara 2 (Plano de acción de Valentino)
      this.setAngle(2);

      // CONTINUIDAD: el mate ahora está en manos de Valentino
      this.setMateHolder('valentino');

      // Valentino de pie cebando con balanceo sutil
      this.setCharacterPose('valentino', 'cebando', { addClasses: ['mate-pouring-motion'] });

      // El Padre permanece sentado en reposo sin mate, observando
      this.setCharacterPose('father', 'idle');

      // Sonido de agua caliente vertiéndose
      this.audio.playPourWater();

      await new Promise(r => setTimeout(r, 1100));

      await this.playDialogue([
        { speaker: 'PADRE', text: 'No te apures. Dejá que hinche primero al costado.', delay: 250, duration: 2800 },
        { speaker: 'VALENTINO', text: 'El agua está en su punto justo, pa. Bien espumoso.', delay: 220, duration: 2400 }
      ]);

      await new Promise(r => setTimeout(r, 400));

      // Habilitar interacción 2: clic sobre el mate en manos de Valentino
      this.currentActionId = 'action-entregar';
      this.showAction('action-entregar');
      this.isTransitioning = false;
    });

    // ACCIÓN 2: Valentino entrega mate al Padre
    btnEntregar.addEventListener('click', async () => {
      if (this.step !== 1 || this.isTransitioning) return;
      this.isTransitioning = true;
      this.step = 2;
      this.currentActionId = null;

      this.completeAction('action-entregar');
      this.audio.playToolClink();
      this.hideAction('action-entregar');

      // Valentino extiende el mate hacia su padre
      this.setCharacterPose('valentino', 'entregando', { removeClasses: ['mate-pouring-motion'] });

      await this.playDialogue([
        { speaker: 'VALENTINO', text: 'Tomá, pa. El primero va para vos.', delay: 200, duration: 2300 }
      ]);

      await new Promise(r => setTimeout(r, 450));

      // Corte a Cámara 3 (Plano de reacción del Padre)
      this.setAngle(3);

      // CONTINUIDAD CRÍTICA DE UN SOLO MATE:
      // Valentino ya entregó el mate: sus manos quedan libres en pose idle (sin mate)
      this.setCharacterPose('valentino', 'idle');

      // El Padre extiende su mano vacía para recibirlo
      this.setCharacterPose('father', 'recibiendo');

      await this.playDialogue([
        { speaker: 'PADRE', text: 'A ver qué tal te salió...', delay: 200, duration: 2100 }
      ]);

      await new Promise(r => setTimeout(r, 400));

      // El Padre sostiene el mate y toma (UN SOLO MATE: portador Padre)
      this.setMateHolder('father');
      this.setCharacterPose('father', 'tomando');
      this.audio.playMateSip();

      await new Promise(r => setTimeout(r, 2300));

      // El Padre devuelve el mate extendiéndolo hacia Valentino
      this.setCharacterPose('father', 'devolviendo');

      await this.playDialogue([
        { speaker: 'PADRE', text: 'Está bueno. Bien amargo. Tomá vos ahora.', delay: 300, duration: 2900 }
      ]);

      // Habilitar interacción 3: clic sobre el mate extendido en la mano del Padre
      this.currentActionId = 'action-recibir';
      this.showAction('action-recibir');
      this.isTransitioning = false;
    });

    // ACCIÓN 3: Valentino recibe el mate de vuelta y se sienta
    btnRecibir.addEventListener('click', async () => {
      if (this.step !== 2 || this.isTransitioning) return;
      this.isTransitioning = true;
      this.step = 3;
      this.currentActionId = null;

      this.completeAction('action-recibir');
      this.audio.playToolClink();
      this.hideAction('action-recibir');

      // Retorno a Cámara 1 (Plano General de cierre y atmósfera)
      this.setAngle(1);

      // CONTINUIDAD DEL MATE:
      // El Padre vuelve a idle (manos en rodillas, sin mate)
      this.setCharacterPose('father', 'idle');

      // Valentino recibe el mate y se sienta en la silla izquierda
      this.setMateHolder('valentino');
      this.setCharacterPose('valentino', 'esperando', { addClasses: ['sitting'] });

      // Sonido íntimo de sorbo de Valentino
      this.audio.playMateSip();

      await new Promise(r => setTimeout(r, 1000));

      // Pensamiento íntimo poético
      await this.playDialogue([
        { 
          speaker: 'VALENTINO', 
          text: 'Ese mate era de él. Toda la mañana se pasaba con el termo bajo el brazo... nunca lo vi apurado.', 
          thought: true, 
          delay: 500, 
          duration: 5800 
        }
      ]);

      await new Promise(r => setTimeout(r, 1200));

      // Concluir memoria y retornar con transición cálida
      await this.finishMemory();
    });
  }
}

