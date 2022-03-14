import { Field, InputType } from '@nestjs/graphql';
import { Expose, Type } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsMongoId, Length } from 'class-validator';
import { Genders } from 'src/types/enum/gender.enum';
import { MongoId } from '../../types/union/mongo-id.union';

@InputType()
export class CreateStudentDto {
  @Length(3, 60)
  readonly name: string;

  @IsDate()
  @Type(() => Date)
  readonly dob: Date;

  @IsEnum(Genders)
  readonly gender: Genders = Genders.MALE;

  @IsEmail()
  readonly email: string;

  @Field(() => String, { name: 'classId' })
  @Expose({ name: 'classId' })
  @IsMongoId()
  readonly class: MongoId;
}
