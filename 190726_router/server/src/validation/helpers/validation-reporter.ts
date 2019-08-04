import * as ioTs from 'io-ts';
import { isRight, Either } from 'fp-ts/lib/Either';
import { ThrowReporter } from 'io-ts/lib/ThrowReporter';

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
  report: <A>(toBeValidated: Either<ioTs.Errors, A>): Record<string, string> => {
    if (isRight(toBeValidated)) return {};

    return toBeValidated.left.reduce(
      (acc, error) => {
        const key = error.context.reduce((levelAcc, level) => (levelAcc += level.key), '');
        if (error.message) acc[key] = (acc[key] || '') + error.message;
        return acc;
      },
      ({} as any) as Record<string, string>,
    );
  },

  /**
   * @description
   * Stringify an error report
   *
   * @param errorReport
   */
  stringify: (errorReport: Record<string, string>): string => {
    return Object.entries(errorReport).reduce(
      (acc, [nextKey, nextValue]) => `${acc}${acc === '' || '\n'}${nextKey}: ${nextValue}`,
      '',
    );
  },
};

ThrowReporter;
