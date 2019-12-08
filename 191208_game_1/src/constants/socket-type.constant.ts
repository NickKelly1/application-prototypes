export const SOCKET_TYPE = {
  UNKNOWN: 'unknown',
  PLAYER: 'player',
} as const;
export type SOCKET_TYPE = typeof SOCKET_TYPE;
export type A_SOCKET_TYPE = SOCKET_TYPE[keyof SOCKET_TYPE];
