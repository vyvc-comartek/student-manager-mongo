import { IsEnum, Length } from 'class-validator';

export class CreateSubjectDto {
  @Length(3, 60)
  readonly name: string;

  @IsEnum({
    ONLINE: 'Online',
    OFFLINE: 'Offline',
  } as const)
  readonly type: 'Online' | 'Offline';
}
