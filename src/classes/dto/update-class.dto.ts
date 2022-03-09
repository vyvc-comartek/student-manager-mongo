import { IsMongoId, IsOptional, Length } from 'class-validator';
import { ObjectId } from 'mongodb';

export class UpdateClassDto {
  @IsMongoId()
  readonly _id: string | ObjectId;

  @Length(3, 60)
  @IsOptional()
  readonly name?: string;

  @Length(3, 60)
  @IsOptional()
  readonly teacherName?: string;
}
