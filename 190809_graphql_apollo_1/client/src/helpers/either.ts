export class Left<T> {
  public _tag = 'left' as const;
  public value: T;

  public constructor(value: T) {
    this.value = value;
  }
}

export class Right<T> {
  public _tag = 'right' as const;
  public value: T;

  public constructor(value: T) {
    this.value = value;
  }
}

export type Either<E, A> = Left<E> | Right<A>;

export type LeftValue<EitherType> = EitherType extends Either<infer E, infer A> ? E : never;
export type RightValue<EitherType> = EitherType extends Either<infer E, infer A> ? A : never;

export const left = <E>(value: E) => new Left(value);
export const right = <A>(value: A) => new Right(value);

export const isLeft = <E, A>(q: Either<E, A>): q is Left<E> => q instanceof Left;
export const isRight = <E, A>(q: Either<E, A>): q is Right<A> => q instanceof Right;
