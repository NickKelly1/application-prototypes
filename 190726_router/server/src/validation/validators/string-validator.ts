import * as ioTs from 'io-ts';
import { Either, right, left, isRight } from 'fp-ts/lib/Either';
import { hasNumberProperty, isString } from '../../helpers/type-guards';
import { accumulateChecks } from '../helpers/accumulate-checks';

interface StringValidatorOptions {
  min?: number;
  max?: number;
}

const defaultErrorMessages = {
  isString: <T extends StringValidatorOptions>(value: unknown, options: T) => 'Must be a string',
  min: <T extends StringValidatorOptions>(value: unknown, options: T) => `Must have ${options.min} or more characters`,
  max: <T extends StringValidatorOptions>(value: unknown, options: T) => `Must have ${options.max} or less characters`,
};

type StringValidatorErrors = typeof defaultErrorMessages;

/**
 * @description
 * String validator factory
 *
 * @example
 * const userValidator = ioTs.type({
 *   first_name: createStringValidator({ min: 3, max: 15 }),
 *   last_name: createStringValidator({ min: 3, max: 20 }),
 * });
 *
 * @param options
 * @param inputErrorMessages
 */
export const createStringValidator = <T>(
  options: StringValidatorOptions = {},
  inputErrorMessages: Partial<StringValidatorErrors> = {},
) => {
  const errorMessages = { ...defaultErrorMessages, ...inputErrorMessages };

  const optionalPredicates: ((u: unknown) => Either<string, string>)[] = [];

  // string
  optionalPredicates.push((u: unknown) => (isString(u) ? right(u) : left(errorMessages.isString(u, options))));

  // min
  if (hasNumberProperty(options, 'min'))
    optionalPredicates.push((u: unknown) =>
      isString(u) && u.length >= options.min ? right(u) : left(errorMessages.min(u, options)),
    );

  // max
  if (hasNumberProperty(options, 'max'))
    optionalPredicates.push((u: unknown) =>
      isString(u) && u.length <= options.max ? right(u) : left(errorMessages.max(u, options)),
    );

  return new ioTs.Type<string>(
    'number',
    (u: unknown): u is string => optionalPredicates.every(predicate => isRight(predicate(u))),
    (u: unknown, c) => accumulateChecks(u, c, optionalPredicates),
    ioTs.identity,
  );
};

// const userValidator = ioTs.type({
//   first_name: createStringValidator({ min: 3, max: 15 }, { isString: () => '' }),
//   last_name: createStringValidator({ min: 3, max: 20 }, { isString: () => '' }),
// });

// console.log(ValidationReporter.report(userValidator.decode({ first_name: 'hi', last_name: 1.5 })));
