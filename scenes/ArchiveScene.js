/**
 * LO QUE QUEDÓ EN LA TIERRA
 * ArchiveScene — Sección de Archivo, Museo Virtual y Making Of
 * Canon visual de personajes, arte conceptual y notas de producción transmedia
 */

export class ArchiveScene {
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
      <div class="archive-container">
        <div class="archive-header">
          <div class="archive-tagline">MUSEO VIRTUAL & PROCESO ARTÍSTICO</div>
          <h1 class="archive-title">ARCHIVO DE PRODUCCIÓN</h1>
          <button id="btn-archive-back" class="btn-cinema secondary" style="position: absolute; right: 0; top: 0;">VOLVER AL MENÚ</button>
        </div>

        <div class="archive-nav-tabs">
          <button class="archive-tab active" data-target="tab-characters">CANON DE PERSONAJES</button>
          <button class="archive-tab" data-target="tab-concept">ARTE CONCEPTUAL</button>
          <button class="archive-tab" data-target="tab-transmedia">METÁFORA DEL DUELO</button>
          <button class="archive-tab" data-target="tab-assets">GUÍA DE ASSETS</button>
        </div>

        <!-- SECCIÓN 1: PERSONAJES Y EDADES -->
        <div id="tab-characters" class="archive-section active">
          <div class="character-grid">
            <div class="character-card">
              <div class="character-card-img-wrapper">
                <img src="assets/characters/valentino/valentino_11_placeholder.svg" alt="Valentino 11 años">
              </div>
              <div class="character-card-body">
                <div class="character-card-name">VALENTINO (11 AÑOS)</div>
                <div class="character-card-role">RECUERDO III: LA RADIO • INFANCIA</div>
                <div class="character-card-desc">
                  Proporciones infantiles, mirada curiosa y atenta. Suéter tejido holgado. Escucha el fútbol junto a su padre mientras las primeras ondas de radio distorsionan la realidad.
                </div>
              </div>
            </div>

            <div class="character-card">
              <div class="character-card-img-wrapper">
                <img src="assets/characters/valentino/valentino_teen_placeholder.svg" alt="Valentino Adolescente">
              </div>
              <div class="character-card-body">
                <div class="character-card-name">VALENTINO (ADOLESCENTE)</div>
                <div class="character-card-role">RECUERDO I: EL MATE • ADOLESCENCIA</div>
                <div class="character-card-desc">
                  Contextura espigada en crecimiento, brazos largos y postura tranquila. Aprende de su padre el ritual silencioso y cálido de cebar y compartir el mate de madera.
                </div>
              </div>
            </div>

            <div class="character-card">
              <div class="character-card-img-wrapper">
                <img src="assets/characters/valentino/valentino_18_placeholder.svg" alt="Valentino 18 años">
              </div>
              <div class="character-card-body">
                <div class="character-card-name">VALENTINO (18 AÑOS)</div>
                <div class="character-card-role">RECUERDO II: EL AUTO / TALLER • JUVENTUD</div>
                <div class="character-card-desc">
                  Joven adulto con mangas arremangadas y marcas de grasa en las manos. Aprende a escuchar el motor antes de intervenir y domina el uso de la llave 10 mm.
                </div>
              </div>
            </div>

            <div class="character-card">
              <div class="character-card-img-wrapper">
                <img src="assets/characters/valentino/valentino_present_placeholder.svg" alt="Valentino Adulto">
              </div>
              <div class="character-card-body">
                <div class="character-card-name">VALENTINO (ADULTO)</div>
                <div class="character-card-role">PRESENTE • EL TALLER / VIAJE</div>
                <div class="character-card-desc">
                  Rostro alargado y anguloso tallado en madera. Campera de jean gastada, mochila al hombro y mirada melancólica. El protagonista del cortometraje ante la pérdida definitiva.
                </div>
              </div>
            </div>

