import objectKeys from 'object-keys';

export default class Attrs {
  static _toHtml(keys, obj) {
    return keys
      .map(key => `${key}="${obj[key]}"`)
      .join(' ');
  }

  static toHtml(obj) {
    return Attrs._toHtml(objectKeys(obj).sort(), obj);
  }

  static _toSelector(keys, obj) {
    return keys
      .map(attrName => `[${attrName}='${obj[attrName]}']`)
      .join('');
  }

  static toSelector(obj) {
    return Attrs._toSelector(objectKeys(obj).sort(), obj);
  }

  constructor(obj) {
    this._data = obj;

    this._attrNames = objectKeys(this._data).sort();
    this._attrNamesLen = this._attrNames.length;

    this.html = Attrs._toHtml(this._attrNames, this._data);
    this.selector = Attrs._toSelector(this._attrNames, this._data);
  }

  each(callback) {
    for (let i = 0; i < this._attrNamesLen; ++i) {
      const attrName = this._attrNames[i];
      if (callback(attrName, this._data[attrName]) === false) {
        return false;
      }
    }
    return true;
  }
}
