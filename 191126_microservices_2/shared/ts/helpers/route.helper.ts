import { AValueOf } from '@syntaxfanatics/peon';
import express, { Response, Request } from 'express';
import { HTTP_STATUS } from '../constants/HTTP_STATUS.constant';



export function sendSuccess(req: Request, res: Response, status: number) {
  return function doSendSuccessResponse(resBody: Record<PropertyKey, any>) {
    res.status(status).send(resBody);
  }
}


export type RequestFail = { code: AValueOf<HTTP_STATUS>; message: string; data: {} }


export function mapFail(code: AValueOf<HTTP_STATUS>, message: string, data = {}) {
  return function doMapFail() {
    return { code, message, data } as RequestFail;
  }
}


export function sendFail(req: Request, res: Response) {
  return function doSendFailResponse(fail: RequestFail) {
    res.status(fail.code).json({ data: fail.data, message: fail.message });
  }
}


export function map500(message = 'Internal Server Error') {
  return function doMap500(reason: unknown) {
    return mapFail(HTTP_STATUS.SERVER_ERROR, message, reason instanceof Object ? reason : {})();
  }
}


export function map422(message = 'Invalid Request') {
  return function doMap422(errors: Record<string, string>): RequestFail {
    return ({ code: HTTP_STATUS.INVALID, message, data: errors });
  }
}
