import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectModule } from 'src/subjects/subjects.module';
import { EmailModule } from '../modules/email/email.module';
import { ExcelModule } from '../modules/excel/excel.module';
import { StudentModule } from '../students/students.module';
import { Score } from './score.entity';
import { ScoresController } from './scores.controller';
import { ScoresService } from './scores.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Score]),
    forwardRef(() => StudentModule),
    forwardRef(() => SubjectModule),
    forwardRef(() => EmailModule),
    forwardRef(() => ExcelModule),
  ],
  providers: [ScoresService],
  controllers: [ScoresController],
  exports: [ScoresService],
})
export class ScoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //throw new Error('Method not implemented.');
  }
}
