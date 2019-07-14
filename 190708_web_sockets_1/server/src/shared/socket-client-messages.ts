import { UserModel, UserModelWithPassword } from '../models/user-model';
import { RoomModel } from '../models/room';
import { SocketPayloadWithMessage, SocketPayloadWithAuth } from '../socket/socket-types';

export const SOCKET_CLIENT_MESSAGE = {
  NEW_MESSAGE: 'NEW_MESSAGE',
  // ATTEMPT_SIGN_UP: 'ATTEMPT_SIGN_UP',
  // ATTEMPT_LOG_IN: 'ATTEMPT_LOG_IN',
  // ATTEMPT_JOIN_ROOM: 'ATTEMPT_JOIN_ROOM',
  // TYPING: 'TYPING',
  // STOP_TYPING: 'STOP_TYPING',
  // LOG_OUT: 'LOG_OUT',
} as const;
export type SOCKET_CLIENT_MESSAGE = typeof SOCKET_CLIENT_MESSAGE;

// payload map
export interface SocketClientMessagePayloads {
  [SOCKET_CLIENT_MESSAGE.NEW_MESSAGE]: SocketPayloadWithAuth & { message: string };
  // [SOCKET_CLIENT_MESSAGE.ATTEMPT_SIGN_UP]: SocketPayloadWithMessage<SOCKET_CLIENT_MESSAGE['ATTEMPT_SIGN_UP']> & {
  //   name: UserModel['name'];
  //   email: UserModel['email'];
  //   password: UserModelWithPassword['password'];
  // };
  // [SOCKET_CLIENT_MESSAGE.ATTEMPT_LOG_IN]: SocketPayloadWithMessage<SOCKET_CLIENT_MESSAGE['ATTEMPT_LOG_IN']> & {
  //   email: UserModel['email'];
  //   password: UserModelWithPassword['password'];
  // };
  // [SOCKET_CLIENT_MESSAGE.ATTEMPT_JOIN_ROOM]: SocketPayloadWithMessage<SOCKET_CLIENT_MESSAGE['ATTEMPT_JOIN_ROOM']> &
  //   SocketPayloadWithAuth & { room: RoomModel['id'] };
  // [SOCKET_CLIENT_MESSAGE.TYPING]: SocketPayloadWithMessage<SOCKET_CLIENT_MESSAGE['TYPING']> & SocketPayloadWithAuth;
  // [SOCKET_CLIENT_MESSAGE.STOP_TYPING]: SocketPayloadWithMessage<SOCKET_CLIENT_MESSAGE['STOP_TYPING']> &
  //   SocketPayloadWithAuth;
  // [SOCKET_CLIENT_MESSAGE.LOG_OUT]: SocketPayloadWithMessage<SOCKET_CLIENT_MESSAGE['LOG_OUT']> & SocketPayloadWithAuth;
}
