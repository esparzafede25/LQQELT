/**
 * LO QUE QUEDA EN LA TIERRA
 * Final / Epílogo — El auto en la ruta al atardecer y fundido a negro
 * "LO QUE QUEDA EN LA TIERRA" -> "CONTINÚA EN EL CORTOMETRAJE"
 */

export class EpilogueScene {
  constructor() {
    this.sceneManager = null;
    this.audio = null;
    this.subtitles = null;
    this.storage = null;
  }

  async enter(container) {
    this.visit = (this.visit || 0) + 1;
    this.timers = new Set();

    const layer = document.createElement('div');
    layer.className = 'scene-layer';
    layer.style.backgroundImage = "url('assets/departure-car-v5/06-empty-road.png')";

    layer.innerHTML = `
      <div id="final-blackout" style="position:absolute; top:0; left:0; width:100%; height:100%; background:#000; opacity:0; transition:opacity 3.5s ease; z-index:650; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; padding:40px;">
        <h1 id="title-part-1" style="font-family:var(--font-title); font-size:42px; letter-spacing:8px; color:var(--paper-cream); margin-bottom:24px; opacity:0; transition:opacity 2s ease;">
          LO QUE QUEDA EN LA TIERRA
        </h1>
        <h2 id="title-part-2" style="font-family:var(--font-ui); font-size:14px; letter-spacing:6px; color:var(--accent-gold); text-transform:uppercase; margin-bottom:48px; opacity:0; transition:opacity 2s ease;">
          CONTINÚA EN EL CORTOMETRAJE
        </h2>
        <div id="final-nav-buttons" style="display:flex; gap:20px; opacity:0; transition:opacity 1.5s ease;">
          <button disabled id="btn-final-menu" class="btn-cinema">MENÚ PRINCIPAL</button>
          <button disabled id="btn-final-archive" class="btn-cinema secondary">EXPLORAR ARCHIVO</button>
          <button disabled id="btn-final-credits" class="btn-cinema secondary">CRÉDITOS</button>
        </div>
      </div>
    `;

    container.appendChild(layer);

    this.layer = layer;
  }

  async onVisible() {
    const visit = this.visit;
    const layer = this.layer;
    // Sonido: motor alejándose, viento del desierto
    this.audio.playAtmosphere('desert_sunset');

    await this.subtitles.playSequence([
      { 
        speaker: 'VALENTINO', 
        text: 'La ruta hacia el sur está despejada... Todavía puedo llegar antes de las 06:42.', 
        thought: true, 
        delay: 800, 
        duration: 4800 
      }
    ]);

    if (this.visit !== visit) return;
    // Pausa contemplativa mientras el auto se pierde en el horizonte
    await new Promise(r => setTimeout(r, 2200));

    if (this.visit !== visit) return;
    this.storage.set('GAME_COMPLETED', true);
    // Fundido a negro total
    const blackout = layer.querySelector('#final-blackout');
    const title1 = layer.querySelector('#title-part-1');
    const title2 = layer.querySelector('#title-part-2');
    const buttons = layer.querySelector('#final-nav-buttons');

    blackout.style.opacity = '1';
    this.audio.stopEngine();

    this.schedule(() => {
      title1.style.opacity = '1';
    }, 2000);

    this.schedule(() => {
      title2.style.opacity = '0.9';
    }, 4500);

    this.schedule(() => {
      buttons.style.opacity = '1';
      buttons.querySelectorAll('button').forEach(button => button.disabled = false);
    }, 7000);

    // Event listeners
    layer.querySelector('#btn-final-menu').addEventListener('click', () => {
      this.audio.playToolClink();
      this.sceneManager.changeScene('MENU', 'black');
    });

    layer.querySelector('#btn-final-archive').addEventListener('click', () => {
      this.audio.playToolClink();
      this.sceneManager.changeScene('ARCHIVE', 'black');
    });

    layer.querySelector('#btn-final-credits').addEventListener('click', () => {
      this.audio.playToolClink();
      this.sceneManager.changeScene('CREDITS', 'black');
    });
  }

  schedule(callback, delay) {
    const visit = this.visit;
    const timer = setTimeout(() => {
      this.timers.delete(timer);
      if (this.visit === visit) callback();
    }, delay);
    this.timers.add(timer);
  }

  exit() {
    this.visit = (this.visit || 0) + 1;
    for (const timer of this.timers || []) clearTimeout(timer);
    this.timers?.clear();
    this.audio.stopAtmosphere();
  }
}
