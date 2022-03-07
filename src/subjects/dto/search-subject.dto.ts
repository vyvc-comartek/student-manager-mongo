import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive, Length } from 'class-validator';

export class SearchSubjectDto {
  @IsPositive()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  readonly id?: number;

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
