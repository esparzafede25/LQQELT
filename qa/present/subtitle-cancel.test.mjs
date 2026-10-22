import assert from 'node:assert/strict';
import {SubtitleManager} from '../../scripts/SubtitleManager.js';
function setup() {
  const spoken=[],shown=[],callbacks=[];
  const manager=new SubtitleManager({innerHTML:''},{speakFatherVoice:text=>spoken.push(text)});
  manager.show=function(options){this.clear();shown.push(options.text);callbacks.push(options.onComplete);};
  return {manager,spoken,shown,callbacks};
}
{
  const {manager,spoken,shown}=setup();let finished=false;
  const pending=manager.playSequence([{text:'old',voice:'father',delay:10}],()=>finished=true);
  manager.clear();assert.equal(await pending,false);
  assert.deepEqual(spoken,[]);assert.deepEqual(shown,[]);assert.equal(finished,false);
}
{
  const {manager,spoken,shown,callbacks}=setup();let finished=false;
  const pending=manager.playSequence([{text:'first',voice:'father'},{text:'second',voice:'father'}],()=>finished=true);
  manager.clear();callbacks[0]();assert.equal(await pending,false);
  assert.deepEqual(shown,['first']);assert.deepEqual(spoken,['first']);assert.equal(finished,false);
}
{
  const {manager,callbacks}=setup();let oldFinished=false,newFinished=false;
  const old=manager.playSequence([{text:'old'}],()=>oldFinished=true);
  const current=manager.playSequence([{text:'new'}],()=>newFinished=true);
  callbacks[0]();callbacks[1]();assert.equal(await old,false);assert.equal(await current,true);
  assert.equal(oldFinished,false);assert.equal(newFinished,true);
}
{
  const manager=new SubtitleManager({},null);let changed=false;
  const block={parentNode:{},classList:{remove(){}}};
  manager.fadeOutBlock(block,()=>changed=true);block.parentNode=null;
  await new Promise(resolve=>setTimeout(resolve,470));assert.equal(changed,false);
}
console.log('PASS: cancelacion antes de voz, durante dialogo, reemplazo de secuencia y callback de bloque retirado.');