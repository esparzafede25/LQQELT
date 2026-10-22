import assert from 'node:assert/strict';
import {DepartureScene} from '../../scenes/DepartureScene.js';
import {EnvelopeScene} from '../../scenes/EnvelopeScene.js';

// Returning from a pending dialogue must not add controls to a scene we left.
for (const reenter of [false,true]) {
  const scene = new DepartureScene();
  scene.visit = 1;
  scene.audio = {stopAtmosphere(){}};
  let finishDialogue;
  scene.subtitles = {playSequence:()=>new Promise(resolve=>{finishDialogue=resolve;})};
  const layer = {style:{},querySelector:()=>null,appendChild(){throw new Error('Control added after exit');}};
  const pending = scene.showCarPassengerSeat(layer);
  scene.exit();
  if (reenter) scene.visit++;
  finishDialogue();
  await pending;
}
// A queued final transition must never take the player away from the menu.
for (const Scene of [EnvelopeScene,DepartureScene]) {
  const scene = new Scene();
  scene.audio = {stopAtmosphere(){}};
  let changed = false;
  scene.transitionTimer = setTimeout(()=>{changed=true;},10);
  scene.exit();
  await new Promise(resolve=>setTimeout(resolve,30));
  assert.equal(changed,false);
}
console.log('PASS: 4 casos de salida y reentrada durante el final.');
