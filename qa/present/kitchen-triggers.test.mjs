import assert from 'node:assert/strict';
import {PresentKitchenScene} from '../../scenes/PresentKitchenScene.js';
import {IntroScene} from '../../scenes/IntroScene.js';
import {resolveMemoryReturnScene} from '../../scripts/PresentProgress.js';

for (const completed of [false, true]) {
  const scene = new PresentKitchenScene();
  const state = {MATE_COMPLETED:completed,CAR_COMPLETED:true,RADIO_COMPLETED:true};
  const spots = new Map();
  let destination;
  Object.assign(scene, {
    alive:true, help:{disabled:false}, hotspots:{replaceChildren(){}},
    storage:{get:key=>state[key],set:(key,value)=>state[key]=value},
    sceneManager:{currentSceneName:'PRESENT_KITCHEN_THIRD',changeScene:name=>destination=name},
    frame:{classList:{remove(){}}},thought:{textContent:''},
    spot(id,label,x,y,w,h,action){spots.set(id,action);}
  });
  scene.arm();
  spots.get('mate')();
  assert.equal(destination,'MISSION_MATE');
  assert.equal(resolveMemoryReturnScene(scene.storage),'PRESENT_KITCHEN_THIRD');
  assert.equal(state.MATE_COMPLETED,completed);
  assert.equal(state.CAR_COMPLETED,true);
  assert.equal(state.RADIO_COMPLETED,true);
}
console.log('PASS: el mate inicia y repite el recuerdo sin borrar progreso, con retorno a cocina.');

for (const completed of [false, true]) {
  const scene = new IntroScene();
  const state = {MATE_COMPLETED:completed,CAR_COMPLETED:true,RADIO_COMPLETED:true,
    PRESENT_RETURN_SCENE:'PRESENT_KITCHEN_THIRD'};
  const handlers = new Map();
  let dialogue, destination;
  Object.assign(scene, {
    storage:{get:key=>state[key],set:(key,value)=>state[key]=value},
    audio:{playToolClink(){}}, subtitles:{show:value=>dialogue=value},
    sceneManager:{changeScene:name=>destination=name}
  });
  const layer = {querySelector:id=>({addEventListener:(event,callback)=>handlers.set(id,callback)})};
  scene.setupInteractions(layer,null,completed,true,true);
  handlers.get('#hotspot-mate')();
  assert.equal(destination,undefined);
  dialogue.onComplete();
  assert.equal(destination,'MISSION_MATE');
  assert.equal(resolveMemoryReturnScene(scene.storage),'INTRO');
  assert.equal(state.MATE_COMPLETED,completed);
  assert.equal(state.CAR_COMPLETED,true);
  assert.equal(state.RADIO_COMPLETED,true);
}
console.log('PASS: el mate también se repite desde la entrada anterior y regresa a ella.');
