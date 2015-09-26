"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function link(prev, next) {
  if (prev) {
    prev.next = next;
  }

  if (next) {
    next.prev = prev;
  }
}

var LinkedListNode = (function () {
  function LinkedListNode() {
    _classCallCheck(this, LinkedListNode);
  }

  LinkedListNode.prototype.insertAfter = function insertAfter(node) {
    link(node, this.next);
    link(this, node);
  };

  LinkedListNode.prototype.unlink = function unlink() {
    link(this.prev, this.next);
    this.prev = undefined;
    this.next = undefined;
  };

  return LinkedListNode;
})();

exports["default"] = LinkedListNode;
module.exports = exports["default"];