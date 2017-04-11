/* @flow */
import Lesson from '../models/Lesson.js';

export class LoadLessonsEvent {
  className: String;

  constructor() {
    this.className = 'LoadLessonsEvent';
  }
}

export class LessonsLoadedSuccessfullyEvent {
  className: String;
  lessons: Lesson[];

  constructor(lessons: Lesson[]) {
    this.className = 'LessonsLoadedSuccessfullyEvent';
    this.lessons = lessons;
  }
}

export class SaveLessonEvent {
  className: String;
  lesson: Lesson;

  constructor(lesson: Lesson) {
    this.className = 'SaveLessonEvent';
    this.lesson = lesson;
  }
}

export class SelectLessonEvent {
  className: String;
  lesson: Lesson;

  constructor(lesson: Lesson) {
    this.className = 'SelectLessonEvent';
    this.lesson = lesson;
  }
}

export class DeleteLessonEvent {
  className: String;
  lessonId: String;

  constructor(lessonId: String) {
    this.className = 'DeleteLessonEvent';
    this.lessonId = lessonId;
  }
}

export class LessonFormErrorsEvent {
  className: String;
  errors: String;

  constructor(errors: String) {
    this.className = 'LessonFormErrorsEvent';
    this.errors = errors;
  }
}