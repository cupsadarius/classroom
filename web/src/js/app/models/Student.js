/* @flow */

import User from './User.js';

export default class Student extends User {
  constructor(data) {
    super(data);
    this.addRole('ROLE_STUDENT');
  }
}