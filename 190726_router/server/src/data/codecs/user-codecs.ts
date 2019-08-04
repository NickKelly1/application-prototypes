import * as ioTs from 'io-ts';
import { createStringValidator } from '../../validation/validators/string-validator';

/**
 * User Status
 */
export const USER_STATUS = {
  PRE_ACTIVATION: 'PRE_ACTIVATION',
  ACTIVATED: 'ACTIVATED',
  DEACTIVATED: 'DEACTIVATED',
} as const;

export const USER_STATUS_CODEC = ioTs.union([
  ioTs.literal(USER_STATUS.PRE_ACTIVATION),
  ioTs.literal(USER_STATUS.ACTIVATED),
  ioTs.literal(USER_STATUS.DEACTIVATED),
]);

export type USER_STATUS = ioTs.TypeOf<typeof USER_STATUS_CODEC>;

/**
 * User Table
 */
export const UserAttributesCodec = ioTs.type({
  name: createStringValidator({ min: 3, max: 10 }),
  password: createStringValidator({ min: 10, max: 30 }),
  status: USER_STATUS_CODEC,
});
export type UserAttributes = ioTs.TypeOf<typeof UserAttributesCodec>;

export const UserRecordCodec = ioTs.intersection([ioTs.type({ id: ioTs.number }), UserAttributesCodec]);
export type UserRecord = ioTs.TypeOf<typeof UserRecordCodec>;

/**
 * User Entity
 */
// export const UserModelAttributesCodec = ioTs.type({
//   name: createStringValidator({ min: 3, max: 10 }),
//   password: createStringValidator({ min: 10, max: 30 }),
//   status: USER_STATUS_CODEC,
// });
// export type UserAttributes = ioTs.TypeOf<typeof UserAttributesCodec>;

// export const UserRecordCodec = ioTs.intersection([ioTs.type({ id: ioTs.number }), UserAttributesCodec]);
// export type UserRecord = ioTs.TypeOf<typeof UserRecordCodec>;
