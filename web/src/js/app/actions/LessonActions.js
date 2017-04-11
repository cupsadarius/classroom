/* @flow */

import BaseAction from './BaseAction.js';
import * as lessonEvents from '../events/LessonEvents.js';
import Lesson from '../models/Lesson.js';

export class LessonActions extends BaseAction {
  loadLessons() {
    this.trigger(new lessonEvents.LoadLessonsEvent());
  }
  selectLesson(lesson: Lesson) {
    this.trigger(new lessonEvents.SelectLessonEvent(lesson));
  }
  deleteLesson(lessonId: String) {
    this.trigger(new lessonEvents.DeleteLessonEvent(lessonId));
  }
  saveLesson(lesson: Lesson) {
    this.trigger(new lessonEvents.SaveLessonEvent(lesson));
  }
}

export default new LessonActions();