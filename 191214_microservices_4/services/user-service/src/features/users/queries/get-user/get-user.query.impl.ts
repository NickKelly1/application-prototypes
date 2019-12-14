import { classLogger } from '../../../../helpers/logger';
import { UserId } from '../../user.model';

export class GetUserQuery {
  private readonly logger = classLogger(this)

  constructor(
    public readonly id: UserId,
  ) { this.logger.dInfo('constructor'); }
}
