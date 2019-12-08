import express, { ErrorRequestHandler } from 'express';
import { MasterStore } from '../store/store.state';

/**
 * @description
 * Register the Express middleware
 * 
 * @param expressApp 
 * @param store 
 */
export function expressMiddleware(
  expressApp: express.Express,
  socketServer: SocketIO.Server,
  store: MasterStore,
) {
  expressApp.use((req, res, next) => (async () => {
    const start = Date.now();
    res.on('finish', () => {
      const durMs = Date.now() - start;
      console.log(`${req.path} ${res.statusCode} ${durMs}ms`);
    });
    next();
  })().catch(next));

  expressApp.use('/', (req, res, next) => (async () => {
    console.log('/')
  })().catch(next));

  expressApp.use(function handleError(err, res, req, next)  {
    console.log('--- error ----');
  } as ErrorRequestHandler<any>);
}
