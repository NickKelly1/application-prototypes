import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { tty } from '../helpers/tty.helper';

interface Info {
  req: Request,
  res: Response;
  start: Date;
}

function onError(inf: Info) { return function log() { console.log(tty.BgRed('req error')); }; }
function onClose(inf: Info) { return function log() { console.log(tty.BgYellow('req close')); }; }
function onDrain(inf: Info) { return function log() { console.log(tty.BgCyan('req close')); }; }
function onFinish(inf: Info) { return function log() { console.log(tty.BgGreen('req finish')); }; }


@Injectable()
export class LoggerMiddleware implements NestMiddleware<Request, Response> {
  use(req: Request, res: Response, next: () => void) {
    const info: Info = { req, res, start: new Date() };
    const errorFn = onError(info);
    const closeFn = onClose(info);
    const drainFn = onDrain(info);
    const finishFn = onFinish(info);

    res.on('error', () => errorFn);
    res.on('close', () => closeFn);
    res.on('drain', () => drainFn);
    res.once('finish', () => {
      finishFn();
      res.off('error', errorFn);
      res.off('close', closeFn);
      res.off('drain', drainFn);
    });

    next();
  }
}
