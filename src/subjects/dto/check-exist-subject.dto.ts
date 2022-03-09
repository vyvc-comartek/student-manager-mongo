import { IsMongoId, IsOptional } from 'class-validator';
import { ObjectId } from 'mongodb';

export class CheckExistSubjectDto {
  @IsMongoId()
  @IsOptional()
  readonly _id?: string | ObjectId;
}
