import {expect} from 'chai';

import {EventEmitter} from 'fbemitter';

import Hairdresser from '../src/Hairdresser';
import Controller from '../src/classes/Controller';

describe('Override', () => {
  it('should throw error when addListener option is passed without removeListener', () => {
    const hairdresser = Hairdresser.create();
    expect(() => {
      hairdresser.override({
        addListener: () => '',
      });
    }).to.throw('addListener requires removeListener');
  });

  describe('listener', () => {
    it('should be listening if override contains active controllers', () => {
      const hairdresser = Hairdresser.create();
      hairdresser._renderAndListen({
        [Controller.CTRL_TYPE.TITLE]: {
          onUpdate: controller => controller.render(),
        },
      });

      const addListener = sinon.spy();
      const removeListener = sinon.spy();

      hairdresser.override({
        addListener,
        removeListener,
      }).title('');
      expect(addListener.callCount).to.equal(1);
      expect(removeListener.callCount).to.equal(0);

      const override = hairdresser.override().title('');
      expect(addListener.callCount).to.equal(1);
      expect(removeListener.callCount).to.equal(1);

      override.restore();
      expect(addListener.callCount).to.equal(2);
      expect(removeListener.callCount).to.equal(1);
    });

    it('should receive and redirect events to controllers', () => {
      const emitter = new EventEmitter();

      const hairdresser = Hairdresser.create();
      hairdresser._renderAndListen({
        [Controller.CTRL_TYPE.TITLE]: {
          onUpdate: controller => controller.render(),
        },
      });

      const render = sinon.spy();
      hairdresser.override({
        addListener: callback => emitter.addListener('event', callback),
        removeListener: token => token.remove(),
      }).title(render);
      expect(render.callCount).to.equal(1);

      emitter.emit('event');
      expect(render.callCount).to.equal(2);

      hairdresser.override().title('');

      emitter.emit('event');
      expect(render.callCount).to.equal(2);
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
      expect(controller).to.be.an.instanceof(Controller);
    });

    it('should return null when controller does not exist', () => {
      const hairdresser = Hairdresser.create();
      const override = hairdresser.override();

      const controller = override.getController('title');
      expect(controller).to.be.a('null');
    });
  });

  describe('#addController', () => {
    it('should throw error when render function is missing', () => {
      const hairdresser = Hairdresser.create();
      const override = hairdresser.override();

      expect(() => {
        override.addController(Controller.CTRL_TYPE.TITLE, 'title');
      }).to.throw('Invariant Violation: render value for <title> must be a string');
    });

    it('should throw error when addListener option is passed without removeListener', () => {
      const hairdresser = Hairdresser.create();
      const override = hairdresser.override();

      expect(() => {
        override.addController(Controller.CTRL_TYPE.TITLE, 'title', {}, () => '', {
          addListener: () => '',
        });
      }).to.throw('addListener requires removeListener');
    });

    it('should override controller', () => {
      const hairdresser = Hairdresser.create();
      const override1 = hairdresser.override();

      // Default values
      override1.addController(Controller.CTRL_TYPE.TITLE, 'title', {}, () => 'title1');

      const controller1 =  override1.getController('title');
      expect(controller1.render()).to.equal('title1');

      expect(
        hairdresser._getActiveController('title')
      ).to.equal(controller1);

      // Override
      const override2 = hairdresser.override();
      override2.addController(Controller.CTRL_TYPE.TITLE, 'title', {}, () => 'title2');

      const controller2 =  override2.getController('title');
      expect(controller2.render()).to.equal('title2');

      expect(
        hairdresser._getActiveController('title')
      ).to.equal(controller2);
    });

    it('should return itself', () => {
      const hairdresser = Hairdresser.create();
      const override = hairdresser.override();

      const ret = override.addController(Controller.CTRL_TYPE.TITLE,
                                         'title', {}, () => 'title2');
      expect(ret).to.equal(override);
    });
  });

  describe('#title', () => {
    it('should override <title> controller', () => {
      const hairdresser = Hairdresser.create();
      const override1 = hairdresser.override();

      // Default values
      override1.title('title1');

      const controller1 =  override1.getController('title');
      expect(controller1.render()).to.equal('title1');

      expect(
        hairdresser._getActiveController('title')
      ).to.equal(controller1);

      // Override
      const override2 = hairdresser.override();
      override2.title('title2');

      const controller2 =  override2.getController('title');
      expect(controller2.render()).to.equal('title2');

      expect(
        hairdresser._getActiveController('title')
      ).to.equal(controller2);
    });
  });

  describe('#meta', () => {
    it('should override <meta> controller', () => {
      const hairdresser = Hairdresser.create();
      const override1 = hairdresser.override();

      // Default values
      override1.meta({ name: 'value' }, {});

      const controller1 =  override1.getController('meta', { name: 'value' });
      expect(controller1.render()).to.deep.equal({});

      expect(
        hairdresser._getActiveController('meta', { name: 'value' })
      ).to.equal(controller1);

      // Override
      const override2 = hairdresser.override();
      override2.meta({ name: 'value' }, {});

      const controller2 =  override2.getController('meta', { name: 'value' });
      expect(controller2.render()).to.deep.equal({});

      expect(
        hairdresser._getActiveController('meta', { name: 'value' })
      ).to.equal(controller2);
    });
  });

  describe('#link', () => {
    it('should override <link> controller', () => {
      const hairdresser = Hairdresser.create();
      const override1 = hairdresser.override();

      // Default values
      override1.link({ name: 'value' }, {});

      const controller1 =  override1.getController('link', { name: 'value' });
      expect(controller1.render()).to.deep.equal({});

      expect(
        hairdresser._getActiveController('link', { name: 'value' })
      ).to.equal(controller1);

      // Override
      const override2 = hairdresser.override();
      override2.link({ name: 'value' }, {});

      const controller2 =  override2.getController('link', { name: 'value' });
      expect(controller2.render()).to.deep.equal({});

      expect(
        hairdresser._getActiveController('link', { name: 'value' })
      ).to.equal(controller2);
    });
  });

  describe('#update', () => {
    it('should trigger onUpdate for active controllers', () => {
      const hairdresser = Hairdresser.create();
      hairdresser._renderAndListen({
        [Controller.CTRL_TYPE.TITLE]: {
          onUpdate: controller => controller.render(),
        },
      });

      const render1 = sinon.spy();
      const override1 = hairdresser.override().title(render1);
      expect(render1.callCount).to.equal(1);

      const render2 = sinon.spy();
      const override2 = hairdresser.override().title(render2);
      expect(render1.callCount).to.equal(1);
      expect(render2.callCount).to.equal(1);

      override1.update();
      expect(render1.callCount).to.equal(1);
      expect(render2.callCount).to.equal(1);

      override2.update();
      expect(render1.callCount).to.equal(1);
      expect(render2.callCount).to.equal(2);
    });

    it('should do nothing when override is added before #render', () => {
      const hairdresser = Hairdresser.create();
      const render1 = sinon.spy();
      const override1 = hairdresser.override().title(render1);

      const render2 = sinon.spy();
      const override2 = hairdresser.override().title(render2);

      hairdresser._renderAndListen({
        [Controller.CTRL_TYPE.TITLE]: {
          onUpdate: controller => controller.render(),
        },
      });

      expect(render1.callCount).to.equal(0);
      expect(render2.callCount).to.equal(1);

      override1.update();
      expect(render1.callCount).to.equal(0);
      expect(render2.callCount).to.equal(1);

      override2.update();
      expect(render1.callCount).to.equal(0);
      expect(render2.callCount).to.equal(2);
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
      ).to.equal(controller2);
      expect(controller2.prev).to.equal(controller1);
      expect(controller1.next).to.equal(controller2);

      // Restore!
      override.restore();

      expect(
        hairdresser._getActiveController('title')
      ).to.equal(controller1);
      expect(controller2.prev).to.be.an('undefined');
      expect(controller1.next).to.be.an('undefined');
    });

    it('should trigger onStop for controllers being removed', () => {
      const hairdresser = Hairdresser.create();
      const override = hairdresser.override().title('');

      const onUpdate = sinon.spy();
      const onStop = sinon.spy();
      hairdresser._renderAndListen({
        [Controller.CTRL_TYPE.TITLE]: {
          onUpdate,
          onStop,
        },
      });
      expect(onUpdate.callCount).to.equal(1);
      expect(onStop.callCount).to.equal(0);

      override.restore();
      expect(onUpdate.callCount).to.equal(1);
      expect(onStop.callCount).to.equal(1);
    });

    it('should trigger onUpdate for controllers being restored', () => {
      const hairdresser = Hairdresser.create();
      hairdresser._renderAndListen({
        [Controller.CTRL_TYPE.TITLE]: {
          onUpdate: controller => controller.render(),
        },
      });

      const render = sinon.spy();
      hairdresser.override().title(render);
      expect(render.callCount).to.equal(1);

      const override = hairdresser.override().title('');
      expect(render.callCount).to.equal(1);

      override.restore();
      expect(render.callCount).to.equal(2);
    });

    it('should remove listener for controllers being stored', () => {
      const hairdresser = Hairdresser.create();
      hairdresser._renderAndListen({
        [Controller.CTRL_TYPE.TITLE]: {
          onUpdate: controller => controller.render(),
        },
      });

      hairdresser.override().title('');

      const addListener = sinon.spy();
      const removeListener = sinon.spy();
      const override = hairdresser.override().title('', {
        addListener,
        removeListener,
      });
      expect(addListener.callCount).to.equal(1);
      expect(removeListener.callCount).to.equal(0);

      override.restore();
      expect(addListener.callCount).to.equal(1);
      expect(removeListener.callCount).to.equal(1);
    });

    it('should remove controllers which is not listening', () => {
      const hairdresser = Hairdresser.create();
      hairdresser._renderAndListen({
        [Controller.CTRL_TYPE.TITLE]: {
          onUpdate: controller => controller.render(),
        },
      });

      const override1 = hairdresser.override().title('');
      const controller1 = override1.getController('title');

      const override2 = hairdresser.override().title('');
      const controller2 = override2.getController('title');

      expect(controller1.prev).to.equal(undefined);
      expect(controller1.next).to.equal(controller2);
      expect(controller2.prev).to.equal(controller1);
      expect(controller2.next).to.equal(undefined);

      override1.restore();

      expect(controller1.prev).to.equal(undefined);
      expect(controller1.next).to.equal(undefined);
      expect(controller2.prev).to.equal(undefined);
      expect(controller2.next).to.equal(undefined);
    });

    it('should ignore controllers which is added before #render', () => {
      const hairdresser = Hairdresser.create();

      const override1 = hairdresser.override().title('');
      const controller1 = override1.getController('title');

      const override2 = hairdresser.override().title('');
      const controller2 = override2.getController('title');

      hairdresser._renderAndListen({
        [Controller.CTRL_TYPE.TITLE]: {
          onUpdate: controller => controller.render(),
        },
      });

      expect(controller1.prev).to.equal(undefined);
      expect(controller1.next).to.equal(controller2);
      expect(controller2.prev).to.equal(controller1);
      expect(controller2.next).to.equal(undefined);

      override1.restore();

      expect(controller1.prev).to.equal(undefined);
      expect(controller1.next).to.equal(undefined);
      expect(controller2.prev).to.equal(undefined);
      expect(controller2.next).to.equal(undefined);
    });
  });
});
