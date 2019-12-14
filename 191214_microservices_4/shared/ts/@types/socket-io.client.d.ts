import { AN_AUTH_SRV_SERVER_MSG } from "../auth-service/messages/auth-srv-server.msg";
import { IAuthSrvMsg } from "../auth-service/messages/auth-srv.msg.interface";

declare global {
  namespace SocketIOClient {
    interface SocketIOStatic {
      on(event: 'connect', listener: () => any): any
      on(event: 'connect_error', listener: () => any): any
      on(event: 'connect_timeout', listener: () => any): any
      on(event: 'reconnect', listener: () => any): any
      on(event: 'reconnect_attempt', listener: () => any): any
      on(event: 'reconnecting', listener: () => any): any
      on(event: 'reconnect_error', listener: () => any): any
      on(event: 'reconnect_failed', listener: () => any): any

      once(event: 'connect', listener: () => any): any
      once(event: 'connect_error', listener: () => any): any
      once(event: 'connect_timeout', listener: () => any): any
      once(event: 'reconnect', listener: () => any): any
      once(event: 'reconnect_attempt', listener: () => any): any
      once(event: 'reconnecting', listener: () => any): any
      once(event: 'reconnect_error', listener: () => any): any
      once(event: 'reconnect_failed', listener: () => any): any

      off(event: 'connect', listener: () => any): any
      off(event: 'connect_error', listener: () => any): any
      off(event: 'connect_timeout', listener: () => any): any
      off(event: 'reconnect', listener: () => any): any
      off(event: 'reconnect_attempt', listener: () => any): any
      off(event: 'reconnecting', listener: () => any): any
      off(event: 'reconnect_error', listener: () => any): any
      off(event: 'reconnect_failed', listener: () => any): any
    }

    interface Socket {
      on(event: 'connect', listener: () => any): any,
      on(event: 'error', listener: () => any): any,
      on(event: 'disconnect', listener: () => any): any,
      on(event: 'reconnect', listener: () => any): any,
      on(event: 'reconnect_attempt', listener: () => any): any,
      on(event: 'reconnecting', listener: () => any): any,
      on(event: 'reconnect_error', listener: () => any): any,
      on(event: 'reconnect_failed', listener: () => any): any,

      once(event: 'connect', listener: () => any): any,
      once(event: 'error', listener: () => any): any,
      once(event: 'disconnect', listener: () => any): any,
      once(event: 'reconnect', listener: () => any): any,
      once(event: 'reconnect_attempt', listener: () => any): any,
      once(event: 'reconnecting', listener: () => any): any,
      once(event: 'reconnect_error', listener: () => any): any,
      once(event: 'reconnect_failed', listener: () => any): any,

      off(event: 'connect', listener: () => any): any,
      off(event: 'error', listener: () => any): any,
      off(event: 'disconnect', listener: () => any): any,
      off(event: 'reconnect', listener: () => any): any,
      off(event: 'reconnect_attempt', listener: () => any): any,
      off(event: 'reconnecting', listener: () => any): any,
      off(event: 'reconnect_error', listener: () => any): any,
      off(event: 'reconnect_failed', listener: () => any): any,

      // messages
      on(event: 'message', listener: (payload: AN_AUTH_SRV_SERVER_MSG) => any): any
      once(event: 'message', listener: (payload: AN_AUTH_SRV_SERVER_MSG) => any): any
      addEventListener(event: 'message', listener: (payload: AN_AUTH_SRV_SERVER_MSG) => any): any
      off(event: 'message', listener: (payload: AN_AUTH_SRV_SERVER_MSG) => any): any

      on(event: 'message-confirmed', listener: (payload: IAuthSrvMsg['uuid']) => any): any
      once(event: 'message-confirmed', listener: (payload: IAuthSrvMsg['uuid']) => any): any
      addEventListener(event: 'message-confirmed', listener: (payload: IAuthSrvMsg['uuid']) => any): any
      off(event: 'message-confirmed', listener: (payload: IAuthSrvMsg['uuid']) => any): any
    }
  }
}

export {}