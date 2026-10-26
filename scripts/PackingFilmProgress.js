import {resolvePackedItems} from './DepartureProgress.js';

export const PACKING_ACTIONS = [
  ['mate','Guardar el mate','assets/departure-motion-v12/01-mate.mp4',[37,48,7,14]],
  ['wrench','Guardar la llave','assets/departure-motion-v12/02-wrench.mp4',[40,56,9,8]],
  ['map','Guardar el mapa','assets/departure-motion-v12/03-map.mp4',[46,56,11,10]],
  ['envelope','Guardar el sobre','assets/departure-motion-v12/04-envelope.mp4',[47,58,11,8]],
  ['bag','Tomar la mochila','assets/departure-motion-v12/05-take-bag.mp4',[42,38,16,20]]
];
export const PACKING_POSTERS = [
  'assets/departure-motion-v12/00-start.png',
  'assets/departure-motion-v12/01-mate-end.png',
  'assets/departure-motion-v12/02-wrench-end.png',
  'assets/departure-motion-v12/03-map-end.png',
  'assets/departure-motion-v12/04-envelope-end.png',
  'assets/departure-motion-v12/05-take-bag-end.png',
  'assets/departure-car-v12/03-wheel-end.png'
];
export function resolvePackingFilmStep(step,items,atCar) {
  if(atCar)return 6;
  if(Number.isInteger(step) && step >= 0 && step <= 6)return step;
  const packed=new Set(resolvePackedItems(items));
  let index=0;
  while(index<4 && packed.has(PACKING_ACTIONS[index][0]))index++;
  return index;
}

export function packedAfterStep(step,previous) {
  return resolvePackedItems([...resolvePackedItems(previous),...PACKING_ACTIONS.slice(0,Math.min(step,4)).map(([item])=>item)]);
}

