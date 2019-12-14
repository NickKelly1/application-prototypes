import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserRepository } from './user.repository';
import { UserCreatedEventHandler } from './events/user-created.event.handler';
import { GetUsersQueryHandler } from './queries/get-users/get-users.query.handler';
import { UserController } from './user.controller';
import { CreateUserCommandHandler } from './commands/create-user/create-user.command.handler';
import { classLogger } from '../../helpers/logger';
import { GetUserQueryHandler } from './queries/get-user/get-user.query.handler';


const commandHandlers = [
  CreateUserCommandHandler,
];
const eventHandlers = [
  UserCreatedEventHandler,
];
const queryhandlers = [
  GetUsersQueryHandler,
  GetUserQueryHandler,
];
const userSagas: any[] = [];

@Module({
  imports: [CqrsModule],
  controllers: [UserController],
  providers: [
    UserRepository,
    ...commandHandlers,
    ...eventHandlers,
    ...queryhandlers,
    ...userSagas,
  ],
})
export class UserModule {
  private logger = classLogger(this);

  constructor() {
    this.logger.dInfo('constructor');
  }
}
