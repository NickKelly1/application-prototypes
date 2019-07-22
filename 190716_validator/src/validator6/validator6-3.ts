import { Either, right, left } from 'fp-ts/lib/Either';
import { ThrowReporter } from 'io-ts/lib/ThrowReporter';
import { PathReporter } from 'io-ts/lib/PathReporter';
import * as ioTs from 'io-ts';

// @see https://github.com/gcanti/io-ts
// @see github.com/gcanti/io-ts

const isString = (s: unknown): Either<string, string> => (typeof s === 'string' ? right(s) : left('must be a string'));

const Product = ioTs.interface({
  id: ioTs.number,
  name: ioTs.string,
  quantity: ioTs.number,
  type: ioTs.union([ioTs.literal('FURNITURE'), ioTs.literal('BOOK')]),
});

const Products = ioTs.array(Product);

const getProducts = () => {
  const apiResponse = [
    {
      id: 1,
      name: 'Table',
      type: '!!invalid type!!',
      quantity: 5,
    },
    {
      id: '2',
      name: 'The Lord of the Rings',
      type: 'BOOK',
      quantity: '10',
    },
  ];

  const result = Products.decode(apiResponse);

  return result;
};

// --------------------------
// --------------------------
// ----- path reporter -----
// --------------------------
// --------------------------

console.log('PathReporter:', PathReporter.report(getProducts()));

//  result: [
//    'Invalid value "!!invalid type!!" supplied to : Array<{ id: ' +
//      'number, name: string, quantity: number, type: ("FURNITURE" | ' +
//      '"BOOK") }>/0: { id: number, name: string, quantity: number, ' +
//      'type: ("FURNITURE" | "BOOK") }/type: ("FURNITURE" | "BOOK")/0: ' +
//      '"FURNITURE"',
//    'Invalid value "!!invalid type!!" supplied to : Array<{ id: ' +
//      'number, name: string, quantity: number, type: ("FURNITURE" | ' +
//      '"BOOK") }>/0: { id: number, name: string, quantity: number, ' +
//      'type: ("FURNITURE" | "BOOK") }/type: ("FURNITURE" | "BOOK")/1: ' +
//      '"BOOK"',
//    'Invalid value "2" supplied to : Array<{ id: number, name: string, ' +
//      'quantity: number, type: ("FURNITURE" | "BOOK") }>/1: { id: number, ' +
//      'name: string, quantity: number, type: ("FURNITURE" | "BOOK") }/id: ' +
//      'number',
//    'Invalid value "10" supplied to : Array<{ id: number, name: string, ' +
//      'quantity: number, type: ("FURNITURE" | "BOOK") }>/1: { id: number, ' +
//      'name: string, quantity: number, type: ("FURNITURE" | "BOOK") ' +
//      '}/quantity: number',
//  ];

// --------------------------
// --------------------------
// -- custom paths reporter -
// --------------------------
// --------------------------

import { pipe } from 'fp-ts/lib/pipeable';
import { fold } from 'fp-ts/lib/Either';
/**
 * @description
 * Get the path to errors within the validating variable
 *
 * @param v
 */
const getPaths = <A>(v: ioTs.Validation<A>): string[] => {
  return pipe(
    v,
    fold(errors => errors.map(error => error.context.map(({ key }) => key).join('.')), () => ['no errors']),
  );
};

console.log('getPaths:', getPaths(getProducts()));
// getPaths: [ '.0.type.0', '.0.type.1', '.1.id', '.1.quantity' ]

// --------------------------
// --------------------------
// -- custom error messages -
// --------------------------
// --------------------------

import { either } from 'fp-ts/lib/Either';

const NumberFromString = new ioTs.Type<number, string, unknown>(
  'NumberFromString',
  ioTs.number.is,
  (u, c) =>
    either.chain(ioTs.string.validate(u, c), s => {
      const n = Number(s);
      return isNaN(n) ? ioTs.failure(u, c, 'cannot parse to a number') : ioTs.success(n);
    }),
  String,
);

console.log('Number From String', NumberFromString.decode('a'));
// console.log(PathReporter.report(NumberFromString.decode('a')));
// console.log(PathReporter.report(NumberFromString.decode('a')));

console.log('...Finished');

// man this stuff is HARD...
