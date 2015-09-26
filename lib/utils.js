'use strict';

exports.__esModule = true;
function removeItem(array, item) {
  var i = array.indexOf(item);
  if (i !== -1) {
    array.splice(i, 1);
  }
}

function createIdGenerator() {
  var id = 0;
  return function () {
    return ++id;
  };
}

function canUseDOM() {
  return typeof document !== 'undefined';
}

exports['default'] = {
  removeItem: removeItem,
  createIdGenerator: createIdGenerator,
  canUseDOM: canUseDOM
};
module.exports = exports['default'];