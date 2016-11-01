export interface AttrsObject {
  [index: string]: string;
}

export interface EachCallback {
  (attrName: string, value: string): boolean;
}

function _toHtml(keys: string[], obj: AttrsObject): string {
  return keys
    .map(key => `${key}="${obj[key]}"`)
    .join(' ');
}

export function toHtml(obj: AttrsObject): string {
  return _toHtml(Object.keys(obj).sort(), obj);
}

function _toSelector(keys: string[], obj: AttrsObject): string {
  return keys
    .map(attrName => `[${attrName}='${obj[attrName]}']`)
    .join('');
}

export function toSelector(obj: AttrsObject): string {
  return _toSelector(Object.keys(obj).sort(), obj);
}

class Attrs {
  public html: string;
  public selector: string;

  private _data: AttrsObject;
  private _attrNames: string[];
  private _attrNamesLen: number;

  constructor(obj: AttrsObject) {
    this._data = obj;

    this._attrNames = Object.keys(this._data).sort();
    this._attrNamesLen = this._attrNames.length;

    this.html = _toHtml(this._attrNames, this._data);
    this.selector = _toSelector(this._attrNames, this._data);
  }

  each(callback: EachCallback) {
    for (let i = 0; i < this._attrNamesLen; ++i) {
      const attrName = this._attrNames[i];
      if (callback(attrName, this._data[attrName]) === false) {
        return false;
      }
    }
    return true;
  }
}

export default Attrs;
