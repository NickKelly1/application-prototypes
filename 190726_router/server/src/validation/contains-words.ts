import { sequenceT } from 'fp-ts/lib/Apply';
import { map, getValidation, left, right, isLeft, isRight } from 'fp-ts/lib/Either';
import { getSemigroup } from 'fp-ts/lib/NonEmptyArray';

export class ContainsWords {
  private static defaultOptions = {
    fieldName: undefined as undefined | string,
    min: 2,
    max: Infinity,
  } as const;

  private static defaultErrors = {
    tooFew: (numWords: number, options: typeof ContainsWords.defaultOptions) =>
      `Must contain at least ${options.min} words.`,
    tooMany: (numWords: number, options: typeof ContainsWords.defaultOptions) =>
      `Must contain less than ${options.max} words.`,
  } as const;

  /**
   * @description
   * Validate the string contains the desired number of words
   *
   * @param s
   * @param options
   * @param errors
   */
  public static validate = (
    s: string,
    options?: typeof ContainsWords.defaultOptions,
    errors?: typeof ContainsWords.defaultErrors,
  ) => {
    const numWords = s.split(' ').length;
    const useOptions = { ...ContainsWords.defaultOptions, ...options };
    const useErrors = { ...ContainsWords.defaultErrors, ...errors };

    if (numWords < useOptions.min) return left(useErrors.tooFew(numWords, useOptions));
    if (numWords < useOptions.max) return left(useErrors.tooMany(numWords, useOptions));
    return right(s);
  };
}
