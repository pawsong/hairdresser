function removeItem(array, item) {
  const i = array.indexOf(item);
  if (i !== -1) {
    array.splice(i, 1);
  }
}

function createIdGenerator() {
  let id = 0;
  return () => ++id;
}

function canUseDOM() {
  return typeof document !== 'undefined';
}

export default {
  removeItem,
  createIdGenerator,
  canUseDOM,
};
