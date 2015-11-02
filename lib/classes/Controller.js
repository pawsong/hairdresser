'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _Attrs = require('./Attrs');

var _Attrs2 = _interopRequireDefault(_Attrs);

var CTRL_TYPE = {
  TITLE: 'title',
  ETC: 'etc'
};

exports.CTRL_TYPE = CTRL_TYPE;
function link(prev, next) {
  if (prev) {
    prev.next = next;
  }

  if (next) {
    next.prev = prev;
  }
}

var Controller = (function () {

  /**
   * Controller constructor.
   *
   * Controller is an object that manages an element in `<head>` element.
   * If multiple controllers are bound to one element, only the last bound
   * controller is used.
   * The last bound controller is called top controller.
   *
   * When top controller is removed, previous controller of that one becomes
   * the new top controller.
   *
   * @constructs Controller
   * @param {string} type Type of controller.
   * @param {string} tagName Element tag name.
   * @param {object} attrs Object containing key-value attribute pairs, which is
   * used to find element to bind controller to.
   * @param {function} render A function that returns new element value.
   * The type of return value depends on controller type.
   * @param {object} options Controller options.
   * @param {addListener} options.addListener A function that adds controller
   * listener to event emitter.
   * @param {removeListener} options.removeListener A function that removes
   * controller listener.
   * @return {Controller} a new Controller instance.
   */

  function Controller(type, tagName, attrs, render) {
    var options = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];

    _classCallCheck(this, Controller);

    _invariant2['default'](typeof render === 'function', 'render function is required');
    _invariant2['default'](!options.addListener || options.removeListener, 'addListener requires removeListener');

    this.type = type;

    this.attrs = new _Attrs2['default'](attrs);
    this.tagName = tagName;
    this.selector = this.tagName + this.attrs.selector;

    this.render = render;

    this.addListener = options.addListener;
    this.removeListener = options.removeListener;

    this.needsToClose = !!options.close;
  }

  Controller.prototype.insertAfter = function insertAfter(node) {
    link(node, this.next);
    link(this, node);
  };

  Controller.prototype.unlink = function unlink() {
    link(this.prev, this.next);
    this.prev = undefined;
    this.next = undefined;
  };

  return Controller;
})();

exports['default'] = Controller;