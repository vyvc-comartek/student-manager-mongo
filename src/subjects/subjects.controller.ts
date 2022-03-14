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
    readonly _subjectsService: SubjectsService,
    readonly _scoresService: ScoresService,
  ) {}

  @Post()
  async create(@Body() createSubjectDto: CreateSubjectDto) {
    return this._subjectsService.create(createSubjectDto);
  }

  @Patch()
  async update(@Body() updateSubjectDto: UpdateSubjectDto) {
    return this._subjectsService.update(updateSubjectDto);
  }

  @Delete()
  async delete(@Body() deleteSubjectDto: DeleteSubjectDto) {
    let isScoreExist = false;

    if (deleteSubjectDto._id) {
      isScoreExist = await this._scoresService.checkExist({
        subject: deleteSubjectDto._id,
      });
    }

    if (isScoreExist)
      HttpExceptionMapper.throw(DatabaseExceptions.OBJ_REFERENCED);

    return this._subjectsService.delete(deleteSubjectDto);
  }

  @Get()
  async search(@Query() searchSubjectDto: SearchSubjectDto) {
    return this._subjectsService.search(searchSubjectDto);
  }
}
