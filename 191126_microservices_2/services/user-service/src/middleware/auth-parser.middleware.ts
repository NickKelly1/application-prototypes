import { pipe } from 'fp-ts/lib/pipeable';
import { Request, Response, NextFunction } from 'express';
import { right, left, map, flatten, isRight } from 'fp-ts/lib/Either';
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
    const { headers: { authorization } } = req;

    const eitherAuth = pipe(
      authorization
        ? right(authorization)
        : left('No authorization detected'),

      // break the header into its authorization type (desired strategy) and payload
      map(auth => auth.split(' ')),

      // we will only support basic auth
      map(([type, payload]) => type.toLowerCase() === 'basic'
        ? right(payload)
        : left(`Auth type "${type}" not supported`)),
      flatten,

      // expect the payload to be base 64 encoded and in format username:password
      map((payload) => Buffer.from(payload, 'base64').toString().split(':')),

      // verify username and password
      map(([username, password]) =>
        username !== env.USER_SERVICE_ADMIN_USERNAME
          ? left('Invalid username')
          : password !== env.USER_SERVICE_ADMIN_PASSWORD
            ? left('Invalid password')
            : right(username)),
      flatten,
    )

    // mutate isAuthenticated onto the request
    req.auth = isRight(eitherAuth)
      ? { isAuthenticated: true, type: "basic", admin: true, username: eitherAuth.right }
      : { isAuthenticated: false, reason: eitherAuth.left };

    if (!req.auth.isAuthenticated) console.log(`[app::auth] ${req.ip}: ${req.auth.reason}`);
    else console.log(`[app::auth] ${req.ip}: ${req.auth.username}`);

    next();
  }
}
