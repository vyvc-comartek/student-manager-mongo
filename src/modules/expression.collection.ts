export type Expression =
  | string
  | [Operators, string]
  | [Operators, string, 'AND' | 'OR', Operators, string];

export enum Operators {
  GTE = '>=',
  GT = '>',
  LTE = '<',
  LT = '<=',
}

export type OperatorKey = keyof typeof Operators;

export const OperatorKeyMap = new Map<Operators, OperatorKey>(
  Object.entries(Operators).map(([key, value]: [OperatorKey, Operators]) => [
    value,
    key,
  ]),
);
