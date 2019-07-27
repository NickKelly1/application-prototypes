import { UserEntity } from '../../data/entities/user-entity';
import { MaybeValue } from '../../helpers/maybe';

/**
 * @description
 * List of message the server can send
 */
export const SOCKET_SERVER_MESSAGE_TYPE = {
  USER_TYPING: 'USER_TYPING',
};
export type SOCKET_SERVER_MESSAGE_TYPE = typeof SOCKET_SERVER_MESSAGE_TYPE;

/**
 * @description
 * Broadcast when a User is typing a Chat Message
 */
export interface SocketServerMessageUserTyping {
  user_id: MaybeValue<UserEntity['id']>;
}

export type SocketServerMessage = SocketServerMessageUserTyping;
