import { ArgsType, Field } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import mongoose from 'mongoose';

@ArgsType()
export class DeleteClassDto {
  @Field(() => String)
  @IsMongoId()
  readonly _id: string | mongoose.Types.ObjectId;
}
