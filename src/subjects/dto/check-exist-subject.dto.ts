import { ArgsType, Field } from '@nestjs/graphql';
import { IsMongoId, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

@ArgsType()
export class CheckExistSubjectDto {
  @Field(() => String)
  @IsMongoId()
  @IsOptional()
  readonly _id?: string | mongoose.Types.ObjectId;
}
