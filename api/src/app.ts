/// <reference path="../typings/tsd.d.ts"/>
import {Request, Response} from 'express';
import * as express from 'express';
import loadExpressConfigs from './configs/express';
import initDb from './configs/rethink';
import router from './configs/router';
// import helpers
import ErrorWithStatus from './helpers/ErrorWithStatus';

initDb().then(
  () => {
    console.log('DB initialized successfully');
  },
  (err) => {
    console.log('DB failed to load', err);
  }
);
// init app
let app = express();

// load configs
app = loadExpressConfigs(app);

// load router
app.use('/v1', router);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: Function) => {
  const err = new ErrorWithStatus('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (process.env.APP_ENV === 'development') {
  app.use((err: ErrorWithStatus, req: Request, res: Response, next: Function) => {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err: ErrorWithStatus, req: Request, res: Response, next: Function) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {},
  });
});

module.exports = app;
