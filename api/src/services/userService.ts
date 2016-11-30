/// <reference path="../../typings/tsd.d.ts"/>
import * as Q from 'q';
import User from '../models/User';
import {authService} from './authService';
import {db} from '../db/index';
import {UserRepository, DbUser} from '../db/repositories/UserRepository';

export class UserService {
    public saveUser(data: DbUser) {
        const defer = Q.defer();
        const user = this.populate(data);
        if (user.validate()) {
            defer.reject(user.getErrors());
        } else {
            user.setSalt(authService.createSalt());
            user.setPassword(authService.hashPassword(user.getSalt(), data.password));
            user.setRoles(['ROLE_USER']);
            const repo = this.getUserRepository();
            repo.count({email: user.getEmail()}).then((count: number) => {
                if (!count) {
                    repo.insert(user).then(
                        (userId: string) => {
                            defer.resolve(userId);
                        },
                        (error: Object) => {
                            defer.reject(error);
                        }
                    );
                } else {
                    defer.reject({message: `An user with the ${user.getEmail()} email address already exists in the datbase.`});
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
            (error: Object) => {
                defer.reject(error);
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
            (error: Object) => {
                defer.reject(error);
            }
        );

        return defer.promise;
    }

    public update(id: string, data: DbUser) {
        const defer = Q.defer();
        const repo = this.getUserRepository();

        repo.get(id).then(
            (userData: DbUser) => {
                let user = this.populate(userData);
                data.password = data.password ? authService.hashPassword(user.getSalt(), data.password) : user.getPassword();
                user = this.populate(data, user);
                if (user.validate()) {
                    defer.reject(user.getErrors());
                } else {
                    repo.update(id, user).then(
                        (updated: number) => {
                            if (updated) {
                                user.setPassword('');
                                user.setSalt('');
                                defer.resolve(user);
                            }
                        },
                        (error: Object) => {
                            defer.reject(error);
                        }
                    );
                }
            },
            (error: Object) => {
                defer.reject(error);
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
            (error: Object) => {
                defer.reject(error);
            }
        );

        return defer.promise;
    }

    private populate(data: DbUser, user?: User): User {
        const updatedUser = user ? user : new User();
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

    private getUserRepository(): UserRepository {
        return db.getRepo('userRepository') as UserRepository;
    }
}

export let userService = new UserService();
