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

// const userValidator = ioTs.type({
//   first_name: createStringValidator({ min: 3, max: 15 }, { isString: () => '' }),
//   last_name: createStringValidator({ min: 3, max: 20 }, { isString: () => '' }),
// });

export class UserEntity implements UserEntityAttributes {
  public primaryKey = 'id' as const;

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
