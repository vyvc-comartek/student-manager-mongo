import { ArgsType, Field } from '@nestjs/graphql';
import { IsMongoId, IsOptional } from 'class-validator';
import mongoose from 'mongoose';
import { MongoId } from '../../types/union/mongo-id.union';

@ArgsType()
export class CheckExistSubjectDto {
  @Field(() => String)
  @IsMongoId()
  @IsOptional()
  readonly _id?: MongoId;
}
