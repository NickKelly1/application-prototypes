import { A_SOCKET_TYPE } from "../constants/socket-type.constant";
import { Socket } from 'socket.io';

declare global {
  namespace Express {
    interface Request {
      // TODO
    }
  }

  namespace SocketIO {
    interface Socket {
      type: A_SOCKET_TYPE,
    }
  }
}

export {};
