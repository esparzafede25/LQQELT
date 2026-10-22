const ITEMS = new Set(['mate','wrench','map','envelope']);
export function resolvePackedItems(value) {
  return Array.isArray(value) ? [...new Set(value.filter(item => ITEMS.has(item)))] : [];
}