export const CAR_CLIPS = [
  'assets/departure-car-v12/01-place-bag.mp4',
  'assets/departure-car-v12/02-settle.mp4',
  'assets/departure-car-v12/03-wheel.mp4',
  'assets/car-sound-v1/04-start.mp4',
  'assets/car-sound-v1/05-away.mp4'
];
export const CAR_POSTERS = [
  'assets/departure-car-v12/00-start.png',
  'assets/departure-car-v12/01-place-bag-end.png',
  'assets/departure-car-v12/02-settle-end.png',
  'assets/departure-car-v12/03-wheel-end.png',
  'assets/departure-car-v12/04-sigh-end.png',
  'assets/departure-car-v12/05-empty-road.png'
];
export function resolveCarStage(value,atCar) {
  const stage=Number.isInteger(value)&&value>=0&&value<=5?value:0;
  return Math.max(atCar?3:0,stage);
}


