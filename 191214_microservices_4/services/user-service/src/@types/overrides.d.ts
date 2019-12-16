import { AuthSVCSocketIOServerSocket } from '../shared/ts/auth-service/messages/overrides/auth-svc-socket.io.socket';

declare global {
  namespace SocketIO {
    interface Socket extends AuthSVCSocketIOServerSocket {}
  }
}
