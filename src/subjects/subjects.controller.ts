import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  DatabaseExceptions,
  HttpExceptionMapper,
} from '../modules/http-exception.mapper';
import { ScoresService } from '../scores/scores.service';
import {
  CreateSubjectDto,
  DeleteSubjectDto,
  SearchSubjectDto,
  UpdateSubjectDto,
} from './dto';
import { SubjectsService } from './subjects.service';

@Controller('subjects')
export class SubjectsController {
  constructor(
    private readonly subjectsService: SubjectsService,
    private readonly scoresService: ScoresService,
  ) {}

  @Post()
  async create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.create(createSubjectDto);
  }

  @Patch()
  async update(@Body() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectsService.update(updateSubjectDto);
  }

  @Delete()
  async delete(@Body() deleteSubjectDto: DeleteSubjectDto) {
    const isScoreExist =
      deleteSubjectDto.id &&
      (await this.scoresService.checkExist({ subject: deleteSubjectDto.id }));

    if (isScoreExist)
      HttpExceptionMapper.throw(DatabaseExceptions.OBJ_REFERENCED);

    return this.subjectsService.delete(deleteSubjectDto);
  }

  @Get()
  async search(@Query() searchSubjectDto: SearchSubjectDto) {
    return this.subjectsService.search(searchSubjectDto);
  }
}
