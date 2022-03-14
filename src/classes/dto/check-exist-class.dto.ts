import { ArgsType, Field } from '@nestjs/graphql';
import { IsMongoId, IsOptional } from 'class-validator';
import { MongoId } from '../../types/union/mongo-id.union';

@ArgsType()
export class CheckExistClassDto {
  @Field(() => String)
  @IsMongoId()
  @IsOptional()
  readonly _id?: MongoId;
}
