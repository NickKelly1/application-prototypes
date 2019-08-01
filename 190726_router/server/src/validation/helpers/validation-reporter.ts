import * as ioTs from 'io-ts';
import { isRight, Either } from 'fp-ts/lib/Either';

/**
 * @description
 * Report on errors from validation
 *
 */
export const ValidationReporter = {
  /**
   * @description
   * Report on error from validation
   *
   * @param toBeValidated
   */
  report: <A>(toBeValidated: Either<ioTs.Errors, A>) => {
    if (isRight(toBeValidated)) return [];

    return toBeValidated.left.reduce(
      (acc, error) => {
        const key = error.context.reduce((levelAcc, level) => (levelAcc += level.key), '');
        if (error.message) acc[key] = (acc[key] || '') + error.message;
        return acc;
      },
      ({} as any) as Record<string, string>,
    );
  },
};
