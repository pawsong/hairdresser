'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _objectKeys = require('object-keys');

var _objectKeys2 = _interopRequireDefault(_objectKeys);

var Attrs = (function () {
  Attrs._toHtml = function _toHtml(keys, obj) {
    return keys.map(function (key) {
      return key + '="' + obj[key] + '"';
    }).join(' ');
  };

  Attrs.toHtml = function toHtml(obj) {
    return Attrs._toHtml(_objectKeys2['default'](obj).sort(), obj);
  };

  Attrs._toSelector = function _toSelector(keys, obj) {
    return keys.map(function (attrName) {
      return '[' + attrName + '=\'' + obj[attrName] + '\']';
    }).join('');
  };

  Attrs.toSelector = function toSelector(obj) {
    return Attrs._toSelector(_objectKeys2['default'](obj).sort(), obj);
  };

  function Attrs(obj) {
    _classCallCheck(this, Attrs);

    this._data = obj;

    this._attrNames = _objectKeys2['default'](this._data).sort();
    this._attrNamesLen = this._attrNames.length;

    this.html = Attrs._toHtml(this._attrNames, this._data);
    this.selector = Attrs._toSelector(this._attrNames, this._data);
  }

  Attrs.prototype.each = function each(callback) {
    for (var i = 0; i < this._attrNamesLen; ++i) {
      var attrName = this._attrNames[i];
      if (callback(attrName, this._data[attrName]) === false) {
        return false;
      }
    }
    return true;
  };

  return Attrs;
})();

exports['default'] = Attrs;
module.exports = exports['default'];