import invariant = require('invariant');
import Attrs, { AttrsObject } from './Attrs';
import Override from './Override';

export enum CtrlType {
  TITLE,
  ETC,
};

export interface LinkedListNode<T> {
  prev: LinkedListNode<T>;
  next: LinkedListNode<T>;
}

function link<T>(prev: LinkedListNode<T>, next: LinkedListNode<T>) {
  if (prev) {
    prev.next = next;
  }

  if (next) {
    next.prev = prev;
  }
}

export function validateTitle(tagName: string, value: string) {
  invariant(typeof value === 'string', 'render value for <title> must be a string');
}

export function validateEtc(tagName: string, value: AttrsObject) {
  invariant(typeof value === 'object', `render value for <${tagName}> must be an object`);
}

export const validator = {
  [CtrlType.TITLE]: validateTitle,
  [CtrlType.ETC]: validateEtc,
};

export interface Listener {
  (): void;
}

export interface AddListener {
  (listener: Listener): any;
}

export interface RemoveListener {
  (listener: Listener, _addListenerRet?: any): any;
}

export interface ControllerOptions {
  addListener?: AddListener;
  removeListener?: RemoveListener;
  close?: boolean;
}

export interface RenderFunc<T> {
  (): T;
}

class Controller<T> implements LinkedListNode<Controller<T>> {
  id: number;
  override: Override;
  selector: string;

  prev: Controller<T>;
  next: Controller<T>;

  type: CtrlType;
  attrs: Attrs;
  tagName: string;

  needsToClose: boolean;

  render: RenderFunc<T>;
  addListener: AddListener;
  removeListener: RemoveListener;

  _originalElement: Node;

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
   * @param {CtrlType} type Type of controller.
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
  constructor(
    type: CtrlType, tagName: string, attrs: AttrsObject, render: RenderFunc<T>, options: ControllerOptions = {},
  ) {
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

    this.needsToClose = !!options.close;
  }

  insertAfter(node: Controller<T>) {
    link(node, this.next);
    link(this, node);
  }

  unlink() {
    link(this.prev, this.next);
    this.prev = undefined;
    this.next = undefined;
  }
}

export default Controller;
