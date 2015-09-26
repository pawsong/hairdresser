import {expect} from 'chai';
import {EventEmitter} from 'fbemitter';

import Hairdresser from '../src/Hairdresser';
import Controller from '../src/classes/Controller';

import {canUseDOM} from '../src/utils';

describe('Hairdresser', () => {
  describe('.Controller', () => {
    it('should return Controller constructor', () => {
      expect(Hairdresser.Controller).to.equal(Controller);
    });
  });

  describe('.create', () => {
    it('should return an Hairdresser instance', () => {
      const hairdresser = Hairdresser.create();
      expect(hairdresser).to.be.an.instanceof(Hairdresser);
    });
  });

  describe('#override', () => {
    it('should return a new Override instance', () => {
      const hairdresser = Hairdresser.create();
      const Override = hairdresser.Override;

      const override = hairdresser.override();

      expect(override).to.be.an.instanceof(Override);
    });
  });

  describe('#renderToString', () => {
    it('should throw error when title controller returns non string value', () => {
      // Static case (use static string)
      const hairdresser1 = Hairdresser.create();

      expect(() => {
        hairdresser1.override().title(undefined);
        hairdresser1.renderToString();
      }).to.throw('render value for <title> must be a string');

      // Dynamic case (use function that returns string)
      const hairdresser2 = Hairdresser.create();
      hairdresser2.override().title(() => undefined);

      expect(() => {
        hairdresser2.renderToString();
      }).to.throw('render value for <title> must be a string');
    });

    it('should throw error when element controller returns non object value', () => {
      // Static case (use static object literal)
      const hairdresser1 = Hairdresser.create();

      expect(() => {
        hairdresser1.override().meta({ title: 'name' }, undefined);
        hairdresser1.renderToString();
      }).to.throw('Invariant Violation: render value for <meta> must be an object');

      // Dynamic case (use function that returns object literal)
      const hairdresser2 = Hairdresser.create();
      hairdresser2.override().meta({ title: 'name' }, () => undefined);

      expect(() => {
        hairdresser2.renderToString();
      }).to.throw('Invariant Violation: render value for <meta> must be an object');
    });

    it('should return HTML markup string', () => {
      const hairdresser = Hairdresser.create();
      hairdresser.override()
        .title('Hello, world!')
        .link({ rel: 'canonical' }, { href: 'http://www.test.com/this-is-test.html' })
        .meta({ name: 'twitter:title' }, { content: 'Hello, world!' });

      const html = hairdresser.renderToString();
      expect(html).to.equal(
        '<link rel="canonical" href="http://www.test.com/this-is-test.html">' +
        '<meta name="twitter:title" content="Hello, world!">' +
        '<title>Hello, world!</title>'
      );
    });
  });

  describe('#render', () => {
    if (!canUseDOM()) {
      it('should throw error when DOM is unavailable', () => {
        const hairdresser = Hairdresser.create();
        expect(() => {
          hairdresser.render();
        }).to.throw(
          'Invariant Violation: Cannot use DOM object. Make sure `window` ' +
          'and `document` are available globally'
        );
      });
      return;
    }

    beforeEach(() => {
      // Reset <head>
      document.head.innerHTML = '';
    });

    it('should throw error when title controller returns non string value', () => {
      // Static case (use static string)
      const hairdresser1 = Hairdresser.create();

      expect(() => {
        hairdresser1.override().title(undefined);
        hairdresser1.render();
      }).to.throw('render value for <title> must be a string');

      // Dynamic case (use function that returns string)
      const hairdresser2 = Hairdresser.create();
      hairdresser2.override().title(() => undefined);

      expect(() => {
        hairdresser2.render();
      }).to.throw('render value for <title> must be a string');
    });

    it('should throw error when element controller returns non object value', () => {
      // Static case (use static object literal)
      const hairdresser1 = Hairdresser.create();

      expect(() => {
        hairdresser1.override().meta({ title: 'name' }, undefined);
        hairdresser1.render();
      }).to.throw('Invariant Violation: render value for <meta> must be an object');

      // Dynamic case (use function that returns object literal)
      const hairdresser2 = Hairdresser.create();
      hairdresser2.override().meta({ title: 'name' }, () => undefined);

      expect(() => {
        hairdresser2.render();
      }).to.throw('Invariant Violation: render value for <meta> must be an object');
    });

    it('should replace document title with return value of title render function', () => {
      const hairdresser = Hairdresser.create();
      hairdresser.override().title('my awesome title');

      hairdresser.render();
      expect(document.title).to.equal('my awesome title');
    });

    it('should replace element attributes with return value of element render function', () => {
      const hairdresser = Hairdresser.create();
      hairdresser.override()
        .meta({ key: 'value' }, { content: 'meta value' })
        .link({ key: 'value' }, { content: 'link value' });

      hairdresser.render();

      // Alphabetical order
      expect(document.head.innerHTML).to.equal(
        '<link key="value" content="link value">' +
        '<meta key="value" content="meta value">'
      );
    });

    it('should apply override after #render call to DOM object', () => {
      const hairdresser = Hairdresser.create();
      hairdresser.render();

      hairdresser.override()
        .title(() => 'title value')
        .meta({ key: 'value' }, { content: 'meta value' })
        .link({ key: 'value' }, { content: 'link value' });

      expect(document.head.innerHTML).to.equal(
        // Override method call order
        '<title>title value</title>' +
        '<meta key="value" content="meta value">' +
        '<link key="value" content="link value">'
      );

      hairdresser.override()
        .title(() => 'overridden title value')
        .meta({ key: 'value' }, { content: 'overridden meta value' })
        .link({ key: 'value' }, { content: 'overridden link value' });

      expect(document.head.innerHTML).to.equal(
        '<title>overridden title value</title>' +
        '<meta key="value" content="overridden meta value">' +
        '<link key="value" content="overridden link value">'
      );
    });

    it('should return a function that stops hairdresser listening', () => {
      document.title = 'change me';

      const hairdresser = Hairdresser.create();
      hairdresser.override()
        .title(() => 'Hairdresser')
        .meta({ key: 'value' }, { content: 'meta value' })
        .link({ key: 'value' }, { content: 'link value' });

      const stopRendering = hairdresser.render();
      expect(stopRendering).to.be.a('function');

      stopRendering();
      expect(document.head.innerHTML).to.equal('<title>change me</title>');

      // Override does not affect DOM after stop
      hairdresser.override().title('I do nothing');
      expect(document.head.innerHTML).to.equal('<title>change me</title>');
    });

    it('should update elements when override listener receives event', () => {
      const emitter = new EventEmitter();

      let title = 'old title';
      let meta = 'old meta';
      let link = 'old link';

      const hairdresser = Hairdresser.create();
      hairdresser.render();

      hairdresser.override({
        addListener: callback => emitter.addListener('override', callback),
        removeListener: token => token.remove(),
      })
        .title(() => title)
        .meta({ key: 'value' }, () => ({ content: meta }))
        .link({ key: 'value' }, () => ({ content: link }));

      expect(document.head.innerHTML).to.equal(
        '<title>old title</title>' +
        '<meta key="value" content="old meta">' +
        '<link key="value" content="old link">'
      );

      title = 'new title';
      meta = 'new meta';
      link = 'new link';

      emitter.emit('override');
      expect(document.head.innerHTML).to.equal(
        '<title>new title</title>' +
        '<meta key="value" content="new meta">' +
        '<link key="value" content="new link">'
      );
    });

    it('should update element when element listener receives event', () => {
      const emitter = new EventEmitter();

      let title = 'old title';
      let meta = 'old meta';
      let link = 'old link';

      const hairdresser = Hairdresser.create();
      hairdresser.render();

      hairdresser.override()
        .title(() => title, {
          addListener: callback => emitter.addListener('title', callback),
          removeListener: token => token.remove(),
        })
        .meta({ key: 'value' }, () => ({ content: meta }), {
          addListener: callback => emitter.addListener('meta', callback),
          removeListener: token => token.remove(),
        })
        .link({ key: 'value' }, () => ({ content: link }), {
          addListener: callback => emitter.addListener('link', callback),
          removeListener: token => token.remove(),
        });

      expect(document.head.innerHTML).to.equal(
        '<title>old title</title>' +
        '<meta key="value" content="old meta">' +
        '<link key="value" content="old link">'
      );

      title = 'new title';
      meta = 'new meta';
      link = 'new link';

      emitter.emit('title');
      expect(document.head.innerHTML).to.equal(
        '<title>new title</title>' +
        '<meta key="value" content="old meta">' +
        '<link key="value" content="old link">'
      );

      emitter.emit('meta');
      expect(document.head.innerHTML).to.equal(
        '<title>new title</title>' +
        '<meta key="value" content="new meta">' +
        '<link key="value" content="old link">'
      );

      emitter.emit('link');
      expect(document.head.innerHTML).to.equal(
        '<title>new title</title>' +
        '<meta key="value" content="new meta">' +
        '<link key="value" content="new link">'
      );
    });

    it('should detect stale HTML element cache and revalidate it', () => {
      const emitter = new EventEmitter();

      const hairdresser = Hairdresser.create();
      hairdresser.render();

      const override = hairdresser.override()
        .meta({ key: 'value' }, { content: 'meta' }, {
          addListener: callback => emitter.addListener('meta', callback),
          removeListener: token => token.remove(),
        });

      expect(document.head.innerHTML).to.equal(
        '<meta key="value" content="meta">'
      );

      // Reset
      document.head.innerHTML = '';

      emitter.emit('meta');
      expect(document.head.innerHTML).to.equal(
        '<meta key="value" content="meta">'
      );

      // Reset
      document.head.innerHTML = '';

      override.restore();
      expect(document.head.innerHTML).to.equal('');
    });
  });
});
