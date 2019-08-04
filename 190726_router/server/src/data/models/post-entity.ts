import { Maybe, none } from '../../helpers/maybe';
import { UserEntityAttributes } from './users/user-model';
import { MaybeValue, ThreadEntityAttributes } from './thread-entity';

export interface PostEntityAttributes {
  id: Maybe<number>;
  owner_id: MaybeValue<UserEntityAttributes['id']>;
  thread_id: MaybeValue<ThreadEntityAttributes['id']>;
  body: string;
}

export class PostEntity implements PostEntityAttributes {
  public primaryKey = 'id' as const;

  public id: Maybe<number> = none();

  public owner_id: PostEntityAttributes['owner_id'];

  public thread_id: PostEntityAttributes['thread_id'];

  public body: PostEntityAttributes['body'];

  public constructor(attributes: PostEntityAttributes) {
    this.owner_id = attributes.owner_id;
    this.thread_id = attributes.thread_id;
    this.body = attributes.body;
  }
}
