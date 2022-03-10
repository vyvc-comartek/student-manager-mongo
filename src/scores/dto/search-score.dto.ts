import { ArgsType, Field } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { ArrayMaxSize, IsMongoId, IsOptional, Matches } from 'class-validator';
import { PopulateOptions, Types } from 'mongoose';

@ArgsType()
export class SearchScoreDto {
  @Field(() => String)
  @IsMongoId()
  @IsOptional()
  readonly _id?: string | Types.ObjectId;

  @Matches(/\d(.\d)?([><]=?\d(.\d)?)?/g)
  @IsOptional()
  readonly score?: string;

  @Field(() => String)
  @Expose({ name: 'subjectId' })
  @IsMongoId()
  @IsOptional()
  readonly subject?: string | Types.ObjectId;

  @Field(() => String)
  @Expose({ name: 'studentId' })
  @IsMongoId()
  @IsOptional()
  readonly student?: string | Types.ObjectId;

  @ArrayMaxSize(6)
  @IsOptional()
  readonly populates?: PopulateOptions[];

  @Field(() => String)
  @IsOptional()
  readonly insertedId?: Types.ObjectId;
}
