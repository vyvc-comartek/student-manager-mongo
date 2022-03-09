import { IsMongoId, IsOptional } from 'class-validator';
import { ObjectId } from 'mongodb';

export class AvgScoreDto {
  @IsMongoId()
  @IsOptional()
  readonly studentId?: string | ObjectId;
}
