// @see https://dev.to/gcanti/getting-started-with-fp-ts-functor-36ek

// ----------------------------
// ------- Introduction -------
// ----------------------------

/**
 * How can we compose two generic functions `f: (a: A) => B` and `g: (c: C) => D`?
 *
 * This is important because: "if categories can be used to model programming languages,
 * morphisms (i.e. functions in TS) can be used to model `programs`"
 *
 * Therefore, solving the problem also means to find `how to compose programs in a general way`
 */

// -------------------------------------
// ------- Functions as Programs -------
// -------------------------------------

/**
 * We call `pure program` a function with signature: `(a: A) => B`
 * Such a signature models a program with has no side effects, has input `A` and yields `B`
 *
 * We call an `effectful program` a function with signature `(a: A) => F<B>`
 * This program has an `effect` `F`, where `F` is some type constructor
 *
 * (recall `type constructor` is an `n`-ary type operator taking as argument
 * zero or more types, and returning another type)
 */

// -----------------------
// ------- Example -------
// -----------------------

/**
 * Given the concrete type `string`, the `Array` type constructor returns concrete type `Array<string>`
 *
 * Here we are interested in `n-ary` type constructors with n >= 1, for example
 *
 * | --- type constructor --- | --- Effect (interpretation) --- |
 * | ------------------------ | ------------------------------- |
 * |        Array<A>          | a non deterministic computation |
 * |        Option<A>         | a computation that may fail     |
 * |        Task<A>           | an asynchronous computation     |
 */

/**
 * How can we compose two generic functions `f: (a: A) => B` and `g: (c: C) => D`?
 *
 * We need constraints on B and C
 *
 * We know if `B = C` then the solution is the usual function composition
 *
 * ```ts
 *  function compose<A, B, C>(g: (b: B) => C, f: (a: A) => B): (a: A) => C {
 *    return a => g(f(a));
 *  }
 * ```
 *
 * What about the other cases?
 */

// --------------------------------------------------------------------
// ------- In which the constraint `B = F<C>` leads to functors -------
// --------------------------------------------------------------------

/**
 * Consider
 *  - `f: (a: A) => F<B>` (effectful program)
 *  - `g: (b: B) => C` (pure program)
 *
 * to compose f with g, find a way to **lift** g from a function `(b: B) => C`
 * to a function `(fb: F<B>) => F<C>` so we can use the usual function
 * composition (the output type `f` would be the same as the input type
 * of the lifted function)
 *
 * So we turned the original problem into another: can we find such a `lift` function?
 */

// ------------------------
// ------- examples -------
// ------------------------

/**
 * **Example** `F = Array`
 *
 * `g` operates on `B`, and `f` returns `B[]`, so our `lift` function
 * can just map each element of `B[]` (i.e. `B`) directly to `g` (i.e. B[].map(B => g(B)))
 *
 * i.e. `fg: (fb: B[]) => C[]`
 */

function lift1<B, C>(g: (b: B) => C): (fb: B[]) => C[] {
  return fb => fb.map(g);
}

/**
 * **Example** `F = Option`
 *
 * `Option<B> = none | some<B>`
 * Therefore, we need a function `fg: (fb: none | some<B>) => none | some<C>`
 */

import { Option, some, none, option } from 'fp-ts/lib/Option';

function lift2<B, C>(g: (b: B) => C): (fb: Option<B>) => Option<C> {
  return fb => (fb._tag === 'None' ? none : some(g(fb.value)));
}

/**
 * **Example** `F = Task`
 *
 * `Task<B> = Promise<B>`
 * `fg: (fb: Promise<B>) => Promise<C>`
 */

import { Task } from 'fp-ts/lib/Task';

function lift<B, C>(g: (b: B) => C): (fb: Task<B>) => Task<C> {
  return fb => () => fb().then(b => g(b));
}

// ------------------------
// ------- Functors -------
// ------------------------

