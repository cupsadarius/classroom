import BaseModel from './BaseModel';
import Session from './Session';
import Attendee from './Attendee';

export default class Classroom extends BaseModel {
    protected name: string;
    protected teachers: Attendee[] = [];
    protected students: Attendee[] = [];
    protected sessions: Session[] = [];
    protected lastSessionId: string;

    public getName() {
        return this.name;
    }

    public setName(name: string) {
        this.name = name;
    }

    public getLastSessionId() {
        return this.lastSessionId;
    }

    public setLastSessionId(id: string) {
        this.lastSessionId = id;
    }

    public getTeachers() {
        return this.teachers;
    }

    public setTeachers(teachers: Attendee[]) {
        this.teachers = teachers;
    }

    public addTeacher(teacher: Attendee) {
        this.teachers.push(teacher);
    }

    public removeTeacher(teacher: Attendee) {
        this.teachers = this.teachers.filter(existingTeacher => existingTeacher.getId() !== teacher.getId());
    }

    public getStudents() {
        return this.students;
    }

    public setStudents(students: Attendee[]) {
        this.students = students;
    }

    public addStudent(student: Attendee) {
        this.students.push(student);
    }

    public removeStudent(student: Attendee) {
        this.students = this.students.filter(existingStudent => existingStudent.getId() !== student.getId());
    }

    public getSessions() {
        return this.sessions;
    }

    public setSessions(sessions: Session[]) {
        this.sessions = sessions;
    }

    public addSession(session: Session) {
        this.sessions.push(session);
    }

    public removeSession(session: Session) {
        this.sessions = this.sessions.filter(existingSession => existingSession.getId() !== session.getId());
    }
}
