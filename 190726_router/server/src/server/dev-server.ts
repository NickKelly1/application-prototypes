import http from 'http';
import express from 'express';
import socketIo from 'socket.io';
import { SocketWrapper } from '../web-sockets/wrappers/socket-wrapper';

export const SOCKET_SERVER_EVENT = {
  CONNECTION: 'connection',
} as const;
export type SOCKET_SERVER_EVENT = typeof SOCKET_SERVER_EVENT;

interface DevServerOptions {
  httpPort: number;
}

/**
 * @class
 * @name DevServer
 */
class DevServer {
  private expressApp: express.Express;
  private httpServer: http.Server;
  private socketServer: socketIo.Server;
  private options: DevServerOptions;

  private socketConnections: Set<SocketWrapper> = new Set();

  /**
   * @constructor
   *
   * @param expressApp
   * @param httpServer
   * @param socketServer
   * @param options
   */
  public constructor(
    expressApp: express.Express,
    httpServer: http.Server,
    socketServer: socketIo.Server,
    options: DevServerOptions,
  ) {
    this.expressApp = expressApp;
    this.httpServer = httpServer;
    this.socketServer = socketServer;
    this.options = options;

    // start http server
    this.httpServer.listen(options.httpPort, () => {
      console.log(`dev server listening on *:${options.httpPort}`);
    });

    // start socket server
    this.socketServer.on('connection', (rawClient: socketIo.Socket) => {
      const client = new SocketWrapper(rawClient);
      this.socketConnections.add(client);

      client.on('disconnect', () => {
        this.socketConnections.delete(client);
      });
    });

    // register http routes
  }
}

export const createDevServer = async (port: number) => {
  const expressApp = express();
  const httpServer = http.createServer(expressApp);
  const socketServer = socketIo(httpServer);
  return new DevServer(expressApp, httpServer, socketServer, { httpPort: port });
};
