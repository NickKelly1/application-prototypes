/**
 * @description
 * used as "TODO: fix this type"
 */
export type $TS_FIX_ME<T> = T;

/**
 * @description
 * Get an element of a tuple
 *
 * @note: ternary for const and non-cost tuples
 */
export type ElementOf<T> = T extends readonly (infer IE)[] ? IE : (T extends (infer ME)[] ? ME : T);

/**
 * @description
 * Get values from an object
 */
export type ValueFrom<T extends {}> = T[keyof T];

/**
 * @description
 * Is this needed...? "Object" doesn't seem to get the job done...
 */
export type Obj = InstanceType<ObjectConstructor>;
