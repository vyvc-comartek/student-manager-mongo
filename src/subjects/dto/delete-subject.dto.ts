import { Type } from 'class-transformer';
import { IsInt, IsPositive, Length, ValidateIf } from 'class-validator';
export class DeleteSubjectDto {
  @ValidateIf((o) => o.id || !o.name)
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  readonly id?: number;

  @ValidateIf((o) => !o.id || o.name)
  @Length(3, 60)
  readonly name?: string;
}
