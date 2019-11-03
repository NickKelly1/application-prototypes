import * as ioTs from 'io-ts';
import { useDecoder, UnionFromCodecMap } from 'io-ts-helpers';
import { ifRight } from 'fp-ts-helpers';
import { remapMessage, MessageValidatorMap } from './SOCKET_MESSAGES';



const CLIENT_MESSAGE_TYPE = {
  get CREATE_ORDER() { return 'CREATE_ORDER' as const; },
  get UPDATE_ORDER() { return 'UPDATE_ORDER' as const; },
  get DELETE_ORDER() { return 'DELETE_ORDER' as const; },
  get PING() { return 'PING' as const; },
  get PONG() { return 'PONG' as const; },
} as const;
export type CLIENT_MESSAGE_TYPE = typeof CLIENT_MESSAGE_TYPE;



const CLIENT_MESSAGE_CODEC_MAP = {
  [CLIENT_MESSAGE_TYPE.CREATE_ORDER]: ioTs.type({
    name: ioTs.string,
    amount: ioTs.number,
  }),
  [CLIENT_MESSAGE_TYPE.UPDATE_ORDER]: ioTs.intersection([
    ioTs.type({ id: ioTs.string, }),
    ioTs.partial({
      name: ioTs.string,
      amount: ioTs.number,
    }),
  ]),
  [CLIENT_MESSAGE_TYPE.DELETE_ORDER]: ioTs.type({ id: ioTs.string, }),
  [CLIENT_MESSAGE_TYPE.PING]: ioTs.type({}),
  [CLIENT_MESSAGE_TYPE.PONG]: ioTs.type({}),
} as const;
type CLIENT_MESSAGE_PAYLOADS = UnionFromCodecMap<typeof CLIENT_MESSAGE_CODEC_MAP>;



export type CLIENT_MESSAGE = { [K in keyof CLIENT_MESSAGE_PAYLOADS]: { type: K; payload: CLIENT_MESSAGE_PAYLOADS[K] } }[keyof CLIENT_MESSAGE_PAYLOADS]
export const CLIENT_MESSAGES = { TYPE: CLIENT_MESSAGE_TYPE, CODEC: CLIENT_MESSAGE_CODEC_MAP } as const;



type RSA = Record<string, any>
export const CLIENT_MESSAGE_VALIDATOR_MAP: MessageValidatorMap<CLIENT_MESSAGE> = {
  [CLIENT_MESSAGES.TYPE.CREATE_ORDER]: (p: RSA) => ifRight(useDecoder(CLIENT_MESSAGES.CODEC.CREATE_ORDER.decode)(p))(remapMessage(CLIENT_MESSAGES.TYPE.CREATE_ORDER)),
  [CLIENT_MESSAGES.TYPE.UPDATE_ORDER]: (p: RSA) => ifRight(useDecoder(CLIENT_MESSAGES.CODEC.UPDATE_ORDER.decode)(p))(remapMessage(CLIENT_MESSAGES.TYPE.UPDATE_ORDER)),
  [CLIENT_MESSAGES.TYPE.DELETE_ORDER]: (p: RSA) => ifRight(useDecoder(CLIENT_MESSAGES.CODEC.DELETE_ORDER.decode)(p))(remapMessage(CLIENT_MESSAGES.TYPE.DELETE_ORDER)),
  [CLIENT_MESSAGES.TYPE.PING]: (p: RSA) => ifRight(useDecoder(CLIENT_MESSAGES.CODEC.PING.decode)(p))(remapMessage(CLIENT_MESSAGES.TYPE.PING)),
  [CLIENT_MESSAGES.TYPE.PONG]: (p: RSA) => ifRight(useDecoder(CLIENT_MESSAGES.CODEC.PONG.decode)(p))(remapMessage(CLIENT_MESSAGES.TYPE.PONG)),
} as const;
