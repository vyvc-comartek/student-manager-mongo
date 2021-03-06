import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import Bull from 'bull';
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
import { MongoId } from '../types/union/mongo-id.union';
import {
  CreateScoreDto,
  DeleteScoreDto,
  SearchScoreDto,
  UpdateScoreDto,
} from './dto';
import { Score, ScoreDocument } from './score.entity';
import { ScoresService } from './scores.service';

@Controller('scores')
export class ScoresController {
  constructor(
    readonly _scoresService: ScoresService,
    readonly _subjectsService: SubjectsService,
    readonly _studentsService: StudentsService,
    readonly _emailService: EmailService,
    readonly _excelService: ExcelService,
  ) {}

  @Post()
  async create(
    @Body()
    { dateToSendMail, hourToSendMail, ...createScoreDto }: CreateScoreDto,
  ) {
    const isStudentExist = await this._studentsService.checkExist({
      _id: createScoreDto.student,
    });
    const isSubjectExist = await this._subjectsService.checkExist({
      _id: createScoreDto.subject,
    });

    if (!isStudentExist || !isSubjectExist)
      HttpExceptionMapper.throw(DatabaseExceptions.REFERENCE_OBJ_NOT_EXIST);

    return this._scoresService
      .create(createScoreDto)
      .then((insertedScore) =>
        this._afterInsertScore(insertedScore, dateToSendMail, hourToSendMail),
      );
  }

  @Patch()
  async update(@Body() updateScoreDto: UpdateScoreDto) {
    let isStudentExist = true;
    let isSubjectExist = true;

    if (updateScoreDto.student)
      isStudentExist = await this._studentsService.checkExist({
        _id: updateScoreDto.student,
      });

    if (updateScoreDto.subject)
      isSubjectExist = await this._subjectsService.checkExist({
        _id: updateScoreDto.subject,
      });

    if (!isStudentExist || !isSubjectExist)
      HttpExceptionMapper.throw(DatabaseExceptions.REFERENCE_OBJ_NOT_EXIST);

    return this._scoresService.update(updateScoreDto);
  }

  @Delete()
  async delete(@Body() deleteScoreDto: DeleteScoreDto) {
    let isStudentExist = false;
    let isSubjectExist = false;

    if (deleteScoreDto.student)
      isStudentExist = await this._studentsService.checkExist({
        _id: deleteScoreDto.student,
      });

    if (deleteScoreDto.subject)
      isSubjectExist = await this._subjectsService.checkExist({
        _id: deleteScoreDto.subject,
      });

    if (isStudentExist || isSubjectExist)
      HttpExceptionMapper.throw(DatabaseExceptions.OBJ_REFERENCED);

    return this._scoresService.delete(deleteScoreDto);
  }

  @Get()
  async search(@Query() searchScoreDto: SearchScoreDto) {
    return this._scoresService.search(searchScoreDto);
  }

  async _afterInsertScore(
    insertedScore: (ScoreDocument & { _id: MongoId })[],
    dateToSendMail: Date,
    hourToSendMail: Boolean,
  ) {
    const searchScore = this._scoresService.search({
      insertedId: insertedScore[0]._id,
      populates: [
        {
          path: 'student',
          populate: {
            path: 'scores',
            populate: {
              path: 'subject',
            },
          },
        },
        { path: 'subject', model: 'Subject' },
      ],
    });
    const readMailSchema = readFile('./xlsx-template/attch-email.xlsx');
    const readMailAllScoresSchema = readFile(
      './xlsx-template/attch-all-scores-email.xlsx',
    );
    const countSubjects = this._subjectsService.countSubjects();

    //Th???c thi ?????ng th???i truy v???n Score v???a t???o v?? ?????c file xlsx schema
    const [scoreResult, schema, schemaAll, numberOfSubjects] =
      await Promise.all([
        searchScore,
        readMailSchema,
        readMailAllScoresSchema,
        countSubjects,
      ]);

    let score: Score;

    //K???t qu??? c?? th??? l?? m???t m???ng Score ho???c m???t Score
    if (Array.isArray(scoreResult)) score = scoreResult[0];
    else score = scoreResult;

    //T???o file excel
    const excelScore = await this._excelService.create<Score>({
      schema,
      data: score,
    });

    //????? d??? li???u v??o schema
    const content = [excelScore];

    //N???u t???t c??? c??c m??n ?????u c?? ??i???m
    if (numberOfSubjects === score.student.scores.length) {
      const excelAllScores = await this._excelService.create<Student>({
        schema: schemaAll,
        data: score.student,
      });

      content.push(excelAllScores);
    }

    let jobOptions = {} as Bull.JobOptions;

    if (dateToSendMail) {
      jobOptions = {
        ...jobOptions,
        delay: dateToSendMail.getMilliseconds() - Date.now(),
      };
    }

    if (hourToSendMail) {
      jobOptions = {
        ...jobOptions,
        delay: 60 * 60 * 1000,
      };
    }

    //G???i email
    this._emailService.sendWhenScoreAdded({
      score,
      content,
      jobOptions,
    });

    return insertedScore;
  }
}
