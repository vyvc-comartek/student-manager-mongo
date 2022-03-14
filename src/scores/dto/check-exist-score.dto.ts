import { ArgsType, Field } from '@nestjs/graphql';
import { IsMongoId, IsOptional } from 'class-validator';
import mongoose from 'mongoose';
import { MongoId } from '../../types/union/mongo-id.union';

@ArgsType()
export class CheckExistScoreDto {
  @Field(() => String)
  @IsMongoId()
  @IsOptional()
  readonly subject?: MongoId;

  @Field(() => String)
  @IsMongoId()
  @IsOptional()
  readonly student?: MongoId;
}
