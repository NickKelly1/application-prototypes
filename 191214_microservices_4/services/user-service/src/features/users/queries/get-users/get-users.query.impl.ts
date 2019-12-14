import { IQuery } from '@nestjs/cqrs';
import { classLogger } from '../../../../shared/ts/helpers/logger';
import { UserModel } from '../../user.model';

export class GetUsersQuery {
  private readonly logger = classLogger(this)

  constructor() { this.logger.dInfo('constructor'); }
}
