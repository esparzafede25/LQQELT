import assert from 'node:assert/strict';
import {CarDepartureScene} from '../../scenes/CarDepartureScene.js';
import {resolveCarStage} from '../../scripts/CarDepartureProgress.js';
globalThis.document={body:{classList:{remove(){}}}};
assert.equal(resolveCarStage(undefined,false),0);
assert.equal(resolveCarStage(undefined,true),3,'older at-car saves resume at ignition');
assert.equal(resolveCarStage(1,true),3);
assert.equal(resolveCarStage(4,true),4);
for(const bad of [-1,6,'2',NaN])assert.equal(resolveCarStage(bad,false),0);
function setup(stage=0) {
  const state={},routes=[],scene=new CarDepartureScene();let starts=0;
  Object.assign(scene,{alive:true,visit:1,playId:0,index:stage,phase:'ready',
    storage:{get:key=>state[key],set:(key,value)=>state[key]=value},
    sceneManager:{changeScene:name=>routes.push(name)},
    audio:{playCarStart(){starts++;},playAtmosphere(){},stopAtmosphere(){}},
    action:{},status:{},
    video:{ended:false,pause(){},load(){this.ended=false;},removeAttribute(){},play:async()=>scene.startPlaybackAudio()},
    show:async()=>{scene.phase='ready';scene.video.ended=false;}});
  return {scene,state,routes,starts:()=>starts};
}
{
  const {scene,state,routes,starts}=setup();
  await scene.onVisible();assert.equal(scene.phase,'playing');
  assert.equal(state.DEPARTURE_CAR_STAGE,undefined,'playing must not commit');
  scene.video.ended=true;await scene.finishAction();
  assert.equal(scene.index,1);assert.equal(state.DEPARTURE_CAR_STAGE,1);
  await scene.finishAction();assert.equal(scene.index,1,'duplicate ended must not commit another stage');
  for(let i=1;i<3;i++){scene.video.ended=true;await scene.finishAction();}
  assert.equal(scene.index,3);assert.equal(scene.phase,'ready');
  assert.equal(state.DEPARTURE_AT_CAR,true);assert.equal(state.DEPARTURE_FILM_STEP,6);
  assert.equal(starts(),0,'entry does not start motor');
  await scene.play();assert.equal(starts(),1);
  scene.video.ended=true;await scene.finishAction();
  assert.equal(scene.index,4);assert.equal(scene.phase,'playing');
  scene.video.ended=true;await scene.finishAction();
  assert.equal(scene.index,5);assert.deepEqual(routes,['EPILOGUE']);
  assert.equal(state.GAME_COMPLETED,undefined,'titles scene owns final completion');
  scene.exit();
}
{
  const {scene,state}=setup();scene.video.play=async()=>{throw Error('decode');};
  await scene.play();assert.equal(scene.phase,'video-error');
  assert.equal(state.DEPARTURE_CAR_STAGE,undefined);
  scene.video.play=async()=>{};await scene.play();
  scene.video.ended=true;await scene.finishAction();
  assert.equal(state.DEPARTURE_CAR_STAGE,1);scene.exit();
}
{
  const {scene,state}=setup();let reject;
  scene.video.play=()=>new Promise((_,r)=>reject=r);
  const pending=scene.play();scene.exit();reject(Error('late'));
  await pending;assert.equal(state.DEPARTURE_CAR_STAGE,undefined);
}
{
  const {scene}=setup();let reject;
  scene.video.play=()=>new Promise((_,r)=>reject=r);
  const old=scene.play();
  scene.video.play=async()=>{};scene.video.ended=true;await scene.finishAction();
  reject(Error('old clip rejects after next starts'));await old;
  assert.equal(scene.index,1);assert.equal(scene.phase,'playing');scene.exit();
}
console.log('PASS: entry/ignition/final order, ended-only saves, migration, retries, duplicate events and stale playback.');

{
  const {scene,starts}=setup(3);let stopped=0;
  scene.audio.stopEngine=()=>stopped++;
  scene.video.play=async()=>{throw Error('media unavailable');};
  await scene.play();assert.equal(starts(),0,'failed video must not start the engine');
  assert.equal(stopped,1);
  scene.video.play=async()=>scene.startPlaybackAudio();
  await scene.play();scene.startPlaybackAudio();assert.equal(starts(),1,'buffer resume does not repeat ignition');
  scene.exit();assert.equal(stopped,2,'leaving stops the engine');
  scene.startPlaybackAudio();assert.equal(starts(),1,'late playing after exit stays silent');
}

{
  const {StorageManager}=await import('../../scripts/StorageManager.js');
  const saved=new Map();
  globalThis.localStorage={getItem:key=>saved.get(key)||null,setItem:(key,value)=>saved.set(key,value)};
  const storage=new StorageManager();
  storage.set('DEPARTURE_STARTED',true);storage.set('DEPARTURE_CAR_STARTED',true);storage.set('DEPARTURE_CAR_STAGE',4);
  storage.set('soundEnabled',false);storage.set('volume',.3);
  assert.equal(storage.getLatestUnlockedScene(),'CAR_DEPARTURE');
  const restored=new StorageManager();assert.equal(restored.get('DEPARTURE_CAR_STAGE'),4);
  restored.resetProgress();
  assert.equal(restored.get('DEPARTURE_CAR_STARTED'),false);
  assert.equal(restored.get('DEPARTURE_CAR_STAGE'),null);
  assert.equal(restored.get('soundEnabled'),false);assert.equal(restored.get('volume'),.3);
}

