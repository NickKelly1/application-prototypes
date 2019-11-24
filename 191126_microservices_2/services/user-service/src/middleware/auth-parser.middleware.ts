import { pipe } from 'fp-ts/lib/pipeable';
import { Request, Response, NextFunction } from 'express';
import { env } from '../env';

/**
 * @description
 *
 */
export function authParserMiddleware() {
  return function authParserMiddlewareHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    // mutate isAuthenticated onto the request
    req.auth = { isAuthenticated: false, reason: 'This server does not support authentication (yet)' };

    if (!req.auth.isAuthenticated) console.log(`[app::auth] ${req.ip}: ${req.auth.reason}`);
    // else console.log(`[app::auth] ${req.ip}: ${req.auth.username}`);

    next();
  }
}
