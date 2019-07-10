import io from 'socket.io-client';
import { SOCKET_IO_CLIENT_MESSAGES, SOCKET_IO_SERVER_MESSAGES, SocketIoServerMessagePayloads } from '../../shared/messages';

class SocketHandler {
  private socket: SocketIOClient.Socket;

  public constructor(socket: SocketIOClient.Socket) {
    this.socket = socket;
  }

  public [SOCKET_IO_CLIENT_MESSAGES.ADD_USER] = () => {
    //
  };

  /**
   * @description
   * Bind incoming messages to handlers
   */
  private bindIncomingMessages = () => {
    const socket = this.socket;

    socket.on(
      SOCKET_IO_SERVER_MESSAGES.NEW_MESSAGE,
      (payload: SocketIoServerMessagePayloads[SOCKET_IO_SERVER_MESSAGES['NEW_MESSAGE']]) => {
        console.log(`[socket:${SOCKET_IO_SERVER_MESSAGES.NEW_MESSAGE}]`);
      },
    );

    socket.on(SOCKET_IO_SERVER_MESSAGES.ADD_USER, () => {
      console.log(`[socket:${SOCKET_IO_SERVER_MESSAGES.ADD_USER}]`);
    });

    socket.on(SOCKET_IO_SERVER_MESSAGES.LOGIN, () => {
      console.log(`[socket:${SOCKET_IO_SERVER_MESSAGES.LOGIN}]`);
    });

    socket.on(SOCKET_IO_SERVER_MESSAGES.USER_JOINED, () => {
      console.log(`[socket:${SOCKET_IO_SERVER_MESSAGES.USER_JOINED}]`);
    });

    socket.on(SOCKET_IO_SERVER_MESSAGES.TYPING, () => {
      console.log(`[socket:${SOCKET_IO_SERVER_MESSAGES.TYPING}]`);
    });

    socket.on(SOCKET_IO_SERVER_MESSAGES.STOP_TYPING, () => {
      console.log(`[socket:${SOCKET_IO_SERVER_MESSAGES.STOP_TYPING}]`);
    });

    socket.on(SOCKET_IO_SERVER_MESSAGES.USER_LEFT, () => {
      console.log(`[socket:${SOCKET_IO_SERVER_MESSAGES.USER_LEFT}]`);
    });
  };
}

const socket = io('http://localhost');

export const socketHandler = new SocketHandler(socket);

(window as any).socketHandler = socketHandler;
