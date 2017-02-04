/* @flow */
import User from '../models/User.js';

export class LoadUsersEvent {
  className: String;

  constructor() {
    this.className = 'LoadUsersEvent';
  }
}

export class UsersLoadedSuccessfullyEvent {
  className: String;
  users: User[];

  constructor(users) {
    this.className = 'UsersLoadedSuccessfullyEvent';
    this.users = users;
  }
}

export class SelectUserEvent {
  className: String;
  user: User;

  constructor(user: User) {
    this.className = 'SelectUserEvent';
    this.user = user;
  }
}

export class SaveUserEvent {
  className: String;
  user: User;

  constructor(user: User) {
    this.className = 'SaveUserEvent';
    this.user = user;
  }
}

export class DeleteUserEvent {
  className: String;
  userId: String;

  constructor(userId: String) {
    this.className = 'DeleteUserEvent';
    this.userId = userId;
  }
}

export class UserFormErrorsEvent {
  className: String;
  errors: String;

  constructor(errors: String) {
    this.className = 'UserFormErrorsEvent';
    this.errors = errors;
  }
}