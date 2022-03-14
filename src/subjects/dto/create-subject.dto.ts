import { InputType } from '@nestjs/graphql';
import { IsEnum, Length } from 'class-validator';
import { SubjectTypes } from '../../types/enum/subject-types.enum';

@InputType()
export class CreateSubjectDto {
  @Length(3, 60)
  readonly name: string;

  @IsEnum(SubjectTypes)
  readonly type: SubjectTypes;
}
