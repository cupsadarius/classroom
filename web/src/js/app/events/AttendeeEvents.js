/* @flow */
import User from '../models/User.js';

export class LoadTeachersEvent {
  className: String;

  constructor() {
    this.className = 'LoadTeachersEvent';
  }
}

export class LoadStudentsEvent {
  className: String;

  constructor() {
    this.className = 'LoadStudentsEvent';
  }
}

export class TeachersLoadedSuccessfullyEvent {
  className: String;
  users: User[];

  constructor(users) {
    this.className = 'TeachersLoadedSuccessfullyEvent';
    this.users = users;
  }
}

export class StudentsLoadedSuccessfullyEvent {
  className: String;
  users: User[];

  constructor(users) {
    this.className = 'StudentsLoadedSuccessfullyEvent';
    this.users = users;
  }
}

export class SelectAttendeeEvent {
  className: String;
  user: User;

  constructor(user: User) {
    this.className = 'SelectAttendeeEvent';
    this.user = user;
  }
}

export class SaveAttendeeEvent {
  className: String;
  user: User;

  constructor(user: User) {
    this.className = 'SaveAttendeeEvent';
    this.user = user;
  }
}

export class DeleteAttendeeEvent {
  className: String;
  userId: String;

  constructor(userId: String) {
    this.className = 'DeleteAttendeeEvent';
    this.userId = userId;
  }
}

export class AttendeeFormErrorsEvent {
  className: String;
  errors: String;

  constructor(errors: String) {
    this.className = 'AttendeeFormErrorsEvent';
    this.errors = errors;
  }
}