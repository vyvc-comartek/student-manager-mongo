import { ArgsType, Field } from '@nestjs/graphql';
import { IsMongoId, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

@ArgsType()
export class CheckExistStudentDto {
  @Field(() => String)
  @IsMongoId()
  @IsOptional()
  readonly class?: string | mongoose.Types.ObjectId;

  @Field(() => String)
  @IsMongoId()
  @IsOptional()
  readonly _id?: string | mongoose.Types.ObjectId;
}
