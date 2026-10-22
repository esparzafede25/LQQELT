// Follow actual media time: buffering, pause and failed playback never advance sound.
export function bindVideoSoundCues(video, audio, getCues, active = () => true) {
  const fired = new Set();
  let previous = -1, frame = null, disposed = false;
  function reset() { fired.clear(); previous = -1; }
  function tick() {
    if (disposed || !active() || video.paused || video.seeking || !Number.isFinite(video.duration) || video.duration <= 0) return;
    const now = video.currentTime;
    if (now < previous) fired.clear();
    previous = now;
    getCues().forEach(([fraction, method, material], index) => {
      const at = fraction * video.duration;
      if (now < at || fired.has(index)) return;
      fired.add(index);
      // Do not replay a burst of old contacts after a seek or a background-tab stall.
      if (now - at <= .35) audio?.[method]?.(material);
    });
  }
  function stopFrames() { if(frame !== null)video.cancelVideoFrameCallback?.(frame); frame = null; }
  function nextFrame() {
    frame = null; tick();
    if(!disposed && !video.paused && !video.ended)frame = video.requestVideoFrameCallback(nextFrame);
  }
  function playing() {
    tick();
    if(!disposed && frame === null && typeof video.requestVideoFrameCallback === 'function')frame = video.requestVideoFrameCallback(nextFrame);
  }
  video.addEventListener('playing', playing);
  video.addEventListener('pause', stopFrames);
  video.addEventListener('ended', stopFrames);
  video.addEventListener('timeupdate', tick);
  return { reset, dispose() { disposed = true; stopFrames(); video.removeEventListener('playing', playing); video.removeEventListener('pause', stopFrames); video.removeEventListener('ended', stopFrames); video.removeEventListener('timeupdate', tick); reset(); } };
}
