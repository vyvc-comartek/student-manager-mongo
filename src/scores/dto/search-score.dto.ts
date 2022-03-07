import { Expose, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsInt,
  IsOptional,
  IsPositive,
  Matches,
} from 'class-validator';

export class SearchScoreDto {
  @IsPositive()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  readonly id?: number;

  @Matches(/\d(.\d)?([><]=?\d(.\d)?)?/g)
  @IsOptional()
  readonly score?: string;

  @Expose({ name: 'subjectId' })
  @IsPositive()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  readonly subject?: number;

  @Expose({ name: 'studentId' })
  @IsPositive()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  readonly student?: number;

  @ArrayMaxSize(6)
  @IsOptional()
  readonly relations?: string[] = ['student', 'subject'];
}
