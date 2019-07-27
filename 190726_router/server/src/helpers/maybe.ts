export class None {
  public _tag = 'none' as const;
}

export class Some<T> {
  public _tag = 'some' as const;
  public value: T;

  public constructor(value: T) {
    this.value = value;
  }
}

export type Maybe<T> = None | Some<T>;

/**
 * @note:
 *  - doesn't work when we use Extends Maybe<infer T>..., only if check extends Some<infer T>...
 *  - is this a bug?
 */
export type MaybeValue<MaybeType> = MaybeType extends Some<infer T> ? T : never;

export const none = () => new None();
export const some = <T>(value: T) => new Some(value);

export const isNone = <T>(q: Maybe<T>): q is None => q instanceof None;
export const isSome = <T>(q: Maybe<T>): q is Some<T> => q instanceof Some;
