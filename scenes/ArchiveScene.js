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
          <button id="btn-archive-back" class="btn-cinema secondary" type="button">VOLVER AL MENÚ</button>
        </div>

        <div class="archive-nav-tabs">
          <button class="archive-tab active" data-target="tab-characters">CANON DE PERSONAJES</button>
          <button class="archive-tab" data-target="tab-concept">ARTE CONCEPTUAL</button>
          <button class="archive-tab" data-target="tab-transmedia">METÁFORA DEL DUELO</button>
          <button class="archive-tab" data-target="tab-assets">OBJETOS Y ESCENARIOS</button>
        </div>

        <!-- SECCIÓN 1: PERSONAJES Y EDADES -->
        <div id="tab-characters" class="archive-section active">
          <div class="character-grid">
            <div class="character-card">
              <div class="character-card-img-wrapper">
                <img src="assets/archive-v1/valentino-11.png" alt="Valentino 11 años">
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
                <img src="assets/archive-v1/valentino-adolescente.png" alt="Valentino Adolescente">
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
                <img src="assets/archive-v1/valentino-18.png" alt="Valentino 18 años">
              </div>
              <div class="character-card-body">
                <div class="character-card-name">VALENTINO (18 AÑOS)</div>
                <div class="character-card-role">RECUERDO II: EL AUTO / TALLER • JUVENTUD</div>
                <div class="character-card-desc">
                  Joven de rostro alargado, campera gastada y suéter tejido. Aprende a escuchar el motor antes de intervenir y domina el uso de la llave 10 mm.
                </div>
              </div>
            </div>

            <div class="character-card">
              <div class="character-card-img-wrapper">
                <img src="assets/archive-v1/valentino-adulto.png" alt="Valentino Adulto">
              </div>
              <div class="character-card-body">
                <div class="character-card-name">VALENTINO (ADULTO)</div>
                <div class="character-card-role">PRESENTE • LA CASA Y EL VIAJE</div>
                <div class="character-card-desc">
                  Rostro alargado y anguloso tallado en madera. Campera de jean gastada y mirada melancólica. La mochila aparece al preparar la partida. El protagonista del cortometraje ante la pérdida definitiva.
                </div>
              </div>
            </div>

            <div class="character-card">
              <div class="character-card-img-wrapper">
                <img src="assets/archive-v1/padre.png" alt="El Padre">
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
            <img src="assets/archive-v1/gestos-y-materiales.png" alt="Hoja Maestra de Arte Conceptual">
            <div class="art-caption">
              Estudios originales de gestos, expresiones y materiales para la escena del mate.
            </div>
          </div>
          <div class="archive-art-grid"><figure class="art-showcase"><img src="assets/archive-v1/edades-y-proporciones.png" alt="Edades y proporciones"><figcaption class="art-caption"><h3>Edades y proporciones</h3><p>Referencias de infancia y adolescencia, expresiones, perfiles y tejidos.</p></figcaption></figure><figure class="art-showcase"><img src="assets/archive-v1/concepto-madera.jpg" alt="Madera tallada"><figcaption class="art-caption"><h3>Madera tallada</h3><p>La lámina de estilo del proyecto: rostros, vestuario y paisaje patagónico.</p></figcaption></figure></div>
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

        <div id="tab-assets" class="archive-section">
          <p class="archive-intro">Los objetos guardan huellas de papá. Los espacios cambian con la memoria y con la ausencia. Abrí las imágenes para mirar sus detalles.</p>
          <div class="archive-art-grid">
            <figure class="art-showcase"><img src="assets/archive-v1/mapa.png" alt="El mapa de ruta"><figcaption class="art-caption"><h3>El mapa de ruta</h3><p>El papel plegado, las anotaciones y la cruz en el kilómetro 142 convierten un lugar en un destino.</p></figcaption></figure>
            <figure class="art-showcase"><img src="assets/archive-v1/sobre.png" alt="El sobre"><figcaption class="art-caption"><h3>El sobre</h3><p>Una letra conocida y el nombre de Valentino. Su contenido permanece fuera de campo.</p></figcaption></figure>
            <figure class="art-showcase"><img src="assets/mate-route/00-kitchen.png" alt="La cocina del recuerdo"><figcaption class="art-caption"><h3>La cocina del recuerdo</h3><p>Luz cálida, la mesa compartida y el tiempo de un mate.</p></figcaption></figure>
            <figure class="art-showcase"><img src="assets/car-cinematic/00-workshop.png" alt="El taller con papá"><figcaption class="art-caption"><h3>El taller con papá</h3><p>Las herramientas y el automóvil sostienen un aprendizaje entre generaciones.</p></figcaption></figure>
            <figure class="art-showcase"><img src="assets/archive-v1/dormitorio.png" alt="La casa en el presente"><figcaption class="art-caption"><h3>La casa en el presente</h3><p>La misma materia, bajo una luz fría. Los espacios se sienten más pesados y silenciosos.</p></figcaption></figure>
            <figure class="art-showcase"><img src="assets/present-bath-adult-v4/00-closed.png" alt="El baño y el vacío"><figcaption class="art-caption"><h3>El baño y el vacío</h3><p>Un decorado aislado en negro infinito: intimidad, angustia y una mirada que cuesta sostener.</p></figcaption></figure>
          </div>
        </div>
      </div>
    `;

    container.appendChild(layer);
    this.controller = new AbortController();
    const options = {signal:this.controller.signal};
    this.lightbox = document.createElement('dialog');
    this.lightbox.className = 'archive-lightbox';
    this.lightbox.setAttribute('aria-labelledby','archive-lightbox-caption');
    this.lightbox.innerHTML = '<button type="button" class="btn-cinema archive-lightbox-close">CERRAR IMAGEN</button><figure><img alt=""><figcaption id="archive-lightbox-caption"></figcaption></figure>';
    layer.querySelectorAll('img').forEach(image => {
      image.loading = 'lazy'; image.decoding = 'async';
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'archive-zoom-button';
      button.setAttribute('aria-label','Ampliar '+image.alt);
      image.replaceWith(button); button.appendChild(image);
      button.addEventListener('click',()=>{
        const enlarged = this.lightbox.querySelector('img'); enlarged.src = image.src; enlarged.alt = image.alt;
        this.lightbox.querySelector('figcaption').textContent = image.alt;
        this.lightbox.showModal();
      },options);
    });
    layer.appendChild(this.lightbox);
    this.lightbox.querySelector('button').addEventListener('click',()=>this.lightbox.close(),options);
    this.lightbox.addEventListener('click',event=>{if(event.target===this.lightbox)this.lightbox.close();},options);

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
    if(this.lightbox?.open)this.lightbox.close();
    this.controller?.abort();
  }
}
