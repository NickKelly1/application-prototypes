import faker from 'faker';

import { UserModel, USER_STATUS, UserAttributes } from '../models/users/user-model';
import { none } from '../../helpers/maybe';
import { randomElementOf } from '../../helpers/random-element-of';

const getDefaultUser = (): UserAttributes => ({
  id: none(),
  name: faker.internet.userName(),
  password: faker.internet.password(),
  status: randomElementOf(Object.values(USER_STATUS)),
});

export class UserFactory {
  public static create = (attributes: Partial<UserAttributes>) => {
    const attributesToUse: UserAttributes = {
      ...getDefaultUser(),
      ...attributes,
    };
    return new UserModel(attributesToUse);
  };
}
