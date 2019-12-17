import { AN_AUTH_SVC_SERVER_MSG } from "../auth-svc-server.msg";
import { IAuthSVCMsg } from "../auth-svc.msg.interface";
import { SVC_MSG } from "../../../constants/svc-msg.constant";

declare global {
  namespace SocketIO {
    interface Socket {
      // server -> client
      emit(event: SVC_MSG['AUTH_SERVER'], payload: AN_AUTH_SVC_SERVER_MSG): any
      emit(event: SVC_MSG['CONFIRMED'], payload: IAuthSVCMsg['uuid']): any

      // client -> server
      on(event: SVC_MSG['AUTH_CLIENT'], listener: (payload: AN_AUTH_SVC_SERVER_MSG) => any): any
      once(event: SVC_MSG['AUTH_CLIENT'], listener: (payload: AN_AUTH_SVC_SERVER_MSG) => any): any
      addEventListener(event: SVC_MSG['AUTH_CLIENT'], listener: (payload: AN_AUTH_SVC_SERVER_MSG) => any): any
      off(event: SVC_MSG['AUTH_CLIENT'], listener: (payload: AN_AUTH_SVC_SERVER_MSG) => any): any
    }
  }
}

export {}
