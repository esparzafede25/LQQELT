export const PRESENT_MUSIC = 'assets/present-music-v1/ofelias-dream-original.mp3';
export const PRESENT_MUSIC_SCENES = new Set(['INTRO','PRESENT_PREVIEW','PRESENT_THIRD_PREVIEW','PRESENT_BATHROOM','PRESENT_KITCHEN_THIRD','ENVELOPE','DEPARTURE','CAR_DEPARTURE','EPILOGUE']);

/** Continuous present-day score: rooms share playback, memories pause it. */
export class PresentScore {
  constructor(audio, onState = () => {}, {src=PRESENT_MUSIC,level=.18,duckLevel=.09} = {}) {
    this.audio=audio;this.onState=onState;this.offset=0;this.version=0;this.desired=false;this.ducked=false;
    this.src=src;this.level=level;this.duckLevel=duckLevel;
    this.contextChanged=()=>{if(this.source)this.onState(this.ctx.state==='running'?'playing':'blocked');};
  }
  ramp(target,seconds) {
    if(!this.gain||!this.ctx)return;
    const now=this.ctx.currentTime,param=this.gain.gain;
    param.cancelScheduledValues(now);param.setValueAtTime(param.value,now);param.linearRampToValueAtTime(target,now+seconds);
  }
  async load() {
    if(this.buffer)return this.buffer;
    if(this.loading)return this.loading;
    this.loading=(async()=>{
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
      try {
        const response=await fetch(this.src,{signal:controller.signal});
        if(!response.ok)throw Error('Music unavailable');
        const buffer=await this.ctx.decodeAudioData(await response.arrayBuffer());
        if(controller.signal.aborted)throw Error('Music timeout');
        this.buffer=buffer;return buffer;
      } finally {clearTimeout(timer);}
    })();
    try {return await this.loading;} finally {this.loading=null;}
  }
  async play() {
    this.desired=true;const version=++this.version;clearTimeout(this.stopTimer);
    try {
      this.audio.ensureContext();
      if(this.ctx!==this.audio.ctx){this.ctx?.removeEventListener?.('statechange',this.contextChanged);this.ctx=this.audio.ctx;this.ctx?.addEventListener?.('statechange',this.contextChanged);}
      if(!this.ctx||!this.audio.masterGain)throw Error('Audio unavailable');
      if(this.source){this.ramp(this.ducked ? this.duckLevel : this.level,1.1);this.onState(this.ctx.state==='running'?'playing':'blocked');return;}
      if(!this.gain){this.gain=this.ctx.createGain();this.gain.gain.setValueAtTime(0,this.ctx.currentTime);this.gain.connect(this.audio.masterGain);}
      const buffer=await this.load();
      if(!this.desired||version!==this.version||this.source)return;
      const source=this.ctx.createBufferSource();this.source=source;source.buffer=buffer;source.loop=true;
      this.offset%=buffer.duration;this.startedAt=this.ctx.currentTime;source.connect(this.gain);source.start(0,this.offset);
      this.ramp(this.ducked ? this.duckLevel : this.level,1.7);this.onState(this.ctx.state==='running'?'playing':'blocked');
    } catch {
      if(version===this.version&&this.desired){this.stopSource();this.onState('error');}
    }
  }
  duck(active) {
    this.ducked=Boolean(active);
    if(this.desired&&this.source)this.ramp(this.ducked ? this.duckLevel : this.level,this.ducked ? .3 : 1.2);
  }
  stopSource() {
    if(!this.source)return;
    if(this.buffer)this.offset=(this.offset+Math.max(0,this.ctx.currentTime-this.startedAt))%this.buffer.duration;
    try{this.source.stop();}catch{}
    try{this.source.disconnect();}catch{}
    this.source=null;
    this.ramp(0,0);
  }
  pause(seconds=.8) {
    this.desired=false;const version=++this.version;clearTimeout(this.stopTimer);
    if(!this.source){this.onState('paused');return;}
    this.ramp(0,seconds);this.onState('fading');
    this.stopTimer=setTimeout(()=>{
      if(this.desired||version!==this.version)return;
      this.stopSource();this.onState('paused');
    },seconds*1000+30);
  }
}
