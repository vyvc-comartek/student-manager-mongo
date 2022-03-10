import { ArgsType, Field } from '@nestjs/graphql';
import { Expose, Type } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsMongoId, Length } from 'class-validator';
import mongoose from 'mongoose';

@ArgsType()
export class CreateStudentDto {
  @Length(3, 60)
  readonly name: string;

  @IsDate()
  @Type(() => Date)
  readonly dob: Date;

  @Field(() => String)
  @IsEnum({
    MALE: 'Male',
    FEMALE: 'Female',
    OTHER: 'Other',
  } as const)
  readonly gender: 'Male' | 'Female' | 'Other';

  @IsEmail()
  readonly email: string;

  @Field(() => String)
  @Expose({ name: 'classId' })
  @IsMongoId()
  readonly class: string | mongoose.Types.ObjectId;
}
