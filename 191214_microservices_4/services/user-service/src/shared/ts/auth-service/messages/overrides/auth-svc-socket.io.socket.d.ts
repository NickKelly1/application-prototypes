import { AN_AUTH_SVC_SERVER_MSG } from '../auth-svc-server.msg';
import { IAuthSVCMsg } from '../auth-svc.msg.interface';

export interface AuthSVCSocketIOServerSocket {
  // server -> client
  emit(event: 'message', payload: AN_AUTH_SVC_SERVER_MSG): any
  emit(event: 'message-confirmed', payload: IAuthSVCMsg['uuid']): any

  // client -> server
  on(event: 'message', listener: (payload: AN_AUTH_SVC_SERVER_MSG) => any): any
  once(event: 'message', listener: (payload: AN_AUTH_SVC_SERVER_MSG) => any): any
  addEventListener(event: 'message', listener: (payload: AN_AUTH_SVC_SERVER_MSG) => any): any
  off(event: 'message', listener: (payload: AN_AUTH_SVC_SERVER_MSG) => any): any
}
