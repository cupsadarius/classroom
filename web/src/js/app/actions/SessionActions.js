/* @flow */

import BaseAction from './BaseAction.js';
import * as sessionEvents from '../events/SessionEvents.js';
import Classroom from '../models/Classroom.js';
import Session from '../models/Session.js';

export class SessionActions extends BaseAction {
  loadSessions(sessions: Session[]) {
    this.trigger(new sessionEvents.LoadSessionsEvent(sessions));
  }
  selectSession(session: Session) {
    this.trigger(new sessionEvents.SelectSessionEvent(session));
  }
  deleteSession(classroomId: string, sessionId: string) {
    this.trigger(new sessionEvents.DeleteSessionEvent(classroomId, sessionId));
  }
  saveSession(classroom: Classroom, session: Session) {
    this.trigger(new sessionEvents.SaveSessionEvent(classroom, session));
  }
}

export default new SessionActions();
