import { AuthSrvServerMsgPing } from './server/auth-srv-server.msg.ping';
import { AuthSrvServerMsgPong } from './server/auth-srv-server.msg.pong';

export const AUTH_SRV_SERVER_MSG = {
  PING: AuthSrvServerMsgPing,
  PONG: AuthSrvServerMsgPong,
} as const;
export type AUTH_SRV_SERVER_MSG = {[K in keyof typeof AUTH_SRV_SERVER_MSG]: typeof AUTH_SRV_SERVER_MSG[K]['prototype'] };
export type AN_AUTH_SRV_SERVER_MSG = AUTH_SRV_SERVER_MSG[keyof AUTH_SRV_SERVER_MSG];

export const AUTH_SRV_SERVER_MSGS = Object.values(AUTH_SRV_SERVER_MSG);
