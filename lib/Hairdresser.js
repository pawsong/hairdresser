"use strict";
var invariant = require('invariant');
var utils_1 = require('./utils');
var Attrs_1 = require('./Attrs');
var Controller_1 = require('./Controller');
var Override_1 = require('./Override');
var EventManager_1 = require('./EventManager');
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
     * Hairdresser constructor.
     *
     * @constructs Hairdresser
     * @return {Hairdresser} a new Hairdresser instance.
     */
    function Hairdresser() {
        this._topControllers = {};
        this._observerList = [];
        this._generateOverrideId = utils_1.createIdGenerator();
        this._generateControllerId = utils_1.createIdGenerator();
    }
    /**
     * Create a Hairdresser instance.
     *
     * @return {Hairdresser} Hairdresser instance.
     */
    Hairdresser.create = function () {
        return new Hairdresser();
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
    Hairdresser.prototype.override = function (options) {
        if (options === void 0) { options = {}; }
        return new Override_1.default(this, options);
    };
    /**
     * Renders HTML elements as a markup string.
     *
     * @return {string} the HTML markup
     */
    Hairdresser.prototype.renderToString = function () {
        var result = [];
        this._renderOnce({
            onUpdate: function (controller) {
                var newTitle = controller.render();
                Controller_1.validateTitle(controller.tagName, newTitle);
                result.push("<title>" + newTitle + "</title>");
            },
        }, {
            onUpdate: function (controller) {
                var newAttrs = controller.render();
                Controller_1.validateEtc(controller.tagName, newAttrs);
                var newAttrsStr = Attrs_1.toHtml(newAttrs);
                // Update attributes
                result.push(("<" + controller.tagName + " " + controller.attrs.html) +
                    ((newAttrsStr ? ' ' + newAttrsStr : '') + ">") +
                    (controller.needsToClose ? "</" + controller.tagName + ">" : ''));
            },
        });
        return result.join('');
    };
    /**
     * Renders HTML elements into the DOM in the `<head>` element,
     * and watch further changes of the hairdresser instance.
     *
     * @return {function} Restore changes and stop watching the hairdresser
     * instance function.
     */
    Hairdresser.prototype.render = function () {
        invariant(utils_1.canUseDOM(), 'Cannot use DOM object. ' +
            'Make sure `window` and `document` are available globally.');
        var head = document.getElementsByTagName('head')[0];
        function isElementCacheValid(elem, attrs) {
            if (elem.parentNode !== head) {
                return false;
            }
            return attrs.each(function (name, value) { return elem.getAttribute(name) === value; });
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
            element = head.querySelector("" + controller.selector);
            if (element) {
                cachedElem[controller.id] = element;
                return element;
            }
            element = document.createElement(controller.tagName);
            controller.attrs.each(function (name, value) {
                element.setAttribute(name, value);
                return true;
            });
            head.appendChild(element);
            cachedElem[controller.id] = element;
            return element;
        }
        var oldTitle = document.title;
        return this._renderAndListen({
            onUpdate: function (controller) {
                var newTitle = controller.render();
                Controller_1.validateTitle(controller.tagName, newTitle);
                document.title = newTitle;
            },
            onStop: function (controller) {
                if (!controller.prev && !controller.next) {
                    document.title = oldTitle;
                }
            },
        }, {
            onUpdate: function (controller) {
                var element = ensureElement(controller);
                // Update attributes
                var newAttrs = controller.render();
                Controller_1.validateEtc(controller.tagName, newAttrs);
                Object.keys(newAttrs).forEach(function (attrName) {
                    element.setAttribute(attrName, newAttrs[attrName]);
                });
            },
            onStop: function (controller) {
                if (!controller.prev && !controller.next) {
                    var element = getElement(controller);
                    if (element) {
                        element.parentNode.removeChild(element);
                    }
                }
            },
        });
    };
    Hairdresser.prototype._addControllerToOverride = function (override, controller) {
        invariant(controller instanceof Controller_1.default, 'controller must be an instance of Controller');
        controller.override = override;
        override.controllers.push(controller);
        controller.id = this._generateControllerId();
        // Append inserted controller to currently top controller
        var curTopController = this._topControllers[controller.selector];
        if (curTopController) {
            curTopController.insertAfter(controller);
        }
        this._topControllers[controller.selector] = controller;
        // Fire event to listening observers
        this._observerList.forEach(function (observer) {
            observer.onAddController(controller);
        });
    };
    ;
    Hairdresser.prototype._getActiveController = function (tagName, attrs) {
        var selector = tagName + (attrs ? Attrs_1.toSelector(attrs) : '');
        return this._topControllers[selector];
    };
    Hairdresser.prototype._renderAndListen = function (titleHandler, etcHandler) {
        var eventManager = new EventManager_1.default(titleHandler, etcHandler);
        // Render and start listening
        this._getActiveControllers()
            .forEach(function (controller) { return eventManager.startListeningController(controller); });
        var removeObserver = this._addObserver({
            onAddController: function (controller) {
                // Add controller listeners
                if (controller.prev) {
                    eventManager.stopListeningController(controller.prev);
                }
                eventManager.startListeningController(controller);
            },
            onUpdate: function (override) {
                // Update controller listeners
                eventManager.updateOverride(override);
            },
            onPreRemoveOverride: function (override) {
                override.controllers.forEach(function (controller) {
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
        return function () {
            removeObserver();
            eventManager.destroy();
        };
    };
    Hairdresser.prototype._getActiveControllers = function () {
        var _this = this;
        return Object.keys(this._topControllers).sort()
            .map(function (selector) { return _this._topControllers[selector]; });
    };
    Hairdresser.prototype._addObserver = function (observer) {
        var _this = this;
        this._observerList.push(observer);
        return function () {
            utils_1.removeItem(_this._observerList, observer);
        };
    };
    Hairdresser.prototype._renderOnce = function (titleHandler, etcHandler) {
        this._getActiveControllers().forEach(function (controller) {
            switch (controller.type) {
                case Controller_1.CtrlType.TITLE: {
                    titleHandler.onUpdate(controller);
                    break;
                }
                case Controller_1.CtrlType.ETC: {
                    etcHandler.onUpdate(controller);
                    break;
                }
                default: {
                    break;
                }
            }
        });
    };
    return Hairdresser;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Hairdresser;
//# sourceMappingURL=Hairdresser.js.map