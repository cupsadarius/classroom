/* @flow */
import BaseAction from './BaseAction.js';
import * as userEvents from '../events/UserEvents.js';

export class UserActions extends BaseAction {
  loadUsers() {
    this.trigger(new userEvents.LoadUsersEvent());
  }
}

export default new UserActions();