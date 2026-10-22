import assert from 'node:assert/strict';
import {EpilogueScene} from '../../scenes/EpilogueScene.js';
for(const reenter of [false,true]) {
  const scene=new EpilogueScene();let finish, marked=false;
  Object.assign(scene,{visit:1,timers:new Set(),layer:{querySelector(){throw new Error('Old ending touched DOM');}},
    storage:{set(){marked=true;}},audio:{playAtmosphere(){},stopAtmosphere(){}},
    subtitles:{playSequence:()=>new Promise(resolve=>finish=resolve)}});
  const pending=scene.onVisible();scene.exit();if(reenter)scene.visit++;
  finish();await pending;assert.equal(marked,false);
}
{
  const scene=new EpilogueScene();scene.visit=1;scene.timers=new Set();let changed=false;
  scene.audio={stopAtmosphere(){}};scene.schedule(()=>changed=true,5);scene.exit();
  await new Promise(resolve=>setTimeout(resolve,15));assert.equal(changed,false);assert.equal(scene.timers.size,0);
}
console.log('PASS: epilogo interrumpido no completa partida ni modifica otra escena.');