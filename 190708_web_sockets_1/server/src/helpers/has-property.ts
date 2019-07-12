import { Obj, $TS_FIX_ME } from '../../@types/helpers';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @description
 * Determines if the property exists on the object
 * Type guard
 *
 * @param obj
 * @param propertyName
 */
export const hasProperty = <T extends Obj, P extends PropertyKey>(obj: T, property: P): obj is T & { [index in P]: any } =>
  obj.hasOwnProperty(property);

/**
 * @description
 * Determines if the property exists on the object and is of type string
 * Type guard
 *
 * @param obj
 * @param propertyName
 */
export const hasStringProperty = <T extends Obj, P extends PropertyKey>(
  obj: T,
  property: P,
): obj is T & { [index in P]: string } => hasProperty(obj, property) && typeof obj[property] === 'string';

/**
 * @description
 * Determines if the property exists on the object and is of type number
 * Type guard
 *
 * @param obj
 * @param propertyName
 */
export const hasNumberProperty = <T extends Obj, P extends PropertyKey>(
  obj: T,
  property: P,
): obj is T & { [index in P]: number } => hasProperty(obj, property) && typeof obj[property] === 'number';

/**
 * @description
 * Determines if the property exists on the object and is of type array
 * Type guard
 *
 * @param obj
 * @param propertyName
 */
export const hasArrayProperty = <T extends Obj, P extends PropertyKey>(
  obj: T,
  property: P,
): obj is T & { [index in P]: any[] } => hasProperty(obj, property) && (obj[property] as $TS_FIX_ME<any>) instanceof Array;

/**
 * @description
 * Determines if the property exists on the object and is of type object
 * Type guard
 *
 * @param obj
 * @param propertyName
 */
export const hasObjectProperty = <T extends Obj, P extends PropertyKey>(
  obj: T,
  property: P,
): obj is T & { [index in P]: Obj } => hasProperty(obj, property) && (obj[property] as $TS_FIX_ME<any>) instanceof Object;
