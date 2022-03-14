import { Field, Float, InputType } from '@nestjs/graphql';
import { Expose, Type } from 'class-transformer';
import { IsMongoId, Max, Min } from 'class-validator';
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

  @Field(() => Float)
  @Min(1)
  @Max(10)
  @Type(() => Number)
  readonly score: number;
}
