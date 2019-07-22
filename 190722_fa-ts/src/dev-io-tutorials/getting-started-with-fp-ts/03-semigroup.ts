// @see https://dev.to/gcanti/getting-started-with-fp-ts-semigroup-2mf7

// ----------------------------
// ------- Introduction -------
// ----------------------------

/**
 * "`Semigroup`s are a fundamental abstraction of functional programming"
 * "`Semigroup`s capture the essence of parallelisable operations"
 *
 *
 * @description
 * A `Semigroup` is a pair `(A, *)` in which `A is a non-empty set` and
 * `* is a binary associative operation on A` i.e. a function that takes
 * two elements of A as input and returns an element of A as output
 *
 * ```ts
 * \*: (x: A, y: A) => A
 * ```
 *
 * Associative means the equation
 * ```ts
 * (x * y) * z = x * (y * z)
 * ```
 * holds for all x, y, z in A
 *
 *
 * Examples of `Semigroup`s
 * (number, *) where * is the usual multiplication of numbers
 * (string, +) where +is the concatenation of strings
 * (boolean, &&) where && is the usual conjunction
 */

// -------------------------
// ------ Type Class -------
// -------------------------

/**
 * Type Class Definition
 *
 * @interface Semigroup
 *
 * @description
 * The following law must hold
 * **Associativity**:
 *  concat(concat(x, y), z) === concat(x, concat(y, z))
 *  for all x, y, z, in A
 *
 * concat:
 *  "concatenation"
 *  "merging"
 *  "fusion"
 *  "selection"
 *  "addition"
 *  "substitution"
 */
interface Semigroup<A> {
  concat: (x: A, y: A) => A;
}

// -------------------------
// ------- Instances -------
// -------------------------

/**
 * @description
 * Semigroup that takes the product of two numbers
 */
const semigroupProduct: Semigroup<number> = {
  concat: (x, y) => x * y,
};

/**
 * @description
 * Semigroup that takes the sum of two numbers
 */
const semigroupSum: Semigroup<number> = {
  concat: (x, y) => x + y,
};

/**
 * @description
 * Semigroup that concatenates two strings
 */
const semigroupString: Semigroup<string> = {
  concat: (x, y) => x + y,
};

// ----------------------------------
// ------- Trivial Semigroups -------
// ----------------------------------

/**
 * can't find an instance? there are always
 * at least two trivial Semigroups for any type `A`
 */

/**
 * @description
 * Always return the first argument
 */
function getFirstSemigroup<A = never>(): Semigroup<A> {
  return { concat: (x, y) => x };
}

/**
 * @description
 * Always return the last argument
 */
function getLastSemigroup<A = never>(): Semigroup<A> {
  return { concat: (x, y) => y };
}

// -----------------------------------
// --------- Free Semigroups ---------
// -----------------------------------

/**
 * Another technique is to define a `Semigroup` instance for `Array<A> (*)`,
 * called a **free Semigroup**
 * (*) strictly speaking is a `Semigroup` instance for non array elements of A
 *
 * @note: the free `Semigroup` of A is the `Semigroup` whose elements
 * are all possible non-empty finite sequences of elements of A
 *
 * @description
 * Get a `Semigroup` of type array of A, i.e. `A[]`
 * The returned `Semigroup`'s concat function simply
 * concatenates the second argument (type A[]) to the first (type A[])
 * i.e. returns (without respect to references) [...x, ...y]
 */
function getArraySemigroup<A = never>(): Semigroup<A[]> {
  return { concat: (x, y) => x.concat(y) };
}

console.log('getArraySemigroup<number>().concat([1], [2])', getArraySemigroup<number>().concat([1], [2])); // [ 1, 2 ]

/**
 * @description
 * Map the elements of A to the singleton elements of A[]
 *
 * @param a
 */
function of<A>(a: A): A[] {
  return [a];
}

// -------------------------------------
// --------- Deriving from Ord ---------
// -------------------------------------

