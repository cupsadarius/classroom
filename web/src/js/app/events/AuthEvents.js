/* @flow */
import User from '../models/User.js';

export class LogoutEvent {
  className: String;

  constructor() {
    this.className = 'LogoutEvent';
  }
}

export class LoginEvent {
  className: String;
  email: String;
  password: String;

  constructor(email: String, password: String) {
    this.className = 'LoginEvent';
    this.email = email;
    this.password = password;
  }
}

export class LoginSuccessfulEvent {
  className: String;
  token: String;

  constructor(token: String) {
    this.className = 'LoginSuccessfulEvent';
    this.token = token;
  }
}

export class LoginUnsuccessfulEvent {
  className: String;
  error: String;

  constructor(error: String) {
    this.className = 'LoginUnsuccessfulEvent';
    this.error = error;
  }
}

export class GetCurrentUserEvent{
  className: String;

  constructor() {
    this.className = 'GetCurrentUserEvent';
  }
}

export class GetCurrentUserSuccessfullyEvent {
  className: String;
  currentUser: User;

  constructor(currentUser) {
    this.className = 'GetCurrentUserSuccessfullyEvent';
    this.currentUser = currentUser instanceof User ? currentUser : new User(currentUser);
  }
}

export class GetCurrentUserUnSuccessfullyEvent {
  className: String;

  constructor() {
    this.className = 'GetCurrentUserUnSuccessfullyEvent';
  }
}