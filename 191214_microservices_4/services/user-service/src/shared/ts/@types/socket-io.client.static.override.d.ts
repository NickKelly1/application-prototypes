declare global {
  interface SocketIOClientStatic {
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
}

export {};
