import { Expose, Type } from 'class-transformer';
import { IsMongoId, Max, Min } from 'class-validator';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
export class CreateScoreDto {
  @Expose({ name: 'studentId' })
  @IsMongoId()
  readonly student: string | mongoose.Types.ObjectId;

  @Expose({ name: 'subjectId' })
  @IsMongoId()
  readonly subject: string | mongoose.Types.ObjectId;

  @Min(1)
  @Max(10)
  @Type(() => Number)
  readonly score: number;
}
