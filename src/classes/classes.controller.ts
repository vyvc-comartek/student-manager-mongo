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
    private readonly classesService: ClassesService,
    private readonly studentsService: StudentsService,
  ) {}

  @Post()
  async create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Patch()
  async update(@Body() updateClassDto: UpdateClassDto) {
    return this.classesService.update(updateClassDto);
  }

  @Delete()
  async delete(@Body() deleteClassDto: DeleteClassDto) {
    const isStudentRefClass = await this.studentsService.checkExist({
      class: deleteClassDto.id,
    });

    //Kiểm tra có student nào liên kết với class này không
    if (isStudentRefClass)
      HttpExceptionMapper.throw(DatabaseExceptions.OBJ_REFERENCED);

    return this.classesService.delete(deleteClassDto);
  }

  @Get()
  async search(@Query() searchClassDto: SearchClassDto) {
    return this.classesService.search(searchClassDto);
  }
}
