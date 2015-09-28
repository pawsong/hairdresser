import invariant from 'invariant';

import Attrs from './Attrs';

export const CTRL_TYPE = {
  TITLE: 'title',
  ETC: 'etc',
};

function link(prev, next) {
  if (prev) {
    prev.next = next;
  }

  if (next) {
    next.prev = prev;
  }
}

export default class Controller {

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
  constructor(type, tagName, attrs, render, options = {}) {
    invariant(typeof render === 'function', 'render function is required');
    invariant(!options.addListener || options.removeListener,
              'addListener requires removeListener');

    this.type = type;

    this.attrs = new Attrs(attrs);
    this.tagName = tagName;
    this.selector = this.tagName + this.attrs.selector;

    this.render = render;

    this.addListener = options.addListener;
    this.removeListener = options.removeListener;
  }

  insertAfter(node) {
    link(node, this.next);
    link(this, node);
  }

  unlink() {
    link(this.prev, this.next);
    this.prev = undefined;
    this.next = undefined;
  }
}
