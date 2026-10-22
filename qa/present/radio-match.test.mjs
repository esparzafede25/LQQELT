import assert from 'node:assert/strict';
import {AudioManager} from '../../scripts/AudioManager.js';
const saved={fetch:globalThis.fetch,set:globalThis.setTimeout,clear:globalThis.clearTimeout};
const timers=new Map();let id=0;
globalThis.setTimeout=fn=>{timers.set(++id,fn);return id;};globalThis.clearTimeout=i=>timers.delete(i);
const param=()=>({value:0,setValueAtTime(v){this.value=v;},cancelScheduledValues(){},linearRampToValueAtTime(v){this.target=v;}});
const node=()=>({gain:param(),frequency:param(),Q:param(),connect(to){this.to=to;},start(){},stop(){this.stopped=true;},disconnect(){this.disconnected=true;}});
const tick=()=>new Promise(r=>setImmediate(r));
function fixture(){const sources=[];const a=new AudioManager({get:()=>true});a.ctx={currentTime:0,state:'running',createGain:node,createOscillator:node,createBiquadFilter:node,createBufferSource(){const n=node();sources.push(n);return n;},decodeAudioData:async()=>({duration:46}),addEventListener(){}};a.masterGain=node();a.radioGain=node();a.ensureContext=()=>{};a.createNoiseBuffer=()=>({});return{a,sources};}
try{
  let requested;globalThis.fetch=async src=>{requested=src;return{ok:true,arrayBuffer:async()=>new ArrayBuffer(1)};};
  const {a,sources}=fixture();assert.equal(a.radioMatch,undefined);
  a.startRadioStatic();await tick();assert.equal(requested,'assets/radio-match-v1/partido-radio.mp3');assert.equal(sources.length,2);assert.ok(a.radioMatch.source.loop);assert.equal(a.radioMatch.gain.to,a.masterGain);
  a.startRadioStatic();await tick();assert.equal(sources.length,2,'radio cannot duplicate crowd or static');
  a.tuneRadioDial(.5,1);assert.equal(a.radioMatch.gain.gain.target,.004);assert.equal(a.radioStaticNodes.gain.gain.value,.10,'static remains on the tuned station');
  a.tuneRadioDial(.6,.2);assert.ok(a.radioMatch.gain.gain.target<.0014);assert.ok(a.radioStaticNodes.gain.gain.value>.22);
  const crowd=a.radioMatch.source,noise=a.radioStaticNodes.noise;a.stopRadioStatic();assert.ok(noise.stopped);timers.get(a.radioMatch.stopTimer)();assert.ok(crowd.stopped&&crowd.disconnected);
  const late=fixture();let resolve;globalThis.fetch=()=>new Promise(r=>resolve=r);late.a.startRadioStatic();late.a.stopRadioStatic();resolve({ok:true,arrayBuffer:async()=>new ArrayBuffer(1)});await tick();assert.equal(late.a.radioMatch.source,undefined,'exiting before decode cannot revive the match');
}finally{globalThis.fetch=saved.fetch;globalThis.setTimeout=saved.set;globalThis.clearTimeout=saved.clear;}
console.log('PASS: subtle match only with powered radio, static floor, tuning, no duplicates and cancelled late audio.');
