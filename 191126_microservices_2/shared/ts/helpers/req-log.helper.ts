import { Request, Response, NextFunction } from 'express';

export function reqLog(
  logFn:
    (options: { req: Request, res: Response, duration: number }) => any
    = ({req, res, duration}) => console.log(`${res.statusCode} ${req.method} ${req.path} [${duration}ms]`),
) {
  const start = Date.now();
  return function doReqLog(req: Request, res: Response, next: NextFunction) {
    res.once('finish', () => {
      const duration = (Date.now() - start) / 1000;
      logFn({req, res, duration});
    });
    next();
  }
}
