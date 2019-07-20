import { $TS_FIX_ME, AStringKeyOf, AStringOrNumberKeyOf } from '../../@types/helpers/helper-types';

/**
 * @description
 * Get the string keys only from an object
 *
 * @param obj
 */
export const getStringKeysOf = <T extends Record<PropertyKey, any>>(obj: T): (AStringKeyOf<T>)[] => {
  return Object.keys(obj).filter(key => typeof key === 'string') as $TS_FIX_ME<any>;
};

/**
 * @description
 * Get the string and number keys only from an object
 *
 * @param obj
 */
export const getStringAndNumberKeysOf = <T extends Record<PropertyKey, any>>(obj: T): (AStringOrNumberKeyOf<T>)[] => {
  return Object.keys(obj).filter(key => typeof key === 'string' || typeof key === 'number') as $TS_FIX_ME<any>;
};
