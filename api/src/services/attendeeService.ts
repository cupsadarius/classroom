/// <reference path="../../typings/tsd.d.ts"/>
import * as Q from 'q';
import Attendee from '../models/Attendee';
import {authService} from './authService';
import {db} from '../db/index';
import {DbUser} from '../db/repositories/UserRepository';
import {AttendeeRepository} from '../db/repositories/AttendeeRepository';

export class AttendeeService {
    public saveAttendee(data: DbUser, isTeacher = false) {
        const defer = Q.defer();
        const attendee = this.populate(data);
        if (!attendee.isValid()) {
            defer.reject(attendee.getErrors());
        } else {
            attendee.setSalt(authService.createSalt());
            attendee.setPassword(authService.hashPassword(attendee.getSalt(), data.password));
            if (isTeacher) {
                attendee.setAsTeacher();
            } else {
                attendee.setAsTeacher();
            }
            const repo = this.getAttendeesRepository();
            repo.count({email: attendee.getEmail()}).then((count: number) => {
                if (!count) {
                    repo.insert(attendee).then(
                        (userId: string) => {
                            defer.resolve(userId);
                        },
                        () => {
                            defer.reject('Error while inserting attendee.');
                        }
                    );
                } else {
                    defer.reject(`An attendee with the ${attendee.getEmail()} email address already exists in the datbase.`);
                }
            });
        }
        return defer.promise;
    }

    public getAttendees(teachers = false) {
        const defer = Q.defer();
        const repo = this.getAttendeesRepository();

        repo.getAttendeesByRole(teachers ? 'ROLE_TEACHER' : 'ROLE_STUDENT').then(
            (attendees: Attendee[]) => {
                defer.resolve(attendees);
            },
            () => {
                defer.reject('Error while retrieving attendees.');
            }
        );

        return defer.promise;
    }

    public getById(id: string) {
        const defer = Q.defer();
        const repo = this.getAttendeesRepository();

        repo.getById(id).then(
            (attendee: Attendee) => {
                defer.resolve(attendee);
            },
            () => {
                defer.reject('Error while retrieving attendee.');
            }
        );

        return defer.promise;
    }

    public getByEmail(email: string, allInfo = false) {
        const defer = Q.defer();
        const repo = this.getAttendeesRepository();

        repo.getByEmail(email, allInfo).then(
            (attendee: Attendee) => {
                defer.resolve(attendee);
            },
            () => {
                defer.reject('Error while retrieving attendee.');
            }
        );

        return defer.promise;
    }

    public update(id: string, data: DbUser) {
        const defer = Q.defer();
        const repo = this.getAttendeesRepository();

        repo.get(id).then(
            (userData: DbUser) => {
                let attendee = this.populate(userData);
                data.password = data.password ? authService.hashPassword(attendee.getSalt(), data.password) : attendee.getPassword();
                attendee = this.populate(data, attendee);
                if (!attendee.isValid()) {
                    defer.reject(attendee.getErrors());
                } else {
                    repo.update(id, attendee).then(
                        (updated: number) => {
                            if (updated) {
                                attendee.setPassword('');
                                attendee.setSalt('');
                                defer.resolve(attendee);
                            }
                        },
                        () => {
                            defer.reject('Error while updating attendee.');
                        }
                    );
                }
            },
            () => {
                defer.reject('Error while retrieving attendee.');
            }
        );

        return defer.promise;
    }

    public delete(id: string) {
        const defer = Q.defer();
        const repo = this.getAttendeesRepository();

        repo.delete([id]).then(
            () => {
                defer.resolve();
            },
            () => {
                defer.reject('Error while deleting user.');
            }
        );

        return defer.promise;
    }

    private populate(data: DbUser, user?: Attendee): Attendee {
        const updatedUser = user ? user : new Attendee();
        if (data.id || updatedUser.getId()) {
            updatedUser.setId(data.id || updatedUser.getId());
        }
        updatedUser.setFirstName(data.firstName || updatedUser.getFirstName());
        updatedUser.setLastName(data.lastName || updatedUser.getLastName());
        updatedUser.setEmail(data.email || updatedUser.getEmail());
        updatedUser.setPhoneNumber(data.phoneNumber || updatedUser.getPhoneNumber());
        updatedUser.setPassword(data.password || updatedUser.getPassword());
        updatedUser.setSalt(data.salt || updatedUser.getSalt());
        updatedUser.setRoles(data.roles || updatedUser.getRoles());
        return updatedUser;
    }

    private getAttendeesRepository(): AttendeeRepository {
        return db.getRepo('attendeeRepository') as AttendeeRepository;
    }
}

export let attendeeService = new AttendeeService();
