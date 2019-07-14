import SocketIo from 'socket.io';
import { EventEmitter } from 'events';
import { AValueOf } from '../../@types/helper-types';

export class SocketWrapper<
  IncomingMessagePayloads extends Record<AValueOf<IncomingMessageNames>, any>,
  OutgoingMessagePayloads extends Record<AValueOf<OutgoingMessageNames>, any>,
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
  public emit = <K extends AValueOf<OutgoingMessageNames>>(message: K, payload: OutgoingMessagePayloads[K]) => {
    return super.emit(message, payload);
  };

  /**
   * @description
   * Type wrapper for EventEmitter
   */
  public on = <K extends AValueOf<IncomingMessageNames>>(
    message: K,
    listener: (payload: IncomingMessagePayloads[K]) => void,
  ) => {
    return super.on(message, listener);
  };
}
