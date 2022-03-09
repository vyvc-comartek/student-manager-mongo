import { Expose, Type } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsMongoId, Length } from 'class-validator';
import mongoose from 'mongoose';

export class CreateStudentDto {
  @Length(3, 60)
  readonly name: string;

  @IsDate()
  @Type(() => Date)
  readonly dob: Date;

  @IsEnum({
    MALE: 'Male',
    FEMALE: 'Female',
    OTHER: 'Other',
  } as const)
  readonly gender: 'Male' | 'Female' | 'Other';

  @IsEmail()
  readonly email: string;

  @Expose({ name: 'classId' })
  @IsMongoId()
  readonly class: string | mongoose.Types.ObjectId;
}
