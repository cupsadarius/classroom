/* @flow */

import BaseStore, {generateCreateStore} from './BaseStore.js';
import {UsersLoadedSuccessfullyEvent} from '../events/UserEvents.js';
export class UserStore extends BaseStore {
  constructor() {
    super();

    this.state = {
      users: null,
      selectedUser: null,
    }
  }

  onUsersLoadedSuccessfullyEvent(event: UsersLoadedSuccessfullyEvent) {
    const state = this.getState();
    state.users = event.users;
    this.update(state);
    this.emitChange();
  }
}

export let createStore = generateCreateStore(UserStore);