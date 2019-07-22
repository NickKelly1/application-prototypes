// validate a user
/**
 * ------------------------
 * ----- Library Code -----
 * ------------------------
 */
class Left<T> {
  public readonly _tag = 'left';
  public value: T;
  public constructor(value: T) {
    this.value = value;
  }
}
const left = <T>(value: T): Left<T> => new Left(value);

class Right<T> {
  public readonly _tag = 'right';
  public value: T;
  public constructor(value: T) {
    this.value = value;
  }
}
const right = <T>(value: T): Right<T> => new Right(value);

type LeftOrRight<E, A> = Left<E> | Right<A>;

/**
 * ------------------------
 * --- Application Code ---
 * ------------------------
 */

interface User {
  name: string;
  // email: string;
  // password: string;
  // created_at: number;
}

/**
 * @description
 * Is the payload an object
 *
 * @param s
 */
const isObject = (s: unknown): LeftOrRight<string, Record<string, any>> => {
  return s instanceof Object ? right(s) : left('must be an object');
};

/**
 * @description
 * Is the payload empty?
 *
 * @param s
 */
const notEmpty = <T extends unknown>(s: T): LeftOrRight<string, T> =>
  s !== null && s !== undefined && s !== '' ? right(s) : left('must be provided');

// /**
//  * @description
//  * Is the payload a string?
//  *
//  * @param s
//  */
// const isString = (s: unknown): LeftOrRight<string, string> => (typeof s === 'string' ? right(s) : left('must be a string'));

// /**
//  * @description
//  * Determines if the property exists on the object
//  * Type guard
//  *
//  * @param obj
//  * @param propertyName
//  */
// export const hasProperty = <T, P extends PropertyKey>(obj: T, property: P): LeftOrRight<string, T & { [index in P]: any }> =>
//   obj instanceof Object && 'hasOwnProperty' in obj && typeof obj.hasOwnProperty === 'function' && obj.hasOwnProperty
//     ? right(obj)
//     : left('={');

// const sanitizeArbitraryPayload = <T>(unknownpayload: unknown, sanitizeTo: T)<T> => {

// }

/**
 * @description
 * Determines if the property exists on the object and is of type string
 * Type guard
 *
 * @param obj
 * @param propertyName
 */
export const hasStringProperty = <T extends Record<string, any>, P extends PropertyKey>(
  obj: T,
  property: P,
): obj is T & { [index in P]: string } => hasProperty(obj, property) && typeof obj[property] === 'string';

const validateUser = (unknownPayload: unknown): LeftOrRight<string[], User> => {
  const isObj = isObject(unknownPayload);
  if (isObj instanceof Left) return left(['must be an object']);

  // validate each property in parallel
  const runningPayloadX = isObj.value;

  [hasStringProperty(runningPayloadX, 'name')];

  // const objKeys = Object.keys(runningPayloadX);
};
