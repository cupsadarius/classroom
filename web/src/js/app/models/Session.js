import Lesson from './Lesson.js';

export default class Session {
  id: String;
  startDate: Date;
  endDate: Date;
  lesson: Lesson;

  constructor(data) {
    this.id = null;
    this.startDate = null;
    this.endDate = null;
    this.lesson = null;
    if(data) {
      this.populate(data);
    }
  }


  getId() {
    return this.id;
  }

  setId(value) {
    this.id = value;
  }

  getStartDate() {
    return this.startDate;
  }

  setStartDate(value) {
    this.startDate = value;
  }

  getEndDate() {
    return this.endDate;
  }

  setEndDate(value) {
    this.endDate = value;
  }

  getLesson() {
    return this.lesson;
  }

  setLesson(value) {
    this.lesson = value;
  }

  populate(data) {
    this.setId(data.id || this.getId());
    this.setStartDate(new Date(data.startDate || this.getStartDate()));
    this.setEndDate(new Date(data.endDate || this.getEndDate()));
    this.setLesson(new Lesson(data.lesson) || this.getLesson());
  }
};