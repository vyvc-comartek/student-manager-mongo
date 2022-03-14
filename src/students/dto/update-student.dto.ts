import { Field, InputType } from '@nestjs/graphql';
import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsOptional,
  Length,
} from 'class-validator';
import { Genders } from 'src/types/enum/gender.enum';
import { MongoId } from '../../types/union/mongo-id.union';

@InputType()
export class UpdateStudentDto {
  @Field(() => String)
  @IsMongoId()
  readonly _id: MongoId;

  @Length(3, 60)
  @IsOptional()
  readonly name?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  readonly dob?: Date;

  @IsEnum(Genders)
  @IsOptional()
  readonly gender?: Genders;

  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @Field(() => String, { name: 'classId' })
  @Expose({ name: 'classId' })
  @IsMongoId()
  @IsOptional()
  readonly class?: MongoId;
}
