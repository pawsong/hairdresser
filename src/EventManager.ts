import invariant = require('invariant');
import { AttrsObject } from './Attrs';
import Controller, { CtrlType } from './Controller';
import Override from './Override';

import {
  removeItem,
} from './utils';

export class OverrideListener {
  private _controllerListeners: ControllerListener[];
  private _override: Override;

  private _listener: () => void;
  private _listening: boolean;
  private _addListenerRet: any;

  constructor(override: Override) {
    this._controllerListeners = [];
    this._override = override;

    this._listening = false;
  }

  onUpdate() {
    this._controllerListeners.forEach(listener => listener.onUpdate());
  }

  addControllerListener(controllerListener: ControllerListener) {
    this._controllerListeners.push(controllerListener);

    if (this._override.addListener && !this._listening) {
      this._listening = true;
      this._listener = () => this.onUpdate();
      this._addListenerRet = this._override.addListener(this._listener);
    }
  }

  removeControllerListener(controllerListener: ControllerListener) {
    removeItem(this._controllerListeners, controllerListener);

    if (this._listening && this._controllerListeners.length === 0) {
      this._override.removeListener(this._listener, this._addListenerRet);
      this._listening = false;
    }
  }

  isReadyToRemove() {
    return !this._listening && this._controllerListeners.length === 0;
  }
}

export interface ControllerListenerOptions {
  controller: Controller<any>;
  overrideListener: OverrideListener;
  handler: EventHandler<any>;
}

function emptyFunction(): void {
  return undefined;
}

export class ControllerListener {
  private _overrideListener: OverrideListener;
  private _controller: Controller<any>;
  private _listening: boolean;
  private _onUpdate: (controller: Controller<any>) => void;
  private _onStop: (controller: Controller<any>) => void;
  private _listener: () => void;
  private _addListenerRet: any;

  constructor({ controller, overrideListener, handler }: ControllerListenerOptions) {
    this._overrideListener = overrideListener;
    this._controller = controller;

    this._onUpdate = handler.onUpdate;
    this._onStop = handler.onStop || emptyFunction;

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
      this._listener = () => this.onUpdate();
      this._addListenerRet = this._controller.addListener(this._listener);
    }
    this._listening = true;
    return this;
  }

  stopListening() {
    this._overrideListener.removeControllerListener(this);
    if (this._controller.removeListener) {
      this._controller.removeListener(this._listener, this._addListenerRet);
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

export interface EventHandler<T> {
  onUpdate(controller: Controller<T>): void;
  onStop?(controller: Controller<T>): void;
}

export type TitleEventHandler = EventHandler<string>;
export type EtcEventHandler = EventHandler<AttrsObject>;

export interface EventHandlers {
  [index: number]: EventHandler<any>;
}

class EventManager {
  private _overrideListeners: { [index: string]: OverrideListener };
  private _controllerListeners: { [index: string]: ControllerListener };

  private _eventHandlers: EventHandlers;

  constructor(titleHandler: TitleEventHandler, etcHandler: EtcEventHandler) {
    this._overrideListeners = {};
    this._controllerListeners = {};
    this._eventHandlers = {
      [CtrlType.TITLE]: titleHandler,
      [CtrlType.ETC]: etcHandler,
    };
  }

  isControllerListening(controller: Controller<any>) {
    const controllerListener = this._getControllerListener(controller);
    if (!controllerListener) {
      return false;
    }

    return controllerListener.isListening();
  }

  startListeningController(controller: Controller<any>) {
    const controllerListener = this._ensureControllerListener(controller);
    controllerListener
      .onUpdate()
      .startListening();
  }

  stopListeningController(controller: Controller<any>) {
    invariant(this.isControllerListening(controller),
              'Only listening controller can be stopped');

    const controllerListener = this._getControllerListener(controller);
    controllerListener
      .stopListening()
      .onStop();
  }

  removeController(controller: Controller<any>) {
    const controllerListener = this._getControllerListener(controller);
    if (!controllerListener) {
      return;
    }

    invariant(controllerListener.isReadyToRemove(),
              'ControllerListener is not ready to remove');

    delete this._controllerListeners[controller.id];
  }

  updateOverride(override: Override) {
    const overrideListener = this._overrideListeners[override.id];
    if (!overrideListener) {
      return;
    }

    overrideListener.onUpdate();
  }

  removeOverride(override: Override) {
    const overrideListener = this._overrideListeners[override.id];
    if (!overrideListener) {
      return;
    }

    invariant(overrideListener.isReadyToRemove(),
              'OverrideListener is not ready to remove');

    delete this._overrideListeners[override.id];
  }

  destroy() {
    Object.keys(this._controllerListeners)
      .map(id => this._controllerListeners[id])
      .filter(listener => listener.isListening())
      .forEach(listener => {
        listener.stopListening().onStop();
      });
  }

  private _ensureOverrideListener(override: Override) {
    let overrideListener = this._overrideListeners[override.id];
    if (!overrideListener) {
      overrideListener = this._overrideListeners[override.id] = new OverrideListener(override);
    }
    return overrideListener;
  }

  private _getControllerListener(controller: Controller<any>) {
    return this._controllerListeners[controller.id];
  }

  private _ensureControllerListener(controller: Controller<any>) {
    let controllerListener = this._getControllerListener(controller);
    if (controllerListener) {
      return controllerListener;
    }

    const overrideListener = this._ensureOverrideListener(controller.override);
    controllerListener = this._controllerListeners[controller.id] = new ControllerListener({
      controller,
      overrideListener,
      handler: this._eventHandlers[controller.type],
    });
    return controllerListener;
  }
}

export default EventManager;
