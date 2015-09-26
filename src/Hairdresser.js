import invariant from 'invariant';

import {
  canUseDOM,
  removeItem,
  createIdGenerator,
} from './utils';
import Attrs from './classes/Attrs';
import Controller from './classes/Controller';
import createEventManager from './createEventManager';

function isElementCacheValid(elem, attrs) {
  if (elem.parentNode !== document.head) {
    return false;
  }
  return attrs.each((name, value) => elem.getAttribute(name) === value);
}

const validator = {
  [Controller.CTRL_TYPE.TITLE]: (tagName, value) => {
    invariant(typeof value === 'string', 'render value for <title> must be a string');
  },

  [Controller.CTRL_TYPE.ETC]: (tagName, value) => {
    invariant(typeof value === 'object', `render value for <${tagName}> must be an object`);
  },
};

/**
 * @callback addListener
 * @param {function} callback A function to be bound to event emitter.
 * @return {*} A value to pass to {@link removeListener}.
 */

/**
 * @callback removeListener
 * @param {*} addListenerReturnValue Return value of addListener
 */

export default class Hairdresser {
  /**
   * Create a Hairdresser instance.
   *
   * @return {Hairdresser} Hairdresser instance.
   */
  static create() {
    return new Hairdresser();
  }

  /**
   * Expose to allow access to Controller static members. (ex. CTRL_TYPE)
   */
  static get Controller() {
    return Controller;
  }

