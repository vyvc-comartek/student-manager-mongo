import { InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class CreateClassDto {
  @Length(3, 60)
  readonly name: string;

  @Length(3, 60)
  readonly teacherName: string;
}
