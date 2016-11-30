/// <reference path="../../typings/tsd.d.ts"/>
import * as crypto from 'crypto';
import {Request, Response} from 'express';

export class AuthService {
    public createSalt() {
        return crypto.randomBytes(128).toString('base64');
    }

    public hashPassword(salt: string, password: string) {
        const hmac = crypto.createHmac('sha1', salt);
        return hmac.update(password).digest('hex');
    }

    public isAuthenticatedWithRole(req: Request, resp: Response, role: string, next: Function) {
        if (req.isAuthenticated() && req.user.roles.indexOf(role) > -1) {
            next();
        } else {
            resp.status(403);
            resp.end();
        }
    }
}

export let authService = new AuthService();
