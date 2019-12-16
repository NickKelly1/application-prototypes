// /**
//  * General override
//  *
//  * May be appended to the SocketIOClient.Socket interface in a service
//  *
//  * these are guestimations, not a source of truth
//  */
// export interface SocketIOClientSocketOverride {
//   on(event: 'connect', listener: () => any): any,
//   on(event: 'error', listener: () => any): any,
//   on(event: 'disconnect', listener: () => any): any,
//   on(event: 'reconnect', listener: () => any): any,
//   on(event: 'reconnect_attempt', listener: () => any): any,
//   on(event: 'reconnecting', listener: () => any): any,
//   on(event: 'reconnect_error', listener: () => any): any,
//   on(event: 'reconnect_failed', listener: () => any): any,

//   once(event: 'connect', listener: () => any): any,
//   once(event: 'error', listener: () => any): any,
//   once(event: 'disconnect', listener: () => any): any,
//   once(event: 'reconnect', listener: () => any): any,
//   once(event: 'reconnect_attempt', listener: () => any): any,
//   once(event: 'reconnecting', listener: () => any): any,
//   once(event: 'reconnect_error', listener: () => any): any,
//   once(event: 'reconnect_failed', listener: () => any): any,

//   off(event: 'connect', listener: () => any): any,
//   off(event: 'error', listener: () => any): any,
//   off(event: 'disconnect', listener: () => any): any,
//   off(event: 'reconnect', listener: () => any): any,
//   off(event: 'reconnect_attempt', listener: () => any): any,
//   off(event: 'reconnecting', listener: () => any): any,
//   off(event: 'reconnect_error', listener: () => any): any,
//   off(event: 'reconnect_failed', listener: () => any): any,
// }

declare module global {
  namespace SocketIOClient {
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
    }
  }
}

// export {};
