import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CheckExistScoreDto,
  CreateScoreDto,
  DeleteScoreDto,
  SearchScoreDto,
  UpdateScoreDto,
} from './dto';
import { Score, ScoreDocument } from './score.entity';

@Injectable()
export class ScoresService {
  constructor(
    @InjectModel(Score.name)
    private readonly scoreModel: Model<ScoreDocument>,
  ) {}

  async create(createScoreDto: CreateScoreDto) {
    return this.scoreModel.insertMany(createScoreDto);
  }

  async update({ _id, student, subject, score }: UpdateScoreDto) {
    //updateById nếu id được cung cấp, updateByStudentSubjectId nếu id không được cung cấp
    return this.scoreModel
      .updateOne(_id ? { _id } : { student, subject }, {
        score,
      })
      .exec();
  }

  async delete({ _id, student, subject }: DeleteScoreDto) {
    return this.scoreModel
      .deleteOne(_id ? { _id } : { student, subject })
      .exec();
  }

  async search({ populates, insertedId, ...searchScoreDto }: SearchScoreDto) {
    let query = this.scoreModel.findOne(insertedId || searchScoreDto);

    for (let i = populates.length - 1; i >= 0; i--) {
      query = query.populate(populates[i]);
    }

    return query.exec();
  }

  async checkExist(checkExistScore: CheckExistScoreDto) {
    return Boolean(await this.scoreModel.findOne(checkExistScore).exec());
  }
}
