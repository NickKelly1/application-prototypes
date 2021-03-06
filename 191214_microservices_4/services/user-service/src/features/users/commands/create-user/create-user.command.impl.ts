import { UserAttributes } from '../../user.model';
import { classLogger } from '../../../../shared/ts/helpers/logger';

export class CreateUserCommand {
  private readonly logger = classLogger(this);
  constructor(
    public readonly attr: UserAttributes,
  ) { this.logger.dInfo('constructor'); }
}
