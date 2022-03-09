import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expression, Operators } from '../modules/expression.collection';
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
    @InjectModel(Class.name)
    private readonly classesModel: Model<ClassDocument>,
  ) {}

  async create(createClassDto: CreateClassDto) {
    return this.classesModel.insertMany(createClassDto);
  }

  async update({ _id, ...classProps }: UpdateClassDto) {
    return this.classesModel.updateOne({ _id }, classProps).exec();
  }

  async delete({ _id }: DeleteClassDto) {
    return this.classesModel.deleteOne({ _id }).exec();
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
    //Nếu có trường id, trả về 1 kết quả dựa trên id
    if (_id) return;
    await this.classesModel.findOne({ _id }).exec();

    const conditions = [];

    if (name) conditions.push({ name: { $regex: `.*${name}.*` } });

    if (teacherName)
      conditions.push({
        teacherName: { $regex: `.*${teacherName}.*` },
      });

    if (totalMember)
      conditions.push({
        totalMember: this._totalMemberSearchRaw(totalMember),
      });

    let query = this.classesModel.find();

    if (operator === 'AND') query = query.and(conditions);
    if (operator === 'OR') query = query.or(conditions);

    //Thực hiện nhảy tới trang cần get dựa trên page và itemsPerPage
    query = query.skip((page - 1) * itemsPerPage).limit(itemsPerPage);

    return query.lean().exec();
  }

  async checkExist({ _id, ...checkExistClassDto }: CheckExistClassDto) {
    return Boolean(
      await this.classesModel.exists(_id ? { _id } : checkExistClassDto).exec(),
    );
  }

  //Hàm xử lý biểu thức của tham số totalMember thành giá trị hợp lệ khi thực hiện tìm kiếm
  private _totalMemberSearchRaw(totalMember: Expression) {
    if (typeof totalMember === 'string') return +totalMember;

    const op1 = `$${(Operators[totalMember[0]] as string).toLocaleLowerCase()}`;

    if (totalMember.length === 2) {
      return {
        [op1]: +totalMember[1],
      };
    }

    const op2 = `$${(Operators[totalMember[3]] as string).toLocaleLowerCase()}`;
    const bitwise = `$${totalMember[2].toLocaleLowerCase()}`;

    return {
      [bitwise]: [{ [op1]: totalMember[1] }, { [op2]: totalMember[4] }],
    };
  }
}
