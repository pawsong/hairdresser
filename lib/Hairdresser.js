'use strict';

exports.__esModule = true;

var _validator;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _utils = require('./utils');

var _classesAttrs = require('./classes/Attrs');

var _classesAttrs2 = _interopRequireDefault(_classesAttrs);

var _classesController = require('./classes/Controller');

var _classesController2 = _interopRequireDefault(_classesController);

var _createEventManager2 = require('./createEventManager');

var _createEventManager3 = _interopRequireDefault(_createEventManager2);

var validator = (_validator = {}, _validator[_classesController.CTRL_TYPE.TITLE] = function (tagName, value) {
  _invariant2['default'](typeof value === 'string', 'render value for <title> must be a string');
}, _validator[_classesController.CTRL_TYPE.ETC] = function (tagName, value) {
  _invariant2['default'](typeof value === 'object', 'render value for <' + tagName + '> must be an object');
}, _validator);

/**
 * @callback addListener
 * @param {function} callback A function to be bound to event emitter.
 * @return {*} A value to pass to {@link removeListener}.
 */

/**
 * @callback removeListener
 * @param {*} addListenerReturnValue Return value of addListener
 */

var Hairdresser = (function () {
  /**
   * Create a Hairdresser instance.
   *
   * @return {Hairdresser} Hairdresser instance.
   */

  Hairdresser.create = function create() {
    return new Hairdresser();
  };

  /**
   * Hairdresser constructor.
   *
   * @constructs Hairdresser
   * @return {Hairdresser} a new Hairdresser instance.
   */

  function Hairdresser() {
    _classCallCheck(this, Hairdresser);

    var topControllers = this._topControllers = {
      /* [selector]: controller */
    };

    var observerList = this._observerList = [];

    var generateOverrideId = _utils.createIdGenerator();
    var generateControllerId = _utils.createIdGenerator();

    var addControllerToOverride = function addControllerToOverride(override, controller) {
      _invariant2['default'](controller instanceof _classesController2['default'], 'controller must be an instance of Controller');

      controller.override = override;
      override.controllers.push(controller);

      controller.id = generateControllerId();

      // Append inserted controller to currently top controller
      var curTopController = topControllers[controller.selector];
      if (curTopController) {
        curTopController.insertAfter(controller);
      }

      topControllers[controller.selector] = controller;

      // Fire event to listening observers
      observerList.forEach(function (observer) {
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
      _invariant2['default'](!options.addListener || options.removeListener, 'addListener requires removeListener');

      this.addListener = options.addListener;
      this.removeListener = options.removeListener;
      this.controllers = [];
      this.id = generateOverrideId();
    }

    Override.prototype.getController = function getController(tagName, attrs) {
      var selector = tagName + (attrs ? _classesAttrs2['default'].toSelector(attrs) : '');

      // Loop from tail to head to select latest inserted value.
      for (var i = this.controllers.length - 1; i >= 0; --i) {
        var controller = this.controllers[i];
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
    Override.prototype.addController = function addController(type, tagName, attrs, render) {
      var options = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];

      var renderFunc = undefined;
      if (typeof render !== 'function') {
        validator[type](tagName, render);
        renderFunc = function () {
          return render;
        };
      } else {
        renderFunc = render;
      }

      var controller = new _classesController2['default'](type, tagName, attrs, renderFunc, options);
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
      return this.addController(_classesController.CTRL_TYPE.TITLE, 'title', {}, render, options);
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
      return this.addController(_classesController.CTRL_TYPE.ETC, 'meta', attrs, render, options);
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
      return this.addController(_classesController.CTRL_TYPE.ETC, 'link', attrs, render, options);
    };

    /**
     * Rerender elements of override's listening controllers.
     *
     * @memberof Override
     * @return {undefined}
     */
    Override.prototype.update = function update() {
      var _this = this;

      // Fire event to listening observers
      observerList.forEach(function (observer) {
        observer.onUpdate(_this);
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
      var _this2 = this;

      // Fire event to listening observers
      observerList.forEach(function (observer) {
        observer.onPreRemoveOverride(_this2);
      });

      this.controllers.forEach(function (controller) {
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

  Hairdresser.prototype._getActiveController = function _getActiveController(tagName, attrs) {
    var selector = tagName + (attrs ? _classesAttrs2['default'].toSelector(attrs) : '');
    return this._topControllers[selector];
  };

  Hairdresser.prototype._getActiveControllers = function _getActiveControllers() {
    var _this3 = this;

    return Object.keys(this._topControllers).sort().map(function (selector) {
      return _this3._topControllers[selector];
    });
  };

  Hairdresser.prototype._addObserver = function _addObserver(observer) {
    var _this4 = this;

    this._observerList.push(observer);
    return function () {
      _utils.removeItem(_this4._observerList, observer);
    };
  };

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

  Hairdresser.prototype.override = function override() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    return new this.Override(options);
  };

  Hairdresser.prototype._renderOnce = function _renderOnce(eventHandlers) {
    this._getActiveControllers().forEach(function (controller) {
      eventHandlers[controller.type].onUpdate(controller);
    });
  };

  Hairdresser.prototype._renderAndListen = function _renderAndListen(eventHandlers) {
    var _createEventManager = _createEventManager3['default'](eventHandlers);

    var startListeningController = _createEventManager.startListeningController;
    var stopListeningController = _createEventManager.stopListeningController;
    var isControllerListening = _createEventManager.isControllerListening;
    var removeController = _createEventManager.removeController;
    var updateOverride = _createEventManager.updateOverride;
    var removeOverride = _createEventManager.removeOverride;
    var destroyEventManager = _createEventManager.destroy;

    // Render and start listening
    this._getActiveControllers().forEach(startListeningController);

    var removeObserver = this._addObserver({
      onAddController: function onAddController(controller) {
        // Add controller listeners
        if (controller.prev) {
          stopListeningController(controller.prev);
        }
        startListeningController(controller);
      },

      onUpdate: function onUpdate(override) {
        // Update controller listeners
        updateOverride(override);
      },

      onPreRemoveOverride: function onPreRemoveOverride(override) {
        override.controllers.forEach(function (controller) {
          if (isControllerListening(controller)) {
            stopListeningController(controller);
            if (controller.prev) {
              startListeningController(controller.prev);
            }
          }
          removeController(controller);
        });
        removeOverride(override);
      }
    });

    return function () {
      removeObserver();
      destroyEventManager();
    };
  };

  /**
   * Renders HTML elements as a markup string.
   *
   * @return {string} the HTML markup
   */

  Hairdresser.prototype.renderToString = function renderToString() {
    var _renderOnce2;

    var result = [];

    this._renderOnce((_renderOnce2 = {}, _renderOnce2[_classesController.CTRL_TYPE.TITLE] = {
      onUpdate: function onUpdate(controller) {
        var newTitle = controller.render();
        validator[_classesController.CTRL_TYPE.TITLE](controller.tagName, newTitle);

        result.push('<title>' + newTitle + '</title>');
      }
    }, _renderOnce2[_classesController.CTRL_TYPE.ETC] = {
      onUpdate: function onUpdate(controller) {
        var newAttrs = controller.render();
        validator[_classesController.CTRL_TYPE.ETC](controller.tagName, newAttrs);

        // Update attributes
        result.push('<' + controller.tagName + ' ' + controller.attrs.html + ' ' + _classesAttrs2['default'].toHtml(newAttrs) + '>');
      }
    }, _renderOnce2));

    return result.join('');
  };

  /**
   * Renders HTML elements into the DOM in the `<head>` element,
   * and watch further changes of the hairdresser instance.
   *
   * @return {function} Restore changes and stop watching the hairdresser
   * instance function.
   */

  Hairdresser.prototype.render = function render() {
    var _renderAndListen2;

    _invariant2['default'](_utils.canUseDOM(), 'Cannot use DOM object. ' + 'Make sure `window` and `document` are available globally.');

    var head = document.getElementsByTagName('head')[0];

    function isElementCacheValid(elem, attrs) {
      if (elem.parentNode !== head) {
        return false;
      }
      return attrs.each(function (name, value) {
        return elem.getAttribute(name) === value;
      });
    }

    var cachedElem = {};

    function getElement(controller) {
      var elem = cachedElem[controller.id];
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
      var element = getElement(controller);
      if (element) {
        return element;
      }

      element = head.querySelector('' + controller.selector);

      if (element) {
        cachedElem[controller.id] = element;
        return element;
      }

      element = document.createElement(controller.tagName);
      controller.attrs.each(function (name, value) {
        element.setAttribute(name, value);
      });
      head.appendChild(element);

      cachedElem[controller.id] = element;
      return element;
    }

    var oldTitle = document.title;

    return this._renderAndListen((_renderAndListen2 = {}, _renderAndListen2[_classesController.CTRL_TYPE.TITLE] = {
      onUpdate: function onUpdate(controller) {
        var newTitle = controller.render();
        validator[_classesController.CTRL_TYPE.TITLE](controller.tagName, newTitle);
        document.title = newTitle;
      },

      onStop: function onStop(controller) {
        if (!controller.prev && !controller.next) {
          document.title = oldTitle;
        }
      }
    }, _renderAndListen2[_classesController.CTRL_TYPE.ETC] = {
      onUpdate: function onUpdate(controller) {
        var element = ensureElement(controller);

        // Update attributes
        var newAttrs = controller.render();
        validator[_classesController.CTRL_TYPE.ETC](controller.tagName, newAttrs);

        Object.keys(newAttrs).forEach(function (attrName) {
          element.setAttribute(attrName, newAttrs[attrName]);
        });
      },

      onStop: function onStop(controller) {
        if (!controller.prev && !controller.next) {
          var element = getElement(controller);
          if (element) {
            element.parentNode.removeChild(element);
          }
        }
      }
    }, _renderAndListen2));
  };

  return Hairdresser;
})();

exports['default'] = Hairdresser;
module.exports = exports['default'];