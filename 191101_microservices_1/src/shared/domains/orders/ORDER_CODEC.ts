import * as ioTs from 'io-ts';

export const ORDER_CODEC = ioTs.type({
  id: ioTs.string,
  name: ioTs.string,
  amount: ioTs.string,
  created_at: ioTs.string,
  updated_at: ioTs.string,
  deleted_at: ioTs.union([ioTs.null, ioTs.string]),
});

export type ORDER = ioTs.TypeOf<typeof ORDER_CODEC>
