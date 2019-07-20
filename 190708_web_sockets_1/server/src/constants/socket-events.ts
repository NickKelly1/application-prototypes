export const SOCKET_CLIENT_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  MESSAGE: 'CLIENT_MESSAGE',
} as const;
export type SOCKET_CLIENT_EVENTS = typeof SOCKET_CLIENT_EVENTS;

export const SOCKET_SERVER_EVENTS = {};
