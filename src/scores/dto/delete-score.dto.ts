import { Field, InputType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsMongoId, ValidateIf } from 'class-validator';
import { MongoId } from '../../types/union/mongo-id.union';

@InputType()
export class DeleteScoreDto {
  @Field(() => String)
  @ValidateIf((o) => o.id || !o.subject || !o.student)
  @IsMongoId()
  readonly _id?: MongoId;

  @Field(() => String, { name: 'subjectId' })
  @Expose({ name: 'subjectId' })
  @ValidateIf((o) => !o.id || o.subject || o.student)
  @IsMongoId()
  readonly subject?: MongoId;

  @Field(() => String, { name: 'studentId' })
  @Expose({ name: 'studentId' })
  @ValidateIf((o) => !o.id || o.subject || o.student)
  @IsMongoId()
  readonly student?: MongoId;
}
