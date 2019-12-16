import { AN_AUTH_SVC_SERVER_MSG } from '../auth-svc-server.msg';
import { IAuthSVCMsg } from '../auth-svc.msg.interface';
import { SVC_MSG } from '../../../constants/svc-msg.constant';

// interface AuthSVCSocketIOServerSocket {
//   // server -> client
//   emit(event: SVC_MSG['AUTH'], payload: AN_AUTH_SVC_SERVER_MSG): any
//   emit(event: SVC_MSG['CONFIRMED'], payload: IAuthSVCMsg['uuid']): any

//   // client -> server
//   on(event: SVC_MSG['AUTH'], listener: (payload: AN_AUTH_SVC_SERVER_MSG) => any): any
//   once(event: SVC_MSG['AUTH'], listener: (payload: AN_AUTH_SVC_SERVER_MSG) => any): any
//   addEventListener(event: SVC_MSG['AUTH'], listener: (payload: AN_AUTH_SVC_SERVER_MSG) => any): any
//   off(event: SVC_MSG['AUTH'], listener: (payload: AN_AUTH_SVC_SERVER_MSG) => any): any
// }

declare namespace global {
  namespace SocketIO {
    interface Socket {
      sup(): {};
      // server -> client
      emit(event: SVC_MSG['AUTH'], payload: AN_AUTH_SVC_SERVER_MSG): any
      emit(event: SVC_MSG['CONFIRMED'], payload: IAuthSVCMsg['uuid']): any

      // client -> server
      on(event: SVC_MSG['AUTH'], listener: (payload: AN_AUTH_SVC_SERVER_MSG) => any): any
      once(event: SVC_MSG['AUTH'], listener: (payload: AN_AUTH_SVC_SERVER_MSG) => any): any
      addEventListener(event: SVC_MSG['AUTH'], listener: (payload: AN_AUTH_SVC_SERVER_MSG) => any): any
      off(event: SVC_MSG['AUTH'], listener: (payload: AN_AUTH_SVC_SERVER_MSG) => any): any
    }
  }
}

declare namespace SocketIO {
  interface Socket {
    sup(): {};
    // server -> client
    emit(event: SVC_MSG['AUTH'], payload: AN_AUTH_SVC_SERVER_MSG): any
    emit(event: SVC_MSG['CONFIRMED'], payload: IAuthSVCMsg['uuid']): any

    // client -> server
    on(event: SVC_MSG['AUTH'], listener: (payload: AN_AUTH_SVC_SERVER_MSG) => any): any
    once(event: SVC_MSG['AUTH'], listener: (payload: AN_AUTH_SVC_SERVER_MSG) => any): any
    addEventListener(event: SVC_MSG['AUTH'], listener: (payload: AN_AUTH_SVC_SERVER_MSG) => any): any
    off(event: SVC_MSG['AUTH'], listener: (payload: AN_AUTH_SVC_SERVER_MSG) => any): any
  }
}

// export {}
