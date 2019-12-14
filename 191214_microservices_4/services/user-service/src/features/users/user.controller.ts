import {
  Controller, Get, Post, Body,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUsersQuery } from './queries/get-users/get-users.query.impl';
import { CreateUserCommandDto } from './commands/create-user/create-user.command.dto';
import { CreateUserCommand } from './commands/create-user/create-user.command.impl';
import { classLogger } from '../../shared/ts/helpers/logger';

@Controller('users')
export class UserController {
  private readonly logger = classLogger(this);

  constructor(
    private readonly cBus: CommandBus,
    private readonly qBus: QueryBus,
  ) { this.logger.dInfo('constructor'); }

  @Get()
  async index() {
    this.logger.dInfo('index');
    const z = await this.qBus.execute(new GetUsersQuery());
    return z;
  }

  @Get('/:id')
  async get() {
    this.logger.dInfo('index');
    const z = await this.qBus.execute(new GetUsersQuery());
    return z;
  }

  @Post()
  async create(@Body() dto: CreateUserCommandDto) {
    this.logger.dInfo('create');
    return this.cBus.execute(new CreateUserCommand({
      ...dto,
      activated: false,
    }));
  }
}
