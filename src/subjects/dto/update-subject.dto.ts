import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsMongoId, Length, ValidateIf } from 'class-validator';
import mongoose from 'mongoose';
import { SubjectTypes } from '../../types/enum/subject-types.enum';
import { MongoId } from '../../types/union/mongo-id.union';

@InputType()
export class UpdateSubjectDto {
  @Field(() => String)
  @ValidateIf((o) => o.id || !o.name)
  @IsMongoId()
  readonly _id?: MongoId;

  @ValidateIf((o) => !o.id || o.name)
  @Length(3, 60)
  readonly name?: string;

  @ValidateIf((o) => o.type || !o.name)
  @IsEnum(SubjectTypes)
  readonly type?: SubjectTypes;
}
