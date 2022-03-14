import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { MongoId } from 'src/types/union/mongo-id.union';

@InputType()
export class DeleteClassDto {
  @Field(() => String)
  @IsMongoId()
  readonly _id: MongoId;
}
