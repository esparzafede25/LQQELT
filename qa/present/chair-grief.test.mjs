import assert from 'node:assert/strict';
import {PresentKitchenScene} from '../../scenes/PresentKitchenScene.js';
globalThis.Image=class {async decode(){}};
function setup(){
  const scene=new PresentKitchenScene(),classes=new Set(),calls=[];
  Object.assign(scene,{alive:true,busy:false,chairVisit:1,chairState:'idle',still:{src:'original'},
    layer:{classList:{add:x=>classes.add(x),remove:x=>classes.delete(x)}},
    video:{classList:{remove(){}}},hotspots:{firstElementChild:null},
    lock(){this.busy=true;this.hotspots.firstElementChild=null;},
    spot(id,label,x,y,w,h,action){this.hotspots.firstElementChild={label,action,classList:{add(){}},focus(){}};},
    fail(retry){this.retry=retry;},
    play:async(file,action,root)=>{calls.push([file,action,root]);return true;},
    arm(){this.armed=true;this.busy=false;}
  });
  return {scene,classes,calls};
}
{
  const {scene,classes,calls}=setup();let finish;
  scene.play=()=>new Promise(resolve=>finish=resolve);
  const pending=scene.look();assert.equal(scene.busy,true);assert.equal(scene.chairState,'bowing');
  await scene.look();assert.equal(scene.hotspots.firstElementChild,null);
  finish(true);await pending;assert.equal(scene.chairState,'held');
  assert.equal(scene.hotspots.firstElementChild.label,'Apartar la mirada');
  assert.ok(scene.still.src.endsWith('01-bow-end.png'));assert.ok(classes.has('contemplating'));
  scene.play=async(file,action,root)=>{calls.push([file,action,root]);return true;};
  await scene.returnFromChair();
  assert.equal(scene.chairState,'idle');assert.equal(scene.armed,true);
  assert.equal(classes.has('contemplating'),false);
  assert.ok(scene.still.src.endsWith('02-return-end.png'));
}
{
  const {scene}=setup();scene.play=async()=>false;await scene.look();
  assert.equal(scene.chairState,'bow-error');assert.equal(scene.hotspots.firstElementChild,null);
  scene.play=async()=>true;await scene.retry();assert.equal(scene.chairState,'held');
  scene.play=async()=>false;await scene.returnFromChair();assert.equal(scene.chairState,'return-error');
  scene.play=async()=>true;await scene.retry();assert.equal(scene.chairState,'idle');
}
{
  const {scene}=setup();let finish;scene.play=()=>new Promise(resolve=>finish=resolve);
  const old=scene.look();scene.alive=false;scene.chairVisit++;
  scene.alive=true;scene.chairState='idle';scene.busy=false;
  finish(true);await old;
  assert.equal(scene.still.src,'original');assert.equal(scene.chairState,'idle');
  assert.equal(scene.hotspots.firstElementChild,null);
}
{
  const {scene}=setup();globalThis.Image=class {async decode(){throw new Error('poster unavailable');}};
  await scene.look();assert.equal(scene.chairState,'bow-error');
  assert.equal(scene.still.src,'original');assert.equal(scene.hotspots.firstElementChild,null);
}
console.log('PASS: chair bow/hold/return, duplicate click, retry, missing poster and late completion across visits.');

