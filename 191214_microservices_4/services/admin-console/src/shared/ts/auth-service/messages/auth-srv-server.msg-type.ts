export const AUTH_SRV_SERVER_MSG_TYPE = {
  PING: 'ping',
  PONG: 'pong',
} as const;
export type AUTH_SRV_SERVER_MSG_TYPE = typeof AUTH_SRV_SERVER_MSG_TYPE
export type AN_AUTH_SRV_SERVER_MSG_TYPE = AUTH_SRV_SERVER_MSG_TYPE[keyof AUTH_SRV_SERVER_MSG_TYPE];

export const AUTH_SRV_SERVER_MSG_TYPES = Object.values(AUTH_SRV_SERVER_MSG_TYPE);