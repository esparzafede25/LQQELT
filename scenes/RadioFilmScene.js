import { MateScene as FilmScene } from './MateRouteScene.js';
import {mediaPath,mediaPreload} from '../scripts/MediaAssets.js';

const ROOT = 'assets/radio-cinematic/';
export class RadioFilmScene extends FilmScene {
  async enter(container) {
    this.controller = new AbortController(); this.pending = new Set();
    this.alive = true; this.inspecting = false; this.advanceDialogue = null;
    this.state = 'opening'; this.camera = 50; this.broadcast = false;
    document.body.classList.add('mate-cinematic', 'memory-cinematic-mode');
    this.layer = document.createElement('section'); this.layer.className = 'mate-film radio-film';
    this.layer.setAttribute('aria-label', 'Quedate, que falta poco. Escuchar la radio con papá');
    this.layer.innerHTML = `<div class="mate-frame">
      <img class="mate-shot" src="${mediaPath(ROOT+'00-radio.png')}" alt="Valentino de 11 años y su padre sentados junto a una radio al atardecer">
      <div class="mate-clips"></div><div class="mate-hotspots"></div>
      <div class="mate-title"><span>RECUERDO III</span><h1>Quedate, que falta poco</h1></div>
      <div class="mate-caption" role="status" aria-live="polite"><button type="button" class="mate-speech"><span></span><p></p><small>Clic para seguir</small></button></div>
      <p class="mate-guidance">Encendé la radio · H para encontrarla</p>
      <section class="radio-film-tuner" aria-label="Sintonizar el partido" hidden><label for="film-dial">Sintonizar la radio</label><input id="film-dial" type="range" min="540" max="1420" step="10" value="700" aria-label="Frecuencia de radio"><div><span>540</span><output for="film-dial">700 AM · Estática</output><span>1420</span></div><button type="button" disabled>Escuchar el partido</button></section>
      <div class="mate-media-error" role="alert" hidden><p>No se pudo reproducir este movimiento.</p><button type="button">Volver a intentar</button></div>
    </div>`;
    container.appendChild(this.layer);
    for (const [key,selector] of Object.entries({frame:'.mate-frame',still:'.mate-shot',caption:'.mate-caption',hotspots:'.mate-hotspots',guidance:'.mate-guidance',tuner:'.radio-film-tuner',mediaError:'.mate-media-error'})) this[key]=this.layer.querySelector(selector);
    this.world=this.frame; this.dial=this.tuner.querySelector('input'); this.listen=this.tuner.querySelector('button');
    const video=document.createElement('video'); video.className='mate-clip'; video.src=mediaPath(ROOT+'01-power.mp4'); video.preload=mediaPreload(); video.muted=true; video.playsInline=true; video.setAttribute('aria-hidden','true');
    this.layer.querySelector('.mate-clips').appendChild(video); this.videos={power:video};
    const fit=()=>{const w=Math.min(container.clientWidth,Math.max(160,container.clientHeight-190)*16/9);this.frame.style.width=`${w}px`;this.frame.style.height=`${w*9/16}px`;if(this.advanceDialogue)this.placeDialogue();};
    this.observer=new ResizeObserver(fit);this.observer.observe(container);fit();
    const signal=this.controller.signal;
    this.frame.addEventListener('click',e=>{if(!e.target.closest('.mate-object,.radio-film-tuner,.mate-media-error'))this.advanceDialogue?.();},{signal});
    window.addEventListener('keydown',e=>{if(e.repeat)return;if(this.advanceDialogue&&[' ','Enter'].includes(e.key)&&!e.target.closest('button,input,a')){e.preventDefault();this.advanceDialogue();}else if(this.state==='ready'&&e.key.toLowerCase()==='h')this.frame.classList.toggle('show-hints');},{signal});
    this.dial.addEventListener('input',()=>this.tune(),{signal});
    this.listen.addEventListener('click',()=>this.playBroadcast(),{signal});
    this.mediaError.querySelector('button').addEventListener('click',()=>{if(this.state==='media-error'){this.mediaError.hidden=true;this.state='ready';this.power();}},{signal});
    try{await this.still.decode();}catch{}
  }

