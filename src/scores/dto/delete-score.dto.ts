import { ArgsType, Field } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsMongoId, ValidateIf } from 'class-validator';
import mongoose from 'mongoose';

@ArgsType()
export class DeleteScoreDto {
  @Field(() => String)
  @ValidateIf((o) => o.id || !o.subject || !o.student)
  @IsMongoId()
  readonly _id?: string | mongoose.Types.ObjectId;

  @Field(() => String)
  @Expose({ name: 'subjectId' })
  @ValidateIf((o) => !o.id || o.subject || o.student)
  @IsMongoId()
  readonly subject?: string | mongoose.Types.ObjectId;

  @Field(() => String)
  @Expose({ name: 'studentId' })
  @ValidateIf((o) => !o.id || o.subject || o.student)
  @IsMongoId()
  readonly student?: string | mongoose.Types.ObjectId;
}
