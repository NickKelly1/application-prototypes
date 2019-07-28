import { Rule } from '../../../../@types/helpers/application-types';
import { Either, right, left } from 'fp-ts/lib/Either';

const defaultOptions = {
  fieldName: undefined as undefined | string,
};

const defaultErrors = {
  notNumber: (input: unknown, options: typeof defaultOptions) => 'Must be a number.',
};

export const isNumberRule: Rule<Partial<typeof defaultOptions>, Partial<typeof defaultErrors>, number, unknown> = (
  options,
  errors,
) => p => {
  if (typeof p === 'number') return right(p);

  const useOptions = { ...defaultOptions, ...options };
  const useErrors = { ...defaultErrors, ...errors };

  return left(useErrors.notNumber(p, useOptions));
};
