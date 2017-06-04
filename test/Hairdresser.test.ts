import { EventEmitter } from 'events';

import Hairdresser from '../src/Hairdresser';
import Override from '../src/Override';
import {canUseDOM} from '../src/utils';

const _undefined: any = undefined;

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
      const override = hairdresser.override();

      expect(override).toEqual(jasmine.any(Override));
    });
  });

  describe('#renderToString', () => {
    it('should throw error when title controller returns non string value', () => {
      // Static case (use static string)
      const hairdresser1 = Hairdresser.create();

      expect(() => {
        hairdresser1.override().title(_undefined);
        hairdresser1.renderToString();
      }).toThrowError('render value for <title> must be a string');

      // Dynamic case (use function that returns string)
      const hairdresser2 = Hairdresser.create();
      hairdresser2.override().title(() => _undefined);

      expect(() => {
        hairdresser2.renderToString();
      }).toThrowError('render value for <title> must be a string');
    });

    it('should throw error when element controller returns non object value', () => {
      // Static case (use static object literal)
      const hairdresser1 = Hairdresser.create();

      expect(() => {
        hairdresser1.override().meta({ title: 'name' }, _undefined);
        hairdresser1.renderToString();
      }).toThrowError('render value for <meta> must be an object');

      // Dynamic case (use function that returns object literal)
      const hairdresser2 = Hairdresser.create();
      hairdresser2.override().meta({ title: 'name' }, () => _undefined);

      expect(() => {
        hairdresser2.renderToString();
      }).toThrowError('render value for <meta> must be an object');
    });

    it('should return HTML markup string', () => {
      // Defaults
      const hairdresser = Hairdresser.create();
      hairdresser.override()
        .title('Hello, world!')
        .link({ key: 'key1' }, { value: 'value1' })
        .meta({ key: 'key1' }, { value: 'value1' })
        .tag('ta', { key: 'key1' }, { value: 'value1' })
        .tag('tb', { key: 'key1' }, { value: 'value1' }, { close: true });

      expect(
        hairdresser.renderToString()
      ).toBe(
        '<link key="key1" value="value1">' +
        '<meta key="key1" value="value1">' +
        '<ta key="key1" value="value1">' +
        '<tb key="key1" value="value1"></tb>' +
        '<title>Hello, world!</title>'
      );

      // Override
      const override = hairdresser.override()
        .title('Hello, world!')
        .link({ key: 'key1' }, { value: 'value2' })
        .meta({ key: 'key1' }, { value: 'value2' })
        .tag('ta', { key: 'key1' }, { value: 'value2' })
        .tag('tb', { key: 'key1' }, { value: 'value2' }, { close: true });

      expect(
        hairdresser.renderToString()
      ).toBe(
        '<link key="key1" value="value2">' +
        '<meta key="key1" value="value2">' +
        '<ta key="key1" value="value2">' +
        '<tb key="key1" value="value2"></tb>' +
        '<title>Hello, world!</title>'
      );

      // Restore
      override.restore();

      expect(
        hairdresser.renderToString()
      ).toBe(
        '<link key="key1" value="value1">' +
        '<meta key="key1" value="value1">' +
        '<ta key="key1" value="value1">' +
        '<tb key="key1" value="value1"></tb>' +
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
          'Cannot use DOM object. Make sure `window` ' +
          'and `document` are available globally.'
        );
      });
      return;
    }

    const head = document.getElementsByTagName('head')[0];

    const oldHeadChildren: Element[] = [];
    for (let i = 0; i < head.children.length; ++i) {
      oldHeadChildren.push(head.children[i]);
    }

    function resetHead() {
      document.title = '';

      const elements = head.children;
      for (let i = 0; i < elements.length; ++i) {
        const element = elements[i];
        if (oldHeadChildren.indexOf(element) === -1) {
          element.parentNode.removeChild(element);
          i = i - 1;
        }
      }
    }

    function getSortedElementString(element: Element) {
      if (element.tagName === 'TITLE') {
        return `<title>${document.title}</title>`;
      }

      if (oldHeadChildren.indexOf(element) >= 0) {
        return '';
      }

      const attribs: string[] = [];
      for (let i = 0; i < element.attributes.length; ++i) {
        const attrib = element.attributes[i];
        attribs.push(`${attrib.name}="${attrib.value}"`);
      }

      return `<${element.tagName.toLowerCase()} ${attribs.sort().join(' ')}>`;
    }

    function getSortedChildrenString(element: Element) {
      const children: Element[] = [];
      for (let i = 0; i < element.children.length; ++i) {
        children.push(element.children[i]);
      }
      return children.map(getSortedElementString).sort().join('');
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
      }).toThrowError('render value for <title> must be a string');

      // Dynamic case (use function that returns string)
      const hairdresser2 = Hairdresser.create();
      hairdresser2.override().title(() => undefined);

      expect(() => {
        hairdresser2.render();
      }).toThrowError('render value for <title> must be a string');
    });

    it('should throw error when element controller returns non object value', () => {
      // Static case (use static object literal)
      const hairdresser1 = Hairdresser.create();

      expect(() => {
        hairdresser1.override().meta({ title: 'name' }, undefined);
        hairdresser1.render();
      }).toThrowError('render value for <meta> must be an object');

      // Dynamic case (use function that returns object literal)
      const hairdresser2 = Hairdresser.create();
      hairdresser2.override().meta({ title: 'name' }, () => undefined);

      expect(() => {
        hairdresser2.render();
      }).toThrowError('render value for <meta> must be an object');
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
        .link({ key: 'value' }, { content: 'link value' })
        .tag('ta', { key: 'key1' }, { value: 'value1' })
        .tag('tb', { key: 'key1' }, { value: 'value1' }, { close: true });

      hairdresser.render();

      // Alphabetical order
      expect(getSortedChildrenString(head)).toBe(
        '<link content="link value" key="value">' +
        '<meta content="meta value" key="value">' +
        '<ta key="key1" value="value1">' +
        '<tb key="key1" value="value1">' +
        '<title></title>'
      );
    });

    it('should apply override after #render call to DOM object', () => {
      const hairdresser = Hairdresser.create();
      hairdresser.render();

      hairdresser.override()
        .title(() => 'title value')
        .meta({ key: 'value' }, { content: 'meta value' })
        .link({ key: 'value' }, { content: 'link value' })
        .tag('ta', { key: 'key1' }, { value: 'value1' })
        .tag('tb', { key: 'key1' }, { value: 'value1' }, { close: true });

      expect(getSortedChildrenString(head)).toBe(
        // Override method call order
        '<link content="link value" key="value">' +
        '<meta content="meta value" key="value">' +
        '<ta key="key1" value="value1">' +
        '<tb key="key1" value="value1">' +
        '<title>title value</title>'
      );

      hairdresser.override()
        .title(() => 'overridden title value')
        .meta({ key: 'value' }, { content: 'overridden meta value' })
        .link({ key: 'value' }, { content: 'overridden link value' })
        .tag('ta', { key: 'key1' }, { value: 'value2' })
        .tag('tb', { key: 'key1' }, { value: 'value2' }, { close: true });

      expect(getSortedChildrenString(head)).toBe(
        '<link content="overridden link value" key="value">' +
        '<meta content="overridden meta value" key="value">' +
        '<ta key="key1" value="value2">' +
        '<tb key="key1" value="value2">' +
        '<title>overridden title value</title>'
      );
    });

    it('should return a function that stops hairdresser listening', () => {
      document.title = 'change me';

      const hairdresser = Hairdresser.create();
      hairdresser.override()
        .title(() => 'Hairdresser')
        .meta({ key: 'value' }, { content: 'meta value' })
        .link({ key: 'value' }, { content: 'link value' })
        .tag('ta', { key: 'key1' }, { value: 'value2' })
        .tag('tb', { key: 'key1' }, { value: 'value2' }, { close: true });

      const stopRendering = hairdresser.render();
      expect(stopRendering).toEqual(jasmine.any(Function));

      stopRendering();
      expect(getSortedChildrenString(head)).toBe('<title>change me</title>');

      // Override does not affect DOM after stop
      hairdresser.override().title('I do nothing');
      expect(getSortedChildrenString(head)).toBe('<title>change me</title>');
    });

    it('should update elements when override listener receives event', () => {
      const emitter = new EventEmitter();

      let title = 'old title';
      let meta = 'old meta';
      let link = 'old link';
      let ta = 'old ta';
      let tb = 'old tb';

      const hairdresser = Hairdresser.create();
      hairdresser.render();

      hairdresser.override({
        addListener: listener => emitter.addListener('override', listener),
        removeListener: listener => emitter.removeListener('override', listener),
      })
        .title(() => title)
        .meta({ key: 'value' }, () => ({ content: meta }))
        .link({ key: 'value' }, () => ({ content: link }))
        .tag('ta', { key: 'key1' }, () => ({ value: ta }))
        .tag('tb', { key: 'key1' }, () => ({ value: tb }), { close: true });

      expect(getSortedChildrenString(head)).toBe(
        '<link content="old link" key="value">' +
        '<meta content="old meta" key="value">' +
        '<ta key="key1" value="old ta">' +
        '<tb key="key1" value="old tb">' +
        '<title>old title</title>'
      );

      title = 'new title';
      meta = 'new meta';
      link = 'new link';
      ta = 'new ta';
      tb = 'new tb';

      emitter.emit('override');
      expect(getSortedChildrenString(head)).toBe(
        '<link content="new link" key="value">' +
        '<meta content="new meta" key="value">' +
        '<ta key="key1" value="new ta">' +
        '<tb key="key1" value="new tb">' +
        '<title>new title</title>'
      );
    });

    it('should update element when element listener receives event', () => {
      const emitter = new EventEmitter();

      let title = 'old title';
      let meta = 'old meta';
      let link = 'old link';
      let ta = 'old ta';
      let tb = 'old tb';

      const hairdresser = Hairdresser.create();
      hairdresser.render();

      hairdresser.override()
        .title(() => title, {
          addListener: listener => emitter.addListener('title', listener),
          removeListener: listener => emitter.removeListener('title', listener),
        })
        .meta({ key: 'value' }, () => ({ content: meta }), {
          addListener: listener => emitter.addListener('meta', listener),
          removeListener: listener => emitter.removeListener('meta', listener),
        })
        .link({ key: 'value' }, () => ({ content: link }), {
          addListener: listener => emitter.addListener('link', listener),
          removeListener: listener => emitter.removeListener('link', listener),
        })
        .tag('ta', { key: 'value' }, () => ({ content: ta }), {
          addListener: listener => emitter.addListener('ta', listener),
          removeListener: listener => emitter.removeListener('ta', listener),
        })
        .tag('tb', { key: 'value' }, () => ({ content: tb }), {
          addListener: listener => emitter.addListener('tb', listener),
          removeListener: listener => emitter.removeListener('tb', listener),
        });

      expect(getSortedChildrenString(head)).toBe(
        '<link content="old link" key="value">' +
        '<meta content="old meta" key="value">' +
        '<ta content="old ta" key="value">' +
        '<tb content="old tb" key="value">' +
        '<title>old title</title>'
      );

      title = 'new title';
      meta = 'new meta';
      link = 'new link';
      ta = 'new ta';
      tb = 'new tb';

      emitter.emit('title');
      expect(getSortedChildrenString(head)).toBe(
        '<link content="old link" key="value">' +
        '<meta content="old meta" key="value">' +
        '<ta content="old ta" key="value">' +
        '<tb content="old tb" key="value">' +
        '<title>new title</title>'
      );

      emitter.emit('meta');
      expect(getSortedChildrenString(head)).toBe(
        '<link content="old link" key="value">' +
        '<meta content="new meta" key="value">' +
        '<ta content="old ta" key="value">' +
        '<tb content="old tb" key="value">' +
        '<title>new title</title>'
      );

      emitter.emit('link');
      expect(getSortedChildrenString(head)).toBe(
        '<link content="new link" key="value">' +
        '<meta content="new meta" key="value">' +
        '<ta content="old ta" key="value">' +
        '<tb content="old tb" key="value">' +
        '<title>new title</title>'
      );

      emitter.emit('ta');
      expect(getSortedChildrenString(head)).toBe(
        '<link content="new link" key="value">' +
        '<meta content="new meta" key="value">' +
        '<ta content="new ta" key="value">' +
        '<tb content="old tb" key="value">' +
        '<title>new title</title>'
      );

      emitter.emit('tb');
      expect(getSortedChildrenString(head)).toBe(
        '<link content="new link" key="value">' +
        '<meta content="new meta" key="value">' +
        '<ta content="new ta" key="value">' +
        '<tb content="new tb" key="value">' +
        '<title>new title</title>'
      );
    });

    it('should detect stale HTML element cache and revalidate it', () => {
      const emitter = new EventEmitter();

      const hairdresser = Hairdresser.create();
      hairdresser.render();

      const override = hairdresser.override()
        .meta({ key: 'value' }, { content: 'meta' }, {
          addListener: listener => emitter.addListener('meta', listener),
          removeListener: listener => emitter.removeListener('meta', listener),
        });

      expect(getSortedChildrenString(head)).toBe(
        '<meta content="meta" key="value">' +
        '<title></title>'
      );

      // Reset
      resetHead();

      emitter.emit('meta');
      expect(getSortedChildrenString(head)).toBe(
        '<meta content="meta" key="value">' +
        '<title></title>'
      );

      // Reset
      resetHead();

      override.restore();
      expect(getSortedChildrenString(head)).toBe(
        '<title></title>'
      );
    });

    it('should preserve exisitng data', () => {
      const meta = document.createElement('meta');
      meta.setAttribute('key', 'value');
      meta.setAttribute('content', 'original value');
      meta.setAttribute('custom', 'field');
      head.appendChild(meta);

      const hairdresser = Hairdresser.create();
      hairdresser.render();

      const override = hairdresser.override()
        .meta({ key: 'value' }, { content: 'meta' });

      expect(getSortedChildrenString(head)).toBe(
        '<meta content="meta" custom="field" key="value">' +
        '<title></title>'
      );

      override.restore();

      expect(getSortedChildrenString(head)).toBe(
        '<meta content="original value" custom="field" key="value">' +
        '<title></title>'
      );
    });

    describe('with string parameter', () => {
      it('should append output to element selected with given string', () => {
        const rootElement = document.createElement('div');
        rootElement.id = 'root';
        document.body.appendChild(rootElement);

        const hairdresser = Hairdresser.create();
        hairdresser.render('#root');
        hairdresser.override()
          .meta({ key: 'value' }, { content: 'meta' });

        expect(getSortedChildrenString(rootElement)).toBe('<meta content="meta" key="value">');
      });
    });

    describe('with HtmlElement parameter', () => {
      it('should append output to given element', () => {
        const rootElement = document.createElement('div');
        document.body.appendChild(rootElement);

        const hairdresser = Hairdresser.create();
        hairdresser.render(rootElement);
        hairdresser.override()
          .meta({ key: 'value' }, { content: 'meta' });

        expect(getSortedChildrenString(rootElement)).toBe('<meta content="meta" key="value">');
      });
    });
  });
});
