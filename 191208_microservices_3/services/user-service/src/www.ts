import express from 'express';
import { retryEvery } from '@syntaxfanatics/peon';
import http, { createServer } from 'http';
import { env } from './env';
import { expressMiddleware } from './middleware/express.middleware';
import { AppExpressRequest } from './types/AppExpressRequest';
import redis, { RedisClient } from 'redis';
import { promisify } from 'util';
import { AsyncRedisClient } from './helpers/async-redis-client.helper';



/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: any): number {
  const port = parseInt(val, 10);

  // named pipe
  if (isNaN(port)) return val;

  // port number
  if (port >= 0) return port;

  throw new TypeError(`Unable to normalise port "${val}"`);
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





// start the application
async function start() {
  /**
   * Get port from environment and store in Express.
   */
  const PORT = normalizePort(env.USER_SERVICE_INTERNAL_PORT);

  const expressApp = express();
  const redisClient = new AsyncRedisClient({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
  });

  redisClient.on('message', (channel, message) => console.log('[REDIS] message', channel, message));
  redisClient.on('message_buffer', (channel, message) => console.log('[REDIS] message_buffer', channel, message));
  redisClient.on('pmessage', (channel, message) => console.log('[REDIS] pmessage', channel, message));
  redisClient.on('pmessage_buffer', (channel, message) => console.log('[REDIS] pmessage_buffer', channel, message));
  redisClient.on('psubscribe', (channel, message) => console.log('[REDIS] psubscribe', channel, message));
  redisClient.on('punsubscribe', (channel, message) => console.log('[REDIS] punsubscribe', channel, message));
  redisClient.on('subscribe', (channel, message) => console.log('[REDIS] subscribe', channel, message));
  redisClient.on('unsubscribe', (channel, message) => console.log('[REDIS] unsubscribe', channel, message));
  redisClient.asyncPING().then(result => console.log('[REDIS] PING ->', result));

  redisClient.subscribe('SUB_CHANNEL', (arg1, arg2) => {
    console.log('subscribed....?', arg1, arg2);
  });

  redisClient.xadd(
    "STREAM_NAME",
    "STREAM_KEY",
    "*",
    "STREAM_FIELD",
    "--- ^^ && stream value && ^^ ---",
    (err, value) => {
      console.log("--MY STREAM--", { err, value });
    },
  );

  // redisClient.xread("MY")


  const httpServer = createServer((req, res) => {
    expressApp(req, res);
  });


  expressMiddleware(expressApp);

  httpServer.on('error', handleError({ port: PORT }));
  httpServer.on('listening', handleListening(httpServer));

  httpServer.listen(PORT);
}


start();
