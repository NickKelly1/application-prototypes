import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from './get-user.query.impl';
import { UserRepository } from '../../user.repository';
import { classLogger } from '../../../../helpers/logger';


@QueryHandler(GetUserQuery)
export class GetUserQueryHandler implements IQueryHandler<GetUserQuery> {
  private logger = classLogger(this);

  constructor(
    private readonly repo: UserRepository,
  ) { this.logger.dInfo('constructor'); }

  async execute(query: GetUserQuery) {
    this.logger.dInfo('execute');
    return this.repo.findOneById(query.id);
  }
}
