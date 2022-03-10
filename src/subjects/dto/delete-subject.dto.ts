import { ArgsType, Field } from '@nestjs/graphql';
import { IsMongoId, Length, ValidateIf } from 'class-validator';
import mongoose from 'mongoose';

@ArgsType()
export class DeleteSubjectDto {
  @Field(() => String)
  @ValidateIf((o) => o.id || !o.name)
  @IsMongoId()
  readonly _id?: string | mongoose.Types.ObjectId;

  @ValidateIf((o) => !o.id || o.name)
  @Length(3, 60)
  readonly name?: string;
}
