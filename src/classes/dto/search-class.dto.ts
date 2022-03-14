import { ArgsType, Field } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsEnum, IsMongoId, IsOptional, Length } from 'class-validator';
import { PaginationDto } from 'src/modules/pagination.dto';
import { MongoId } from 'src/types/union/mongo-id.union';
import { SearchExpression } from 'src/types/union/search-expression.union';
import { SearchBitwises } from '../../types/enum/search-bitwises.enum';

@ArgsType()
export class SearchClassDto extends PaginationDto {
  @Field(() => String)
  @IsMongoId()
  @IsOptional()
  readonly _id?: MongoId;

  @Length(1, 60)
  @IsOptional()
  readonly name?: string;

  /**
   * totalMember được truyền có thể là một trong 3 kiểu sau:
   * - Cố định: totalMember=10
   * - Trong khoảng trái hoặc phải của trục số: totalMember=>=5
   * - Trong khoảng giữa của trục số: totalMember=<=5OR>8
   */
  @Field(() => String)
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
  readonly totalMember?: SearchExpression;

  @Length(1, 60)
  @IsOptional()
  readonly teacherName?: string;

  @IsEnum(SearchBitwises)
  @IsOptional()
  readonly operator?: SearchBitwises = SearchBitwises.AND;
}
