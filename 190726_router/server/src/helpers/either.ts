// @TODO: git gud

// export class Left<E> {
//   public _tag = 'left' as const;

//   public value: E;

//   public constructor(value: E) {
//     this.value = value;
//   }
// }

// export class Right<A> {
//   public _right = 'right' as const;

//   public value: A;

//   public constructor(value: A) {
//     this.value = value;
//   }
// }

// export type Either<E, A> = Left<E> | Right<A>;

// export type LeftValue<EitherType> = EitherType extends Left<infer E> ? E : never;
// export type RightValue<EitherType> = EitherType extends Right<infer A> ? A : never;

// export const left = <E>(value: E) => new Left(value);
// export const right = <A>(value: A) => new Right(value);

// export const isLeft = <E, A>(either: Either<E, A>): either is Left<E> => either instanceof Left;
// export const isRight = <E, A>(either: Either<E, A>): either is Right<A> => either instanceof Right;

// /**
//  * ------------------------
//  * ------ Either Pipe ------
//  * ------------------------
//  */

// type EitherToEither<E, A> = (input: Either<E, A>) => Either<E, A>;

// /**
//  * @description EitherPipe
//  *  - Optimistically pipes RightToEither operations together
//  */
// type EitherPipe<E, A> = (first: Either<E, A>, ...rest: EitherToEither<E, A>[]) => Either<E, A>;

// /**
//  * @description EitherPipe
//  *  - Pipe functions that take and return an Either of type <E, A>
//  *
//  * @param first
//  * @param rest
//  */
// const eitherPipe = <E, A>(first: Either<E, A>, ...rest: EitherPipe<E, A>[]): Either<E, A> => {
//   return rest.reduce((context, nextLink) => nextLink(context), first);
// };

// /**
//  * -----------------------------
//  * ------ Right to Either ------
//  * -----------------------------
//  */

// /**
//  * @description RightToEither
//  *  - Describes function that takes a right and outputs an either
//  *  - For example, a function that transforms a right, but may fail
//  */
// type RightToEither<E, A> = (input: Right<A>) => Either<E, A>;

// /**
//  * -------------------------
//  * ------ Right Chain ------
//  * -------------------------
//  */

// /**
//  * @description RightChain
//  *  - Transforms an operation on a primitive to an operation on a Right
//  *  - Allows optimistic chaining of primitive operations that may produce errors
//  */
// type RightChain<E, A> = (operation: (a: A) => Either<E, A>) => RightToEither<E, A>;

// /**
//  * @description
//  *  - Transform an operation on a primitive to an operation on a Right
//  *
//  * @param operation
//  */
// const rightChain = <E, A>(operation: (a: A) => Either<E, A>): RightToEither<E, A> => {
//   return (previousContext: Right<A>) => operation(previousContext.value);
// };

// /**
//  * ------------------------
//  * ------ Right Pipe ------
//  * ------------------------
//  */

// /**
//  * @description RightPipe
//  *  - Optimistically pipes RightToEither operations together
//  */
// type RightPipe<E, A> = (first: Either<E, A>, ...rest: RightToEither<E, A>[]) => Either<E, A>;

// /**
//  * @description RightPipe
//  *  - Optimistically pipes RightToEither operations together
//  *
//  * @param first
//  * @param rest
//  */
// const rightPipe = <E, A>(first: Either<E, A>, ...rest: RightToEither<E, A>[]): Either<E, A> => {
//   return rest.reduce((context, nextLink) => {
//     if (isLeft(context)) return context;
//     return nextLink(context);
//   }, first);
// };

// /**
//  * -----------------------
//  * ------ MapLeft ------
//  * -----------------------
//  */
// /**
//  * @description MapLeft
//  *  - If is left, transform the value
//  */
// type MapLeft = <E, A, ME>(f: (left: E) => ME) => (either: Either<E, A>) => Either<ME, A>;

// /**
//  * @description
//  *  - If is left, transform the value
//  *
//  * @param f
//  */
// const mapLeft = <E, A, ME>(f: (left: E) => ME) => (either: Either<E, A>) =>
//   isLeft(either) ? left(f(either.value)) : right(either.value);

// /**
//  * -----------------------
//  * ------ Semigroup ------
//  * -----------------------
//  */

// /**
//  * @description
//  * Semigroup of a type
//  */
// interface Semigroup<T> {
//   concat: (a: T, b: T) => T;
// }

// /**
//  * @description
//  * Get an semigroup for an array of given types
//  */
// const getArraySemigroup = <T>(): Semigroup<T[]> => ({
//   concat: (a: T[], b: T[]): T[] => [...a, ...b],
// });

// /**
//  * ----------------------------------
//  * ------ Array Wrap Left Lift ------
//  * ----------------------------------
//  */
// const arrayWrapLeftLift = <E, A>(operation: (a: A) => Either<E, A>): ((a: A) => Either<E[], A>) => {
//   return (a: A) => mapLeft<E, A, E[]>((leftValue: E) => [leftValue])(operation(a));
// };

// // /**
// //  * -------------------------
// //  * ------ Applicative ------
// //  * -------------------------
// //  */

// // export interface Applicative<F> extends Apply<F> {
// //   readonly of: <A>(a: A) => HKT<F, A>;
// // }

// const minLen = (s: string) => (s.length > 6 ? right(s) : left('Too small =['));
// const containsA = (s: string) => (s.includes('a') ? right(s) : left("Doesn't contain 'a' =["));

// const hallo = 'hallo';
// const ello = 'ello';
// const elllllo = 'elllllo';
// const bamboocha = 'bamboocha';

// console.log('---------------------------------------------------');
// console.log('---------------- optimistic pipes -----------------');
// console.log('---------------------------------------------------');
// console.log(hallo, rightPipe(minLen(hallo), rightChain(containsA)));
// console.log(ello, rightPipe(minLen(ello), rightChain(containsA)));
// console.log(elllllo, rightPipe(minLen(elllllo), rightChain(containsA)));
// console.log(bamboocha, rightPipe(minLen(bamboocha), rightChain(containsA)));

// console.log('---------------------------------------------------');
// console.log('---------------- optimistic pipes -----------------');
// console.log('---------------------------------------------------');
// console.log(hallo, rightPipe(arrayWrapLeftLift(minLen(hallo)), arrayWrapLeftLift(rightChain(containsA))));
// console.log(ello, rightPipe(minLen(ello), rightChain(containsA)));
// console.log(elllllo, rightPipe(minLen(elllllo), rightChain(containsA)));
// console.log(bamboocha, rightPipe(minLen(bamboocha), rightChain(containsA)));
