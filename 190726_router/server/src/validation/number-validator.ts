import * as ioTs from 'io-ts';
import { Either, right, left, isRight, isLeft, Left } from 'fp-ts/lib/Either';
import { hasNumberProperty, isString, isNumber } from '../helpers/type-guards';

interface NumberValidatorOptions {
  isInteger?: boolean;
  min?: number;
  max?: number;
}

const defaultErrorMessages = {
  isNumber: <T extends NumberValidatorOptions>(value: unknown, options: T) => 'Must be a number',
  isInteger: <T extends NumberValidatorOptions>(value: number, options: T) => 'Must be an integer',
  min: <T extends NumberValidatorOptions>(value: number, options: T) => `Must be greater than or equal to ${options.min}`,
  max: <T extends NumberValidatorOptions>(value: number, options: T) => `Must be less than than or equal to ${options.max}`,
};

type NumberValidatorErrors = typeof defaultErrorMessages;

export const createNumberValidator = <T>(
  options: NumberValidatorOptions = {},
  inputErrorMessages: Partial<NumberValidatorErrors> = {},
) => {
  const errorMessages = { ...defaultErrorMessages, inputErrorMessages };

  const optionalPredicates: ((u: number) => Either<string, number>)[] = [];

  if (options.isInteger)
    optionalPredicates.push((u: number) => (Number.isInteger(u) ? right(u) : left(errorMessages.isInteger(u, options))));

  if (hasNumberProperty(options, 'min'))
    optionalPredicates.push((u: number) => (u >= options.min ? right(u) : left(errorMessages.min(u, options))));

  if (hasNumberProperty(options, 'max'))
    optionalPredicates.push((u: number) => (u <= options.max ? right(u) : left(errorMessages.max(u, options))));

  return new ioTs.Type<number>(
    'number',
    (u: unknown): u is number => typeof u === 'number' && optionalPredicates.every(predicate => isRight(predicate(u))),
    (u: unknown, c) => {
      if (!isNumber(u)) return ioTs.failure(u, c, errorMessages.isNumber(u, options));

      const checks = optionalPredicates.map(predicate => predicate(u));
      const foundErrorMessages = checks.map(check => (isLeft(check) ? check.left : null)).filter(isString);
      if (foundErrorMessages.length === 0) return ioTs.success(u);
      return ioTs.failure(u, c, foundErrorMessages.join('\n'));
    },
    ioTs.identity,
  );
};

const validator = createNumberValidator({ isInteger: true, max: 10, min: 5 });

const validationErrorReporter = <T>(result: Either<ioTs.Errors, T>) => {
  if (isRight(result)) return [];

  return result.left.reduce(
    (acc, error) => {
      const key = error.context.reduce((levelAcc, level) => (levelAcc += level.key), '');
      // if (!acc[key]) acc[key] = [];
      if (error.message) acc[key] = (acc[key] || '') + error.message;
      return acc;
    },
    ({} as any) as Record<string, string>,
  );
};

const userValidator = ioTs.type({
  name: createNumberValidator({ max: 10, min: 5 }),
  age: createNumberValidator({ isInteger: true, max: 10, min: 5 }),
});

console.log(validationErrorReporter(userValidator.decode({ name: 'hi', age: 1.5 })));
