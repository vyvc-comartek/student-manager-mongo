import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RemoveFalseyPipe } from './modules/remove-falsey.pipe';
import { ToObjectId } from './modules/to-object-id.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({ transform: true }),
    new RemoveFalseyPipe(),
    new ToObjectId(),
  );

  await app.listen(3000);
}
bootstrap();
