import { Either } from 'fp-ts/lib/Either';

type Rule<O, E, T, U = T> = (options?: O, errors?: E) => (p: U) => Either<string, T>;
