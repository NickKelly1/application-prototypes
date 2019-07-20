import { AnElementOf } from '../../@types/helpers/helper-types';

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
 * const A_and_B = inThisAndThat(A, B) // ['in_A_and_B']
 *
 * @param inThis
 * @param andThat
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const inThisAndThat = <T extends any[] | readonly any[], U extends any[] | readonly any[]>(
  inThis: T,
  andThat: U,
): Extract<AnElementOf<T>, AnElementOf<U>>[] => {
  return inThis.filter(shouldIBeKept => andThat.includes(shouldIBeKept));
};
