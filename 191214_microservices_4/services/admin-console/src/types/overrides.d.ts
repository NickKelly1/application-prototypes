import { SocketIOClientSocketOverride } from '../shared/ts/types/socket-io.client.socket.override';
import { SocketIOClientStaticOverride } from '../shared/ts/types/socket-io.client.static.override';
import { AuthSVCSocketIOClientSocket } from '../shared/ts/auth-service/messages/overrides/auth-svc-socket.io-client.socket';

// TODO: why  isn't this working...
declare global {
  namespace SocketIOClient {
    interface Socket extends SocketIOClientSocketOverride, AuthSVCSocketIOClientSocket {}
    interface SocketIOClientStatic extends SocketIOClientStaticOverride {}
  }
}

export {};
