import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class DeleteClassDto {
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  readonly id: number;
}
