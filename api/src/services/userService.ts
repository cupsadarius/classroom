/// <reference path="../../typings/tsd.d.ts"/>
import * as Q from 'q';
import User, {UserData} from '../models/User';
import {authService} from './authService';
import {db} from '../db/index';
import {UserRepository} from '../db/repositories/UserRepository';
import hydratorFactory from '../db/hydrators';

export class UserService {
    public saveUser(data: UserData) {
        const defer = Q.defer();
        let user = new User();
        const hydrator = hydratorFactory.getHydrator(User);
        user = hydrator.hydrate(user, data);
        if (!user.isValid()) {
            defer.reject(user.getErrors());
        } else {
            user.setSalt(authService.createSalt());
            user.setPassword(authService.hashPassword(user.getSalt(), data.password));
            const repo = this.getUserRepository();
            repo.count({email: user.getEmail()}).then((count: number) => {
                if (!count) {
                    repo.insert(hydrator.dehydrate(user)).then(
                        (userId: string) => {
                            defer.resolve(userId);
                        },
                        () => {
                            defer.reject('Error while inserting user.');
                        }
                    );
                } else {
                    defer.reject(`An user with the ${user.getEmail()} email address already exists in the database.`);
                }
            });
        }
        return defer.promise;
    }

    public getUsers() {
        const defer = Q.defer();
        const repo = this.getUserRepository();
        repo.getAllUsers().then(
            (users: User[]) => {
                defer.resolve(users);
            },
            () => {
                defer.reject('Error while retrieving users.');
            }
        );

        return defer.promise;
    }

    public getById(id: string) {
        const defer = Q.defer();
        const repo = this.getUserRepository();

        repo.getById(id).then(
            (user: User) => {
                defer.resolve(user);
            },
            () => {
                defer.reject('Error while retrieving user.');
            }
        );

        return defer.promise;
    }

    public getByEmail(email: string, allInfo = false) {
        const defer = Q.defer();
        const repo = this.getUserRepository();

        repo.getByEmail(email, allInfo).then(
            (user: User) => {
                defer.resolve(user);
            },
            () => {
                defer.reject('Error while retrieving user.');
            }
        );

        return defer.promise;
    }

    public update(id: string, data: UserData) {
        const defer = Q.defer();
        const repo = this.getUserRepository();
        const hydrator = hydratorFactory.getHydrator(User);
        repo.get(id).then(
            (userData: UserData) => {
                let user = new User();
                hydrator.hydrate(user, userData);
                data.password = data.password ? authService.hashPassword(user.getSalt(), data.password) : user.getPassword();
                user = hydrator.hydrate(user, data);
                if (!user.isValid()) {
                    defer.reject(user.getErrors());
                } else {
                    repo.update(id, hydrator.dehydrate(user)).then(
                        (updated: number) => {
                            if (updated) {
                                user.setPassword('');
                                user.setSalt('');
                                defer.resolve(user);
                            }
                        },
                        () => {
                            defer.reject('Error while updating users');
                        }
                    );
                }
            },
            () => {
                defer.reject('Error while retrieving user.');
            }
        );

        return defer.promise;
    }

    public delete(id: string) {
        const defer = Q.defer();
        const repo = this.getUserRepository();

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

    private getUserRepository(): UserRepository {
        return db.getRepo('userRepository') as UserRepository;
    }
}

export const userService = new UserService();
