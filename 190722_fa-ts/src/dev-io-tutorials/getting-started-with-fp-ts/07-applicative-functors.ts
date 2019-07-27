// @see https://dev.to/gcanti/getting-started-with-fp-ts-applicative-1kb3

// ----------------------------
// ------- Introduction -------
// ----------------------------

/**
 * Previously
 *
 *  - Compose effectful program "f"
 *    `f: (a: A) => F<B>`
 *  - with program "g"
 *    `g: (b: B) => C`
 *  - by lifting "g" into a function
 *    `lift(g): (fb: F<B>) => F<C>`
 *  - provided that "F" admins a functor instance
 *
 *    |   program f   |  program g   |   composition   |
 *    |     ---       |     ---      |      ---        |
 *    |    pure       |     pure     |       ∘         |
 *    |  effectful    | pure(unary)  |  lift(g) ∘ f    |
 *
 * However, `g` must be unary (only accepting 1 argument as input)
 *
 * Q:
 *  What if `g` accepts two arguments? Can we still lift`g`
 *  by using only the functor instance?
 */

// ------------------------
// ------- Currying -------
// ------------------------

/**
 * ```ts
 * g: (args: [B, C]) => D
 * ```
 *
 *  "
 *  Currying is the technique of translating the evaluation
 *  of a function that takes multiple arguments into evaluating
 *  a sequence of functions, each with a single argument.
 *  For example, a function that takes two arguments,
 *  one from `B` and one from `C`, and produces outputs in `D`,
 *  by currying its translate into a function that takes a single
 *  argument from `C` and produces as outputs functions from
 *  `B` to `C`
 *  "
 *
 * So we can rewrite `g` to
 * ```ts
 * g: (b: B) => (c: C) => D
 * ```
 *
 * We need a new lifting operation for it, looking like:
 * ```ts
 * liftA2(g): (fb: F<B>) => (fc: F<C>) => F<D>
 * ```
 *
 * Since `g` is now unary, we could use the functor instance of the old lift
 * ```ts
 * lift(g): (fb: F<B>) => F<(c: C) => D>
 * ```
 */

// ---------------------
// ------- Apply -------
// ---------------------

/**
 * Let's introduce a new abstraction, `Apply` that owns such
 * an unpacking operation (named ap)
 *
 * ```ts
 * interface Apply<F> extends Functor<F> {
 *  ap: <C, D>(fcd: HKT<F, (c: C) => D>, fc: HKT<F, C>) => HKT<F, D>
 * }
 * ```
 */
