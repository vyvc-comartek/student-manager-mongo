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
import { SubjectsResolver } from './subjects.resolver';
import { SubjectsService } from './subjects.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Subject.name, schema: SubjectSchema }]),
    forwardRef(() => ScoreModule),
  ],
  providers: [SubjectsService, SubjectsResolver],
  controllers: [SubjectsController],
  exports: [SubjectsService, SubjectsResolver],
})
export class SubjectModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //throw new Error('Method not implemented.');
  }
}