/**
 * The lift functions have similar shapes - this is not a coincidence
 *
 * Functors are **mappings between categories** that preserve categorical structure
 * i.e. preserve identity morphisms and composition
 *
 * Since categories are constituted of two things (object and morphisms)
 * a functor is constituted of two things as well:
 *  - a **mapping between objects** that associates to each object `X` in `C` an object `D`
 *  - a **mapping between morphisms** that associates to each morphism in `C` a morphism `D`
 *
 * Where `C` and `D` are two categories (aka two programming languages)
 *
 * Even if a mapping between two different programming languages is an intriguing idea,
 * we are more interested in a mapping where `C` and `D` coincide (with TS)
 * In this case we talk about **endofunctors** ("endo" means "within", "inside")
 *
 * From now on, "functor" refers to "endofunctor"
 */

// --------------------------
// ------- Definition -------
// --------------------------

/**
 * A **functor** is a pair `(F, lift)` where
 *  - `F` is an `n`-ary type constructor (`n >= 1`) which maps each type `X` to the type `F<X>` (**mapping between objects**)
 *  - `lift` is a function with the following signature `lift: <A, B>(f: (a: A) => B) => ((fa: F<A>) => F<B>)`
 *    which maps each function `f: (a: A) => B` to a function `lift(f): (fa: F<A>) => F<B>` (**mapping between morphisms**)
 *
 * The following properties must hold
 *  - `lift(identity<X>) = identity<F<X>>` **identities map to identities**
 *  - `lift(g ∘ f) = lift(g) ∘ lift(f)` **mapping a composition is the composition of the mappings**
 *
 * The `lift` function is also known through a variant called `map`, which is basically `lift` with the arguments rearranged
 * ```ts
 * const lift: <A, B>(f: (a: A) => B) => ((fa: F<A>) => F<B>)
 * const map: <A, B>(fa: F<A>, f: (a: A) => B) => F<B>
 * ```
 *
 * Note that `map` can be derived from `lift` (and viceversa)
 */

// ---------------------------------
// ------- Functors in fp-ts -------
// ---------------------------------

/**
 * How can we define a functor instance in `fp-ts`? Practical example:
 */

/**
 * The following declaration defines a model for the response of an API call
 *
 * note the `body` field is parameterized, making `Response` a good candidate
 * for a functor instance, since `Response` is a `n`-ary type constructors with `n >= 1`
 * (a necessary precondition)
 *
 * ```ts
 *  interface Response<A> {
 *    url: string
 *    status: number
 *    headers: Record<string, string>
 *    body: A
 *  }
 * ```
 */

/**
 * In order to define a functor instance for the `Resposne`, define a `map`
 * function (along with some [technicalities](https://gcanti.github.io/fp-ts/recipes/HKT.html) required by `fp-ts`)
 */

// `Response.ts` module
import { Functor1 } from 'fp-ts/lib/Functor';
export const URI = 'Response';
export type URI = typeof URI;

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    Response: Response<A>;
  }
}

export interface Response<A> {
  url: string;
  status: number;
  headers: Record<string, string>;
  body: A;
}

function mapResponseBody<A, B>(fa: Response<A>, f: (a: A) => B): Response<B> {
  return { ...fa, body: f(fa.body) };
}

// functor instance for `Response`
export const functorResponse: Functor1<URI> = {
  URI,
  map: mapResponseBody,
};

// ----------------------------------------------
// ------- Is the general problem solved? -------
// ----------------------------------------------

/**
 * No
 *
 * Functors allow us to compose an effectful program `f`
 * with a pure program `g`, but `g` must be **unary**,
 * that is it must accept only one argument as input.
 * What if `g` accepts two arguments, or three?
 *
 * |   Program f   |     Program g           |   Composition    |
 * |  -----------  |  ---------------        |  --------------  |
 * |    pure       |      pure               |       g ∘ f      |
 * |    effectful  |    pure (unary)         |    lift(g) ∘ f   |
 * |    effectful  |    pure (n-ary, n > 1)  |         ?        |
 */
