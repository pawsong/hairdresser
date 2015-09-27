import invariant from 'invariant';
import objectKeys from 'object-keys';

import {
  removeItem,
} from './utils';

class OverrideListener {
  constructor(override) {
    this._controllerListeners = [];
    this._override = override;

    this.listening = false;
  }

  onUpdate() {
    this._controllerListeners.forEach(listener => listener.onUpdate());
  }

  addControllerListener(controllerListener) {
    this._controllerListeners.push(controllerListener);

    if (this._override.addListener && !this.listening) {
      this.listening = true;
      this._addListenerRet = this._override.addListener(() => {
        this.onUpdate();
      });
    }
  }

  removeControllerListener(controllerListener) {
    removeItem(this._controllerListeners, controllerListener);

    if (this.listening && this._controllerListeners.length === 0) {
      this._override.removeListener(this._addListenerRet);
      this.listening = false;
    }
  }

  isReadyToRemove() {
    return !this.listening && this._controllerListeners.length === 0;
  }
}

class ControllerListener {
  constructor({ controller, overrideListener, handler }) {
    this._overrideListener = overrideListener;
    this.controller = this._controller = controller;

    this._onUpdate = handler.onUpdate;
    this._onStop = handler.onStop || function onStop() {};

    this._listening = false;
  }

  onUpdate() {
    this._onUpdate(this._controller);
    return this;
  }

  onStop() {
    this._onStop(this._controller);
    return this;
  }

  startListening() {
    this._overrideListener.addControllerListener(this);
    if (this._controller.addListener) {
      this._addListenerRet = this._controller.addListener(() => {
        this.onUpdate();
      });
    }
    this._listening = true;
    return this;
  }

  stopListening() {
    this._overrideListener.removeControllerListener(this);
    if (this._controller.removeListener) {
      this._controller.removeListener(this._addListenerRet);
    }
    this._listening = false;
    return this;
  }

  isListening() {
    return this._listening;
  }

  isReadyToRemove() {
    return !this.isListening();
  }
}

export default function createEventManager(eventHandlers) {
  const _overrideListeners = {
    /* [override.id]: overriderListener */
  };

  const _controllerListeners = {
    /* [controller.id]: controllerListener */
  };

  function _ensureOverrideListener(override) {
    let overrideListener = _overrideListeners[override.id];
    if (!overrideListener) {
      overrideListener = _overrideListeners[override.id] = new OverrideListener(override);
    }
    return overrideListener;
  }

  function _getControllerListener(controller) {
    return _controllerListeners[controller.id];
  }

  function _ensureControllerListener(controller) {
    let controllerListener = _getControllerListener(controller);
    if (controllerListener) {
      return controllerListener;
    }

    const overrideListener = _ensureOverrideListener(controller.override);
    controllerListener = _controllerListeners[controller.id] = new ControllerListener({
      controller,
      overrideListener,
      handler: eventHandlers[controller.type],
    });
    return controllerListener;
  }

  function isControllerListening(controller) {
    const controllerListener = _getControllerListener(controller);
    if (!controllerListener) {
      return false;
    }

    return controllerListener.isListening();
  }

  function startListeningController(controller) {
    const controllerListener = _ensureControllerListener(controller);
    controllerListener
      .onUpdate()
      .startListening();
  }

  function stopListeningController(controller) {
    invariant(isControllerListening(controller),
              'Only listening controller can be stopped');

    const controllerListener = _getControllerListener(controller);
    controllerListener
      .stopListening()
      .onStop();
  }

  function removeController(controller) {
    const controllerListener = _getControllerListener(controller);
    if (!controllerListener) {
      return;
    }

    invariant(controllerListener.isReadyToRemove(),
              'ControllerListener is not ready to remove');

    delete _controllerListeners[controller.id];
  }

  function updateOverride(override) {
    const overrideListener = _overrideListeners[override.id];
    if (!overrideListener) {
      return;
    }

    overrideListener.onUpdate();
  }

  function removeOverride(override) {
    const overrideListener = _overrideListeners[override.id];
    if (!overrideListener) {
      return;
    }

    invariant(overrideListener.isReadyToRemove(),
              'OverrideListener is not ready to remove');

    delete _overrideListeners[override.id];
  }

  function destroy() {
    objectKeys(_controllerListeners)
      .map(id => _controllerListeners[id])
      .filter(listener => listener.isListening())
      .forEach(listener => {
        listener.stopListening().onStop();
      });
  }

  return {
    startListeningController,
    stopListeningController,
    isControllerListening,
    removeController,
    updateOverride,
    removeOverride,
    destroy,
  };
}
