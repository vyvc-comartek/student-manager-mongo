import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CheckExistSubjectDto,
  CreateSubjectDto,
  DeleteSubjectDto,
  SearchSubjectDto,
  UpdateSubjectDto,
} from './dto';
import { SubjectDocument } from './subject.entity';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel('Subject')
    private readonly subjectModel: Model<SubjectDocument>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto) {
    return this.subjectModel.insertMany(createSubjectDto);
  }

  async update({ _id, name, type }: UpdateSubjectDto) {
    if (_id && name)
      return this.subjectModel
        .updateOne({ _id }, { name, type }, { new: true })
        .lean()
        .exec();

    if (_id && !name)
      return this.subjectModel
        .updateOne({ _id }, { type }, { new: true })
        .lean()
        .exec();

    return this.subjectModel
      .updateOne({ name }, { type }, { new: true })
      .lean()
      .exec();
  }

  async delete({ _id, name }: DeleteSubjectDto) {
    const condition = _id ? { _id } : { name };

    return this.subjectModel.deleteOne(condition).lean().exec();
  }

  async search(searchSubjectDto: SearchSubjectDto) {
    return this.subjectModel.find(searchSubjectDto).lean().exec();
  }

  async checkExist(checkExistSubject: CheckExistSubjectDto) {
    return Boolean(
      await this.subjectModel.findOne(checkExistSubject).lean().exec(),
    );
  }

  async countSubjects() {
    return this.subjectModel.count().lean().exec();
  }
}
