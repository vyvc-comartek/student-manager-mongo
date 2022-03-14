import { registerEnumType } from '@nestjs/graphql';

export enum Genders {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

registerEnumType(Genders, { name: 'Genders' });
