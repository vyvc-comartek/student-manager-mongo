import { ArgsType, Field } from '@nestjs/graphql';
import { IsMongoId, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

@ArgsType()
export class CheckExistClassDto {
  @Field(() => String)
  @IsMongoId()
  @IsOptional()
  readonly _id?: string | mongoose.Types.ObjectId;
}
