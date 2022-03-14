import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompareOperatorKeyMap } from 'src/types/enum/compare-operators.enum';
import { SearchExpression } from 'src/types/union/search-expression.union';
import { Class, ClassDocument } from './class.entity';
import {
  CheckExistClassDto,
  CreateClassDto,
  DeleteClassDto,
  SearchClassDto,
  UpdateClassDto,
} from './dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectModel('Class')
    private readonly classesModel: Model<ClassDocument>,
  ) {}

  async create(createClassDto: CreateClassDto) {
    return this.classesModel.insertMany(createClassDto);
  }

  async update({ _id, ...classProps }: UpdateClassDto) {
    return this.classesModel
      .updateOne({ _id }, classProps, { new: true })
      .lean()
      .exec();
  }

  async delete({ _id }: DeleteClassDto) {
    return this.classesModel.deleteOne({ _id }).lean().exec();
  }

  async search({
    _id,
    name,
    totalMember,
    teacherName,
    operator,
    itemsPerPage,
    page,
  }: SearchClassDto) {
    //Nếu có trường id
    if (_id) return this.classesModel.find({ _id }).lean().exec();

    const conditions = [];

    if (name) conditions.push({ name: { $regex: `.*${name}.*` } });

    if (teacherName)
      conditions.push({
        teacherName: { $regex: `.*${teacherName}.*` },
      });

    if (totalMember) conditions.push(this._totalMemberSearchRaw(totalMember));

    let query = this.classesModel.find();

    if (operator === 'AND' && conditions.length) query = query.and(conditions);
    if (operator === 'OR' && conditions.length) query = query.or(conditions);

    //Thực hiện nhảy tới trang cần get dựa trên page và itemsPerPage
    query = query.skip((page - 1) * itemsPerPage).limit(itemsPerPage);

    return query.lean().exec();
  }

  async checkExist({ _id, ...checkExistClassDto }: CheckExistClassDto) {
    const condition = _id ? { _id } : checkExistClassDto;

    return Boolean(await this.classesModel.exists(condition).lean().exec());
  }

  async updateTotalMember(clss: Class) {
    return this.classesModel
      .findOneAndUpdate(clss, { $inc: { totalMember: 1 } })
      .lean()
      .exec();
  }

  //Hàm xử lý biểu thức của tham số totalMember thành giá trị hợp lệ khi thực hiện tìm kiếm
  private _totalMemberSearchRaw(totalMember: SearchExpression) {
    if (typeof totalMember === 'string') return { totalMember: +totalMember };

    const op1 = `$${CompareOperatorKeyMap.get(
      totalMember[0],
    ).toLocaleLowerCase()}`;

    if (totalMember.length === 2)
      return {
        totalMember: { [op1]: +totalMember[1] },
      };

    const op2 = `$${CompareOperatorKeyMap.get(
      totalMember[3],
    ).toLocaleLowerCase()}`;
    const bitwise = `$${totalMember[2].toLocaleLowerCase()}`;

    return {
      [bitwise]: [
        { totalMember: { [op1]: totalMember[1] } },
        { totalMember: { [op2]: totalMember[4] } },
      ],
    };
  }
}
