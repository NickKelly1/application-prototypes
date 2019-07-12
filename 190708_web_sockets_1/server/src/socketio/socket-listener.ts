import SocketIo from 'socket.io';
import { EventEmitter } from 'events';
import { ValueFrom, Obj } from '../../@types/helpers';
import { SOCKET_SERVER_MESSAGE, SOCKET_CLIENT_MESSAGE, SocketClientMessagePayloads } from '../shared/socket-types';

type z<T> = T extends any[] ? string : string;

const incomingSocketValidator = <
  Message extends string | symbol,
  ReturnPayload = Message extends keyof SocketClientMessagePayloads ? SocketClientMessagePayloads[Message] : null
>(
  message: Message,
  payload: any,
): { payload: ReturnPayload; errors: string[] } => {
  switch (message) {
    case SOCKET_CLIENT_MESSAGE.NEW_MESSAGE:
      // TODO: validate with type guard
      // TODO: implement as middleware
      payload;
      break;

    default:
      break;
  }

  return { payload: null, messages: ['@todo!'] };
};

// incomingSocketValidator(SOCKET_CLIENT_MESSAGE.NEW_MESSAGE, );

class SocketListener<V extends { readonly [index: string]: Obj }, M = Exclude<keyof V, string>> extends EventEmitter {
  private socket: SocketIo.Socket;
  private incomingMessageNames: readonly (M)[];
  private validator: V;

  public constructor(socket: SocketIo.Socket, messages: readonly (M)[], validator: V) {
    super();
    this.socket = socket;
    this.incomingMessageNames = messages;
    this.validator = validator;

    messages.forEach(message => {
      socket.on(message | Symbol.iterator, payload => this.handleReceiveMessage(message, payload));
    });
  }

  private handleReceiveMessage = (message: string, payload: unknown) => {
    if (!(payload instanceof Object)) {
      // invalid
      return;
    }

    payload._message = message;
    this.emit(message, payload);
  };
}
