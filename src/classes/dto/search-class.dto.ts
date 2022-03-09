import { Transform } from 'class-transformer';
import { IsEnum, IsMongoId, IsOptional, Length } from 'class-validator';
import { PaginationDto } from 'src/modules/pagination.dto';
import { Expression } from '../../modules/expression.collection';
import mongoose from 'mongoose';
export class SearchClassDto extends PaginationDto {
  @IsMongoId()
  @IsOptional()
  readonly _id?: string | mongoose.Types.ObjectId;

  @Length(1, 60)
  @IsOptional()
  readonly name?: string;

  /**
   * totalMember được truyền có thể là một trong 3 kiểu sau:
   * - Cố định: totalMember=10
   * - Trong khoảng trái hoặc phải của trục số: totalMember=>=5
   * - Trong khoảng giữa của trục số: totalMember=<=5OR>8
   */
  @IsOptional()
  @Transform(({ value }) => {
    const values = (value as string).match(
      /([<>]=?)?(\d+)((AND|OR)([<>]=?)(\d+))?/,
    );
    if (values.at(-1))
      return [values[1], values[2], values[4], values[5], values[6]];
    else if (values[1]) return [values[1], values[2]];
    else return values[0];
  })
  readonly totalMember?: Expression;

  @Length(1, 60)
  @IsOptional()
  readonly teacherName?: string;

  @IsEnum({
    AND: 'AND',
    OR: 'OR',
  })
  @IsOptional()
  readonly operator: 'AND' | 'OR';
}
