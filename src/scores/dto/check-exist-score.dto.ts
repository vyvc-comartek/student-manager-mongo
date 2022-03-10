import { ArgsType, Field } from '@nestjs/graphql';
import { IsMongoId, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

@ArgsType()
export class CheckExistScoreDto {
  @Field(() => String)
  @IsMongoId()
  @IsOptional()
  readonly subject?: string | mongoose.Types.ObjectId;

  @Field(() => String)
  @IsMongoId()
  @IsOptional()
  readonly student?: string | mongoose.Types.ObjectId;
}
