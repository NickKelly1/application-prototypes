import { Either, left, right, chain } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';

/**
 * ---------------------------------------------------------------
 *
 * Problem: Validate a password from an unknown payload and be type-aware upon success
 *
 * @see https://dev.to/gcanti/getting-started-with-fp-ts-either-vs-validation-5eja
 *
 * ---------------------------------------------------------------
 */

/**
 * @description
 * Validate hte minimum length of a string is 6 character
 *
 * Left: error
 * Right: success
 *
 * @param s
 */
const minLength = (s: string): Either<string, string> => (s.length >= 6 ? right(s) : left('at least 6 characters'));

/**
 * @description
 * Validate there is at least one capital letter in the string
 *
 * Left: error
 * Right: success
 *
 * @param s
 */
const oneCapital = (s: string): Either<string, string> =>
  /[A-Z]/g.test(s) ? right(s) : left('at least one capital letter');

/**
 * @description
 * Validate there is at least one number in the string
 *
 * Left: error
 * Right: success
 *
 * @param s
 */
const oneNumber = (s: string): Either<string, string> => (/[0-9]/g.test(s) ? right(s) : left('at least one number'));

/**
 * @description
 * Validate a password fits the required rules
 *
 * Left: error
 * Right: success
 *
 * @param s
 */
const validatePasswordSequential = (s: string): Either<string, string> =>
  pipe(
    minLength(s),
    chain(oneCapital),
    chain(oneNumber),
  );

console.log('[Sequentially] validating password: "ab"', validatePasswordSequential('ab'));
// => left("at least 6 characters");

console.log('[Sequentially] validating password: "abcdef"', validatePasswordSequential('abcdef'));
// => left("at least one capital letter")

console.log('[Sequentially] validating password: "Abcdef"', validatePasswordSequential('Abcdef'));
// => left("at least one number")

console.log('[Sequentially] validating password: "1Abcdef"', validatePasswordSequential('1Abcdef'));
// => right("1Abcdef")

// actual results:
// [Sequentially] validating password: "ab" { _tag: 'Left', left: 'at least 6 characters' }
// [Sequentially] validating password: "abcdef" { _tag: 'Left', left: 'at least one capital letter' }
// [Sequentially] validating password: "Abcdef" { _tag: 'Left', left: 'at least one number' }
// [Sequentially] validating password: "1Abcdef" { _tag: 'Right', right: '1Abcdef' }

/**
 * ---------------------------------------------------------------
 *
 * problem: only returns one validation error at a time. See 6-3 for solution
 *
 * ---------------------------------------------------------------
 */

// https://dev.to/gcanti/getting-started-with-fp-ts-either-vs-validation-5eja
import { getSemigroup, NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { getValidation, mapLeft, map } from 'fp-ts/lib/Either';
import { sequenceT } from 'fp-ts/lib/Apply';

const applicativeValidation = getValidation(getSemigroup<string>());

/**
 * @description
 * Wraps a functions Left to into an array
 *
 * This will allow us to combine validators by joining the lefts into an array
 *
 * @param check
 */
function lift<E, A>(check: (a: A) => Either<E, A>): (a: A) => Either<NonEmptyArray<E>, A> {
  return a =>
    pipe(
      check(a),
      mapLeft(a => [a]),
    );
}

// The following are functions that wrap validator error strings in array
const minLengthV = lift(minLength);
const oneCapitalV = lift(oneCapital);
const oneNumberV = lift(oneNumber);

/**
 * @description
 * Run all validation runes for a password simultaneously and return errors in an array of strings
 *
 * @param s
 */
function validatePasswordParallel(s: string): Either<NonEmptyArray<string>, string> {
  return pipe(
    sequenceT(getValidation(getSemigroup<string>()))(lift(minLength)(s), lift(oneCapital)(s), lift(oneNumber)(s)),
    map(() => s),
  );
}

console.log('[Concurrently] validating password: "abc"', validatePasswordParallel('abc'));
// => failure(['at least 6 characters', 'at least one capital letter', 'at least one number']);

// [Concurrently] validating password: "abc" {
//   _tag: 'Left',
//   left: [
//     'at least 6 characters',
//     'at least one capital letter',
//     'at least one number'
//   ]
// }
