import { ElementOf } from '../../@types/helpers';

/**
 * @description
 * elements in array `A` that are not also in array `B`
 *
 * @note: For strong typing, use const tuples
 *
 * @example
 * const A: ['only_in_A', 'in_A_and_B'] = ['only_in_A', 'in_A_and_B']; // or
 * const A = ['only_in_A' as const, 'in_A_and_B' as const]; // or
 * const A = ['only_in_A', 'in_A_and_B'] as const
 *
 * let B = ['in_A_and_B', 'only_in_B'] as const
 * const A_but_not_B = inThisButNotThat(A, B) // ['only_in_A']
 *
 * @param inThis
 * @param butNotThis
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const inThisButNotThat = <T extends any[] | readonly any[], U extends any[] | readonly any[]>(
  inThis: T,
  butNotThis: U,
): Exclude<ElementOf<T>, ElementOf<U>>[] => {
  return inThis.filter(shouldIBeKept => !butNotThis.includes(shouldIBeKept));
};
