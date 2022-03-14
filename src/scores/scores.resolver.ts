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
import { EmailService } from 'src/modules/email/email.service';
import { ExcelService } from 'src/modules/excel/excel.service';
import { Student } from 'src/students/student.entity';
import { StudentsService } from 'src/students/students.service';
import { SubjectsService } from 'src/subjects/subjects.service';
import { SearchStudentResult } from '../students/dto/search-student.dto';
import { Subject } from '../subjects/subject.entity';
import { MongoId } from '../types/union/mongo-id.union';
import {
  CreateScoreDto,
  DeleteScoreDto,
  SearchScoreDto,
  UpdateScoreDto,
} from './dto';
import { Score } from './score.entity';
import { ScoresController } from './scores.controller';
import { ScoresService } from './scores.service';

@Resolver(Score)
export class ScoresResolver extends ScoresController {
  constructor(
    readonly _scoresService: ScoresService,
    readonly _subjectsService: SubjectsService,
    readonly _studentsService: StudentsService,
    readonly _emailService: EmailService,
    readonly _excelService: ExcelService,
  ) {
    super(
      _scoresService,
      _subjectsService,
      _studentsService,
      _emailService,
      _excelService,
    );
  }

  @Mutation(() => [Score])
  async createScore(@Args('create') createScoreDto: CreateScoreDto) {
    return super.create(createScoreDto);
  }

  @Mutation(() => Score)
  async updateScore(@Args('update') updateScoreDto: UpdateScoreDto) {
    return super.update(updateScoreDto);
  }

  @Mutation(() => Score)
  async deleteScore(@Args('delete') deleteScoreDto: DeleteScoreDto) {
    return super.delete(deleteScoreDto);
  }

  @Query(() => [Score])
  async searchScore(@Args() searchScoreDto: SearchScoreDto) {
    return super.search(searchScoreDto);
  }

  @ResolveField('subject', () => Subject)
  async getScoreSubject(
    @Parent() score: Score,
    @Context()
    {
      subjectsLoaderById,
    }: { subjectsLoaderById: DataLoader<MongoId, Subject> },
  ) {
    const result = await subjectsLoaderById.load(String(score.subject));
    return result[0];
  }

  @ResolveField('student', () => Student)
  async getScoreStudent(
    @Parent() score: Score,
    @Context()
    {
      studentsLoaderById,
    }: { studentsLoaderById: DataLoader<MongoId, SearchStudentResult> },
  ) {
    const result = await studentsLoaderById.load(String(score.student));
    return result.result[0];
  }
}
