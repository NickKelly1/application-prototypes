import { PropertiesExceptWhere, AnElementOf } from './helper-types';

export function copyWithout<
  T,
  R extends any[],
>(
  input: T,
  values: R
): PropertiesExceptWhere<T, AnElementOf<R>> {
  const entries = Object.entries(input).filter(([k, v]) => !values.includes(v));
  const newObject = Object.fromEntries(entries) as PropertiesExceptWhere<T, AnElementOf<R>>;

  return newObject;
}
