import io from 'socket.io';
import { HttpServerContainer } from './http-server-container';
import { SOCKET_SERVER_EVENT, SOCKET_CLIENT_EVENT } from '../constants/socket-events';
import { ClientSocketWrapper } from './socket-client-wrapper';
import { SOCKET_CLIENT_MESSAGE_TYPE } from '../shared/io/sockets/types/socket-client-message';

/**
 * @class
 * @name SocketServer
 *
 * @description
 * Wrapper for SocketIO.Server
 */
export class SocketServerWrapper {
  private socketServer: SocketIO.Server;

  /**
   * @constructor
   *
   * @param httpServerContainer
   */
  public constructor(httpServerContainer: HttpServerContainer) {
    this.socketServer = io(httpServerContainer.httpServer);
  }

  private bindStuff = () => {
    this.socketServer.on(SOCKET_SERVER_EVENT.CONNECTION, (socket: io.Socket) => {
      const socketClient = new ClientSocketWrapper(socket);

      // allow
      // socketClient.on(SOCKET_CLIENT_MESSAGE_TYPE.ATTEMPT_JOIN_ROOM, payload => {
      //   payload.room_id;
      // });
    });
  };

  // private bind = () => {

  // }
}
