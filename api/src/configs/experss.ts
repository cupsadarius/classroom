import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import {cors} from '../middlewares/cors';
export default (app: express.Express) => {
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use('/public', express.static(path.join(__dirname, '../../public')));
    // load the api docs
    app.use('/assets', express.static(path.join(__dirname, '..', '..', 'docs/assets')));
    app.use('/modules', express.static(path.join(__dirname, '..', '..', 'docs/modules')));
    app.use('/classes', express.static(path.join(__dirname, '..', '..', 'docs/classes')));
    app.use('/interfaces', express.static(path.join(__dirname, '..', '..', 'docs/interfaces')));
    app.use('/docs', express.static(path.join(__dirname, '..', '..', 'docs/index.html')));
    app.use(cors);
    return app;
};
