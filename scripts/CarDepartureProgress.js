export const CAR_CLIPS = [
  'assets/departure-car-v9/01-place-bag.mp4',
  'assets/departure-car-v9/02-sit.mp4',
  'assets/departure-car-rigid-v4/03-close.mp4',
  'assets/car-sound-v1/04-start.mp4',
  'assets/car-sound-v1/05-away.mp4'
];
export const CAR_POSTERS = [
  'assets/departure-car-v9/00-start.png',
  'assets/departure-car-v9/01-place-bag-end.png',
  'assets/departure-car-v9/02-sit-end.png',
  'assets/departure-car-rigid-v4/03-close-end.png',
  'assets/departure-car-v5/04-sigh-end.png',
  'assets/departure-car-v5/05-away-end.png'
];
export function resolveCarStage(value,atCar) {
  const stage=Number.isInteger(value)&&value>=0&&value<=5?value:0;
  return Math.max(atCar?3:0,stage);
}


