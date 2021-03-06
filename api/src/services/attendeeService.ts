import {db} from '../db';
import {AttendeeRepository} from '../db/repositories/AttendeeRepository';
import AttendeeValidator from '../db/validators/AttendeeValidator';
import validatorFactory from '../db/validators/ValidatorFactory';
import Attendee from '../models/Attendee';
import UserMapping from '../db/mappers/mappings/UserMapping';
import {authService} from './authService';
import UserData from '../db/mappers/mappings/UserMapping';

export default class AttendeeService {
    private validator: AttendeeValidator;

    constructor() {
        this.validator = validatorFactory.getValidator('Attendee') as AttendeeValidator;
    }

    public async saveAttendee(data: UserMapping, isTeacher = false) {
        try {
            const repo = this.getAttendeesRepository();
            const attendee = repo.getMapper().hydrate(new Attendee(), data);
            if (!this.validator.isValid(attendee)) {
                throw this.validator.getErrors(attendee);
            }
            attendee.setSalt(authService.createSalt());
            attendee.setPassword(authService.hashPassword(attendee.getPassword(), data.password));
            if (!isTeacher) {
                attendee.setAsStudent();
            } else {
                attendee.setAsTeacher();
            }
            const count = await repo.count({email: attendee.getEmail()});
            if (count) {
                throw new Error(`An attendee with the ${attendee.getEmail()} already exists in the database.`);
            }
            return await repo.insert(repo.getMapper().dehydrate(attendee));
        } catch (e) {
            throw e;
        }
    }

    public async getAttendees(teachers = false) {
        try {
            const attendees = await this.getAttendeesRepository().getAttendeesByRole(teachers ? 'ROLE_TEACHER' : 'ROLE_STUDENT');
            return attendees.filter((attendee: Attendee) => {
                if (teachers) {
                    return !attendee.hasRole('ROLE_ADMIN');
                } else {
                    return !attendee.hasRole('ROLE_TEACHER');
                }
            });
        } catch (e) {
            throw e;
        }
    }

    public async getById(id: string) {
        try {
            return await this.getAttendeesRepository().getById(id);
        } catch (e) {
            throw e;
        }
    }

    public async getByEmail(email: string, stripSensitive = false) {
        try {
            return await this.getAttendeesRepository().getByEmail(email, stripSensitive);
        } catch (e) {
            throw e;
        }
    }

    public async getByIds(ids: string[]) {
        try {
            return await this.getAttendeesRepository().getAllByIds(ids);
        } catch (e) {
            throw e;
        }
    }

    public async update(id: string, data: UserData) {
        try {
            const repo = this.getAttendeesRepository();
            let attendee = await repo.getById(id);
            data.password = data.password ? authService.hashPassword(attendee.getSalt(), data.password) : data.password;
            attendee = repo.getMapper().hydrate(attendee, data);
            if (!this.validator.isValid(attendee)) {
                throw this.validator.getErrors(attendee);
            }
            const updated = await repo.update({id}, attendee);
            if (updated) {
                return repo.stripSensitiveInfo(repo.getMapper().dehydrate(attendee));
            }
        } catch (e) {
            throw e;
        }
    }

    public async delete(id: string) {
        try {
            return await this.getAttendeesRepository().delete([id]);
        } catch (e) {
            throw e;
        }
    }

    private getAttendeesRepository(): AttendeeRepository {
        return db.getRepo('attendeeRepository') as AttendeeRepository;
    }
}

export const attendeeService = new AttendeeService();