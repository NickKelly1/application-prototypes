import * as ioTs from 'io-ts';
import { useDecoder, UnionFromCodecMap } from 'io-ts-helpers';
import { ifRight } from 'fp-ts-helpers';
import { remapMessage, MessageValidatorMap } from './SOCKET_MESSAGES';


const SERVER_MESSAGE_TYPE = {
  get INIT() { return 'INIT' as const; },
  get ORDER_CREATED() { return 'ORDER_CREATED' as const; },
  get ORDER_UPDATED() { return 'ORDER_UPDATED' as const; },
  get ORDER_DELETED() { return 'ORDER_DELETED' as const; },
  get PING() { return 'PING' as const; },
  get PONG() { return 'PONG' as const; },
} as const;
export type SERVER_MESSAGE_TYPE = typeof SERVER_MESSAGE_TYPE;



const SERVER_MESSAGE_CODEC_MAP = {
  [SERVER_MESSAGE_TYPE.INIT]: ioTs.type({ hello: ioTs.string, }),
  [SERVER_MESSAGE_TYPE.ORDER_CREATED]: ioTs.type({ id: ioTs.string, }),
  [SERVER_MESSAGE_TYPE.ORDER_UPDATED]: ioTs.type({ id: ioTs.string, }),
  [SERVER_MESSAGE_TYPE.ORDER_DELETED]: ioTs.type({ id: ioTs.string, }),
  [SERVER_MESSAGE_TYPE.PING]: ioTs.type({}),
  [SERVER_MESSAGE_TYPE.PONG]: ioTs.type({}),
} as const;
type SERVER_MESSAGE_PAYLOADS = UnionFromCodecMap<typeof SERVER_MESSAGE_CODEC_MAP>;



export type SERVER_MESSAGE = { [K in keyof SERVER_MESSAGE_PAYLOADS]: { type: K; payload: SERVER_MESSAGE_PAYLOADS[K] } }[keyof SERVER_MESSAGE_PAYLOADS]
export const SERVER_MESSAGES = { TYPE: SERVER_MESSAGE_TYPE, CODEC: SERVER_MESSAGE_CODEC_MAP, } as const;



type RSA = Record<string, any>
export const SERVER_MESSAGE_VALIDATOR_MAP: MessageValidatorMap<SERVER_MESSAGE> = {
  [SERVER_MESSAGES.TYPE.INIT]: (p: RSA) => ifRight(useDecoder(SERVER_MESSAGES.CODEC.INIT.decode)(p))(remapMessage(SERVER_MESSAGES.TYPE.INIT)),
  [SERVER_MESSAGES.TYPE.ORDER_CREATED]: (p: RSA) => ifRight(useDecoder(SERVER_MESSAGES.CODEC.ORDER_CREATED.decode)(p))(remapMessage(SERVER_MESSAGES.TYPE.ORDER_CREATED)),
  [SERVER_MESSAGES.TYPE.ORDER_UPDATED]: (p: RSA) => ifRight(useDecoder(SERVER_MESSAGES.CODEC.ORDER_UPDATED.decode)(p))(remapMessage(SERVER_MESSAGES.TYPE.ORDER_UPDATED)),
  [SERVER_MESSAGES.TYPE.ORDER_DELETED]: (p: RSA) => ifRight(useDecoder(SERVER_MESSAGES.CODEC.ORDER_DELETED.decode)(p))(remapMessage(SERVER_MESSAGES.TYPE.ORDER_DELETED)),
  [SERVER_MESSAGES.TYPE.PING]: (p: RSA) => ifRight(useDecoder(SERVER_MESSAGES.CODEC.PING.decode)(p))(remapMessage(SERVER_MESSAGES.TYPE.PING)),
  [SERVER_MESSAGES.TYPE.PONG]: (p: RSA) => ifRight(useDecoder(SERVER_MESSAGES.CODEC.PONG.decode)(p))(remapMessage(SERVER_MESSAGES.TYPE.PONG)),
} as const;
