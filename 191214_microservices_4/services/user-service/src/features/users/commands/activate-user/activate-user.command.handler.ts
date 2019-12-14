import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { UserRepository } from '../../user.repository';
import { UserModel } from '../../user.model';
import { classLogger } from '../../../../helpers/logger';
import { UserCreatedEvent } from '../../events/user-created.event.impl';
import { ActivateUserCommand } from './activate-user.command.impl';

@CommandHandler(ActivateUserCommand)
export class ActivateUserCommandHandler implements ICommandHandler<ActivateUserCommand> {
  private logger = classLogger(this);

  constructor(
    private readonly repo: UserRepository,
    private readonly pub: EventPublisher,
  ) { this.logger.dInfo('constructor'); }

  async execute(cmd: ActivateUserCommand) {
    this.logger.dInfo('execute', cmd);
    const newUser = await this.repo.create(cmd.id);
    this.pub.mergeObjectContext<UserModel>(newUser);
    newUser.apply(new UserCreatedEvent(newUser.id));
    newUser.commit();
  }
}
