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
import { StudentsService } from '../students/students.service';
import { ClassesService } from './classes.service';
import {
  CreateClassDto,
  DeleteClassDto,
  SearchClassDto,
  UpdateClassDto,
} from './dto';

@Controller('classes')
export class ClassesController {
  constructor(
    readonly _classesService: ClassesService,
    readonly _studentsService: StudentsService,
  ) {}

  @Post()
  async create(@Body() createClassDto: CreateClassDto) {
    return this._classesService.create(createClassDto);
  }

  @Patch()
  async update(@Body() updateClassDto: UpdateClassDto) {
    return this._classesService.update(updateClassDto);
  }

  @Delete()
  async delete(@Body() deleteClassDto: DeleteClassDto) {
    const isStudentRefClass = await this._studentsService.checkExist({
      class: deleteClassDto._id,
    });

    //Kiểm tra có student nào liên kết với class này không
    if (isStudentRefClass)
      HttpExceptionMapper.throw(DatabaseExceptions.OBJ_REFERENCED);

    return this._classesService.delete(deleteClassDto);
  }

  @Get()
  async search(@Query() searchClassDto: SearchClassDto) {
    return this._classesService.search(searchClassDto);
  }
}
