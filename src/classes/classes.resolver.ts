import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import * as DataLoader from 'dataloader';
import { Student } from 'src/students/student.entity';
import { SearchStudentResult } from '../students/dto/search-student.dto';
import { StudentsService } from '../students/students.service';
import { MongoId } from '../types/union/mongo-id.union';
import { Class } from './class.entity';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { CreateClassDto, DeleteClassDto, UpdateClassDto } from './dto';
import { SearchClassDto } from './dto/search-class.dto';

@Resolver(Class)
export class ClassesResolver extends ClassesController {
  constructor(
    readonly _classesService: ClassesService,
    readonly _studentsService: StudentsService,
  ) {
    super(_classesService, _studentsService);
  }

  @Mutation(() => [Class])
  async createClass(@Args('create') createClassDto: CreateClassDto) {
    return super.create(createClassDto);
  }

  @Mutation(() => Class)
  async updateClass(@Args('update') updateClassDto: UpdateClassDto) {
    return super.update(updateClassDto);
  }

  @Mutation(() => Class)
  async deleteClass(@Args('delete') deleteClassDto: DeleteClassDto) {
    return super.delete(deleteClassDto);
  }

  @Query(() => [Class])
  async searchClass(@Args() searchClassDto: SearchClassDto) {
    return super.search(searchClassDto);
  }

  @ResolveField('students', () => [Student])
  async getClassStudents(
    @Parent() clss: Class,
    @Context()
    {
      studentsLoaderByClass,
    }: { studentsLoaderByClass: DataLoader<MongoId, SearchStudentResult> },
  ) {
    return (await studentsLoaderByClass.load(clss._id)).result;
  }
}
