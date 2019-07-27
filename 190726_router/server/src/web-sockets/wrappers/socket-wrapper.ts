import socketIo from 'socket.io';
import { SOCKET_CLIENT_MESSAGE_TYPE, SocketClientMessageTyping } from '../messages/socket-client-messages';
import { TypedEventEmitter } from '../../helpers/typed-event-emitter';

interface SocketClientMessageTypeMap {
  disconnect: {};
  [SOCKET_CLIENT_MESSAGE_TYPE.TYPING]: SocketClientMessageTyping;
}

export class SocketWrapper extends TypedEventEmitter<SocketClientMessageTypeMap> {
  private client: socketIo.Socket;

  public constructor(client: socketIo.Socket) {
    super();
    this.client = client;
    // TODO: message binding
  }
}
