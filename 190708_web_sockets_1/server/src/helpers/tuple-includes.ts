import { AnElementOf } from '../../@types/helpers/helper-types';

/**
 * @description
 * Is `valueToCheck` in `tuple`?
 *
 * @note
 * SERIOUS problem??? with typescripts "includes", "indexOf", etc... on tuples
 * disallows asserting a value outside of the tuple
 *
 * @TODO: make this better! - better, more natural and flexible typing
 *
 * @param tuple
 * @param valueToCheck
 */
export const tupleIncludes = <T extends readonly string[] | string[]>(
  tuple: T,
  valueToCheck: any,
): valueToCheck is AnElementOf<T> => {
  if (tuple.includes(valueToCheck)) return true;
  return false;
};
