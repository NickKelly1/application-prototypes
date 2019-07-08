import { Socket, createServer as createSocketServer, Server as SocketServer } from 'net';
import { createServer as createHttpServer, Server as HttpServer, IncomingMessage, ServerResponse } from 'http';

const { stdin, stdout } = process;

const HTTP_SERVER_PORT = 8000;
const SOCKET_SERVER_PORT = 8001;

const SERVER_HOST = '127.0.0.1';

/**
 * @description
 * Start a http server
 *
 * @param port
 * @param host
 */
const startHttpServer = (port: number, host: string) => {
  if (typeof port !== 'number' || port <= 0) throw new TypeError(`Invalid port "${port}"`);
  if (typeof host !== 'string' || host.trim() === '') throw new TypeError(`Invalid host "${host}"`);

  const httpServer: HttpServer = createHttpServer((req: IncomingMessage, res: ServerResponse) => {
    res.end('hello world');
  });
  httpServer.listen(port, host, () => {
    console.log(`[httpServer:listen] http server listening on ${port}`);
  });

  return httpServer;
};

/**
 * @description
 * Start a socket server
 *
 * @param port
 * @param host
 */
const startSocketServer = (port: number, host: string) => {
  if (typeof port !== 'number' || port <= 0) throw new TypeError(`Invalid port "${port}"`);
  if (typeof host !== 'string' || host.trim() === '') throw new TypeError(`Invalid host "${host}"`);

  const socketServer: SocketServer = createSocketServer((socket: Socket) => {
    socket.on('connect', () => {
      console.log('[socket:connect] sending Echo server\\r\\n');
      socket.write('Echo server\r\n');
      // Output back what comes into the socket
      socket.pipe(socket);
    });
  });

  socketServer.listen(port, host, () => {
    console.log('[socketServer:listen] socket server listening on 8001');
  });

  return socketServer;
};

/**
 * @description
 * Start a socket client
 *
 * @param port
 * @param host
 */
const startClient = (port: number, host: string) => {
  if (typeof port !== 'number' || port <= 0) throw new TypeError(`Invalid port "${port}"`);
  if (typeof host !== 'string' || host.trim() === '') throw new TypeError(`Invalid host "${host}"`);

  const client = new Socket();
  client.connect(port, host, () => {
    console.log('[client:connected]');
    client.write('Hello, server! Love, Client.');
  });

  client.on('data', (data: Buffer) => {
    console.log(`[client:data] Received: ${data}`);
    // kill client after server's response
    client.destroy();
  });

  client.on('close', () => {
    console.log('[client:close] connection closed');
  });

  return client;
};

/**
 * @description
 * Run the application
 */
export const run = () => {
  const httpServer = startHttpServer(HTTP_SERVER_PORT, SERVER_HOST);
  const socketServer = startSocketServer(SOCKET_SERVER_PORT, SERVER_HOST);
  const client = startClient(SOCKET_SERVER_PORT, SERVER_HOST);

  return { httpServer, socketServer, client };
};
