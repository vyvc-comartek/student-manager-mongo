import { ArgsType, Field } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import mongoose from 'mongoose';

@ArgsType()
export class DeleteStudentDto {
  @Field(() => String)
  @IsMongoId()
  readonly _id: string | mongoose.Types.ObjectId;
}
