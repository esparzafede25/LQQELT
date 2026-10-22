// Candidate footage stays in QA until visual review is complete.
export const PRESENT_WALK_STAGES = [
  ['Dormitorio', 'qa/present/bedroom-wake-adult-actual-end-v2.png', 'qa/present/bedroom-exit-adult-v3.mp4', 'Levantarse y salir', [66,5,19,80]],
  ['Pasillo', 'qa/present/hall-start-v1.png', 'qa/present/hall-bathroom-v1.mp4', 'Entrar al baño', [10,7,18,88]],
  ['Baño', 'assets/present-bath-adult-v4/00-closed.png', 'assets/present-bath-adult-v4/01-open.mp4', 'Abrir la canilla', [66,59,15,22]],
  ['Baño', 'assets/present-bath-adult-v4/01-open-end.png', 'assets/present-bath-adult-v4/02-wash.mp4', 'Lavarse la cara', [39,68,25,18]],
  ['Baño', 'assets/present-bath-adult-v4/02-wash-end.png', 'assets/present-bath-adult-v4/03-close.mp4', 'Cerrar la canilla', [66,59,15,22]],
  ['Baño', 'assets/present-bath-adult-v4/03-close-end.png', 'assets/present-bath-adult-v4/04-exit.mp4', 'Salir del baño', [0,15,18,80]],
];
export const PRESENT_WALK_EMPTY = 'assets/present-bath-adult-v4/04-exit-end.png';
export const PRESENT_WALK_TO_KITCHEN = 'qa/present/hall-kitchen-v2.mp4';

export function resolveWalkStep(value) {
  // Older saves stopped on the empty bathroom; resume in the hallway now.
  if (value === PRESENT_WALK_STAGES.length) return 1;
  return Number.isInteger(value) && value >= 0 && value <= PRESENT_WALK_STAGES.length ? value : 0;
}
