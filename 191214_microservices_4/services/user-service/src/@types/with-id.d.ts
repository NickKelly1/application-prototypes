export type WithId<T, I = string> = T & { readonly id: I; };
export type ModelWithId<A, I = string> = { attr: A, readonly id: I; }
