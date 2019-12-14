import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUsersQuery } from './get-users.query.impl';
import { UserRepository } from '../../user.repository';
import { classLogger } from '../../../../shared/ts/helpers/logger';

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler implements IQueryHandler<GetUsersQuery> {
  private logger = classLogger(this);

  constructor(
    private readonly repo: UserRepository,
  ) { this.logger.dInfo('constructor'); }

  async execute(query: GetUsersQuery) {
    this.logger.dInfo('execute');
    return this.repo.find();
  }
}
