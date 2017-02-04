/* @flow */

import BaseStore, {generateCreateStore} from './BaseStore.js';
import {UsersLoadedSuccessfullyEvent, SelectUserEvent, UserFormErrorsEvent} from '../events/UserEvents.js';
import User from '../models/User.js';
export class UserStore extends BaseStore {
  constructor() {
    super();

    this.state = {
      users: null,
      selectedUser: new User(),
      errors: null,
    };
  }

  onUsersLoadedSuccessfullyEvent(event: UsersLoadedSuccessfullyEvent) {
    const state = this.getState();
    state.users = event.users;
    this.update(state);
    this.emitChange();
  }

  onSelectUserEvent(event: SelectUserEvent) {
    const state = this.getState();
    state.selectedUser = event.user;
    this.update(state);
    this.emitChange();
  }

  onUserFormErrorsEvent(event: UserFormErrorsEvent) {
    const state = this.getState();
    state.errors = event.errors;
    this.update(state);
    this.emitChange();
  }
}

export let createStore = generateCreateStore(UserStore);