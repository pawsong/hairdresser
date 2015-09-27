import {EventEmitter} from 'fbemitter';

import Hairdresser from '../src/Hairdresser';

import {canUseDOM} from '../src/utils';

describe('Hairdresser', () => {
  describe('.create', () => {
    it('should return an Hairdresser instance', () => {
      const hairdresser = Hairdresser.create();
      expect(hairdresser).toEqual(jasmine.any(Hairdresser));
    });
  });

  describe('#override', () => {
    it('should return a new Override instance', () => {
      const hairdresser = Hairdresser.create();
      const Override = hairdresser.Override;

      const override = hairdresser.override();

      expect(override).toEqual(jasmine.any(Override));
    });
  });

  describe('#renderToString', () => {
    it('should throw error when title controller returns non string value', () => {
      // Static case (use static string)
      const hairdresser1 = Hairdresser.create();

      expect(() => {
        hairdresser1.override().title(undefined);
        hairdresser1.renderToString();
      }).toThrowError('Invariant Violation: render value for <title> must be a string');

      // Dynamic case (use function that returns string)
      const hairdresser2 = Hairdresser.create();
      hairdresser2.override().title(() => undefined);

      expect(() => {
        hairdresser2.renderToString();
      }).toThrowError('Invariant Violation: render value for <title> must be a string');
    });

    it('should throw error when element controller returns non object value', () => {
      // Static case (use static object literal)
      const hairdresser1 = Hairdresser.create();

      expect(() => {
        hairdresser1.override().meta({ title: 'name' }, undefined);
        hairdresser1.renderToString();
      }).toThrowError('Invariant Violation: render value for <meta> must be an object');

      // Dynamic case (use function that returns object literal)
      const hairdresser2 = Hairdresser.create();
      hairdresser2.override().meta({ title: 'name' }, () => undefined);

      expect(() => {
        hairdresser2.renderToString();
      }).toThrowError('Invariant Violation: render value for <meta> must be an object');
    });

    it('should return HTML markup string', () => {
      const hairdresser = Hairdresser.create();
      hairdresser.override()
        .title('Hello, world!')
        .link({ rel: 'canonical' }, { href: 'http://www.test.com/this-is-test.html' })
        .meta({ name: 'twitter:title' }, { content: 'Hello, world!' });

      const html = hairdresser.renderToString();
      expect(html).toBe(
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
        }).toThrowError(
          'Invariant Violation: Cannot use DOM object. Make sure `window` ' +
          'and `document` are available globally.'
        );
      });
      return;
    }

    const head = document.getElementsByTagName('head')[0];

    function resetHead() {
      while (head.firstChild) {
        head.removeChild(head.firstChild);
      }
    }

    function getSortedHeadString() {
      const children = [];
      for (let i = 0; i < head.children.length; ++i) {
        children.push(head.children[i]);
      }
      return children.map(child => {
        if (child.tagName === 'TITLE') {
          return `<title>${document.title}</title>`;
        }

        const attribs = [];
        for (let i = 0; i < child.attributes.length; ++i) {
          const attrib = child.attributes[i];
          attribs.push(`${attrib.name}="${attrib.value}"`);
        }

        return `<${child.tagName.toLowerCase()} ${attribs.sort().join(' ')}>`;
      }).sort().join('');
    }

    beforeEach(() => {
      // Reset <head>
      resetHead();
    });

    it('should throw error when title controller returns non string value', () => {
      // Static case (use static string)
      const hairdresser1 = Hairdresser.create();

      expect(() => {
        hairdresser1.override().title(undefined);
        hairdresser1.render();
      }).toThrowError('Invariant Violation: render value for <title> must be a string');

      // Dynamic case (use function that returns string)
      const hairdresser2 = Hairdresser.create();
      hairdresser2.override().title(() => undefined);

      expect(() => {
        hairdresser2.render();
      }).toThrowError('Invariant Violation: render value for <title> must be a string');
    });

    it('should throw error when element controller returns non object value', () => {
      // Static case (use static object literal)
      const hairdresser1 = Hairdresser.create();

      expect(() => {
        hairdresser1.override().meta({ title: 'name' }, undefined);
        hairdresser1.render();
      }).toThrowError('Invariant Violation: render value for <meta> must be an object');

      // Dynamic case (use function that returns object literal)
      const hairdresser2 = Hairdresser.create();
      hairdresser2.override().meta({ title: 'name' }, () => undefined);

      expect(() => {
        hairdresser2.render();
      }).toThrowError('Invariant Violation: render value for <meta> must be an object');
    });

    it('should replace document title with return value of title render function', () => {
      const hairdresser = Hairdresser.create();
      hairdresser.override().title('my awesome title');

      hairdresser.render();
      expect(document.title).toBe('my awesome title');
    });

    it('should replace element attributes with return value of element render function', () => {
      const hairdresser = Hairdresser.create();
      hairdresser.override()
        .meta({ key: 'value' }, { content: 'meta value' })
        .link({ key: 'value' }, { content: 'link value' });

      hairdresser.render();

      // Alphabetical order
      expect(getSortedHeadString()).toBe(
        '<link content="link value" key="value">' +
        '<meta content="meta value" key="value">'
      );
    });

    it('should apply override after #render call to DOM object', () => {
      const hairdresser = Hairdresser.create();
      hairdresser.render();

      hairdresser.override()
        .title(() => 'title value')
        .meta({ key: 'value' }, { content: 'meta value' })
        .link({ key: 'value' }, { content: 'link value' });

      expect(getSortedHeadString()).toBe(
        // Override method call order
        '<link content="link value" key="value">' +
        '<meta content="meta value" key="value">' +
        '<title>title value</title>'
      );

      hairdresser.override()
        .title(() => 'overridden title value')
        .meta({ key: 'value' }, { content: 'overridden meta value' })
        .link({ key: 'value' }, { content: 'overridden link value' });

      expect(getSortedHeadString()).toBe(
        '<link content="overridden link value" key="value">' +
        '<meta content="overridden meta value" key="value">' +
        '<title>overridden title value</title>'
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
      expect(stopRendering).toEqual(jasmine.any(Function));

      stopRendering();
      expect(getSortedHeadString()).toBe('<title>change me</title>');

      // Override does not affect DOM after stop
      hairdresser.override().title('I do nothing');
      expect(getSortedHeadString()).toBe('<title>change me</title>');
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

      expect(getSortedHeadString()).toBe(
        '<link content="old link" key="value">' +
        '<meta content="old meta" key="value">' +
        '<title>old title</title>'
      );

      title = 'new title';
      meta = 'new meta';
      link = 'new link';

      emitter.emit('override');
      expect(getSortedHeadString()).toBe(
        '<link content="new link" key="value">' +
        '<meta content="new meta" key="value">' +
        '<title>new title</title>'
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

      expect(getSortedHeadString()).toBe(
        '<link content="old link" key="value">' +
        '<meta content="old meta" key="value">' +
        '<title>old title</title>'
      );

      title = 'new title';
      meta = 'new meta';
      link = 'new link';

      emitter.emit('title');
      expect(getSortedHeadString()).toBe(
        '<link content="old link" key="value">' +
        '<meta content="old meta" key="value">' +
        '<title>new title</title>'
      );

      emitter.emit('meta');
      expect(getSortedHeadString()).toBe(
        '<link content="old link" key="value">' +
        '<meta content="new meta" key="value">' +
        '<title>new title</title>'
      );

      emitter.emit('link');
      expect(getSortedHeadString()).toBe(
        '<link content="new link" key="value">' +
        '<meta content="new meta" key="value">' +
        '<title>new title</title>'
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

      expect(getSortedHeadString()).toBe(
        '<meta content="meta" key="value">'
      );

      // Reset
      resetHead();

      emitter.emit('meta');
      expect(getSortedHeadString()).toBe(
        '<meta content="meta" key="value">'
      );

      // Reset
      resetHead();

      override.restore();
      expect(getSortedHeadString()).toBe('');
    });
  });
});
