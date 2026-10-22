import {PACKING_ACTIONS as actions,PACKING_POSTERS as posters,resolvePackingFilmStep,packedAfterStep} from '../scripts/PackingFilmProgress.js';
import {applyPackingTone} from '../scripts/PresentVisualTone.js';
import {bindVideoSoundCues} from '../scripts/VideoSoundCues.js';

const packingSounds = [
  [[.19,'playPackingContact','cloth'],[.60,'playPackingContact','ceramic']],
  [[.19,'playPackingContact','cloth'],[.60,'playPackingContact','metal']],
  [[.22,'playPackingContact','paper'],[.60,'playPackingContact','paper']],
  [[.22,'playPackingContact','paper'],[.60,'playPackingContact','paper']],
  [[.16,'playPackingContact','leather'],[.34,'playPackingContact','leather'],[.44,'playPackingContact','cloth']]
];

export class PackingFilmScene {
  async enter(container) {
    this.visit=(this.visit||0)+1; this.alive=true;
    this.storage.set('DEPARTURE_STARTED',true);
    this.index=resolvePackingFilmStep(this.storage.get('DEPARTURE_FILM_STEP'),this.storage.get('DEPARTURE_PACKED_ITEMS'),this.storage.get('DEPARTURE_AT_CAR'));
    this.controller=new AbortController();
    document.body.classList.add('present-walking');
    this.layer=document.createElement('section');
    this.layer.className='present-walk packing-film';
    this.layer.setAttribute('aria-label','Preparar la mochila');
    this.layer.innerHTML=`<div class="present-walk-frame"><img alt=""><video muted playsinline preload="auto"></video><button class="present-walk-spot" type="button"></button></div>
      <footer><p role="status"></p><button class="packing-action" type="button"></button></footer>`;
    container.appendChild(this.layer);
    this.still=this.layer.querySelector('img');this.video=this.layer.querySelector('video');
    this.spot=this.layer.querySelector('.present-walk-spot');this.action=this.layer.querySelector('.packing-action');
    this.status=this.layer.querySelector('[role="status"]');
    this.soundCues=bindVideoSoundCues(this.video,this.audio,()=>packingSounds[this.index]||[],()=>this.alive&&this.phase==='playing');
    const frame=this.layer.querySelector('.present-walk-frame');
    const fit=()=>{
      const width=Math.min(Math.max(160,container.clientWidth-32),Math.max(100,container.clientHeight-120)*1024/576);
      frame.style.width=`${width}px`;frame.style.height=`${width*576/1024}px`;
    };
    this.observer=new ResizeObserver(fit);this.observer.observe(container);fit();
    const options={signal:this.controller.signal};
    this.spot.addEventListener('click',()=>this.play(),options);
    this.action.addEventListener('click',()=>this.play(),options);
    this.video.addEventListener('playing',()=>{if(this.alive&&this.phase==='playing')this.video.classList.add('visible');},options);
    this.video.addEventListener('playing',()=>this.followTone(),options);
    this.video.addEventListener('ended',()=>this.finishAction(),options);
    this.video.addEventListener('error',()=>{if(this.alive&&this.phase==='playing')this.fail();},options);
    await this.show();
  }
  onVisible(){
    this.audio?.playAtmosphere?.('house_present');
    if(this.index===6||this.storage.get('DEPARTURE_CAR_STARTED')){
      this.phase='leaving';this.lock(true);this.layer.style.visibility='hidden';
      this.sceneManager.changeScene('CAR_DEPARTURE','black');
    }
  }
  lock(value){this.spot.disabled=this.action.disabled=value;}
  followTone(){
    cancelAnimationFrame(this.toneFrame);
    if(!this.alive||this.phase!=='playing')return;
    applyPackingTone(this.layer,this.index,this.video.duration>0?this.video.currentTime/this.video.duration:0);
    this.toneFrame=requestAnimationFrame(()=>this.followTone());
  }
  async show(){
    const visit=this.visit;
    this.phase='loading';this.lock(true);
    const image=new Image();image.src=posters[this.index];
    try{await image.decode();}catch{if(this.alive&&this.visit===visit)this.fail('image');return;}
    if(!this.alive||this.visit!==visit)return;
    this.still.src=image.src;
    cancelAnimationFrame(this.toneFrame);applyPackingTone(this.layer,this.index);
    this.video.pause();this.video.classList.remove('visible');
    const atCar=this.index===6,holdingBag=this.index===5;
    this.still.alt=atCar?'La mochila preparada en el asiento del acompañante.':`Valentino prepara la mochila en la cocina. ${Math.min(this.index,4)} de 4 objetos guardados.`;
    this.spot.hidden=atCar||holdingBag;
    if(!atCar&&!holdingBag){
      const [,label,file,area]=actions[this.index];
      this.video.src=file;this.video.load();
      this.spot.setAttribute('aria-label',label);
      ['left','top','width','height'].forEach((key,n)=>this.spot.style[key]=`${area[n]}%`);
    }
    this.action.textContent=atCar?'Arrancar el motor':holdingBag?'Ir al auto':actions[this.index][1];
    this.status.textContent=atCar?'Ya está todo.':holdingBag?'Es hora de salir.':this.index===4?'La mochila está lista.':`${this.index} de 4 · ${['El mate viene conmigo.','La diez. Por si hace falta.','El camino está marcado.','El sobre, a mano.'][this.index]}`;
    this.phase='ready';this.lock(false);
  }
  fail(kind='video'){
    cancelAnimationFrame(this.toneFrame);
    clearTimeout(this.timer);this.video.pause();this.phase=`${kind}-error`;this.lock(false);
    this.status.textContent='No se pudo cargar la acción. Tu avance está guardado.';
    this.action.textContent='Volver a intentar';
  }
  async play(){
    if(!this.alive||!['ready','video-error','image-error'].includes(this.phase))return;
    if(this.phase==='image-error'){await this.show();return;}
    if(this.index===5||this.index===6){
      this.phase='leaving';this.lock(true);this.storage.set('DEPARTURE_CAR_STARTED',true);
      this.sceneManager.changeScene('CAR_DEPARTURE','black');return;
    }
    const visit=this.visit;this.phase='playing';this.lock(true);
    this.status.textContent=`${actions[this.index][1]}…`;
    if(this.video.error)this.video.load();
    this.soundCues?.reset();
    this.video.currentTime=0;
    applyPackingTone(this.layer,this.index);
    this.timer=setTimeout(()=>{if(this.alive&&this.visit===visit&&this.phase==='playing')this.fail();},45000);
    try{await this.video.play();}catch{if(this.alive&&this.visit===visit&&this.phase==='playing')this.fail();}
  }
  finishAction(){
    if(!this.alive||this.phase!=='playing')return;
    clearTimeout(this.timer);this.phase='loading';
    this.index++;
    this.storage.set('DEPARTURE_FILM_STEP',this.index);
    this.storage.set('DEPARTURE_PACKED_ITEMS',packedAfterStep(this.index,this.storage.get('DEPARTURE_PACKED_ITEMS')));
    return this.show();
  }
  exit(){
    this.audio?.stopAtmosphere?.();
    this.visit=(this.visit||0)+1;this.alive=false;clearTimeout(this.timer);
    cancelAnimationFrame(this.toneFrame);
    this.soundCues?.dispose();
    this.controller.abort();this.observer.disconnect();
    this.video.pause();this.video.removeAttribute('src');this.video.load();
    document.body.classList.remove('present-walking');
  }
}
