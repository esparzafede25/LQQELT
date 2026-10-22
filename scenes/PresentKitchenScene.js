import { PresentScene } from './PresentScene.js';

/** Independent third-person kitchen entry while the bathroom is in production. */
export class PresentKitchenScene extends PresentScene {
  constructor() { super('kitchen'); }

  async enter(container) {
    this.chairVisit = (this.chairVisit || 0) + 1;
    this.chairState = 'idle';
    await super.enter(container);
  }

  async onVisible() {
    super.onVisible();
    if(!this.alive||!this.storage.get('RADIO_RETURN_PENDING'))return;
    const visit=this.chairVisit;
    this.lock();
    const completed=await this.subtitles.playSequence([{
      speaker:'VALENTINO',
      text:'Si salgo ahora por la ruta, todavía puedo llegar a verlo partir.',
      thought:true,delay:400,duration:6500
    }]);
    if(!completed||!this.alive||this.chairVisit!==visit)return;
    this.storage.set('RADIO_RETURN_PENDING',false);
    this.storage.set('LETTER_SEQUENCE_UNLOCKED',true);
    this.arm();
  }

  async look() {
    if (!this.alive || this.busy) return;
    await this.bowChair();
  }

  async chairPoster(file, visit) {
    const image = new Image();
    image.src = `assets/present-chair-v1/${file}`;
    try { await image.decode(); }
    catch { return false; }
    if (!this.alive || this.chairVisit !== visit) return false;
    this.still.src = image.src;
    this.video.classList.remove('visible');
    return true;
  }

  async bowChair() {
    if (!this.alive || ['bowing','returning'].includes(this.chairState)) return;
    const visit = this.chairVisit;
    this.lock(); this.chairState = 'bowing';
    this.layer.classList.add('contemplating');
    const ok = await this.play('01-bow.mp4', 'chair', 'assets/present-chair-v1/');
    if (!this.alive || this.chairVisit !== visit) return;
    if (!ok || !await this.chairPoster('01-bow-end.png', visit)) {
      if (!this.alive || this.chairVisit !== visit) return;
      this.chairState = 'bow-error'; this.fail(() => this.bowChair()); return;
    }
    this.chairState = 'held'; this.busy = false;
    this.still.alt = 'Valentino baja la cabeza y cierra los ojos, triste, frente a la silla vacía de papá.';
    this.spot('look-away', 'Apartar la mirada', 36, 86, 28, 12, () => this.returnFromChair());
    this.hotspots.firstElementChild.classList.add('present-look-away');
    this.hotspots.firstElementChild.focus({preventScroll:true});
  }

  async returnFromChair() {
    if (!this.alive || !['held','return-error'].includes(this.chairState)) return;
    const visit = this.chairVisit;
    this.lock(); this.chairState = 'returning';
    const ok = await this.play('02-return.mp4', 'chair', 'assets/present-chair-v1/');
    if (!this.alive || this.chairVisit !== visit) return;
    if (!ok || !await this.chairPoster('02-return-end.png', visit)) {
      if (!this.alive || this.chairVisit !== visit) return;
      this.chairState = 'return-error'; this.fail(() => this.returnFromChair()); return;
    }
    this.chairState = 'idle';
    this.still.alt = 'Valentino vuelve a mirar la silla vacía de papá.';
    this.layer.classList.remove('contemplating');
    this.arm();
  }

  exit() {
    this.chairVisit = (this.chairVisit || 0) + 1;
    super.exit();
  }

  async showRoom() {
    if (!this.alive) return;
    this.lock();
    this.room = 'kitchen';
    this.frame.dataset.room = 'kitchen';
    this.still.src = 'assets/present-third-person/kitchen-base-v1.png';
    this.still.alt = 'Valentino, sin mochila, sentado frente a la silla vacía de papá. El mate, la radio y las herramientas siguen en la cocina.';
    try { await this.still.decode(); }
    catch { if (this.alive) this.fail(() => this.showRoom()); return; }
    if (!this.alive) return;
    this.storage.set('PRESENT_ROOM', 'kitchen');
    this.storage.set('PRESENT_RETURN_SCENE', 'PRESENT_KITCHEN_THIRD');
    this.storage.set('PRESENT_MEMORY_RETURN', false);
    this.place.textContent = 'Cocina';
    this.arm();
  }

  arm() {
    if (!this.alive) return;
    this.busy = false;
    this.help.disabled = false;
    this.hotspots.replaceChildren();
    const mate = this.storage.get('MATE_COMPLETED');
    const car = this.storage.get('CAR_COMPLETED');
    const radio = this.storage.get('RADIO_COMPLETED');
    // Completion unlocks the next memory, but the object remains a replay trigger.
    this.spot('mate', 'El mate', 46, 43, 6, 13, () => this.remember('MISSION_MATE'));
    this.spot('chair', 'La silla de papá', 71, 44, 14, 12, () => this.look());
    this.spot('plant', 'Mirar la planta', 0, 25, 13, 29, () => this.observe('Me olvidé de regarla.'));
    this.spot('tools', 'Las herramientas', 90, 33, 10, 14, () => !mate ? this.observe('Primero, un mate.') : car ? this.observe('La diez sigue ahí.') : this.remember('MISSION_CAR'));
    this.spot('radio', 'Escuchar la radio', 81, 35, 8, 11, () => !car ? this.observe('Ahora no.') : radio ? this.observe('Sólo estática.') : this.remember('MISSION_RADIO'));
    if (radio) this.spot('drawer', 'Abrir el cajón', 91, 49, 8, 7, () => this.remember('ENVELOPE', 'black'));
  }
}
