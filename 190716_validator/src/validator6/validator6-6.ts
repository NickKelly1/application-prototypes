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
interface User {
  name: string;
  email: string;
}

// const objectHasStringProperty = <T extends Record<string, unknown>, P extends PropertyKey>(obj: T, property: P)

/**
 * ------------------------
 * --- Application Code ---
 * ------------------------
 */
// @ts-ignore
const validateUser = (unknownPayload: unknown): LeftOrRight<string[], User> => {
  if (!(unknownPayload instanceof Object)) return left(['not an object...']);
  const unknownObjectPayload: Record<string, unknown> = unknownPayload as any;

  const allowableFields = ['name', 'email'] as const;

  // sanitize the payload so it cant' override object properties like "hasOwnProperty"
  const sanitizedPayload = allowableFields.reduce(
    (acc, field) => {
      acc[field] = unknownObjectPayload[field];
      return acc;
    },
    ({} as any) as Record<keyof User, unknown>,
  );
  const payloadErrors = allowableFields.reduce(
    (acc, field) => {
      acc[field] = undefined;
      return acc;
    },
    ({} as any) as Record<keyof User, unknown>,
  );

  if (typeof sanitizedPayload.name !== 'string') {
    payloadErrors.name;
  }

  // validate the name field
  // validate name
  if ( sanitizedPayload.name
  // hasStri;
  // sanitizedPayload.name;

  console.log('qq', sanitizedPayload);
};

validateUser({ hasOwnProperty: 'trolled!', hello: 'world :)', name: 'johnny' });
