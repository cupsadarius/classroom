/// <reference path="../../../typings/tsd.d.ts"/>
import {Request, Response} from 'express';
import ErrorResponse from '../ErrorResponse';

export let authorizedWithRoleUser = (req: Request, res: Response, next: Function) => {
    if (req.user && req.user.roles.indexOf('ROLE_USER') > -1) {
        next();
    } else {
        res.status(403);
        res.json(new ErrorResponse('Unauthorized access.'));
    }
};

export let authorizedWithRoleAdmin = (req: Request, res: Response, next: Function) => {
    if (req.user && req.user.roles.indexOf('ROLE_ADMIN') > -1) {
        next();
    } else {
        res.status(403);
        res.json(new ErrorResponse('Unauthorized access.'));
    }
};
