import assert from 'node:assert/strict';
import {DepartureScene} from '../../scenes/DepartureScene.js';
import {resolvePackedItems} from '../../scripts/DepartureProgress.js';
import {StorageManager} from '../../scripts/StorageManager.js';
assert.deepEqual(resolvePackedItems(['mate','fake','mate',null,'map']),['mate','map']);
for (const value of [null,undefined,'mate',{}]) assert.deepEqual(resolvePackedItems(value),[]);
for (const [state,expected] of [
  [{DEPARTURE_STARTED:true,LETTER_SEQUENCE_UNLOCKED:true},'DEPARTURE'],
  [{DEPARTURE_STARTED:true,GAME_COMPLETED:true},'EPILOGUE'],
  [{LETTER_SEQUENCE_UNLOCKED:true},'ENVELOPE']
]) assert.equal(StorageManager.prototype.getLatestUnlockedScene.call({state}),expected);
function setup(saved=[]) {
  const scene=new DepartureScene(), state={DEPARTURE_PACKED_ITEMS:saved}, calls=[];
  const makeNode=name=>({style:{},classList:{add(){}},getAttribute:()=>name,
    addEventListener(event,fn){this.click=fn;}});
  const items=['mate','wrench','map','envelope'].map(makeNode);
  const tray=makeNode(),bag=makeNode();
  const layer={querySelectorAll:()=>items,querySelector:id=>id==='#packing-tray'?tray:id==='#backpack-table'?bag:null};
  Object.assign(scene,{visit:1,packedCount:0,
    storage:{get:key=>state[key],set:(key,value)=>state[key]=value},
    audio:{playToolClink(){},stopAtmosphere(){}},subtitles:{playSequence:async()=>{}},
    showCarPassengerSeat:async()=>calls.push('car')});
  scene.setupPacking(layer);return {scene,state,items,bag,tray,calls};
}
{
  const {scene,state,items,bag,tray,calls}=setup(['mate','map','map','invalid']);
  assert.equal(scene.packedCount,2);
  await items[0].click();assert.equal(scene.packedCount,2);
  await items[1].click();assert.deepEqual(state.DEPARTURE_PACKED_ITEMS,['mate','map','wrench']);
  await items[3].click();assert.equal(scene.packedCount,4);
  assert.equal(tray.style.display,'none');assert.equal(bag.style.display,'flex');
  await bag.click();assert.equal(state.DEPARTURE_AT_CAR,true);assert.deepEqual(calls,['car']);
}
{
  const {scene,state,items}=setup();let finish;
  scene.subtitles.playSequence=()=>new Promise(resolve=>finish=resolve);
  const pending=items[3].click();scene.exit();finish();await pending;
  assert.deepEqual(state.DEPARTURE_PACKED_ITEMS,[]);
}
{
  const {scene,bag,tray}=setup(['mate','wrench','map','envelope']);
  assert.equal(scene.packedCount,4);assert.equal(bag.style.display,'flex');assert.equal(tray.style.display,'none');
}
console.log('PASS: reanudar viaje, objetos sin duplicados, mochila completa y cancelacion del sobre.');for (const state of [{DEPARTURE_STARTED:true},{LETTER_SEQUENCE_UNLOCKED:true},{GAME_COMPLETED:true}]) {
  assert.equal(StorageManager.prototype.hasSavedGame.call({state}),true);
}
assert.equal(StorageManager.prototype.hasSavedGame.call({state:{PRESENT_THIRD_STEP:'invalid'}}),false);
