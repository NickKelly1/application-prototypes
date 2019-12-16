import { AN_AUTH_SVC_SERVER_MSG } from "../auth-svc-server.msg";
import { IAuthSVCMsg } from "../auth-svc.msg.interface";
import { AN_AUTH_SVC_CLIENT_MSG } from "../auth-svc-client.msg";
import { SVC_MSG } from "../../../constants/svc-msg.constant";

export interface AuthSVCException {
  status: 'error' | string,
  message: 'Internal server error' | string,
}

// /**
//  * May be appended to the SocketIOClient.Socket class in a service consuming the AuthService's sockets
//  */
// export interface AuthSVCSocketIOClientSocket {
//   // client -> server
//   emit(event: SVC_MSG['AUTH'], payload: AN_AUTH_SVC_CLIENT_MSG): any

//   // server -> client

//   // by framework
//   on(event: 'exception', listener: (payload: AuthSVCException) => any): any
//   once(event: 'exception', listener: (payload: AuthSVCException) => any): any
//   addEventListener(event: 'exception', listener: (payload: AuthSVCException) => any): any
//   off(event: 'exception', listener: (payload: AuthSVCException) => any): any

//   // by application
//   on(event: SVC_MSG['AUTH'], listener: (payload: AN_AUTH_SVC_SERVER_MSG) => any): any
//   once(event: SVC_MSG['AUTH'], listener: (payload: AN_AUTH_SVC_SERVER_MSG) => any): any
//   addEventListener(event: SVC_MSG['AUTH'], listener: (payload: AN_AUTH_SVC_SERVER_MSG) => any): any
//   off(event: SVC_MSG['AUTH'], listener: (payload: AN_AUTH_SVC_SERVER_MSG) => any): any

//   on(event: SVC_MSG['CONFIRMED'], listener: (payload: IAuthSVCMsg['uuid']) => any): any
//   once(event: SVC_MSG['CONFIRMED'], listener: (payload: IAuthSVCMsg['uuid']) => any): any
//   addEventListener(event: SVC_MSG['CONFIRMED'], listener: (payload: IAuthSVCMsg['uuid']) => any): any
//   off(event: SVC_MSG['CONFIRMED'], listener: (payload: IAuthSVCMsg['uuid']) => any): any
// }

declare module global {
  namespace SocketIOClient {
    interface Socket {
      // client -> server
      emit(event: SVC_MSG['AUTH'], payload: AN_AUTH_SVC_CLIENT_MSG): any

      // server -> client

      // by framework
      on(event: SVC_MSG['EXCEPTION'], listener: (payload: AuthSVCException) => any): any
      once(event: SVC_MSG['EXCEPTION'], listener: (payload: AuthSVCException) => any): any
      addEventListener(event: SVC_MSG['EXCEPTION'], listener: (payload: AuthSVCException) => any): any
      off(event: SVC_MSG['EXCEPTION'], listener: (payload: AuthSVCException) => any): any

      // by application
      on(event: SVC_MSG['AUTH'], listener: (payload: AN_AUTH_SVC_SERVER_MSG) => any): any
      once(event: SVC_MSG['AUTH'], listener: (payload: AN_AUTH_SVC_SERVER_MSG) => any): any
      addEventListener(event: SVC_MSG['AUTH'], listener: (payload: AN_AUTH_SVC_SERVER_MSG) => any): any
      off(event: SVC_MSG['AUTH'], listener: (payload: AN_AUTH_SVC_SERVER_MSG) => any): any

      on(event: SVC_MSG['CONFIRMED'], listener: (payload: IAuthSVCMsg['uuid']) => any): any
      once(event: SVC_MSG['CONFIRMED'], listener: (payload: IAuthSVCMsg['uuid']) => any): any
      addEventListener(event: SVC_MSG['CONFIRMED'], listener: (payload: IAuthSVCMsg['uuid']) => any): any
      off(event: SVC_MSG['CONFIRMED'], listener: (payload: IAuthSVCMsg['uuid']) => any): any
    }
  }
}

// export {};