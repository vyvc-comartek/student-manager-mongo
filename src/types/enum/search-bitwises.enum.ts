import { registerEnumType } from '@nestjs/graphql';

export enum SearchBitwises {
  AND = 'AND',
  OR = 'OR',
}

registerEnumType(SearchBitwises, { name: 'SearchBitwises' });
