/* @flow */

import BaseStore, {generateCreateStore} from './BaseStore.js';
import Session from '../models/Session.js';
import {LoadSessionsEvent, SelectSessionEvent, SessionFormErrorsEvent} from '../events/SessionEvents.js';

export class SessionStore extends BaseStore {
  constructor() {
    super();

    this.state = {
      sessions: null,
      selectedSession: new Session(),
      errors: '',
    };
  }

  onLoadSessionsEvent(event: LoadSessionsEvent) {
    const state = this.getState();
    state.sessions = event.sessions;
    this.update(state);
    this.emitChange();
  }

  onSelectSessionEvent(event: SelectSessionEvent) {
    const state = this.getState();
    state.selectedSession = event.session;
    this.update(state);
    this.emitChange();
  }

  onSessionFormErrorsEvent(event: SessionFormErrorsEvent) {
    const state = this.getState();
    state.errors = event.errors;
    this.update(state);
    this.emitChange();
  }

  getSessionById(id: string) {
    return this.state.sessions ? this.state.sessions.filter(session => session.getId() === id).pop() : null;
  }
}

export let createStore = generateCreateStore(SessionStore);
