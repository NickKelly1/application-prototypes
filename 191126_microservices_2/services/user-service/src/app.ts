import createHttpError from 'http-errors';
import express, { ErrorRequestHandler } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import compression from 'compression';

import { htmlStats } from './monitoring/monitoring';
import { env } from './env';
import { authParserMiddleware } from './middleware/auth-parser.middleware';
import { isLeft, either, left, isRight } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { AsyncParser } from 'json2csv';
import { HTTP_METHOD } from './shared/ts/constants/HTTP_METHOD.constant';
import { HTTP_STATUS } from './shared/ts/constants/HTTP_STATUS.constant';

export const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// log start & end
app.use((req, res, next) => {
  const start = Date.now();
  res.on('close', () => {
    const end = Date.now();
    const duration = ( end - start );
    console.log(`[app] ${req.method} ${req.path} \t->\t ${res.statusCode} ${res.statusMessage} \t-\t ${duration}ms`)
  });
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, '../public')));

app.use(authParserMiddleware());


app.use('/stats', (req, res) => {
  console.log(`[app] Serving stats to ${req.ip} at ${new Date().toLocaleDateString()} UTC (${Date.now()})`);
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`<html><body>${htmlStats()}</body></html>`);
})


/**
 * Serve nothing if the environment is set to asleep
 */
if (env.SLEEP) {
  console.log('[app] Loading sleep mode');
  app.get('/', (req, res, next) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
    <html>
    <body>
    <div>
    <div>[SLEEP_MODE]</div>
    <div>Zzzzzzzzzzzzzz........</div>
    </div>
    <div>
    <div>[STATS]<div>
    <div>
    ${htmlStats()}
    </div>
    </div>
    </body>
    </html>
    `);
  });
}



app.use('/', (req, res, next) => {
  // send to the index if exactly matching home route
  if (req.originalUrl.length <= 1) res.render('index', { title: 'Micro Services 2 - User Service' });

  // otherwise pass to 404
  else next();
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createHttpError(404));
});



// error handler
app.use(function(err, req, res, next) {
  console.log('[app] --- EXPRESS HANDLING ERROR ---');
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  console.error(err);
} as ErrorRequestHandler<any>);
