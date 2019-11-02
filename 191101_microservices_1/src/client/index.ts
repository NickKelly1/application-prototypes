import io from 'socket.io-client';
import { AnyFunc } from '../shared/helpers/type-helpers';
import { SERVER_MESSAGES } from '../shared/messages/SERVER_SOCKET_MESSAGES';
import { ClientServerSocket } from './web-sockets/ClientServerSocket';
import { isRight } from 'fp-ts/lib/Either';
import { CLIENT_MESSAGES } from '../shared/messages/CLIENT_SOCKET_MESSAGES';

const root = document.getElementById('root');
if (!root) throw new ReferenceError('Unable to find the root element');


/**
 * Memoise the result of a function
 *
 * @param fn
 */
function memoise<F extends AnyFunc>(fn: F) {
  const NOT_MEMOISED = Symbol('NOT_MEMOISED');
  let result = NOT_MEMOISED;
  return function doMemoise(...args: Parameters<F>) {
    if (result !== NOT_MEMOISED) return result;
    result = fn(...args);
    return result;
  }
}



/**
 * Void the return of a function
 *
 * @param fn
 */
function voidify<F extends AnyFunc>(fn: F) {
  return function doVoidify(...args: Parameters<F>) {
    return void fn(...args);
  }
}


function handleKillSubscription(server: ClientServerSocket) {
  return function doKillSubscription() {
    server.destroy();
    server.socket.close();
  }
}


function clientSocketHandler() {
  return function doClientSocketHandler(server: ClientServerSocket) {
    server.on(eMessage => {
      console.log('clientSocketHandler::server::on::eMessage');
      if (isRight(eMessage)) {
        const { right: message } = eMessage;
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
      } else {
        const { left: fail } = eMessage;
        console.log('[clientSocketHandler::on::eMessage::FAIL]', fail);
      }
    });

    return handleKillSubscription(server);
  }
}



function subscribe(bindTo: HTMLElement) { // (btn: HTMLButtonElement) {
  return function doSubscribe() {
    const server = new ClientServerSocket(io('localhost:3000'));
    const dispose = clientSocketHandler()(server);

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'cancel';
    cancelBtn.style.height = '200px';
    cancelBtn.style.width = '600px';
    cancelBtn.onclick = () => {
      dispose();
      cancelBtn.remove();
    }
    bindTo.appendChild(cancelBtn);
  }
}

subscribe(root)();

// const subscribeOnce = memoise(subscribe);

// const subscribeBtn = document.createElement('button');
// subscribeBtn.textContent = 'subscribe';
// subscribeBtn.style.height = '200px';
// subscribeBtn.style.width = '600px';
// subscribeBtn.onclick = memoise(subscribe(subscribeBtn));
// root.appendChild(subscribeBtn);

// socket.send('message', { sup: 'dawg' });
