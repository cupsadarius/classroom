/* @flow */
import User from '../models/User.js';

export class LoadUsersEvent {
  className: string;

  constructor() {
    this.className = 'LoadUsersEvent';
  }
}

export class UsersLoadedSuccessfullyEvent {
  className: string;
  users: User[];

  constructor(users: User[]) {
    this.className = 'UsersLoadedSuccessfullyEvent';
    this.users = users;
  }
}

export class SelectUserEvent {
  className: string;
  user: User;

  constructor(user: User) {
    this.className = 'SelectUserEvent';
    this.user = user;
  }
}

export class SaveUserEvent {
  className: string;
  user: User;

  constructor(user: User) {
    this.className = 'SaveUserEvent';
    this.user = user;
  }
}

export class DeleteUserEvent {
  className: string;
  userId: string;

  constructor(userId: string) {
    this.className = 'DeleteUserEvent';
    this.userId = userId;
  }
}

export class UserFormErrorsEvent {
  className: string;
  errors: string;

  constructor(errors: string) {
    this.className = 'UserFormErrorsEvent';
    this.errors = errors;
  }
}
