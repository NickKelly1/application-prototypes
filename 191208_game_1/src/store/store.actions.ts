import { Player } from "../resources/player.entity";

export const MASTER_ACTION_TYPE = {
  CONNECT_SOCKET: 'connect_socket',
  DISCONNECT_SOCKET: 'disconnect_socket',
  REGISTER_PLAYER: 'register_player',
  REGISTRATION_FAILED: 'registration_failed',
  NOOP: 'noop',
} as const;
export type MASTER_ACTION_TYPE = typeof MASTER_ACTION_TYPE;
export type A_MASTER_ACTION_TYPE = MASTER_ACTION_TYPE[keyof MASTER_ACTION_TYPE];

export interface MasterActionMap {
  [MASTER_ACTION_TYPE.CONNECT_SOCKET]: { type: MASTER_ACTION_TYPE['CONNECT_SOCKET'], payload: { socket: SocketIO.Socket } };
  [MASTER_ACTION_TYPE.DISCONNECT_SOCKET]: { type: MASTER_ACTION_TYPE['DISCONNECT_SOCKET'], payload: { socket: SocketIO.Socket } };
  [MASTER_ACTION_TYPE.REGISTER_PLAYER]: { type: MASTER_ACTION_TYPE['REGISTER_PLAYER'], payload: { player: Player } };
  [MASTER_ACTION_TYPE.REGISTRATION_FAILED]: { type: MASTER_ACTION_TYPE['REGISTRATION_FAILED'], payload: { socket: SocketIO.Socket } };
  [MASTER_ACTION_TYPE.NOOP]: { type: MASTER_ACTION_TYPE['NOOP'], payload?: undefined },
}

export const NOOP: MasterActionMap[MASTER_ACTION_TYPE['NOOP']] = { type: MASTER_ACTION_TYPE.NOOP } as const;
export type NOOP = typeof NOOP;

export type MasterAction = MasterActionMap[keyof MasterActionMap];
