import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ScoresService } from 'src/scores/scores.service';
import {
  CreateSubjectDto,
  DeleteSubjectDto,
  SearchSubjectDto,
  UpdateSubjectDto,
} from './dto';
import { Subject } from './subject.entity';
import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';

@Resolver(Subject)
export class SubjectsResolver extends SubjectsController {
  constructor(
    readonly _subjectsService: SubjectsService,
    readonly _scoresService: ScoresService,
  ) {
    super(_subjectsService, _scoresService);
  }

  @Mutation(() => [Subject])
  async createSubject(@Args('create') createSubjectDto: CreateSubjectDto) {
    return super.create(createSubjectDto);
  }

  @Mutation(() => Subject)
  async updateSubject(@Args('update') updateSubjectDto: UpdateSubjectDto) {
    return super.update(updateSubjectDto);
  }

  @Mutation(() => Subject)
  async deleteSubject(@Args('delete') deleteSubjectDto: DeleteSubjectDto) {
    return super.delete(deleteSubjectDto);
  }

  @Query(() => [Subject])
  async searchSubject(@Args() searchSubjectDto: SearchSubjectDto) {
    return super.search(searchSubjectDto);
  }
}
