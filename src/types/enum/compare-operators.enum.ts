import { registerEnumType } from '@nestjs/graphql';

export enum CompareOperators {
  GTE = '>=',
  GT = '>',
  LTE = '<=',
  LT = '<',
}

export type CompareOperatorKeys = keyof typeof CompareOperators;

export const CompareOperatorKeyMap = new Map<
  CompareOperators,
  CompareOperatorKeys
>(
  Object.entries(CompareOperators).map(
    ([key, value]: [CompareOperatorKeys, CompareOperators]) => [value, key],
  ),
);

registerEnumType(CompareOperators, { name: 'CompareOperators' });
