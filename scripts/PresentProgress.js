const ROOMS = new Set(['bedroom', 'hall', 'bathroom', 'kitchen']);

export function resolveMemoryReturnScene(storage) {
  if (!storage.get('PRESENT_MEMORY_RETURN')) return 'INTRO';
  const origin = storage.get('PRESENT_RETURN_SCENE');
  return ['PRESENT_PREVIEW', 'PRESENT_KITCHEN_THIRD', 'INTRO'].includes(origin)
    ? origin : 'PRESENT_PREVIEW';
}

export function resolvePresentRoom(storage, requestedRoom = null) {
  if (ROOMS.has(requestedRoom)) return requestedRoom;
  // A memory always returns us to the object that evoked it.
  if (storage.get('PRESENT_MEMORY_RETURN')) return 'kitchen';
  const saved = storage.get('PRESENT_ROOM');
  if (ROOMS.has(saved)) return saved;
  // Migration from saves made before the house existed.
  return ['MATE_COMPLETED', 'CAR_COMPLETED', 'RADIO_COMPLETED'].some(key => storage.get(key)) ? 'kitchen' : 'bedroom';
}
