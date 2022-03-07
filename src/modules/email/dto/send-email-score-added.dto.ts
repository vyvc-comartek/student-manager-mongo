import { ISendMailOptions } from '@nestjs-modules/mailer';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Score } from '../../../scores/score.entity';

export class SendEmailScoreAddedDto {
  @Type(() => Score)
  score: Score;

  @IsOptional()
  content?: Buffer[] = [];

  @IsOptional()
  overrideOptions?: ISendMailOptions;
}
