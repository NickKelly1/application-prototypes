import { SERVER_MESSAGE, SERVER_MESSAGES, CLIENT_MESSAGES, MESSAGE_FAILURE, SocketWrapper, CLIENT_MESSAGE } from '@nick-kelly/microservices-prototype-messages'
import { ELEMENTS } from '..';

/**
 * Handle successful messages from the client
 *
 * @param server
 */
export function clientServerMessageHandler(server: SocketWrapper<SERVER_MESSAGE, CLIENT_MESSAGE>) {
  return function handleMessage(message: SERVER_MESSAGE) {
    console.log(`__handleMessage__ (${message.type})`);
    const log = document.createElement('li');
    let logContent = `[SERVER] [${message.type}]`
    let cb: undefined | Function;

    switch (message.type) {
      case SERVER_MESSAGES.TYPE.INIT: {
        logContent += `\n\t${message.payload.hello}`;
        break;
      }
      case SERVER_MESSAGES.TYPE.ORDER_CREATED: {
        logContent += `\n\t${message.payload.id}`;
        break;
      }
      case SERVER_MESSAGES.TYPE.ORDER_UPDATED: {
        logContent += `\n\t${message.payload.id}`;
        break;
      }
      case SERVER_MESSAGES.TYPE.ORDER_DELETED: {
        logContent += `\n\t${message.payload.id}`;
        break;
      }
      case SERVER_MESSAGES.TYPE.PING: {
        cb = () => server.send({ type: CLIENT_MESSAGES.TYPE.PONG, payload: {} });
        break;
      }
      case SERVER_MESSAGES.TYPE.PONG: {
        break;
      }

      default: {
        logContent += `\n\t[UNHANDLED_MESSAGE_TYPE::${(message as any).type}]`;
        break;
      }
    }

    log.textContent = logContent;
    ELEMENTS.ulMessageLog.appendChild(log);
    if (cb) cb();
  }
}



/**
 * Handle failed messages from the server
 *
 * @param server
 */
export function clientServerMessageFailHandler(server: SocketWrapper<SERVER_MESSAGE, CLIENT_MESSAGE>) {
  return function handleMessageFail(fail: MESSAGE_FAILURE) {
    console.log('[clientServerMessageFailHandler::handleFailMessage] received failed message', fail);

    const log = document.createElement('li');
    const logContent = `[SERVER] [MESSAGE_FAILURE]\n\tReason: ${fail.reason}\n\tDescription: ${fail.description}`;

    log.textContent = logContent;
    ELEMENTS.ulMessageLog.appendChild(log);
  }
}