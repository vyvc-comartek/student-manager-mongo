import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  Length,
} from 'class-validator';
export class UpdateStudentDto {
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  readonly id: number;

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
  @IsPositive()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  readonly class?: number;
}
