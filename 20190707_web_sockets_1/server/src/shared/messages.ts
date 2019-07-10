import { EventEmitter } from 'events';
import { ValueFrom } from '../../@types/helpers';

export const SOCKET_IO_SERVER_EVENTS = {
  CONNECTION: 'connection',
  CONNECT: 'connect',
} as const;

export const SOCKET_IO_SERVER_MESSAGE = {
  NEW_MESSAGE: 'new message',
  ADD_USER: 'add user',
  LOGIN: 'login',
  USER_JOINED: 'user joined',
  TYPING: 'typing',
  STOP_TYPING: 'stop typing',
  USER_LEFT: 'user left',
} as const;
export type SOCKET_IO_SERVER_MESSAGE = typeof SOCKET_IO_SERVER_MESSAGE;
// export const SOCKET_IO_SERVER_MESSAGES = Object.values(SOCKET_IO_SERVER_MESSAGES);
// export type SOCKET_IO_SERVER_MESSAGES = typeof SOCKET_IO_SERVER_MESSAGES;

export const SOCKET_IO_CLIENT_MESSAGE = {
  NEW_MESSAGE: 'new message',
  ADD_USER: 'add user',
  LOGIN: 'login',
  TYPING: 'typing',
  STOP_TYPING: 'stop typing',
  DISCONNECT: 'disconnect',
} as const;
export type SOCKET_IO_CLIENT_MESSAGE = typeof SOCKET_IO_CLIENT_MESSAGE;
// export const SOCKET_IO_CLIENT_MESSAGES = Object.values(SOCKET_IO_CLIENT_MESSAGE);
// export type SOCKET_IO_CLIENT_MESSAGES = typeof SOCKET_IO_CLIENT_MESSAGES;

export interface SocketIoServerMessagePayloads {
  [SOCKET_IO_SERVER_MESSAGE.NEW_MESSAGE]: 'z';
  [SOCKET_IO_SERVER_MESSAGE.ADD_USER]: 'z';
  [SOCKET_IO_SERVER_MESSAGE.LOGIN]: 'z';
  [SOCKET_IO_SERVER_MESSAGE.USER_JOINED]: 'z';
  [SOCKET_IO_SERVER_MESSAGE.TYPING]: 'z';
  [SOCKET_IO_SERVER_MESSAGE.STOP_TYPING]: 'z';
  [SOCKET_IO_SERVER_MESSAGE.USER_LEFT]: 'z';
}

export interface SocketIoClientMessagePayloads {
  [SOCKET_IO_CLIENT_MESSAGE.NEW_MESSAGE]: 'z';
  [SOCKET_IO_CLIENT_MESSAGE.ADD_USER]: 'z';
  [SOCKET_IO_CLIENT_MESSAGE.LOGIN]: 'z';
  [SOCKET_IO_CLIENT_MESSAGE.TYPING]: 'z';
  [SOCKET_IO_CLIENT_MESSAGE.STOP_TYPING]: 'z';
  [SOCKET_IO_CLIENT_MESSAGE.DISCONNECT]: 'z';
}

export interface ServerSocketMessages {
  on: <T extends ValueFrom<SOCKET_IO_CLIENT_MESSAGE>>(
    message: T,
    listener: (payload: SocketIoClientMessagePayloads[T]) => void,
  ) => ThisType<ServerSocketMessages>;
  emit: <T extends ValueFrom<SOCKET_IO_SERVER_MESSAGE>>(
    message: T,
    payload: SocketIoServerMessagePayloads[T],
  ) => ReturnType<EventEmitter['emit']>;
}

export interface ClientSocketMessages {
  on: <T extends ValueFrom<SOCKET_IO_SERVER_MESSAGE>>(
    message: T,
    listener: (payload: SocketIoServerMessagePayloads[T]) => void,
  ) => ThisType<ClientSocketMessages>;
  emit: <T extends ValueFrom<SOCKET_IO_CLIENT_MESSAGE>>(
    message: T,
    payload: SocketIoClientMessagePayloads[T],
  ) => ReturnType<EventEmitter['emit']>;
}
