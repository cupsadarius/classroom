/* @flow */

import BaseStore, {generateCreateStore} from './BaseStore.js';
import LocalStorage from '../helpers/LocalStorage.js';
import {browserHistory} from 'react-router';
import User from '../models/User.js';

import {LoginSuccessfulEvent, LoginUnsuccessfulEvent, GetCurrentUserSuccessfullyEvent} from '../events/AuthEvents.js';

export class AuthStore extends BaseStore {

  constructor() {
    super();
    this.state = {
      token: LocalStorage.get('token') || '',
      error: '',
      currentUser: LocalStorage.get('currentUser') ? new User(JSON.parse(LocalStorage.get('currentUser'))) : null,
    };
  }

  onLoginSuccessfulEvent(event: LoginSuccessfulEvent) {
    const state = this.getState();
    state.token = event.token;
    LocalStorage.set('token', event.token);
    state.error = '';
    this.update(state);
    this.emitChange();
    browserHistory.push('/home');
  }

  onLoginUnsuccessfulEvent(event: LoginUnsuccessfulEvent) {
    const state = this.getState();
    state.error = event.error;
    this.update(state);
    this.emitChange();
  }

  onGetCurrentUserSuccessfullyEvent(event: GetCurrentUserSuccessfullyEvent) {
    const state = this.getState();
    state.currentUser = event.currentUser;
    LocalStorage.set('currentUser', JSON.stringify(event.currentUser));
    this.update(state);
    this.emitChange();
  }

  onGetCurrentUserUnSuccessfullyEvent() {
    const state = this.getState();
    state.currentUser = null;
    LocalStorage.set('currentUser', '');
    this.update(state);
    this.emitChange();
  }

  onLogoutEvent() {
    const state = this.getState();
    state.currentUser = null;
    state.token = '';
    state.error = '';
    LocalStorage.set('token', '');
    LocalStorage.set('currentUser', '');
    this.update(state);
    this.emitChange();
    browserHistory.push('/');
  }
}

export let createStore = generateCreateStore(AuthStore);