import { AuthSVCClientMsgPing } from './client/auth-svc-client.msg.ping';
import { AuthSVCClientMsgPong } from './client/auth-svc-client.msg.pong';

export const AUTH_SVC_CLIENT_MSG = {
  PING: AuthSVCClientMsgPing,
  PONG: AuthSVCClientMsgPong,
} as const;
export type AUTH_SVC_CLIENT_MSG = {[K in keyof typeof AUTH_SVC_CLIENT_MSG]: typeof AUTH_SVC_CLIENT_MSG[K]['prototype']};
export type AN_AUTH_SVC_CLIENT_MSG = AUTH_SVC_CLIENT_MSG[keyof AUTH_SVC_CLIENT_MSG];

export const AUTH_SVC_CLIENT_MSGS = Object.values(AUTH_SVC_CLIENT_MSG);
