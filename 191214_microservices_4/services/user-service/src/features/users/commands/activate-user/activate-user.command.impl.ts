import { UserAttributes, UserId } from '../../user.model';
import { classLogger } from '../../../../shared/ts/helpers/logger';

export class ActivateUserCommand {
  private readonly logger = classLogger(this);
  constructor(
    public readonly id: UserId,
  ) { this.logger.dInfo('constructor'); }
}
