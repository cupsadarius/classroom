/* @flow */
import Lesson from '../models/Lesson.js';

export class LoadLessonsEvent {
  className: string;

  constructor() {
    this.className = 'LoadLessonsEvent';
  }
}

export class LessonsLoadedSuccessfullyEvent {
  className: string;
  lessons: Lesson[];

  constructor(lessons: Lesson[]) {
    this.className = 'LessonsLoadedSuccessfullyEvent';
    this.lessons = lessons;
  }
}

export class SaveLessonEvent {
  className: string;
  lesson: Lesson;

  constructor(lesson: Lesson) {
    this.className = 'SaveLessonEvent';
    this.lesson = lesson;
  }
}

export class SelectLessonEvent {
  className: string;
  lesson: Lesson;

  constructor(lesson: Lesson) {
    this.className = 'SelectLessonEvent';
    this.lesson = lesson;
  }
}

export class DeleteLessonEvent {
  className: string;
  lessonId: string;

  constructor(lessonId: string) {
    this.className = 'DeleteLessonEvent';
    this.lessonId = lessonId;
  }
}

export class LessonFormErrorsEvent {
  className: string;
  errors: string;

  constructor(errors: string) {
    this.className = 'LessonFormErrorsEvent';
    this.errors = errors;
  }
}
