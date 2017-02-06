import User from './User';

export default class Attendee extends User {

    public setAsTeacher() {
        this.addRole('ROLE_STUDENT');
        this.addRole('ROLE_TEACHER');
    }

    public setAsStudent() {
        this.addRole('ROLE_STUDENT');
    }

    public isTeacher() {
        return this.getRoles().indexOf('ROLE_TEACHER');
    }

    public isStudent() {
        return this.getRoles().indexOf('ROLE_STUDENT');
    }
}
