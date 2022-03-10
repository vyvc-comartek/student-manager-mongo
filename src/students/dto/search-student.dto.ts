import { Expose, Transform } from 'class-transformer';
import {
  IsEnum,
  IsMongoId,
  IsOptional,
  Length,
  matches,
} from 'class-validator';
import { ObjectId } from 'mongodb';
import { PaginationDto } from 'src/modules/pagination.dto';
import { Expression } from '../../modules/expression.collection';

export class SearchStudentDto extends PaginationDto {
  @IsOptional()
  @IsMongoId()
  readonly _id?: string | ObjectId;

  @Length(1, 60)
  @IsOptional()
  readonly name?: string;

  @Expose({ name: 'classId' })
  @IsMongoId()
  @IsOptional()
  readonly class?: string | ObjectId;

  /**
   * Định dạng score được truyền có thể là một trong 3 kiểu sau:
   * - Giá trị cụ thể: score=6.23
   * - Trong khoảng trái (hoặc phải) của trục số: score=>=5.55
   * - Trong khoảng giữa của trục số: score=<=5.2OR>8.2
   */
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
  readonly score?: Expression;

  @IsEnum({
    NORMAL: 'NORMAL',
    AVG: 'AVG',
  })
  @IsOptional()
  readonly mode?: 'NORMAL' | 'AVG' = 'NORMAL';
}
