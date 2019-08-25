export class Some<T> {
  public _tag = 'some' as const;
  public value: T;

  public constructor(value: T) {
    this.value = value;
  }
}

export type Maybe<T> = null | Some<T>;

export type MaybeValue<MaybeType> = MaybeType extends Some<infer T> ? T : never;

export const none = () => null;
export const some = <T>(value: T) => new Some(value);

export const isNone = <T>(q: Maybe<T>): q is null => q === null;
export const isSome = <T>(q: Maybe<T>): q is Some<T> => q instanceof Some;
