import SocketIo from 'socket.io';
import { EventEmitter } from 'events';
import { ValueFrom } from '../../@types/helpers';
import {
  SOCKET_CLIENT_MESSAGE,
  SOCKET_SERVER_MESSAGE,
  SocketClientMessagePayloads,
  SocketServerMessagePayloads,
} from '../shared/socket-types';

export class SocketWrapper<
  IncomingMessagePayloads extends Record<ValueFrom<IncomingMessageNames>, any>,
  OutgoingMessagePayloads extends Record<ValueFrom<OutgoingMessageNames>, any>,
  IncomingMessageNames extends { readonly [index: string]: string },
  OutgoingMessageNames extends { readonly [index: string]: string }
> extends EventEmitter {
  // Socket io server
  private socketIoServer: SocketIo.Server;
  private incomingMessageNames: IncomingMessageNames;
  private outgoingMessageNames: OutgoingMessageNames;

  /**
   * @constructor
   *
   * @param opts
   */
  public constructor(
    incomingMessageNames: IncomingMessageNames,
    outgoingMessageNames: OutgoingMessageNames,
    ...opts: Parameters<typeof SocketIo>
  ) {
    super();
    this.incomingMessageNames = incomingMessageNames;
    this.outgoingMessageNames = outgoingMessageNames;
    this.socketIoServer = SocketIo(...opts);
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
    Object.values(this.incomingMessageNames).forEach(incomingMessage => {
      socket.on(incomingMessage, payload => this.on(incomingMessage, payload));
    });
  };

  /**
   * @description
   * Type wrapper for EventEmitter
   */
  public emit = <K extends ValueFrom<OutgoingMessageNames>>(message: K, payload: OutgoingMessagePayloads[K]) => {
    return super.emit(message, payload);
  };

  /**
   * @description
   * Type wrapper for EventEmitter
   */
  public on = <K extends ValueFrom<IncomingMessageNames>>(
    message: K,
    listener: (payload: IncomingMessagePayloads[K]) => void,
  ) => {
    return super.on(message, listener);
  };
}

const z = new SocketWrapper<
  SocketClientMessagePayloads,
  SocketServerMessagePayloads,
  SOCKET_CLIENT_MESSAGE,
  SOCKET_SERVER_MESSAGE
>(SOCKET_CLIENT_MESSAGE, SOCKET_SERVER_MESSAGE, {});

z.on('ATTEMPT_JOIN_ROOM', payload => payload.auth.token);
