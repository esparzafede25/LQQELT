import {PresentScore} from './PresentScore.js';

export function tapFrame(index,time=0,playing=false){
  return {on:index===3||(index===4&&(!playing||time<3.7))||(index===2&&playing&&time>=2.4),hand:index===3&&playing&&time>=1&&time<2.25};
}

/** Continuous tap recording; only its texture follows the hand's actual video time. */
export class TapSound {
  constructor(audio,onState=()=>{}){
    this.audio=audio;this.onState=onState;audio?.ensureContext?.();this.ctx=audio?.ctx;
    if(!this.ctx||!audio.masterGain)return;
    this.filter=this.ctx.createBiquadFilter();this.filter.type='lowpass';this.filter.frequency.setValueAtTime(6000,this.ctx.currentTime);this.filter.connect(audio.masterGain);
    const bus={ctx:this.ctx,masterGain:this.filter,ensureContext:()=>audio.ensureContext()};
    this.track=new PresentScore(bus,state=>{if(!this.disposed)this.onState(state);},{src:'assets/tap-sound-v1/agua-continua.mp3',level:.18,duckLevel:.18});
    this.track.ctx=this.ctx;this.ctx.addEventListener?.('statechange',this.track.contextChanged);
  }
  prepare(){return this.track?.load().catch(()=>{});}
  sync(index,time=0,playing=false){
    if(this.disposed||!this.track)return;
    const {on,hand}=tapFrame(index,time,playing);
    if(on){
      if(this.hand!==hand){
        this.hand=hand;this.track.level=hand?.21:.18;
        this.filter.frequency.setTargetAtTime(hand?2500:6000,this.ctx.currentTime,.12);
        if(this.track.source)this.track.ramp(this.track.level,.18);
      }
      if(!this.track.desired)this.track.play();
    }else this.stop();
  }
  stop(){if(this.track?.desired)this.track.pause(.15);}
  dispose(){this.disposed=true;this.track?.pause(0);this.ctx?.removeEventListener?.('statechange',this.track?.contextChanged);this.filter?.disconnect();}
}
