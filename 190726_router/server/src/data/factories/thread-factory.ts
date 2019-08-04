import faker from 'faker';

import { ThreadEntity, ThreadEntityAttributes } from '../models/thread-entity';
import { none } from '../../helpers/maybe';
import { randomInt } from '../../helpers/random-int';

const getDefaultEntity = (): ThreadEntityAttributes => ({
  id: none(),
  owner_id: randomInt(0, 100),
  title: faker.lorem.lines(1),
});

export class UserEntityFactory {
  public static create = (attributes: Partial<ThreadEntityAttributes>) => {
    const attributesToUse: ThreadEntityAttributes = {
      ...getDefaultEntity(),
      ...attributes,
    };
    return new ThreadEntity(attributesToUse);
  };
}