  /**
   * Hairdresser constructor.
   *
   * @constructs Hairdresser
   * @return {Hairdresser} a new Hairdresser instance.
   */
  constructor() {
    const topControllers = this._topControllers = {
      /* [selector]: controller */
    };

    const observerList = this._observerList = [];

    const generateOverrideId = createIdGenerator();
    const generateControllerId = createIdGenerator();

    const addControllerToOverride = (override, controller) => {
      invariant(controller instanceof Controller,
                'controller must be an instance of Controller');

      controller.override = override;
      override.controllers.push(controller);

      controller.id = generateControllerId();

      // Append inserted controller to currently top controller
      const curTopController = topControllers[controller.selector];
      if (curTopController) {
        curTopController.insertAfter(controller);
      }

      topControllers[controller.selector] = controller;

      // Fire event to listening observers
      observerList.forEach(observer => {
        observer.onAddController(controller);
      });
    };

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
    function Override(options) {
      invariant(!options.addListener || options.removeListener,
                'addListener requires removeListener');

      this.addListener = options.addListener;
      this.removeListener = options.removeListener;
      this.controllers = [];
      this.id = generateOverrideId();
    }

    Override.prototype.getController = function getController(tagName, attrs) {
      const selector = tagName + (attrs ? Attrs.toSelector(attrs) : '');

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
     * @param {string} type Type of controller.
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
    Override.prototype.addController = function addController(type, tagName, attrs,
                                                              render, options = {}) {
      let renderFunc;
      if (typeof render !== 'function') {
        validator[type](tagName, render);
        renderFunc = () => render;
      } else {
        renderFunc = render;
      }

      const controller = new Controller(type, tagName, attrs, renderFunc, options);
      addControllerToOverride(this, controller);
      return this;
    };

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
    Override.prototype.title = function title(render, options) {
      return this.addController(Controller.CTRL_TYPE.TITLE, 'title', {}, render, options);
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
     * @return {Override} Itself.
     */
    Override.prototype.meta = function meta(attrs, render, options) {
      return this.addController(Controller.CTRL_TYPE.ETC, 'meta', attrs, render, options);
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
     * @return {Override} Itself.
     */
    Override.prototype.link = function link(attrs, render, options) {
      return this.addController(Controller.CTRL_TYPE.ETC, 'link', attrs, render, options);
    };

    /**
     * Rerender elements of override's listening controllers.
     *
     * @memberof Override
     * @return {undefined}
     */
    Override.prototype.update = function update() {
      // Fire event to listening observers
      observerList.forEach(observer => {
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
    Override.prototype.restore = function restore() {
      // Fire event to listening observers
      observerList.forEach(observer => {
        observer.onPreRemoveOverride(this);
      });

      this.controllers.forEach(controller => {
        if (controller.prev) {
          topControllers[controller.selector] = controller.prev;
        } else {
          delete topControllers[controller.selector];
        }
        controller.unlink();
      });
    };

    this.Override = Override;
  }

  _getActiveController(tagName, attrs) {
    const selector = tagName + (attrs ? Attrs.toSelector(attrs) : '');
    return this._topControllers[selector];
  }

  _getActiveControllers() {
    return Object.keys(this._topControllers).sort()
      .map(selector => this._topControllers[selector]);
  }

  _addObserver(observer) {
    this._observerList.push(observer);
    return () => {
      removeItem(this._observerList, observer);
    };
  }

  /**
   * Create a override instance for overriding current top controllers.
   *
   * When override listener receives an event, top controllers in override
   * rerenders their elements.
   *
   * @param {object} options Override options
   * @param {addListener} options.addListener A function that adds override
   * listener to event listener.
   * @param {removeListener} options.removeListener A function that removes
   * override listener.
   * @return {Override} A override instance.
   */
  override(options = {}) {
    return new this.Override(options);
  }

  _renderOnce(eventHandlers) {
    this._getActiveControllers().forEach(controller => {
      eventHandlers[controller.type].onUpdate(controller);
    });
  }

  _renderAndListen(eventHandlers) {
    const {
      startListeningController,
      stopListeningController,
      isControllerListening,
      removeController,
      updateOverride,
      removeOverride,
      destroy: destroyEventManager,
    } = createEventManager(eventHandlers);

    // Render and start listening
    this._getActiveControllers().forEach(startListeningController);

    const removeObserver = this._addObserver({
      onAddController: controller => {
        // Add controller listeners
        if (controller.prev) {
          stopListeningController(controller.prev);
        }
        startListeningController(controller);
      },

      onUpdate: override => {
        // Update controller listeners
        updateOverride(override);
      },

      onPreRemoveOverride: override => {
        override.controllers.forEach(controller => {
          if (isControllerListening(controller)) {
            stopListeningController(controller);
            if (controller.prev) {
              startListeningController(controller.prev);
            }
          }
          removeController(controller);
        });
        removeOverride(override);
      },
    });

    return () => {
      removeObserver();
      destroyEventManager();
    };
  }

  /**
   * Renders HTML elements as a markup string.
   *
   * @return {string} the HTML markup
   */
  renderToString() {
    const result = [];

    this._renderOnce({
      [Controller.CTRL_TYPE.TITLE]: {
        onUpdate: controller => {
          const newTitle = controller.render();
          validator[Controller.CTRL_TYPE.TITLE](controller.tagName, newTitle);

          result.push(`<title>${newTitle}</title>`);
        },
      },
      [Controller.CTRL_TYPE.ETC]: {
        onUpdate: controller => {
          const newAttrs = controller.render();
          validator[Controller.CTRL_TYPE.ETC](controller.tagName, newAttrs);

          // Update attributes
          result.push(
            `<${controller.tagName} ${controller.attrs.html} ${Attrs.toHtml(newAttrs)}>`
          );
        },
      },
    });

    return result.join('');
  }

  /**
   * Renders HTML elements into the DOM in the `<head>` element,
   * and watch further changes of the hairdresser instance.
   *
   * @return {function} Restore changes and stop watching the hairdresser
   * instance function.
   */
  render() {
    invariant(canUseDOM(),
              'Cannot use DOM object. ' +
              'Make sure `window` and `document` are available globally.');

    const cachedElem = {};

    function getElement(controller) {
      const elem = cachedElem[controller.id];
      if (!elem) {
        return null;
      }

      if (isElementCacheValid(elem, controller.attrs)) {
        return elem;
      }

      delete cachedElem[controller.id];
      return null;
    }

    function ensureElement(controller) {
      let element = getElement(controller);
      if (element) {
        return element;
      }

      element = document.head.querySelector(`${controller.selector}`);

      if (element) {
        cachedElem[controller.id] = element;
        return element;
      }

      element = document.createElement(controller.tagName);
      controller.attrs.each((name, value) => {
        element.setAttribute(name, value);
      });
      document.head.appendChild(element);

      cachedElem[controller.id] = element;
      return element;
    }

    const oldTitle = document.title;

    return this._renderAndListen({
      [Controller.CTRL_TYPE.TITLE]: {
        onUpdate: controller => {
          const newTitle = controller.render();
          validator[Controller.CTRL_TYPE.TITLE](controller.tagName, newTitle);
          document.title = newTitle;
        },

        onStop: controller => {
          if (!controller.prev && !controller.next) {
            document.title = oldTitle;
          }
        },
      },
      [Controller.CTRL_TYPE.ETC]: {
        onUpdate: controller => {
          const element = ensureElement(controller);

          // Update attributes
          const newAttrs = controller.render();
          validator[Controller.CTRL_TYPE.ETC](controller.tagName, newAttrs);

          Object.keys(newAttrs).forEach(attrName => {
            element.setAttribute(attrName, newAttrs[attrName]);
          });
        },

        onStop: controller => {
          if (!controller.prev && !controller.next) {
            const element = getElement(controller);
            if (element) {
              element.parentNode.removeChild(element);
            }
          }
        },
      },
    });
  }
}
