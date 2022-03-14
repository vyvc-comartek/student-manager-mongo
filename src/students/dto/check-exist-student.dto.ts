import { ArgsType, Field } from '@nestjs/graphql';
import { IsMongoId, IsOptional } from 'class-validator';
import mongoose from 'mongoose';
import { MongoId } from '../../types/union/mongo-id.union';

@ArgsType()
export class CheckExistStudentDto {
  @Field(() => String)
  @IsMongoId()
  @IsOptional()
  readonly class?: MongoId;

  @Field(() => String)
  @IsMongoId()
  @IsOptional()
  readonly _id?: MongoId;
}
