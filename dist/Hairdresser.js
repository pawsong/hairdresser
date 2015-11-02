(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Hairdresser"] = factory();
	else
		root["Hairdresser"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _validator;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _invariant = __webpack_require__(1);

	var _invariant2 = _interopRequireDefault(_invariant);

	var _utils = __webpack_require__(3);

	var _classesAttrs = __webpack_require__(2);

	var _classesAttrs2 = _interopRequireDefault(_classesAttrs);

	var _classesController = __webpack_require__(4);

	var _classesController2 = _interopRequireDefault(_classesController);

	var _createEventManager2 = __webpack_require__(5);

	var _createEventManager3 = _interopRequireDefault(_createEventManager2);

	var validator = (_validator = {}, _validator[_classesController.CTRL_TYPE.TITLE] = function (tagName, value) {
	  _invariant2['default'](typeof value === 'string', 'render value for <title> must be a string');
	}, _validator[_classesController.CTRL_TYPE.ETC] = function (tagName, value) {
	  _invariant2['default'](typeof value === 'object', 'render value for <' + tagName + '> must be an object');
	}, _validator);

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
	     * @private
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
	    Override.prototype.tag = function tag(tagName, attrs, render, options) {
	      return this.addController(_classesController.CTRL_TYPE.ETC, tagName, attrs, render, options);
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
	    Override.prototype.meta = function meta(attrs, render, options) {
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
	    Override.prototype.link = function link(attrs, render, options) {
	      return this.tag('link', attrs, render, options);
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

	        var newAttrsStr = _classesAttrs2['default'].toHtml(newAttrs);

	        // Update attributes
	        result.push('<' + controller.tagName + ' ' + controller.attrs.html + ((newAttrsStr ? ' ' + newAttrsStr : '') + '>') + (controller.needsToClose ? '</' + controller.tagName + '>' : ''));
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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule invariant
	 */

	'use strict';

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var invariant = function(condition, format, a, b, c, d, e, f) {
	  if (true) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error(
	        'Minified exception occurred; use the non-minified dev environment ' +
	        'for the full error message and additional helpful warnings.'
	      );
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(
	        'Invariant Violation: ' +
	        format.replace(/%s/g, function() { return args[argIndex++]; })
	      );
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};

	module.exports = invariant;


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var Attrs = (function () {
	  Attrs._toHtml = function _toHtml(keys, obj) {
	    return keys.map(function (key) {
	      return key + '="' + obj[key] + '"';
	    }).join(' ');
	  };

	  Attrs.toHtml = function toHtml(obj) {
	    return Attrs._toHtml(Object.keys(obj).sort(), obj);
	  };

	  Attrs._toSelector = function _toSelector(keys, obj) {
	    return keys.map(function (attrName) {
	      return '[' + attrName + '=\'' + obj[attrName] + '\']';
	    }).join('');
	  };

	  Attrs.toSelector = function toSelector(obj) {
	    return Attrs._toSelector(Object.keys(obj).sort(), obj);
	  };

	  function Attrs(obj) {
	    _classCallCheck(this, Attrs);

	    this._data = obj;

	    this._attrNames = Object.keys(this._data).sort();
	    this._attrNamesLen = this._attrNames.length;

	    this.html = Attrs._toHtml(this._attrNames, this._data);
	    this.selector = Attrs._toSelector(this._attrNames, this._data);
	  }

	  Attrs.prototype.each = function each(callback) {
	    for (var i = 0; i < this._attrNamesLen; ++i) {
	      var attrName = this._attrNames[i];
	      if (callback(attrName, this._data[attrName]) === false) {
	        return false;
	      }
	    }
	    return true;
	  };

	  return Attrs;
	})();

	exports['default'] = Attrs;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

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

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _invariant = __webpack_require__(1);

	var _invariant2 = _interopRequireDefault(_invariant);

	var _Attrs = __webpack_require__(2);

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

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = createEventManager;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _invariant = __webpack_require__(1);

	var _invariant2 = _interopRequireDefault(_invariant);

	var _utils = __webpack_require__(3);

	var OverrideListener = (function () {
	  function OverrideListener(override) {
	    _classCallCheck(this, OverrideListener);

	    this._controllerListeners = [];
	    this._override = override;

	    this.listening = false;
	  }

	  OverrideListener.prototype.onUpdate = function onUpdate() {
	    this._controllerListeners.forEach(function (listener) {
	      return listener.onUpdate();
	    });
	  };

	  OverrideListener.prototype.addControllerListener = function addControllerListener(controllerListener) {
	    var _this = this;

	    this._controllerListeners.push(controllerListener);

	    if (this._override.addListener && !this.listening) {
	      this.listening = true;
	      this._listener = function () {
	        _this.onUpdate();
	      };
	      this._addListenerRet = this._override.addListener(this._listener);
	    }
	  };

	  OverrideListener.prototype.removeControllerListener = function removeControllerListener(controllerListener) {
	    _utils.removeItem(this._controllerListeners, controllerListener);

	    if (this.listening && this._controllerListeners.length === 0) {
	      this._override.removeListener(this._listener, this._addListenerRet);
	      this.listening = false;
	    }
	  };

	  OverrideListener.prototype.isReadyToRemove = function isReadyToRemove() {
	    return !this.listening && this._controllerListeners.length === 0;
	  };

	  return OverrideListener;
	})();

	var ControllerListener = (function () {
	  function ControllerListener(_ref) {
	    var controller = _ref.controller;
	    var overrideListener = _ref.overrideListener;
	    var handler = _ref.handler;

	    _classCallCheck(this, ControllerListener);

	    this._overrideListener = overrideListener;
	    this.controller = this._controller = controller;

	    this._onUpdate = handler.onUpdate;
	    this._onStop = handler.onStop || function onStop() {};

	    this._listening = false;
	  }

	  ControllerListener.prototype.onUpdate = function onUpdate() {
	    this._onUpdate(this._controller);
	    return this;
	  };

	  ControllerListener.prototype.onStop = function onStop() {
	    this._onStop(this._controller);
	    return this;
	  };

	  ControllerListener.prototype.startListening = function startListening() {
	    var _this2 = this;

	    this._overrideListener.addControllerListener(this);
	    if (this._controller.addListener) {
	      this._listener = function () {
	        _this2.onUpdate();
	      };
	      this._addListenerRet = this._controller.addListener(this._listener);
	    }
	    this._listening = true;
	    return this;
	  };

	  ControllerListener.prototype.stopListening = function stopListening() {
	    this._overrideListener.removeControllerListener(this);
	    if (this._controller.removeListener) {
	      this._controller.removeListener(this._listener, this._addListenerRet);
	    }
	    this._listening = false;
	    return this;
	  };

	  ControllerListener.prototype.isListening = function isListening() {
	    return this._listening;
	  };

	  ControllerListener.prototype.isReadyToRemove = function isReadyToRemove() {
	    return !this.isListening();
	  };

	  return ControllerListener;
	})();

	function createEventManager(eventHandlers) {
	  var _overrideListeners = {
	    /* [override.id]: overriderListener */
	  };

	  var _controllerListeners = {
	    /* [controller.id]: controllerListener */
	  };

	  function _ensureOverrideListener(override) {
	    var overrideListener = _overrideListeners[override.id];
	    if (!overrideListener) {
	      overrideListener = _overrideListeners[override.id] = new OverrideListener(override);
	    }
	    return overrideListener;
	  }

	  function _getControllerListener(controller) {
	    return _controllerListeners[controller.id];
	  }

	  function _ensureControllerListener(controller) {
	    var controllerListener = _getControllerListener(controller);
	    if (controllerListener) {
	      return controllerListener;
	    }

	    var overrideListener = _ensureOverrideListener(controller.override);
	    controllerListener = _controllerListeners[controller.id] = new ControllerListener({
	      controller: controller,
	      overrideListener: overrideListener,
	      handler: eventHandlers[controller.type]
	    });
	    return controllerListener;
	  }

	  function isControllerListening(controller) {
	    var controllerListener = _getControllerListener(controller);
	    if (!controllerListener) {
	      return false;
	    }

	    return controllerListener.isListening();
	  }

	  function startListeningController(controller) {
	    var controllerListener = _ensureControllerListener(controller);
	    controllerListener.onUpdate().startListening();
	  }

	  function stopListeningController(controller) {
	    _invariant2['default'](isControllerListening(controller), 'Only listening controller can be stopped');

	    var controllerListener = _getControllerListener(controller);
	    controllerListener.stopListening().onStop();
	  }

	  function removeController(controller) {
	    var controllerListener = _getControllerListener(controller);
	    if (!controllerListener) {
	      return;
	    }

	    _invariant2['default'](controllerListener.isReadyToRemove(), 'ControllerListener is not ready to remove');

	    delete _controllerListeners[controller.id];
	  }

	  function updateOverride(override) {
	    var overrideListener = _overrideListeners[override.id];
	    if (!overrideListener) {
	      return;
	    }

	    overrideListener.onUpdate();
	  }

	  function removeOverride(override) {
	    var overrideListener = _overrideListeners[override.id];
	    if (!overrideListener) {
	      return;
	    }

	    _invariant2['default'](overrideListener.isReadyToRemove(), 'OverrideListener is not ready to remove');

	    delete _overrideListeners[override.id];
	  }

	  function destroy() {
	    Object.keys(_controllerListeners).map(function (id) {
	      return _controllerListeners[id];
	    }).filter(function (listener) {
	      return listener.isListening();
	    }).forEach(function (listener) {
	      listener.stopListening().onStop();
	    });
	  }

	  return {
	    startListeningController: startListeningController,
	    stopListeningController: stopListeningController,
	    isControllerListening: isControllerListening,
	    removeController: removeController,
	    updateOverride: updateOverride,
	    removeOverride: removeOverride,
	    destroy: destroy
	  };
	}

	module.exports = exports['default'];

/***/ }
/******/ ])
});
;