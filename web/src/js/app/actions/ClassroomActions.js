/* @flow */

import BaseAction from './BaseAction.js';
import * as classroomEvents from '../events/ClassroomEvents.js';
import Classroom from '../models/Classroom.js';

export class ClassroomActions extends BaseAction {
  loadClassrooms() {
    this.trigger(new classroomEvents.LoadClassroomsEvent());
  }
  selectClassroom(classroom: Classroom) {
    this.trigger(new classroomEvents.SelectClassroomEvent(classroom));
  }
  deleteClassroom(classroomId: String) {
    this.trigger(new classroomEvents.DeleteClassroomEvent(classroomId));
  }
  saveClassroom(classroom: Classroom) {
    this.trigger(new classroomEvents.SaveClassroomEvent(classroom));
  }
}

export default new ClassroomActions();