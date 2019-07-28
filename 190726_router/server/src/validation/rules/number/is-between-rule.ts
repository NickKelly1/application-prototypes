import { Rule } from '../../../../@types/helpers/application-types';
import { Either, right, left } from 'fp-ts/lib/Either';

const defaultOptions = {
  bieldName: undefined as undefined | string,
  min: 0,
  max: 10,
};

const defaultErrors = {
  notNumber: (input: unknown, options: typeof defaultOptions) => 'Must be a number.',
};

export const isBetweenRule: Rule<typeof defaultOptions, Partial<typeof defaultErrors>, number> = (options, errors) => p => {
  if (typeof p === 'number') return right(p);

  const useOptions = { ...defaultOptions, ...options };
  const useErrors = { ...defaultErrors, ...errors };

  return left(useErrors.notNumber(p, useOptions));
};
