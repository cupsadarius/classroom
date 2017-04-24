/* @flow */
import Student from './Student.js';
import Teacher from './Teacher.js';
import Session from './Session.js';

export default class Classroom {
  id: string;
  students: Student[];
  teachers: Teacher[];
  sessions: Session[];
  name: string;
  lastSessionId: string;

  constructor(data?: Object) {
    this.students = [];
    this.teachers = [];
    this.sessions = [];
    this.name = '';
    this.lastSessionId = '';
    this.id = '';
    if (data) {
      this.populate(data);
    }
  }

  getStudents() {
    return this.students;
  }

  setStudents(value: Student[]) {
    this.students = value;
  }

  getTeachers() {
    return this.teachers;
  }

  setTeachers(value: Teacher[]) {
    this.teachers = value;
  }

  getSessions() {
    return this.sessions;
  }

  setSessions(value: Session[]) {
    this.sessions = value;
  }

  getName() {
    return this.name;
  }

  setName(value: string) {
    this.name = value;
  }

  getLastSessionId() {
    return this.lastSessionId;
  }

  setLastSessionId(value: string) {
    this.lastSessionId = value;
  }

  getId() {
    return this.id;
  }

  setId(value: string) {
    this.id = value;
  }

  getLastSession() {
    return this.sessions.filter(session => session.getId() === this.lastSessionId).pop();
  }

  getPreviousSessions() {
    return this.sessions.filter((session) => {
      return session.getEndDate() < new Date();
    });
  }

  getFutureSessions() {
    return this.sessions.filter((session) => {
      return session.getStartDate() > new Date() || (session.getStartDate() < new Date() && session.getEndDate() > new Date());
    })
  }

  populate(data: Object) {
    this.setId(data.id || this.getId());
    this.setName(data.name || this.getName());
    this.setLastSessionId(data.lastSessionId || this.getLastSessionId());
    this.setStudents(data.students.map(student => new Student(student)) || this.getStudents());
    this.setTeachers(data.teachers.map(teacher => new Teacher(teacher)) || this.getTeachers());
    this.setSessions(data.sessions.map(session => new Session(session)) || this.getSessions());
  }
}
