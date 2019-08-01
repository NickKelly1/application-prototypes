import * as ioTs from 'io-ts';
import { Entity } from '../Entity';
import { createStringValidator } from '../../validation/validators/string-validator';

// https://github.com/gcanti/io-ts

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

// export const USER_ENTITY_ATTRIBUTE_RUNTIME_TYPES = {
//   ID: ioTs.number,
//   NAME: ioTs.string,
//   PASSWORD: ioTs.string,
//   STATUS: USER_STATUS_CODEC,
// } as const;

/**
 * User Attributes
 */
export const OptionalUserEntityAttributesCodec = ioTs.partial({
  id: ioTs.number,
});

export const RequiredUserEntityAttributesCodec = ioTs.type({
  name: createStringValidator({ min: 3, max: 10 }),
  password: createStringValidator({ min: 10, max: 30 }),
  status: USER_STATUS_CODEC,
});

export const UserEntityAttributesCodec = ioTs.intersection([
  OptionalUserEntityAttributesCodec,
  RequiredUserEntityAttributesCodec,
]);

type UserEntityAttributes = ioTs.TypeOf<typeof UserEntityAttributesCodec>;

/**
 * User Class
 */
export class UserEntity implements Entity<UserEntityAttributes, 'id'> {
  public readonly primaryKey = 'id';

  public attributes: UserEntityAttributes;

  public static codec = UserEntityAttributesCodec;

  public constructor(attributes: UserEntityAttributes) {
    this.attributes = attributes;
  }
}
