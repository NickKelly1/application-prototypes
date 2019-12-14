import { AN_AUTH_SRV_SERVER_MSG } from "../auth-srv-server.msg";
import { IAuthSrvMsg } from "../auth-srv.msg.interface";

export interface AuthSrvSocketIOServerSocket {
  // server -> client
  emit(event: 'message', payload: AN_AUTH_SRV_SERVER_MSG): any
  emit(event: 'message-confirmed', payload: IAuthSrvMsg['uuid']): any

  // client -> server
  on(event: 'message', listener: (payload: AN_AUTH_SRV_SERVER_MSG) => any): any
  once(event: 'message', listener: (payload: AN_AUTH_SRV_SERVER_MSG) => any): any
  addEventListener(event: 'message', listener: (payload: AN_AUTH_SRV_SERVER_MSG) => any): any
  off(event: 'message', listener: (payload: AN_AUTH_SRV_SERVER_MSG) => any): any
}
