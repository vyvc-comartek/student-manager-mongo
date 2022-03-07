import { Expose, Type } from 'class-transformer';
import { IsInt, IsPositive, Max, Min, ValidateIf } from 'class-validator';

export class UpdateScoreDto {
  @ValidateIf((o) => o.id || !o.subject || !o.student)
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  readonly id?: number;

  @Expose({ name: 'studentId' })
  @ValidateIf((o) => !o.id || (o.subject && o.student))
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  readonly student?: number;

  @Expose({ name: 'subjectId' })
  @ValidateIf((o) => !o.id || (o.subject && o.student))
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  readonly subject?: number;

  @Min(1)
  @Max(10)
  @Type(() => Number)
  readonly score: number;
}