// if we already have an Ord instance for A, then we can "turn it" into
// two possible `Semigroup`s
import { ordNumber } from 'fp-ts/lib/Ord';
import { getMeetSemigroup, getJoinSemigroup, semigroupAll } from 'fp-ts/lib/Semigroup';

/**
 * @description
 * Takes the minimum of two values
 */
const semigroupMin: Semigroup<number> = getMeetSemigroup(ordNumber);

/**
 * @description
 * Takes the maximum of two values
 */
const semigroupMax: Semigroup<number> = getJoinSemigroup(ordNumber);

console.log('semigroupMin.concat(2, 1)', semigroupMin.concat(2, 1)); // 1
console.log('semigroupMax.concat(2, 1)', semigroupMax.concat(2, 1)); // 2

// ---------------------------------------------------------
// --------- Semigroup instances for complex types ---------
// ---------------------------------------------------------

// point

interface Point {
  x: number;
  y: number;
}

/**
 * @description
 * semigroupPoint's concat takes the concat of
 * the its points semigroupSum's
 */
const semigroupPoint1: Semigroup<Point> = {
  concat: (p1, p2) => ({
    x: semigroupSum.concat(p1.x, p2.x),
    y: semigroupSum.concat(p1.y, p2.y),
  }),
};

// ###############################
// ##### getStructSemigroup ######
// ###############################

// or equivalently, using the combinator "getStructSemigroup"

import { getStructSemigroup } from 'fp-ts/lib/Semigroup';

/**
 * @description
 * Uses the combinator, `getStructSemigroup` to create a `Semigroup`
 * for `Point` which sums the `x` and `y` components of the
 * `Point`'s provided
 */
const semigroupPoint2: Semigroup<Point> = getStructSemigroup({
  x: semigroupSum,
  y: semigroupSum,
});

// vector

interface Vector {
  from: Point;
  to: Point;
}

/**
 * @description
 * Uses the combinator, `getStructSemigroup` to create a `Semigroup`
 * for `Vector` which acts on the the `from` and `to` components
 * of the `Vector`'s provided, with the `semigroupPoint2` `Semigroup`
 */
const semigroupVector: Semigroup<Vector> = getStructSemigroup({
  from: semigroupPoint2,
  to: semigroupPoint2,
});

// ------------------------------------
// --------- More combinators ---------
// ------------------------------------

/**
 * `getStructSemigroup` is not the only combinator provided by fp-ts
 *
 * `getFunctionSemigroup` allows derivation of a `Semigroup` instance:
 *  - Given an instance of a `Semigroup` for S, we can derive an instance
 *    of `Semigroup` for functions with signature `(a: A) => S`, `for all A`
 */

import { getFunctionSemigroup } from 'fp-ts/lib/Semigroup';

/**
 * @description
 * `semigroupAll` is the boolean `Semigroup` under conjunction
 *
 * This is a `Semigroup` of functions that take a `Point` and return a `boolean`
 */
const semigroupPredicate: Semigroup<(p: Point) => boolean> = getFunctionSemigroup(semigroupAll)<Point>();

const isPositiveX = (p: Point): boolean => p.x >= 0;
const isPositiveY = (p: Point): boolean => p.y >= 0;

const isPositiveXY = semigroupPredicate.concat(isPositiveX, isPositiveY);

console.log('isPositiveXY({ x: 1, y: 1 })', isPositiveXY({ x: 1, y: 1 })); // true
console.log('isPositiveXY({ x: -1, y: 1 })', isPositiveXY({ x: -1, y: 1 })); // false
console.log('isPositiveXY({ x: 1, y: -1 })', isPositiveXY({ x: 1, y: -1 })); // false
console.log('isPositiveXY({ x: -1, y: -1 })', isPositiveXY({ x: -1, y: -1 })); // false

// ---------------------------
// --------- Folding ---------
// ---------------------------

/**
 * By definition, `concat` works with only two elements of `A`,
 * what if we want more elements?
 *
 * The `fold` function takes
 *  - A `Semigroup` instance
 *  - an initial value
 *  - an array of elements
 */

