import { ArgsType, Field } from '@nestjs/graphql';
import { IsEnum, IsMongoId, Length, ValidateIf } from 'class-validator';
import mongoose from 'mongoose';

@ArgsType()
export class UpdateSubjectDto {
  @Field(() => String)
  @ValidateIf((o) => o.id || !o.name)
  @IsMongoId()
  readonly _id?: string | mongoose.Types.ObjectId;

  @ValidateIf((o) => !o.id || o.name)
  @Length(3, 60)
  readonly name?: string;

  @Field(() => String)
  @ValidateIf((o) => o.type || !o.name)
  @IsEnum({
    ONLINE: 'Online',
    OFFLINE: 'Offline',
  } as const)
  readonly type?: 'Online' | 'Offline';
}
