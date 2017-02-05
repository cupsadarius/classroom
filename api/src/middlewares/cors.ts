/// <reference path="../../typings/tsd.d.ts"/>
import {Request, Response} from 'express';

export const cors = (req: Request, res: Response, next: Function) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, x-access-token, Content-Type, Accept');
    next();
};
