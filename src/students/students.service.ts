import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClassDocument } from '../classes/class.entity';
import { Expression, OperatorKeyMap } from '../modules/expression.collection';
import {
  CheckExistStudentDto,
  CreateStudentDto,
  DeleteStudentDto,
  SearchStudentDto,
  UpdateStudentDto,
} from './dto';
import { StudentDocument } from './student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel('Student')
    private readonly studentModel: Model<StudentDocument>,
    @InjectModel('Class')
    private readonly classModel: Model<ClassDocument>,
  ) {}

  async create({ class: clss, ...createStudentDto }: CreateStudentDto) {
    const newStudent = {
      ...createStudentDto,
      class: clss,
    };

    return this.studentModel.insertMany(newStudent).then((value) => {
      //Cập nhật totalMember trong bảng Class khi insert Student thành công
      this.classModel
        .findOneAndUpdate({ _id: clss }, { $inc: { totalMember: 1 } })
        .exec();

      return value;
    });
  }

  async update({ _id, ...updateStudentDto }: UpdateStudentDto) {
    return this.studentModel.updateOne({ _id }, updateStudentDto).exec();
  }

  async delete({ _id }: DeleteStudentDto) {
    return this.studentModel.deleteOne({ _id }).exec();
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
        result: [await this.studentModel.findOne({ _id }).exec()],
        page: 1,
      };

    let conditions = {};

    if (name) conditions['name'] = { name: { $regex: '.*' + name + '.*' } };

    if (clss) conditions['class'] = { _id: clss };

    if (score) conditions['score'] = this._getScoreCondition(score);

    //Join bảng
    let query = this.studentModel
      .find(conditions['name'])
      .populate({
        path: 'class',
        select: { name: 1 },
        match: conditions['class'],
      })
      .populate({
        path: 'scores',
        select: { score: 1 },
        match: conditions['score'],
      });

    title = `${typeof score === 'object' ? score.join(' ') : score}`;

    //Thực hiện nhảy tới trang cần get dựa trên page và itemsPerPage
    if (itemsPerPage && page)
      query = query.skip((page - 1) * itemsPerPage).limit(itemsPerPage);

    return {
      title: title,
      result: (await query.lean().exec()).filter((q) => q.scores.length > 0),
      page: page,
    };
  }

  async searchById({ _id }: Pick<SearchStudentDto, '_id'>) {
    return this.studentModel.findOne({ _id }).exec();
  }

  private _getScoreCondition(score: Expression) {
    //score=<number>
    if (typeof score === 'string') return +score;

    //Ví dụ giá trị của op1: {$gte: 6.5}
    const op1 = {
      [`$${OperatorKeyMap.get(score[0]).toLocaleLowerCase()}`]: +score[1],
    };

    //score=<operator><number>
    if (score.length === 2) return { score: op1 };

    //Ví dụ giá trị của op2: {$lte: 6.5}
    const op2 = {
      [`$${OperatorKeyMap.get(score[3]).toLocaleLowerCase()}`]: +score[4],
    };
    const bitwise = `$${score[2].toLocaleLowerCase()}`;

    //score=<operator><number><bitwise><operator><number>
    return {
      [bitwise]: [{ score: op1 }, { score: op2 }],
    };
  }

  async checkExist(checkExistStudentDto: CheckExistStudentDto) {
    return Boolean(
      await this.studentModel.findOne(checkExistStudentDto).exec(),
    );
  }
}
