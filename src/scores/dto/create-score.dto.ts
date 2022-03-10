import { ArgsType, Field, Float } from '@nestjs/graphql';
import { Expose, Type } from 'class-transformer';
import { IsMongoId, Max, Min } from 'class-validator';
import mongoose from 'mongoose';

@ArgsType()
export class CreateScoreDto {
  @Field(() => String)
  @Expose({ name: 'studentId' })
  @IsMongoId()
  readonly student: string | mongoose.Types.ObjectId;

  @Field(() => String)
  @Expose({ name: 'subjectId' })
  @IsMongoId()
  readonly subject: string | mongoose.Types.ObjectId;

  @Field(() => Float)
  @Min(1)
  @Max(10)
  @Type(() => Number)
  readonly score: number;
}
