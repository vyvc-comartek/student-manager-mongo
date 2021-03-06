import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';
import { Expose, Transform } from 'class-transformer';
import {
  IsEnum,
  IsMongoId,
  IsOptional,
  Length,
  matches,
} from 'class-validator';
import { PaginationDto } from 'src/modules/pagination.dto';
import { SearchStudentMode } from 'src/types/enum/search-student-mode.enum';
import { SearchExpression } from 'src/types/union/search-expression.union';
import { MongoId } from '../../types/union/mongo-id.union';
import { Student } from '../student.entity';

@ArgsType()
export class SearchStudentDto extends PaginationDto {
  @Field(() => String)
  @IsOptional()
  @IsMongoId()
  readonly _id?: MongoId;

  @Length(1, 60)
  @IsOptional()
  readonly name?: string;

  @Field(() => String, { name: 'classId' })
  @Expose({ name: 'classId' })
  @IsMongoId()
  @IsOptional()
  readonly class?: MongoId;

  /**
   * Định dạng score được truyền có thể là một trong 3 kiểu sau:
   * - Giá trị cụ thể: score=6.23
   * - Trong khoảng trái (hoặc phải) của trục số: score=>=5.55
   * - Trong khoảng giữa của trục số: score=<=5.2OR>8.2
   */
  @Field(() => String)
  @IsOptional()
  @Transform(({ value }) => {
    //Nếu không khớp định dạng, trả về null
    if (
      !matches(
        value,
        /([<>]=?)?(\d\d?(.\d\d?)?)((AND|OR)([<>]=?)(\d\d?(.\d\d?)?))?/g,
      )
    )
      return null;

    //Phân tách thành dựa trên các group
    const values = (value as string).match(
      /([<>]=?)?(\d\d?(.\d\d?)?)((AND|OR)([<>]=?)(\d\d?(.\d\d?)?))?/,
    );

    //Lấy ra các giá trị cần thiết cho các trường hợp
    if (values.at(-2))
      return [values[1], values[2], values[5], values[6], values[7]];
    else if (values[1]) return [values[1], values[2]];
    return values[0];
  })
  readonly score?: SearchExpression;

  @IsEnum(SearchStudentMode)
  @IsOptional()
  readonly mode?: SearchStudentMode = SearchStudentMode.NORMAL;
}

@ObjectType()
export class SearchStudentResult {
  title: string;

  result: Student[];

  @Field(() => Int)
  page: number;
}
