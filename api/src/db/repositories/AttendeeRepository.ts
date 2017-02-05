import {UserRepository} from './UserRepository';
import * as r from 'rethinkdb';
import * as Q from 'q';
import Attendee from '../../models/Attendee';
import {UserData} from '../../models/User';
import hydratorFactory from '../hydrators';

export class AttendeeRepository extends UserRepository {
    public getAttendeesByRole(role: string) {
        const defer = Q.defer() ;
        const hydrator = hydratorFactory.getHydrator(Attendee);
        this.filter(r.row('roles').contains(role)).then(
            (attendees: UserData[]) => {
                const mapped = attendees.map((user: UserData) => {
                    return hydrator.hydrate(new Attendee(), user);
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

export const attendeeRepository = new AttendeeRepository();
