import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from 'src/classes/class.entity';
import { ILike, Raw, Repository, SelectQueryBuilder } from 'typeorm';
import { Score } from '../scores/score.entity';
import {
  CheckExistStudentDto,
  CreateStudentDto,
  DeleteStudentDto,
  SearchStudentDto,
  UpdateStudentDto,
} from './dto';
import { Student } from './student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    @InjectRepository(Class)
    private readonly classesRepository: Repository<Class>,
  ) {}

  async create({ class: clss, ...createStudentDto }: CreateStudentDto) {
    const newStudent = {
      ...createStudentDto,
      class: { id: clss } as Class,
    };

    return this.studentsRepository.insert(newStudent).then((value) => {
      //Cập nhật totalMember trong bảng Class khi insert Student thành công
      this.classesRepository.increment({ id: clss }, 'totalMember', 1);

      return value;
    });
  }

  async update({ id, class: clss, ...updateStudentDto }: UpdateStudentDto) {
    const newStudent = {
      ...updateStudentDto,
      class: { id: clss } as Class,
    };

    return this.studentsRepository.update({ id }, newStudent);
  }

  async delete({ id }: DeleteStudentDto) {
    return this.studentsRepository.delete({ id });
  }

  async search({
    id,
    name,
    class: clss,
    score,
    mode,
    itemsPerPage,
    page,
  }: SearchStudentDto) {
    let title = '';

    //Nếu có trường id, trả về 1 kết quả dựa trên id
    if (id)
      return {
        result: [await this.studentsRepository.findOne(id)],
        page: 1,
      };

    //Nếu không có trường id, tạo queryBuilder
    let queryBuilder = this.studentsRepository.createQueryBuilder();

    //Join bảng
    queryBuilder = queryBuilder
      .leftJoin('Student.class', 'Class')
      .leftJoin('Student.scores', 'Score')
      .addSelect(['Student.*', 'Class.id', 'Class.name', 'Score.score']);

    if (score && mode === 'NORMAL')
      queryBuilder = await this.buildSearchByScore({ score }, queryBuilder);

    if (score && mode === 'AVG') {
      queryBuilder = await this.buildSearchByAvgScore({ score }, queryBuilder);

      title = `${typeof score === 'string' ? score : score.join(' ')}`;
    }

    if (name)
      queryBuilder = await this.buildSearchByName({ name }, queryBuilder);

    if (clss)
      queryBuilder = await this.buildSearchByClass(
        { class: clss },
        queryBuilder,
      );

    //Thực hiện nhảy tới trang cần get dựa trên page và itemsPerPage
    if (itemsPerPage && page)
      queryBuilder = queryBuilder
        .skip((page - 1) * itemsPerPage)
        .take(itemsPerPage);

    return {
      title: title,
      result: await queryBuilder.getMany(),
      page: page,
    };
  }

  async searchById(picker: Pick<SearchStudentDto, 'id'>) {
    return this.studentsRepository.findOne(picker.id);
  }

  /**
   * Hàm này được tách ra từ search(), lý do chia tách:
   * Để dễ dàng tạo thêm chức năng searchByScore() riêng nếu muốn
   */
  async buildSearchByScore(
    picker: Pick<SearchStudentDto, 'score'>,
    builder: SelectQueryBuilder<Student>,
  ) {
    return (
      builder
        .addSelect((sq) => {
          //Đếm số môn mà học sinh đã tham gia học
          return sq
            .select('COUNT(Score.id)', 'countSubject')
            .from(Score, 'Score')
            .where('Score.studentId=Student.id');
        }, 'countSubject')
        .addSelect((sq) => {
          //Đếm số môn mà học sinh đã tham gia học và đạt điểm trong khoảng <score>
          return sq
            .select('COUNT(Score.id)', 'countScore')
            .from(Score, 'Score')
            .where({
              score: this._getScoreCondition(picker.score),
            })
            .andWhere('Score.studentId=Student.id');
        }, 'countScore')
        //Nếu số môn tham gia học = Số môn đạt điểm cao thì select student này
        .having('countSubject=countScore')
    );
  }

  async buildSearchByAvgScore(
    picker: Pick<SearchStudentDto, 'score'>,
    builder: SelectQueryBuilder<Student>,
  ) {
    return builder
      .addSelect((sq) => {
        //Tính trung bình điểm
        return sq
          .addSelect('AVG(Score.score)', 'scoreAvg')
          .from(Score, 'Score')
          .where('Score.studentId=Student.id');
      }, 'scoreAvg')
      .having(this._getScoreCondition(picker.score).getSql('scoreAvg'));
  }

  async buildSearchByName(
    picker: Pick<SearchStudentDto, 'name'>,
    builder: SelectQueryBuilder<Student>,
  ) {
    return builder.andWhere({
      name: ILike(`%${picker.name}%`),
    });
  }

  async buildSearchByClass(
    picker: Pick<SearchStudentDto, 'class'>,
    builder: SelectQueryBuilder<Student>,
  ) {
    return builder.andWhere({
      class: picker.class,
    });
  }

  private _getScoreCondition(score: string | [string, 'AND' | 'OR', string]) {
    if (typeof score === 'string') return Raw((alias) => alias + score);
    else
      return Raw(
        (alias) => `${alias}${score[0]} ${score[1]} ${alias}${score[2]}`, //score>=7.8 AND score<=9
      );
  }

  async checkExist(checkExistStudent: CheckExistStudentDto) {
    return Boolean(
      await this.studentsRepository.findOne({ where: checkExistStudent }),
    );
  }
}
