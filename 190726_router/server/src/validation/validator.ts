import { sequenceT } from 'fp-ts/lib/Apply';
import { getValidation, right, left, Either, map, isLeft, mapLeft } from 'fp-ts/lib/Either';
import { getSemigroup, NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { pipe } from 'fp-ts/lib/pipeable';
import { isBetween } from './rules/number/is-between';
import { isInteger } from './rules/number/is-integer';
import { isNumber } from './rules/number/is-number';
import { containsCharacters } from './rules/string/contains-characters';
import { containsWordCountBetween } from './rules/string/contains-word-count-between';
import { isString } from './rules/string/is-string';

// @see https://dev.to/gcanti/getting-started-with-fp-ts-either-vs-validation-5eja

/**
 * @description
 * Wraps a checker's (validation rule's) left output in an array
 *
 * @param check
 */
const lift = <E, A>(check: (a: A) => Either<E, A>): ((a: A) => Either<NonEmptyArray<E>, A>) => {
  return a =>
    pipe(
      check(a),
      mapLeft(a => [a]),
    );
};

export const v = {
  /**
   * @description
   * Validate an input
   */
  validate: <T>(
    payload: unknown,
    isRequired: boolean,
    checkType: (p: unknown) => Either<string, T>,
    rules?: NonEmptyArray<(p: T) => Either<string, T>>,
  ) => {
    // determine if exists
    const exists = payload !== undefined;
    if (!exists && isRequired) return left<NonEmptyArray<string>>(['Must be provided']);
    if (!exists && !isRequired) return right(undefined);

    // ?!
    const typeCheck = lift(checkType)(payload);

    if (isLeft(typeCheck) || !rules) return typeCheck;

    const [firstRule, ...otherRules] = rules.map(rule => lift(rule)(typeCheck.right));
    return pipe(
      sequenceT(getValidation(getSemigroup<string>()))(firstRule, ...otherRules),
      map(() => payload),
    );
  },

  isBetween,
  isInteger,
  isNumber,
  containsCharacters,
  containsWordCountBetween,
  isString,
};
