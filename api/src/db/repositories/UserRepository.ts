import BaseRepository from './BaseRepository';
import * as Q from 'q';
import User, {UserData} from '../../models/User';
import hydratorFactory from '../hydrators';

export class UserRepository extends BaseRepository {
    constructor() {
        super('users');

    }

    public getAllUsers() {
        const defer = Q.defer();
        const hydrator = hydratorFactory.getHydrator(User);
        this.getAll().then(
            (users: UserData[]) => {
                const mapped = users.map((user: UserData) => {
                    return hydrator.hydrate(new User(), user);
                });
                defer.resolve(mapped);
            },
            (error: Object) => {
                defer.reject(error);
            }
        );

        return defer.promise;
    }

    public getByEmail(email: string, allInfo = false) {
        const defer = Q.defer();
        const hydrator = hydratorFactory.getHydrator(User);
        this.filter({email}).then(
            (users: UserData[]) => {
                const user = users.pop();
                if (!allInfo) {
                    user.password = '';
                    user.salt = '';
                }
                defer.resolve(hydrator.hydrate(new User(), user));
            },
            (error: Object) => {
                defer.reject(error);
            }
        );

        return defer.promise;
    }

    public getById(id: string) {
        const defer = Q.defer();
        const hydrator = hydratorFactory.getHydrator(User);
        this.get(id).then(
            (user: UserData) => {
                defer.resolve(hydrator.hydrate(new User(), user));
            },
            (error: Object) => {
                defer.reject(error);
            }
        );

        return defer.promise;
    }
}

export const userRepository = new UserRepository();
