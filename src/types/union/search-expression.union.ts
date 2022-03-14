import { CompareOperators } from '../enum/compare-operators.enum';
import { SearchBitwises } from '../enum/search-bitwises.enum';

export type SearchExpression =
  | string
  | [CompareOperators, string]
  | [CompareOperators, string, SearchBitwises, CompareOperators, string];
