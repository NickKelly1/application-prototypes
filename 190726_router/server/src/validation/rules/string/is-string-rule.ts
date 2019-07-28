import { Rule } from '../../../../@types/helpers/application-types';
import { Either, right, left } from 'fp-ts/lib/Either';

const defaultOptions = {
  fieldName: undefined as undefined | string,
};

const defaultErrors = {
  notString: (input: unknown, options: typeof defaultOptions) => 'Must be a string.',
};

export const isStringRule: Rule<typeof defaultOptions, typeof defaultErrors, string, unknown> = (options, errors) => p => {
  if (typeof p === 'string') return right(p);

  const useOptions = { ...defaultOptions, ...options };
  const useErrors = { ...defaultErrors, ...errors };

  return left(useErrors.notString(p, useOptions));
};
