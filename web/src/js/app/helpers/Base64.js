/* @flow */
/* eslint-disable */
export class Base64 {

  encode(string: string) {
    return btoa(encodeURIComponent(string).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode(Number(`0x${p1}`));
    }));
  }

  decode(string: string) {
    return decodeURIComponent(
      Array.prototype.map.call(
        atob(string),
        (c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }
      ).join(''));
  }
}

export default new Base64();
