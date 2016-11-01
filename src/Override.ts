import invariant = require('invariant');
import { AttrsObject, toSelector } from './Attrs';
import Controller, {
  ControllerOptions, CtrlType, RenderFunc,
  validateTitle,
  validateEtc,
  AddListener, RemoveListener,
} from './Controller';
import Hairdresser from './Hairdresser';

export interface OverrideOptions {
  addListener?: AddListener;
  removeListener?: RemoveListener;
}

export type StringOrRenderFunc<T> = string | AttrsObject | RenderFunc<T>;

/**
 * Override is the unit of override and consists of a set of controllers.
 *
 * When controller is added to override, the controller overrides top controller.
 * That is, Added controller becomes new top controller and starts listenings,
 * and previous top controller stops listening.
 *
 * @class Override
 * @param {object} options Override options.
 * @return {Override} a new Override instance.
 */
class Override {
  id: number;
  controllers: Controller<any>[];

  addListener: AddListener;
  removeListener: RemoveListener;

  private _hairdresser: Hairdresser;

  constructor(hairdresser: Hairdresser, options: OverrideOptions) {
    invariant(!options.addListener || options.removeListener,
              'addListener requires removeListener');

    this._hairdresser = hairdresser;
    this.addListener = options.addListener;
    this.removeListener = options.removeListener;
    this.controllers = [];
    this.id = hairdresser._generateOverrideId();
  }

  /**
   * Add controller for `<title>` element.
   *
   * @memberof Override
   * @param {*} render A string which replaces `<title>` value or a function
   * that returns the title replacing string value.
   * @param {object} options Options for element controller.
   * @param {addListener} options.addListener A function that adds controller
   * listener to event emitter.
   * @param {removeListener} options.removeListener A function that removes
   * controller listener.
   * @return {Override} Itself.
   */
  title(render: StringOrRenderFunc<string>, options?: ControllerOptions) {
    return this.addController(CtrlType.TITLE, 'title', {}, render, options);
  };

  /**
   * Add controller for element with given tag name.
   *
   * @memberof Override
   * @param {string} tagName Element tag name.
   * @param {object} attrs Object containing key-value attribute pairs which
   * is used to find element to bind controller to.
   * @param {*} render An object that represents new key-value attribute pairs
   * which will be added to controller's element or a function that returns
   * the object.
   * @param {object} options Options for element controller.
   * @param {addListener} options.addListener A function that adds controller
   * listener to event emitter.
   * @param {removeListener} options.removeListener A function that removes
   * controller listener.
   * @param {boolean} options.close Whether to append closing tag.
   * @return {Override} Itself.
   */
  tag(tagName: string, attrs: AttrsObject, render: StringOrRenderFunc<AttrsObject>, options?: ControllerOptions) {
    return this.addController(CtrlType.ETC, tagName, attrs, render, options);
  };

  /**
   * Add controller for `<meta>` element.
   *
   * @memberof Override
   * @param {object} attrs Object containing key-value attribute pairs which
   * is used to find element to bind controller to.
   * @param {*} render An object that represents new key-value attribute pairs
   * which will be added to controller's element or a function that returns
   * the object.
   * @param {object} options Options for element controller.
   * @param {addListener} options.addListener A function that adds controller
   * listener to event emitter.
   * @param {removeListener} options.removeListener A function that removes
   * controller listener.
   * @param {boolean} options.close Whether to append closing tag.
   * @return {Override} Itself.
   */
  meta(attrs: AttrsObject, render: StringOrRenderFunc<AttrsObject>, options?: ControllerOptions) {
    return this.tag('meta', attrs, render, options);
  };

  /**
   * Add controller for `<link>` element.
   *
   * @memberof Override
   * @param {object} attrs Object containing key-value attribute pairs which
   * is used to find element to bind controller to.
   * @param {*} render An object that represents new key-value attribute pairs
   * which will be added to controller's element or a function that returns
   * the object.
   * @param {object} options Options for element controller.
   * @param {addListener} options.addListener A function that adds controller
   * listener to event emitter.
   * @param {removeListener} options.removeListener A function that removes
   * controller listener.
   * @param {boolean} options.close Whether to append closing tag.
   * @return {Override} Itself.
   */
  link(attrs: AttrsObject, render: StringOrRenderFunc<AttrsObject>, options?: ControllerOptions) {
    return this.tag('link', attrs, render, options);
  };

  /**
   * Rerender elements of override's listening controllers.
   *
   * @memberof Override
   * @return {undefined}
   */
  update() {
    // Fire event to listening observers
    this._hairdresser._observerList.forEach(observer => {
      observer.onUpdate(this);
    });
  };

  /**
   * Remove all override's controllers.
   *
   * When controller is top, the previous controller will become top.
   * If previous controller does not exists, the element bound to this
   * controller will be removed.
   *
   * @memberof Override
   * @return {undefined}
   */
  restore() {
    // Fire event to listening observers
    this._hairdresser._observerList.forEach(observer => {
      observer.onPreRemoveOverride(this);
    });

    this.controllers.forEach(controller => {
      if (controller.prev) {
        this._hairdresser._topControllers[controller.selector] = controller.prev;
      } else {
        delete this._hairdresser._topControllers[controller.selector];
      }
      controller.unlink();
    });
  };

  getController(tagName: string, attrs?: AttrsObject) {
    const selector = tagName + (attrs ? toSelector(attrs) : '');

    // Loop from tail to head to select latest inserted value.
    for (let i = this.controllers.length - 1; i >= 0; --i) {
      const controller = this.controllers[i];
      if (controller.selector === selector) {
        return controller;
      }
    }
    return null;
  };

  // TODO: Inherit document from Controller class

  /**
   * Add controller for arbitrary element.
   *
   * @memberof Override
   * @private
   * @param {CtrlType} type Type of controller.
   * @param {string} tagName Element tag name.
   * @param {object} attrs Object containing key-value attribute pairs which
   * is used to find element to bind controller to.
   * @param {*} render A value that replaces element contents or a function
   * that returns the element replacing value.
   * @param {object} options Options for element controller.
   * @param {addListener} options.addListener A function that adds controller
   * listener to event emitter.
   * @param {removeListener} options.removeListener A function that removes
   * controller listener.
   * @return {Override} Itself.
   */
  addController<T>(
    type: CtrlType, tagName: string, attrs: AttrsObject, render: StringOrRenderFunc<T>, options: ControllerOptions = {}
  ) {
    let renderFunc: RenderFunc<any>;

    if (typeof render !== 'function') {
      switch (type) {
        case CtrlType.TITLE: {
          validateTitle(tagName, <string> render);
          break;
        }
        case CtrlType.ETC: {
          validateEtc(tagName, <AttrsObject> render);
          break;
        }
        default: {
          break;
        }
      }
      renderFunc = () => render;
    } else {
      renderFunc = render;
    }

    const controller = new Controller(type, tagName, attrs, renderFunc, options);
    this._hairdresser._addControllerToOverride(this, controller);
    return this;
  };
}

export default Override;
