// @see https://dev.to/gcanti/getting-started-with-fp-ts-monoid-ja0

// ----------------------------
// ------- Introduction -------
// ----------------------------

/**
 * A `Monoid` is amy `Semigroup` that happens to hae a
 * special value which is "neutral" with respect to `concat`
 *
 */

// -------------------------
// ------ Type Class -------
// -------------------------

/**
 * The following laws must hold for a `Monoid`
 *
 * **Right Identity**: `concat(x, empty) = x`, `for all x in A`
 * **Left identity**: `concat(empty, x) = x`, `for all x in A`
 *
 * Whichever side of concat we put the value `empty`,
 * it must make no difference to the value
 */

import { Semigroup } from 'fp-ts/lib/Semigroup';

interface Monoid<A> extends Semigroup<A> {
  readonly empty: A;
}

// -------------------------
// ------- Instances -------
// -------------------------

// most semigroups in 03-Semigroups are actually Monoids

/**
 * @description
 * Number `Monoid` under addition
 */
const monoidSum: Monoid<number> = {
  concat: (x, y) => x + y,
  empty: 0,
};

/**
 * @description
 * Number `Monoid` under multiplication
 */
const monoidProduct: Monoid<number> = {
  concat: (x, y) => x * y,
  empty: 1,
};

/**
 * @description
 * String `Monoid` under concatenation
 */
const monoidString: Monoid<string> = {
  concat: (x, y) => x + y,
  empty: '',
};

/**
 * @description
 * Boolean `Monoid` under conjunction
 */
const monoidEvery: Monoid<boolean> = {
  concat: (x, y) => x && y,
  empty: true,
};

/**
 * @description
 * Boolean `Monoid` under disjunction
 */
const monoidSome: Monoid<boolean> = {
  concat: (x, y) => x || y,
  empty: false,
};

// you may wonder if all semigroups are also monoids - that's not the case,
// as a counterexample consider the following semigroup

/**
 * @description
 * Semigroup that isn't a `Monoid`
 * There is no `empty` such that `concat(x, empty) = x`
 */
const semigroupSpace: Semigroup<string> = {
  concat: (x, y) => 'x' + ' ' + y,
};

// ---------------------------------
// ------- Complex Instances -------
// ---------------------------------

interface Point {
  x: number;
  y: number;
}

interface Vector {
  from: Point;
  to: Point;
}

import { getStructMonoid, monoidAny } from 'fp-ts/lib/Monoid';

/**
 * @description
 * Point `Monoid` under summation of its "x" and "y" number properties
 *
 * empty becomes Point = { x: 0, y: 0 }
 */
const monoidPoint: Monoid<Point> = getStructMonoid({
  x: monoidSum,
  y: monoidSum,
});

console.log('monoidPoint.empty', monoidPoint.empty); // { x: 0, y: 0 }

/**
 * @description
 * Vector `Monoid` under summation of its "from" and "to" Point properties
 *
 * Empty becomes Vector = { from: { x: 0, y: 0 }, to: { x: 0, y: 0 } }
 */
const monoidVector: Monoid<Vector> = getStructMonoid({
  from: monoidPoint,
  to: monoidPoint,
});

console.log('monoidVector.empty', monoidVector.empty); // { from: { x: 0, y: 0 }, to: { x: 0, y: 0 } }

// ---------------------------
// --------- Folding ---------
// ---------------------------
import { fold } from 'fp-ts/lib/Monoid';

console.log('fold(monoidSum)([1, 2, 3, 4])', fold(monoidSum)([1, 2, 3, 4])); // 10
console.log('fold(monoidProduct)([1, 2, 3, 4])', fold(monoidSum)([1, 2, 3, 4])); // 24
console.log('fold(monoidString)([1, 2, 3, 4])', fold(monoidString)(['a', 'b', 'c'])); // 'abc'
console.log('fold(monoidEvery)([1, 2, 3, 4])', fold(monoidEvery)([true, false, true])); // false
console.log('fold(monoidAny)([1, 2, 3, 4])', fold(monoidAny)([true, false, true])); // true

// ----------------------------------------------------
// --------- Monoids for type constructors ---------
// ----------------------------------------------------

/**
 * We already know that given a semigroup instance for A
 * we can derive a semigroup instance for `Option<A>`
 *
 * If we can find a monoid instance for `A` then we can derive
 * a monoid instance for `Option<A>` (via `getApplyMonoid`)
 * which works like this
 *
 * | --- x --- | ---- y ---- | -- concat (x, y) -- |
 * | --------- | ----------- | ------------------- |
 * |   none    |    none     |        none         |
 * |  some(a)  |    none     |        none         |
 * |   none    |   some(b)   |        none         |
 * |  some(a)  |   some(b)   | some(concat(a, b))  |
 * | --------- | ----------- | ------------------- |
 */

