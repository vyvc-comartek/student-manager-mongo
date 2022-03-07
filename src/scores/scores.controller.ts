import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { readFile } from 'fs/promises';
import { StudentsService } from 'src/students/students.service';
import { EmailService } from '../modules/email/email.service';
import { ExcelService } from '../modules/excel/excel.service';
import {
  DatabaseExceptions,
  HttpExceptionMapper,
} from '../modules/http-exception.mapper';
import { Student } from '../students/student.entity';
import { SubjectsService } from '../subjects/subjects.service';
import {
  CreateScoreDto,
  DeleteScoreDto,
  SearchScoreDto,
  UpdateScoreDto,
} from './dto';
import { Score } from './score.entity';
import { ScoresService } from './scores.service';

@Controller('scores')
export class ScoresController {
  constructor(
    private readonly scoresService: ScoresService,
    private readonly subjectsService: SubjectsService,
    private readonly studentsService: StudentsService,
    private readonly emailService: EmailService,
    private readonly excelService: ExcelService,
  ) {}

  @Post()
  async create(@Body() createScoreDto: CreateScoreDto) {
    const isStudentExist = await this.studentsService.checkExist({
      id: createScoreDto.student,
    });
    const isSubjectExist = await this.subjectsService.checkExist({
      id: createScoreDto.subject,
    });

    if (!isStudentExist || !isSubjectExist)
      HttpExceptionMapper.throw(DatabaseExceptions.REFERENCE_OBJ_NOT_EXIST);

    return this.scoresService.create(createScoreDto).then(async (value) => {
      //Thực thi đồng thời truy vấn Score vừa tạo và đọc file xlsx schema
      const [score, schema, schemaAll, countSubjects] = await Promise.all([
        this.scoresService.search({
          id: value.raw.insertId,
          relations: [
            'student',
            'subject',
            'student.scores',
            'student.scores.subject',
          ],
        }),
        readFile('./xlsx-template/attch-email.xlsx'),
        readFile('./xlsx-template/attch-all-scores-email.xlsx'),
        this.subjectsService.countSubjects(),
      ]);

      //Đổ dữ liệu vào schema để tạo tệp kết quả xlsx
      const content = [
        await this.excelService.create<Score>({
          schema,
          data: score,
        }),
      ];

      //Nếu tất cả các môn đều có điểm
      if (countSubjects === score.student.scores.length) {
        content.push(
          await this.excelService.create<Student>({
            schema: schemaAll,
            data: score.student,
          }),
        );
      }

      //Gửi email
      this.emailService.sendWhenScoreAdded({
        score,
        content,
      });

      return value;
    });
  }

  @Patch()
  async update(@Body() updateScoreDto: UpdateScoreDto) {
    const isStudentNotExist =
      updateScoreDto.student &&
      !(await this.studentsService.checkExist({
        id: updateScoreDto.student,
      }));
    const isSubjectNotExist =
      updateScoreDto.subject &&
      !(await this.subjectsService.checkExist({
        id: updateScoreDto.subject,
      }));

    if (isStudentNotExist || isSubjectNotExist)
      HttpExceptionMapper.throw(DatabaseExceptions.REFERENCE_OBJ_NOT_EXIST);

    return this.scoresService.update(updateScoreDto);
  }

  @Delete()
  async delete(@Body() deleteScoreDto: DeleteScoreDto) {
    const isStudentExist =
      deleteScoreDto.student &&
      (await this.studentsService.checkExist({
        id: deleteScoreDto.student,
      }));
    const isSubjectExist =
      deleteScoreDto.subject &&
      (await this.subjectsService.checkExist({
        id: deleteScoreDto.subject,
      }));

    if (isStudentExist || isSubjectExist)
      HttpExceptionMapper.throw(DatabaseExceptions.OBJ_REFERENCED);

    return this.scoresService.delete(deleteScoreDto);
  }

  @Get()
  async search(@Query() searchScoreDto: SearchScoreDto) {
    return this.scoresService.search(
      Object.assign(searchScoreDto, {
        relations: [
          'student',
          'subject',
          'student.scores',
          'student.scores.subject',
        ],
      } as SearchScoreDto),
    );
  }
}
