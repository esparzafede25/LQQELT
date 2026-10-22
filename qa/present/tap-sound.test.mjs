import assert from 'node:assert/strict';
import {TapSound,tapFrame} from '../../scripts/TapSound.js';
const saved={fetch:globalThis.fetch,set:globalThis.setTimeout,clear:globalThis.clearTimeout};let id=0;const timers=new Map();
globalThis.setTimeout=fn=>{timers.set(++id,fn);return id;};globalThis.clearTimeout=i=>timers.delete(i);
const param=()=>({value:0,setValueAtTime(v){this.value=v;},setTargetAtTime(v){this.target=v;},cancelScheduledValues(){},linearRampToValueAtTime(v){this.target=v;}});
const node=()=>({gain:param(),frequency:param(),connect(to){this.to=to;},disconnect(){this.disconnected=true;},start(){},stop(){this.stopped=true;}});
const tick=()=>new Promise(r=>setImmediate(r));
function fixture(){const sources=[];const ctx={currentTime:0,state:'running',createGain:node,createBiquadFilter:node,decodeAudioData:async()=>({duration:15.75}),createBufferSource(){const n=node();sources.push(n);return n;},addEventListener(){},removeEventListener(){}};const a={ctx,masterGain:node(),ensureContext(){}};a.masterGain.gain.value=0;return{tap:new TapSound(a),a,sources};}
try{
 globalThis.fetch=async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(1)});
 const {tap,a,sources}=fixture();await tap.prepare();tap.sync(2,2.3,true);await tick();assert.equal(sources.length,0,'no water before visible opening');
 tap.sync(2,2.5,true);await tick();assert.equal(sources.length,1);assert.ok(sources[0].loop);assert.equal(tap.filter.to,a.masterGain);assert.equal(a.masterGain.gain.value,0,'water cannot bypass mute');
 tap.sync(3);tap.sync(3,1.5,true);assert.equal(sources.length,1,'same water continues into the wash');assert.equal(tap.filter.frequency.target,2500);assert.equal(tap.track.gain.gain.target,.21);
 tap.sync(3,3,true);assert.equal(tap.filter.frequency.target,6000);assert.equal(tap.track.gain.gain.target,.18);
 tap.sync(4,3.6,true);assert.ok(tap.track.desired);tap.sync(4,3.8,true);assert.equal(tap.track.desired,false);timers.get(tap.track.stopTimer)();assert.ok(sources[0].stopped);
 assert.ok(tapFrame(3).on&&tapFrame(4).on,'saved running-water stills keep tap on');assert.equal(tapFrame(1).on,false);
 const late=fixture();let resolve;globalThis.fetch=()=>new Promise(r=>resolve=r);late.tap.sync(3);late.tap.dispose();resolve({ok:true,arrayBuffer:async()=>new ArrayBuffer(1)});await tick();assert.equal(late.sources.length,0,'late load cannot restart water after exit');assert.ok(late.tap.filter.disconnected);
 tap.dispose();
}finally{globalThis.fetch=saved.fetch;globalThis.setTimeout=saved.set;globalThis.clearTimeout=saved.clear;}
console.log('PASS: tap timing, seamless continuity, hand texture, mute routing, close and late-load cancellation.');
