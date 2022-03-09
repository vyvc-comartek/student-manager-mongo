import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsOptional,
  Length,
} from 'class-validator';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
export class UpdateStudentDto {
  @IsMongoId()
  readonly _id: string | ObjectId;

  @Length(3, 60)
  @IsOptional()
  readonly name?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  readonly dob?: Date;

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

  @Expose({ name: 'classId' })
  @IsMongoId()
  @IsOptional()
  readonly class?: string | mongoose.Types.ObjectId;
}
