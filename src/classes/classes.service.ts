import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like as ILike, ObjectLiteral, Raw, Repository } from 'typeorm';
import { Class } from './class.entity';
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
    @InjectRepository(Class)
    private readonly classesRepository: Repository<Class>,
  ) {}

  async create(createClassDto: CreateClassDto) {
    return this.classesRepository.insert(createClassDto);
  }

  async update({ id, ...classProps }: UpdateClassDto) {
    return this.classesRepository.update({ id }, classProps);
  }

  async delete({ id }: DeleteClassDto) {
    return this.classesRepository.delete({ id });
  }

  async search({
    id,
    name,
    totalMember,
    teacherName,
    operator,
    itemsPerPage,
    page,
  }: SearchClassDto) {
    //Nếu có trường id, trả về 1 kết quả dựa trên id
    if (id) return this.classesRepository.findOne(id);

    //Nếu không có trường id, tạo queryBuilder
    let queryBuilder = this.classesRepository.createQueryBuilder();

    //Thực hiện nhảy tới trang cần get dựa trên page và itemsPerPage
    queryBuilder = queryBuilder
      .skip((page - 1) * itemsPerPage)
      .take(itemsPerPage);

    //Nếu là toán tử AND
    if (operator === 'AND')
      //Nếu một thuộc tính có value là undefined thì typeorm có bỏ qua nó không?
      queryBuilder = queryBuilder.where({
        name: name && ILike(`%${name}%`),
        teacherName: teacherName && ILike(`%${teacherName}%`),
        totalMember: totalMember && this._totalMemberSearchRaw(totalMember),
      } as ObjectLiteral);

    //Nếu là toán tử OR
    if (operator === 'OR')
      //Nếu một thuộc tính có value là undefined thì typeorm có bỏ qua nó không?
      queryBuilder = queryBuilder.where([
        { name: name && ILike(`%${name}%`) },
        { teacherName: teacherName && ILike(`%${teacherName}%`) },
        { totalMember: totalMember && this._totalMemberSearchRaw(totalMember) },
      ] as ObjectLiteral[]);

    return queryBuilder.getMany();
  }

  async checkExist(checkExistClassDto: CheckExistClassDto) {
    return Boolean(
      await this.classesRepository.findOne({ where: checkExistClassDto }),
    );
  }

  //Hàm xử lý biểu thức của tham số totalMember thành giá trị hợp lệ khi thực hiện tìm kiếm
  private _totalMemberSearchRaw(
    totalMember: string | [string, 'AND' | 'OR', string],
  ) {
    if (typeof totalMember === 'string')
      return Raw((alias) => alias + totalMember);
    else
      return Raw(
        (alias) =>
          `${alias}${totalMember[0]} ${totalMember[1]} ${alias}${totalMember[2]}`,
      );
  }
}
