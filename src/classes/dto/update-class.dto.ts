import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsOptional, Length } from 'class-validator';
import mongoose from 'mongoose';
import { MongoId } from '../../types/union/mongo-id.union';

@InputType()
export class UpdateClassDto {
  @Field(() => String)
  @IsMongoId()
  readonly _id: MongoId;

  @Length(3, 60)
  @IsOptional()
  readonly name?: string;

  @Length(3, 60)
  @IsOptional()
  readonly teacherName?: string;
}
