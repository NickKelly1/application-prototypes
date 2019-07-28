import { left, right } from 'fp-ts/lib/Either';
import { Rule } from '../../../../@types/helpers/application-types';

const defaultOptions = {
  fieldName: undefined as undefined | string,
  characters: 'abcdef',
};

const defaultErrors = {
  doesNotContain: (input: string, options: typeof defaultOptions) => `Must contain "${options.characters}".`,
};

export const containsCharactersRule: Rule<Partial<typeof defaultOptions>, Partial<typeof defaultErrors>, string> = (
  options,
  errors,
) => s => {
  const useOptions = { ...defaultOptions, ...options };
  const useErrors = { ...defaultErrors, ...errors };

  if (s.indexOf(useOptions.characters) === -1) return left(useErrors.doesNotContain(s, useOptions));
  return right(s);
};
