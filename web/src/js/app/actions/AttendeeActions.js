/* @flow */
import BaseAction from './BaseAction.js';
import User from '../models/User.js';
import * as attendeeEvents from '../events/AttendeeEvents.js';

export class AttendeeActions extends BaseAction {
  loadTeachers() {
    this.trigger(new attendeeEvents.LoadTeachersEvent());
  }
  loadStudents() {
    this.trigger(new attendeeEvents.LoadStudentsEvent());
  }
  selectAttendee(user: User) {
    this.trigger(new attendeeEvents.SaveAttendeeEvent(user));
  }
  saveAttendee(user: User) {
    this.trigger(new attendeeEvents.SaveAttendeeEvent(user));
  }
  deleteAttendee(userId: String) {
    this.trigger(new attendeeEvents.DeleteAttendeeEvent(userId));
  }
}

export default new AttendeeActions();