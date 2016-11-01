"use strict";
function removeItem(array, item) {
    var i = array.indexOf(item);
    if (i !== -1) {
        array.splice(i, 1);
    }
}
exports.removeItem = removeItem;
function createIdGenerator() {
    var id = 0;
    return function () { return ++id; };
}
exports.createIdGenerator = createIdGenerator;
function canUseDOM() {
    return typeof document !== 'undefined';
}
exports.canUseDOM = canUseDOM;
//# sourceMappingURL=utils.js.map