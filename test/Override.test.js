import {EventEmitter} from 'fbemitter';

import Hairdresser from '../src/Hairdresser';
import Controller, {CTRL_TYPE} from '../src/classes/Controller';

describe('Override', () => {
  it('should throw error when addListener option is passed without removeListener', () => {
    const hairdresser = Hairdresser.create();
    expect(() => {
      hairdresser.override({
        addListener: () => '',
      });
    }).toThrowError('Invariant Violation: addListener requires removeListener');
  });

  describe('listener', () => {
    it('should be listening if override contains active controllers', () => {
      const hairdresser = Hairdresser.create();
      hairdresser._renderAndListen({
        [CTRL_TYPE.TITLE]: {
          onUpdate: controller => controller.render(),
        },
      });

      const addListener = jasmine.createSpy();
      const removeListener = jasmine.createSpy();

      hairdresser.override({
        addListener,
        removeListener,
      }).title('');
      expect(addListener.calls.count()).toBe(1);
      expect(removeListener.calls.count()).toBe(0);

      const override = hairdresser.override().title('');
      expect(addListener.calls.count()).toBe(1);
      expect(removeListener.calls.count()).toBe(1);

      override.restore();
      expect(addListener.calls.count()).toBe(2);
      expect(removeListener.calls.count()).toBe(1);
    });

    it('should receive and redirect events to controllers', () => {
      const emitter = new EventEmitter();

      const hairdresser = Hairdresser.create();
      hairdresser._renderAndListen({
        [CTRL_TYPE.TITLE]: {
          onUpdate: controller => controller.render(),
        },
      });

      const render = jasmine.createSpy();
      hairdresser.override({
        addListener: callback => emitter.addListener('event', callback),
        removeListener: token => token.remove(),
      }).title(render);
      expect(render.calls.count()).toBe(1);

      emitter.emit('event');
      expect(render.calls.count()).toBe(2);

      hairdresser.override().title('');

      emitter.emit('event');
      expect(render.calls.count()).toBe(2);
    });
  });

  describe('#getController', () => {
    it('should return controller with given selector', () => {
      const hairdresser = Hairdresser.create();
      const override = hairdresser.override();

      override
        .title('')
        .meta({}, {});

      const controller = override.getController('title');
      expect(controller).toEqual(jasmine.any(Controller));
    });

    it('should return null when controller does not exist', () => {
      const hairdresser = Hairdresser.create();
      const override = hairdresser.override();

      const controller = override.getController('title');
      expect(controller).toBe(null);
    });
  });

  describe('#addController', () => {
    it('should throw error when render function is missing', () => {
      const hairdresser = Hairdresser.create();
      const override = hairdresser.override();

      expect(() => {
        override.addController(CTRL_TYPE.TITLE, 'title');
      }).toThrowError('Invariant Violation: render value for <title> must be a string');
    });

    it('should throw error when addListener option is passed without removeListener', () => {
      const hairdresser = Hairdresser.create();
      const override = hairdresser.override();

      expect(() => {
        override.addController(CTRL_TYPE.TITLE, 'title', {}, () => '', {
          addListener: () => '',
        });
      }).toThrowError('Invariant Violation: addListener requires removeListener');
    });

    it('should override controller', () => {
      const hairdresser = Hairdresser.create();
      const override1 = hairdresser.override();

      // Default values
      override1.addController(CTRL_TYPE.TITLE, 'title', {}, () => 'title1');

      const controller1 =  override1.getController('title');
      expect(controller1.render()).toBe('title1');

      expect(
        hairdresser._getActiveController('title')
      ).toBe(controller1);

      // Override
      const override2 = hairdresser.override();
      override2.addController(CTRL_TYPE.TITLE, 'title', {}, () => 'title2');

      const controller2 =  override2.getController('title');
      expect(controller2.render()).toBe('title2');

      expect(
        hairdresser._getActiveController('title')
      ).toBe(controller2);
    });

    it('should return itself', () => {
      const hairdresser = Hairdresser.create();
      const override = hairdresser.override();

      const ret = override.addController(CTRL_TYPE.TITLE,
                                         'title', {}, () => 'title2');
      expect(ret).toBe(override);
    });
  });

  describe('#title', () => {
    it('should override <title> controller', () => {
      const hairdresser = Hairdresser.create();
      const override1 = hairdresser.override();

      // Default values
      override1.title('title1');

      const controller1 =  override1.getController('title');
      expect(controller1.render()).toBe('title1');

      expect(
        hairdresser._getActiveController('title')
      ).toBe(controller1);

      // Override
      const override2 = hairdresser.override();
      override2.title('title2');

      const controller2 =  override2.getController('title');
      expect(controller2.render()).toBe('title2');

      expect(
        hairdresser._getActiveController('title')
      ).toBe(controller2);
    });
  });

  describe('#meta', () => {
    it('should override <meta> controller', () => {
      const hairdresser = Hairdresser.create();
      const override1 = hairdresser.override();

      // Default values
      override1.meta({ name: 'value' }, {});

      const controller1 =  override1.getController('meta', { name: 'value' });
      expect(controller1.render()).toEqual({});

      expect(
        hairdresser._getActiveController('meta', { name: 'value' })
      ).toBe(controller1);

      // Override
      const override2 = hairdresser.override();
      override2.meta({ name: 'value' }, {});

      const controller2 =  override2.getController('meta', { name: 'value' });
      expect(controller2.render()).toEqual({});

      expect(
        hairdresser._getActiveController('meta', { name: 'value' })
      ).toBe(controller2);
    });
  });

  describe('#link', () => {
    it('should override <link> controller', () => {
      const hairdresser = Hairdresser.create();
      const override1 = hairdresser.override();

      // Default values
      override1.link({ name: 'value' }, {});

      const controller1 =  override1.getController('link', { name: 'value' });
      expect(controller1.render()).toEqual({});

      expect(
        hairdresser._getActiveController('link', { name: 'value' })
      ).toBe(controller1);

      // Override
      const override2 = hairdresser.override();
      override2.link({ name: 'value' }, {});

      const controller2 =  override2.getController('link', { name: 'value' });
      expect(controller2.render()).toEqual({});

      expect(
        hairdresser._getActiveController('link', { name: 'value' })
      ).toBe(controller2);
    });
  });

  describe('#update', () => {
    it('should trigger onUpdate for active controllers', () => {
      const hairdresser = Hairdresser.create();
      hairdresser._renderAndListen({
        [CTRL_TYPE.TITLE]: {
          onUpdate: controller => controller.render(),
        },
      });

      const render1 = jasmine.createSpy();
      const override1 = hairdresser.override().title(render1);
      expect(render1.calls.count()).toBe(1);

      const render2 = jasmine.createSpy();
      const override2 = hairdresser.override().title(render2);
      expect(render1.calls.count()).toBe(1);
      expect(render2.calls.count()).toBe(1);

      override1.update();
      expect(render1.calls.count()).toBe(1);
      expect(render2.calls.count()).toBe(1);

      override2.update();
      expect(render1.calls.count()).toBe(1);
      expect(render2.calls.count()).toBe(2);
    });

    it('should do nothing when override is added before #render', () => {
      const hairdresser = Hairdresser.create();
      const render1 = jasmine.createSpy();
      const override1 = hairdresser.override().title(render1);

      const render2 = jasmine.createSpy();
      const override2 = hairdresser.override().title(render2);

      hairdresser._renderAndListen({
        [CTRL_TYPE.TITLE]: {
          onUpdate: controller => controller.render(),
        },
      });

      expect(render1.calls.count()).toBe(0);
      expect(render2.calls.count()).toBe(1);

      override1.update();
      expect(render1.calls.count()).toBe(0);
      expect(render2.calls.count()).toBe(1);

      override2.update();
      expect(render1.calls.count()).toBe(0);
      expect(render2.calls.count()).toBe(2);
    });
  });

  describe('#restore', () => {
    it('should restore previous controller', () => {
      const hairdresser = Hairdresser.create();

      // Get default controller.
      const controller1 = hairdresser.override().title('').getController('title');

      // Override controller with a new one.
      const override = hairdresser.override();
      override.title('');
      const controller2 =  override.getController('title');

      expect(
        hairdresser._getActiveController('title')
      ).toBe(controller2);
      expect(controller2.prev).toBe(controller1);
      expect(controller1.next).toBe(controller2);

      // Restore!
      override.restore();

      expect(
        hairdresser._getActiveController('title')
      ).toBe(controller1);
      expect(controller2.prev).toBe(undefined);
      expect(controller1.next).toBe(undefined);
    });

    it('should trigger onStop for controllers being removed', () => {
      const hairdresser = Hairdresser.create();
      const override = hairdresser.override().title('');

      const onUpdate = jasmine.createSpy();
      const onStop = jasmine.createSpy();
      hairdresser._renderAndListen({
        [CTRL_TYPE.TITLE]: {
          onUpdate,
          onStop,
        },
      });
      expect(onUpdate.calls.count()).toBe(1);
      expect(onStop.calls.count()).toBe(0);

      override.restore();
      expect(onUpdate.calls.count()).toBe(1);
      expect(onStop.calls.count()).toBe(1);
    });

    it('should trigger onUpdate for controllers being restored', () => {
      const hairdresser = Hairdresser.create();
      hairdresser._renderAndListen({
        [CTRL_TYPE.TITLE]: {
          onUpdate: controller => controller.render(),
        },
      });

      const render = jasmine.createSpy();
      hairdresser.override().title(render);
      expect(render.calls.count()).toBe(1);

      const override = hairdresser.override().title('');
      expect(render.calls.count()).toBe(1);

      override.restore();
      expect(render.calls.count()).toBe(2);
    });

    it('should remove listener for controllers being stored', () => {
      const hairdresser = Hairdresser.create();
      hairdresser._renderAndListen({
        [CTRL_TYPE.TITLE]: {
          onUpdate: controller => controller.render(),
        },
      });

      hairdresser.override().title('');

      const addListener = jasmine.createSpy();
      const removeListener = jasmine.createSpy();
      const override = hairdresser.override().title('', {
        addListener,
        removeListener,
      });
      expect(addListener.calls.count()).toBe(1);
      expect(removeListener.calls.count()).toBe(0);

      override.restore();
      expect(addListener.calls.count()).toBe(1);
      expect(removeListener.calls.count()).toBe(1);
    });

    it('should remove controllers which is not listening', () => {
      const hairdresser = Hairdresser.create();
      hairdresser._renderAndListen({
        [CTRL_TYPE.TITLE]: {
          onUpdate: controller => controller.render(),
        },
      });

      const override1 = hairdresser.override().title('');
      const controller1 = override1.getController('title');

      const override2 = hairdresser.override().title('');
      const controller2 = override2.getController('title');

      expect(controller1.prev).toBe(undefined);
      expect(controller1.next).toBe(controller2);
      expect(controller2.prev).toBe(controller1);
      expect(controller2.next).toBe(undefined);

      override1.restore();

      expect(controller1.prev).toBe(undefined);
      expect(controller1.next).toBe(undefined);
      expect(controller2.prev).toBe(undefined);
      expect(controller2.next).toBe(undefined);
    });

    it('should ignore controllers which is added before #render', () => {
      const hairdresser = Hairdresser.create();

      const override1 = hairdresser.override().title('');
      const controller1 = override1.getController('title');

      const override2 = hairdresser.override().title('');
      const controller2 = override2.getController('title');

      hairdresser._renderAndListen({
        [CTRL_TYPE.TITLE]: {
          onUpdate: controller => controller.render(),
        },
      });

      expect(controller1.prev).toBe(undefined);
      expect(controller1.next).toBe(controller2);
      expect(controller2.prev).toBe(controller1);
      expect(controller2.next).toBe(undefined);

      override1.restore();

      expect(controller1.prev).toBe(undefined);
      expect(controller1.next).toBe(undefined);
      expect(controller2.prev).toBe(undefined);
      expect(controller2.next).toBe(undefined);
    });
  });
});
