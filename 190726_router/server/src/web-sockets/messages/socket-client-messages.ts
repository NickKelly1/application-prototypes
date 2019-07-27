/**
 * @description
 * List of messages a client can send
 */
export const SOCKET_CLIENT_MESSAGE_TYPE = {
  TYPING: 'TYPING',
} as const;
export type SOCKET_CLIENT_MESSAGE_TYPE = typeof SOCKET_CLIENT_MESSAGE_TYPE;

/**
 * @description
 * Emitted when the User is typing a Chat Message
 */
export interface SocketClientMessageTyping {
  _type: SOCKET_CLIENT_MESSAGE_TYPE['TYPING'];
}

export type SocketClientMessage = SocketClientMessageTyping;
