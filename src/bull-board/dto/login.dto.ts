import { Type } from 'class-transformer';
import { Length } from 'class-validator';

export class LoginDto {
  @Length(3, 64)
  @Type(() => String)
  user: string;

  @Length(3, 64)
  @Type(() => String)
  pass: string;
}
