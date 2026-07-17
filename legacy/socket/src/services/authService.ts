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

    private getBlackistRepository(): BlacklistRepository {
        return db.getRepo('blacklistRepository') as BlacklistRepository;
    }

}

export const authService = new AuthService();