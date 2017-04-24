/* @flow */

import Student from './Student.js';

export default class Teacher extends Student {
  constructor(data?: Object) {
    super(data);
    this.addRole('ROLE_TEACHER');
  }
}
