import { registerEnumType } from '@nestjs/graphql';

export enum SearchStudentMode {
  NORMAL = 'NORMAL',
  AVG = 'AVG',
}

registerEnumType(SearchStudentMode, { name: 'SearchStudentMode' });
