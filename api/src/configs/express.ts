/// <reference path="../../typings/tsd.d.ts"/>
import * as express from 'express';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as path from 'path';

export default function loadExpressConfigs(app: express.Express) {
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser()); //tslint:disable-line
    app.use('/public', express.static(path.join(__dirname, '../../../public')));
    return app;
}
