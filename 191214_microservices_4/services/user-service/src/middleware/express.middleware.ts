
import createHttpError from 'http-errors';
import express, { ErrorRequestHandler } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { env } from '../env';


export function expressMiddleware(expressApp: express.Express) {

  expressApp.use(express.json());
  expressApp.use(express.urlencoded({ extended: false }));
  expressApp.use(cookieParser());
  expressApp.use(compression());
  expressApp.use(express.static(path.join(__dirname, '../../public')));

  expressApp.use('/', (req, res, next) => {
    // send to the index if exactly matching home route
    if (req.originalUrl.length <= 1) res.render('index-view', { title: 'Micro Services 3 - User Service' });

    // otherwise pass to 404
    else next();
  });



  // catch 404 and forward to error handler
  expressApp.use(function(req, res, next) {
    next(createHttpError(404));
  });



  // error handler
  expressApp.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = env.NODE_ENV === 'development' ? err : {};

    if (!res.finished) {
      res.status(err.status || 500);
      res.send({ error: err });
    }

    if (!(err instanceof createHttpError.HttpError)) {
      console.error('[expressApp] error:', err);
    }
  } as ErrorRequestHandler<any>);
}