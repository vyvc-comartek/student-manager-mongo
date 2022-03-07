import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from 'src/subjects/subject.entity';
import { Repository } from 'typeorm';
import {
  CheckExistSubjectDto,
  CreateSubjectDto,
  DeleteSubjectDto,
  SearchSubjectDto,
  UpdateSubjectDto,
} from './dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectsRepository: Repository<Subject>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto) {
    return this.subjectsRepository.insert(createSubjectDto);
  }

  async update({ id, name, type }: UpdateSubjectDto) {
    if (id && name)
      return this.subjectsRepository.update({ id }, { name, type });

    if (id && !name) return this.subjectsRepository.update({ id }, { type });

    return this.subjectsRepository.update({ name }, { type });
  }

  async delete({ id, name }: DeleteSubjectDto) {
    return this.subjectsRepository.delete(id ? { id } : { name });
  }

  async search(searchSubjectDto: SearchSubjectDto) {
    return this.subjectsRepository.findOne(searchSubjectDto);
  }

  async checkExist(checkExistSubject: CheckExistSubjectDto) {
    return Boolean(
      await this.subjectsRepository.findOne({ where: checkExistSubject }),
    );
  }

  async countSubjects() {
    return this.subjectsRepository.count();
  }
}
