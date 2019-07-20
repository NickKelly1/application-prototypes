export const SOCKET_CLIENT_EVENT = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  MESSAGE: 'CLIENT_MESSAGE',
} as const;
export type SOCKET_CLIENT_EVENT = typeof SOCKET_CLIENT_EVENT;

export const SOCKET_SERVER_EVENT = {
  CONNECTION: 'connection',
} as const;
export type SOCKET_SERVER_EVENT = typeof SOCKET_SERVER_EVENT;
