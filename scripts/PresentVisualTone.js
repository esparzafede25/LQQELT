// Restored packing footage already shares a cold grade; retain it across every action.
const PACKING_TONES=[[.92,.80],[.92,.80],[.92,.80],[.92,.80],[.92,.80],[.92,.80],[.78,.65]];
export function packingTone(index,progress=0){
  const current=PACKING_TONES[Math.min(Math.max(index,0),6)];
  const next=PACKING_TONES[Math.min(Math.max(index+1,0),5)];
  const t=index<5?Math.min(1,Math.max(0,Number.isFinite(progress)?progress:0)):0;
  return current.map((value,i)=>value+(next[i]-value)*t);
}
export function applyPackingTone(layer,index,progress=0){
  const [brightness,saturation]=packingTone(index,progress);
  layer.style.setProperty('--present-brightness',brightness.toFixed(4));
  layer.style.setProperty('--present-saturation',saturation.toFixed(4));
}