  setCamera(value){this.camera=value;}
  placeDialogue(){
    const outside=this.broadcast;
    const [x,y]=outside?[50,103]:(this.caption.dataset.speaker==='father'?[29,8]:[43,8]);
    const width=Math.min(outside?520:310,this.frame.clientWidth*(outside?.94:.48));
    const left=Math.max(8,Math.min(this.frame.clientWidth-width-8,this.frame.clientWidth*x/100-width/2));
    this.caption.style.width=`${width}px`;this.caption.style.left=`${left}px`;
    const stageTop=this.frame.getBoundingClientRect().top-this.layer.getBoundingClientRect().top;
    this.caption.style.top=outside?`${this.frame.clientHeight+10}px`:`${Math.max(8-stageTop,this.frame.clientHeight*y/100-this.caption.offsetHeight-10)}px`;
    this.caption.classList.toggle('radio-caption-outside',outside);
    this.caption.style.setProperty('--speech-tail',`${this.frame.clientWidth*x/100-left}px`);
  }
  async onVisible(){
    this.audio.playAtmosphere('mate_morning');
    if(!await this.wait(1800))return;this.layer.querySelector('.mate-title').classList.add('departed');
    if(!await this.wait(1000))return;this.state='ready';this.frame.dataset.state='ready';
    this.hotspot('radio-power','Encender la radio',72,29,21,30,()=>this.power());
    this.hintTimer=setTimeout(()=>{if(this.state==='ready')this.frame.classList.add('show-hints');},9000);
  }
  async power(){
    if(this.state!=='ready'||!this.alive)return;
    this.state='busy';this.frame.dataset.state='busy';this.hotspots.replaceChildren();clearTimeout(this.hintTimer);this.audio.ensureContext();this.frame.classList.add('action-running');
    if(!await this.playAction({id:'power',follow:[[0,50],[1,50]],cues:[]})){
      if(this.alive){this.state='media-error';this.mediaError.hidden=false;}return;
    }
    this.audio.startRadioStatic();
    if(!await this.say('VALENTINO','Hay mucha estática hoy...'))return;
    this.state='tuning';this.frame.dataset.state='tuning';this.tuner.hidden=false;this.frame.classList.remove('action-running');this.guidance.textContent='Buscá el partido cerca de 950 AM.';this.tune();this.dial.focus();
  }
  tune(){
    if(this.state!=='tuning')return;
    const frequency=Number(this.dial.value),quality=Math.max(0,1-Math.abs(frequency-950)/140);
    this.audio.tuneRadioDial((frequency-540)/880,quality);
    this.listen.disabled=Math.abs(frequency-950)>20;
    this.tuner.querySelector('output').textContent=`${frequency} AM · ${this.listen.disabled?'Estática':'Se escucha el partido'}`;
  }
  async transmission(speaker,text){this.broadcast=true;const ok=await this.say(speaker,text);this.broadcast=false;return ok;}
  async playBroadcast(){
    if(this.state!=='tuning'||this.listen.disabled||!this.alive)return;
    this.state='listening';this.frame.dataset.state='listening';this.tuner.hidden=true;this.guidance.textContent='';
    if(!await this.say('PAPÁ',['Ahí. Dejala ahí.','Quedate, que falta poco para que termine el partido.']))return;
    if(!await this.transmission('RELATOR','...pelota que cruza el círculo central, la pide por la banda, avanza con espacio...'))return;
    this.state='drift';this.frame.dataset.state='drift';this.frame.classList.add('radio-memory-drift');this.audio.stopAtmosphere();this.audio.tuneRadioDial(.6,.2);
    for(const [speaker,text] of [
      ['RELATOR','...se va solo por la línea...'],
      ['INTERFERENCIA','...últimos preparativos...'],
      ['INTERFERENCIA','...los cuatro seleccionados... la misión...'],
      ['RELATOR','...¡todavía puede verlo! ¡Tiene tiempo todavía!...'],
      ['INTERFERENCIA','...el despegue... 06:42...'],
      ['RELATOR','...últimos minutos en el reloj...'],
      ['INTERFERENCIA','...la estela... sector sur...']
    ])if(!await this.transmission(speaker,text))return;
    if(!await this.transmission('RELATOR','Se está yendo... ¡Se vaaaa!'))return;
    this.audio.stopRadioStatic();
    if(!await this.wait(1500))return;
    this.state='complete';this.storage.set('RADIO_COMPLETED',true);this.storage.set('RADIO_RETURN_PENDING',true);this.sceneManager.changeScene('PRESENT_KITCHEN_THIRD','black');
  }
  exit(){super.exit();this.audio.stopRadioStatic();}
}
