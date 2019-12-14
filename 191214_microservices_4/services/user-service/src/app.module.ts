import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { HomeModule } from './features/home/home.module';
import { UserModule } from './features/users/user.module';
import { classLogger } from './helpers/logger';

@Module({
  imports: [
    HomeModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  private logger = classLogger(this);

  constructor() {
    this.logger.dInfo('constructor');
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('/');
  }
}
