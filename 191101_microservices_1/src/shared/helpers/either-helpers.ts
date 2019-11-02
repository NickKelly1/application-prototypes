import * as ioTs from 'io-ts';
import { left, Left, Right, right, Either, isRight, isLeft } from 'fp-ts/lib/Either';
import { PathReporter } from 'io-ts/lib/PathReporter';

export type RightValue<T> = T extends Right<infer R> ? R : never;
export type LeftValue<T> = T extends Left<infer L> ? L : never;



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



/**
 * Verify a message fits the desired shape
 *
 * @param decoder
 */
export function useDecoder<A>(decoder: ioTs.Decode<unknown, A>) {
  return function<T extends string>(payload: unknown) {
    const result = decoder(payload);
    return result;
  }
}


/**
 * Report on the errors from a left validation
 *
 * @param errors
 */
export function leftPathReport(errors: ioTs.Errors) {
  return PathReporter.report(left(errors));
}

/**
 * Transform a map of codecs into a union of their type values
 */
export type UnionFromCodecMap<T extends Record<string, any>> = {[K in keyof T]: ioTs.TypeOf<T[K]>}
