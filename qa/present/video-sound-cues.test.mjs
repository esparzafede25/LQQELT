import assert from 'node:assert/strict';
import {bindVideoSoundCues} from '../../scripts/VideoSoundCues.js';
const video=Object.assign(new EventTarget(),{currentTime:0,duration:4,paused:false,seeking:false});
const heard=[],audio={contact:material=>heard.push(material)};
let active=true;
const cues=bindVideoSoundCues(video,audio,()=>[[.2,'contact','paper'],[.6,'contact','leather']],()=>active);
function tick(time){video.currentTime=time;video.dispatchEvent(new Event('timeupdate'));}
tick(.8);tick(.9);assert.deepEqual(heard,['paper'],'one contact per cue');
video.paused=true;tick(2.4);assert.equal(heard.length,1,'paused media stays silent');
video.paused=false;tick(2.5);assert.deepEqual(heard,['paper','leather']);
cues.reset();tick(3);assert.equal(heard.length,2,'stale cues are skipped after a jump');
cues.reset();tick(0);video.seeking=true;tick(.8);assert.equal(heard.length,2);
video.seeking=false;tick(.9);assert.equal(heard.length,3);
active=false;tick(2.4);assert.equal(heard.length,3,'scene exit cannot emit a contact');
active=true;cues.dispose();tick(2.5);assert.equal(heard.length,3,'listeners removed on disposal');
console.log('PASS: media-time cues respect pause, seek, retry, stale contacts and scene disposal.');

{
  const callbacks=new Map();let id=0,count=0;
  const media=Object.assign(new EventTarget(),{currentTime:0,duration:1,paused:false,seeking:false,
    requestVideoFrameCallback(fn){callbacks.set(++id,fn);return id;},cancelVideoFrameCallback(key){callbacks.delete(key);}});
  const precise=bindVideoSoundCues(media,{hit(){count++;}},()=>[[.2,'hit']]);
  media.dispatchEvent(new Event('playing'));assert.equal(callbacks.size,1);
  const callback=callbacks.get(id);callbacks.delete(id);media.currentTime=.21;callback();
  assert.equal(count,1,'presented frames trigger without waiting for timeupdate');
  media.paused=true;media.dispatchEvent(new Event('pause'));assert.equal(callbacks.size,0);
  media.paused=false;media.dispatchEvent(new Event('playing'));assert.equal(callbacks.size,1);
  const late=callbacks.get(id);precise.dispose();assert.equal(callbacks.size,0);late();assert.equal(callbacks.size,0);
}
