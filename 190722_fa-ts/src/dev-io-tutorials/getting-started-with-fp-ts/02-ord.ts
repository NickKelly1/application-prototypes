//@see https://dev.to/gcanti/getting-started-with-fp-ts-ord-5f1e

import { Eq } from 'fp-ts/lib/Eq';

// -----------------------------
// ---- the Ord type class: ----
// -----------------------------

type Ordering = -1 | 0 | 1;

/**
 * Type `A` belongs to type class `Ord` if there is a function
 * named `compare` (and one named `equals`) of the appropriate
 * type, defined on it
 */
interface Ord<A> extends Eq<A> {
  readonly compare: (x: A, y: A) => Ordering;
}

/**
 * Instances of `Ord` must satisfy the following laws:
 * **Reflexivity**: compare(x, x) <= 0, for all x in A
 * **Antisymmetry**: if compare(x, y) <= 0 and compare(y, x) <= 0,
 *  then x is equal to y, for all x, y in A
 * **Transitivity**: if compare(x, y) <= 0 and compare(y, z) <= 0
 *  then compare(x, z) <= 0, for all x, y, z in A
 *
 * Additionally, `compare` must comply with **Setoid's equals**:
 * (compare(x, y) === 0) === (equals(x, y) === true) for all x, y, in A
 *
 * @note: a lawful `equals` can be derived from `compare` via:
 *  - equals: (x, y) => compare(x, y) === 0
 */

// ---------------------------
// ---- ordering numbers: ----
// ---------------------------

/**
 * Numeric ordering:
 *
 * (x < y) === (compare(x, y) === -1)
 * (x === y) === (compare(x, y) === 0)
 * (x > y) === (compare(x, y) === 1)
 */

const ordNumber: Ord<number> = {
  equals: (x, y) => x === y,
  compare: (x, y) => (x < y ? -1 : x > y ? 1 : 0),
};

// --------------------------------
// -- getting min from an order: --
// --------------------------------

/**
 * @description
 * Get the minimum of two instances of a type class with ordering
 *
 * @param O
 */
function min<A>(O: Ord<A>): (x: A, y: A) => A {
  return (x, y) => (O.compare(x, y) === 1 ? y : x);
}

console.log('min(ordNumber)(2, 1)', min(ordNumber)(2, 1)); // 1

/**
 * More complex type ordering
 */

interface User {
  name: string;
  age: number;
}

// ---------------------------
// - ordering complex types: -
// ---------------------------

// order user by age:
const byAge1: Ord<User> = {
  equals: (x, y) => x.age === y.age,
  compare: (x, y) => (x.age < y.age ? -1 : x.age > y.age ? 1 : 0),
};

const oldUser: User = { name: 'John', age: 80 };
const youngUser: User = { name: 'Bill', age: 20 };

console.log('min(byAge1)(oldUser, youngUser)', min(byAge1)(oldUser, youngUser)); // { name: 'Bill', age: 20 }

// ######################
// ##### contramap ######
// ######################
/**
 * Avoiding some boilerplate by using the `contramap` combinator
 * @note: contramaps map via a function and pipe the result into the "compare"
 * of an "Ord" instance (when taken from Ord)
 */
import { contramap } from 'fp-ts/lib/Ord';
const byAge2 = contramap((user: User) => user.age)(ordNumber);

console.log('min(byAge2)(oldUser, youngUser)', min(byAge2)(oldUser, youngUser)); // { name: 'Bill', age: 20 }
