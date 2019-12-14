import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreatedEvent } from './user-created.event.impl';
import { classLogger } from '../../../shared/ts/helpers/logger';


@EventsHandler(UserCreatedEvent)
export class UserCreatedEventHandler implements IEventHandler<UserCreatedEvent> {
  private logger = classLogger(this);

  handle(event: UserCreatedEvent) {
    this.logger.dInfo('handle', event);
  }
}
