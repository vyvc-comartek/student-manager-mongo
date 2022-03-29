import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import * as Queue from 'bull';
import * as passport from 'passport';
import { BullBoardController } from './bull-board.controller';
import { BullBoardStrategy } from './bull-board.strategy';

@Module({
  imports: [PassportModule],
  controllers: [BullBoardController],
  providers: [BullBoardStrategy],
})
export class BullBoardModule implements NestModule {
  private _serverAdapter: ExpressAdapter;
  private _emailAdapter: BullAdapter;

  constructor() {
    this._serverAdapter = new ExpressAdapter();
    this._serverAdapter.setBasePath('queues');

    this._emailAdapter = new BullAdapter(new Queue('email'));

    createBullBoard({
      queues: [this._emailAdapter],
      serverAdapter: this._serverAdapter,
    });
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        passport.authenticate('bull-board', { session: false }),
        this._serverAdapter.getRouter(),
      )
      .forRoutes('queues');
  }
}
