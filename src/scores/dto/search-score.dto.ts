import { Expose } from 'class-transformer';
import { ArrayMaxSize, IsMongoId, IsOptional, Matches } from 'class-validator';
import mongoose from 'mongoose';

export class SearchScoreDto {
  @IsMongoId()
  @IsOptional()
  readonly _id?: string | mongoose.Types.ObjectId;

  @Matches(/\d(.\d)?([><]=?\d(.\d)?)?/g)
  @IsOptional()
  readonly score?: string;

  @Expose({ name: 'subjectId' })
  @IsMongoId()
  @IsOptional()
  readonly subject?: string | mongoose.Types.ObjectId;

  @Expose({ name: 'studentId' })
  @IsMongoId()
  @IsOptional()
  readonly student?: string | mongoose.Types.ObjectId;

  @ArrayMaxSize(6)
  @IsOptional()
  readonly populates?: {}[] = [
    {
      path: 'student',
      populate: {
        path: 'scores',
        populate: {
          path: 'subject',
        },
      },
    },
    { path: 'subject', model: 'Subject' },
  ];

  @IsOptional()
  readonly insertedId?: mongoose.Types.ObjectId;
}
