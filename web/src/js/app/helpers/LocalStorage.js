/* @flow */
import Base64 from './Base64.js';

export class LocalStorage {
  constructor() {
    window.LocalStorage = this;
  }

  set(key: string, value: string) {
    window.localStorage.setItem(Base64.encode(key), Base64.encode(value));
  }

  get(key: string) {
    if (window.localStorage.getItem(Base64.encode(key))) {
      return Base64.decode(window.localStorage.getItem(Base64.encode(key)));
    }
    return '';
  }

  exists(key: string) {
    return Boolean(this.get(key));
  }
}

export default new LocalStorage();
