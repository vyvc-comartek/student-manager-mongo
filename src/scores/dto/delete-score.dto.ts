import { Expose, Type } from 'class-transformer';
import { IsInt, IsPositive, ValidateIf } from 'class-validator';

export class DeleteScoreDto {
  @ValidateIf((o) => o.id || !o.subject || !o.student)
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  readonly id?: number;

  @Expose({ name: 'subjectId' })
  @ValidateIf((o) => !o.id || o.subject || o.student)
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  readonly subject?: number;

  @Expose({ name: 'studentId' })
  @ValidateIf((o) => !o.id || o.subject || o.student)
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  readonly student?: number;
}
