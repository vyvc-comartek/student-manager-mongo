import { ArgsType, Field } from '@nestjs/graphql';
import { IsEnum, IsMongoId, IsOptional, Length } from 'class-validator';
import mongoose from 'mongoose';
import { SubjectTypes } from '../../types/enum/subject-types.enum';
import { MongoId } from '../../types/union/mongo-id.union';

@ArgsType()
export class SearchSubjectDto {
  @Field(() => String)
  @IsMongoId()
  @IsOptional()
  readonly _id?: MongoId;

  @Length(3, 60)
  @IsOptional()
  readonly name?: string;

  @IsEnum(SubjectTypes)
  @IsOptional()
  readonly type?: SubjectTypes;
}
