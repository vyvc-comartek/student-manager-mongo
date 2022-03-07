import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsPositive, Length, ValidateIf } from 'class-validator';

export class UpdateSubjectDto {
  @ValidateIf((o) => o.id || !o.name)
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  readonly id?: number;

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
