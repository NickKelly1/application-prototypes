import SocketIo from 'socket.io';
import { EventEmitter } from 'events';
import { ValueFrom } from '../../@types/helpers';
import { SOCKET_SERVER_MESSAGE, SOCKET_CLIENT_MESSAGE, SocketClientMessagePayloads } from '../shared/socket-types';

type z<T> = T extends any[] ? string : string;

const incomingSocketValidator = <
  Message extends string | symbol,
  ReturnPayload = Message extends keyof SocketClientMessagePayloads ? SocketClientMessagePayloads[Message] : null
>(
  message: Message,
  payload: any,
): ({ payload: ReturnPayload, errors: string[], }) => {

  switch (message) {
    case SOCKET_CLIENT_MESSAGE.NEW_MESSAGE:
      // TODO: validate with type guard
      // TODO: implement as middleware
      payload
      break;
  
    default:
      break;
  }

  return { payload: null, messages: ['@todo!'] };
}

// incomingSocketValidator(SOCKET_CLIENT_MESSAGE.NEW_MESSAGE, );

class SocketListener extends EventEmitter {
  private socket: SocketIo.Socket;
  private incomingMessageNames: readonly string[];

  public constructor(socket: SocketIo.Socket, messages: readonly string[]) {
    super();
    this.socket = socket;
    this.incomingMessageNames = messages;

    messages.forEach(message => {
      socket.on(message, payload => this.handleReceiveMessage(message, payload));
    });
  }

  private handleReceiveMessage = (message: string | symbol, payload: any) => {
    switch (message) {
      case //:

        break;

      default:
        throw new Error('todo: socket received error');
    }
  };
}
