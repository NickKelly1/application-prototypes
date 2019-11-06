import { SocketWrapper, SERVER_MESSAGE, CLIENT_MESSAGE } from '@nick-kelly/microservices-prototype-messages';

export type CONNECTION_STATE_UNINITIALISED= { mode: 'uninitialised'; connect(): CONNECTION_STATE_CONNECTED };
export type CONNECTION_STATE_DISCONNECTED= { mode: 'disconnected'; connect(): CONNECTION_STATE_CONNECTED };
export type CONNECTION_STATE_CONNECTED= { mode: 'connected'; disconnect(): CONNECTION_STATE_DISCONNECTED; server: SocketWrapper<SERVER_MESSAGE, CLIENT_MESSAGE> };
export type CONNECTION_STATE_INVALID= { mode: 'invalid' };

export type ConnectionState =
  CONNECTION_STATE_UNINITIALISED
  | CONNECTION_STATE_DISCONNECTED
  | CONNECTION_STATE_CONNECTED
  | CONNECTION_STATE_INVALID