import * as ioTs from 'io-ts';
import { AValueOf } from '@syntaxfanatics/peon';
import { io } from 'fp-ts/lib/IO';

const ORDER_COMMAND_NAMES = {
  get CREATE_ORDER() { return 'CREATE_ORDER' as const; },
  get UPDATE_ORDER() { return 'UPDATE_ORDER' as const; },
  get DELETE_ORDER() { return 'DELETE_ORDER' as const; },
} as const;
export type ORDER_COMMAND_NAMES = typeof ORDER_COMMAND_NAMES;

const ORDER_COMMAND_CODEC_MAP = {
  [ORDER_COMMAND_NAMES.CREATE_ORDER]: ioTs.type({
    name: ioTs.string,
    amount: ioTs.number,
  }),
  [ORDER_COMMAND_NAMES.UPDATE_ORDER]: ioTs.intersection([
    ioTs.type({ id: ioTs.string, }),
    ioTs.partial({
      name: ioTs.string,
      amount: ioTs.number,
    }),
  ]),
  [ORDER_COMMAND_NAMES.DELETE_ORDER]: ioTs.type({ id: ioTs.string, }),
} as const;
type ORDER_COMMAND_PAYLOADS = {[K in keyof typeof ORDER_COMMAND_CODEC_MAP]: ioTs.TypeOf<typeof ORDER_COMMAND_CODEC_MAP[K]>}

export type ORDER_COMMAND = {
  [K in keyof ORDER_COMMAND_PAYLOADS]: {
    type: K;
    payload: ORDER_COMMAND_PAYLOADS[K];
  }
}[keyof ORDER_COMMAND_PAYLOADS]

export const ORDER_COMMANDS = {
  NAMES: ORDER_COMMAND_NAMES,
  CODECS: ORDER_COMMAND_CODEC_MAP,
} as const;
