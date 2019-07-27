import { Maybe, none, Some } from '../../helpers/maybe';
import { UserEntityAttributes } from './user-entity';

export type MaybeValue<MaybeType> = MaybeType extends Some<infer T> ? T : never;

export interface ThreadEntityAttributes {
  id: Maybe<number>;
  owner_id: MaybeValue<UserEntityAttributes['id']>;
  title: string;
}

export class ThreadEntity implements ThreadEntityAttributes {
  public id: Maybe<number> = none();

  public owner_id: ThreadEntityAttributes['owner_id'];

  public title: ThreadEntityAttributes['title'];

  public constructor(attributes: ThreadEntityAttributes) {
    this.owner_id = attributes.owner_id;
    this.title = attributes.title;
  }
}
