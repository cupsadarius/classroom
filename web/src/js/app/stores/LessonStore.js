/* @flow */

import BaseStore, {generateCreateStore} from './BaseStore.js';
import Lesson from '../models/Lesson.js';
import {LessonsLoadedSuccessfullyEvent, SelectLessonEvent, LessonFormErrorsEvent} from '../events/LessonEvents.js';

export class LessonStore extends BaseStore {
  constructor() {
    super();

    this.state = {
      lessons: null,
      selectedLesson: new Lesson(),
      errors: '',
    };
  }

  onLessonsLoadedSuccessfullyEvent(event: LessonsLoadedSuccessfullyEvent) {
    const state = this.getState();
    state.lessons = event.lessons;
    this.update(state);
    this.emitChange();
  }

  onSelectLessonEvent(event: SelectLessonEvent) {
    const state = this.getState();
    state.selectedLesson = event.lesson;
    this.update(state);
    this.emitChange();
  }

  onLessonFormErrorsEvent(event: LessonFormErrorsEvent) {
    const state = this.getState();
    state.errors = event.errors;
    this.update(state);
    this.emitChange();
  }

  getLessonById(lessonId: string) {
    return this.state.lessons ? this.state.lessons.filter(lesson => lesson.getId() === lessonId).pop() : null;
  }
}

export let createStore = generateCreateStore(LessonStore);
