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
