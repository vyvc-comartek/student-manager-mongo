import { IsEnum, Length } from 'class-validator';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class CreateSubjectDto {
  @Length(3, 60)
  readonly name: string;

  @Field(() => String)
  @IsEnum({
    ONLINE: 'Online',
    OFFLINE: 'Offline',
  } as const)
  readonly type: 'Online' | 'Offline';
}
