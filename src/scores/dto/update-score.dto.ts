import { ArgsType, Field } from '@nestjs/graphql';
import { Expose, Type } from 'class-transformer';
import { IsMongoId, Max, Min, ValidateIf } from 'class-validator';
import mongoose from 'mongoose';

@ArgsType()
export class UpdateScoreDto {
  @Field(() => String)
  @ValidateIf((o) => o.id || !o.subject || !o.student)
  @IsMongoId()
  readonly _id?: string | mongoose.Types.ObjectId;

  @Field(() => String)
  @Expose({ name: 'studentId' })
  @ValidateIf((o) => !o.id || (o.subject && o.student))
  @IsMongoId()
  readonly student?: string | mongoose.Types.ObjectId;

  @Field(() => String)
  @Expose({ name: 'subjectId' })
  @ValidateIf((o) => !o.id || (o.subject && o.student))
  @IsMongoId()
  readonly subject?: string | mongoose.Types.ObjectId;

  @Min(1)
  @Max(10)
  @Type(() => Number)
  readonly score: number;
}
