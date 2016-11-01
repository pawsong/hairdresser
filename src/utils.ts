export function removeItem<T>(array: T[], item: T) {
  const i = array.indexOf(item);
  if (i !== -1) {
    array.splice(i, 1);
  }
}

export function createIdGenerator() {
  let id = 0;
  return () => ++id;
}

export function canUseDOM() {
  return typeof document !== 'undefined';
}
