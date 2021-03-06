/**
 * @description
 * used as "TODO: fix this type"
 */
export type $TS_FIX_ME<T> = T;

/**
 * @description
 * Object defining a static set of allowable values for some entity
 */
export type StringConstObject = Readonly<Record<string, string>>;

/**
 * @description
 * Object defining a static set of allowable values for some entity
 */
export type NumberConstObject = Readonly<Record<string, number>>;

/**
 * @description
 * Object defining a static set of allowable values for some entity
 * Less restrictive than StringConstObject and NumberConstObject
 */
export type StringOrNumberConstObject = Readonly<Record<string, string | number>>;

/**
 * @description
 * Get an element of a tuple
 *
 * @note: ternary for const and non-cost tuples
 *
 * @example
 * const dinnerOptions = ['pizza', 'cereal', 'endangered animals'] as const;
 * type DINNER_OPTIONS = AnElementOf<dinnerOptions>; // 'pizza' | 'cereal' | 'endangered animals'
 */
export type AnElementOf<T> = T extends readonly (infer IE)[] ? IE : (T extends (infer ME)[] ? ME : T);

/**
 * @description
 * Get values from an object
 *
 * @example
 * const movieBusinessSummary = {
 *  name: 'Lucas Arts',
 *  owner: 'George Lucas',
 *  movies: ['Star Wars II', 'Indiana Jones', ] as const,
 *  [Symbol.iterator]: function* () {
 *    yield {year: 1995, revenue: 100};
 *    yield {year: 1996, revenue: 200};
 *    yield {year: 1997, revenue: 50};
 *  }
 *  0: 'arrayIndexZero',
 *  1: 'arrayIndexOne',
 * } as const;
 * type A_VALUE = AValueOf<typeof movieBusinessSummary>; // 'Lucas Arts' | 'George Lucas' | readonly ['Star Wars II', 'Indiana Jones'] | 'arrayIndexZero' | 'arrayIndexOne'
 */
export type AValueOf<T extends {}> = T[keyof T];

/**
 * @description
 * Get string values from an const object
 *  - Provides a union of string values
 *  - Primary use case is for connecting constants (from readonly objects) to their usage as keys in maps
 *
 * @example
 * const SOCKET_MESSAGES = { NEW_MESSAGE: 'new_message', TYPING: 'typing', LOG_OUT: 'log_out' } as const;
 * export type ASocketMessageValue = AStringKeyOf<SOCKET_MESSAGES> // 'new_message' | 'typing' | 'log_out'
 */
export type AStringValueOf<T extends StringConstObject, Return = T[keyof T] extends string ? T[keyof T] : never> = Return;

/**
 * Get number values from an const object
 *  - Provides a union of number values
 *  - Primary use case is for connecting constants (from readonly objects) to their usage as keys in maps
 *
 * @example
 * const SOCKET_MESSAGES = { NEW_MESSAGE: 1, TYPING: 2, LOG_OUT: 3 } as const;
 * export type ASocketMessageValue = AStringKeyOf<SOCKET_MESSAGES> // 1 | 2 | 3
 */
export type ANumberValueOf<
  T extends StringOrNumberConstObject,
  Return = T[keyof T] extends string ? T[keyof T] : T[keyof T] extends number ? T[keyof T] : never
> = Return;

/**
 * Get string or number values from a const object
 *  - Provides a union of string and number values
 *  - Primary use case is for connecting constants (from readonly objects) to their usage as keys in maps
 *
 * @example
 * const SOCKET_MESSAGES = { NEW_MESSAGE: 'new_message', TYPING: 2, LOG_OUT: 3 } as const;
 * export type ASocketMessageValue = AStringKeyOf<SOCKET_MESSAGES> // 'new_message' | 2 | 3
 */
export type AStringOrNumberValueOf<
  T extends StringOrNumberConstObject,
  Return = T[keyof T] extends string ? T[keyof T] : T[keyof T] extends number ? T[keyof T] : never
> = Return;

/**
 * @description
 * Extract the keys that are strings from a type
 *
 * @example
 * const movieBusinessSummary = {
 *  name: 'Lucas Arts',
 *  owner: 'George Lucas',
 *  movies: ['Star Wars II', 'Indiana Jones', ] as const,
 *  [Symbol.iterator]: function* () {
 *    yield {year: 1995, revenue: 100};
 *    yield {year: 1996, revenue: 200};
 *    yield {year: 1997, revenue: 50};
 *  }
 *  0: 'arrayIndexZero',
 *  1: 'arrayIndexOne',
 * } as const;
 * type A_STRING_KEY_OF = AStringKeyOf<typeof movieBusinessSummary> // 'name' | 'owner' | 'movies'
 */
export type AStringKeyOf<T> = Extract<keyof T, string>;

/**
 * @description
 * Extract the keys that are strings or numbers from a type
 *
 * @example
 * const movieBusinessSummary = {
 *  name: 'Lucas Arts',
 *  owner: 'George Lucas',
 *  movies: ['Star Wars II', 'Indiana Jones', ] as const,
 *  [Symbol.iterator]: function* () {
 *    yield {year: 1995, revenue: 100};
 *    yield {year: 1996, revenue: 200};
 *    yield {year: 1997, revenue: 50};
 *  }
 *  0: 'arrayIndexZero',
 *  1: 'arrayIndexOne',
 * } as const;
 * type A_STRING_KEY_OF = AStringKeyOf<typeof movieBusinessSummary> // 'name' | 'owner' | 'movies' | 0 | 1
 */
export type AStringOrNumberKeyOf<T> = Extract<keyof T, string | number>;

/**
 * @description
 * Keys of the object, except those of type R
 *
 * Extrapolated from TS documentation
 *
 * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html
 */
type KeysExceptWhere<T extends {}, R> = { [K in keyof T]: T[K] extends R ? never : K }[keyof T];

/**
 * @description
 * Properties of the object, excet those of type R
 *
 * Extrapolated from TS documentation
 *
 * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html
 */
type PropertiesExceptWhere<T extends {}, R> = Pick<T, KeysExceptWhere<T, R>>;

/**
 * @description
 * Keys of the object where the type is R
 *
 * Extrapolated from TS documentation
 *
 * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html
 */
type KeysWhere<T extends {}, R> = { [K in keyof T]: T[K] extends R ? K : never }[keyof T];

/**
 * @description
 * Properties of the object where the type is R
 *
 * Extrapolated from TS documentation
 *
 * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html
 */
type PropertiesWhere<T extends {}, R> = Pick<T, KeysWhere<T, R>>;