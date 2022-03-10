import { ArgsType, Field } from '@nestjs/graphql';
import { IsEnum, IsMongoId, IsOptional, Length } from 'class-validator';
import mongoose from 'mongoose';

@ArgsType()
export class SearchSubjectDto {
  @Field(() => String)
  @IsMongoId()
  @IsOptional()
  readonly _id?: string | mongoose.Types.ObjectId;

  @Length(3, 60)
  @IsOptional()
  readonly name?: string;

  @Field(() => String)
  @IsEnum({
    ONLINE: 'Online',
    OFFLINE: 'Offline',
  } as const)
  @IsOptional()
  readonly type?: 'Online' | 'Offline';
}
