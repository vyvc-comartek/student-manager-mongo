import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScoreModule } from 'src/scores/scores.module';
import { Class } from '../classes/class.entity';
import { ClassModule } from '../classes/classes.module';
import { ExcelModule } from '../modules/excel/excel.module';
import { Student } from './student.entity';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Class]),
    forwardRef(() => ScoreModule),
    forwardRef(() => ClassModule),
    forwardRef(() => ExcelModule),
  ],
  providers: [StudentsService],
  controllers: [StudentsController],
  exports: [StudentsService],
})
export class StudentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //throw new Error('Method not implemented.');
  }
}
