const clamp=value=>Math.max(0,Math.min(1,Number.isFinite(value)?value:0));
export function departureLight(progress=0){
  const p=clamp((clamp(progress)-.12)/.88),t=p*p*(3-2*p);
  return {brightness:.76+.29*t,saturation:.16+.84*t,cold:.76*(1-t),sun:t,sunY:45-10*t};
}
export function applyDepartureLight(layer,progress=0){
  const light=departureLight(progress);
  for(const [name,value] of Object.entries(light))layer.style.setProperty('--dawn-'+name,value.toFixed(4)+(name==='sunY'?'%':''));
}
