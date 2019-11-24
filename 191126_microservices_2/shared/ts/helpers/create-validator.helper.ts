import * as either from 'fp-ts/lib/Either';
import Joi from '@hapi/joi';



/**
 * Create a validator function for a given schema
 *
 * @param schema
 */
export function createValidator<T>(schema: Joi.ObjectSchema) {
  return function validate(payload: unknown): either.Either<Joi.ValidationError, T> {
    const result = schema.validate(payload, { abortEarly: false, errors: { label: 'path' } });
    if (result.error) return either.left(result.error);
    return either.left(result.value);
  }
}



/**
 * Transform validator errors into a simple object with keys and values
 *
 * @param error
 */
export function normaliseValidationErrors(error: Joi.ValidationError) {
  const errors = error.details.reduce((acc, next) => {
    const path = next.path.join('.');
    acc[path] = acc[path] ? `${acc[path]}\n${next.message}}` : next.message;
    return acc;
  }, {} as Record<string, string>);

  return errors;
}
