import invariant = require('invariant');

import {
  canUseDOM,
  removeItem,
  createIdGenerator,
} from './utils';
import Attrs, { AttrsObject, toSelector, toHtml } from './Attrs';
import Controller, {
  CtrlType,
  validateTitle,
  validateEtc,
} from './Controller';
import Override, { OverrideOptions } from './Override';
import EventManager, { TitleEventHandler, EtcEventHandler } from './EventManager';

export interface Observer {
  onAddController(controller: Controller<any>): void;
  onUpdate(override: Override): void;
  onPreRemoveOverride(override: Override): void;
}

/**
 * @callback addListener
 * @param {function} listener A function to be bound to event emitter.
 * @return {*} A value to pass to {@link removeListener}.
 */

/**
 * @callback removeListener
 * @param {function} listener A function to be removed from event emitter.
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

  _topControllers: { [index: string]: Controller<any> };
  _observerList: Observer[];

  _generateOverrideId: () => number;
  _generateControllerId: () => number;

  /**
   * Hairdresser constructor.
   *
   * @constructs Hairdresser
   * @return {Hairdresser} a new Hairdresser instance.
   */
  constructor() {
    this._topControllers = {};
    this._observerList = [];

    this._generateOverrideId = createIdGenerator();
    this._generateControllerId = createIdGenerator();
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
  public override(options: OverrideOptions = {}) {
    return new Override(this, options);
  }

  /**
   * Renders HTML elements as a markup string.
   *
   * @return {string} the HTML markup
   */
  public renderToString() {
    const result: string[] = [];

    this._renderOnce({
      onUpdate: controller => {
        const newTitle = controller.render();
        validateTitle(controller.tagName, newTitle);

        result.push(`<title>${newTitle}</title>`);
      },
    }, {
      onUpdate: controller => {
        const newAttrs = controller.render();
        validateEtc(controller.tagName, newAttrs);

        const newAttrsStr = toHtml(newAttrs);

        // Update attributes
        result.push(
          `<${controller.tagName} ${controller.attrs.html}` +
            `${newAttrsStr ? ' ' + newAttrsStr : ''}>` +
            (controller.needsToClose ? `</${controller.tagName}>` : '')
        );
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
  public render() {
    invariant(canUseDOM(),
              'Cannot use DOM object. ' +
              'Make sure `window` and `document` are available globally.');

    const head = document.getElementsByTagName('head')[0];

    function isElementCacheValid(elem: Element, attrs: Attrs) {
      if (elem.parentNode !== head) {
        return false;
      }
      return attrs.each((name, value) => elem.getAttribute(name) === value);
    }

    const cachedElem: { [index: string]: Element } = {};

    function getElement<T>(controller: Controller<T>) {
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

    function ensureElement<T>(controller: Controller<T>) {
      let element = getElement(controller);
      if (element) {
        return element;
      }

      element = head.querySelector(`${controller.selector}`);

      if (element) {
        cachedElem[controller.id] = element;
        return element;
      }

      element = document.createElement(controller.tagName);
      controller.attrs.each((name, value) => {
        element.setAttribute(name, value);
        return true;
      });
      head.appendChild(element);

      cachedElem[controller.id] = element;
      return element;
    }

    const oldTitle = document.title;

    return this._renderAndListen({
      onUpdate: controller => {
        const newTitle = controller.render();
        validateTitle(controller.tagName, newTitle);
        document.title = newTitle;
      },

      onStop: controller => {
        if (!controller.prev && !controller.next) {
          document.title = oldTitle;
        }
      },
    }, {
      onUpdate: controller => {
        const element = ensureElement(controller);

        // Update attributes
        const newAttrs = controller.render();
        validateEtc(controller.tagName, newAttrs);

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
    });
  }

  _addControllerToOverride<T>(override: Override, controller: Controller<T>) {
    invariant(controller instanceof Controller, 'controller must be an instance of Controller');

    controller.override = override;
    override.controllers.push(controller);

    controller.id = this._generateControllerId();

    // Append inserted controller to currently top controller
    const curTopController = this._topControllers[controller.selector];
    if (curTopController) {
      curTopController.insertAfter(controller);
    }

    this._topControllers[controller.selector] = controller;

    // Fire event to listening observers
    this._observerList.forEach(observer => {
      observer.onAddController(controller);
    });
  };

  _getActiveController(tagName: string, attrs?: AttrsObject) {
    const selector = tagName + (attrs ? toSelector(attrs) : '');
    return this._topControllers[selector];
  }

  _renderAndListen(titleHandler: TitleEventHandler, etcHandler?: EtcEventHandler) {
    const eventManager = new EventManager(titleHandler, etcHandler);

    // Render and start listening
    this._getActiveControllers()
      .forEach(controller => eventManager.startListeningController(controller));

    const removeObserver = this._addObserver({
      onAddController: controller => {
        // Add controller listeners
        if (controller.prev) {
          eventManager.stopListeningController(controller.prev);
        }
        eventManager.startListeningController(controller);
      },

      onUpdate: override => {
        // Update controller listeners
        eventManager.updateOverride(override);
      },

      onPreRemoveOverride: override => {
        override.controllers.forEach(controller => {
          if (eventManager.isControllerListening(controller)) {
            eventManager.stopListeningController(controller);
            if (controller.prev) {
              eventManager.startListeningController(controller.prev);
            }
          }
          eventManager.removeController(controller);
        });
        eventManager.removeOverride(override);
      },
    });

    return () => {
      removeObserver();
      eventManager.destroy();
    };
  }

  private _getActiveControllers() {
    return Object.keys(this._topControllers).sort()
      .map(selector => this._topControllers[selector]);
  }

  private _addObserver(observer: Observer) {
    this._observerList.push(observer);
    return () => {
      removeItem(this._observerList, observer);
    };
  }

  private _renderOnce(titleHandler: TitleEventHandler, etcHandler: EtcEventHandler) {
    this._getActiveControllers().forEach(controller => {
      switch (controller.type) {
        case CtrlType.TITLE: {
          titleHandler.onUpdate(controller);
          break;
        }
        case CtrlType.ETC: {
          etcHandler.onUpdate(controller);
          break;
        }
        default: {
          break;
        }
      }
    });
  }
}
