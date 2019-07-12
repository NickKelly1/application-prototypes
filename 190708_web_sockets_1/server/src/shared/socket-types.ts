import { EventEmitter } from 'events';
import { ValueFrom } from '../../@types/helpers';

export const SOCKET_SERVER_EVENTS = {
  CONNECTION: 'connection',
  CONNECT: 'connect',
} as const;

export const SOCKET_SERVER_MESSAGE = {
  NEW_MESSAGE: 'NEW_MESSAGE',
  SIGN_UP_SUCCESS: 'SIGN_UP_SUCCESS',
  SIGN_UP_FAIL: 'SIGN_UP_FAIL',
  LOG_IN_SUCCESS: 'LOG_IN_SUCCESS',
  LOG_IN_FAIL: 'LOG_IN_FAIL',
  USER_JOINED_ROOM: 'USER_JOINED_ROOM',
  USER_TYPING: 'USER_TYPING',
  USER_STOPPED_TYPING: 'USER_STOPPED_TYPING',
  USER_LEFT_ROOM: 'USER_LEFT_ROOM',
} as const;
export type SOCKET_SERVER_MESSAGE = typeof SOCKET_SERVER_MESSAGE;
// export const SOCKET_IO_SERVER_MESSAGES = Object.values(SOCKET_IO_SERVER_MESSAGES);
// export type SOCKET_IO_SERVER_MESSAGES = typeof SOCKET_IO_SERVER_MESSAGES;

export const SOCKET_CLIENT_MESSAGE = {
  NEW_MESSAGE: 'NEW_MESSAGE',
  ATTEMPT_SIGN_UP: 'ATTEMPT_SIGN_UP',
  ATTEMPT_LOG_IN: 'ATTEMPT_LOG_IN',
  ATTEMPT_JOIN_ROOM: 'ATTEMPT_JOIN_ROOM',
  TYPING: 'TYPING',
  STOP_TYPING: 'STOP_TYPING',
  LOG_OUT: 'LOG_OUT',
  DISCONNECT: 'DISCONNECT',
} as const;
export type SOCKET_CLIENT_MESSAGE = typeof SOCKET_CLIENT_MESSAGE;
// export const SOCKET_IO_CLIENT_MESSAGES = Object.values(SOCKET_CLIENT_MESSAGE);
// export type SOCKET_IO_CLIENT_MESSAGES = typeof SOCKET_IO_CLIENT_MESSAGES;

interface UserAuth {
  token: string;
}

interface UserModel {
  name: string;
  id: string;
  email: string;
}

type UserModelWithPassword = UserModel & { password: string };

export interface SocketServerMessagePayloads {
  [SOCKET_SERVER_MESSAGE.NEW_MESSAGE]: { user: UserModel; message: string };
  [SOCKET_SERVER_MESSAGE.SIGN_UP_SUCCESS]: { user: UserModel };
  [SOCKET_SERVER_MESSAGE.SIGN_UP_FAIL]: { user: UserModel; reason: string };
  [SOCKET_SERVER_MESSAGE.LOG_IN_SUCCESS]: { user: UserModel };
  [SOCKET_SERVER_MESSAGE.LOG_IN_FAIL]: { user: UserModel; reason: string };
  [SOCKET_SERVER_MESSAGE.USER_JOINED_ROOM]: { user: UserModel };
  [SOCKET_SERVER_MESSAGE.USER_TYPING]: { user: UserModel };
  [SOCKET_SERVER_MESSAGE.USER_STOPPED_TYPING]: { user: UserModel };
  [SOCKET_SERVER_MESSAGE.USER_LEFT_ROOM]: { user: UserModel };
}

export interface SocketClientMessagePayloads {
  [SOCKET_CLIENT_MESSAGE.NEW_MESSAGE]: { auth: UserAuth };
  [SOCKET_CLIENT_MESSAGE.ATTEMPT_SIGN_UP]: { auth: UserAuth };
  [SOCKET_CLIENT_MESSAGE.ATTEMPT_LOG_IN]: { auth: UserAuth; email: UserModel['email'] };
  [SOCKET_CLIENT_MESSAGE.ATTEMPT_JOIN_ROOM]: { auth: UserAuth };
  [SOCKET_CLIENT_MESSAGE.TYPING]: { auth: UserAuth };
  [SOCKET_CLIENT_MESSAGE.STOP_TYPING]: { auth: UserAuth };
  [SOCKET_CLIENT_MESSAGE.LOG_OUT]: { auth: UserAuth };
  [SOCKET_CLIENT_MESSAGE.DISCONNECT]: { auth: UserAuth };
}
