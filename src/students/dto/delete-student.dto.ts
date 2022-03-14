import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import mongoose from 'mongoose';
import { MongoId } from '../../types/union/mongo-id.union';

@InputType()
export class DeleteStudentDto {
  @Field(() => String)
  @IsMongoId()
  readonly _id: MongoId;
}
