// type PrependTuple<A, T extends any[]> = A extends undefined
//   ? T
//   : (((a: A, ...b: T) => void) extends (...a: infer I) => void ? I : []);

// type RemoveFirstFromTuple<T extends any[]> = T['length'] extends 0
//   ? undefined
//   : (((...b: T) => void) extends (a, ...b: infer I) => void ? I : []);

// type FirstFromTuple<T extends any[]> = T['length'] extends 0 ? undefined : T[0];

// type NumberToTuple<N extends number, L extends any[] = []> = {
//   true: L;
//   false: NumberToTuple<N, PrependTuple<1, L>>;
// }[L['length'] extends N ? 'true' : 'false'];

// type Decrease<I extends number> = RemoveFirstFromTuple<NumberToTuple<I>>['length'];
// type H = Decrease<4>;

// type Iter<N extends number, Items extends any[], L extends any[] = []> = {
//   true: L;
//   false: Iter<
//     FirstFromTuple<Items> extends undefined ? Decrease<N> : N,
//     RemoveFirstFromTuple<Items>,
//     PrependTuple<FirstFromTuple<Items>, L>
//   >;
// }[L['length'] extends N ? 'true' : 'false'];

// type FilterUndefined<T extends any[]> = Iter<T['length'], T>;
// type I = [number, string, undefined, number];
// type R = FilterUndefined<I>;
