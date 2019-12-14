import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command.impl';
import { UserRepository } from '../../user.repository';
import { UserModel } from '../../user.model';
import { classLogger } from '../../../../shared/ts/helpers/logger';
import { UserCreatedEvent } from '../../events/user-created.event.impl';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  private logger = classLogger(this);

  constructor(
    private readonly repo: UserRepository,
    private readonly pub: EventPublisher,
  ) { this.logger.dInfo('constructor'); }

  async execute(cmd: CreateUserCommand) {
    this.logger.dInfo('execute', cmd);
    const newUser = await this.repo.create(cmd.attr);
    this.pub.mergeObjectContext<UserModel>(newUser);
    newUser.apply(new UserCreatedEvent(newUser.id));
    newUser.commit();
  }
}
