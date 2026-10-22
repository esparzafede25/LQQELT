import assert from 'node:assert/strict';
import {CarFilmScene} from '../../scenes/CarFilmScene.js';
import {RadioFilmScene} from '../../scenes/RadioFilmScene.js';

function setup(Scene) {
  const scene = new Scene();
  const saved = {PRESENT_MEMORY_RETURN:true,PRESENT_RETURN_SCENE:'PRESENT_KITCHEN_THIRD'};
  const transitions = [];
  Object.assign(scene, {
    alive:true, inspecting:false, state:'ready', step:0,
    frame:{dataset:{},classList:{add(){}}}, hotspots:{replaceChildren(){}},
    mediaError:{hidden:true,querySelector:()=>({focus(){}})},
    storage:{get:key=>saved[key],set:(key,value)=>saved[key]=value},
    sceneManager:{changeScene:(...args)=>transitions.push(args)},
    audio:{ensureContext(){},stopAtmosphere(){},tuneRadioDial(){},stopRadioStatic(){}},
    playAction:async()=>true, say:async()=>true, wait:async()=>true,
    arm(){this.state='ready';},
    listen:{disabled:false},tuner:{hidden:false},guidance:{textContent:''}
  });
  return {scene,saved,transitions};
}

// Exercise the real action orchestration; only media, DOM and timing are replaced.
{
  const {scene,saved,transitions}=setup(CarFilmScene);
  await scene.perform('fetch'); await scene.perform('repair');
  assert.equal(saved.CAR_COMPLETED,undefined);
  assert.equal(transitions.length,0);
  await scene.perform('close');
  assert.equal(saved.CAR_COMPLETED,true);
  assert.equal(transitions[0][0],'PRESENT_KITCHEN_THIRD');
}
for(const phase of ['media','dialogue','pause']) {
  const {scene,saved,transitions}=setup(CarFilmScene);
  scene.step=2;
  if(phase==='media') scene.playAction=async()=>false;
  if(phase==='dialogue') scene.say=async()=>false;
  if(phase==='pause') scene.wait=async()=>false;
  await scene.perform('close');
  assert.equal(saved.CAR_COMPLETED,undefined,phase);
  assert.equal(transitions.length,0,phase);
}
{
  const {scene,saved,transitions}=setup(RadioFilmScene);
  scene.state='tuning';
  await scene.playBroadcast();
  assert.equal(saved.RADIO_COMPLETED,true);
  assert.equal(saved.RADIO_RETURN_PENDING,true);
  assert.equal(saved.LETTER_SEQUENCE_UNLOCKED,undefined);
  assert.equal(transitions[0][0],'PRESENT_KITCHEN_THIRD');
}
for(const phase of ['off-frequency','interference','pause']) {
  const {scene,saved,transitions}=setup(RadioFilmScene);
  scene.state='tuning'; let dialogue=0;
  if(phase==='off-frequency') scene.listen.disabled=true;
  if(phase==='interference') scene.say=async()=>++dialogue!==5;
  if(phase==='pause') scene.wait=async()=>false;
  await scene.playBroadcast();
  assert.equal(saved.RADIO_COMPLETED,undefined,phase);
  assert.equal(saved.LETTER_SEQUENCE_UNLOCKED,undefined,phase);
  assert.equal(transitions.length,0,phase);
}
console.log('PASS: 8 casos de finalizacion real y cancelacion de taller/radio. No sustituye QA visual.');
