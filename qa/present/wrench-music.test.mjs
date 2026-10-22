import assert from 'node:assert/strict';
import {AudioManager,WRENCH_MUSIC_SCENES} from '../../scripts/AudioManager.js';
const real={fetch:globalThis.fetch,set:globalThis.setTimeout,clear:globalThis.clearTimeout};
const timers=new Map();let timerId=0;
globalThis.setTimeout=(fn,delay)=>{timers.set(++timerId,{fn,delay});return timerId;};globalThis.clearTimeout=id=>timers.delete(id);
function fixture(){
  const sources=[],requests=[];
  const ctx={state:'running',currentTime:0,decodeAudioData:async()=>({duration:66.5}),addEventListener(){},removeEventListener(){},
    createGain:()=>({gain:{value:0,cancelScheduledValues(){},setValueAtTime(v){this.value=v;},linearRampToValueAtTime(v){this.target=v;}},connect(to){this.to=to;}}),
    createBufferSource(){const source={connect(to){this.to=to;},start(when,offset){this.offset=offset;},stop(){this.stopped=true;},disconnect(){this.disconnected=true;}};sources.push(source);return source;}};
  const owner=Object.assign(new AudioManager({get:k=>k==='soundEnabled'?false:.8}),{ctx,masterGain:{gain:{value:0}},ensureContext(){}});
  globalThis.fetch=async src=>{requests.push(src);return {ok:true,arrayBuffer:async()=>new ArrayBuffer(2)};};
  return {owner,ctx,sources,requests};
}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
try{
  const f=fixture();f.owner.setStoryScene('MISSION_CAR',false);assert.equal(f.owner.wrenchMusic,undefined);
  f.owner.setStoryScene('MISSION_CAR',true);await tick();
  assert.equal(f.requests[0],'assets/wrench-music-v1/adios-nonino-desde-50.mp3');assert.equal(f.sources.length,1);assert.ok(f.sources[0].loop);
  assert.equal(f.owner.wrenchMusic.gain.to,f.owner.masterGain);assert.equal(f.owner.masterGain.gain.value,0,'wrench music must respect the saved mute bus');
  assert.equal(f.owner.wrenchMusic.gain.gain.target,.35);
  f.owner.setStoryScene('MISSION_CAR_FILM',true);await tick();assert.equal(f.sources.length,1,'workshop alias cannot duplicate ambience');
  f.owner.setStoryScene('MISSION_MATE',false);const stop=f.owner.wrenchMusic.stopTimer;assert.equal(f.owner.wrenchMusic.desired,false);
  timers.get(stop).fn();timers.delete(stop);assert.ok(f.sources[0].stopped&&f.sources[0].disconnected);
  f.owner.setStoryScene('INTRO',true);await tick();assert.equal(f.owner.wrenchMusic.desired,false);assert.ok(f.requests.at(-1).includes('ofelias-dream'),'present keeps its own music');
  for(const name of ['OPENING','INTRO','ENVELOPE','DEPARTURE','MENU','MISSION_MATE','MISSION_RADIO'])assert.ok(!WRENCH_MUSIC_SCENES.has(name),name);
  const late=fixture();let resolve;globalThis.fetch=()=>new Promise(r=>resolve=r);
  late.owner.setStoryScene('MISSION_CAR',true);late.owner.setStoryScene('MENU',false);
  resolve({ok:true,arrayBuffer:async()=>new ArrayBuffer(2)});await tick();assert.equal(late.sources.length,0,'late wrench music load after exit remains silent');
}finally{globalThis.fetch=real.fetch;globalThis.setTimeout=real.set;globalThis.clearTimeout=real.clear;}
console.log('PASS: workshop-only wrench music, loop, one source, mute bus, exit fade, original present music and stale-load cancellation.');

