import { CLIENT_MESSAGES, CLIENT_MESSAGE, SocketWrapper, SERVER_MESSAGE, MESSAGE_FAILURE_REASON, SERVER_MESSAGES, MESSAGE_FAILURE } from '@nick-kelly/microservices-prototype-messages';



/**
 * Handle successful messages from the client
 *
 * @param client
 */
export function serverClientMessageHandler(io: SocketIO.Server, client: SocketWrapper<CLIENT_MESSAGE, SERVER_MESSAGE>) {
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
export function serverClientMessageFailHandler(io: SocketIO.Server, client: SocketWrapper<CLIENT_MESSAGE, SERVER_MESSAGE>) {
  return function handleMessageFail(fail: MESSAGE_FAILURE) {
    console.log('received failed message', fail);
  }
}