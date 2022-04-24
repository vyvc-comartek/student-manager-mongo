import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as io from '@pm2/io';
import { AppModule } from './app.module';
import { GlobalMetricInterceptor } from './modules/pm2io/globalMetrics.interceptor';
import { RemoveFalseyPipe } from './modules/remove-falsey.pipe';
import { ToObjectId } from './modules/to-object-id.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({ transform: true }),
    new RemoveFalseyPipe(),
    new ToObjectId(),
  );

  app.useGlobalInterceptors(new GlobalMetricInterceptor());

  app.use(io.expressErrorHandler());

  await app.listen(3000);
}
bootstrap();
