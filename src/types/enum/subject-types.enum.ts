import { registerEnumType } from '@nestjs/graphql';

export enum SubjectTypes {
  ONLINE = 'Online',
  OFFLINE = 'Offline',
}

registerEnumType(SubjectTypes, { name: 'SubjectTypes' });
