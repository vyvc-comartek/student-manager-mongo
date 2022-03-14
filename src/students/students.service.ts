import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompareOperatorKeyMap } from 'src/types/enum/compare-operators.enum';
import { SearchExpression } from 'src/types/union/search-expression.union';
import {
  CheckExistStudentDto,
  CreateStudentDto,
  DeleteStudentDto,
  SearchStudentDto,
  SearchStudentResult,
  UpdateStudentDto,
} from './dto';
import { StudentDocument } from './student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel('Student')
    private readonly studentModel: Model<StudentDocument>,
  ) {}

  async create({ class: clss, ...createStudentDto }: CreateStudentDto) {
    const newStudent = {
      ...createStudentDto,
      class: clss,
    };

    return this.studentModel.insertMany(newStudent);
  }

  async update({ _id, ...updateStudentDto }: UpdateStudentDto) {
    return this.studentModel
      .updateOne({ _id }, updateStudentDto, { new: true })
      .lean()
      .exec();
  }

  async delete({ _id }: DeleteStudentDto) {
    return this.studentModel.deleteOne({ _id }).lean().exec();
  }

  async search({
    _id,
    name,
    class: clss,
    score,
    itemsPerPage,
    page,
  }: SearchStudentDto) {
    let title = '';

    //Nếu có trường id, trả về 1 kết quả dựa trên id
    if (_id)
      return {
        result: await this.studentModel.find({ _id }).lean().exec(),
        page: 1,
        title,
      } as SearchStudentResult;

    let conditions = {};

    if (name) conditions['name'] = { name: { $regex: '.*' + name + '.*' } };

    if (clss) conditions['class'] = { class: clss };

    let query = this.studentModel.find({
      ...conditions['name'],
      ...conditions['class'],
    });

    if (score) {
      conditions['score'] = this._getScoreCondition(score);

      //Join bảng
      query = query
        .populate({
          path: 'class',
        })
        .populate({
          path: 'scores',
          match: conditions['score'],
        });

      title = `${typeof score === 'object' ? score.join(' ') : score}`;
    }

    //Thực hiện nhảy tới trang cần get dựa trên page và itemsPerPage
    if (itemsPerPage && page)
      query = query.skip((page - 1) * itemsPerPage).limit(itemsPerPage);

    return {
      title: title,
      result: (await query.lean().exec()).filter(
        (q) => (q.scores ? q.scores.length : 1) > 0,
      ),
      page: page,
    } as SearchStudentResult;
  }

  async searchById({ _id }: Pick<SearchStudentDto, '_id'>) {
    return this.studentModel.findOne({ _id }).lean().exec();
  }

  private _getScoreCondition(score: SearchExpression) {
    //score=<number>
    if (typeof score === 'string') return { score: +score };

    //Giá trị của op1 có dạng: {$gte: 6.5}
    const op1 = {
      [`$${CompareOperatorKeyMap.get(score[0]).toLocaleLowerCase()}`]:
        +score[1],
    };

    //score=<operator><number>
    if (score.length === 2) return { score: op1 };

    //Giá trị của op2 có dạng: {$lte: 6.5}
    const op2 = {
      [`$${CompareOperatorKeyMap.get(score[3]).toLocaleLowerCase()}`]:
        +score[4],
    };
    const bitwise = `$${score[2].toLocaleLowerCase()}`;

    //score=<operator><number><bitwise><operator><number>
    return {
      [bitwise]: [{ score: op1 }, { score: op2 }],
    };
  }

  async checkExist(checkExistStudentDto: CheckExistStudentDto) {
    return Boolean(
      await this.studentModel.findOne(checkExistStudentDto).lean().exec(),
    );
  }
}
