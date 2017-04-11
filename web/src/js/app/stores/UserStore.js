/* @flow */

import BaseStore, {generateCreateStore} from './BaseStore.js';
import {UsersLoadedSuccessfullyEvent, SelectUserEvent, UserFormErrorsEvent} from '../events/UserEvents.js';
import {
  TeachersLoadedSuccessfullyEvent,
  StudentsLoadedSuccessfullyEvent,
  AttendeeFormErrorsEvent
} from '../events/AttendeeEvents.js';
import User from '../models/User.js';

export class UserStore extends BaseStore {
  constructor() {
    super();

    this.state = {
      users: null,
      teachers: null,
      students: null,
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

  onTeachersLoadedSuccessfullyEvent(event: TeachersLoadedSuccessfullyEvent) {
    const state = this.getState();
    state.teachers = event.users;
    this.update(state);
    this.emitChange();
  }

  onStudentsLoadedSuccessfullyEvent(event: StudentsLoadedSuccessfullyEvent) {
    const state = this.getState();
    state.students = event.users;
    this.update(state);
    this.emitChange();
  }

  onAttendeeFormErrorsEvent(event: AttendeeFormErrorsEvent) {
    const state = this.getState();
    state.errors = event.errors;
    this.update(state);
    this.emitChange();
  }
}

export let createStore = generateCreateStore(UserStore);