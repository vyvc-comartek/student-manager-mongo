import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Length } from 'class-validator';

export class UpdateClassDto {
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  readonly id: number;

  @Length(3, 60)
  @IsOptional()
  readonly name?: string;

  @Length(3, 60)
  @IsOptional()
  readonly teacherName?: string;
}
