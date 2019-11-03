import { ServerClientSocket } from './ServerClientSocket';
import { CLIENT_MESSAGE, CLIENT_MESSAGES } from '../../../shared/messages/CLIENT_SOCKET_MESSAGES';
import { MESSAGE_FAILURE } from '../../../shared/messages/SOCKET_MESSAGES';
import { SERVER_MESSAGES } from '../../../shared/messages/SERVER_SOCKET_MESSAGES';



/**
 * Handle successful messages from the client
 *
 * @param client
 */
export function serverClientMessageHandler(io: SocketIO.Server, client: ServerClientSocket) {
  return function handleMessage(message: CLIENT_MESSAGE) {
    console.log('[serverClientMessageHandler] received successful message', message);
    switch (message.type) {
      case CLIENT_MESSAGES.TYPE.PING: {
        console.log('[doserverClientMessageHandler::message::SUCCESS::PING]', message);
        return void client.send({ type: SERVER_MESSAGES.TYPE.PONG, payload: {} });
      }
    }
  }
}



/**
 * Handle failed messages from the client
 *
 * @param client
 */
export function serverClientMessageFailHandler(io: SocketIO.Server, client: ServerClientSocket) {
  return function handleMessageFail(fail: MESSAGE_FAILURE) {
    console.log('received failed message', fail);
  }
}