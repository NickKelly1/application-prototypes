import { retryEvery } from '@syntaxfanatics/peon';
import mongoose from 'mongoose'
import { app } from './app';
import http from 'http';
import { env } from './env';
import { AppExpressRequest } from '../types/AppExpressRequest';



/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: any) {
  const port = parseInt(val, 10);

  // named pipe
  if (isNaN(port)) return val;

  // port number
  if (port >= 0) return port;

  return false;
}



/*
 * Event listener for HTTP server "error" event.
 */
function handleError(options: { port: number | string }) {
  return function doHandleError(error: any) {
    if (error.syscall !== 'listen') throw error;

    const bind = typeof options.port === 'string'
      ? 'Pipe ' + options.port
      : 'Port ' + options.port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
}



/**
 * Event listener for HTTP server "listening" event.
 */
function handleListening(server: http.Server) {
  return function doHandleListening() {
    const addr = server.address();

    if (addr === null) throw new TypeError('Server Address is null');

    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;

    console.log('[www] Listening on ' + bind);
  }
}



/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(env.USER_SERVICE_INTERNAL_PORT);
app.set('port', port);



/**
 * @description
 * Create APIs for the application
 */
function createApis(): AppExpressRequest['apis'] {
  const apis = {};
  return apis;
}




async function start() {
  /** Listen on provided port, on all network interfaces. */
  try {

    let apis: AppExpressRequest['apis'];

    if (!env.SLEEP) {
      await retryEvery({ millisBetween: 5000, maxAttempts: Number.POSITIVE_INFINITY })(
        function connectToMongo() {
          return mongoose.connect(env.USER_SERVICE_MONGODB_URI, {
            useNewUrlParser: true,
            user: env.USER_SERVICE_MONGODB_USER,
            pass: env.USER_SERVICE_MONGODB_PASSWORD
          })}
      )();

      console.log(`[www] Connected to mongoDB on ${env.USER_SERVICE_MONGODB_URI}`);
      apis = createApis();
    }

    /** Create HTTP server */
    const server = http.createServer((incomingMessage, serverResponse) => {
      // add our apis onto the incoming request
      (incomingMessage as typeof incomingMessage & Pick<AppExpressRequest, 'apis'>).apis = apis;
      app(incomingMessage, serverResponse);
    });

    server.on('error', handleError({ port }));
    server.on('listening', handleListening(server));

    await new Promise(res => server.listen(port, res));
    console.log(`[www] Server listening on port ${port}`);
  } catch (error) {
    console.log('[www] Failed to start server...', error);
  }
}


start();
