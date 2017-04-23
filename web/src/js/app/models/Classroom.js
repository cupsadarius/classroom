/* @flow */
import Student from './Student.js';
import Teacher from './Teacher.js';
import Session from './Session.js';

export default class Classroom {
  id: String;
  students: Student[];
  teachers: Teacher[];
  sessions: Session[];
  name: String;
  lastSessionId: String;

  constructor(data) {
    this.students = [];
    this.teachers = [];
    this.sessions = [];
    this.name = '';
    this.lastSessionId = '';
    this.id = null;
    if (data) {
      this.populate(data);
    }
  }

  getStudents() {
    return this.students;
  }

  setStudents(value) {
    this.students = value;
  }

  getTeachers() {
    return this.teachers;
  }

  setTeachers(value) {
    this.teachers = value;
  }

  getSessions() {
    return this.sessions;
  }

  setSessions(value) {
    this.sessions = value;
  }

  getName() {
    return this.name;
  }

  setName(value) {
    this.name = value;
  }

  getLastSessionId() {
    return this.lastSessionId;
  }

  setLastSessionId(value) {
    this.lastSessionId = value;
  }

  getId() {
    return this.id;
  }

  setId(value) {
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

  populate(data) {
    this.setId(data.id || this.getId());
    this.setName(data.name || this.getName());
    this.setLastSessionId(data.lastSessionId || this.getLastSessionId());
    this.setStudents(data.students.map(student => new Student(student)) || this.getStudents());
    this.setTeachers(data.teachers.map(teacher => new Teacher(teacher)) || this.getTeachers());
    this.setSessions(data.sessions.map(session => new Session(session)) || this.getSessions());
  }
}