import {UserRepository, DbUser} from './UserRepository';
import * as r from 'rethinkdb';
import * as Q from 'q';
import Attendee from '../../models/Attendee';

export class AttendeeRepository extends UserRepository {
    public getAttendeesByRole(role: string) {
        const defer = Q.defer() ;
        this.filter(r.row('roles').contains(role)).then(
            (attendees: DbUser[]) => {
                const mapped = attendees.map((user: DbUser) => {
                    const attendee = new Attendee();
                    attendee.setId(user.id);
                    attendee.setFirstName(user.firstName);
                    attendee.setLastName(user.lastName);
                    attendee.setEmail(user.email);
                    attendee.setPhoneNumber(user.phoneNumber);
                    attendee.setRoles(user.roles);
                    return attendee;
                });
                defer.resolve(mapped);
            },
            () => {
                defer.reject(null);
            }
        );

        return defer.promise;
    }
}

export let attendeeRepository = new AttendeeRepository();
