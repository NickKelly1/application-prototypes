import faker from 'faker';
import { PostEntityAttributes, PostEntity } from '../entities/post-entity';
import { none } from '../../helpers/maybe';
import { randomInt } from '../../helpers/random-int';

const getDefaultEntity = (): PostEntityAttributes => ({
  id: none(),
  owner_id: randomInt(0, 100),
  thread_id: randomInt(0, 100),
  body: faker.lorem.paragraph(1),
});

export class PostEntityFactory {
  public static create = (attributes: Partial<PostEntityAttributes>) => {
    const attributesToUse: PostEntityAttributes = {
      ...getDefaultEntity(),
      ...attributes,
    };
    return new PostEntity(attributesToUse);
  };
}
