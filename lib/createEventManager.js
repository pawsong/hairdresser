'use strict';

exports.__esModule = true;
exports['default'] = createEventManager;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _utils = require('./utils');

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