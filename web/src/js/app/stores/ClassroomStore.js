/* @flow */

import BaseStore, {generateCreateStore} from './BaseStore.js';
import Classroom from '../models/Classroom.js';
import {ClassroomsLoadedSuccessfullyEvent, SelectClassroomEvent, ClassroomFormErrorsEvent} from '../events/ClassroomEvents.js';

export class ClassroomStore extends BaseStore {
  constructor() {
    super();

    this.state = {
      classrooms: null,
      selectedClassroom: new Classroom(),
      errors: ''
    };
  }

  onClassroomsLoadedSuccessfullyEvent(event: ClassroomsLoadedSuccessfullyEvent) {
    const state = this.getState();
    state.classrooms = event.classrooms;
    this.update(state);
    this.emitChange();
  }

  onSelectClassroomEvent(event: SelectClassroomEvent) {
    const state = this.getState();
    state.selectedClassroom = event.classroom;
    this.update(state);
    this.emitChange();
  }

  onClassroomFormErrorsEvent(event: ClassroomFormErrorsEvent) {
    const state = this.getState();
    state.errors = event.errors;
    this.update(state);
    this.emitChange();
  }
}

export let createStore = generateCreateStore(ClassroomStore);