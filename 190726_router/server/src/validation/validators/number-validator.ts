import * as ioTs from 'io-ts';
import { Either, right, left, isRight } from 'fp-ts/lib/Either';
import { hasNumberProperty, isNumber } from '../../helpers/type-guards';
import { accumulateChecks } from '../helpers/accumulate-checks';
import { ValidationReporter } from '../helpers/validation-reporter';

interface NumberValidatorOptions {
  isInteger?: boolean;
  min?: number;
  max?: number;
}

const defaultErrorMessages = {
  isNumber: <T extends NumberValidatorOptions>(value: unknown, options: T) => 'Must be a number',
  isInteger: <T extends NumberValidatorOptions>(value: unknown, options: T) => 'Must be an integer',
  min: <T extends NumberValidatorOptions>(value: unknown, options: T) => `Must be greater than or equal to ${options.min}`,
  max: <T extends NumberValidatorOptions>(value: unknown, options: T) => `Must be less than than or equal to ${options.max}`,
};

type NumberValidatorErrors = typeof defaultErrorMessages;

/**
 * @description
 * Number validator factory
 *
 * @example
 * const userValidator = ioTs.type({
 *   birthYear: createNumberValidator({ min: 1900, max: 2020 }),
 *   age: createNumberValidator({ isInteger: true, max: 10, min: 5 }),
 * });
 *
 * @param options
 * @param inputErrorMessages
 */
export const createNumberValidator = <T>(
  options: NumberValidatorOptions = {},
  inputErrorMessages: Partial<NumberValidatorErrors> = {},
) => {
  const errorMessages = { ...defaultErrorMessages, ...inputErrorMessages };

  const optionalPredicates: ((u: unknown) => Either<string, number>)[] = [];

  // number
  optionalPredicates.push((u: unknown) => (isNumber(u) ? right(u) : left(errorMessages.isNumber(u, options))));

  // integer
  if (options.isInteger)
    optionalPredicates.push((u: unknown) =>
      isNumber(u) && Number.isInteger(u) ? right(u) : left(errorMessages.isInteger(u, options)),
    );

  // min
  if (hasNumberProperty(options, 'min'))
    optionalPredicates.push((u: unknown) =>
      isNumber(u) && u >= options.min ? right(u) : left(errorMessages.min(u, options)),
    );

  // max
  if (hasNumberProperty(options, 'max'))
    optionalPredicates.push((u: unknown) =>
      isNumber(u) && u <= options.max ? right(u) : left(errorMessages.max(u, options)),
    );

  return new ioTs.Type<number>(
    'number',
    (u: unknown): u is number => optionalPredicates.every(predicate => isRight(predicate(u))),
    (u: unknown, c) => accumulateChecks(u, c, optionalPredicates),
    ioTs.identity,
  );
};

// const userValidator = ioTs.type({
//   name: createNumberValidator({ max: 10, min: 5 }),
//   age: createNumberValidator({ isInteger: true, max: 10, min: 5 }),
// });

// console.log(ValidationReporter.report(userValidator.decode(undefined)));
