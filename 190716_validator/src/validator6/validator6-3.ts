import { Either, right, left } from 'fp-ts/lib/Either';

const isString = (s: unknown): Either<string, string> => (typeof s === 'string' ? right(s) : left('must be a string'));
const minLength = (s: string, )
