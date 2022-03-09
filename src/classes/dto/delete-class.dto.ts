import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';

export class DeleteClassDto {
  @IsMongoId()
  readonly _id: string | ObjectId;
}
