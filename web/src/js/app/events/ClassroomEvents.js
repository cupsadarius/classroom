/* @flow */
import Classroom from '../models/Classroom.js';

export class LoadClassroomsEvent {
  className: String;

  constructor() {
    this.className = 'LoadClassroomsEvent';
  }
}

export class ClassroomsLoadedSuccessfullyEvent {
  className: String;
  classrooms: Classroom[];

  constructor(classrooms: Classroom[]) {
    this.className = 'ClassroomsLoadedSuccessfullyEvent';
    this.classrooms = classrooms;
  }
}

export class SaveClassroomEvent {
  className: String;
  classroom: Classroom;

  constructor(classroom: Classroom) {
    this.className = 'SaveClassroomEvent';
    this.classroom = classroom;
  }
}

export class SelectClassroomEvent {
  className: String;
  classroom: Classroom;

  constructor(classroom: Classroom) {
    this.className = 'SelectClassroomEvent';
    this.classroom = classroom;
  }
}

export class DeleteClassroomEvent {
  className: String;
  classroomId: String;

  constructor(classroomId: String) {
    this.className = 'DeleteClassroomEvent';
    this.classroomId = classroomId;
  }
}

export class ClassroomFormErrorsEvent {
  className: String;
  errors: String;

  constructor(errors: String) {
    this.className = 'ClassroomFormErrorsEvent';
    this.errors = errors;
  }
}