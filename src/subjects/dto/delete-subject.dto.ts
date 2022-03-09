import { IsMongoId, Length, ValidateIf } from 'class-validator';
import { ObjectId } from 'mongodb';
export class DeleteSubjectDto {
  @ValidateIf((o) => o.id || !o.name)
  @IsMongoId()
  readonly _id?: string | ObjectId;

  @ValidateIf((o) => !o.id || o.name)
  @Length(3, 60)
  readonly name?: string;
}
