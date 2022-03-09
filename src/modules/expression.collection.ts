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
