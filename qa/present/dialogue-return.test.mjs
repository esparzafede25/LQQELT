import assert from 'node:assert/strict';
import {PresentKitchenScene} from '../../scenes/PresentKitchenScene.js';
import {StorageManager} from '../../scripts/StorageManager.js';
import {EnvelopeScene} from '../../scenes/EnvelopeScene.js';

function setup(pending=true){
 const scene=new PresentKitchenScene();let finish;const saved={RADIO_RETURN_PENDING:pending};const seen=[];
 Object.assign(scene,{alive:true,chairVisit:1,startSound(){},lock(){seen.push('lock');},arm(){seen.push('arm');},storage:{get:k=>saved[k],set:(k,v)=>saved[k]=v},subtitles:{playSequence:items=>{seen.push(items);return new Promise(r=>finish=r);}}});
 return {scene,saved,seen,finish:v=>finish(v)};
}
{
 const t=setup();const task=t.scene.onVisible();assert.equal(t.seen[0],'lock');assert.match(t.seen[1][0].text,/Si salgo ahora por la ruta/);assert.equal(t.saved.RADIO_RETURN_PENDING,true);t.finish(true);await task;assert.equal(t.saved.RADIO_RETURN_PENDING,false);assert.equal(t.saved.LETTER_SEQUENCE_UNLOCKED,true);assert.equal(t.seen.at(-1),'arm');
}
for(const reason of ['cancel','exit','new-visit']){
 const t=setup();const task=t.scene.onVisible();if(reason==='exit')t.scene.alive=false;if(reason==='new-visit')t.scene.chairVisit++;t.finish(reason!=='cancel');await task;assert.equal(t.saved.RADIO_RETURN_PENDING,true,reason);assert.equal(t.saved.LETTER_SEQUENCE_UNLOCKED,undefined,reason);assert.ok(!t.seen.includes('arm'));
}
{const t=setup(false);await t.scene.onVisible();assert.equal(t.seen.length,0);}
{
 let save=JSON.stringify({RADIO_COMPLETED:true,RADIO_RETURN_PENDING:true,LETTER_SEQUENCE_UNLOCKED:true});globalThis.localStorage={getItem:()=>save,setItem:(k,v)=>save=v};
 let s=new StorageManager();assert.equal(s.getLatestUnlockedScene(),'PRESENT_KITCHEN_THIRD');s.set('RADIO_RETURN_PENDING',false);assert.equal(new StorageManager().getLatestUnlockedScene(),'ENVELOPE');
 save=JSON.stringify({RADIO_COMPLETED:true});s=new StorageManager();assert.equal(s.get('RADIO_RETURN_PENDING'),false);delete globalThis.localStorage;
}
// Execute the envelope click handler and inspect the actual sequence sent to subtitles.
{
 const callbacks={};const sequences=[];let finish;
 const scene=new EnvelopeScene();const layer={querySelector:id=>id.includes('character')?null:{addEventListener:(event,fn)=>callbacks[id]=fn},appendChild(){}};
 globalThis.document={createElement:()=>({})};Object.assign(scene,{visit:1,audio:{playToolClink(){}},subtitles:{playSequence:items=>{sequences.push(items);return new Promise(r=>finish=r);}}});
 scene.setupCards(layer);const task=callbacks['#card-envelope']();assert.deepEqual(sequences[0].map(x=>x.text),['Valentino...','17 de octubre...','06:42...']);assert.ok(sequences[0].every(x=>!x.voice&&!x.speaker));scene.visit++;finish(true);await task;delete globalThis.document;
}
console.log('PASS: present return cue, cancellation, stale visit, save restore and silent envelope legends.');
