import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubjectModule } from 'src/subjects/subjects.module';
import { EmailModule } from '../modules/email/email.module';
import { ExcelModule } from '../modules/excel/excel.module';
import { StudentModule } from '../students/students.module';
import { Score, ScoreSchema } from './score.entity';
import { ScoresController } from './scores.controller';
import { ScoresResolver } from './scores.resolver';
import { ScoresService } from './scores.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Score.name, schema: ScoreSchema }]),
    forwardRef(() => StudentModule),
    forwardRef(() => SubjectModule),
    forwardRef(() => EmailModule),
    forwardRef(() => ExcelModule),
  ],
  providers: [ScoresService, ScoresResolver],
  controllers: [ScoresController],
  exports: [ScoresService, ScoresResolver],
})
export class ScoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //throw new Error('Method not implemented.');
  }
}
