import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { tty } from '../helpers/tty.helper';
import { hDate } from '../helpers/h-date.helper';
import { classLogger } from '../helpers/logger';

interface Info {
  req: Request,
  res: Response;
  start: Date;
  end: Date;
  dur: number;
}

function paintStatus(status: number): string {
  if (status < 200) return tty.FgGreen(status);
  if (status >= 200 && status < 300) return tty.FgGreen(status);
  if (status >= 300 && status < 400) return tty.FgYellow(status);
  if (status >= 400 && status < 500) return tty.FgRed(status);
  return tty.FgMagenta(status);
}

function paintDur(dur: number): string {
  if (dur < 0) return tty.BgRed(`-${dur}ms`);
  if (dur === 0) return tty.FgWhite(dur);
  if (dur < 5) return tty.FgGreen(`+${dur}ms`);
  if (dur < 10) return tty.FgCyan(`+${dur}ms`);
  if (dur < 20) return tty.FgYellow(`+${dur}ms`);
  if (dur < 50) return tty.FgRed(`+${dur}ms`);
  return tty.BgRed(dur);
}


function useHandler(req: Request, res: Response, fn: (final: Info) => any) {
  const start = new Date();
  return function onEnd() {
    const end = new Date();
    fn({
      req,
      res,
      start,
      end,
      dur: end.valueOf() - start.valueOf(),
    });
  };
}

function paintInf(inf: Info, name?: string) {
  const query = String(new URLSearchParams(inf.req.query));
  const painted = [
    `[${hDate(inf.start)}]:`,
    `${tty.FgYellow(inf.req.path)}`,
    ...(query ? [tty.FgMagenta(query)] : []),
    paintStatus(inf.res.statusCode),
    paintDur(inf.dur),
  ].join(' ');
  return painted;
}

function onFinish(inf: Info) {
  console.log(paintInf(inf));
}


@Injectable()
export class LoggerMiddleware implements NestMiddleware<Request, Response> {
  private readonly logger = classLogger(this)

  constructor() {
    this.logger.dInfo('constructor');
  }

  use(req: Request, res: Response, next: () => void) {
    this.logger.dInfo('use');
    const finishFn = useHandler(req, res, onFinish);
    res.once('finish', () => { finishFn(); });
    next();
  }
}