import { fold } from 'fp-ts/lib/Semigroup';

/**
 * @description
 * Takes an accumulator and acts on it & the next array entry
 * with the semigroup, and keeps acting until there are no
 * array elements left
 */
const sum = fold(semigroupSum);
console.log('sum(0, [1, 2, 3, 4])', sum(0, [1, 2, 3, 4])); // 10

/**
 * @description
 * Same as `sum` but with semigroupProduct rather than semigroupSum
 */
const product = fold(semigroupProduct);
console.log('product(0, [1, 2, 3, 4])', product(0, [1, 2, 3, 4])); // 24

// ----------------------------------------------------
// --------- Semigroups for type constructors ---------
// ----------------------------------------------------

/**
 * what if we want to "merge" two Option<A>? There are four cases
 *
 * | --- x --- | ---- y ---- | -- concat (x, y) -- |
 * | --------- | ----------- | ------------------- |
 * |   none    |    none     |        none         |
 * |  some(a)  |    none     |        none         |
 * |   none    |   some(a)   |        none         |
 * |  some(a)  |   some(b)   |          ?          |
 * | --------- | ----------- | ------------------- |
 *
 * Problem with the last one is we'd need to "merge" two `A`'s
 *  - That's what `Semigroup` does - we can require a semigroup for `A`
 *    then derive a semigroup instance for `Option<A>`
 *  - this is how the `getApplySemigroup` combinator works
 */

import { getApplySemigroup, some, none } from 'fp-ts/lib/Option';

const S = getApplySemigroup(semigroupSum);

S.concat(some(1), none); // none
S.concat(some(2), some(2)); // some 3

// -----------------------------------------------------------------------------------------------
// -------------------------------------------- Example ------------------------------------------
// --------- stolen from https://dev.to/gcanti/getting-started-with-fp-ts-semigroup-2mf7 ---------
// --- who adapted it from http://www.tomharding.me/2017/03/13/fantas-eel-and-specification-4/ ---
// -----------------------------------------------------------------------------------------------

// imagine we have customers for our store

interface Customer {
  name: string;
  favouriteThings: string[];
  registeredAt: number;
  lastUpdatedAt: number;
  hasMadePurchase: boolean;
}

// but we end up with duplicate records for the same person
// solve this by merging the customers

import { semigroupAny } from 'fp-ts/lib/Semigroup';
import { getMonoid } from 'fp-ts/lib/Array';
import { contramap } from 'fp-ts/lib/Ord';

const semigroupCustomer: Semigroup<Customer> = getStructSemigroup({
  // keep the longer name
  name: getJoinSemigroup(contramap((s: string) => s.length)(ordNumber)),
  // accumulate things - getMonoid returns a semigroup for string[] (see later)
  favouriteThings: getMonoid<string>(),
  // keep the least recent date
  registeredAt: getMeetSemigroup(ordNumber),
  // keep the most recent date
  lastUpdatedAt: getJoinSemigroup(ordNumber),
  // boolean semigroup under disjunction
  hasMadePurchase: semigroupAny,
});

console.log(
  'Joining together customers:',
  semigroupCustomer.concat(
    {
      name: 'Giulio',
      favouriteThings: ['math', 'climbing'],
      registeredAt: new Date(2018, 1, 20).getTime(),
      lastUpdatedAt: new Date(2018, 2, 18).getTime(),
      hasMadePurchase: false,
    },
    {
      name: 'Giulio Canti',
      favouriteThings: ['functional programming'],
      registeredAt: new Date(2018, 1, 22).getTime(),
      lastUpdatedAt: new Date(2018, 2, 9).getTime(),
      hasMadePurchase: true,
    },
  ),
);
/*
{ name: 'Giulio Canti',
  favouriteThings: [ 'math', 'climbing', 'functional programming' ],
  registeredAt: 1519081200000, // new Date(2018, 1, 20).getTime()
  lastUpdatedAt: 1521327600000, // new Date(2018, 2, 18).getTime()
  hasMadePurchase: true }
*/
