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
import { MongoId } from '../types/union/mongo-id.union';
import {
  CreateStudentDto,
  DeleteStudentDto,
  SearchStudentDto,
  UpdateStudentDto,
} from './dto';
import { StudentDocument } from './student.entity';
import { StudentsService } from './students.service';
@Controller('students')
export class StudentsController {
  constructor(
    readonly _studentsService: StudentsService,
    readonly _classesService: ClassesService,
    readonly _scoresService: ScoresService,
    readonly _excelService: ExcelService,
  ) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    const isClassExist = await this._classesService.checkExist({
      _id: createStudentDto.class,
    });

    if (!isClassExist)
      HttpExceptionMapper.throw(DatabaseExceptions.REFERENCE_OBJ_NOT_EXIST);

    return this._studentsService
      .create(createStudentDto)
      .then(this._afterInsertStudent);
  }

  @Patch()
  async update(@Body() updateStudentDto: UpdateStudentDto) {
    let isClassExist = false;

    if (updateStudentDto.class) {
      isClassExist = await this._classesService.checkExist({
        _id: updateStudentDto.class,
      });
    }

    if (isClassExist)
      HttpExceptionMapper.throw(DatabaseExceptions.REFERENCE_OBJ_NOT_EXIST);

    return this._studentsService.update(updateStudentDto);
  }

  @Delete()
  async delete(@Body() deleteStudentDto: DeleteStudentDto) {
    const isScoreExist = await this._scoresService.checkExist({
      student: deleteStudentDto._id,
    });

    if (isScoreExist)
      HttpExceptionMapper.throw(DatabaseExceptions.OBJ_REFERENCED);

    return this._studentsService.delete(deleteStudentDto);
  }

  @Get()
  async search(@Query() searchStudentDto: SearchStudentDto) {
    return this._studentsService.search(searchStudentDto);
  }

  @Get('excel')
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  async excel(@Query() searchStudentDto: SearchStudentDto) {
    const [schema, data] = await Promise.all([
      await readFile('./xlsx-template/student.xlsx'),
      await this._studentsService.search(searchStudentDto),
    ]);

    const resultExcelData = await this._excelService.create({
      schema,
      data,
    });

    return new StreamableFile(resultExcelData);
  }

  async _afterInsertStudent(
    insertedStudent: (StudentDocument & { _id: MongoId })[],
  ) {
    //Cập nhật totalMember trong bảng Class khi insert Student thành công
    this._classesService.updateTotalMember(insertedStudent[0].class);

    return insertedStudent;
  }
}
