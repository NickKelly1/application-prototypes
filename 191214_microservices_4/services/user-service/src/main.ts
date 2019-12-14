import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Notice
  // In the case of hybrid apps the useGlobalPipes() method doesn't set up pipes
  // for gateways and micro services. For "standard" (non-hybrid) microservice apps,
  // useGlobalPipes() does mount pipes globally.

  // https://docs.nestjs.com/pipes
  app.useGlobalPipes(new ValidationPipe({
    // transform plain JS objects to their DTO's
    transform: true,
  }));

  await app.listen(3000);
}
bootstrap();
