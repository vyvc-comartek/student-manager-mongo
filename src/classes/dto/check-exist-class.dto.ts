import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class CheckExistClassDto {
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  readonly id?: number;
}
