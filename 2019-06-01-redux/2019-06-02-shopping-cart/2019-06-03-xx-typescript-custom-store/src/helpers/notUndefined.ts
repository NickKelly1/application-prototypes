/**
 * @description
 * Useful type guard for letting TS know a variable is not undefined
 * Example usage:
 *
 * @example
 *  productsOrUndefinedArray.filter(notUndefined) // => array of definitely products
 */
export const notUndefined = <T>(x: T | undefined): x is T => x !== undefined;