import { getApplyMonoid, some, none } from 'fp-ts/lib/Option';

const M1applyMonoid = getApplyMonoid(monoidSum);

console.log('---------------------------');
console.log('---- applyMonoid (sum) ----');
console.log('---------------------------');
console.log('M1applyMonoid.concat(some(1), none)', M1applyMonoid.concat(some(1), none)); // { _tag: 'None' }
console.log('M1applyMonoid.concat(some(1), some(2))', M1applyMonoid.concat(some(1), some(2))); // { _tag: 'Some', value: 3 }
console.log('M1applyMonoid.concat(some(1), M.empty)', M1applyMonoid.concat(some(1), M1applyMonoid.empty)); // { _tag: 'Some', value: 1 }

/**
 * we can derive two other monoids for `Option<A>` (for all `A`)
 *
 * getFirstMonoid
 *
 * | --- x --- | ---- y ---- | -- concat (x, y) -- |
 * | --------- | ----------- | ------------------- |
 * |   none    |    none     |        none         |
 * |  some(a)  |    none     |      some(a)        |
 * |   none    |   some(b)   |      some(b)        |
 * |  some(a)  |   some(b)   |      some(a)        |
 * | --------- | ----------- | ------------------- |
 *
 * getLastMonoid
 *
 * | --- x --- | ---- y ---- | -- concat (x, y) -- |
 * | --------- | ----------- | ------------------- |
 * |   none    |    none     |        none         |
 * |  some(a)  |    none     |      some(a)        |
 * |   none    |   some(b)   |      some(b)        |
 * |  some(a)  |   some(b)   |      some(b)        |
 * | --------- | ----------- | ------------------- |
 */

import { getFirstMonoid } from 'fp-ts/lib/Option';

const M2firstMonoid = getFirstMonoid<number>();

console.log('---------------------------');
console.log('------- firstMonoid -------');
console.log('---------------------------');
console.log('M2firstMonoid.concat(some(1), none)', M2firstMonoid.concat(some(1), none)); // { _tag: 'Some', value: 1 }
console.log('M2firstMonoid.concat(none, some(2))', M2firstMonoid.concat(none, some(2))); // { _tag: 'Some', value: 2 }
console.log('M2firstMonoid.concat(some(1), M.empty)', M2firstMonoid.concat(some(1), some(2))); // { _tag: 'Some', value: 1 }
console.log('M2firstMonoid.concat(some(1), M2FirstMonoid.empty)', M2firstMonoid.concat(none, M2firstMonoid.empty)); // { _tag: 'None' }

import { getLastMonoid } from 'fp-ts/lib/Option';

const M3lastMonoid = getLastMonoid<number>();

console.log('---------------------------');
console.log('-------- lastMonoid -------');
console.log('---------------------------');
console.log('M3lastMonoid.concat(some(1), none)', M3lastMonoid.concat(some(1), none)); // { _tag: 'Some', value: 1 }
console.log('M3lastMonoid.concat(none, some(2))', M3lastMonoid.concat(none, some(2))); // { _tag: 'Some', value: 2 }
console.log('M3lastMonoid.concat(some(1), M.empty)', M3lastMonoid.concat(some(1), some(2))); // { _tag: 'Some', value: 2 }
console.log('M3lastMonoid.concat(some(1), M2FirstMonoid.empty)', M3lastMonoid.concat(none, M3lastMonoid.empty)); // { _tag: 'None' }

// -------------------------------------------------------------------------------------------------
// -------------------------------------------- Example --------------------------------------------
// ------------ stolen from https://dev.to/gcanti/getting-started-with-fp-ts-monoid-ja0 ------------
// -------------------------------------------------------------------------------------------------

import { Option } from 'fp-ts/lib/Option';

/**
 * VSCode settings
 */
interface Settings {
  /**
   * Controls the font family
   */
  fontFamily: Option<string>;

  /**
   * Controls the font size in pixels
   */
  fontSize: Option<number>;

  /**
   * Limit the width of the minimap to render at most a certain number of columns
   */
  maxColumn: Option<number>;
}

const monoidSettings: Monoid<Settings> = getStructMonoid({
  fontFamily: getLastMonoid<string>(),
  fontSize: getLastMonoid<number>(),
  maxColumn: getLastMonoid<number>(),
});

const workplaceSettings: Settings = {
  fontFamily: some('Courier'),
  fontSize: none,
  maxColumn: some(80),
};

const userSettings: Settings = {
  fontFamily: some('Fira Code'),
  fontSize: some(12),
  maxColumn: none,
};

/**
 * userSettings overrides workplaceSettings
 */
monoidSettings.concat(workplaceSettings, userSettings);
