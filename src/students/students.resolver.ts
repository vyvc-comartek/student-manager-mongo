import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import DataLoader from 'dataloader';
import { Class } from 'src/classes/class.entity';
import { Score } from 'src/scores/score.entity';
import { MongoId } from 'src/types/union/mongo-id.union';
import { ClassesService } from '../classes/classes.service';
import { ExcelService } from '../modules/excel/excel.service';
import { ScoresService } from '../scores/scores.service';
import {
  DeleteStudentDto,
  SearchStudentDto,
  SearchStudentResult,
  UpdateStudentDto,
} from './dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { Student } from './student.entity';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

@Resolver(Student)
export class StudentsResolver extends StudentsController {
  constructor(
    readonly _studentsService: StudentsService,
    readonly _classesService: ClassesService,
    readonly _scoresService: ScoresService,
    readonly _excelService: ExcelService,
  ) {
    super(_studentsService, _classesService, _scoresService, _excelService);
  }

  @Mutation(() => [Student])
  async createStudent(@Args('create') createStudentDto: CreateStudentDto) {
    return super.create(createStudentDto);
  }

  @Mutation(() => Student)
  async updateStudent(@Args('update') updateStudentDto: UpdateStudentDto) {
    return super.update(updateStudentDto);
  }

  @Mutation(() => Student)
  async deleteStudent(@Args('delete') deleteStudentDto: DeleteStudentDto) {
    return super.delete(deleteStudentDto);
  }

  @Query(() => SearchStudentResult)
  async searchStudent(@Args() searchStudentDto: SearchStudentDto) {
    return super.search(searchStudentDto);
  }

  @ResolveField('scores', () => [Score])
  async getStudentScores(
    @Parent() student: Student,
    @Context()
    {
      scoresLoaderByStudent,
    }: { scoresLoaderByStudent: DataLoader<MongoId, Score> },
  ) {
    return scoresLoaderByStudent.load(student._id);
  }

  @ResolveField('class', () => Class)
  async getStudentClass(
    @Parent() student: Student,
    @Context()
    { classesLoaderById }: { classesLoaderById: DataLoader<MongoId, Class> },
  ) {
    const result = await classesLoaderById.load(String(student.class));
    return result[0];
  }
}
