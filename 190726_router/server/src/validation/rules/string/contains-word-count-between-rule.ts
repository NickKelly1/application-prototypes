import { left, right } from 'fp-ts/lib/Either';
import { Rule } from '../../../../@types/helpers/application-types';

const defaultOptions = {
  fieldName: undefined as undefined | string,
  min: 2,
  max: Infinity,
};

const defaultErrors = {
  tooFew: (input: string, options: typeof defaultOptions) => `Must contain at least ${options.min} words.`,
  tooMany: (input: string, options: typeof defaultOptions) => `Must contain less than ${options.max} words.`,
};

export const containsWordCountBetweenRule: Rule<Partial<typeof defaultOptions>, Partial<typeof defaultErrors>, string> = (
  options,
  errors,
) => s => {
  const numWords = s.split(' ').length;
  const useOptions = { ...defaultOptions, ...options };
  const useErrors = { ...defaultErrors, ...errors };

  if (numWords < useOptions.min) return left(useErrors.tooFew(s, useOptions));
  if (numWords > useOptions.max) return left(useErrors.tooMany(s, useOptions));
  return right(s);
};
