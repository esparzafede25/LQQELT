import assert from 'node:assert/strict';
import {OpeningScene,DREAM_SHOTS} from '../../scenes/OpeningScene.js';
const realSet=globalThis.setTimeout,realClear=globalThis.clearTimeout;
let next=0;
const timers=new Map();
globalThis.setTimeout=(callback,delay)=>{const id=++next;timers.set(id,{callback,delay});return id;};
globalThis.clearTimeout=id=>timers.delete(id);
function classes(){const values=new Set();return {add:(...names)=>names.forEach(n=>values.add(n)),remove:(...names)=>names.forEach(n=>values.delete(n)),toggle:(name,on)=>on?values.add(name):values.delete(name),has:name=>values.has(name)};}
function scene(decode=async()=>{}){
  return Object.assign(new OpeningScene(),{alive:true,busy:false,visit:1,dreamTimers:new Set(),
    layer:{classList:classes(),dataset:{}},shots:DREAM_SHOTS.map(()=>({classList:classes(),decode})),
    narration:{classList:classes(),dataset:{}},narrationText:{textContent:''},
    retry:{},status:{},video:{pause(){}},storage:{set(){}},sceneManager:{changeScene(){}}});
}
function advance(delay){const pair=[...timers].find(([,timer])=>timer.delay===delay);assert.ok(pair,`missing timer ${delay}`);timers.delete(pair[0]);pair[1].callback();}
try{
  const s=scene();let wake=0;s.play=()=>wake++;
  await s.startDream();assert.equal(s.layer.dataset.dreamShot,'1');assert.equal(wake,0);
  assert.equal(DREAM_SHOTS.length,8);
  advance(2800);
  for(let index=0;index<DREAM_SHOTS.length;index++){
    const [,,text,side,duration]=DREAM_SHOTS[index];
    assert.equal(s.layer.dataset.dreamShot,String(index+1));
    advance(index===0?3800:1600);
    assert.equal(s.narrationText.textContent,text);
    assert.equal(s.narration.dataset.side,side);
    assert.ok(s.narration.classList.has('visible'));
    advance(duration-1200);assert.ok(!s.narration.classList.has('visible'));
    advance(duration);
  }
  assert.ok(s.shots[0].classList.has('shown'),'outgoing camera motion preserved during fade');
  assert.equal(wake,0);assert.ok(s.layer.classList.has('dream-ended'));
  advance(2800);assert.equal(wake,1);assert.equal(s.phase,'wake');assert.equal(timers.size,0);

  const skipped=scene();await skipped.startDream();let changes=0;skipped.sceneManager.changeScene=()=>changes++;
  skipped.finish();skipped.finish();assert.equal(changes,1);assert.equal(timers.size,0);

  let resolve;
  const imageReady=new Promise(r=>resolve=r);
  const late=scene(()=>imageReady);
  // One shared unresolved image promise is sufficient to hold the whole preload.
  const pending=late.startDream();late.finish();resolve();await pending;
  assert.equal(late.layer.dataset.dreamShot,undefined);assert.equal(timers.size,0);

  const failed=scene(async()=>{throw Error('missing image');});await failed.startDream();
  assert.equal(failed.retry.hidden,false);assert.equal(failed.busy,false);assert.equal(timers.size,0);
  assert.match(failed.status.textContent,/imágenes/);
  console.log('PASS: eight dream shots with timed side monologue, fades before wake, skip cancels timers, late preload cannot resume, image failure recoverable.');
}finally{globalThis.setTimeout=realSet;globalThis.clearTimeout=realClear;}
