import { AuthSrvClientMsgPing } from './client/auth-srv-client.msg.ping';
import { AuthSrvClientMsgPong } from './client/auth-srv-client.msg.pong';

export const AUTH_SRV_CLIENT_MSG = {
  PING: AuthSrvClientMsgPing,
  PONG: AuthSrvClientMsgPong,
} as const;
export type AUTH_SRV_CLIENT_MSG = {[K in keyof typeof AUTH_SRV_CLIENT_MSG]: typeof AUTH_SRV_CLIENT_MSG[K]['prototype']};
export type AN_AUTH_SRV_CLIENT_MSG = AUTH_SRV_CLIENT_MSG[keyof AUTH_SRV_CLIENT_MSG];

export const AUTH_SRV_CLIENT_MSGS = Object.values(AUTH_SRV_CLIENT_MSG);
