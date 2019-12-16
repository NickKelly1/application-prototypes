export const AUTH_SVC_SERVER_MSG_TYPE = {
  PING: 'ping',
  PONG: 'pong',
} as const;
export type AUTH_SVC_SERVER_MSG_TYPE = typeof AUTH_SVC_SERVER_MSG_TYPE
export type AN_AUTH_SVC_SERVER_MSG_TYPE = AUTH_SVC_SERVER_MSG_TYPE[keyof AUTH_SVC_SERVER_MSG_TYPE];

export const AUTH_SVC_SERVER_MSG_TYPES = Object.values(AUTH_SVC_SERVER_MSG_TYPE);