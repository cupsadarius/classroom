/// <reference path="../../typings/tsd.d.ts"/>
import * as crypto from 'crypto';
import User from '../models/User';
import {userService} from './userService';
import * as Q from 'q';
import * as jwt from 'jsonwebtoken';
import {db} from '../db';
import {BlacklistRepository} from '../db/repositories/BlacklistRepository';

export type authData = {
    username: string,
    password: string,
};

const SECRET = process.env.SECRET;

export class AuthService {
    public createSalt() {
        return crypto.randomBytes(128).toString('base64');
    }

    public hashPassword(salt: string, password: string) {
        const hmac = crypto.createHmac('sha1', salt);
        return hmac.update(password).digest('hex');
    }

    public authenticate(data: authData) {
        const defer = Q.defer();

        userService.getByEmail(data.username, true).then(
            (user: User) => {
                if (this.passwordsMatch(user, data.password)) {
                    defer.resolve(this.generateJwtToken(user));
                } else {
                    defer.reject('Invalid credentials');
                }
            },
            (error: Object) => {
                defer.reject(error);
            }
        );

        return defer.promise;
    }

    public validate(token: string) {
        const defer = Q.defer();
        const repo = this.getBlackistRepository();
        repo.count({token}).then(
            (count: number) => {
                if (!count) {
                    try {
                        if (jwt.verify(token, SECRET)) {
                             defer.resolve(jwt.decode(token, SECRET));
                        }
                    } catch (e) {
                        defer.reject(null);
                    }
                } else {
                    defer.reject(null);
                }
            },
            (error: Object) => {
                defer.reject(error);
            }
        );

        return defer.promise;
    }

    public blacklistToken(token: string) {
        const defer = Q.defer();
        const repo = this.getBlackistRepository();
        repo.insert({token}).then(
            () => {
                defer.resolve(true);
            },
            (error: Object) => {
                defer.reject(error);
            }
        );
        return defer.promise;
    }

    private passwordsMatch(user: User, password: string): boolean {
        return user.getPassword() === this.hashPassword(user.getSalt(), password);
    }

    private generateJwtToken(user: User): string {
        user.setPassword('');
        user.setSalt('');
        return jwt.sign(user, SECRET, {expiresIn: 1440});
    }

    private getBlackistRepository(): BlacklistRepository {
        return db.getRepo('blacklistRepository') as BlacklistRepository;
    }
}

export const authService = new AuthService();
