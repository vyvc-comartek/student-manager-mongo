import { ArgsType, Field } from '@nestjs/graphql';
import { IsMongoId, IsOptional, Length } from 'class-validator';
import mongoose from 'mongoose';

@ArgsType()
export class UpdateClassDto {
  @Field(() => String)
  @IsMongoId()
  readonly _id: string | mongoose.Types.ObjectId;

  @Length(3, 60)
  @IsOptional()
  readonly name?: string;

  @Length(3, 60)
  @IsOptional()
  readonly teacherName?: string;
}
