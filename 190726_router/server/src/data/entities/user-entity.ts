import { none, Maybe } from '../../helpers/maybe';
import { AValueOf } from '../../../@types/helpers/helper-types';

export const USER_STATUS = {
  PRE_ACTIVATION: 'PRE_ACTIVATION',
  ACTIVATED: 'ACTIVATED',
  DEACTIVATED: 'DEACTIVATED",',
} as const;
export type USER_STATUS = typeof USER_STATUS;

export interface UserEntityAttributes {
  id: Maybe<number>;
  name: string;
  password: string;
  status: AValueOf<USER_STATUS>;
}

export class UserEntity implements UserEntityAttributes {
  public id: Maybe<number> = none();

  public name: UserEntityAttributes['name'];

  public password: UserEntityAttributes['password'];

  public status: UserEntityAttributes['status'];

  public constructor(attributes: UserEntityAttributes) {
    this.name = attributes.name;
    this.password = attributes.password;
    this.status = attributes.status;
  }
}