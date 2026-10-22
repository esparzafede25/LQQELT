import assert from 'node:assert/strict';
import {OpeningScene} from '../../scenes/OpeningScene.js';
import {PresentWalkScene} from '../../scenes/PresentWalkScene.js';
globalThis.document={body:{classList:{remove(){}}}};
{
  const scene=new OpeningScene(), state={},changes=[];
  Object.assign(scene,{alive:true,video:{pause(){}},storage:{set:(key,value)=>state[key]=value},
    sceneManager:{changeScene:name=>changes.push(name)}});
  scene.finish();scene.finish();
  assert.deepEqual(changes,['INTRO']);assert.equal(state.PRESENT_THIRD_STEP,0);
  assert.equal(state.OPENING_COMPLETED,true);
}
{
  const scene=new OpeningScene();let reject;
  Object.assign(scene,{alive:true,busy:false,visit:1,retry:{},status:{},layer:{classList:{add(){}}},
    video:{error:null,play:()=>new Promise((_,r)=>reject=r),pause(){},removeAttribute(){},load(){}},
    controller:{abort(){}}});
  const pending=scene.play();scene.exit();scene.alive=true;scene.busy=false;scene.visit++;
  reject(new Error('old play'));await pending;assert.equal(scene.status.textContent,'');
}
for(const [index,phase,allowed] of [[1,'ready',true],[0,'ready',false],[2,'ready',false],[1,'playing',false]]) {
  const scene=new PresentWalkScene(),state={PRESENT_WASHED:false};let destination;
  Object.assign(scene,{index,phase,alive:true,visit:1,lock(){},status:{},video:{load(){},play:async()=>{}},storage:{set:(key,value)=>state[key]=value},
    sceneManager:{changeScene:name=>destination=name}});
  await scene.goKitchen();assert.equal(destination,undefined);
  if(allowed)scene.finishAction();
  assert.equal(destination,allowed?'PRESENT_KITCHEN_THIRD':undefined);
  assert.equal(state.PRESENT_WASHED,false);
}
console.log('PASS: intro al dormitorio, omision unica, cancelacion y caminata pasillo-cocina sin imponer lavado.');
