import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class CheckExistStudentDto {
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  readonly class?: number;

  @IsPositive()
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  readonly id?: number;
}
