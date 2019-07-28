import { Rule } from '../../../../@types/helpers/application-types';
import { Either, right, left } from 'fp-ts/lib/Either';

const defaultOptions = {
  fieldName: undefined as undefined | string,
};

const defaultErrors = {
  notInteger: (input: unknown, options: typeof defaultOptions) => 'Must be an integer.',
};

export const isIntegerRule: Rule<Partial<typeof defaultOptions>, Partial<typeof defaultErrors>, number, unknown> = (
  options,
  errors,
) => p => {
  const parsedInteger = parseInt(String(p), 10);
  if (typeof p === 'number' && isFinite(parsedInteger)) return right(parsedInteger);

  const useOptions = { ...defaultOptions, ...options };
  const useErrors = { ...defaultErrors, ...errors };

  return left(useErrors.notInteger(p, useOptions));
};
