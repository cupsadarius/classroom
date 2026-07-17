/* @flow */

import BaseAction from './BaseAction.js';
import * as authEvents from '../events/AuthEvents.js';

export class AuthActions extends BaseAction {
  login(email: string, password: string) {
    this.trigger(new authEvents.LoginEvent(email, password));
  }

  logout() {
    this.trigger(new authEvents.LogoutEvent());
  }
}

export default new AuthActions();
