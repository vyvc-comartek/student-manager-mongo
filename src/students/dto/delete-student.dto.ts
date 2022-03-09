import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';
export class DeleteStudentDto {
  @IsMongoId()
  readonly _id: string | ObjectId;
}
