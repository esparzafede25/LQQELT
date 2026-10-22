import assert from 'node:assert/strict';
import {packingTone} from '../../scripts/PresentVisualTone.js';
for(let i=0;i<5;i++){
  const end=packingTone(i,1),next=packingTone(i+1,0);
  end.forEach((value,n)=>assert.ok(Math.abs(value-next[n])<1e-9,'video-to-poster tone must match'));
}
assert.deepEqual(packingTone(3,-1),packingTone(3,0));
assert.deepEqual(packingTone(3,10),packingTone(3,1));
assert.deepEqual(packingTone(3,NaN),packingTone(3,0));
assert.deepEqual(packingTone(5),packingTone(0));
assert.deepEqual(packingTone(4,.5),packingTone(0));
console.log('PASS: tone continuity at every packing cut, restored footage retains constant cold tone, clamped playback progress.');
