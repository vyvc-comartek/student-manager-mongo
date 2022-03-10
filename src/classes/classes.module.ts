import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModule } from '../students/students.module';
import { Class, ClassSchema } from './class.entity';
import { ClassesController } from './classes.controller';
import { ClassesResolver } from './classes.resolver';
import { ClassesService } from './classes.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]),
    forwardRef(() => StudentModule),
  ],
  providers: [ClassesService, ClassesResolver],
  controllers: [ClassesController],
  exports: [ClassesService, ClassesResolver],
})
export class ClassModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //throw new Error('Method not implemented.');
  }
}
