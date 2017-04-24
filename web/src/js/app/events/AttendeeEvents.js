/* @flow */
import User from '../models/User.js';

export class LoadTeachersEvent {
  className: string;

  constructor() {
    this.className = 'LoadTeachersEvent';
  }
}

export class LoadStudentsEvent {
  className: string;

  constructor() {
    this.className = 'LoadStudentsEvent';
  }
}

export class TeachersLoadedSuccessfullyEvent {
  className: string;
  users: User[];

  constructor(users: User[]) {
    this.className = 'TeachersLoadedSuccessfullyEvent';
    this.users = users;
  }
}

export class StudentsLoadedSuccessfullyEvent {
  className: string;
  users: User[];

  constructor(users: User[]) {
    this.className = 'StudentsLoadedSuccessfullyEvent';
    this.users = users;
  }
}

export class SelectAttendeeEvent {
  className: string;
  user: User;

  constructor(user: User) {
    this.className = 'SelectAttendeeEvent';
    this.user = user;
  }
}

export class SaveAttendeeEvent {
  className: string;
  user: User;

  constructor(user: User) {
    this.className = 'SaveAttendeeEvent';
    this.user = user;
  }
}

export class DeleteAttendeeEvent {
  className: string;
  userId: string;

  constructor(userId: string) {
    this.className = 'DeleteAttendeeEvent';
    this.userId = userId;
  }
}

export class AttendeeFormErrorsEvent {
  className: string;
  errors: string;

  constructor(errors: string) {
    this.className = 'AttendeeFormErrorsEvent';
    this.errors = errors;
  }
}
