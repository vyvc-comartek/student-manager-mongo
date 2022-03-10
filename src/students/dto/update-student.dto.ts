import { ArgsType, Field } from '@nestjs/graphql';
import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsOptional,
  Length,
} from 'class-validator';
import mongoose from 'mongoose';

@ArgsType()
export class UpdateStudentDto {
  @Field(() => String)
  @IsMongoId()
  readonly _id: string | mongoose.Types.ObjectId;

  @Length(3, 60)
  @IsOptional()
  readonly name?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  readonly dob?: Date;

  @Field(() => String)
  @IsEnum({
    MALE: 'Male',
    FEMALE: 'Female',
    OTHER: 'Other',
  } as const)
  @IsOptional()
  readonly gender?: 'Male' | 'Female' | 'Other';

  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @Field(() => String)
  @Expose({ name: 'classId' })
  @IsMongoId()
  @IsOptional()
  readonly class?: string | mongoose.Types.ObjectId;
}
