// @see https://dev.to/gcanti/getting-started-with-fp-ts-setoid-39f3j

// -----------------------
// ---- type classes: ----
// -----------------------

/**
 * Type `A` belongs to type class `Eq` if there is a function
 * named `equal` of the appropriate type, defined on it
 */
interface Eq<A> {
  /**
   * return `true` if `x` is equal to `y`
   */
  readonly equals: (x: A, y: A) => boolean;
}

// -----------------------
// ------ instances: -----
// -----------------------

/**
 * Instances must satisfy the following laws:
 * 1. **Reflexivity**: equals(x, x) === true, for all x in A
 * 2. **Symmetry**: equals(x, y) === equals(y, x) for all x, y in A
 * 3. **Transitivity**: if equals(x, y) === true and equals(y, z) === true,
 *    then equals(x, z) === true, for all x, y, z in A
 */

// number example:

/**
 * @description
 * Equality instance for the type class "number"
 */
const eqNumber: Eq<number> = {
  equals: (x, y) => x === y,
};

// console.log("[eqNumber.equals('abc', 'def')]", eqNumber.equals('abc', 'def')); // ts error
console.log('[eqNumber.equals(1, 2)]', eqNumber.equals(1, 2)); // false
console.log('[eqNumber.equals(1, 1)]', eqNumber.equals(1, 1)); // true

// array example

/**
 * @description
 * Determine whether the array of type `A` contains the specified instance of `A`
 *
 * @param E
 */
function hasElement<A>(E: Eq<A>): (a: A, as: A[]) => boolean {
  return (a, as) => as.some(item => E.equals(item, a));
}

console.log('hasElement(eqNumber)(1, [1, 2, 3])', hasElement(eqNumber)(1, [1, 2, 3])); // true
console.log('hasElement(eqNumber)(4, [1, 2, 3])', hasElement(eqNumber)(4, [1, 2, 3])); // false

// more complex types

interface Point {
  x: number;
  y: number;
}

/**
 * @description
 * Equality instance for the type class "Point"
 */
const eqPoint1: Eq<Point> = {
  equals: (p1, p2) => p1 === p2 || (p1.x === p2.x && p1.y === p2.y),
};

// --------------------------------------
// - composing instances (combinators): -
// --------------------------------------

// ######################
// #### getStructEq #####
// ######################

/**
 * `getStructEq` is a "combinator" we can use to build an
 * Eq instance for a struct by providing an Eq instance
 * for each field
 */

import { getStructEq } from 'fp-ts/lib/Eq';

/**
 * @description
 * Equality instance for the type class "Point"
 */
const eqPoint2: Eq<Point> = getStructEq({
  x: eqNumber,
  y: eqNumber,
});

// @note: A and B are equivalent
const pointA: Point = { x: 1, y: 2 };
const pointB: Point = { x: 1, y: 2 };
const pointC: Point = { x: 2, y: 2 };

console.log('eqPoint2.equals(pointA, pointA)', eqPoint2.equals(pointA, pointA)); // true
console.log('eqPoint2.equals(pointA, pointB)', eqPoint2.equals(pointA, pointA)); // true
console.log('eqPoint2.equals(pointA, pointC)', eqPoint2.equals(pointA, pointA)); // false

interface Vector {
  from: Point;
  to: Point;
}

const eqVector: Eq<Vector> = getStructEq({
  from: eqPoint2,
  to: eqPoint2,
});

// @note: A and B are equivalent
const vectorAA: Vector = { from: pointA, to: pointA };
const vectorBB: Vector = { from: pointB, to: pointB };
const vectorAB: Vector = { from: pointA, to: pointB };
const vectorBA: Vector = { from: pointB, to: pointA };
const vectorAC: Vector = { from: pointA, to: pointC };

console.log('eqVector.equals(vectorAA, vectorBB)', eqVector.equals(vectorAA, vectorBB)); // true
console.log('eqVector.equals(vectorAA, vectorAB)', eqVector.equals(vectorAA, vectorAB)); // true
console.log('eqVector.equals(vectorAB, vectorBA)', eqVector.equals(vectorAB, vectorBA)); // true
console.log('eqVector.equals(vectorAB, vectorAC)', eqVector.equals(vectorAB, vectorAC)); // false

// ######################
// ####### getEq ########
// ######################

/**
 * `getEq` is a "combinator" we can use to derive
 * Eq instances from arrays
 */

import { getEq } from 'fp-ts/lib/Array';
const eqArrayOfPoints: Eq<Point[]> = getEq(eqPoint2);

// @note: A and B are equivalent
const arrayOfPointsAAA: Point[] = [pointA, pointA, pointA];
const arrayOfPointsAA: Point[] = [pointA, pointA];
const arrayOfPointsBB: Point[] = [pointB, pointB];
const arrayOfPointsAB: Point[] = [pointA, pointB];
const arrayOfPointsBA: Point[] = [pointB, pointA];
const arrayOfPointsAC: Point[] = [pointA, pointC];

console.log(
  'eqArrayOfPoints.equals(arrayOfPointsAAA, arrayOfPointsAA)',
  eqArrayOfPoints.equals(arrayOfPointsAAA, arrayOfPointsAA),
); // false
console.log(
  'eqArrayOfPoints.equals(arrayOfPointsAA, arrayOfPointsAA)',
  eqArrayOfPoints.equals(arrayOfPointsAA, arrayOfPointsAA),
); // true
console.log(
  'eqArrayOfPoints.equals(arrayOfPointsBB, arrayOfPointsAA)',
  eqArrayOfPoints.equals(arrayOfPointsBB, arrayOfPointsAA),
); // true
console.log(
  'eqArrayOfPoints.equals(arrayOfPointsAB, arrayOfPointsAA)',
  eqArrayOfPoints.equals(arrayOfPointsAB, arrayOfPointsAA),
); // true
console.log(
  'eqArrayOfPoints.equals(arrayOfPointsAC, arrayOfPointsAA)',
  eqArrayOfPoints.equals(arrayOfPointsAC, arrayOfPointsAA),
); // false

// ######################
// ##### contramap ######
// ######################
// maps via a function and pipes into an "Eq" instance's "equals" (when taken from Eq) function

import { contramap } from 'fp-ts/lib/Eq';

interface User {
  userId: number;
  name: string;
}

/**
 * Two users are equal if their `userId` field is equal
 */
const eqUser = contramap((user: User) => user.userId)(eqNumber);

console.log(
  "eqUser.equals({ userId: 1, name: 'Giulio' }, { userId: 1, name: 'Giulio Canti' })",
  eqUser.equals({ userId: 1, name: 'Giulio' }, { userId: 1, name: 'Giulio Canti' }),
); // true
console.log(
  "eqUser.equals({ userId: 1, name: 'Giulio' }, { userId: 2, name: 'Giulio' })",
  eqUser.equals({ userId: 1, name: 'Giulio' }, { userId: 2, name: 'Giulio' }),
); // false
