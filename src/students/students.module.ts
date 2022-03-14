import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScoreModule } from 'src/scores/scores.module';
import { Class, ClassSchema } from '../classes/class.entity';
import { ClassModule } from '../classes/classes.module';
import { ExcelModule } from '../modules/excel/excel.module';
import { Student, StudentSchema } from './student.entity';
import { StudentsController } from './students.controller';
import { StudentsResolver } from './students.resolver';
import { StudentsService } from './students.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: Class.name, schema: ClassSchema },
    ]),
    forwardRef(() => ScoreModule),
    forwardRef(() => ClassModule),
    forwardRef(() => ExcelModule),
  ],
  providers: [StudentsService, StudentsResolver],
  controllers: [StudentsController],
  exports: [StudentsService, StudentsResolver],
})
export class StudentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //throw new Error('Method not implemented.');
  }
}
