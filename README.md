<img src="https://github.com/pawsong/hairdresser/blob/master/resources/logo.png" alt="logo.png" width="450px">

  A universal js library for managing head DOM elements (title, link and meta)
  
  Browser support includes every sane browser and IE8+. (IE8 with [es5-shim](https://github.com/es-shims/es5-shim))

  [![NPM Version][npm-image]][npm-url]
  [![Linux Build][travis-image]][travis-url]
  [![Windows Build][appveyor-image]][appveyor-url]
  [![Coverage Status][coveralls-image]][coveralls-url]

  [![Sauce Test Status][saucelabs-image]][saucelabs-url]

```javascript
var hairdresser = Hairdresser.create();
hairdresser.override()
  .title('Hairdresser')
  .meta({ property: 'og:title' }, { content: 'Hairdresser' });

hairdresser.render();
```

# Features
* Manages `<head>`'s child elements (ex. `<title>`, `<meta>` and `<link>`)
* Hierarchical state friendly API
* Server-side rendering

# Motivation
## Independence from framework
There are already good projects for managing `<title>`, `<meta>` and `<link>` elements. Following are some of the projects:

- [angularjs-viewhead](https://github.com/apparentlymart/angularjs-viewhead)
- [ngPageHeadMeta](https://github.com/iktw/ngPageHeadMeta)
- [react-helmet](https://github.com/nfl/react-helmet)
- [react-document-title](https://github.com/gaearon/react-document-title)
- [ember-meta-meta](https://github.com/didacte/ember-meta-meta)

Most of the projects depend on client-side frameworks like AngularJS or ReactJS. Using frameworks can make code shorter and simpler, but it also costs flexibility and maintainability. I think the cost exceeds the benefit. There are good framework independent libraries for [sortable UI ](https://github.com/RubaXa/Sortable) and [drag and drop](https://github.com/bevacqua/dragula). Why not for `<head>` manipulation?

## Hierarchical state friendly API
As `<head>`'s child elements represent state of the app, `<head>` manager should receive state change events and change `<head>` rendering function properly. For example, an app uses app name for `<title>` on root state, and uses title of the article for `<title>` on article showing state.

In most cases, app uses hierarchical state like this:

> Root > Category > Sub category > Article List

Hierarchical architecture is popular (ex. file system), and can take advantage of URL's hierarchical representation. In fact, the strength of hierarchical state is not important. The thing is, hierarchical state is common for web apps and `<head>` manager should offer hierarchical state friendly API.

# How to use
## 1. Get started with default values
Let's start by creating a Hairdresser instance.

```javascript
// With new operator
var hairdresser = new Hairdresser();

// Or with static function
var hairdresser = Hairdresser.create();
```

Hairdresser manages one controller per DOM element in an override fashion. A controller defines when and how to render an element. To set default values, just call `hairdresser.override` and pass `render` parameter per element. `render` parameter is the first parameter of `title` method and the second parameter of `meta` and `link` methods.

```javascript
hairdresser.override()
  .title('Hairdresser')
  .meta({ name: 'title' }, { content: 'Hairdresser' })
  .link({ rel: 'canonical' }, { href: 'https://example.com' });
```

This is `<head>` inner HTML that the above code expects.

```html
<!-- Alphabetical order -->
<link rel="canonical" href="https://example.com"></meta>
<meta name="title" content="Hairdresser"></meta>
<title>Hairdresser</title>
```

`render` parameter can be a value which replaces element content or a function that returns the element replacing value. For example, following two examples change element in the same way.

```javascript
// Example1 - Use static primitive string value.
hairdresser.override()
  .title('Hairdresser');

// Example2 - Use dynamic function return value.
hairdresser.override()
  .title(function () {
    return 'Hairdresser';
  });
```

As for `<title>`, there is no need of a selector because only one `<title>` can exist. `render` parameter of `<title>` should be or return a string value because title is string.

In case of `<meta>` and `<link>`, there can be multiple elements with the same tag name in DOM, so a selector is required. The first argument of `meta` and `link` function is the selector, which represents key-value attribute pairs. Similarly, `render` parameter of `<meta>` and `<link>` should be or return an object as key-value attribute pairs.

Now we should call `hairdresser.render` in order to make Hairdresser start manipulating DOM.

```javascript
hairdresser.render();
```

## 2. Override controllers on state transition
When application state changes, you may want to change a controller to handle an element. For example, you want to set `<title>` to the default value on the main page, and want to set `<title>` to article title on article page. Then, you can override the controller for `<title>` like this:

```javascript
var article = {
  title: 'My awesome article'
};

var override = hairdresser.override()
  .title(function () {
    return article.title;
  });

// Cancel override on leaving the article page.
onLeaveState(function () {
  override.restore();
});
```

Now `<title>` is set to article's title, `My awesome article`. You can go back to the previous controller by calling `restore` method.

In case of hierarchical state, you can override a controller multiple times when you traverse down multiple child states.

## 3. Trigger update

You can update `<head>` element in two ways.

One is manual function call. `override.update` updates all the elements in `override`.

```javascript
var override = hairdresser.override()
  .title(getTitle);

onDataReceived(function () {

  // Manual update
  override.update();
});
```

The other one is using event listeners. A listener can be added to `override` and each element.

Many event emitter's listener adding functions return listener removing function. For those cases, to manage the removing function in a simple way, the return value of addListener is passed to removeListener as the second parameter.

```javascript
// Use fbemitter (https://github.com/facebook/emitter)
var emitter = new EventEmitter();

// Listener per override
var override = hairdresser.override({
  addListener: function (listener) {
    return emitter.addListener('update.override', listener);
  },
  removeListener: function (listener, token) {
    token.remove();
  },
}).title(getTitle);

emitter.emit('update.override');

// Listener per element
var override = hairdresser.override()
  .title(getTitle, {
    addListener: function (listener) {
      return emitter.addListener('update.title', listener);
    },
    removeListener: function (listener, token) {
      token.remove();
    });
  });

emitter.emit('update.title');
```

## 4. Render to DOM or string

This library is [universal](https://medium.com/@mjackson/universal-javascript-4761051b7ae9). You can modify `<head>` DOM element on browser.

```javascript
var hairdresser = Hairdresser.create();
hairdresser.override().title('Hairdresser');

// render() will render `<head>` DOM element,
// and watch further overrides.
hairdresser.render();
```

You can also get elements as a string value.

```javascript
var hairdresser = Hairdresser.create();
hairdresser.override().title('Hairdresser');

var head = hairdresser.renderToString();
assert(head === '<title>Hairdresser</title>');
```

# API

Refer to [API documentation](https://pawsong.github.io/hairdresser)

# Roadmap

Refer to [Roadmap documentation](/ROADMAP.md)

# Examples
- [angular](/examples/angular)
- [react](/examples/react)

# License
MIT

[npm-image]: https://img.shields.io/npm/v/hairdresser.svg
[npm-url]: https://npmjs.org/package/hairdresser

[travis-image]: https://img.shields.io/travis/pawsong/hairdresser/master.svg?label=linux
[travis-url]: https://travis-ci.org/pawsong/hairdresser
[appveyor-image]: https://img.shields.io/appveyor/ci/pawsong/hairdresser/master.svg?label=windows
[appveyor-url]: https://ci.appveyor.com/project/pawsong/hairdresser

[coveralls-image]: https://coveralls.io/repos/pawsong/hairdresser/badge.svg?branch=master&service=github
[coveralls-url]: https://coveralls.io/github/pawsong/hairdresser?branch=master

[saucelabs-image]: https://saucelabs.com/browser-matrix/hairdresser.svg
[saucelabs-url]: https://saucelabs.com/u/hairdresser
