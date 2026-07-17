/* @flow */
import Classroom from '../models/Classroom.js';

export class LoadClassroomsEvent {
  className: string;

  constructor() {
    this.className = 'LoadClassroomsEvent';
  }
}

export class ClassroomsLoadedSuccessfullyEvent {
  className: string;
  classrooms: Classroom[];

  constructor(classrooms: Classroom[]) {
    this.className = 'ClassroomsLoadedSuccessfullyEvent';
    this.classrooms = classrooms;
  }
}

export class SaveClassroomEvent {
  className: string;
  classroom: Classroom;

  constructor(classroom: Classroom) {
    this.className = 'SaveClassroomEvent';
    this.classroom = classroom;
  }
}

export class SelectClassroomEvent {
  className: string;
  classroom: Classroom;

  constructor(classroom: Classroom) {
    this.className = 'SelectClassroomEvent';
    this.classroom = classroom;
  }
}

export class DeleteClassroomEvent {
  className: string;
  classroomId: string;

  constructor(classroomId: string) {
    this.className = 'DeleteClassroomEvent';
    this.classroomId = classroomId;
  }
}

export class ClassroomFormErrorsEvent {
  className: string;
  errors: string;

  constructor(errors: string) {
    this.className = 'ClassroomFormErrorsEvent';
    this.errors = errors;
  }
}
