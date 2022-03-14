import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import {
  CheckExistScoreDto,
  CreateScoreDto,
  DeleteScoreDto,
  SearchScoreDto,
  UpdateScoreDto,
} from './dto';
import { ScoreDocument } from './score.entity';

@Injectable()
export class ScoresService {
  constructor(
    @InjectModel('Score')
    private readonly scoreModel: Model<ScoreDocument>,
  ) {}

  async create(createScoreDto: CreateScoreDto) {
    return this.scoreModel.insertMany(createScoreDto);
  }

  async update({ _id, student, subject, score }: UpdateScoreDto) {
    //updateById nếu id được cung cấp, updateByStudentSubjectId nếu id không được cung cấp
    const condition = _id ? { _id } : { student, subject };

    return this.scoreModel
      .updateOne(condition, { score }, { new: true })
      .lean()
      .exec();
  }

  async delete({ _id, student, subject }: DeleteScoreDto) {
    const condition = _id ? { _id } : { student, subject };

    return this.scoreModel.deleteOne(condition).lean().exec();
  }

  async search({ populates, insertedId, ...searchScoreDto }: SearchScoreDto) {
    let _id: ObjectId;

    if (typeof insertedId === 'string')
      _id = ObjectId.createFromHexString(insertedId);
    if (typeof insertedId === 'object') _id = insertedId;

    let query = this.scoreModel.find(_id || searchScoreDto);

    if (populates)
      for (let i = populates.length - 1; i >= 0; i--) {
        query = query.populate(populates[i]);
      }

    return query.lean().exec();
  }

  async checkExist(checkExistScore: CheckExistScoreDto) {
    return Boolean(
      await this.scoreModel.findOne(checkExistScore).lean().exec(),
    );
  }
}
