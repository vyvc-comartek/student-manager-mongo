import { ArgsType, Field } from '@nestjs/graphql';
import { IsMongoId, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

@ArgsType()
export class AvgScoreDto {
  @Field(() => String)
  @IsMongoId()
  @IsOptional()
  readonly studentId?: string | mongoose.Types.ObjectId;
}
