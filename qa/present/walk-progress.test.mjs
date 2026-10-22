import assert from 'node:assert/strict';
import {PresentWalkScene} from '../../scenes/PresentWalkScene.js';
import {resolveWalkStep} from '../../scripts/PresentWalkProgress.js';
import {StorageManager} from '../../scripts/StorageManager.js';
globalThis.document={body:{classList:{remove(){}}}};

for (const bad of [null,undefined,-1,7,2.5,'3',NaN]) assert.equal(resolveWalkStep(bad),0);
for (let step=0;step<=6;step++) {
  assert.equal(resolveWalkStep(step),step === 6 ? 1 : step);
  const state={...StorageManager.DEFAULT_STATE,PRESENT_THIRD_STEP:step};
  assert.equal(StorageManager.prototype.hasSavedGame.call({state}),true);
  assert.equal(StorageManager.prototype.getLatestUnlockedScene.call({state}),'PRESENT_THIRD_PREVIEW');
}
for (const [flags,expected] of [
  [{PRESENT_ROOM:'kitchen',PRESENT_RETURN_SCENE:'PRESENT_KITCHEN_THIRD'},'PRESENT_KITCHEN_THIRD'],
  [{LETTER_SEQUENCE_UNLOCKED:true},'ENVELOPE'],[{GAME_COMPLETED:true},'EPILOGUE']
]) assert.equal(StorageManager.prototype.getLatestUnlockedScene.call({state:{PRESENT_THIRD_STEP:4,...flags}}),expected);

function setup() {
  const scene=new PresentWalkScene(), state={}, shown=[];
  Object.assign(scene,{alive:true,visit:1,index:3,phase:'ready',
    storage:{set:(key,value)=>state[key]=value},
    video:{error:null,currentTime:0,play:async()=>{},pause(){},load(){},removeAttribute(){}},
    action:{},spot:{},status:{},controller:{abort(){}},
    show(index){this.phase='loading';shown.push(index);}
  });
  return {scene,state,shown};
}
{
  const {scene,state,shown}=setup();
  scene.index=5;scene.phase='playing';
  scene.finishAction();
  assert.equal(state.PRESENT_THIRD_STEP,1);
  assert.equal(state.PRESENT_ROOM,'hall');
  assert.deepEqual(shown,[1]);
}
{
  const {scene,state,shown}=setup();
  await scene.play(); assert.deepEqual(state,{});
  scene.finishAction(); scene.finishAction();
  assert.equal(state.PRESENT_THIRD_STEP,4);assert.equal(state.PRESENT_WASHED,true);
  assert.deepEqual(shown,[4]);
}
{
  const {scene,state,shown}=setup();
  scene.video.play=async()=>{throw new Error('media failed');};
  await scene.play();assert.equal(scene.phase,'video-error');
  scene.finishAction();assert.deepEqual(state,{});assert.deepEqual(shown,[]);
  let reloads=0;scene.video.error={};scene.video.load=()=>reloads++;
  scene.video.play=async()=>{};await scene.play();assert.equal(reloads,1);
  scene.exit();scene.finishAction();assert.deepEqual(state,{});
}
{
  const {scene,state}=setup();let reject;
  scene.video.play=()=>new Promise((_,r)=>reject=r);
  const play=scene.play();scene.exit();
  scene.alive=true;scene.phase='ready'; // A later visit reuses the same scene instance.
  reject(new Error('old visit'));await play;
  assert.equal(scene.phase,'ready');assert.deepEqual(state,{});
}
console.log('PASS: pasos, prioridades de guardado, final unico, error/reintento y salida durante reproduccion.');
