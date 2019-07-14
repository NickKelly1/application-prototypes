import { WithAuth, WithMessage } from '../../@types/socket-types';
import { UserModel, UserModelWithPassword } from '../models/user-model';
import { RoomModel } from '../models/room';

export const SOCKET_CLIENT_MESSAGE = {
  NEW_MESSAGE: 'NEW_MESSAGE',
  ATTEMPT_SIGN_UP: 'ATTEMPT_SIGN_UP',
  ATTEMPT_LOG_IN: 'ATTEMPT_LOG_IN',
  ATTEMPT_JOIN_ROOM: 'ATTEMPT_JOIN_ROOM',
  TYPING: 'TYPING',
  STOP_TYPING: 'STOP_TYPING',
  LOG_OUT: 'LOG_OUT',
} as const;
export type SOCKET_CLIENT_MESSAGE = typeof SOCKET_CLIENT_MESSAGE;
// export const SOCKET_IO_CLIENT_MESSAGES = Object.values(SOCKET_CLIENT_MESSAGE);
// export type SOCKET_IO_CLIENT_MESSAGES = typeof SOCKET_IO_CLIENT_MESSAGES;}

// payload map
export interface SocketClientMessagePayloads {
  [SOCKET_CLIENT_MESSAGE.NEW_MESSAGE]: WithAuth & WithMessage<SOCKET_CLIENT_MESSAGE['NEW_MESSAGE']>;
  [SOCKET_CLIENT_MESSAGE.ATTEMPT_SIGN_UP]: WithMessage<SOCKET_CLIENT_MESSAGE['ATTEMPT_SIGN_UP']> & {
    name: UserModel['name'];
    email: UserModel['email'];
    password: UserModelWithPassword['password'];
  };
  [SOCKET_CLIENT_MESSAGE.ATTEMPT_LOG_IN]: WithMessage<SOCKET_CLIENT_MESSAGE['ATTEMPT_LOG_IN']> & {
    email: UserModel['email'];
    password: UserModelWithPassword['password'];
  };
  [SOCKET_CLIENT_MESSAGE.ATTEMPT_JOIN_ROOM]: WithMessage<SOCKET_CLIENT_MESSAGE['ATTEMPT_JOIN_ROOM']> &
    WithAuth & { room: RoomModel['id'] };
  [SOCKET_CLIENT_MESSAGE.TYPING]: WithMessage<SOCKET_CLIENT_MESSAGE['TYPING']> & WithAuth;
  [SOCKET_CLIENT_MESSAGE.STOP_TYPING]: WithMessage<SOCKET_CLIENT_MESSAGE['STOP_TYPING']> & WithAuth;
  [SOCKET_CLIENT_MESSAGE.LOG_OUT]: WithMessage<SOCKET_CLIENT_MESSAGE['LOG_OUT']> & WithAuth;
}
