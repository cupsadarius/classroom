/// <reference path="../../typings/tsd.d.ts"/>
import {Request, Response} from 'express';
import {authService} from '../services/authService';
import ErrorResponse from '../helpers/ErrorResponse';

export let authenticated = (req: Request, res: Response, next: Function) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
        res.status(401);
        res.json(new ErrorResponse('Invalid token.'));
    }
    authService.validate(token).then(
        (user: Object) => {
            req.user = user;
            next();
        },
        () => {
            res.status(401);
            res.json(new ErrorResponse('Invalid token.'));
        }
    );
};
