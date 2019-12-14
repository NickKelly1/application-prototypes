import { SocketIOClientSocketOverride } from '../shared/ts/types/socket-io.client.socket.override';
import { SocketIOClientStaticOverride } from '../shared/ts/types/socket-io.client.static.override';
import { AuthSrvSocketIOClientSocket } from '../shared/ts/auth-service/messages/overrides/auth-srv-socket.io-client.socket';

declare global {
  namespace SocketIOClient {
    interface Socket extends SocketIOClientSocketOverride, AuthSrvSocketIOClientSocket {}
    interface SocketIOClientStatic extends SocketIOClientStaticOverride {}
  }
}

export {};
