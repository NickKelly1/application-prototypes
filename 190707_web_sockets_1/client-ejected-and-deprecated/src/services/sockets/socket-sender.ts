  const SOCKET_IO_CLIENT_MESSAGES = {
    NEW_MESSAGE: "new message",
    ADD_USER: "add user",
    LOGIN: "login",
    TYPING: "typing",
    STOP_TYPING: "stop typing",
    DISCONNECT: "disconnect"
  } as const;

export class SocketSender {
  private socket: SocketIOClient.Socket;

  constructor(socket: SocketIOClient.Socket) {
    this.socket = socket;
  }
}

