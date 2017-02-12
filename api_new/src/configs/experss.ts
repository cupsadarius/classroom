import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import cors from '../middlewares/cors';
export default (app: express.Express) => {
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use('/public', express.static(path.join(__dirname, '../../public')));
    app.use(cors);
    return app;
};
