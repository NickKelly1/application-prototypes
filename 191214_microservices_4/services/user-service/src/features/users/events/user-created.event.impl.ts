import { UserId } from '../user.model';
import { classLogger } from '../../../shared/ts/helpers/logger';

export class UserCreatedEvent {
  private readonly logger = classLogger(this);

  constructor(
    public readonly userId: UserId,
  ) { this.logger.dInfo('constructor'); }
}
