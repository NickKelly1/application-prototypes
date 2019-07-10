  const SOCKET_IO_SERVER_MESSAGES = {
    NEW_MESSAGE: "new message",
    ADD_USER: "add user",
    LOGIN: "login",
    USER_JOINED: "user joined",
    TYPING: "typing",
    STOP_TYPING: "stop typing",
    USER_LEFT: "user left"
  } as const;

  export class SocketReceiver {
  private socket: SocketIOClient.Socket;

  constructor(socket: SocketIOClient.Socket) {
    this.socket = socket;
  }

  }

  