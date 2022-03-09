import { IsMongoId, IsOptional } from 'class-validator';
import { ObjectId } from 'mongodb';

export class CheckExistScoreDto {
  @IsMongoId()
  @IsOptional()
  readonly subject?: string | ObjectId;

  @IsMongoId()
  @IsOptional()
  readonly student?: string | ObjectId;
}
