/* @flow */
import Classroom from '../models/Classroom.js';
import Session from '../models/Session.js';

export class LoadSessionsEvent {
  className: string;
  sessions: Session[];

  constructor(sessions: Session[]) {
    this.className = 'LoadSessionsEvent';
    this.sessions = sessions;
  }
}

export class SaveSessionEvent {
  className: string;
  classroom: Classroom;
  session: Session;

  constructor(classroom: Classroom, session: Session) {
    this.className = 'SaveSessionEvent';
    this.classroom = classroom;
    this.session = session;
  }
}

export class SelectSessionEvent {
  className: string;
  session: Session;

  constructor(session: Session) {
    this.className = 'SelectSessionEvent';
    this.session = session;
  }
}

export class DeleteSessionEvent {
  className: string;
  classroomId: string;
  sessionId: string;

  constructor(classroomId: string, sessionId: string) {
    this.className = 'DeleteSessionEvent';
    this.classroomId = classroomId;
    this.sessionId = sessionId;
  }
}

export class SessionFormErrorsEvent {
  className: string;
  errors: string;

  constructor(errors: string) {
    this.className = 'SessionFormErrorsEvent';
    this.errors = errors;
  }
}
