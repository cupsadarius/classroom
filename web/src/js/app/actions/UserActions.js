/* @flow */
import BaseAction from './BaseAction.js';
import User from '../models/User.js';
import * as userEvents from '../events/UserEvents.js';

export class UserActions extends BaseAction {
  loadUsers() {
    this.trigger(new userEvents.LoadUsersEvent());
  }
  selectUser(user: User) {
    this.trigger(new userEvents.SelectUserEvent(user));
  }
  saveUser(user: User) {
    this.trigger(new userEvents.SaveUserEvent(user));
  }
  deleteUser(userId: string) {
    this.trigger(new userEvents.DeleteUserEvent(userId));
  }
}

export default new UserActions();
