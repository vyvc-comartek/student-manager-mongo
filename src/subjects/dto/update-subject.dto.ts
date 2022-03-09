import { IsEnum, IsMongoId, Length, ValidateIf } from 'class-validator';
import { ObjectId } from 'mongodb';

export class UpdateSubjectDto {
  @ValidateIf((o) => o.id || !o.name)
  @IsMongoId()
  readonly _id?: string | ObjectId;

  @ValidateIf((o) => !o.id || o.name)
  @Length(3, 60)
  readonly name?: string;

  @ValidateIf((o) => o.type || !o.name)
  @IsEnum({
    ONLINE: 'Online',
    OFFLINE: 'Offline',
  } as const)
  readonly type?: 'Online' | 'Offline';
}