            <div class="character-card">
              <div class="character-card-img-wrapper">
                <img src="assets/characters/father/father_front.jpg" alt="El Padre">
              </div>
              <div class="character-card-body">
                <div class="character-card-name">EL PADRE</div>
                <div class="character-card-role">FIGURA PATERNA • PRESENCIA Y HERENCIA</div>
                <div class="character-card-desc">
                  Presencia sólida, serena y cotidiana. Campera de trabajo ocre gastada, manos firmes con vetas visibles de madera y marcas de herramientas. El padre vive en los gestos transmitidos.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SECCIÓN 2: ARTE CONCEPTUAL -->
        <div id="tab-concept" class="archive-section">
          <div class="art-showcase">
            <img src="assets/references/concept_madera_tallada.jpg" alt="Hoja Maestra de Arte Conceptual">
            <div class="art-caption">
              Lámina "03 • MADERA TALLADA" — Guía de estilo visual stop motion, estudio anatómico de marionetas, y composición panorámica de la ruta patagónica con el árbol solitario y el auto.
            </div>
          </div>
          <div class="document-box">
            <h3>FILOSOFÍA VISUAL: STOP MOTION ARTESANAL</h3>
            <p>
              La estética rehúye del renderizado 3D digital pulido o el estilo cartoon infantil. Cada elemento evoca materiales táctiles reales: madera tallada a mano, fibras textiles de lana y gabardina, cartón texturado, metal envejecido con pátina y partículas de polvo flotando en la luz crepuscular.
            </p>
          </div>
        </div>

        <!-- SECCIÓN 3: METÁFORA DEL DUELO -->
        <div id="tab-transmedia" class="archive-section">
          <div class="document-box">
            <h3>EL JUEGO COMO PRECUELA EMOCIONAL</h3>
            <p>
              En el cortometraje, Valentino viaja aparentemente para presenciar la partida de su padre en una misión tripulada a Marte. Sin embargo, la ciencia ficción es el velo psicológico de la negación: Valentino es incapaz de asumir la muerte definitiva y transforma la pérdida en una "despedida pendiente".
            </p>
            <p>
              Esta experiencia interactiva construye la base de ese autoengaño: el mate compartido (Presencia), la reparación del automóvil (Herencia), y la interferencia en la radio donde el fútbol se confunde con reportes lejanos de lanzamiento (Distorsión).
            </p>
          </div>
        </div>

        <!-- SECCIÓN 4: GUÍA DE ASSETS -->
        <div id="tab-assets" class="archive-section">
          <div class="document-box">
            <h3>ARQUITECTURA MODULAR DE PERSONAJES Y FONDOS</h3>
            <p>
              Los personajes y los fondos funcionan como capas visuales independientes. Cada edad de Valentino y el padre disponen de sus propios placeholders dedicados para facilitar la futura sustitución por renders o fotos de maquetas finales:
            </p>
            <div class="code-box">
assets/characters/valentino/valentino_11_placeholder.svg      -> Valentino 11 años (Radio)
assets/characters/valentino/valentino_teen_placeholder.svg    -> Valentino Adolescente (Mate)
assets/characters/valentino/valentino_18_placeholder.svg      -> Valentino 18 años (Auto)
assets/characters/valentino/valentino_present_placeholder.svg -> Valentino Adulto (Presente)
assets/characters/father/father_placeholder.svg               -> El Padre (Capa separada)

assets/backgrounds/workshop_present.jpg        -> Escenario: Taller en el presente
assets/backgrounds/memory_mate.jpg             -> Escenario: Cocina cálida
assets/backgrounds/memory_car.jpg              -> Escenario: Garaje y automóvil
assets/backgrounds/memory_radio.jpg            -> Escenario: Rincón de la radio
assets/backgrounds/sequence_envelope_map.jpg   -> Escenario: Cajón con sobre y mapa
assets/backgrounds/departure_backpack_seat.jpg -> Inserto: Mochila en el asiento
assets/backgrounds/departure_highway_sunset.jpg-> Escenario: Ruta al atardecer
            </div>
            <p>
              El proyecto utiliza rutas relativas, lo que permite su publicación inmediata en GitHub Pages o Vercel sin necesidad de configuración adicional ni compiladores externos.
            </p>
          </div>
        </div>
      </div>
    `;

    container.appendChild(layer);

    // Event listeners de pestañas
    const tabs = layer.querySelectorAll('.archive-tab');
    const sections = layer.querySelectorAll('.archive-section');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));

        tab.classList.add('active');
        const targetId = tab.getAttribute('data-target');
        const targetSection = layer.querySelector(`#${targetId}`);
        if (targetSection) targetSection.classList.add('active');

        this.audio.playToolClink();
      });
    });

    layer.querySelector('#btn-archive-back').addEventListener('click', () => {
      this.audio.playToolClink();
      this.sceneManager.changeScene('MENU', 'black');
    });
  }

  exit() {
    // Cleanup
  }
}
