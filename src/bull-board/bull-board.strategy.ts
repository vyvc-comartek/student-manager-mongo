import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy } from 'passport-http';

@Injectable()
export class BullBoardStrategy extends PassportStrategy(
  BasicStrategy,
  'bull-board',
) {
  constructor() {
    super();
  }

  async validate(user: string, pass: string) {
    if (user === 'vyvu' && pass === '123') return true;

    throw new UnauthorizedException();
  }
}
