import { ClientServerSocket } from './ClientServerSocket';
import { SERVER_MESSAGE, SERVER_MESSAGES } from '../../shared/messages/SERVER_SOCKET_MESSAGES';
import { MESSAGE_FAILURE } from '../../shared/messages/SOCKET_MESSAGES';
import { CLIENT_MESSAGES } from '../../shared/messages/CLIENT_SOCKET_MESSAGES';




/**
 * Handle successful messages from the client
 *
 * @param server
 */
export function clientServerMessageHandler(server: ClientServerSocket) {
  return function handleMessage(message: SERVER_MESSAGE) {
    console.log('[clientServerMessageHandler] received successful message', message);
    switch (message.type) {
      case SERVER_MESSAGES.TYPE.INIT: return void console.log('[clientSocketHandler::on::eMessage::SUCCESS::INIT]', message);
      case SERVER_MESSAGES.TYPE.ORDER_CREATED: return void console.log('[clientSocketHandler::on::eMessage::SUCCESS::ORDER_CREATED]', message);
      case SERVER_MESSAGES.TYPE.ORDER_UPDATED: return void console.log('[clientSocketHandler::on::eMessage::SUCCESS::ORDER_UPDATED]', message);
      case SERVER_MESSAGES.TYPE.ORDER_DELETED: return void console.log('[clientSocketHandler::on::eMessage::SUCCESS::ORDER_DELETED]', message);
      case SERVER_MESSAGES.TYPE.PING: {
        console.log('[clientSocketHandler::on::eMessage::SUCCESS::PING]', message);
        return void server.send({ type: CLIENT_MESSAGES.TYPE.PONG, payload: {} });
      }
      default: return void console.log('[clientSocketHandler::on::eMessage::SUCCESS::UNHANDLED]', `unhandled message type "${(message as any).type}"`, message);
    }
  }
}



/**
 * Handle failed messages from the server
 *
 * @param server
 */
export function clientServerMessageFailHandler(server: ClientServerSocket) {
  return function handleMessageFail(fail: MESSAGE_FAILURE) {
    console.log('received failed message', fail);
  }
}