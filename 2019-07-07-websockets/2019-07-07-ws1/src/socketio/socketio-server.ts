/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server as HttpServer, createServer as createHttpServer, IncomingMessage, ServerResponse } from 'http';
import SocketIo from 'socket.io';
import { createReadStream } from 'fs';
import { resolve } from 'path';

// http server

export const runSocketIoServer = () => {
  const HTTP_SERVER_PORT = 3000;

  const httpServer = createHttpServer((req: IncomingMessage, res: ServerResponse) => {
    console.log('[httpServer:createHttpServer]');
    const htmlFile = resolve(__dirname, 'socket-io-client.html');
    console.log('[httpServer:createHttpServer:resolve]', htmlFile);
    createReadStream(htmlFile)
      .pipe(res)
      .end();
  });

  httpServer.listen(HTTP_SERVER_PORT, () => {
    console.log('[httpServer:listen]', `Server listening at port ${HTTP_SERVER_PORT}`);
  });

  // socket server (wraps http server)

  const socketServer = SocketIo(httpServer);

  const SOCKET_IO_SERVER_EVENTS = {
    CONNECTION: 'connection',
    CONNECT: 'connect',
  } as const;

  const SOCKET_IO_OUTGOING_SERVER_MESSAGES = {
    NEW_MESSAGE: 'new message',
    ADD_USER: 'add user',
    LOGIN: 'login',
    USER_JOINED: 'user joined',
    TYPING: 'typing',
    STOP_TYPING: 'stop typing',
    USER_LEFT: 'user left',
  } as const;

  const SOCKET_IO_INCOMING_CLIENT_MESSAGES = {
    NEW_MESSAGE: 'new message',
    ADD_USER: 'add user',
    LOGIN: 'login',
    TYPING: 'typing',
    STOP_TYPING: 'stop typing',
    DISCONNECT: 'disconnect',
  } as const;

  // Chatroom
  let userCount = 0;

  socketServer.on(SOCKET_IO_SERVER_EVENTS.CONNECTION, (socket: SocketIo.Socket) => {
    let userHasBeenAdded = false;

    socket.on(SOCKET_IO_INCOMING_CLIENT_MESSAGES.NEW_MESSAGE, data => {
      socket.broadcast.emit(SOCKET_IO_OUTGOING_SERVER_MESSAGES.NEW_MESSAGE, {
        // TODO: add username to socket
        username: (socket as any).username,
        message: data,
      });
    });

    socket.on(SOCKET_IO_INCOMING_CLIENT_MESSAGES.ADD_USER, (username: string) => {
      if (userHasBeenAdded) return;

      // store username in socket session for the client
      // TODO: add username
      (socket as any).username = username;
      ++userCount;
      userHasBeenAdded = true;
      socket.emit('login', {});

      socket.broadcast.emit(SOCKET_IO_OUTGOING_SERVER_MESSAGES.USER_JOINED, {
        username: (socket as any).username,
        userCount,
      });
    });

    socket.on(SOCKET_IO_INCOMING_CLIENT_MESSAGES.TYPING, () => {
      socket.broadcast.emit(SOCKET_IO_OUTGOING_SERVER_MESSAGES.TYPING, {
        username: (socket as any).username,
      });
    });

    socket.on(SOCKET_IO_INCOMING_CLIENT_MESSAGES.STOP_TYPING, () => {
      socket.broadcast.emit(SOCKET_IO_OUTGOING_SERVER_MESSAGES.STOP_TYPING, {
        username: (socket as any).username,
      });
    });

    socket.on(SOCKET_IO_INCOMING_CLIENT_MESSAGES.DISCONNECT, () => {
      if (userHasBeenAdded) --userCount;

      socket.broadcast.emit(SOCKET_IO_OUTGOING_SERVER_MESSAGES.USER_LEFT, {
        username: (socket as any).username,
        userCount,
      });
    });
  });

  return { socketServer, httpServer };
};
