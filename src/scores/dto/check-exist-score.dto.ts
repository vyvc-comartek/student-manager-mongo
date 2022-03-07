import { Expose, Type } from 'class-transformer';
import { IsPositive, IsInt, IsOptional } from 'class-validator';

export class CheckExistScoreDto {
  @IsPositive()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  readonly subject?: number;

  @IsPositive()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  readonly student?: number;
}
