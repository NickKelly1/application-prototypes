import { Either } from 'fp-ts/lib/Either';

type Rule<O, E, T, U = T> = (options?: O, errors?: E) => (p: U) => Either<string, T>;

type ControllerResponse = Either<
  { status: number; errors: Record<string, string[]> },
  { status: number; response: Record<string, any> }
>;

type Controller = Record<string, () => Promise<ControllerResponse>>;
