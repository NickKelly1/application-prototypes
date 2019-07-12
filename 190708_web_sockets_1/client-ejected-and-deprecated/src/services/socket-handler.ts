import io from 'socket.io-client';
import { SocketReceiver } from './sockets/socket-receiver';
import { SocketSender } from './sockets/socket-sender';

export class SocketHandler {
  private receiver: SocketReceiver;
  private sender: SocketSender;

  constructor(socket: SocketIOClient.Socket) {
    this.receiver = new SocketReceiver(socket);
    this.sender = new SocketSender(socket);
  }
}

const socket = io('http://localhost');

  const SOCKET_IO_CLIENT_EVENTS = {
    CONNECTION: "connection",
    CONNECT: "connect"
  } as const;


const socketHandler = {
  
}
