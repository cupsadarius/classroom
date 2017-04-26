/* @flow */
import User from '../models/User.js';

export class LogoutEvent {
  className: string;

  constructor() {
    this.className = 'LogoutEvent';
  }
}

export class LoginEvent {
  className: string;
  email: string;
  password: string;

  constructor(email: string, password: string) {
    this.className = 'LoginEvent';
    this.email = email;
    this.password = password;
  }
}

export class LoginSuccessfulEvent {
  className: string;
  token: string;

  constructor(token: string) {
    this.className = 'LoginSuccessfulEvent';
    this.token = token;
  }
}

export class LoginUnsuccessfulEvent {
  className: string;
  error: string;

  constructor(error: string) {
    this.className = 'LoginUnsuccessfulEvent';
    this.error = error;
  }
}

export class GetCurrentUserEvent {
  className: string;

  constructor() {
    this.className = 'GetCurrentUserEvent';
  }
}

export class GetCurrentUserSuccessfullyEvent {
  className: string;
  currentUser: User;

  constructor(currentUser: User) {
    this.className = 'GetCurrentUserSuccessfullyEvent';
    this.currentUser = currentUser instanceof User ? currentUser : new User(currentUser);
  }
}

export class GetCurrentUserUnSuccessfullyEvent {
  className: string;

  constructor() {
    this.className = 'GetCurrentUserUnSuccessfullyEvent';
  }
}
