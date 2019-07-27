/* eslint-disable @typescript-eslint/no-explicit-any */

import { AStringValueOf, StringConstObject, AStringKeyOf } from './helper-types';

export type UnsanitizedPayload = Record<PropertyKey, unknown>;

/**
 * @description
 * Errors from sanitization of a payload
 */
export interface SanitizationErrors<SanitizedPayload, FieldsToExcludeFromErrors extends keyof any> {
  misc: string[];
  fields: Record<Exclude<AStringKeyOf<SanitizedPayload>, FieldsToExcludeFromErrors>, string[]>;
}

/**
 * @description
 * Output from a function that sanitizes a payload
 */
export type SanitizerFunctionOutput<SanitizedPayload, FieldsToExcludeFromErrors extends keyof any> =
  | { hasErrors: true; errors: SanitizationErrors<SanitizedPayload, FieldsToExcludeFromErrors> }
  | { hasErrors: false; sanitizedPayload: SanitizedPayload };

/**
 * @description
 * Function that sanitizes a payload
 */
export type SanitizerFunction<
  SanitizedPayload,
  Options extends Record<PropertyKey, any>,
  FieldsToExcludeFromErrors extends keyof any
> = (
  unsanitizedPayload: UnsanitizedPayload,
  options: Options,
) => SanitizerFunctionOutput<SanitizedPayload, FieldsToExcludeFromErrors>;

/**
 * @description
 * Group of sanitizers for a given set of keys
 */
export type SanitizerGroup<
  KeyMap extends StringConstObject,
  KeysToSanitizedPayloads extends Record<AStringValueOf<KeyMap>, any>,
  Options extends Record<PropertyKey, any>,
  FieldsToExcludeFromErrors extends keyof any
> = {
  [M in AStringValueOf<KeyMap>]: SanitizerFunction<KeysToSanitizedPayloads[M], Options, FieldsToExcludeFromErrors>;
};

export interface DoesSanitization<
  KeyMap extends StringConstObject,
  KeysToSanitizedPayloads extends Record<AStringValueOf<KeyMap>, any>,
  FieldsToExcludeFromErrors extends keyof any
> {
  sanitize<K extends AStringValueOf<KeyMap>>(
    key: K,
    unsanitizedPayload: UnsanitizedPayload,
  ): SanitizerFunctionOutput<KeysToSanitizedPayloads[K], FieldsToExcludeFromErrors>;
}
