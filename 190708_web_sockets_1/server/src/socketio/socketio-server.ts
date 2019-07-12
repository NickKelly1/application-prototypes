/* eslint-disable @typescript-eslint/no-explicit-any */
import http from 'http';
import SocketIo from 'socket.io';
import { createReadStream, readFileSync } from 'fs';
import { resolve } from 'path';
import {
  SOCKET_IO_SERVER_EVENTS,
  SOCKET_IO_CLIENT_MESSAGE,
  SOCKET_IO_SERVER_MESSAGE,
  ServerSocket,
} from '../shared/messages';

export const runSocketIoServer = () => {
  const HTTP_SERVER_PORT = 3000;

  const httpServer = http.createServer();

  httpServer.listen(HTTP_SERVER_PORT, () => {
    console.log('[httpServer:listen]', `Server listening at port ${HTTP_SERVER_PORT}`);
  });

  const socketServer = SocketIo(httpServer);

  // Chatroom
  let userCount = 0;

  socketServer.on(SOCKET_IO_SERVER_EVENTS.CONNECTION, (socket: ServerSocket<SocketIO.Socket>) => {
    let userHasBeenAdded = false;

    socket.on(SOCKET_IO_CLIENT_MESSAGE.NEW_MESSAGE, data => {
      socket.broadcast.emit(SOCKET_IO_SERVER_MESSAGE.NEW_MESSAGE, {
        // TODO: add username to socket
        username: (socket as any).username,
        message: data,
      });
    });

    socket.on(SOCKET_IO_CLIENT_MESSAGE.ADD_USER, (username: string) => {
      if (userHasBeenAdded) return;

      // store username in socket session for the client
      // TODO: add username
      (socket as any).username = username;
      ++userCount;
      userHasBeenAdded = true;
      socket.emit('login', {});

      socket.broadcast.emit(SOCKET_IO_SERVER_MESSAGE.USER_JOINED, {
        username: (socket as any).username,
        userCount,
      });
    });

    socket.on(SOCKET_IO_CLIENT_MESSAGE.TYPING, () => {
      socket.broadcast.emit(SOCKET_IO_SERVER_MESSAGE.TYPING, {
        username: (socket as any).username,
      });
    });

    socket.on(SOCKET_IO_CLIENT_MESSAGE.STOP_TYPING, () => {
      socket.broadcast.emit(SOCKET_IO_SERVER_MESSAGE.STOP_TYPING, {
        username: (socket as any).username,
      });
    });

    socket.on(SOCKET_IO_CLIENT_MESSAGE.DISCONNECT, () => {
      if (userHasBeenAdded) --userCount;

      socket.broadcast.emit(SOCKET_IO_SERVER_MESSAGE.USER_LEFT, {
        username: (socket as any).username,
        userCount,
      });
    });
  });

  return { socketServer, httpServer };
};
