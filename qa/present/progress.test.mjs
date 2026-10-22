import assert from 'node:assert/strict';
import {resolvePresentRoom, resolveMemoryReturnScene} from '../../scripts/PresentProgress.js';
import {PresentScene} from '../../scenes/PresentScene.js';
import {StorageManager} from '../../scripts/StorageManager.js';
const save = state => ({get:key=>state[key]});
assert.equal(resolvePresentRoom(save({})), 'bedroom');
assert.equal(resolvePresentRoom(save({MATE_COMPLETED:true})), 'kitchen');
assert.equal(resolvePresentRoom(save({MATE_COMPLETED:true,PRESENT_ROOM:'hall'})), 'hall');
assert.equal(resolvePresentRoom(save({PRESENT_ROOM:'bathroom',PRESENT_WASHED:false})), 'bathroom');
assert.equal(resolvePresentRoom(save({PRESENT_ROOM:'bedroom',PRESENT_MEMORY_RETURN:true})), 'kitchen');
assert.equal(resolvePresentRoom(save({PRESENT_ROOM:'invalid'})), 'bedroom');
assert.equal(resolvePresentRoom(save({PRESENT_MEMORY_RETURN:true}), 'bathroom'), 'bathroom');
assert.equal(resolveMemoryReturnScene(save({})), 'INTRO');
assert.equal(resolveMemoryReturnScene(save({PRESENT_MEMORY_RETURN:false,PRESENT_RETURN_SCENE:'PRESENT_PREVIEW'})), 'INTRO');
assert.equal(resolveMemoryReturnScene(save({PRESENT_MEMORY_RETURN:true})), 'PRESENT_PREVIEW');
assert.equal(resolveMemoryReturnScene(save({PRESENT_MEMORY_RETURN:true,PRESENT_RETURN_SCENE:'PRESENT_PREVIEW'})), 'PRESENT_PREVIEW');
assert.equal(resolveMemoryReturnScene(save({PRESENT_MEMORY_RETURN:true,PRESENT_RETURN_SCENE:'INTRO'})), 'INTRO');
assert.equal(resolveMemoryReturnScene(save({PRESENT_MEMORY_RETURN:true,PRESENT_RETURN_SCENE:'INVALID'})), 'PRESENT_PREVIEW');
console.log('PASS: 13 casos de inicio, migración, reanudación y regreso de recuerdos.');
for (const origin of ['INTRO', 'PRESENT_PREVIEW', 'PRESENT_BATHROOM', 'PRESENT_KITCHEN_THIRD']) {
  for (const memory of ['MISSION_MATE', 'MISSION_CAR', 'MISSION_RADIO']) {
    const state = {PRESENT_ROOM:'kitchen'};
    const scene = new PresentScene();
    let change;
    scene.lock = () => {};
    scene.storage = {get:key=>state[key],set:(key,value)=>{state[key]=value;}};
    scene.sceneManager = {currentSceneName:origin,changeScene:(...args)=>{change=args;}};
    scene.remember(memory);
    assert.equal(change[0],memory);
    assert.equal(resolveMemoryReturnScene(scene.storage),['INTRO','PRESENT_KITCHEN_THIRD'].includes(origin)?origin:'PRESENT_PREVIEW');
    assert.equal(resolvePresentRoom(scene.storage),'kitchen');
  }
}
console.log('PASS: 12 conexiones desde el presente hacia recuerdos y regreso a cocina.');
const kitchenSave = {PRESENT_ROOM:'kitchen',PRESENT_RETURN_SCENE:'PRESENT_KITCHEN_THIRD'};
for (const [state,expected] of [
  [kitchenSave,'PRESENT_KITCHEN_THIRD'],
  [{...kitchenSave,MATE_COMPLETED:true},'PRESENT_KITCHEN_THIRD'],
  [{MATE_COMPLETED:true},'PRESENT_KITCHEN_THIRD'],
  [{...kitchenSave,LETTER_SEQUENCE_UNLOCKED:true},'ENVELOPE'],
  [{...kitchenSave,GAME_COMPLETED:true},'EPILOGUE']
]) {
  assert.equal(StorageManager.prototype.getLatestUnlockedScene.call({state}),expected);
}
console.log('PASS: 5 casos de continuar partida y conservar prioridad del final.');
