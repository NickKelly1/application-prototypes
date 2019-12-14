import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { LoggerMiddleware } from '../../middleware/logger.middleware';
import { classLogger } from '../../shared/ts/helpers/logger';

@Module({
  imports: [],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {
  private readonly logger = classLogger(this);

  constructor() { this.logger.dInfo('constructor'); }
}
