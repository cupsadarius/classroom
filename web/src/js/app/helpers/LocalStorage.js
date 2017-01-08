/* @flow */
import Base64 from './Base64.js';

export class LocalStorage {
  constructor() {
    window.LocalStorage = this;
  }

  set(key, value) {
    window.localStorage.setItem(Base64.encode(key), Base64.encode(value));
  }

  get(key) {
    if (window.localStorage.getItem(Base64.encode(key))) {
      return Base64.decode(window.localStorage.getItem(Base64.encode(key)));
    }
    return false;
  }

  exists(key) {
    return !!this.get(key);
  }
}

export default new LocalStorage();