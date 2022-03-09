import { IsEnum, IsMongoId, IsOptional, Length } from 'class-validator';
import { ObjectId } from 'mongodb';

export class SearchSubjectDto {
  @IsMongoId()
  @IsOptional()
  readonly _id?: string | ObjectId;

  @Length(3, 60)
  @IsOptional()
  readonly name?: string;

  @IsEnum({
    ONLINE: 'Online',
    OFFLINE: 'Offline',
  } as const)
  @IsOptional()
  readonly type?: 'Online' | 'Offline';
}
