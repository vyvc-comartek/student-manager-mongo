import { ISendMailOptions } from '@nestjs-modules/mailer';
import Bull from 'bull';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Score } from '../../../scores/score.entity';

export class SendEmailScoreAddedDto {
  @Type(() => Score)
  readonly score: Score;

  @IsOptional()
  readonly content?: Buffer[] = [];

  @IsOptional()
  readonly overrideOptions?: ISendMailOptions;

  @IsOptional()
  readonly jobOptions?: Bull.JobOptions = {};
}
