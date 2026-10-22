import assert from 'node:assert/strict';
import {AudioManager} from '../../scripts/AudioManager.js';
const originalSet=globalThis.setTimeout,originalClear=globalThis.clearTimeout;
let next=0;const timers=new Map(),nodes=[];
globalThis.setTimeout=fn=>{timers.set(++next,fn);return next;};
globalThis.clearTimeout=id=>timers.delete(id);
const parameter=()=>({value:0,cancelScheduledValues(){},setValueAtTime(value){this.value=value;},setTargetAtTime(value){this.value=value;},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}});
const node=()=>{const n={gain:parameter(),frequency:parameter(),connect(){},start(){},stop(){this.stopped=true;},disconnect(){this.disconnected=true;}};nodes.push(n);return n;};
try{
  const audio=new AudioManager({get:key=>key==='volume'?0:true});
  assert.equal(audio.volume,0,'saved zero volume must remain silent');
  audio.ctx={currentTime:0,state:'running',createGain:node,createOscillator:node,createBiquadFilter:node};
  audio.engineGain=node();
  audio.playCarStart();
  assert.equal(audio.engineGain.gain.value,.55,'cranking must reach the engine bus');
  const pending=audio.engineStartTimer,cranks=[...audio.engineStartNodes];
  audio.stopEngine();assert.equal(timers.has(pending),false,'exit cancels delayed idle');
  assert.ok(cranks.every(n=>n.disconnected));
  assert.equal(audio.engineNodes,undefined);
  audio.playCarStart();const old=audio.engineStartTimer;
  audio.playCarStart();assert.equal(timers.has(old),false,'retry cannot leave two idle timers');
  const ready=audio.engineStartTimer;timers.get(ready)();timers.delete(ready);
  assert.equal(audio.engineNodes.length,4);
  const count=nodes.length;audio.startEngineIdle();assert.equal(nodes.length,count,'idle is not duplicated');
  audio.stopEngine();assert.equal(audio.engineNodes,null);
  for(const fn of [...timers.values()])fn();
}finally{globalThis.setTimeout=originalSet;globalThis.clearTimeout=originalClear;}
console.log('PASS: zero volume, audible crank bus, cancellation, retries and single engine idle.');
