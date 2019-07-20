import { RoomModel } from '../../../models/room';

/**
 * @description
 * Mixin for SocketClientMessages
 */
export interface WithClientAuthentication {
  auth: { token: string };
}

export const SOCKET_CLIENT_MESSAGE_TYPE = {
  ATTEMPT_JOIN_ROOM: 'ATTEMPT_JOIN_ROOM',
  ATTEMPT_LOG_IN: 'ATTEMPT_LOG_IN',
  ATTEMPT_LOG_OUT: 'ATTEMPT_LOG_OUT',
  ATTEMPT_SIGN_UP: 'ATTEMPT_SIGN_UP',
  NEW_CHAT_MESSAGE: 'NEW_CHAT_MESSAGE',
  STOP_TYPING: 'STOP_TYPING',
  TYPING: 'TYPING',
} as const;
export type SOCKET_CLIENT_MESSAGE_TYPE = typeof SOCKET_CLIENT_MESSAGE_TYPE;

/**
 * @payload
 *
 * @description
 * "Attempt Join Room" payload
 */
export interface SocketClientMessageAttemptJoinRoom {
  _type: SOCKET_CLIENT_MESSAGE_TYPE['ATTEMPT_JOIN_ROOM'];
  room_id: RoomModel['id'];
}

/**
 * @payload
 *
 * @description
 * "Attempt Log In" payload
 */
export interface SocketClientMessageAttemptLogIn {
  _type: SOCKET_CLIENT_MESSAGE_TYPE['ATTEMPT_LOG_IN'];
  email: string;
  password: string;
}

/**
 * @payload
 *
 * @description
 * "Attempt Log Out" payload
 */
export type SocketClientMessageAttemptLogOut = WithClientAuthentication & {
  _type: SOCKET_CLIENT_MESSAGE_TYPE['ATTEMPT_LOG_OUT'];
};

/**
 * @payload
 *
 * @description
 * "Attempt Sign Up" payload
 */
export interface SocketClientMessageAttemptSignUp {
  _type: SOCKET_CLIENT_MESSAGE_TYPE['ATTEMPT_SIGN_UP'];
  email: string;
  password: string;
}

/**
 * @deprecated
 * This message is invalid - should be done via post request
 *
 * @payload
 *
 * @description
 * "New Message" payload
 */
export type SocketClientMessageNewChatMessage = WithClientAuthentication & {
  _type: SOCKET_CLIENT_MESSAGE_TYPE['NEW_CHAT_MESSAGE'];
  chat_message: string;
};

/**
 * @payload
 *
 * @description
 * "Stop Typing" payload
 */
export type SocketClientMessageStopTyping = WithClientAuthentication & {
  _type: SOCKET_CLIENT_MESSAGE_TYPE['STOP_TYPING'];
};

/**
 * @payload
 *
 * @description
 * "Typing" payload
 */
export type SocketClientMessageTyping = WithClientAuthentication & {
  _type: SOCKET_CLIENT_MESSAGE_TYPE['TYPING'];
};

/**
 * @note
 * This type's must be specified by name (rather than specifying "*")
 * in the schema build script. Otherwise it's not json-schema does not
 * recognise it as "required", rather it only defines it
 */
export type SocketClientMessage =
  | SocketClientMessageAttemptLogIn
  | SocketClientMessageAttemptLogOut
  | SocketClientMessageAttemptSignUp
  | SocketClientMessageNewChatMessage
  | SocketClientMessageStopTyping
  | SocketClientMessageTyping;
