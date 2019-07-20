import { UserModel, UserModelWithPassword } from '../../../models/user-model';
import { RoomModel } from '../../../models/room';
import { ChatMessage } from '../../../models/chat-message';

export const SOCKET_SERVER_MESSAGE_TYPE = {
  LOG_IN_FAIL: 'LOG_IN_FAIL',
  LOG_IN_SUCCESS: 'LOG_IN_SUCCESS',
  NEW_CHAT_MESSAGE: 'NEW_CHAT_MESSAGE',
  SIGN_UP_FAIL: 'SIGN_UP_FAIL',
  SIGN_UP_SUCCESS: 'SIGN_UP_SUCCESS',
  USER_JOINED_ROOM: 'USER_JOINED_ROOM',
  USER_LEFT_ROOM: 'USER_LEFT_ROOM',
  USER_STOPPED_TYPING: 'USER_STOPPED_TYPING',
  USER_TYPING: 'USER_TYPING',
} as const;
export type SOCKET_SERVER_MESSAGE_TYPE = typeof SOCKET_SERVER_MESSAGE_TYPE;

/**
 * @payload
 *
 * @description
 * "Log In Fail" payload
 */
export interface SocketServerMessageLogInFail {
  _type: SOCKET_SERVER_MESSAGE_TYPE['LOG_IN_FAIL'];
  email: UserModel['email'];
  password: UserModelWithPassword['password'];
}

/**
 * @payload
 *
 * @description
 * "Log In Fail" payload
 */
export interface SocketServerMessageLogInSuccess {
  _type: SOCKET_SERVER_MESSAGE_TYPE['LOG_IN_SUCCESS'];
  user_id: UserModel['id'];
}

/**
 * @deprecated
 * This message should be a general "resource created" message
 *
 * @payload
 *
 * @description
 * "New Message" payload
 */
export interface SocketServerMessageNewChatMessage {
  _type: SOCKET_SERVER_MESSAGE_TYPE['NEW_CHAT_MESSAGE'];
  chat_message_id: ChatMessage['id'];
}

/**
 * @payload
 *
 * @description
 * "Sign Up Fail" payload
 */
export interface SocketServerMessageSignUpFail {
  _type: SOCKET_SERVER_MESSAGE_TYPE['SIGN_UP_FAIL'];
  email: UserModel['email'];
  password: UserModelWithPassword['password'];
}

/**
 * @payload
 *
 * @description
 * "Sign Up Success" payload
 */
export interface SocketServerMessageSignUpSuccess {
  _type: SOCKET_SERVER_MESSAGE_TYPE['SIGN_UP_SUCCESS'];
  user_id: UserModel['id'];
}

/**
 * @payload
 *
 * @description
 * "User Joined Room" payload
 */
export interface SocketServerMessageUserJoinedRoom {
  _type: SOCKET_SERVER_MESSAGE_TYPE['USER_JOINED_ROOM'];
  user_id: UserModel['id'];
  room_id: RoomModel['id'];
}

/**
 * @payload
 *
 * @description
 * "User Left Room" payload
 */
export interface SocketServerMessageUserLeftRoom {
  _type: SOCKET_SERVER_MESSAGE_TYPE['USER_LEFT_ROOM'];
  user_id: UserModel['id'];
  room_id: RoomModel['id'];
}

/**
 * @payload
 *
 * @description
 * "User Stopped Typing" payload
 */
export interface SocketServerMessageUserStoppedTyping {
  _type: SOCKET_SERVER_MESSAGE_TYPE['USER_STOPPED_TYPING'];
  user_id: UserModel['id'];
}

/**
 * @payload
 *
 * @description
 * "User Typing" payload
 */
export interface SocketServerMessageUserTyping {
  _type: SOCKET_SERVER_MESSAGE_TYPE['USER_TYPING'];
  user_id: UserModel['id'];
}

export type SocketServerMessage =
  | SocketServerMessageLogInFail
  | SocketServerMessageLogInSuccess
  | SocketServerMessageNewChatMessage
  | SocketServerMessageSignUpFail
  | SocketServerMessageSignUpSuccess
  | SocketServerMessageUserJoinedRoom
  | SocketServerMessageUserLeftRoom
  | SocketServerMessageUserStoppedTyping
  | SocketServerMessageUserTyping;
