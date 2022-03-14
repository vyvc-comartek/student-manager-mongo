import { Field, InputType } from '@nestjs/graphql';
import { Expose, Type } from 'class-transformer';
import { IsMongoId, Max, Min, ValidateIf } from 'class-validator';
import { MongoId } from '../../types/union/mongo-id.union';

@InputType()
export class UpdateScoreDto {
  @Field(() => String)
  @ValidateIf((o) => o.id || !o.subject || !o.student)
  @IsMongoId()
  readonly _id?: MongoId;

  @Field(() => String, { name: 'studentId' })
  @Expose({ name: 'studentId' })
  @ValidateIf((o) => !o.id || (o.subject && o.student))
  @IsMongoId()
  readonly student?: MongoId;

  @Field(() => String, { name: 'subjectId' })
  @Expose({ name: 'subjectId' })
  @ValidateIf((o) => !o.id || (o.subject && o.student))
  @IsMongoId()
  readonly subject?: MongoId;

  @Min(1)
  @Max(10)
  @Type(() => Number)
  readonly score: number;
}
