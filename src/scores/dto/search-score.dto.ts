import { ArgsType, Field, HideField } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { ArrayMaxSize, IsMongoId, IsOptional, Matches } from 'class-validator';
import mongoose from 'mongoose';
import { MongoId } from '../../types/union/mongo-id.union';

@ArgsType()
export class SearchScoreDto {
  @Field(() => String)
  @IsMongoId()
  @IsOptional()
  readonly _id?: MongoId;

  @Matches(/\d(.\d)?([><]=?\d(.\d)?)?/g)
  @IsOptional()
  readonly score?: string;

  @Field(() => String, { name: 'subjectId' })
  @Expose({ name: 'subjectId' })
  @IsMongoId()
  @IsOptional()
  readonly subject?: MongoId;

  @Field(() => String, { name: 'studentId' })
  @Expose({ name: 'studentId' })
  @IsMongoId()
  @IsOptional()
  readonly student?: MongoId;

  @HideField()
  @ArrayMaxSize(6)
  @IsOptional()
  readonly populates?: mongoose.PopulateOptions[];

  @HideField()
  @IsOptional()
  readonly insertedId?: MongoId;
}
