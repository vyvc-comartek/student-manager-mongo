import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, Repository } from 'typeorm';
import { Student } from '../students/student.entity';
import { Subject } from '../subjects/subject.entity';
import {
  CheckExistScoreDto,
  DeleteScoreDto,
  SearchScoreDto,
  UpdateScoreDto,
} from './dto';
import { Score } from './score.entity';

@Injectable()
export class ScoresService {
  constructor(
    @InjectRepository(Score)
    private readonly scoresRepository: Repository<Score>,
  ) {}

  async create({ student, subject, ...createScoreDto }: DeleteScoreDto) {
    const newScore = {
      ...createScoreDto,
      student: { id: student } as Student,
      subject: { id: subject } as Subject,
    };

    return this.scoresRepository.insert(newScore);
  }

  async update({ id, student, subject, score }: UpdateScoreDto) {
    //updateById nếu id được cung cấp, updateByStudentSubjectId nếu id không được cung cấp
    return this.scoresRepository.update(
      id ? { id } : ({ student, subject } as FindConditions<Score>),
      { score },
    );
  }

  async delete({ id, student, subject }: DeleteScoreDto) {
    return this.scoresRepository.delete(
      id ? { id } : ({ student, subject } as FindConditions<Score>),
    );
  }

  async search({ relations, ...searchScoreDto }: SearchScoreDto) {
    return this.scoresRepository.findOne({
      relations,
      where: searchScoreDto,
    });
  }

  async checkExist(checkExistScore: CheckExistScoreDto) {
    return Boolean(
      await this.scoresRepository.findOne({ where: checkExistScore }),
    );
  }
}
