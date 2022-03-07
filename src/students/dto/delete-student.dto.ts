import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class DeleteStudentDto {
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  readonly id: number;
}
