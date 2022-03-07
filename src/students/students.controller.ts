import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Patch,
  Post,
  Query,
  StreamableFile,
} from '@nestjs/common';
import { readFile } from 'fs/promises';
import { ClassesService } from 'src/classes/classes.service';
import { ExcelService } from '../modules/excel/excel.service';
import {
  DatabaseExceptions,
  HttpExceptionMapper,
} from '../modules/http-exception.mapper';
import { ScoresService } from '../scores/scores.service';
import {
  CreateStudentDto,
  DeleteStudentDto,
  SearchStudentDto,
  UpdateStudentDto,
} from './dto';
import { StudentsService } from './students.service';
@Controller('students')
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly classesService: ClassesService,
    private readonly scoresService: ScoresService,
    private readonly excelService: ExcelService,
  ) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    const isClassExist = !(await this.classesService.checkExist({
      id: createStudentDto.class,
    }));

    if (isClassExist)
      HttpExceptionMapper.throw(DatabaseExceptions.REFERENCE_OBJ_NOT_EXIST);

    return this.studentsService.create(createStudentDto);
  }

  @Patch()
  async update(@Body() updateStudentDto: UpdateStudentDto) {
    const isClassNotExist =
      updateStudentDto.class &&
      !(await this.classesService.checkExist({ id: updateStudentDto.class }));

    if (isClassNotExist)
      HttpExceptionMapper.throw(DatabaseExceptions.REFERENCE_OBJ_NOT_EXIST);

    return this.studentsService.update(updateStudentDto);
  }

  @Delete()
  async delete(@Body() deleteStudentDto: DeleteStudentDto) {
    const isScoreExist = await this.scoresService.checkExist({
      student: deleteStudentDto.id,
    });

    if (isScoreExist)
      HttpExceptionMapper.throw(DatabaseExceptions.OBJ_REFERENCED);

    return this.studentsService.delete(deleteStudentDto);
  }

  @Get()
  async search(@Query() searchStudentDto: SearchStudentDto) {
    return this.studentsService.search(searchStudentDto);
  }

  @Get('excel')
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  async excel(@Query() searchStudentDto: SearchStudentDto) {
    const resultExcel = await this.excelService.create({
      schema: await readFile('./xlsx-template/student.xlsx'),
      data: await this.studentsService.search(searchStudentDto),
    });

    return new StreamableFile(resultExcel);
  }
}
