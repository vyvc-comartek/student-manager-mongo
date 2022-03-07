import { Expose, Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  Length,
  matches,
} from 'class-validator';
import { PaginationDto } from 'src/modules/pagination.dto';

export class SearchStudentDto extends PaginationDto {
  @IsPositive()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  readonly id?: number;

  @Length(1, 60)
  @IsOptional()
  readonly name?: string;

  @Expose({ name: 'classId' })
  @IsPositive()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  readonly class?: number;

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
        /([<>]=?)?\d\d?(.\d\d?)?((AND|OR)([<>]\=?)\d\d?(.\d\d?)?)?/g,
      )
    )
      return null;

    //Phân tách thành dựa trên các group
    const values = (value as string).match(
      /(([<>]=?)?\d\d?(.\d\d?)?)((AND|OR)(([<>]=?)\d\d?(.\d\d?)?))?/,
    );

    //Lấy ra các giá trị cần thiết cho các trường hợp
    if (values.at(-1)) return [values[1], values[5], values[6]];
    else return values[0];
  })
  readonly score?: string | [string, 'AND' | 'OR', string] | null;

  @IsEnum({
    NORMAL: 'NORMAL',
    AVG: 'AVG',
  })
  @IsOptional()
  readonly mode?: 'NORMAL' | 'AVG' = 'NORMAL';
}
