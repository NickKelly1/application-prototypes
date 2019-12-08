import { A_SOCKET_TYPE } from "../constants/socket-type.constant";
import { Socket } from 'socket.io';
import { MASTER_MESSAGE, MasterMessageMap } from "../shared/master.messages";
import { CLIENT_MESSAGE, ClientMessageMap } from "../shared/client.messages";

interface listener<P> {
  (payload?: P): any;
}

declare global {
  namespace Express {
    interface Request {
      // TODO
    }
  }

  namespace SocketIO {
    interface Socket {
      type: A_SOCKET_TYPE,

      addEventListener(type: CLIENT_MESSAGE['TYPE_TOKEN'], listener: listener<ClientMessageMap[CLIENT_MESSAGE['TYPE_TOKEN']]>): SocketIO.Socket
      on(type: CLIENT_MESSAGE['TYPE_TOKEN'], listener: listener<ClientMessageMap[CLIENT_MESSAGE['TYPE_TOKEN']]>): SocketIO.Socket
      once(type: CLIENT_MESSAGE['TYPE_TOKEN'], listener: listener<ClientMessageMap[CLIENT_MESSAGE['TYPE_TOKEN']]>): SocketIO.Socket

      emit(type: MASTER_MESSAGE['REQUEST_TYPE_TOKEN'], payload?: MasterMessageMap[MASTER_MESSAGE['REQUEST_TYPE_TOKEN']]): SocketIO.Socket;
    }
  }
}

export {};
