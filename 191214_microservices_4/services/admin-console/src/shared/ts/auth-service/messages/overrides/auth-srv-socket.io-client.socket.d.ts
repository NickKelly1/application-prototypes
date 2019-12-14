import { AN_AUTH_SRV_SERVER_MSG } from "../auth-srv-server.msg";
import { IAuthSrvMsg } from "../auth-srv.msg.interface";
import { AN_AUTH_SRV_CLIENT_MSG } from "../auth-srv-client.msg";

/**
 * May be appended to the SocketIOClient.Socket class in a service consuming the AuthService's sockets
 */
export interface AuthSrvSocketIOClientSocket {
  // client -> server
  emit(event: 'message', payload: AN_AUTH_SRV_CLIENT_MSG): any

  // server -> client
  on(event: 'message', listener: (payload: AN_AUTH_SRV_SERVER_MSG) => any): any
  once(event: 'message', listener: (payload: AN_AUTH_SRV_SERVER_MSG) => any): any
  addEventListener(event: 'message', listener: (payload: AN_AUTH_SRV_SERVER_MSG) => any): any
  off(event: 'message', listener: (payload: AN_AUTH_SRV_SERVER_MSG) => any): any

  on(event: 'message-confirmed', listener: (payload: IAuthSrvMsg['uuid']) => any): any
  once(event: 'message-confirmed', listener: (payload: IAuthSrvMsg['uuid']) => any): any
  addEventListener(event: 'message-confirmed', listener: (payload: IAuthSrvMsg['uuid']) => any): any
  off(event: 'message-confirmed', listener: (payload: IAuthSrvMsg['uuid']) => any): any
}
