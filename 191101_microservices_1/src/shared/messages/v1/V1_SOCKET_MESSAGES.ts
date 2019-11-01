import * as ioTs from 'io-ts';

const V1_SOCKET_MESSAGE_NAMES = {
  get CREATE_ORDER() { return 'CREATE_ORDER' as const; },
  get UPDATE_ORDER() { return 'UPDATE_ORDER' as const; },
  get DELETE_ORDER() { return 'DELETE_ORDER' as const; },
} as const;
export type V1_SOCKET_MESSAGE_NAMES = typeof V1_SOCKET_MESSAGE_NAMES;

const V1_SOCKET_MESSAGE_CODECS = {
  [V1_SOCKET_MESSAGE_NAMES.CREATE_ORDER]: ioTs.type({
    name: ioTs.string,
    amount: ioTs.number,
  }),
  [V1_SOCKET_MESSAGE_NAMES.UPDATE_ORDER]: ioTs.type({
    id: ioTs.string,
    name: ioTs.union([ioTs.undefined, ioTs.string]),
    amount: ioTs.union([ioTs.undefined, ioTs.number]),
  }),
} as const;
type V1_SOCKET_MESSAGE_PAYLOADS = {[K in keyof typeof V1_SOCKET_MESSAGE_CODECS]: ioTs.TypeOf<typeof V1_SOCKET_MESSAGE_CODECS[K]>}

export type V1_SOCKET_MESSAGE<K extends keyof V1_SOCKET_MESSAGE_PAYLOADS> = {
  type: K;
  payload: V1_SOCKET_MESSAGE_PAYLOADS[K];
}

export const V1_SOCKET_MESSAGES = {
  NAMES: V1_SOCKET_MESSAGE_NAMES,
  CODECS: V1_SOCKET_MESSAGE_CODECS,
} as const;
