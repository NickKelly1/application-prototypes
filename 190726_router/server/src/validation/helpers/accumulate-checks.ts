import * as ioTs from 'io-ts';
import { Either, isLeft, left, isRight } from 'fp-ts/lib/Either';

/**
 * @description
 * Join together error messages
 *  - One left -> return left
 *  - All right -> return right
 *  - Joins with `\n`
 *
 * Ignores empty strings
 *
 * @param acc
 * @param nextError
 */
const accumulateMessagesAsString = <A>(acc: Either<string, A>, nextError: Either<string, A>) => {
  if (isRight(acc) && isRight(nextError)) return acc;

  const accLeft = isLeft(acc) ? acc.left : '';
  const accNext = isLeft(nextError) ? nextError.left : '';

  if (accLeft === '' || accNext === '') return left(`${accLeft}${accNext}`);

  return left(`${accLeft}\n${accNext}`);
};

/**
 * @note: can't be used since ioTs failures are only allowed to be string...
 *
 * @description
 * Join together error messages
 *  - One left -> return left
 *  - All right -> return right
 *  - Joins with `\n`
 *
 * Ignores empty strings
 *
 * @param acc
 * @param nextError
 */
const accumulateMessagesAsArray = <A>(acc: Either<string[], A>, nextError: Either<string[], A>) => {
  // one is left -> return it
  if (isRight(acc) && isLeft(nextError)) return nextError;
  else if (isLeft(acc) && isRight(nextError)) return acc;
  // both are left -> join
  else if (isLeft(acc) && isLeft(nextError)) return left([...acc.left, nextError.left]);

  // no left
  return acc;
};

/**
 * @description
 * Accumulate validation checks - join together validators (either
 * error messages or successes) and fail on the first error message
 *
 * @param u
 * @param c
 * @param predicates
 */
export const accumulateChecks = <A>(
  u: unknown,
  c: ioTs.Context,
  predicates: ((u: unknown) => Either<string, A>)[],
): Either<ioTs.Errors, A> => {
  const checks = predicates.map(predicate => predicate(u));
  // group failures
  const [firstCheck, ...otherChecks] = checks;
  const accumulatedChecks = otherChecks.reduce((acc, next) => accumulateMessagesAsString(acc, next), firstCheck);
  if (isLeft(accumulatedChecks)) return ioTs.failure(u, c, accumulatedChecks.left);
  return ioTs.success(accumulatedChecks.right);
};
