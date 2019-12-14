import { AuthSrvSocketIOServerSocket } from '../shared/ts/auth-service/messages/overrides/auth-srv-socket.io.socket';

declare global {
  namespace SocketIO {
    interface Socket extends AuthSrvSocketIOServerSocket {}
  }
}
