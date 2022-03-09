import { Expose } from 'class-transformer';
import { IsMongoId, ValidateIf } from 'class-validator';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

export class DeleteScoreDto {
  @ValidateIf((o) => o.id || !o.subject || !o.student)
  @IsMongoId()
  readonly _id?: string | mongoose.Types.ObjectId;

  @Expose({ name: 'subjectId' })
  @ValidateIf((o) => !o.id || o.subject || o.student)
  @IsMongoId()
  readonly subject?: string | mongoose.Types.ObjectId;

  @Expose({ name: 'studentId' })
  @ValidateIf((o) => !o.id || o.subject || o.student)
  @IsMongoId()
  readonly student?: string | mongoose.Types.ObjectId;
}
