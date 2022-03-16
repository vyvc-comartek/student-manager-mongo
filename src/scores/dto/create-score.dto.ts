import { Field, Float, InputType } from '@nestjs/graphql';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsMongoId,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { MongoId } from '../../types/union/mongo-id.union';

@InputType()
export class CreateScoreDto {
  @Field(() => String, { name: 'studentId' })
  @Expose({ name: 'studentId' })
  @IsMongoId()
  readonly student: MongoId;

  @Field(() => String, { name: 'subjectId' })
  @Expose({ name: 'subjectId' })
  @IsMongoId()
  readonly subject: MongoId;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  readonly dateToSendMail?: Date;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  readonly hourToSendMail?: boolean;

  @Field(() => Float)
  @Min(1)
  @Max(10)
  @Type(() => Number)
  readonly score: number;
}
