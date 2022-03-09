import { Expose, Type } from 'class-transformer';
import { IsMongoId, Max, Min, ValidateIf } from 'class-validator';
import { ObjectId } from 'mongodb';

export class UpdateScoreDto {
  @ValidateIf((o) => o.id || !o.subject || !o.student)
  @IsMongoId()
  readonly _id?: string | ObjectId;

  @Expose({ name: 'studentId' })
  @ValidateIf((o) => !o.id || (o.subject && o.student))
  @IsMongoId()
  readonly student?: string | ObjectId;

  @Expose({ name: 'subjectId' })
  @ValidateIf((o) => !o.id || (o.subject && o.student))
  @IsMongoId()
  readonly subject?: string | ObjectId;

  @Min(1)
  @Max(10)
  @Type(() => Number)
  readonly score: number;
}
