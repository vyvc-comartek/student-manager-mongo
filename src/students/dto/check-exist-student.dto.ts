import { IsMongoId, IsOptional } from 'class-validator';
import { ObjectId } from 'mongodb';

export class CheckExistStudentDto {
  @IsMongoId()
  @IsOptional()
  readonly class?: string | ObjectId;

  @IsMongoId()
  @IsOptional()
  readonly _id?: string | ObjectId;
}
