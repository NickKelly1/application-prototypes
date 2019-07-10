import SocketIo from 'socket.io';
import { EventEmitter } from 'events';
import {
  ServerSocketMessages,
  SOCKET_IO_SERVER_MESSAGES,
  SOCKET_IO_SERVER_MESSAGE,
  SocketIoClientMessagePayloads,
  SocketIoServerMessagePayloads,
  SOCKET_IO_CLIENT_MESSAGE,
} from '../shared/messages';
import { ElementOf, ValueFrom } from '../../@types/helpers';

export class SocketServer extends EventEmitter implements ServerSocketMessages {
  private socketIoServer: SocketIo.Server;

  /**
   * @constructor
   *
   * @param httpServer
   */
  public constructor(httpServer: Parameters<typeof SocketIo>) {
    super();
    this.socketIoServer = SocketIo(httpServer);
    this.bindSocketIoServerEvents();
  }

  /**
   * @description
   * Bind to the socket server events
   */
  private bindSocketIoServerEvents = () => {
    this.socketIoServer.on('connect', this.handleSocketConnected);
  };

  /**
   * @description
   * Fired when a connection is bound to the socket server
   */
  private handleSocketConnected = (socket: SocketIo.Socket) => {
    //
  };

  /**
   * @description
   * Type wrapper for EventEmitter
   */
  public emit = <T extends ValueFrom<SOCKET_IO_SERVER_MESSAGE>>(message: T, payload: SocketIoServerMessagePayloads[T]) => {
    // TODO: validation
    return super.emit(message, payload);
  };

  /**
   * @description
   * Type wrapper for EventEmitter
   */
  public on = <T extends ValueFrom<SOCKET_IO_CLIENT_MESSAGE>>(
    message: T,
    listener: (payload: SocketIoClientMessagePayloads[T]) => void,
  ) => {
    // TODO: validation
    return super.on(message, listener);
  };
}
