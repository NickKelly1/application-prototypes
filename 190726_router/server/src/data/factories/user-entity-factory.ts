import faker from 'faker';

import { UserEntity, USER_STATUS, UserEntityAttributes } from '../entities/user-entity';
import { none } from '../../helpers/maybe';
import { randomElementOf } from '../../helpers/random-element-of';

const getDefaultEntity = (): UserEntityAttributes => ({
  id: none(),
  name: faker.internet.userName(),
  password: faker.internet.password(),
  status: randomElementOf(Object.values(USER_STATUS)),
});

export class UserEntityFactory {
  public static create = (attributes: Partial<UserEntityAttributes>) => {
    const attributesToUse: UserEntityAttributes = {
      ...getDefaultEntity(),
      ...attributes,
    };
    return new UserEntity(attributesToUse);
  };
}
