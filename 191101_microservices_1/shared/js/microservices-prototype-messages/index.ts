import { messagePreprocessorFactory } from './src/messages/SOCKET_MESSAGES';
import { CLIENT_MESSAGE_VALIDATOR_MAP, CLIENT_MESSAGE } from './src/messages/CLIENT_SOCKET_MESSAGES';
import { SERVER_MESSAGE, SERVER_MESSAGE_VALIDATOR_MAP } from './src/messages/SERVER_SOCKET_MESSAGES';
import { SocketWrapper } from './src/lib/SocketWrapper';

export * from './src/messages/CLIENT_SOCKET_MESSAGES';
export * from './src/messages/SERVER_SOCKET_MESSAGES';
export * from './src/messages/SOCKET_MESSAGES';
export * from './src/lib/SocketWrapper';

/**
 * Creates a client interface to be used on the server
 *
 * @param socket
 */
export function wrapSocketOnServer(socket: SocketIOClient.Socket) {
  const preprocessClientMessage = messagePreprocessorFactory(CLIENT_MESSAGE_VALIDATOR_MAP);
  const client = new SocketWrapper<CLIENT_MESSAGE, SERVER_MESSAGE>(socket, preprocessClientMessage);
  return client;
}



/**
 * Creates a server that may be used on the client
 *
 * @param socket
 */
export function wrapSocketOnClient(socket: SocketIO.Socket) {
  const preprocessServerMessage = messagePreprocessorFactory(SERVER_MESSAGE_VALIDATOR_MAP);
  const server = new SocketWrapper<SERVER_MESSAGE, CLIENT_MESSAGE>(socket, preprocessServerMessage);
  return server;
}
