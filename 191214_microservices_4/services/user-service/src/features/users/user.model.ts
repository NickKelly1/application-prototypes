import { AggregateRoot } from '@nestjs/cqrs';
import { WithId, ModelWithId } from '../../@types/with-id';
import { classLogger } from '../../shared/ts/helpers/logger';

export type UserId = string;

export interface UserAttributes {
  email: string;
  first: string;
  middle: null | string;
  last: string;
  password: string;
  activated: boolean;
}

export class UserModel extends AggregateRoot implements ModelWithId<UserAttributes, UserId> {
  private readonly logger = classLogger(this);

  constructor(
    public readonly id: UserId,
    public attr: UserAttributes,
  ) {
    super();
    this.logger.dInfo('constructor');
  }
}
