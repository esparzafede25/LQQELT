import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DreamSoundtrack,DREAM_AUDIO} from '../../scripts/DreamSoundtrack.js';
import {OpeningScene,DREAM_SHOTS} from '../../scenes/OpeningScene.js';
assert.equal(DREAM_AUDIO,'assets/intro-music-only-v1/sueno-musica.mp3');
assert.ok(fs.existsSync(new URL('../../'+DREAM_AUDIO,import.meta.url)));
const realFetch=globalThis.fetch;
const response=()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(2)});
function fixture(){
  let clock=0;const sources=[],listeners=new Set(),states=[];
  const master={gain:{value:0}};
  const ctx={state:'running',decodeAudioData:async()=>({duration:104.3}),
    addEventListener:(type,fn)=>listeners.add(fn),removeEventListener:(type,fn)=>listeners.delete(fn),
    resume:async()=>{ctx.state='running';for(const fn of listeners)fn();},
    createBufferSource(){const s={connect(to){this.to=to;},start(when,offset){this.offset=offset;},stop(){this.stopped=true;},disconnect(){this.disconnected=true;}};sources.push(s);return s;}};
  const audio={ctx,masterGain:master,ensureContext(){}};
  const track=new DreamSoundtrack(audio,state=>states.push(state),()=>clock);
  return {track,ctx,audio,sources,states,listeners,setClock:value=>clock=value};
}
try{
  globalThis.fetch=async()=>response();
  {
    const f=fixture();assert.equal(await f.track.prepare(),true);f.track.start();
    assert.equal(f.sources.length,1);assert.equal(f.sources[0].to,f.audio.masterGain,'must honor the same mute/volume bus');
    assert.equal(f.audio.masterGain.gain.value,0,'silent preference is never overridden');
    assert.equal(f.sources[0].offset,0);
    f.ctx.state='suspended';for(const fn of f.listeners)fn();
    assert.ok(f.sources[0].stopped&&f.sources[0].disconnected);assert.equal(f.states.at(-1),'blocked');
    f.setClock(7700);await f.track.retry();
    assert.equal(f.sources.length,2,'resume creates only one current source');assert.equal(f.sources[1].offset,7.7,'resume at current visual time, not the beginning');
    f.track.stop();assert.equal(f.listeners.size,0);assert.ok(f.sources[1].stopped&&f.sources[1].disconnected);
    f.setClock(13000);await f.ctx.resume();assert.equal(f.sources.length,2,'exit cannot resume sound');
  }
  {
    const f=fixture();f.ctx.state='suspended';await f.track.prepare();f.track.start();
    assert.equal(f.sources.length,0,'autoplay lock does not queue old speech');
    f.setClock(4200);await f.track.retry();assert.equal(f.sources[0].offset,4.2);f.track.stop();
  }
  {
    const f=fixture();let resolve;
    f.ctx.decodeAudioData=()=>new Promise(r=>resolve=r);
    const pending=f.track.prepare();await new Promise(r=>setImmediate(r));f.track.stop();
    resolve({duration:104.3});assert.equal(await pending,false);assert.equal(f.track.buffer,null);assert.equal(f.sources.length,0,'late decoding after skip must not resurrect playback');
  }
  {
    const f=fixture();let resolve;
    f.ctx.resume=()=>new Promise(r=>resolve=r);f.ctx.state='suspended';await f.track.prepare();f.track.start();
    const pending=f.track.retry();f.track.stop();resolve();await pending;assert.equal(f.sources.length,0,'late resume after exit must not restart');
  }
  {
    const f=fixture();globalThis.fetch=async()=>({ok:false});assert.equal(await f.track.prepare(),false);
    f.track.start();assert.equal(f.states.at(-1),'error');
    globalThis.fetch=async()=>response();f.setClock(9000);await f.track.retry();assert.equal(f.sources[0].offset,9);f.track.stop();
  }
  for(const action of ['finish','exit','fail']){
    let stopped=0;
    globalThis.document={body:{classList:{remove(){}}}};
    const scene=new OpeningScene();Object.assign(scene,{alive:true,dreamTimers:new Set(),soundtrack:{stop(){stopped++;}},controller:{abort(){}},
      video:{pause(){},removeAttribute(){},load(){}},storage:{set(){}},sceneManager:{changeScene(){}},retry:{},status:{}});
    scene[action]();assert.equal(stopped,1,action+' must stop soundtrack');
  }
  const montage=JSON.parse(fs.readFileSync(new URL('../../assets/intro-sound-v2/montaje.json',import.meta.url),'utf8'));
  assert.equal(montage.clips.length,DREAM_SHOTS.length);
  let time=0;
  montage.clips.forEach((clip,i)=>{assert.equal(clip.imageStart,time);assert.equal(clip.imageDuration,DREAM_SHOTS[i][4]/1000);assert.equal(clip.voiceStart,time+(i===0?3.8:1.6));assert.ok(clip.voiceStart+clip.voiceDuration+montage.reverbTailSeconds<time+clip.imageDuration,'echo finishes before next image');time+=clip.imageDuration;});
  assert.equal(montage.duration,time+2.8,'fade ends before waking video');
}finally{globalThis.fetch=realFetch;}
console.log('PASS: mix timeline, mute routing, pause/resume synchronization, skip/exit/error cleanup, late decode/resume and audio-load retry.');
