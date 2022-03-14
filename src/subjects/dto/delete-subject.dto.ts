import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsMongoId, Length, ValidateIf } from 'class-validator';
import mongoose from 'mongoose';
import { MongoId } from '../../types/union/mongo-id.union';

@InputType()
export class DeleteSubjectDto {
  @Field(() => String)
  @ValidateIf((o) => o.id || !o.name)
  @IsMongoId()
  readonly _id?: MongoId;

  @ValidateIf((o) => !o.id || o.name)
  @Length(3, 60)
  readonly name?: string;
}
