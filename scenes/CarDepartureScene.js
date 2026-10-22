import {CAR_CLIPS as clips,CAR_POSTERS as posters,resolveCarStage} from '../scripts/CarDepartureProgress.js';
import {bindVideoSoundCues} from '../scripts/VideoSoundCues.js';

const carSounds = [
  [[.20,'playPackingContact','leather'],[.82,'playPackingContact','soft']],
  [[.30,'playPackingContact','cloth']],
  [[.15,'playPackingContact','door']], [], []
];

export class CarDepartureScene {
  async enter(container) {
    this.visit=(this.visit||0)+1;this.alive=true;this.playId=0;this.soundedPlayId=null;
    this.index=resolveCarStage(this.storage.get('DEPARTURE_CAR_STAGE'),this.storage.get('DEPARTURE_AT_CAR'));
    this.storage.set('DEPARTURE_STARTED',true);
    this.storage.set('DEPARTURE_CAR_STARTED',true);
    this.controller=new AbortController();
    document.body.classList.add('present-walking');
    this.layer=document.createElement('section');
    this.layer.className='present-walk car-departure';
    this.layer.setAttribute('aria-label','La partida');
    this.layer.innerHTML='<div class="present-walk-frame"><img alt=""><video muted playsinline preload="auto"></video></div><footer><p role="status"></p><button class="car-action" type="button"></button></footer>';
    container.appendChild(this.layer);
    this.still=this.layer.querySelector('img');this.video=this.layer.querySelector('video');
    this.videoAudio=this.audio.bindCarVideo?.(this.video);
    this.status=this.layer.querySelector('[role="status"]');this.action=this.layer.querySelector('.car-action');
    this.soundCues=bindVideoSoundCues(this.video,this.audio,()=>carSounds[this.index]||[],()=>this.alive&&this.phase==='playing');
    const frame=this.layer.querySelector('.present-walk-frame');
    const fit=()=>{
      const width=Math.min(Math.max(160,container.clientWidth-32),Math.max(100,container.clientHeight-120)*1024/576);
      frame.style.width=width+'px';frame.style.height=width*576/1024+'px';
    };
    this.observer=new ResizeObserver(fit);this.observer.observe(container);fit();
    const options={signal:this.controller.signal};
    this.action.addEventListener('click',()=>this.play(),options);
    this.video.addEventListener('playing',()=>{if(this.alive&&this.phase==='playing'){this.video.classList.add('visible');this.startPlaybackAudio();}},options);
    this.video.addEventListener('ended',()=>this.finishAction(),options);
    this.video.addEventListener('error',()=>{if(this.alive&&this.phase==='playing'&&this.video.error)this.fail();},options);
    await this.show();
  }
  onVisible() {
    if(this.alive&&this.phase==='ready'&&this.index!==3)return this.play();
  }
  async show() {
    const visit=this.visit;
    this.phase='loading';this.action.disabled=true;
    const image=new Image();image.src=posters[this.index];
    try{await image.decode();}catch{if(this.alive&&this.visit===visit)this.fail('image');return;}
    if(!this.alive||this.visit!==visit)return;
    this.still.src=image.src;
    this.still.alt=['Valentino junto al auto, con la mochila preparada.','La mochila está dentro del auto.','Valentino se sienta al volante.','Valentino dentro del auto, con la puerta cerrada.','Valentino respira antes de partir.','El auto se aleja por la ruta.'][this.index];
    this.video.pause();this.video.classList.remove('visible');
    const road=this.index>=4;
    this.layer.classList.toggle('departure-on-road',road);
    this.layer.style.setProperty('--present-brightness',road?'1':'.94');
    this.layer.style.setProperty('--present-saturation',road?'1':'.84');
    if(this.index<clips.length){this.video.src=clips[this.index];this.video.load();}
    this.action.textContent=this.index===3?'Arrancar el motor':'Continuar';
    this.status.textContent=['La mochila viene conmigo.','Todavía pesa.','Es hora de irse.','Ya está todo.','Un último respiro.','El camino sigue.'][this.index];
    this.phase='ready';this.action.disabled=false;
  }
  fail(kind='video') {
    clearTimeout(this.timer);this.video.pause();this.phase=kind+'-error';
    if(this.index>=3)this.audio.stopEngine?.();
    if(this.index===4)this.audio.stopAtmosphere();
    this.status.textContent='No se pudo cargar la acción. Tu avance está guardado.';
    this.action.textContent='Volver a intentar';this.action.disabled=false;
  }
  async play() {
    if(!this.alive||!['ready','image-error','video-error'].includes(this.phase))return;
    if(this.phase==='image-error'){await this.show();if(this.phase==='ready')return this.play();return;}
    if(this.index===5){this.phase='leaving';this.action.disabled=true;this.sceneManager.changeScene('EPILOGUE','black');return;}
    const visit=this.visit,token=++this.playId;
    this.phase='playing';this.action.disabled=true;
    this.status.textContent=['Guardar la mochila…','Subir al auto…','Ya estoy adentro…','Valentino respira.','El auto se aleja.'][this.index];
    if(this.video.error)this.video.load();
    this.soundCues?.reset();
    if(this.videoAudio&&this.index>=3){this.audio.ensureContext();this.video.muted=false;}
    this.video.currentTime=0;
    this.timer=setTimeout(()=>{if(this.alive&&this.visit===visit&&this.playId===token&&this.phase==='playing')this.fail();},45000);
    try{await this.video.play();}catch{if(this.alive&&this.visit===visit&&this.playId===token&&this.phase==='playing')this.fail();}
  }
  startPlaybackAudio() {
    if(!this.alive||this.phase!=='playing'||this.soundedPlayId===this.playId)return;
    this.soundedPlayId=this.playId;
    if(this.index===3&&!this.videoAudio)this.audio.playCarStart();
    if(this.index===4){this.audio.playAtmosphere('desert_sunset');if(!this.videoAudio)this.audio.startEngineIdle?.();}
  }
  async finishAction() {
    if(!this.alive||this.phase!=='playing'||!this.video.ended)return;
    const visit=this.visit;
    clearTimeout(this.timer);this.playId++;this.phase='loading';
    this.index++;
    this.storage.set('DEPARTURE_CAR_STAGE',this.index);
    if(this.index>=3){
      this.storage.set('DEPARTURE_AT_CAR',true);
      this.storage.set('DEPARTURE_FILM_STEP',6);
    }
    await this.show();
    if(this.alive&&this.visit===visit&&this.phase==='ready'&&this.index!==3)return this.play();
  }
  exit() {
    this.alive=false;this.visit=(this.visit||0)+1;this.playId++;
    clearTimeout(this.timer);this.controller?.abort();this.observer?.disconnect();
    this.soundCues?.dispose();this.audio.stopEngine?.();
    this.videoAudio?.dispose();this.videoAudio=null;
    this.video?.pause();this.video?.removeAttribute('src');this.video?.load();
    this.audio.stopAtmosphere();
    document.body.classList.remove('present-walking');
  }
}

