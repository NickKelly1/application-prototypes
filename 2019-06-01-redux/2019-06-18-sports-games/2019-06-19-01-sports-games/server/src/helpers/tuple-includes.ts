import { ElementOf } from '../../@types/helpers';

/**
 * @description
 * Is `valueToCheck` in `tuple`?
 *
 * @note
 * SERIOUS problem with typescripts "includes", "indexOf", etc... on tuples
 * disallows asserting a value outside of the tuple
 *
 * @param tuple
 * @param valueToCheck
 */
export const tupleIncludes = <T extends readonly string[] | string[]>(
  tuple: T,
  valueToCheck: any,
): valueToCheck is ElementOf<T> => {
  if (tuple.includes(valueToCheck)) return true;
  return false;
};
