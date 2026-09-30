/**
 * LO QUE QUEDÓ EN LA TIERRA
 * IntroScene — Taller familiar recientemente vaciado (Sensación de ausencia)
 * Punto de partida e hilo conductor entre el presente y los recuerdos
 */

export class IntroScene {
  constructor() {
    this.sceneManager = null;
    this.audio = null;
    this.subtitles = null;
    this.storage = null;
  }

  async enter(container, mode = null) {
    const mateDone = this.storage.get('MATE_COMPLETED');
    const carDone = this.storage.get('CAR_COMPLETED');
    const radioDone = this.storage.get('RADIO_COMPLETED');

    const layer = document.createElement('div');
    layer.className = 'scene-layer grade-present';
    layer.style.backgroundImage = "url('assets/backgrounds/workshop_present.jpg')";

    layer.innerHTML = `
      <!-- Hotspot 1: El Mate de madera en la mesa -->
      <div id="hotspot-mate" class="hotspot" style="top: 62%; right: 22%; width: 140px; height: 160px;" data-cursor="TOMAR" data-label="El mate de papá"></div>

      <!-- Hotspot 2: Las herramientas en el banco -->
      <div id="hotspot-tools" class="hotspot ${mateDone ? '' : 'hotspot-disabled'}" style="top: 65%; left: 8%; width: 280px; height: 160px;" data-cursor="MIRAR" data-label="Herramientas de taller"></div>

      <!-- Hotspot 3: La radio en el estante -->
      <div id="hotspot-radio" class="hotspot ${carDone ? '' : 'hotspot-disabled'}" style="top: 20%; left: 40%; width: 120px; height: 100px;" data-cursor="ESCUCHAR" data-label="Radio a transistores"></div>

      <!-- Hotspot 4: El escritorio y cajón de papá -->
      <div id="hotspot-desk" class="hotspot ${radioDone ? '' : 'hotspot-disabled'}" style="top: 55%; left: 42%; width: 160px; height: 140px;" data-cursor="ABRIR" data-label="Escritorio de papá"></div>
    `;

    container.appendChild(layer);

    this.audio.playAtmosphere('workshop');

    // Primera vez en el taller: reflexión introductoria de Valentino
    if (!this.storage.get('INTRO_COMPLETED')) {
      this.storage.set('INTRO_COMPLETED', true);
      setTimeout(() => {
        this.subtitles.show({
          speaker: 'VALENTINO',
          text: 'El taller está en silencio... Todavía huele a aserrín y grasa de motor.',
          thought: true,
          duration: 4500
        });
      }, 1000);
    } else if (radioDone) {
      setTimeout(() => {
        this.subtitles.show({
          speaker: 'VALENTINO',
          text: 'El cajón del escritorio... Hay algo adentro que nunca me animé a tocar.',
          thought: true,
          duration: 4000
        });
      }, 800);
    } else if (carDone) {
      setTimeout(() => {
        this.subtitles.show({
          speaker: 'VALENTINO',
          text: 'La radio de la repisa... Todavía me parece escuchar su voz diciéndome que no cambie el dial.',
          thought: true,
          duration: 4000
        });
      }, 800);
    } else if (mateDone) {
      setTimeout(() => {
        this.subtitles.show({
          speaker: 'VALENTINO',
          text: 'Las llaves fijas en el banco... "Antes de tocar cualquier cosa, escuchalo".',
          thought: true,
          duration: 4000
        });
      }, 800);
    }

    // Configurar interacciones
    this.setupInteractions(layer, mateDone, carDone, radioDone);
  }

  setupInteractions(layer, mateDone, carDone, radioDone) {
    const spotMate = layer.querySelector('#hotspot-mate');
    const spotTools = layer.querySelector('#hotspot-tools');
    const spotRadio = layer.querySelector('#hotspot-radio');
    const spotDesk = layer.querySelector('#hotspot-desk');

    // 1. MATE
    spotMate.addEventListener('click', () => {
      this.audio.playToolClink();
      if (!mateDone) {
        this.subtitles.show({
          speaker: 'VALENTINO',
          text: 'El mate viejo de madera... Todavía tiene la marca de sus dedos en la virola.',
          thought: true,
          duration: 2500,
          onComplete: () => {
            // Transición sensorial al Recuerdo 1
            this.sceneManager.changeScene('MISSION_MATE', 'warm-fade');
          }
        });
      } else {
        this.subtitles.show({
          speaker: 'VALENTINO',
          text: 'Ya preparé el mate. Me lo voy a llevar conmigo.',
          thought: true,
          duration: 2800
        });
      }
    });

    // 2. HERRAMIENTAS / AUTO
    spotTools.addEventListener('click', () => {
      this.audio.playToolClink();
      if (mateDone && !carDone) {
        this.subtitles.show({
          speaker: 'VALENTINO',
          text: 'La llave diez... Tantas tardes metiendo mano en el motor del auto.',
          thought: true,
          duration: 2500,
          onComplete: () => {
            this.sceneManager.changeScene('MISSION_CAR', 'warm-fade');
          }
        });
      } else if (!mateDone) {
        this.subtitles.show({
          speaker: 'VALENTINO',
          text: 'Primero debería juntar las cosas de la mesa.',
          thought: true,
          duration: 2500
        });
      } else {
        this.subtitles.show({
          speaker: 'VALENTINO',
          text: 'La caja de herramientas está lista por si la aguja de temperatura vuelve a subir.',
          thought: true,
          duration: 2800
        });
      }
    });

    // 3. RADIO
    spotRadio.addEventListener('click', () => {
      this.audio.playToolClink();
      if (carDone && !radioDone) {
        this.subtitles.show({
          speaker: 'VALENTINO',
          text: 'La radio analógica... Las tardes de fútbol y transmisiones lejanas.',
          thought: true,
          duration: 2500,
          onComplete: () => {
            this.sceneManager.changeScene('MISSION_RADIO', 'warm-fade');
          }
        });
      } else if (!carDone) {
        this.subtitles.show({
          speaker: 'VALENTINO',
          text: 'Todavía no... Hay cosas que ordenar primero.',
          thought: true,
          duration: 2500
        });
      } else {
        this.subtitles.show({
          speaker: 'VALENTINO',
          text: '06:42... Esa hora me sigue dando vueltas en la cabeza.',
          thought: true,
          duration: 2800
        });
      }
    });

    // 4. ESCRITORIO
    spotDesk.addEventListener('click', () => {
      this.audio.playToolClink();
      if (radioDone) {
        this.sceneManager.changeScene('ENVELOPE', 'black');
      } else {
        this.subtitles.show({
          speaker: 'VALENTINO',
          text: 'Está cerrado... Necesito concentrarme en lo que tengo que llevarme.',
          thought: true,
          duration: 2500
        });
      }
    });
  }

  exit() {
    // Cleanup
  }
}
