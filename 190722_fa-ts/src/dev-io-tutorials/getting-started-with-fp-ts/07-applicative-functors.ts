// @see https://dev.to/gcanti/getting-started-with-fp-ts-applicative-1kb3

// ----------------------------
// ------- Introduction -------
// ----------------------------

/**
 * `f: (a: A) => F<B>`
 * `g: (b: B) => C`
 *
 * |   program f   |  program g   |   composition   |
 * |     ---       |     ---      |      ---        |
 * |    pure       |     pure     |       ∘         |
 * |  effectful    | pure(unary)  |  lift(g) ∘ f    |
 */
