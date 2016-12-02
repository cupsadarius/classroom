import BaseRepository from './BaseRepository';
import * as Q from 'q';
import User from '../../models/User';

export type DbUser = {
    id: string;
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    roles: string[],
    salt: string,
    password: string;
};

export class UserRepository extends BaseRepository {
    constructor() {
        super('users');
    }

    public getAllUsers() {
        const defer = Q.defer();
        this.getAll().then(
            (users: DbUser[]) => {
                const mapped = users.map((user: DbUser) => {
                    const userObj = new User();
                    userObj.setId(user.id);
                    userObj.setFirstName(user.firstName);
                    userObj.setLastName(user.lastName);
                    userObj.setEmail(user.email);
                    userObj.setPhoneNumber(user.phoneNumber);
                    userObj.setRoles(user.roles);
                    return userObj;
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
        this.filter({email}).then(
            (users: DbUser[]) => {
                const user = users.pop();
                const userObj = new User();
                userObj.setId(user.id);
                userObj.setFirstName(user.firstName);
                userObj.setLastName(user.lastName);
                userObj.setEmail(user.email);
                userObj.setPhoneNumber(user.phoneNumber);
                userObj.setRoles(user.roles);
                if (allInfo) {
                    userObj.setPassword(user.password);
                    userObj.setSalt(user.salt);
                }
                defer.resolve(userObj);
            },
            (error: Object) => {
                defer.reject(error);
            }
        );

        return defer.promise;
    }

    public getById(id: string) {
        const defer = Q.defer();
        this.get(id).then(
            (user: DbUser) => {
                const userObj = new User();
                userObj.setId(user.id);
                userObj.setFirstName(user.firstName);
                userObj.setLastName(user.lastName);
                userObj.setEmail(user.email);
                userObj.setPhoneNumber(user.phoneNumber);
                userObj.setRoles(user.roles);
                defer.resolve(userObj);
            },
            (error: Object) => {
                defer.reject(error);
            }
        );

        return defer.promise;
    }
}

export let userRepository = new UserRepository();
