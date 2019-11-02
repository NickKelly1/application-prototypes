// import * as ioTs from 'io-ts';
// import { UnionFromCodecMap } from '../../helpers/either-helpers';

// const ORDER_COMMAND_NAME = {
//   get CREATE_ORDER() { return 'CREATE_ORDER' as const; },
//   get UPDATE_ORDER() { return 'UPDATE_ORDER' as const; },
//   get DELETE_ORDER() { return 'DELETE_ORDER' as const; },
// } as const;
// export type ORDER_COMMAND_NAME = typeof ORDER_COMMAND_NAME;

// const ORDER_COMMAND_CODEC_MAP = {
//   [ORDER_COMMAND_NAME.CREATE_ORDER]: ioTs.type({
//     name: ioTs.string,
//     amount: ioTs.number,
//   }),
//   [ORDER_COMMAND_NAME.UPDATE_ORDER]: ioTs.intersection([
//     ioTs.type({ id: ioTs.string, }),
//     ioTs.partial({
//       name: ioTs.string,
//       amount: ioTs.number,
//     }),
//   ]),
//   [ORDER_COMMAND_NAME.DELETE_ORDER]: ioTs.type({ id: ioTs.string, }),
// } as const;
// type ORDER_COMMAND_PAYLOADS = UnionFromCodecMap<typeof ORDER_COMMAND_CODEC_MAP>;

// export type ORDER_COMMAND = { [K in keyof ORDER_COMMAND_PAYLOADS]: { type: K; payload: ORDER_COMMAND_PAYLOADS[K] } }[keyof ORDER_COMMAND_PAYLOADS]
// export const ORDER_COMMANDS = { NAME: ORDER_COMMAND_NAME, CODEC: ORDER_COMMAND_CODEC_MAP } as const;
