/**
 * @description
 * Map an object
 *
 * @param obj
 * @param f
 */
export const mapObject = <K extends string, T, U>(obj: Record<K, T>, f: (x: T) => U): Record<K, U> => {
  const entries = Object
    .entries<T>(obj)
    .map(([k, v]) => ([k, f(v)]));

  const result = Object
    .fromEntries(entries);

  return result;
};