import { left, Left, Right, right, Either, isRight, isLeft } from 'fp-ts/lib/Either';

/**
 * Wrap the return of a function in a right
 *
 * @param fn
 */
export function leftify<T extends (...args: any[]) => any>(applier: T) {
  return function applyRightify(...args: Parameters<T>) {
    return left(applier(...args)) as Left<ReturnType<T>>;
  }
}



/**
 * Wrap the return of a function in a right
 *
 * @param fn
 */
export function rightify<T extends (...args: any[]) => any>(fn: T) {
  return function applyRightify(...args: Parameters<T>) {
    return right(fn(...args)) as Right<ReturnType<T>>;
  }
}



export function ifRight<L, R>(data: Either<L, R>) {
  return function onThis<O>(applyFn: (inp: R) => O): Either<L, O> {
    if (isRight(data)) return right(applyFn(data.right));
    return data;
  }
}



export function ifLeft<L, R>(data: Either<L, R>) {
  return function onThis<O>(applyFn: (inp: L) => O): Either<O, R> {
    if (isLeft(data)) return left(applyFn(data.left));
    return data;
  }
}



/**
 * Map the left and right paths separately
 *
 * @param data
 */
export function mapBoth<L, R, L2, R2>(onLeft: (l: L) => L2, onRight: (r: R) => R2) {
  return function doMapBoth(data: Either<L, R>): L2 | R2 {
    if (isLeft(data)) return onLeft(data.left);
    return onRight(data.right);
  }
}