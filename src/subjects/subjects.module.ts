import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScoreModule } from 'src/scores/scores.module';
import { Subject, SubjectSchema } from './subject.entity';
import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Subject.name, schema: SubjectSchema }]),
    forwardRef(() => ScoreModule),
  ],
  providers: [SubjectsService],
  controllers: [SubjectsController],
  exports: [SubjectsService],
})
export class SubjectModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //throw new Error('Method not implemented.');
  }
}
