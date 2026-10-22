import assert from 'node:assert/strict';
import {PresentScore,PRESENT_MUSIC_SCENES} from '../../scripts/PresentScore.js';
import {AudioManager} from '../../scripts/AudioManager.js';
const real={fetch:globalThis.fetch,set:globalThis.setTimeout,clear:globalThis.clearTimeout};
const timers=new Map();let id=0;
globalThis.setTimeout=(fn,delay)=>{timers.set(++id,{fn,delay});return id;};globalThis.clearTimeout=id=>timers.delete(id);
function fixture(){
  const sources=[],states=[],parameters=[];
  const param=()=>{const p={value:0,ramps:[],cancelScheduledValues(){},setValueAtTime(v){this.value=v;},linearRampToValueAtTime(v,t){this.ramps.push([v,t]);}};parameters.push(p);return p;};
  const ctx={currentTime:0,state:'running',decodeAudioData:async()=>({duration:298.8}),addEventListener(){},removeEventListener(){},
    createGain:()=>({gain:param(),connect(to){this.to=to;}}),
    createBufferSource(){const source={connect(to){this.to=to;},start(when,offset){this.offset=offset;},stop(){this.stopped=true;},disconnect(){this.disconnected=true;}};sources.push(source);return source;}};
  const master={gain:{value:0}},audio={ctx,masterGain:master,ensureContext(){}};
  return {score:new PresentScore(audio,s=>states.push(s)),sources,states,ctx,audio,parameters};
}
const respond=()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(2)});
try{
  globalThis.fetch=async()=>respond();
  {
    const f=fixture();await f.score.play();assert.equal(f.sources.length,1);assert.ok(f.sources[0].loop);assert.equal(f.score.gain.to,f.audio.masterGain);assert.equal(f.audio.masterGain.gain.value,0,'saved silence remains authoritative');
    await f.score.play();assert.equal(f.sources.length,1,'changing rooms must not restart the song');
    f.score.duck(true);assert.equal(f.score.gain.gain.ramps.at(-1)[0],.09);f.score.duck(false);assert.equal(f.score.gain.gain.ramps.at(-1)[0],.18);
    f.ctx.currentTime=12;f.score.pause();const stop=f.score.stopTimer;timers.get(stop).fn();timers.delete(stop);
    assert.ok(f.sources[0].stopped&&f.sources[0].disconnected);assert.equal(f.score.offset,12);
    f.ctx.currentTime=130;await f.score.play();assert.equal(f.sources[1].offset,12,'memories pause musical time instead of jumping ahead');
    f.score.pause();const stale=timers.get(f.score.stopTimer).fn;await f.score.play();stale();assert.equal(f.sources.length,2);assert.ok(!f.sources[1].stopped,'return during fade cancels old stop');
    f.score.pause(0);timers.get(f.score.stopTimer).fn();timers.delete(f.score.stopTimer);
  }
  {
    const f=fixture();let release;globalThis.fetch=()=>new Promise(r=>release=r);
    const pending=f.score.play();f.score.pause();release(respond());await pending;
    assert.equal(f.sources.length,0,'late load after leaving the present must stay silent');
    globalThis.fetch=async()=>respond();await f.score.play();assert.equal(f.sources.length,1);
  }
  {
    const f=fixture();globalThis.fetch=async()=>({ok:false});await f.score.play();assert.equal(f.states.at(-1),'error');
    globalThis.fetch=async()=>respond();await f.score.play();assert.equal(f.sources.length,1,'failed music load can retry on next entry');
  }
  for(const name of ['OPENING','MENU','ARCHIVE','CREDITS','MISSION_MATE','MISSION_CAR','MISSION_RADIO'])assert.ok(!PRESENT_MUSIC_SCENES.has(name),name);
  for(const name of ['INTRO','PRESENT_KITCHEN_THIRD','ENVELOPE','DEPARTURE','CAR_DEPARTURE','EPILOGUE'])assert.ok(PRESENT_MUSIC_SCENES.has(name),name);
  {
    const f=fixture(),owner=Object.assign(f.audio,{presentScore:f.score});
    AudioManager.prototype.setStoryScene.call(owner,'INTRO',false);assert.equal(f.score.desired,false,'new score waits for visibility');
    AudioManager.prototype.setStoryScene.call(owner,'INTRO',true);await new Promise(r=>setImmediate(r));assert.equal(f.score.desired,true);
    AudioManager.prototype.setStoryScene.call(owner,'MISSION_MATE',false);assert.equal(f.score.desired,false,'memory fade begins before scene transition');
    AudioManager.prototype.setStoryDialogue.call(owner,true);assert.equal(f.score.ducked,true);
  }
}finally{globalThis.fetch=real.fetch;globalThis.setTimeout=real.set;globalThis.clearTimeout=real.clear;}
console.log('PASS: present continuity, memory fade/resume position, dialogue ducking, mute routing, cancelled fades, late loads and recoverable load errors.');
