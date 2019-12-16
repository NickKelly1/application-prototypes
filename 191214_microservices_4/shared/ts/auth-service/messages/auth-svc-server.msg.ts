import { AuthSVCServerMsgPing } from './server/auth-svc-server.msg.ping';
import { AuthSVCServerMsgPong } from './server/auth-svc-server.msg.pong';

export const AUTH_SVC_SERVER_MSG = {
  PING: AuthSVCServerMsgPing,
  PONG: AuthSVCServerMsgPong,
} as const;
export type AUTH_SVC_SERVER_MSG = {[K in keyof typeof AUTH_SVC_SERVER_MSG]: typeof AUTH_SVC_SERVER_MSG[K]['prototype'] };
export type AN_AUTH_SVC_SERVER_MSG = AUTH_SVC_SERVER_MSG[keyof AUTH_SVC_SERVER_MSG];

export const AUTH_SVC_SERVER_MSGS = Object.values(AUTH_SVC_SERVER_MSG);
