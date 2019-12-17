import { Catch, WsExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { classLogger } from '../shared/ts/helpers/logger';


@Catch(Error)
export class WsFilter extends BaseWsExceptionFilter implements WsExceptionFilter {
  private readonly logger = classLogger(this);

  constructor() {
    super();
    this.logger.dInfo('constructor');
  }

  catch(exception: any, host: ArgumentsHost) {
    this.logger.dInfo('catch', exception);
    return super.catch(exception, host);
  }
}
