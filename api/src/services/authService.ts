import * as crypto from 'crypto';
import {db} from '../db';
import {BlacklistRepository} from '../db/repositories/BlacklistRepository';
import User from '../models/User';
import params from '../configs/params';
import * as jwt from 'jsonwebtoken';
import {userService} from './userService';

export type authData = {
    username: string,
    password: string,
};

export class AuthService {
    public createSalt() {
        return crypto.randomBytes(128).toString('base64');
    }

    public hashPassword(salt: string, password: string) {
        const hmac = crypto.createHmac('sha1', salt);
        return hmac.update(password).digest('hex');
    }

    public async authenticate(data: authData) {
        try {
            const user = await userService.getByEmail(data.username);
            if (this.passwordsMatch(user, data.password)) {
                return this.generateJwtToken(user);
            } else {
                throw new  Error('Invalid credentials.');
            }
        } catch (e) {
            throw e;
        }
    }

    public async validate(token: string) {
        try {
            const exists = await this.getBlackistRepository().count({token});

            if (!exists && jwt.verify(token, params.SECRET)) {
                return jwt.decode(token, params.SECRET);
            }
        } catch (e) {
            throw e;
        }

        return false;
    }

    public async blacklistToken(token: string) {
        try {
            return await this.getBlackistRepository().insert({token});
        } catch (e) {
            throw e;
        }
    }

    private passwordsMatch(user: User, password: string): boolean {
        return user.getPassword() === this.hashPassword(user.getSalt(), password);
    }

    private generateJwtToken(user: User): string {
        user.setPassword('');
        user.setSalt('');
        return jwt.sign(user, params.SECRET, {expiresIn: 60 * 60 * 24 * 7});
    }

    private getBlackistRepository(): BlacklistRepository {
        return db.getRepo('blacklistRepository') as BlacklistRepository;
    }

}

export const authService = new AuthService();