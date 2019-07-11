export const SOCKET_IO_SERVER_EVENTS = {
  CONNECTION: 'connection',
  CONNECT: 'connect',
} as const;
export type SOCKET_IO_SERVER_EVENTS = typeof SOCKET_IO_SERVER_EVENTS;

export const SOCKET_IO_SERVER_MESSAGES = {
  NEW_MESSAGE: 'new message',
  ADD_USER: 'add user',
  LOGIN: 'login',
  USER_JOINED: 'user joined',
  TYPING: 'typing',
  STOP_TYPING: 'stop typing',
  USER_LEFT: 'user left',
} as const;
export type SOCKET_IO_SERVER_MESSAGES = typeof SOCKET_IO_SERVER_MESSAGES;

export const SOCKET_IO_CLIENT_MESSAGES = {
  NEW_MESSAGE: 'new message',
  ADD_USER: 'add user',
  LOGIN: 'login',
  TYPING: 'typing',
  STOP_TYPING: 'stop typing',
  DISCONNECT: 'disconnect',
} as const;
export type SOCKET_IO_CLIENT_MESSAGES = typeof SOCKET_IO_CLIENT_MESSAGES;

export interface SocketIoServerMessagePayloads {
  [SOCKET_IO_SERVER_MESSAGES.NEW_MESSAGE]: 'z';
  [SOCKET_IO_SERVER_MESSAGES.ADD_USER]: 'z';
  [SOCKET_IO_SERVER_MESSAGES.LOGIN]: 'z';
  [SOCKET_IO_SERVER_MESSAGES.USER_JOINED]: 'z';
  [SOCKET_IO_SERVER_MESSAGES.TYPING]: 'z';
  [SOCKET_IO_SERVER_MESSAGES.STOP_TYPING]: 'z';
  [SOCKET_IO_SERVER_MESSAGES.USER_LEFT]: 'z';
}

export interface SocketIoServerMessagePayloads {
  [SOCKET_IO_CLIENT_MESSAGES.NEW_MESSAGE]: 'z';
  [SOCKET_IO_CLIENT_MESSAGES.ADD_USER]: 'z';
  [SOCKET_IO_CLIENT_MESSAGES.LOGIN]: 'z';
  [SOCKET_IO_CLIENT_MESSAGES.TYPING]: 'z';
  [SOCKET_IO_CLIENT_MESSAGES.STOP_TYPING]: 'z';
  [SOCKET_IO_CLIENT_MESSAGES.DISCONNECT]: 'z';
}
