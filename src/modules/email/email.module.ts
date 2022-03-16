import { BullModule } from '@nestjs/bull';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EmailConsumer } from './email.consumer';
import { EmailService } from './email.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  providers: [EmailService, EmailConsumer],
  exports: [EmailService],
})
export class EmailModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //throw new Error('Method not implemented.');
  }
}
