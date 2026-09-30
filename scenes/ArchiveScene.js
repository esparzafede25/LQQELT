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

        <!-- SECCIÓN 1: PERSONAJES -->
        <div id="tab-characters" class="archive-section active">
          <div class="character-grid">
            <div class="character-card">
              <div class="character-card-img-wrapper">
                <img src="assets/characters/valentino/valentino_front.jpg" alt="Valentino Frontal">
              </div>
              <div class="character-card-body">
                <div class="character-card-name">VALENTINO</div>
                <div class="character-card-role">VISTA FRONTAL • MADERA TALLADA</div>
                <div class="character-card-desc">
                  Rostro alargado y anguloso tallado en madera. Cejas gruesas, ojos marrones grandes de mirada melancólica. Campera de jean gastada, suéter gris tejido y zapatillas oscuras.
                </div>
              </div>
            </div>

            <div class="character-card">
              <div class="character-card-img-wrapper">
                <img src="assets/characters/valentino/valentino_profile.jpg" alt="Valentino Perfil">
              </div>
              <div class="character-card-body">
                <div class="character-card-name">VALENTINO</div>
                <div class="character-card-role">PERFIL • SILUETA CON MOCHILA</div>
                <div class="character-card-desc">
                  Cuerpo delgado, postura contenida por el peso del duelo. Cabello negro desordenado modelado artesanalmente. Manos articuladas de madera.
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
            <h3>ARQUITECTURA MODULAR DE ASSETS</h3>
            <p>
              Todos los gráficos, sonidos y elementos visuales están desacoplados de la lógica de código. Para personalizar o actualizar los recursos en el futuro, basta con reemplazar los archivos correspondientes manteniendo los nombres:
            </p>
            <div class="code-box">
assets/backgrounds/workshop_present.jpg        -> Taller en el presente
assets/backgrounds/memory_mate.jpg             -> Recuerdo 1 (Cocina cálida y mate)
assets/backgrounds/memory_car.jpg              -> Recuerdo 2 (Garaje y motor)
assets/backgrounds/memory_radio.jpg            -> Recuerdo 3 (Radio analógica)
assets/backgrounds/sequence_envelope_map.jpg   -> Cajón con sobre y mapa
assets/backgrounds/departure_backpack_seat.jpg -> Inserto de la mochila en el asiento
assets/backgrounds/departure_highway_sunset.jpg-> Auto en la ruta al atardecer
assets/characters/valentino/                   -> Modelos y fotos de Valentino
assets/characters/father/                      -> Modelos y fotos del Padre
assets/props/                                  -> Objetos individuales (mate, llave 10, etc.)
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
