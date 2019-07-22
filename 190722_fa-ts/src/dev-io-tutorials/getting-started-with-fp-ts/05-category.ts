// @see https://dev.to/gcanti/getting-started-with-fp-ts-category-4c9a

// ----------------------------
// ------- Introduction -------
// ----------------------------

/**
 * "The cornerstone of functional programming is composition"
 *
 * "Categories capture the essence of composition"
 *
 * A `Category` is a pair `(Objects, Morphisms)` where
 *  - `Objects` is a collection of **objects**
 *  - `Morphisms` is a collection of **morphisms** (or arrows) between objects
 *
 * @note:
 *  the term "object" here has nothing to do with OOP, you can think of
 *  objects as black boxes that you can't inspect, or even as some
 *  kind of ancillary placeholder for morphisms
 *
 */

/**
 * ? Part 1: definition
 *
 * Each morphism `f` has a source object `A` and a target object `B`
 * where `A` and `B` are `Objects`
 *
 * We write `f: A |-> B`, and say "f is a morphism from A to B"
 */

/**
 * ? Part 2: composition
 *
 * There's an operation '∘' named "composition" such that the following properties hold
 * - **composition of morphisms**:
 *    whenever `f: A |-> B` and `g: B |-> C` are two morphisms in `Morphisms`, then
 *    there must exist a third morphism `g ∘ f: A | -> C` in `Morphisms` which is
 *    the composition of `f` and `g`
 *
 * - **associativity**
 *    if `f: A |-> B`, `g: B |-> C`, and `h: C |-> D` then `h ∘ (g ∘ f) = (h ∘ g) ∘ f`
 *
 * - **identity**
 *    for every object x, there exists a morphism `identity: X | -> X` called the
 *    _identity morphism_ for X, such that for every morphism `f: A |-> X` and every
 *    morphism `g: X |-> B`, we have `identity ∘ f = f` and ` g ∘ identity = g`
 */

// ---------------------------------------------------
// ------- Categories as Programming Languages -------
// ---------------------------------------------------

/**
 * A category can be interpreted as a simplified model of
 * a **typed programming language** where
 *  - objects are `types`
 *  - morphisms are `functions`
 *  - ∘ is the usual `functional composition`
 */

/**
 * For example, for a programming language with
 *  Objects:
 *    - A = string
 *    - B = number
 *    - C = boolean
 *  Morphisms:
 *    - f = string => number
 *    - g = number => boolean
 *    - g ∘ f = string => boolean
 *
 * Implementation could be something like:
 */

function f(s: string): number {
  return s.length;
}

function g(n: number): boolean {
  return n > 2;
}

function h(s: string): boolean {
  return g(f(s));
}

// ------------------------------------------
// ------- A Category for TypeScript --------
// ------------------------------------------

/**
 * We can define a category named TS as a model for the TypeScript language where
 *
 * `Objects`:
 *  - string,
 *  - number,
 *  - string[]
 *  - ...
 * `Morphisms`:
 *  - (a: A) => B,
 *  - (b: B) => C,
 *  - ...
 * `Identity morphisms` are all encoded as single polymorphic function
 *  - const identity = (a: A) => A
 * `Composition of morphisms` is usual function composition (which is associative)
 *
 * This is limited (such as no loops) but rich enough to reason about composition
 */

// -----------------------------------------------------
// ------- The central problem with composition --------
// -----------------------------------------------------

/**
 * In TS we can compose two generic functions `f: (a: A) => B`
 * and `g: (c: C) => D` as long as `B = C`
 */

function compose<A, B, C>(g: (b: B) => C, f: (a: A) => B): (a: A) => C {
  return a => g(f(a));
}

/**
 * But what if `B != C`? How can we _compose_ such functions? Should we just give up?
 *
 * See 06-functors to see conditions under which composition is possible
 */
