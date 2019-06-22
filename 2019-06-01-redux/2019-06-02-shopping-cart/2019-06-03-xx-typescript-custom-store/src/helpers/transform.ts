
/**
 * @description
 * Transforms a source to a target via a transform function
 *
 * @param source
 * @param transform
 */
export const transform = <A extends any, F extends (args: A) => any>(source: A, transform: F): ReturnType<F> => transform(source);
