import assert from 'node:assert/strict';
import {PackingFilmScene} from '../../scenes/PackingFilmScene.js';
import {resolvePackingFilmStep,packedAfterStep} from '../../scripts/PackingFilmProgress.js';
globalThis.cancelAnimationFrame=()=>{};
assert.equal(resolvePackingFilmStep(null,[],false),0);
assert.equal(resolvePackingFilmStep(null,['mate','map'],false),1);
assert.equal(resolvePackingFilmStep(null,['mate','wrench','map','envelope'],false),4);
assert.equal(resolvePackingFilmStep(3,[],true),6);
for(const value of [-1,7,'2',NaN])assert.equal(resolvePackingFilmStep(value,[],false),0);
assert.deepEqual(packedAfterStep(2,['map','fake','map']),['map','mate','wrench']);
function setup(){
  const state={DEPARTURE_PACKED_ITEMS:[]},scene=new PackingFilmScene();
  Object.assign(scene,{alive:true,visit:1,index:0,phase:'ready',storage:{get:key=>state[key],set:(key,value)=>state[key]=value},
    sceneManager:{changeScene:name=>scene.route=name},layer:{style:{setProperty(){}}},lock(){},status:{},action:{},video:{pause(){},play:async()=>{}},show:async()=>{scene.phase='ready';}});
  return {scene,state};
}
{
  const {scene,state}=setup();await scene.play();assert.deepEqual(state.DEPARTURE_PACKED_ITEMS,[]);
  await scene.play();assert.equal(scene.index,0,'double click must not advance');
  await scene.finishAction();await scene.finishAction();assert.equal(scene.index,1);
  assert.deepEqual(state.DEPARTURE_PACKED_ITEMS,['mate']);assert.equal(state.DEPARTURE_FILM_STEP,1);
  for(let i=1;i<5;i++){await scene.play();await scene.finishAction();}
  assert.deepEqual(state.DEPARTURE_PACKED_ITEMS,['mate','wrench','map','envelope']);
  assert.equal(state.DEPARTURE_AT_CAR,undefined);await scene.play();
  assert.equal(state.DEPARTURE_AT_CAR,undefined);assert.equal(scene.index,5);
  assert.equal(state.DEPARTURE_CAR_STARTED,true);assert.equal(scene.route,'CAR_DEPARTURE');
}
{
  const {scene,state}=setup();scene.video.play=async()=>{throw Error('load failed');};
  await scene.play();assert.equal(scene.phase,'video-error');assert.deepEqual(state.DEPARTURE_PACKED_ITEMS,[]);
  scene.video.play=async()=>{};await scene.play();await scene.finishAction();assert.equal(scene.index,1);
}
{
  const {scene,state}=setup();let reject;
  scene.video.play=()=>new Promise((_,r)=>reject=r);
  const pending=scene.play();clearTimeout(scene.timer);scene.alive=false;scene.visit++;
  reject(Error('late'));await pending;await scene.finishAction();assert.deepEqual(state.DEPARTURE_PACKED_ITEMS,[]);
}
console.log('PASS: film packing resumes, commits only after animation, guards duplicate actions, retries and cancels late playback.');
